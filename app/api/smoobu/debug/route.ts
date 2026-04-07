import { NextRequest, NextResponse } from 'next/server'

// GET /api/smoobu/debug?propertyId=2610828
export async function GET(request: NextRequest) {
  const propertyId = request.nextUrl.searchParams.get('propertyId') ?? '2610828'

  const start = '2026-04-07'
  const end   = '2026-04-14'

  const headers = {
    'Api-Key': process.env.SMOOBU_API_KEY ?? '',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  }

  const endpoints = [
    // Availability variants
    `https://login.smoobu.com/api/apartments/${propertyId}/availability?startDate=${start}&endDate=${end}`,
    `https://login.smoobu.com/api/apartments/${propertyId}/availability?from=${start}&to=${end}`,
    // Rate plan variants
    `https://login.smoobu.com/api/apartments/${propertyId}/rates`,
    `https://login.smoobu.com/api/apartments/${propertyId}/rateplans`,
    `https://login.smoobu.com/api/rates?apartmentId=${propertyId}&startDate=${start}&endDate=${end}`,
    `https://login.smoobu.com/api/rates?apartments[]=${propertyId}&startDate=${start}&endDate=${end}`,
    // Price per night from apartment settings
    `https://login.smoobu.com/api/apartments/${propertyId}/pricePerNight?startDate=${start}&endDate=${end}`,
    // Channel rates
    `https://login.smoobu.com/api/apartments/${propertyId}/channel_rates?startDate=${start}&endDate=${end}`,
  ]

  const results: Record<string, unknown> = {}

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers, cache: 'no-store' })
      const text = await res.text()
      let json: unknown = null
      try { json = JSON.parse(text) } catch { json = text.slice(0, 300) }
      results[url.replace('https://login.smoobu.com/api/', '')] = { status: res.status, data: json }
    } catch (err) {
      results[url.replace('https://login.smoobu.com/api/', '')] = { error: err instanceof Error ? err.message : String(err) }
    }
  }

  return NextResponse.json(results)
}
