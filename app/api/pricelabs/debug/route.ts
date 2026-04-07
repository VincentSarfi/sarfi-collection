import { NextResponse } from 'next/server'

async function t(label: string, url: string, key: string) {
  try {
    const res = await fetch(url, {
      headers: { 'X-API-Key': key, 'Content-Type': 'application/json' },
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
  const key   = process.env.PRICELABS_API_KEY ?? ''
  const id    = '2610828'
  const start = '2026-04-07'
  const end   = '2026-06-07'
  const base  = `https://api.pricelabs.co/v1/listings/${id}`

  const tests = await Promise.all([
    // /prices with different param names
    t('/prices no params',            `${base}/prices`, key),
    t('/prices from/to',              `${base}/prices?from=${start}&to=${end}`, key),
    t('/prices date/end_date',        `${base}/prices?date=${start}&end_date=${end}`, key),
    t('/prices month',                `${base}/prices?month=2026-04`, key),
    t('/prices months',               `${base}/prices?months=2026-04,2026-05,2026-06`, key),
    t('/prices num_months',           `${base}/prices?num_months=3`, key),
    // /calendar with different param names
    t('/calendar no params',          `${base}/calendar`, key),
    t('/calendar from/to',            `${base}/calendar?from=${start}&to=${end}`, key),
    t('/calendar month',              `${base}/calendar?month=2026-04`, key),
    t('/calendar num_months',         `${base}/calendar?num_months=3`, key),
    t('/calendar start/end',          `${base}/calendar?start=${start}&end=${end}`, key),
    t('/calendar start_date/end_date',`${base}/calendar?start_date=${start}&end_date=${end}`, key),
  ])

  return NextResponse.json({ tests })
}
