import { NextRequest, NextResponse } from 'next/server'
import { stripe, toCents } from '@/lib/stripe'
import { createBooking, verifyAvailability } from '@/lib/smoobu'
import { sendBookingNotification, sendGuestConfirmationEmail, toMailLocale } from '@/lib/notify'

/**
 * Stripe webhook – backup handler.
 * If the client fails to call /api/smoobu/booking after payment,
 * this webhook creates the Smoobu booking automatically.
 *
 * Setup in Stripe Dashboard:
 *   URL: https://www.sarfi-collection.de/api/stripe/webhook
 *   Events: payment_intent.succeeded
 *   → Copy the Webhook Signing Secret → add as STRIPE_WEBHOOK_SECRET in Vercel
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig  = request.headers.get('stripe-signature') ?? ''
  const secret = process.env.STRIPE_WEBHOOK_SECRET ?? ''

  // Refuse to process if webhook secret is not configured
  if (!secret || secret === 'whsec_PLACEHOLDER') {
    console.error('[webhook] STRIPE_WEBHOOK_SECRET not configured – rejecting request')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Webhook signature error'
    console.error('[webhook] signature verification failed:', msg)
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object
    const m  = pi.metadata

    // ── Gruppenbuchung (mehrere Apartments, ein PaymentIntent) ──
    if (m.group === '1') {
      return handleGroupBooking(pi.id, m)
    }

    // Only create booking if not already created by client
    if (m.smoobu_booking_id) {
      console.log(`[webhook] Booking already exists for PI ${pi.id}`)
      return NextResponse.json({ received: true })
    }

    // Buchungssprache des Gasts (aus payment-intent-Metadata; Alt-Buchungen: de)
    const guestLocale = toMailLocale(m.locale)

    try {
      const result = await createBooking({
        apartmentId: m.apartmentId,
        checkIn:     m.checkIn,
        checkOut:    m.checkOut,
        guests:      parseInt(m.guests, 10),
        firstName:   m.firstName,
        lastName:    m.lastName,
        email:       m.email,
        phone:       m.phone,
        message:     m.message,
        totalPrice:  parseFloat(m.totalPrice),
        depositAmount: m.depositAmount ? parseFloat(m.depositAmount) : undefined,
        language:    guestLocale,
      })

      // Tag the payment intent with the booking ID
      await stripe.paymentIntents.update(pi.id, {
        metadata: { ...m, smoobu_booking_id: String(result.id) },
      })

      console.log(`[webhook] Created Smoobu booking #${result.id} for PI ${pi.id}`)

      // Stripe Payment Link für Restbetrag erstellen (nur bei 50%-Anzahlung)
      let remainingPaymentUrl: string | undefined
      const totalPrice    = parseFloat(m.totalPrice)
      const depositAmount = parseFloat(m.depositAmount)
      const remaining     = Math.round(totalPrice - depositAmount)
      if (m.paymentOption !== "100" && remaining > 0) {
        try {
          const price = await stripe.prices.create({
            currency: 'eur',
            unit_amount: toCents(remaining),
            product_data: {
              // Erscheint auf der Stripe-Bezahlseite des Gasts → Buchungssprache
              name: guestLocale === 'en'
                ? `Remaining balance – ${m.propertyName} · ${m.checkIn} to ${m.checkOut}`
                : `Restbetrag – ${m.propertyName} · ${m.checkIn} bis ${m.checkOut}`,
            },
          })
          const paymentLink = await stripe.paymentLinks.create({
            line_items: [{ price: price.id, quantity: 1 }],
            metadata: {
              type: 'restbetrag',
              propertyName: m.propertyName,
              smoobu_booking_id: String(result.id),
              original_payment_intent: pi.id,
              locale: guestLocale,
            },
          })
          remainingPaymentUrl = paymentLink.url
          console.log(`[webhook] Restbetrag-Link erstellt: ${remainingPaymentUrl}`)
        } catch (linkErr) {
          console.error('[webhook] Fehler beim Erstellen des Restbetrag-Links:', linkErr)
        }
      }

      // Benachrichtigung nach erfolgreicher Zahlung + Buchungserstellung
      const nights = Math.round(
        (new Date(m.checkOut).getTime() - new Date(m.checkIn).getTime()) / (1000 * 60 * 60 * 24)
      )
      await Promise.allSettled([
        sendBookingNotification({
          propertyName:  m.propertyName,
          apartmentId:   m.apartmentId,
          checkIn:       m.checkIn,
          checkOut:      m.checkOut,
          nights,
          guests:        parseInt(m.guests, 10),
          totalPrice:    parseFloat(m.totalPrice),
          depositAmount: parseFloat(m.depositAmount),
          paymentOption: (m.paymentOption as "50" | "100") ?? "50",
          firstName:     m.firstName,
          lastName:      m.lastName,
          email:         m.email,
          phone:         m.phone,
          message:       m.message,
          paymentIntentId: pi.id,
        }),
        sendGuestConfirmationEmail({
          propertyName:       m.propertyName,
          checkIn:            m.checkIn,
          checkOut:           m.checkOut,
          nights,
          guests:             parseInt(m.guests, 10),
          totalPrice:         parseFloat(m.totalPrice),
          depositAmount:      parseFloat(m.depositAmount),
          paymentOption:      (m.paymentOption as "50" | "100") ?? "50",
          firstName:          m.firstName,
          lastName:           m.lastName,
          email:              m.email,
          phone:              m.phone,
          smoobuBookingId:    result.id,
          remainingPaymentUrl,
          locale:             guestLocale,
        }),
      ])

    } catch (err) {
      console.error('[webhook] Smoobu booking creation failed:', err)
      // Return 500 so Stripe retries (up to ~18h). Duplicate protection:
      // on retry, smoobu_booking_id check above skips if already created.
      return NextResponse.json({ error: 'Booking creation failed – will retry' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

// ─── Gruppenbuchung: je Apartment eine Smoobu-Reservierung ────────────────────
//
// Idempotent über Metadata: nach jedem erfolgreichen createBooking wird
// `smoobu_booking_<apartmentId>` sofort in den PI geschrieben. Ein Stripe-
// Retry (bei 500) legt dadurch nur die noch fehlenden Buchungen an – nie
// Duplikate. Smoobu synchronisiert jede Reservierung als Channel-Manager
// selbst zu Airbnb/Booking; mehr ist für die Portale nicht nötig.
type GroupApartmentMeta = { id: string; smoobuId: string; guests: number; total: number }

async function handleGroupBooking(piId: string, m: Record<string, string>) {
  let apartments: GroupApartmentMeta[]
  try {
    apartments = JSON.parse(m.group_apartments) as GroupApartmentMeta[]
    if (!Array.isArray(apartments) || apartments.length === 0) throw new Error('leer')
  } catch {
    console.error(`[webhook] Gruppen-PI ${piId}: group_apartments unlesbar`)
    // Kein Retry sinnvoll – Daten kaputt. Vincent muss manuell ran.
    await sendBookingNotification({
      propertyName: `⚠️ GRUPPENBUCHUNG UNVOLLSTÄNDIG – ${m.propertyName ?? ''}`,
      apartmentId: 'unbekannt',
      checkIn: m.checkIn, checkOut: m.checkOut, nights: 0,
      guests: parseInt(m.guests ?? '0', 10),
      totalPrice: parseFloat(m.totalPrice ?? '0'),
      depositAmount: parseFloat(m.depositAmount ?? '0'),
      paymentOption: (m.paymentOption as '50' | '100') ?? '50',
      firstName: m.firstName, lastName: m.lastName, email: m.email, phone: m.phone,
      message: `Metadata group_apartments war nicht lesbar – Smoobu-Buchungen MANUELL anlegen! PI: ${piId}`,
      paymentIntentId: piId,
    }).catch(() => {})
    return NextResponse.json({ received: true })
  }

  const guestLocale = toMailLocale(m.locale)
  const meta: Record<string, string> = { ...m }
  const createdIds: number[] = []
  const failed: Array<{ apt: GroupApartmentMeta; reason: string; retryable: boolean }> = []

  for (const apt of apartments) {
    const metaKey = `smoobu_booking_${apt.id}`
    if (meta[metaKey]) {
      createdIds.push(Number(meta[metaKey]))
      continue // bereits angelegt (früherer Versuch / Client-Backup)
    }

    // Doppelbuchungs-Schutz: unmittelbar vor dem Anlegen nochmal prüfen.
    try {
      const blocked = await verifyAvailability(apt.smoobuId, m.checkIn, m.checkOut)
      if (blocked) {
        failed.push({ apt, reason: `${blocked} inzwischen belegt`, retryable: false })
        continue
      }
    } catch {
      // Prüfung nicht möglich → createBooking entscheiden lassen
    }

    try {
      const result = await createBooking({
        apartmentId: apt.smoobuId,
        checkIn: m.checkIn,
        checkOut: m.checkOut,
        guests: apt.guests,
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        phone: m.phone,
        message: m.message,
        totalPrice: apt.total,
        // Anzahlung anteilig am Apartment-Preis, damit Smoobu-Salden stimmen
        depositAmount: Math.round(apt.total * (parseFloat(m.depositAmount) / parseFloat(m.totalPrice))),
        language: guestLocale,
      })
      createdIds.push(result.id)
      meta[metaKey] = String(result.id)
      // Sofort persistieren – Schutz gegen Doppelanlage beim Retry
      await stripe.paymentIntents.update(piId, { metadata: { [metaKey]: String(result.id) } })
      console.log(`[webhook] Gruppen-Buchung ${apt.id} → Smoobu #${result.id} (PI ${piId})`)
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'unbekannter Fehler'
      failed.push({ apt, reason, retryable: true })
      console.error(`[webhook] Gruppen-Buchung ${apt.id} fehlgeschlagen:`, reason)
    }
  }

  const nights = Math.round(
    (new Date(m.checkOut).getTime() - new Date(m.checkIn).getTime()) / (1000 * 60 * 60 * 24),
  )

  // ── Alles angelegt → normale Bestätigungen ──
  if (failed.length === 0) {
    let remainingPaymentUrl: string | undefined
    const totalPrice = parseFloat(m.totalPrice)
    const depositAmount = parseFloat(m.depositAmount)
    const remaining = Math.round(totalPrice - depositAmount)
    if (m.paymentOption !== '100' && remaining > 0) {
      try {
        const price = await stripe.prices.create({
          currency: 'eur',
          unit_amount: toCents(remaining),
          product_data: {
            name: guestLocale === 'en'
              ? `Remaining balance – ${m.propertyName} · ${m.checkIn} to ${m.checkOut}`
              : `Restbetrag – ${m.propertyName} · ${m.checkIn} bis ${m.checkOut}`,
          },
        })
        const paymentLink = await stripe.paymentLinks.create({
          line_items: [{ price: price.id, quantity: 1 }],
          metadata: {
            type: 'restbetrag',
            propertyName: m.propertyName,
            smoobu_booking_id: createdIds.join(','),
            original_payment_intent: piId,
            locale: guestLocale,
          },
        })
        remainingPaymentUrl = paymentLink.url
      } catch (linkErr) {
        console.error('[webhook] Gruppen-Restbetrag-Link fehlgeschlagen:', linkErr)
      }
    }

    await Promise.allSettled([
      sendBookingNotification({
        propertyName: m.propertyName,
        apartmentId: apartments.map((a) => `${a.id}=#${meta[`smoobu_booking_${a.id}`]}`).join(', '),
        checkIn: m.checkIn, checkOut: m.checkOut, nights,
        guests: parseInt(m.guests, 10),
        totalPrice: parseFloat(m.totalPrice),
        depositAmount: parseFloat(m.depositAmount),
        paymentOption: (m.paymentOption as '50' | '100') ?? '50',
        firstName: m.firstName, lastName: m.lastName, email: m.email, phone: m.phone,
        message: m.message,
        paymentIntentId: piId,
      }),
      sendGuestConfirmationEmail({
        propertyName: m.propertyName,
        checkIn: m.checkIn, checkOut: m.checkOut, nights,
        guests: parseInt(m.guests, 10),
        totalPrice: parseFloat(m.totalPrice),
        depositAmount: parseFloat(m.depositAmount),
        paymentOption: (m.paymentOption as '50' | '100') ?? '50',
        firstName: m.firstName, lastName: m.lastName, email: m.email, phone: m.phone,
        smoobuBookingId: createdIds[0] ?? 0,
        remainingPaymentUrl,
        locale: guestLocale,
      }),
    ])
    return NextResponse.json({ received: true })
  }

  // ── Teilfehler ──
  const retryable = failed.some((f) => f.retryable)
  const failList = failed.map((f) => `${f.apt.id}: ${f.reason}`).join(' | ')

  // Vincent immer alarmieren – Geld ist geflossen, Buchungen fehlen teilweise.
  await sendBookingNotification({
    propertyName: `⚠️ GRUPPENBUCHUNG UNVOLLSTÄNDIG – ${m.propertyName}`,
    apartmentId: failList,
    checkIn: m.checkIn, checkOut: m.checkOut, nights,
    guests: parseInt(m.guests, 10),
    totalPrice: parseFloat(m.totalPrice),
    depositAmount: parseFloat(m.depositAmount),
    paymentOption: (m.paymentOption as '50' | '100') ?? '50',
    firstName: m.firstName, lastName: m.lastName, email: m.email, phone: m.phone,
    message:
      `Angelegt: ${createdIds.length ? createdIds.map((i) => `#${i}`).join(', ') : 'keine'}. ` +
      `Fehlgeschlagen: ${failList}. ` +
      (retryable
        ? 'Stripe versucht es automatisch erneut; bereits angelegte Buchungen sind geschützt.'
        : 'Zeitraum inzwischen belegt – MANUELL lösen (Umbuchung oder Erstattung)! ') +
      `PI: ${piId}`,
    paymentIntentId: piId,
  }).catch(() => {})

  if (retryable) {
    // 500 → Stripe wiederholt; Metadata-Schutz verhindert Duplikate.
    return NextResponse.json({ error: 'Teilweise fehlgeschlagen – Retry' }, { status: 500 })
  }
  // Echter Belegungskonflikt: Retry würde ewig scheitern → 200 + Alarmmail oben.
  await stripe.paymentIntents.update(piId, {
    metadata: { group_conflict: failed.map((f) => f.apt.id).join(',') },
  }).catch(() => {})
  return NextResponse.json({ received: true })
}
