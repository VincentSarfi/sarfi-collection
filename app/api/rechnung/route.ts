import { NextRequest, NextResponse } from 'next/server'

// Proxy zur Rechnungs-Engine im Dashboard (Railway). Hält die Dashboard-URL
// serverseitig (kein CORS, Dashboard-Adresse nicht im Client sichtbar).
// INVOICE_API_URL = https://<dashboard>/api/public/invoice-request
const BASE = process.env.INVOICE_API_URL

export async function GET(request: NextRequest) {
  if (!BASE) {
    return NextResponse.json({ ok: false, error: 'Rechnungsservice nicht konfiguriert.' }, { status: 503 })
  }
  const res = request.nextUrl.searchParams.get('res') ?? ''
  const t = request.nextUrl.searchParams.get('t') ?? ''
  try {
    const r = await fetch(`${BASE}?res=${encodeURIComponent(res)}&t=${encodeURIComponent(t)}`, { cache: 'no-store' })
    const data = await r.json()
    return NextResponse.json(data, { status: r.status })
  } catch {
    return NextResponse.json({ ok: false, error: 'Service nicht erreichbar.' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  if (!BASE) {
    return NextResponse.json({ ok: false, error: 'Rechnungsservice nicht konfiguriert.' }, { status: 503 })
  }
  try {
    const body = await request.json()
    const r = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await r.json()
    return NextResponse.json(data, { status: r.status })
  } catch {
    return NextResponse.json({ ok: false, error: 'Service nicht erreichbar.' }, { status: 502 })
  }
}
