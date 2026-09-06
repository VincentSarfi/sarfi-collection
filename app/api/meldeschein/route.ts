import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Proxy zum digitalen Meldeschein im Dashboard (gleiche Bauart wie
// app/api/late-checkout: serverseitig, kein CORS, Rate-Limit hier). Der Gast
// authentifiziert sich allein über den HMAC-Token `b` (Link aus der
// Gästenachricht) oder `u` (QR-Code in der Einheit) — geprüft wird im Dashboard.
// Der Body kann ein Ausweisfoto als data-URL enthalten (bis ~8 MB).
const BASE =
  process.env.MELDESCHEIN_API_URL ||
  'https://dashboard.sarfi.group/api/public/meldeschein'

const MAX_BODY = 9 * 1024 * 1024

function str(value: unknown, maxLen: number): string {
  return typeof value === 'string' ? value.slice(0, maxLen) : ''
}

function rateLimited(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = rateLimit(`meldeschein:${ip}`, 40, 10 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Zu viele Anfragen. Bitte warte kurz und versuche es erneut.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }
  return null
}

function tokenParams(src: { b?: unknown; u?: unknown }): Record<string, string> | null {
  const b = str(src.b, 60)
  const u = str(src.u, 60)
  return b ? { b } : u ? { u } : null
}

export async function GET(request: NextRequest) {
  const limited = rateLimited(request)
  if (limited) return limited
  const t = tokenParams({ b: request.nextUrl.searchParams.get('b'), u: request.nextUrl.searchParams.get('u') })
  if (!t) return NextResponse.json({ ok: false, error: 'Unbekannter Link.' }, { status: 404 })
  const qs = new URLSearchParams(t).toString()
  try {
    const r = await fetch(`${BASE}/status?${qs}`, { cache: 'no-store' })
    const data = await r.json()
    return NextResponse.json(data, { status: r.status })
  } catch {
    return NextResponse.json({ ok: false, error: 'Service nicht erreichbar.' }, { status: 502 })
  }
}

type Mitreisender = { name: string; geburtsdatum: string; staat: string }

export async function POST(request: NextRequest) {
  const limited = rateLimited(request)
  if (limited) return limited
  const laenge = Number(request.headers.get('content-length') || 0)
  if (laenge > MAX_BODY) return NextResponse.json({ ok: false, error: 'Anfrage zu groß.' }, { status: 413 })
  try {
    const raw = await request.json()
    const action = str(raw.action, 20)
    if (!['deutsch', 'ausweis-lesen', 'einreichen', 'bestaetigung-starten', 'bestaetigen'].includes(action)) {
      return NextResponse.json({ ok: false, error: 'Unbekannte Aktion.' }, { status: 422 })
    }
    const t = tokenParams(raw)
    if (!t) return NextResponse.json({ ok: false, error: 'Unbekannter Link.' }, { status: 404 })

    // Nur erwartete Felder mit Längenlimits durchreichen (kein Roh-Body)
    const body: Record<string, unknown> = { ...t }
    if (action === 'einreichen') {
      for (const k of ['familienname', 'vorname', 'geburtsdatum', 'staatsangehoerigkeit', 'anschrift', 'ausweisArt', 'passnummer', 'ausstellendesLand']) {
        body[k] = str(raw[k], 240)
      }
      body.mitreisende = Array.isArray(raw.mitreisende)
        ? (raw.mitreisende as unknown[]).slice(0, 12).map((m) => {
            const x = (m ?? {}) as Partial<Mitreisender>
            return { name: str(x.name, 120), geburtsdatum: str(x.geburtsdatum, 10), staat: str(x.staat, 2) }
          })
        : []
      if (typeof raw.ausweisFoto === 'string' && raw.ausweisFoto) body.ausweisFoto = str(raw.ausweisFoto, 8 * 1024 * 1024)
    }
    if (action === 'ausweis-lesen') body.ausweisFoto = str(raw.ausweisFoto, 8 * 1024 * 1024)
    if (action === 'bestaetigen') body.setupIntentId = str(raw.setupIntentId, 80)

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
