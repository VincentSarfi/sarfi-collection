import { NextRequest, NextResponse } from 'next/server'
import { getPricingMap } from '@/lib/pricelabs'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

/**
 * GET /api/pricelabs/rates?listingId=2610828&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 * Returns nightly price map for the client-side calendar.
 */
export async function GET(request: NextRequest) {
  // Rate limit: max 30 requests per IP per minute
  const ip = getClientIp(request)
  const rl = rateLimit(`pricelabs:${ip}`, 30, 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json({}, { status: 429 })
  }

  const { searchParams } = request.nextUrl
  const listingId = searchParams.get('listingId')
  const startDate = searchParams.get('startDate')
  const endDate   = searchParams.get('endDate')

  if (!listingId || !startDate || !endDate) {
    return NextResponse.json({ error: 'listingId, startDate, endDate required' }, { status: 400 })
  }

  try {
    const map = await getPricingMap(listingId, startDate, endDate)
    return NextResponse.json(map, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=300' },
    })
  } catch (err) {
    console.error('[pricelabs/rates]', err)
    // Return empty – client falls back to priceFrom
    return NextResponse.json({}, { status: 200 })
  }
}
