import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createBooking } from '@/lib/smoobu'

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

    // Only create booking if not already created by client
    if (m.smoobu_booking_id) {
      console.log(`[webhook] Booking already exists for PI ${pi.id}`)
      return NextResponse.json({ received: true })
    }

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
      })

      // Tag the payment intent with the booking ID
      await stripe.paymentIntents.update(pi.id, {
        metadata: { ...m, smoobu_booking_id: String(result.id) },
      })

      console.log(`[webhook] Created Smoobu booking #${result.id} for PI ${pi.id}`)
    } catch (err) {
      console.error('[webhook] Smoobu booking creation failed:', err)
      // Return 500 so Stripe retries (up to ~18h). Duplicate protection:
      // on retry, smoobu_booking_id check above skips if already created.
      return NextResponse.json({ error: 'Booking creation failed – will retry' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
