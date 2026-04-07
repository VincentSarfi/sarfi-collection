import { NextRequest, NextResponse } from 'next/server'
import { createBooking, verifyAvailability } from '@/lib/smoobu'
import type { BookingRequest } from '@/lib/smoobu'

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

  // ── Date logic ──
  const checkInDate = new Date(req.checkIn)
  const checkOutDate = new Date(req.checkOut)
  if (checkInDate >= checkOutDate) {
    return NextResponse.json(
      { error: 'Abreisedatum muss nach dem Anreisedatum liegen' },
      { status: 422 },
    )
  }
  if (checkInDate < new Date(new Date().toDateString())) {
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
