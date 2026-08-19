import { NextRequest, NextResponse } from 'next/server'
import { DATE_RE, EMAIL_RE } from '@/lib/validate'
import { stripe, DEPOSIT_FRACTION, toCents } from '@/lib/stripe'
import { verifyAvailability } from '@/lib/smoobu'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sendCheckoutStartedNotification } from '@/lib/notify'
import { computeExpectedPrice } from '@/lib/pricing'
import { verifyTurnstile } from '@/lib/turnstile'
import { bookingWindowEnd } from '@/lib/booking-window'
import {
  GROUP_MAX_GUESTS,
  distributeGuests,
  isGroupApartmentId,
} from '@/lib/group-booking'
import { PROPERTY_CONFIGS, resolveSmoobuId } from '@/config/properties.config'

/**
 * POST /api/stripe/group-payment-intent
 *
 * Gruppenbuchung Haus Schönblick: EIN PaymentIntent für mehrere Apartments.
 * Der Webhook legt daraus je Apartment eine Smoobu-Reservierung an (Smoobu
 * synchronisiert als Channel-Manager Airbnb/Booking automatisch).
 *
 * Metadata-Format (group_* kennzeichnet Gruppen-PIs für den Webhook):
 *   group: "1"
 *   group_apartments: JSON [{id, smoobuId, guests, total}]  (je gewähltes Apartment)
 */
