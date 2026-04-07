import { NextResponse } from 'next/server'

async function t(label: string, url: string, key: string) {
  try {
    const res = await fetch(url, {
      headers: { 'X-API-Key': key, 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    const text = await res.text()
    let body: unknown = null
    try { body = JSON.parse(text) } catch { body = text.slice(0, 200) }
    return { label, status: res.status, body }
  } catch (err) {
    return { label, error: String(err) }
  }
}

export async function GET() {
  const key   = process.env.PRICELABS_API_KEY ?? ''
  const id    = '2610828'
  const start = '2026-04-07'
  const end   = '2026-06-07'

  const tests = await Promise.all([
    // Try app.pricelabs.co instead of api.pricelabs.co
    t('app /v1/listing_prices', `https://app.pricelabs.co/api/v1/listing_prices?listing_ids=${id}&start_date=${start}&end_date=${end}`, key),
    t('app /api/listing_prices', `https://app.pricelabs.co/api/listing_prices?listing_ids=${id}&start_date=${start}&end_date=${end}`, key),
    // Try array format
    t('api listing_prices array []', `https://api.pricelabs.co/v1/listing_prices?listing_ids[]=${id}&start_date=${start}&end_date=${end}`, key),
    // Try with dates without dashes
    t('api listing_prices no-dash dates', `https://api.pricelabs.co/v1/listing_prices?listing_ids=${id}&start_date=20260407&end_date=20260607`, key),
    // Try GET on /v1/listings/id/prices
    t('api /listings/{id}/prices', `https://api.pricelabs.co/v1/listings/${id}/prices?start_date=${start}&end_date=${end}`, key),
    t('api /listings/{id}/calendar', `https://api.pricelabs.co/v1/listings/${id}/calendar?start_date=${start}&end_date=${end}`, key),
  ])

  return NextResponse.json({ tests })
}
