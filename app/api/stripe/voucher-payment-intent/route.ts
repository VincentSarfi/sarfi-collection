import { NextRequest, NextResponse } from 'next/server'
import { EMAIL_RE } from '@/lib/validate'
import { stripe, toCents } from '@/lib/stripe'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'
import { generateVoucherCode, isValidVoucherAmount, VOUCHER_MAX_EUR, VOUCHER_MIN_EUR } from '@/lib/voucher'

/**
 * POST /api/stripe/voucher-payment-intent
 * Erzeugt EINEN PaymentIntent über den vollen Gutscheinwert. Der Webhook
 * verschickt bei payment_intent.succeeded die Gutschein-Mail (metadata.type
 * = "voucher"). Kein Smoobu, keine Verfügbarkeit – nur Zahlung + Metadaten.
 */

export interface CreateVoucherPaymentIntentRequest {
  amount: number            // EUR, ganzzahlig
  buyerName: string
  email: string             // Käufer – erhält Gutschein + Stripe-Beleg
  recipient?: string        // Name des/der Beschenkten (auf der Karte)
  message?: string          // persönliche Nachricht (auf der Karte)
  turnstileToken?: string
  locale?: string           // "de" | "en" – Mailsprache
}

function str(v: unknown, maxLen: number): string {
  return typeof v === 'string' ? v.trim().slice(0, maxLen) : ''
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = rateLimit(`voucher-pi:${ip}`, 5, 10 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte warte kurz und versuche es erneut.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  let body: Partial<CreateVoucherPaymentIntentRequest>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const amount = body.amount
  const buyerName = str(body.buyerName, 100)
  const email = str(body.email, 254)
  const recipient = str(body.recipient, 80)
  const message = str(body.message, 300)
  const locale = body.locale === 'en' ? 'en' : 'de'

  if (!isValidVoucherAmount(amount)) {
    return NextResponse.json(
      { error: `Der Gutscheinwert muss zwischen ${VOUCHER_MIN_EUR} € und ${VOUCHER_MAX_EUR} € liegen (ganze Euro).` },
      { status: 422 },
    )
  }
  if (!buyerName) {
    return NextResponse.json({ error: 'Bitte gib deinen Namen an.' }, { status: 422 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 422 })
  }

  // Bot-Schutz wie bei Buchungen – verhindert Massen-PIs und Mail-Spam.
  if (!(await verifyTurnstile(body.turnstileToken ?? ''))) {
    return NextResponse.json(
      { error: 'Bot-Schutz fehlgeschlagen. Bitte lade die Seite neu und versuche es erneut.' },
      { status: 403 },
    )
  }

  const voucherCode = generateVoucherCode()

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: toCents(amount),
      currency: 'eur',
      // Zahlarten steuert das Stripe-Dashboard; keine asynchronen Methoden
      // aktivieren (siehe payment-intent/route.ts).
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: `Geschenkgutschein ${amount} € – SARFI Collection (${voucherCode})`,
      metadata: {
        type: 'voucher',
        voucher_code: voucherCode,
        voucher_value: String(amount),
        buyerName,
        email,
        recipient,
        message,
        locale,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount,
      paymentIntentId: paymentIntent.id,
    })
  } catch (err) {
    console.error('[voucher-payment-intent]', err)
    return NextResponse.json(
      { error: 'Zahlung konnte nicht vorbereitet werden. Bitte versuche es erneut.' },
      { status: 500 },
    )
  }
}
