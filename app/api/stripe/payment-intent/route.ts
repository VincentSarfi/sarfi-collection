import { NextRequest, NextResponse } from 'next/server'
import { DATE_RE, EMAIL_RE } from '@/lib/validate'
import { stripe, DEPOSIT_FRACTION, toCents } from '@/lib/stripe'
import { verifyAvailability } from '@/lib/smoobu'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sendCheckoutStartedNotification } from '@/lib/notify'
import { findConfigBySmoobuId, computeExpectedPrice } from '@/lib/pricing'
import { verifyTurnstile } from '@/lib/turnstile'


export interface CreatePaymentIntentRequest {
  apartmentId: string
  propertyName: string
  checkIn: string
  checkOut: string
  guests: number
  firstName: string
  lastName: string
  email: string
  phone: string
  message?: string
  totalPrice: number       // full price in EUR
  paymentOption?: "50" | "100"  // default: "50"
  turnstileToken?: string  // Cloudflare Turnstile bot-check token
}

export interface CreatePaymentIntentResponse {
  clientSecret: string
  depositAmount: number  // EUR
  totalAmount: number    // EUR
  paymentIntentId: string
}

export async function POST(request: NextRequest) {
  // Rate limit: max 10 payment intent creations per IP per 10 minutes
  const ip = getClientIp(request)
  const rl = rateLimit(`payment-intent:${ip}`, 10, 10 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte warte kurz und versuche es erneut.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  let body: Partial<CreatePaymentIntentRequest>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { apartmentId, propertyName, checkIn, checkOut, guests,
          firstName, lastName, email, phone, message, totalPrice,
          paymentOption = "50", turnstileToken } = body

  if (!apartmentId || !checkIn || !checkOut || !firstName || !lastName ||
      !email || !phone || !guests || !totalPrice) {
    return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 422 })
  }

  // ── Bot check (Cloudflare Turnstile) ──
  // Keeps bots from generating empty PaymentIntents + checkout notifications.
  // Skipped automatically when no TURNSTILE_SECRET_KEY is configured (dev).
  if (!(await verifyTurnstile(turnstileToken ?? ''))) {
    return NextResponse.json(
      { error: 'Bot-Schutz fehlgeschlagen. Bitte lade die Seite neu und versuche es erneut.' },
      { status: 403 },
    )
  }

  // ── Structural validation ──
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
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 422 })
  }

  // ── Resolve property from the Smoobu listing id ──
  const config = findConfigBySmoobuId(apartmentId)
  if (!config) {
    return NextResponse.json({ error: 'Unbekannte Unterkunft' }, { status: 422 })
  }
  if (guests < 1 || guests > config.maxGuests) {
    return NextResponse.json({ error: 'Ungültige Gästeanzahl' }, { status: 422 })
  }

  // ── Server-side price verification (never trust the client total) ──
  const priceCheck = await computeExpectedPrice(config, apartmentId, checkIn, checkOut, guests)
  if (priceCheck.nights < priceCheck.minStayRequired) {
    return NextResponse.json(
      { error: `Der Mindestaufenthalt für diesen Zeitraum beträgt ${priceCheck.minStayRequired} Nächte.` },
      { status: 422 },
    )
  }
  if (totalPrice < priceCheck.minAcceptable) {
    console.warn(
      `[payment-intent] Preismanipulation abgelehnt: client=${totalPrice} < min=${priceCheck.minAcceptable} ` +
      `(erwartet=${priceCheck.expectedTotal}) für ${apartmentId} ${checkIn}–${checkOut} guests=${guests}`,
    )
    return NextResponse.json(
      { error: 'Preis konnte nicht verifiziert werden. Bitte lade die Seite neu und versuche es erneut.' },
      { status: 422 },
    )
  }

  // Double-check availability before charging
  try {
    const blocked = await verifyAvailability(apartmentId, checkIn, checkOut)
    if (blocked) {
      return NextResponse.json(
        { error: `Der Zeitraum ist nicht mehr verfügbar (${blocked} bereits belegt).` },
        { status: 409 },
      )
    }
  } catch {
    // Continue if check fails – booking API will catch it
  }

  const serverTotal = Math.max(totalPrice, priceCheck.expectedTotal)
  const fraction    = paymentOption === "100" ? 1 : DEPOSIT_FRACTION
  const depositEur  = Math.round(serverTotal * fraction)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: toCents(depositEur),
      currency: 'eur',
      payment_method_types: ['card'],
      receipt_email: email,
      description: `${paymentOption === "100" ? "100% Vollzahlung" : "50% Anzahlung"} – ${propertyName} · ${checkIn} bis ${checkOut}`,
      metadata: {
        // Store all booking data so webhook can create the Smoobu booking
        apartmentId,
        propertyName: propertyName ?? '',
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
        paymentOption: paymentOption ?? "50",
      },
    })

    // Hinweis-Mail: Checkout gestartet, noch nicht bezahlt (fire-and-forget – darf PI-Response nicht blockieren)
    const nights = Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    )
    await sendCheckoutStartedNotification({
      propertyName:    propertyName ?? '',
      apartmentId,
      checkIn,
      checkOut,
      nights,
      guests,
      totalPrice: serverTotal,
      depositAmount:   depositEur,
      paymentOption:   paymentOption ?? "50",
      firstName,
      lastName,
      email,
      phone,
      message,
      paymentIntentId: paymentIntent.id,
      clientIp:        ip,
      clientCountry:   request.headers.get('x-vercel-ip-country') ?? undefined,
      userAgent:       request.headers.get('user-agent') ?? undefined,
    }).catch(err => console.error('[payment-intent] Checkout-Mail Fehler:', err))

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret ?? '',
      depositAmount: depositEur,
      totalAmount: serverTotal,
      paymentIntentId: paymentIntent.id,
    } satisfies CreatePaymentIntentResponse)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Stripe-Fehler'
    console.error('[payment-intent]', msg)
    return NextResponse.json(
      { error: 'Die Zahlung konnte nicht initialisiert werden. Bitte versuche es später erneut.' },
      { status: 500 },
    )
  }
}
