import { NextRequest, NextResponse } from 'next/server'
import { stripe, DEPOSIT_FRACTION, toCents } from '@/lib/stripe'
import { verifyAvailability } from '@/lib/smoobu'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { sendCheckoutStartedNotification } from '@/lib/notify'

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
          paymentOption = "50" } = body

  if (!apartmentId || !checkIn || !checkOut || !firstName || !lastName ||
      !email || !phone || !guests || !totalPrice) {
    return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 422 })
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

  const fraction   = paymentOption === "100" ? 1 : DEPOSIT_FRACTION
  const depositEur = Math.round(totalPrice * fraction)

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
        totalPrice: String(totalPrice),
        depositAmount: String(depositEur),
        paymentOption: paymentOption ?? "50",
      },
    })

    // Hinweis-Mail: Checkout gestartet, noch nicht bezahlt
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
      totalPrice,
      depositAmount:   depositEur,
      paymentOption:   paymentOption ?? "50",
      firstName,
      lastName,
      email,
      phone,
      message,
      paymentIntentId: paymentIntent.id,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret ?? '',
      depositAmount: depositEur,
      totalAmount: totalPrice,
      paymentIntentId: paymentIntent.id,
    } satisfies CreatePaymentIntentResponse)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Stripe-Fehler'
    console.error('[payment-intent]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
