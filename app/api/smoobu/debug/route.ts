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

  // The /api/rates endpoint exists (returns 422 not 404) – test correct param structures
  const rateEndpoints = [
    `rates?apartments[0][id]=${propertyId}&startDate=${start}&endDate=${end}`,
    `rates?apartments[0]=${propertyId}&startDate=${start}&endDate=${end}`,
    `rates?apartment=${propertyId}&startDate=${start}&endDate=${end}`,
    `rates?apartmentIds[]=${propertyId}&startDate=${start}&endDate=${end}`,
    `rates?id=${propertyId}&startDate=${start}&endDate=${end}`,
    `rates?apartments[]=${propertyId}&from=${start}&to=${end}`,
    `rates?apartmentId=${propertyId}&from=${start}&to=${end}`,
    `rates?apartments[0][id]=${propertyId}&from=${start}&to=${end}`,
  ]

  const results: Record<string, unknown> = {}

  for (const path of rateEndpoints) {
    try {
      const url = `https://login.smoobu.com/api/${path}`
      const res = await fetch(url, { headers, cache: 'no-store' })
      const text = await res.text()
      let json: unknown = null
      try { json = JSON.parse(text) } catch { json = text.slice(0, 200) }
      results[path] = { status: res.status, data: json }
    } catch (err) {
      results[path] = { error: err instanceof Error ? err.message : String(err) }
    }
  }

  return NextResponse.json(results)
}
