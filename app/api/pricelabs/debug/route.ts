import { NextResponse } from 'next/server'

export async function GET() {
  const smoobuKey = process.env.SMOOBU_API_KEY ?? ''
  const id        = 2610828
  const start     = '2026-04-07'
  const end       = '2026-05-07'

  const sh = {
    'Api-Key': smoobuKey,
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  }

  async function postRates(label: string, body: unknown) {
    try {
      const res = await fetch('https://login.smoobu.com/api/rates', {
        method: 'POST', headers: sh,
        body: JSON.stringify(body), cache: 'no-store',
      })
      const text = await res.text()
      let parsed: unknown = null
      try { parsed = JSON.parse(text) } catch { parsed = text.slice(0, 300) }
      return { label, status: res.status, body: parsed }
    } catch (err) {
      return { label, error: String(err) }
    }
  }

  async function getRates(label: string, url: string) {
    try {
      const res = await fetch(url, { headers: sh, cache: 'no-store' })
      const text = await res.text()
      let parsed: unknown = null
      try { parsed = JSON.parse(text) } catch { parsed = text.slice(0, 300) }
      return { label, status: res.status, body: parsed }
    } catch (err) {
      return { label, error: String(err) }
    }
  }

  const tests = await Promise.all([
    // POST /api/rates with various body formats
    postRates('POST /rates: apartment_ids array', { apartment_ids: [id], start_date: start, end_date: end }),
    postRates('POST /rates: apartment_id singular', { apartment_id: id, start_date: start, end_date: end }),
    postRates('POST /rates: ids array', { ids: [id], start_date: start, end_date: end }),
    postRates('POST /rates: listing camelCase dates', { apartments: [id], startDate: start, endDate: end }),
    postRates('POST /rates: minimal - just id + dates', { id, startDate: start, endDate: end }),
    postRates('POST /rates: channelId added', { apartments: [{ id }], channelId: 16, startDate: start, endDate: end }),
    postRates('POST /rates: string id', { apartments: [String(id)], startDate: start, endDate: end }),

    // GET /api/rates with query params
    getRates('GET /api/rates?apartmentId', `https://login.smoobu.com/api/rates?apartmentId=${id}&startDate=${start}&endDate=${end}`),
    getRates('GET /api/rates?apartment_id', `https://login.smoobu.com/api/rates?apartment_id=${id}&start_date=${start}&end_date=${end}`),

    // Smoobu settings endpoint - list all channels/rate plans
    getRates('GET /api/channel-manager/rates', `https://login.smoobu.com/api/channel-manager/rates?apartmentId=${id}`),
  ])

  return NextResponse.json({ tests })
}
