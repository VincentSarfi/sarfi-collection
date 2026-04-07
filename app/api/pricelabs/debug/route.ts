import { NextResponse } from 'next/server'

export async function GET() {
  const smoobuId  = '2610828'
  const startDate = '2026-04-07'
  const endDate   = '2026-05-07'
  const apiKey    = process.env.PRICELABS_API_KEY ?? ''

  const results: Record<string, unknown> = {}

  // ── 1. Try different auth methods on listing_prices ──────────────────────
  const authVariants = [
    { name: 'X-API-Key header', headers: { 'X-API-Key': apiKey } },
    { name: 'Authorization Bearer', headers: { 'Authorization': `Bearer ${apiKey}` } },
    { name: 'api_key query param', headers: {}, extra: `&api_key=${apiKey}` },
  ]

  for (const v of authVariants) {
    const url = `https://api.pricelabs.co/v1/listing_prices?integration=smoobu&listing_ids=${smoobuId}&start_date=${startDate}&end_date=${endDate}${v.extra ?? ''}`
    try {
      const res = await fetch(url, { headers: { 'Content-Type': 'application/json', ...v.headers }, cache: 'no-store' })
      const text = await res.text()
      let body: unknown = null
      try { body = JSON.parse(text) } catch { body = text.slice(0, 300) }
      results[`listing_prices [${v.name}]`] = { status: res.status, body }
    } catch (err) {
      results[`listing_prices [${v.name}]`] = { error: String(err) }
    }
  }

  // ── 2. Try to get PriceLabs listing IDs ──────────────────────────────────
  const listingEndpoints = [
    'https://api.pricelabs.co/v1/listings',
    'https://api.pricelabs.co/v1/user_listings',
    'https://api.pricelabs.co/v1/properties',
  ]

  for (const url of listingEndpoints) {
    try {
      const res = await fetch(url, { headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' }, cache: 'no-store' })
      const text = await res.text()
      let body: unknown = null
      try { body = JSON.parse(text) } catch { body = text.slice(0, 300) }
      results[url.replace('https://api.pricelabs.co', '')] = { status: res.status, body }
    } catch (err) {
      results[url.replace('https://api.pricelabs.co', '')] = { error: String(err) }
    }
  }

  return NextResponse.json({ apiKeyPrefix: apiKey.slice(0, 8) + '…', results })
}
