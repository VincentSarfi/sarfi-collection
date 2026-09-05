import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Proxy zum Late-Checkout-Widget im Dashboard (gleiche Bauart wie
// app/api/rechnung: serverseitig, kein CORS, Rate-Limit hier). Der Gast
// authentifiziert sich allein über den HMAC-Token `u` aus dem gedruckten
// QR-Code — geprüft wird der im Dashboard.
// Optional übersteuerbar via LATE_CHECKOUT_API_URL.
const BASE =
  process.env.LATE_CHECKOUT_API_URL ||
  'https://dashboard.sarfi.group/api/public/late-checkout'

function str(value: unknown, maxLen: number): string {
  return typeof value === 'string' ? value.slice(0, maxLen) : ''
}

function rateLimited(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = rateLimit(`late-checkout:${ip}`, 30, 10 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Zu viele Anfragen. Bitte warte kurz und versuche es erneut.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }
  return null
}

// Verfügbarkeit / Zustand (Late Checkout + Verlängerung)
export async function GET(request: NextRequest) {
  const limited = rateLimited(request)
  if (limited) return limited
  const u = request.nextUrl.searchParams.get('u') ?? ''
  try {
    const r = await fetch(`${BASE}/status?u=${encodeURIComponent(u)}`, { cache: 'no-store' })
    const data = await r.json()
    return NextResponse.json(data, { status: r.status })
  } catch {
    return NextResponse.json({ ok: false, error: 'Service nicht erreichbar.' }, { status: 502 })
  }
}

// action 'order' → Stripe-Zahlungslink anlegen; action 'confirm' → Zahlung
// serverseitig gegen Stripe prüfen (beliebig oft aufrufbar, ohne echte
// Zahlung passiert nichts).
export async function POST(request: NextRequest) {
  const limited = rateLimited(request)
  if (limited) return limited
  try {
    const raw = await request.json()
    const action = str(raw.action, 20)
    if (action !== 'order' && action !== 'confirm') {
      return NextResponse.json({ ok: false, error: 'Unbekannte Aktion.' }, { status: 422 })
    }

    // Nur erwartete Felder mit Längenlimits durchreichen (kein Roh-Body)
    const body: Record<string, unknown> = { u: str(raw.u, 60) }
    if (action === 'order') {
      body.art = str(raw.art, 20) || 'late_checkout'
      const naechte = Number(raw.naechte)
      if (Number.isInteger(naechte) && naechte >= 1 && naechte <= 30) body.naechte = naechte
    }

    const r = await fetch(`${BASE}/${action}`, {
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
