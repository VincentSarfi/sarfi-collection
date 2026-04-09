import { NextRequest, NextResponse } from 'next/server'
import { getAvailability } from '@/lib/smoobu'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

/**
 * GET /api/smoobu/availability
 * Query params:
 *   propertyId  – Smoobu apartment ID
 *   startDate   – YYYY-MM-DD (defaults to today)
 *   endDate     – YYYY-MM-DD (defaults to today + 365 days)
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

  const today = new Date()
  const defaultEnd = new Date(today)
  defaultEnd.setFullYear(defaultEnd.getFullYear() + 1)

  const startDate =
    searchParams.get('startDate') ?? today.toISOString().split('T')[0]
  const endDate =
    searchParams.get('endDate') ?? defaultEnd.toISOString().split('T')[0]

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
