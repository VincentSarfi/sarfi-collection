import { NextResponse } from 'next/server'

async function tryFetch(label: string, url: string, apiKey: string) {
  try {
    const res = await fetch(url, {
      headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    const text = await res.text()
    let body: unknown = null
    try { body = JSON.parse(text) } catch { body = text.slice(0, 300) }
    return { label, status: res.status, body }
  } catch (err) {
    return { label, error: String(err) }
  }
}

export async function GET() {
  const apiKey    = process.env.PRICELABS_API_KEY ?? ''
  const id        = '2610828'
  const start     = '2026-04-07'
  const end       = '2026-05-07'
  const base      = 'https://api.pricelabs.co/v1'

  const tests = await Promise.all([
    // Try ID in path
    tryFetch('listing_prices/{id}', `${base}/listing_prices/${id}?start_date=${start}&end_date=${end}`, apiKey),
    // Try different param name
    tryFetch('listing_prices?ids=', `${base}/listing_prices?ids=${id}&start_date=${start}&end_date=${end}`, apiKey),
    tryFetch('listing_prices?listing_id=', `${base}/listing_prices?listing_id=${id}&start_date=${start}&end_date=${end}`, apiKey),
    // Try different endpoint names
    tryFetch('prices?listing_ids=', `${base}/prices?listing_ids=${id}&start_date=${start}&end_date=${end}`, apiKey),
    tryFetch('calendar?listing_id=', `${base}/calendar?listing_id=${id}&start_date=${start}&end_date=${end}`, apiKey),
    tryFetch('nightly_prices', `${base}/nightly_prices?listing_ids=${id}&start_date=${start}&end_date=${end}`, apiKey),
    tryFetch('pricing?listing_id=', `${base}/pricing?listing_id=${id}&start_date=${start}&end_date=${end}`, apiKey),
    tryFetch('listing_calendar', `${base}/listing_calendar?listing_ids=${id}&start_date=${start}&end_date=${end}`, apiKey),
    // Try listing_prices with listing_ids but no integration
    tryFetch('listing_prices listing_ids no integration', `${base}/listing_prices?listing_ids=${id}&start_date=${start}&end_date=${end}`, apiKey),
    // Listings endpoint returns data with min/base/max - maybe that's all we get
    tryFetch('listings/{id}', `${base}/listings/${id}`, apiKey),
  ])

  return NextResponse.json({ tests })
}
