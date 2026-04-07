import { NextResponse } from 'next/server'

export async function GET() {
  const listingId = '2610828'
  const startDate = '2026-04-07'
  const endDate   = '2026-05-07'
  const apiKey    = process.env.PRICELABS_API_KEY ?? ''

  const headers = {
    'X-API-Key': apiKey,
    'Content-Type': 'application/json',
  }

  const urls = [
    // v1 variants
    `https://api.pricelabs.co/v1/listing_prices?integration=smoobu&listing_ids=${listingId}&start_date=${startDate}&end_date=${endDate}`,
    `https://api.pricelabs.co/v1/pr_prices?listing_id=${listingId}&start_date=${startDate}&end_date=${endDate}`,
    `https://api.pricelabs.co/v1/prices?listing_id=${listingId}&start_date=${startDate}&end_date=${endDate}`,
    // v2 variants
    `https://api.pricelabs.co/v2/listing_prices?integration=smoobu&listing_ids=${listingId}&start_date=${startDate}&end_date=${endDate}`,
    `https://api.pricelabs.co/v2/pr_prices?listing_id=${listingId}&start_date=${startDate}&end_date=${endDate}`,
    // without integration param
    `https://api.pricelabs.co/v1/listing_prices?listing_ids=${listingId}&start_date=${startDate}&end_date=${endDate}`,
    // root to see what's available
    `https://api.pricelabs.co/v1/`,
  ]

  const results: Record<string, unknown> = {}

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers, cache: 'no-store' })
      const text = await res.text()
      let json: unknown = null
      try { json = JSON.parse(text) } catch { json = text.slice(0, 200) }
      results[url.replace('https://api.pricelabs.co', '')] = { status: res.status, body: json }
    } catch (err) {
      results[url.replace('https://api.pricelabs.co', '')] = { error: String(err) }
    }
  }

  return NextResponse.json({ apiKeyPrefix: apiKey.slice(0, 8) + '…', results })
}
