import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Proxy zum digitalen Meldeschein im Dashboard (gleiche Bauart wie
// app/api/late-checkout: serverseitig, kein CORS, Rate-Limit hier). Der Gast
// authentifiziert sich allein über den Token `b` (Link aus der Gästenachricht)
// oder `u` (QR-Code in der Einheit bzw. vierteilig der Link aus der Smoobu-
// Check-in-Vorlage mit Buchungs-ID und PIN) — geprüft wird im Dashboard, hier
// wird nichts davon zerlegt oder geloggt. Dasselbe gilt für das Schein-Token
// je weiterer Person (`personToken`, beim Status `personTokens`): Der Proxy
// reicht es nur durch, Format und Zugehörigkeit prüft das Dashboard. Ebenso nur
// durchgereicht: `nurWennFrei` (den ersten Schein nur schreiben, solange niemand
// damit angefangen hat), `nurIch` bei „deutsch“ und der Familienname, mit dem
// ein anderes Gerät den ersten Schein bestätigen will.
// Der Body kann ein Ausweisfoto als data-URL enthalten (bis ~8 MB).
const BASE =
  process.env.MELDESCHEIN_API_URL ||
  'https://dashboard.sarfi.group/api/public/meldeschein'

const MAX_BODY = 9 * 1024 * 1024

function str(value: unknown, maxLen: number): string {
  return typeof value === 'string' ? value.slice(0, maxLen) : ''
}

// 100 statt 40: Eine Monteurgruppe meldet sich nacheinander über ein Handy oder
// über das gemeinsame WLAN der Unterkunft an, also mit einer IP für alle.
function rateLimited(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = rateLimit(`meldeschein:${ip}`, 100, 10 * 60 * 1000)
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

const AKTIONEN = ['status', 'deutsch', 'ausweis-lesen', 'einreichen', 'bestaetigung-starten', 'bestaetigen']
// So viele Schein-Tokens nimmt das Dashboard je Status-Abfrage an: Hauptschein und bis zu 24 weitere.
const MAX_SCHEIN_TOKENS = 25

// Status per POST mit dem Token im Rumpf statt als Query: so steht er nur in der
// ersten Seiten-URL und nicht zusätzlich in Proxy- und Ingress-Logs.
// Übergang: Kennt das Dashboard POST /status noch nicht (dessen Sammel-404 hat
// kein `ok`), einmal wie bisher per GET fragen. Entfällt, sobald es live ist.
async function statusAbfragen(t: Record<string, string>, personTokens: string[]) {
  let r = await fetch(`${BASE}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(personTokens.length ? { ...t, personTokens } : t),
    cache: 'no-store',
  })
  let data = await r.json()
  if (r.status === 404 && data && data.ok === undefined) {
    r = await fetch(`${BASE}/status?${new URLSearchParams(t).toString()}`, { cache: 'no-store' })
    data = await r.json()
  }
  return NextResponse.json(data, { status: r.status })
}

// Übergang für noch offene Seiten mit dem alten Widget (Status per GET).
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

// Mitreisende Ehe-/Lebenspartner und minderjährige Kinder stehen nur der Zahl
// nach auf dem Schein (§ 29 Abs. 2 Satz 2 BMG, BeherbMeldV Anlage Nr. 8):
// AnzahlAngehoerige. Ein altes Widget schickt noch eine Liste mit
// Staatsangehörigkeiten; davon geht nur die Anzahl weiter.
function anzahlAngehoerige(raw: Record<string, unknown>): number {
  const n = typeof raw.anzahlAngehoerige === 'number' ? raw.anzahlAngehoerige
    : Array.isArray(raw.mitreisende) ? raw.mitreisende.length : 0
  return Number.isInteger(n) ? Math.min(12, Math.max(0, n)) : 0
}

// Gegliederte Anschrift wie im Datensatz nach BeherbMeldV (Typ Adresse).
// Länder- und Staatencodes auf drei Zeichen statt zwei: Ein ausgeschriebener
// Name („Polen“) soll im Dashboard als Fehler auffallen, statt gekürzt („PO“)
// wie ein Code durchzugehen.
const ANSCHRIFT_TEILE = ['land', 'plz', 'ort', 'strasse', 'hausnummer'] as const
function anschriftTeile(roh: unknown): Record<string, string> | null {
  if (!roh || typeof roh !== 'object') return null
  const x = roh as Record<string, unknown>
  return Object.fromEntries(ANSCHRIFT_TEILE.map((k) => [k, str(x[k], k === 'land' ? 3 : 120)]))
}

export async function POST(request: NextRequest) {
  const limited = rateLimited(request)
  if (limited) return limited
  const laenge = Number(request.headers.get('content-length') || 0)
  if (laenge > MAX_BODY) return NextResponse.json({ ok: false, error: 'Anfrage zu groß.' }, { status: 413 })
  try {
    const raw = await request.json()
    const action = str(raw.action, 20)
    if (!AKTIONEN.includes(action)) {
      return NextResponse.json({ ok: false, error: 'Unbekannte Aktion.' }, { status: 422 })
    }
    const t = tokenParams(raw)
    if (!t) return NextResponse.json({ ok: false, error: 'Unbekannter Link.' }, { status: 404 })
    if (action === 'status') {
      const tokens = Array.isArray(raw.personTokens)
        ? (raw.personTokens as unknown[]).slice(0, MAX_SCHEIN_TOKENS).map((x) => str(x, 64)).filter(Boolean)
        : []
      return await statusAbfragen(t, tokens)
    }

    // Nur erwartete Felder mit Längenlimits durchreichen (kein Roh-Body)
    const body: Record<string, unknown> = { ...t }
    if (typeof raw.personToken === 'string') body.personToken = str(raw.personToken, 64)
    if (action === 'einreichen') {
      // Art und ausstellender Staat des Dokuments gehen nicht mehr weiter, auch
      // wenn ein altes Widget sie schickt: Sie dienen nur dem Abgleich mit dem
      // Foto und dürfen nicht gespeichert werden (§ 30 Abs. 2 BMG).
      for (const k of ['familienname', 'vorname', 'geburtsdatum', 'staatsangehoerigkeit', 'anschrift', 'passnummer']) {
        body[k] = str(raw[k], 240)
      }
      body.staatsangehoerigkeiten = Array.isArray(raw.staatsangehoerigkeiten)
        ? (raw.staatsangehoerigkeiten as unknown[]).slice(0, 3).map((x) => str(x, 3)).filter(Boolean)
        : []
      const teile = anschriftTeile(raw.anschriftTeile)
      if (teile) body.anschriftTeile = teile
      body.anzahlAngehoerige = anzahlAngehoerige(raw)
      if (typeof raw.ausweisFoto === 'string' && raw.ausweisFoto) body.ausweisFoto = str(raw.ausweisFoto, 8 * 1024 * 1024)
    }
    if (action === 'ausweis-lesen') body.ausweisFoto = str(raw.ausweisFoto, 8 * 1024 * 1024)
    // Einwilligung (Foto + Texterkennung) nur als echtes Boolean weiterreichen;
    // ohne sie lehnt das Dashboard /ausweis-lesen und /einreichen ab.
    if (action === 'ausweis-lesen' || action === 'einreichen') body.einwilligung = raw.einwilligung === true
    if (action === 'bestaetigen') body.setupIntentId = str(raw.setupIntentId, 80)
    if (['deutsch', 'ausweis-lesen', 'einreichen'].includes(action) && raw.nurWennFrei === true) body.nurWennFrei = true
    if (action === 'deutsch' && raw.nurIch === true) body.nurIch = true
    if (action === 'bestaetigung-starten' && typeof raw.familienname === 'string') body.familienname = str(raw.familienname, 80)

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
