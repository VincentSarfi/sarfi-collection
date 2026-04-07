import { NextRequest, NextResponse } from 'next/server'

// GET /api/smoobu/debug?propertyId=2610828
export async function GET(request: NextRequest) {
  const propertyId = request.nextUrl.searchParams.get('propertyId') ?? '2610828'
  const start = '2026-04-07'
  const end   = '2026-04-14'

  const baseHeaders = {
    'Api-Key': process.env.SMOOBU_API_KEY ?? '',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  }

  const results: Record<string, unknown> = {}

  // Test POST /api/rates with different JSON structures
  const postBodies = [
    { apartmentId: parseInt(propertyId), startDate: start, endDate: end },
    { apartments: [parseInt(propertyId)], startDate: start, endDate: end },
    { apartments: [{ id: parseInt(propertyId) }], startDate: start, endDate: end },
    { apartmentId: parseInt(propertyId), from: start, to: end },
    { id: parseInt(propertyId), startDate: start, endDate: end },
  ]

  for (const body of postBodies) {
    const key = `POST /rates ${JSON.stringify(body).slice(0, 60)}`
    try {
      const res = await fetch('https://login.smoobu.com/api/rates', {
        method: 'POST',
        headers: baseHeaders,
        body: JSON.stringify(body),
        cache: 'no-store',
      })
      const text = await res.text()
      let json: unknown = null
      try { json = JSON.parse(text) } catch { json = text.slice(0, 200) }
      results[key] = { status: res.status, data: json }
    } catch (err) {
      results[key] = { error: err instanceof Error ? err.message : String(err) }
    }
  }

  // Also try GET /api/apartments (list) to see what endpoints are documented
  try {
    const res = await fetch(`https://login.smoobu.com/api/apartments?pageSize=1`, {
      headers: baseHeaders, cache: 'no-store',
    })
    const json = await res.json()
    results['GET /apartments?pageSize=1'] = { status: res.status, keys: Object.keys(json) }
  } catch (err) {
    results['GET /apartments'] = { error: String(err) }
  }

  // Try the Smoobu settings API root to discover available endpoints
  try {
    const res = await fetch(`https://login.smoobu.com/api`, {
      headers: baseHeaders, cache: 'no-store',
    })
    const text = await res.text()
    results['GET /api (root)'] = { status: res.status, preview: text.slice(0, 300) }
  } catch (err) {
    results['GET /api (root)'] = { error: String(err) }
  }

  return NextResponse.json(results)
}
