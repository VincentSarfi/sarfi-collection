import { NextResponse } from 'next/server'

export async function GET() {
  const key   = process.env.PRICELABS_API_KEY ?? ''
  const start = '2026-04-07'
  const end   = '2026-06-07'

  // POST /v1/listing_prices with correct body format (from SwaggerHub docs)
  const body = {
    listings: [
      { id: '2610828', pms: 'smoobu', dateFrom: start, dateTo: end },
    ],
  }

  try {
    const res = await fetch('https://api.pricelabs.co/v1/listing_prices', {
      method: 'POST',
      headers: { 'X-API-Key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    })
    const text = await res.text()
    let parsed: unknown = null
    try { parsed = JSON.parse(text) } catch { parsed = text.slice(0, 500) }
    return NextResponse.json({ status: res.status, requestBody: body, response: parsed })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}