export interface CreateGroupPaymentIntentRequest {
  apartmentIds: string[]        // Config-IDs, z. B. ["b5","b7"]
  checkIn: string
  checkOut: string
  guests: number
  firstName: string
  lastName: string
  email: string
  phone: string
  message?: string
  totalPrice: number            // Gesamtsumme aller Apartments in EUR
  paymentOption?: '50' | '100'
  turnstileToken?: string
  locale?: string
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = rateLimit(`group-payment-intent:${ip}`, 10, 10 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte warte kurz und versuche es erneut.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  let body: Partial<CreateGroupPaymentIntentRequest>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { apartmentIds, checkIn, checkOut, guests, firstName, lastName,
          email, phone, message, totalPrice, paymentOption = '50', turnstileToken } = body
  const locale = body.locale === 'en' ? 'en' : 'de'

  if (!Array.isArray(apartmentIds) || apartmentIds.length < 2 || !checkIn || !checkOut ||
      !guests || !firstName || !lastName || !email || !phone || !totalPrice) {
    return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 422 })
  }

  // ── Bot-Check ──
  if (!(await verifyTurnstile(turnstileToken ?? ''))) {
    return NextResponse.json(
      { error: 'Bot-Schutz fehlgeschlagen. Bitte lade die Seite neu und versuche es erneut.' },
      { status: 403 },
    )
  }

  // ── Struktur- und Datumsvalidierung (wie Einzelbuchung) ──
  if (!DATE_RE.test(checkIn) || !DATE_RE.test(checkOut) ||
      isNaN(Date.parse(checkIn)) || isNaN(Date.parse(checkOut))) {
    return NextResponse.json({ error: 'Ungültiges Datum' }, { status: 422 })
  }
  if (checkIn >= checkOut) {
    return NextResponse.json({ error: 'Abreise muss nach Anreise liegen' }, { status: 422 })
  }
  const todayBerlin = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date())
  if (checkIn < todayBerlin) {
    return NextResponse.json({ error: 'Anreisedatum liegt in der Vergangenheit' }, { status: 422 })
  }
  if (checkOut > bookingWindowEnd(todayBerlin)) {
    return NextResponse.json(
      { error: 'Buchungen sind maximal 12 Monate im Voraus möglich. Bitte wähle einen früheren Zeitraum.' },
      { status: 422 },
    )
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 422 })
  }

  // ── Apartments prüfen: nur Schönblick, keine Duplikate ──
  const ids = [...new Set(apartmentIds)].sort()
  if (ids.length !== apartmentIds.length || !ids.every(isGroupApartmentId)) {
    return NextResponse.json({ error: 'Ungültige Apartment-Auswahl' }, { status: 422 })
  }
  if (guests < 1 || guests > GROUP_MAX_GUESTS) {
    return NextResponse.json({ error: 'Ungültige Gästeanzahl' }, { status: 422 })
  }
  const guestsByApartment = distributeGuests(ids, guests)
  if (!guestsByApartment) {
    return NextResponse.json(
      { error: 'Die gewählten Apartments bieten nicht genug Platz für die Gruppe.' },
      { status: 422 },
    )
  }

  // ── Serverseitige Preisprüfung je Apartment (nie dem Client vertrauen) ──
  const perApartment: Array<{
    id: string
    smoobuId: string
    guests: number
    expectedTotal: number
    minAcceptable: number
    usedDynamicRates: boolean
  }> = []
  let expectedSum = 0
  let minAcceptableSum = 0
  let nightsChecked = 0

  for (const id of ids) {
    const cfg = PROPERTY_CONFIGS[id]
    const smoobuId = resolveSmoobuId(cfg)
    const check = await computeExpectedPrice(cfg, smoobuId, checkIn, checkOut, guestsByApartment[id])
    if (check.nights < check.minStayRequired) {
      return NextResponse.json(
        { error: `Der Mindestaufenthalt für diesen Zeitraum beträgt ${check.minStayRequired} Nächte.` },
        { status: 422 },
      )
    }
    nightsChecked = check.nights
    expectedSum += check.expectedTotal
    minAcceptableSum += check.minAcceptable
    perApartment.push({
      id,
      smoobuId,
      guests: guestsByApartment[id],
      expectedTotal: check.expectedTotal,
      minAcceptable: check.minAcceptable,
      usedDynamicRates: check.usedDynamicRates,
    })
  }

  if (totalPrice < minAcceptableSum) {
    console.warn(
      `[group-payment-intent] Preismanipulation abgelehnt: client=${totalPrice} < min=${minAcceptableSum} ` +
      `(erwartet=${expectedSum}) für [${ids.join(',')}] ${checkIn}–${checkOut} guests=${guests}`,
    )
    return NextResponse.json(
      { error: 'Preis konnte nicht verifiziert werden. Bitte lade die Seite neu und versuche es erneut.' },
      { status: 422 },
    )
  }

  // ── Verfügbarkeit ALLER Apartments prüfen, bevor Geld fließt ──
  for (const apt of perApartment) {
    try {
      const blocked = await verifyAvailability(apt.smoobuId, checkIn, checkOut)
      if (blocked) {
        return NextResponse.json(
          {
            error: `${PROPERTY_CONFIGS[apt.id].name} ist im gewählten Zeitraum nicht mehr verfügbar (${blocked} belegt). Bitte wähle eine andere Kombination.`,
            conflictApartment: apt.id,
            conflictDate: blocked,
          },
          { status: 409 },
        )
      }
    } catch {
      // Prüfung nicht möglich → weiter; der Webhook prüft vor dem Anlegen erneut.
    }
  }

  // Nur mit durchgängig dynamischen Raten darf der Serverpreis den Client-
  // Preis übersteuern (gleiches Prinzip wie Einzelbuchung).
  const allDynamic = perApartment.every((a) => a.usedDynamicRates)
  const serverTotal = allDynamic ? Math.max(totalPrice, expectedSum) : totalPrice
  const fraction = paymentOption === '100' ? 1 : DEPOSIT_FRACTION
  const depositEur = Math.round(serverTotal * fraction)

  const apartmentNames = ids.map((id) => PROPERTY_CONFIGS[id].name.replace('Apartment ', '')).join(', ')
  const propertyName = `Haus Schönblick – Gruppenbuchung (${apartmentNames})`

  // Anteiliger Preis je Apartment für die Smoobu-Buchungen: erwartete Anteile,
  // skaliert auf den tatsächlich belasteten Gesamtpreis (Rundung auf das
  // letzte Apartment, damit die Summe exakt stimmt).
  const scale = expectedSum > 0 ? serverTotal / expectedSum : 1
  let allocated = 0
  const groupApartments = perApartment.map((apt, i) => {
    const isLast = i === perApartment.length - 1
    const total = isLast
      ? Math.round(serverTotal - allocated)
      : Math.round(apt.expectedTotal * scale)
    allocated += total
    return { id: apt.id, smoobuId: apt.smoobuId, guests: apt.guests, total }
  })

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: toCents(depositEur),
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `${paymentOption === '100' ? '100% Vollzahlung' : '50% Anzahlung'} – ${propertyName} · ${checkIn} bis ${checkOut}`,
      metadata: {
        group: '1',
        group_apartments: JSON.stringify(groupApartments),
        propertyName,
        checkIn,
        checkOut,
        guests: String(guests),
        firstName,
        lastName,
        email,
        phone,
        message: message ?? '',
        totalPrice: String(serverTotal),
        depositAmount: String(depositEur),
        paymentOption,
        locale,
      },
    })

    await sendCheckoutStartedNotification({
      propertyName,
      apartmentId: groupApartments.map((a) => a.smoobuId).join(','),
      checkIn,
      checkOut,
      nights: nightsChecked,
      guests,
      totalPrice: serverTotal,
      depositAmount: depositEur,
      paymentOption,
      firstName,
      lastName,
      email,
      phone,
      message,
      paymentIntentId: paymentIntent.id,
      clientIp: ip,
      userAgent: request.headers.get('user-agent') ?? undefined,
    }).catch((err) => console.error('[group-payment-intent] Checkout-Mail Fehler:', err))

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret ?? '',
      depositAmount: depositEur,
      totalAmount: serverTotal,
      paymentIntentId: paymentIntent.id,
    })
  } catch (err) {
    console.error('[group-payment-intent]', err instanceof Error ? err.message : err)
    return NextResponse.json(
      { error: 'Die Zahlung konnte nicht initialisiert werden. Bitte versuche es später erneut.' },
      { status: 500 },
    )
  }
}
