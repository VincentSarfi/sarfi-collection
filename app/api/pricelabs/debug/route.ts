import { NextResponse } from 'next/server'

async function tryFetch(label: string, url: string, headers: Record<string, string>) {
  try {
    const res = await fetch(url, { headers, cache: 'no-store' })
    const text = await res.text()
    let body: unknown = null
    try { body = JSON.parse(text) } catch { body = text.slice(0, 300) }
    return { label, status: res.status, body }
  } catch (err) {
    return { label, error: String(err) }
  }
}

export async function GET() {
  const plKey     = process.env.PRICELABS_API_KEY ?? ''
  const smoobuKey = process.env.SMOOBU_API_KEY ?? ''
  const id        = '2610828'
  const start     = '2026-04-07'
  const end       = '2026-05-07'

  const sh = { 'Api-Key': smoobuKey, 'Content-Type': 'application/json' }
  const ph = { 'X-API-Key': plKey, 'Content-Type': 'application/json' }

  const tests = await Promise.all([
    // ── Smoobu rate endpoints ─────────────────────────────────────────────
    tryFetch('Smoobu: GET /apartments/{id}/rates', `https://login.smoobu.com/api/apartments/${id}/rates?startDate=${start}&endDate=${end}`, sh),
    tryFetch('Smoobu: GET /apartments/{id}/rates (from/to)', `https://login.smoobu.com/api/apartments/${id}/rates?from=${start}&to=${end}`, sh),
    tryFetch('Smoobu: GET /apartments/{id}/calendar', `https://login.smoobu.com/api/apartments/${id}/calendar?startDate=${start}&endDate=${end}`, sh),
    tryFetch('Smoobu: GET /apartments/{id}/availability', `https://login.smoobu.com/api/apartments/${id}/availability?startDate=${start}&endDate=${end}`, sh),
    tryFetch('Smoobu: GET /apartments/{id} (single listing)', `https://login.smoobu.com/api/apartments/${id}`, sh),
    // ── PriceLabs POST listing_prices ─────────────────────────────────────
    tryFetch('PriceLabs: POST /v1/listing_prices', 'https://api.pricelabs.co/v1/listing_prices', ph),
  ])

  // Also try Smoobu POST /rates with body
  try {
    const res = await fetch('https://login.smoobu.com/api/rates', {
      method: 'POST',
      headers: sh,
      body: JSON.stringify({ apartments: [{ id: parseInt(id) }], startDate: start, endDate: end }),
      cache: 'no-store',
    })
    const text = await res.text()
    let body: unknown = null
    try { body = JSON.parse(text) } catch { body = text.slice(0, 300) }
    tests.push({ label: 'Smoobu: POST /rates (body)', status: res.status, body })
  } catch (err) {
    tests.push({ label: 'Smoobu: POST /rates', error: String(err) } as never)
  }

  return NextResponse.json({ tests })
}
