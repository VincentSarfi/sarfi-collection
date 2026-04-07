import { NextResponse } from 'next/server'

export async function GET() {
  const listingId = '2610828'
  const startDate = '2026-04-07'
  const endDate   = '2026-05-07'
  const apiKey    = process.env.PRICELABS_API_KEY ?? ''

  const url = `https://api.pricelabs.co/v1/listing_prices?integration=smoobu&listing_ids=${listingId}&start_date=${startDate}&end_date=${endDate}`

  try {
    const res = await fetch(url, {
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    const text = await res.text()
    let json: unknown = null
    try { json = JSON.parse(text) } catch { json = text.slice(0, 500) }

    return NextResponse.json({
      status: res.status,
      url,
      apiKeySet: apiKey.length > 0,
      apiKeyPrefix: apiKey.slice(0, 8) + '…',
      response: json,
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}
