import { NextRequest, NextResponse } from 'next/server'

// GET /api/smoobu/debug?propertyId=2610828
export async function GET(request: NextRequest) {
  const propertyId = request.nextUrl.searchParams.get('propertyId') ?? '2610828'

  const today = new Date().toISOString().split('T')[0]
  const endDate = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]

  const headers = {
    'Api-Key': process.env.SMOOBU_API_KEY ?? '',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  }

  // Test both potential endpoints
  const endpoints = [
    `https://login.smoobu.com/api/reservations?apartmentId=${propertyId}&from=${today}&to=${endDate}&pageSize=100`,
    `https://login.smoobu.com/api/apartments/${propertyId}/rates?startDate=${today}&endDate=${endDate}`,
    `https://login.smoobu.com/api/apartments/${propertyId}`,
  ]

  const results: Record<string, unknown> = {}

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers, cache: 'no-store' })
      const text = await res.text()
      let json: unknown = null
      try { json = JSON.parse(text) } catch { json = text.slice(0, 200) }
      results[url] = { status: res.status, data: json }
    } catch (err) {
      results[url] = { error: err instanceof Error ? err.message : String(err) }
    }
  }

  return NextResponse.json(results, { headers: { 'Content-Type': 'application/json' } })
}
