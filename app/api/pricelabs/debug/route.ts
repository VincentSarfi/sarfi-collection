import { NextResponse } from 'next/server'

async function tryFetch(url: string, headers: Record<string, string>) {
  try {
    const res = await fetch(url, { headers, cache: 'no-store' })
    const text = await res.text()
    let body: unknown = null
    try { body = JSON.parse(text) } catch { body = text.slice(0, 400) }
    return { status: res.status, body }
  } catch (err) {
    return { error: String(err) }
  }
}

export async function GET() {
  const apiKey = process.env.PRICELABS_API_KEY ?? ''
  const h      = { 'X-API-Key': apiKey, 'Content-Type': 'application/json' }

  const startDate = '2026-04-07'
  const endDate   = '2026-06-07'

  const results: Record<string, unknown> = {}

  // ── Step 1: Find our listings in PriceLabs ───────────────────────────────
  results['GET /v1/listings (no params)'] =
    await tryFetch('https://api.pricelabs.co/v1/listings', h)

  results['GET /v1/user_listings'] =
    await tryFetch('https://api.pricelabs.co/v1/user_listings', h)

  results['GET /v1/listing_prices (no params)'] =
    await tryFetch('https://api.pricelabs.co/v1/listing_prices', h)

  results['GET /v1/listing_prices?start_date&end_date only'] =
    await tryFetch(`https://api.pricelabs.co/v1/listing_prices?start_date=${startDate}&end_date=${endDate}`, h)

  // ── Step 2: Try listing_prices with smoobu integration explicitly ────────
  results['GET /v1/listing_prices smoobu no listing_ids'] =
    await tryFetch(`https://api.pricelabs.co/v1/listing_prices?integration=smoobu&start_date=${startDate}&end_date=${endDate}`, h)

  // ── Step 3: Different auth methods ───────────────────────────────────────
  results['GET /v1/listings Bearer auth'] =
    await tryFetch('https://api.pricelabs.co/v1/listings',
      { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' })

  results['GET /v1/listings api_key param'] =
    await tryFetch(`https://api.pricelabs.co/v1/listings?api_key=${apiKey}`, { 'Content-Type': 'application/json' })

  return NextResponse.json({
    apiKeyPrefix: apiKey.slice(0, 8) + '…',
    apiKeyLength: apiKey.length,
    results,
  })
}
