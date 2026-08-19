import { NextRequest, NextResponse } from 'next/server'
import { getAvailability } from '@/lib/smoobu'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { findConfigBySmoobuId } from '@/lib/pricing'
import { DATE_RE } from '@/lib/validate'
import { bookingWindowEnd } from '@/lib/booking-window'

/**
 * GET /api/smoobu/availability
 * Query params:
 *   propertyId  – Smoobu apartment ID
 *   startDate   – YYYY-MM-DD (defaults to today)
 *   endDate     – YYYY-MM-DD (Vorgabe und Obergrenze: Ende des Buchungsfensters)
 */
export async function GET(request: NextRequest) {
  // Rate limit: max 60 requests per IP per minute (calendar loads multiple months)
  const ip = getClientIp(request)
  const rl = rateLimit(`availability:${ip}`, 60, 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { searchParams } = request.nextUrl

  const propertyId = searchParams.get('propertyId')
  if (!propertyId) {
    return NextResponse.json({ error: 'propertyId is required' }, { status: 400 })
  }
  // Only allow known Smoobu listing IDs – prevents the unvalidated id from being
  // interpolated into upstream Smoobu API URLs (path/query injection).
  if (!findConfigBySmoobuId(propertyId)) {
    return NextResponse.json({ error: 'Unknown propertyId' }, { status: 400 })
  }

  const today = new Date()
  const windowEnd = bookingWindowEnd()

  const startDate =
    searchParams.get('startDate') ?? today.toISOString().split('T')[0]
  // Nie über das Buchungsfenster hinaus antworten – sonst zeigt der Kalender
  // freie Tage, die die Buchungsstrecke später ohnehin ablehnt.
  const requestedEnd = searchParams.get('endDate') ?? windowEnd
  const endDate = requestedEnd > windowEnd ? windowEnd : requestedEnd

  // Format streng validieren – schützt daysBetween vor Endlos-/Riesenschleifen
  if (!DATE_RE.test(startDate) || !DATE_RE.test(endDate) || startDate >= endDate) {
    return NextResponse.json({ error: 'Invalid date range' }, { status: 400 })
  }

  try {
    const availability = await getAvailability(propertyId, startDate, endDate)
    return NextResponse.json(availability, {
      headers: {
        // Allow client-side caching for 5 minutes
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
      },
    })
  } catch (err) {
    console.error('[availability]', err)
    // Return empty object so the UI degrades gracefully (no blocked dates shown)
    return NextResponse.json(
      {},
      {
        status: 200, // still 200 – UI should not break on API hiccups
        headers: { 'X-Availability-Error': 'true' },
      },
    )
  }
}
