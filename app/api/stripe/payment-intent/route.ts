import { NextRequest, NextResponse } from 'next/server'
import { stripe, DEPOSIT_FRACTION, toCents } from '@/lib/stripe'
import { verifyAvailability } from '@/lib/smoobu'

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
  totalPrice: number  // full price in EUR
}

export interface CreatePaymentIntentResponse {
  clientSecret: string
  depositAmount: number  // EUR
  totalAmount: number    // EUR
  paymentIntentId: string
}

export async function POST(request: NextRequest) {
  let body: Partial<CreatePaymentIntentRequest>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { apartmentId, propertyName, checkIn, checkOut, guests,
          firstName, lastName, email, phone, message, totalPrice } = body

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

  const depositEur = Math.round(totalPrice * DEPOSIT_FRACTION)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: toCents(depositEur),
      currency: 'eur',
      receipt_email: email,
      description: `50% Anzahlung – ${propertyName} · ${checkIn} bis ${checkOut}`,
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
      },
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
