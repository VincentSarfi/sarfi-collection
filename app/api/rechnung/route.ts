import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Proxy zur Rechnungs-Engine im Dashboard (Railway). Hält die Dashboard-URL
// serverseitig (kein CORS, Dashboard-Adresse nicht im Client sichtbar).
// INVOICE_API_URL = https://<dashboard>/api/public/invoice-request
const BASE = process.env.INVOICE_API_URL

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(value: unknown, maxLen: number): string {
  return typeof value === 'string' ? value.slice(0, maxLen) : ''
}

function rateLimited(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = rateLimit(`rechnung:${ip}`, 10, 10 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Zu viele Anfragen. Bitte warte kurz und versuche es erneut.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }
  return null
}

export async function GET(request: NextRequest) {
  if (!BASE) {
    return NextResponse.json({ ok: false, error: 'Rechnungsservice nicht konfiguriert.' }, { status: 503 })
  }
  const limited = rateLimited(request)
  if (limited) return limited
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
  const limited = rateLimited(request)
  if (limited) return limited
  try {
    const raw = await request.json()

    const email = str(raw.email, 254).trim()
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: 'Ungültige E-Mail-Adresse.' }, { status: 422 })
    }

    // Nur erwartete Felder mit Längenlimits durchreichen (kein Roh-Body)
    const body = {
      res:     str(raw.res, 100),
      t:       str(raw.t, 200),
      firma:   str(raw.firma, 200),
      ustId:   str(raw.ustId, 30),
      strasse: str(raw.strasse, 200),
      plz:     str(raw.plz, 10),
      ort:     str(raw.ort, 100),
      email,
    }

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
