import { NextRequest, NextResponse } from 'next/server'
import { createBooking, verifyAvailability } from '@/lib/smoobu'
import type { BookingRequest } from '@/lib/smoobu'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { stripe } from '@/lib/stripe'

// ─── Validation helpers ───────────────────────────────────────────────────────

function isValidDate(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s))
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

// ─── Route handler ────────────────────────────────────────────────────────────

/**
 * POST /api/smoobu/booking
 * Body: BookingRequest JSON
 * Returns: { id, referenceId } on success, { error } on failure
 */
export async function POST(request: NextRequest) {
  // Rate limit: max 10 booking attempts per IP per 10 minutes
  const ip = getClientIp(request)
  const rl = rateLimit(`smoobu-booking:${ip}`, 10, 10 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte warte kurz und versuche es erneut.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  let body: Partial<BookingRequest>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // ── Field validation ──
  const errors: string[] = []

  if (!body.apartmentId) errors.push('apartmentId fehlt')
  if (!body.checkIn || !isValidDate(body.checkIn)) errors.push('Ungültiges Anreisedatum')
  if (!body.checkOut || !isValidDate(body.checkOut)) errors.push('Ungültiges Abreisedatum')
  if (!body.firstName?.trim()) errors.push('Vorname fehlt')
  if (!body.lastName?.trim()) errors.push('Nachname fehlt')
  if (!body.email || !isValidEmail(body.email)) errors.push('Ungültige E-Mail-Adresse')
  if (!body.phone?.trim()) errors.push('Telefonnummer fehlt')
  if (!body.guests || body.guests < 1) errors.push('Ungültige Gästeanzahl')
  if (!body.totalPrice || body.totalPrice <= 0) errors.push('Ungültiger Gesamtpreis')

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(', ') }, { status: 422 })
  }

  const req = body as BookingRequest

  // ── Payment verification ──
  // A booking creates a real, calendar-blocking Smoobu reservation, so it must
  // be backed by a settled Stripe payment. Without this check anyone could POST
  // here and create free fraudulent bookings. (The normal flow now creates the
  // booking from the Stripe webhook; this endpoint is the client-side backup.)
  const paymentIntentId = (body as { paymentIntentId?: string }).paymentIntentId
  if (!paymentIntentId || typeof paymentIntentId !== 'string') {
    return NextResponse.json({ error: 'Zahlungsnachweis fehlt' }, { status: 402 })
  }
  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (pi.status !== 'succeeded') {
      return NextResponse.json({ error: 'Zahlung nicht abgeschlossen' }, { status: 402 })
    }
    const m = pi.metadata ?? {}
    if (
      m.apartmentId !== req.apartmentId ||
      m.checkIn !== req.checkIn ||
      m.checkOut !== req.checkOut
    ) {
      return NextResponse.json({ error: 'Zahlung passt nicht zur Buchung' }, { status: 422 })
    }
    if (m.smoobu_booking_id) {
      // Webhook already created the booking for this payment.
      return NextResponse.json({ success: true, id: Number(m.smoobu_booking_id) })
    }
    // Use the server-verified price from the payment metadata, never the client
    // value, so the price recorded in Smoobu always matches what was charged.
    const verifiedTotal = Number(m.totalPrice)
    if (Number.isFinite(verifiedTotal) && verifiedTotal > 0) {
      req.totalPrice = verifiedTotal
    }
  } catch (err) {
    console.error('[booking] Stripe-Verifikation fehlgeschlagen:', err)
    return NextResponse.json({ error: 'Zahlung konnte nicht verifiziert werden' }, { status: 402 })
  }

  // ── Date logic ──
  const checkInDate = new Date(req.checkIn)
  const checkOutDate = new Date(req.checkOut)
  if (checkInDate >= checkOutDate) {
    return NextResponse.json(
      { error: 'Abreisedatum muss nach dem Anreisedatum liegen' },
      { status: 422 },
    )
  }
  // Vergleich in der Zeitzone der Unterkunft, nicht in UTC/Server-Lokalzeit
  const todayBerlin = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Berlin',
  }).format(new Date())
  if (req.checkIn < todayBerlin) {
    return NextResponse.json(
      { error: 'Anreisedatum liegt in der Vergangenheit' },
      { status: 422 },
    )
  }

  // ── Server-side availability double-check ──
  try {
    const blockedDate = await verifyAvailability(
      req.apartmentId,
      req.checkIn,
      req.checkOut,
    )
    if (blockedDate) {
      return NextResponse.json(
        {
          error: `Der Zeitraum ist leider nicht mehr verfügbar (${blockedDate} ist bereits belegt). Bitte wähle andere Daten.`,
          conflictDate: blockedDate,
        },
        { status: 409 },
      )
    }
  } catch (err) {
    // If availability check fails (e.g. API unreachable), log and continue.
    // Better to accept and let the Smoobu booking call fail with a clear error.
    console.warn('[booking] Availability pre-check failed, proceeding:', err)
  }

  // ── Create booking ──
  try {
    const result = await createBooking(req)
    return NextResponse.json({
      success: true,
      id: result.id,
      referenceId: result.referenceId,
    })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Buchung fehlgeschlagen'
    console.error('[booking] create failed:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
