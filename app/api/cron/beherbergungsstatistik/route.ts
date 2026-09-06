import { createHash, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { smoobuHeaders } from '@/lib/smoobu-auth'
import { PROPERTY_CONFIGS, resolveSmoobuId } from '@/config/properties.config'
import { escapeHtml } from '@/lib/escape'

/**
 * Monatliche Beherbergungsstatistik (Ankünfte + Übernachtungen).
 *
 * Zweck:
 *  1. Formlose Monatsmeldung an die Gemeinde Schöfweg (Haus Schönblick) –
 *     Mail vom Rathaus (Frau Zitzelsperger, Touristinfo): „Anzahl der Ankünfte
 *     und Übernachtungen monatlich, formlos, per E-Mail".
 *  2. Vorbereitung der Pflichtmeldung nach dem Beherbergungsstatistikgesetz
 *     (BeherbStatG, ab 10 Schlafgelegenheiten) ans Bayerische Landesamt für
 *     Statistik – dort nach Wohnsitzland der Gäste. Die Meldung selbst läuft
 *     über das IDEV-Portal; diese Mail liefert die Zahlen zum Eintippen.
 *
 * Datenquelle: Smoobu GET /reservations (alle Apartments). Zählweise wie in
 * der amtlichen Statistik: Ankünfte = im Berichtsmonat angereiste Personen,
 * Übernachtungen = Personen × Nächte, die im Berichtsmonat liegen (Aufenthalte
 * über den Monatswechsel werden anteilig gezählt).
 *
 * Herkunftsland: Smoobu kennt das Land nicht zuverlässig (Portale liefern
 * keins, Direktbuchungen werden von der Website fest als DE angelegt). Daher
 * Heuristik über die Telefon-Vorwahl; ohne verwertbare Nummer „unbekannt".
 *
 * Läuft einmal im Monat (z. B. am 2. um 06:00) als externer Cron gegen diese
 * Route. Auth: Authorization: Bearer <CRON_SECRET>.
 *
 * Empfänger: STATISTIK_MAIL_TO (Standard: hallo@sarfi-collection.de). Die Mail
 * geht bewusst an Vincent und nicht direkt ans Rathaus – kurz prüfen, dann
 * weiterleiten (oder STATISTIK_MAIL_TO auf die Gemeinde-Adresse setzen).
 *
 * Aufenthalte desselben Gastes, die im selben Apartment nahtlos aneinander
 * anschließen (z. B. wochenweise gebuchte Monteure), werden zu EINEM
 * Aufenthalt verschmolzen – sonst zählt jede Verlängerung als neue Ankunft.
 *
 * Manuelle / Test-Aufrufe (zusätzlich zum Bearer-Header):
 *   ?month=YYYY-MM              → Berichtsmonat (Standard: Vormonat)
 *   ?from=YYYY-MM&to=YYYY-MM    → Nachmeldung: Monatstabelle über den Zeitraum
 *   ?mailto=<email>             → Empfänger überschreiben
 *   ?dry=1                      → nichts senden, nur JSON mit den Zahlen
 */

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SMOOBU_BASE = 'https://login.smoobu.com/api'
const DEFAULT_TO = 'hallo@sarfi-collection.de'

// Lazy: sonst wirft `new Resend(undefined)` schon beim `next build`.
const getResend = () => new Resend(process.env.RESEND_API_KEY)

// ─── Typen ───────────────────────────────────────────────────────────────────

type SmoobuBooking = {
  id: number
  type?: string
  arrival?: string
  departure?: string
  apartment?: { id?: number; name?: string }
  channel?: { name?: string }
  adults?: number
  children?: number
  phone?: string | null
  email?: string | null
  'guest-name'?: string | null
  language?: string | null
  'is-blocked-booking'?: boolean
}

type Group = 'schoenblick' | 'haus28' | 'other'

type Stats = {
  /** Aufenthalte, die im Monat begonnen haben (nach Verschmelzen) */
  bookings: number
  /** angereiste Personen (amtliche Zählweise) */
  arrivals: number
  /** Personen × Nächte im Monat */
  nights: number
  /** Aufenthalte, die den Monat berühren */
  stays: number
  byApartment: Record<string, { arrivals: number; nights: number }>
  byCountry: Record<string, { arrivals: number; nights: number }>
}

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

/** Timing-sicherer Vergleich zweier Strings (über SHA-256-Hashes). */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function addDaysUtc(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return isoDate(d)
}

/** Vormonat als YYYY-MM (Bezug: heute, UTC). */
function previousMonth(): string {
  const now = new Date()
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

function monthRange(month: string): { start: string; endExclusive: string; days: number } {
  const [y, m] = month.split('-').map(Number)
  const start = new Date(Date.UTC(y, m - 1, 1))
  const next = new Date(Date.UTC(y, m, 1))
  return {
    start: isoDate(start),
    endExclusive: isoDate(next),
    days: Math.round((next.getTime() - start.getTime()) / 86_400_000),
  }
}

const MONTH_NAMES = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
  'August', 'September', 'Oktober', 'November', 'Dezember']

function monthLabel(month: string): string {
  const [y, m] = month.split('-').map(Number)
  return `${MONTH_NAMES[m - 1]} ${y}`
}

/** Apartment-ID → Gruppe + Kurzname aus der zentralen Objekt-Konfiguration. */
function classifyApartment(apartmentId: number | undefined, name: string | undefined) {
  const id = String(apartmentId ?? '')
  for (const cfg of Object.values(PROPERTY_CONFIGS)) {
    if (resolveSmoobuId(cfg) === id) {
      const group: Group = cfg.id === 'haus28' ? 'haus28' : 'schoenblick'
      return { group, label: cfg.name, beds: cfg.maxGuests }
    }
  }
  return { group: 'other' as Group, label: name ?? `Apartment ${id}`, beds: 0 }
}

/**
 * Telefon-Vorwahl → ISO-Ländercode. Längster passender Präfix gewinnt.
 * Bewusst auf die in der Praxis vorkommenden Länder beschränkt.
 */
const DIAL_CODES: Array<[string, string]> = [
  ['1', 'US'], ['7', 'RU'], ['20', 'EG'], ['27', 'ZA'],
  ['30', 'GR'], ['31', 'NL'], ['32', 'BE'], ['33', 'FR'], ['34', 'ES'], ['36', 'HU'],
  ['39', 'IT'], ['40', 'RO'], ['41', 'CH'], ['43', 'AT'], ['44', 'GB'], ['45', 'DK'],
  ['46', 'SE'], ['47', 'NO'], ['48', 'PL'], ['49', 'DE'], ['51', 'PE'], ['52', 'MX'],
  ['54', 'AR'], ['55', 'BR'], ['61', 'AU'], ['64', 'NZ'], ['81', 'JP'], ['82', 'KR'],
  ['86', 'CN'], ['90', 'TR'], ['91', 'IN'], ['92', 'PK'], ['98', 'IR'],
  ['351', 'PT'], ['352', 'LU'], ['353', 'IE'], ['354', 'IS'], ['355', 'AL'],
  ['356', 'MT'], ['357', 'CY'], ['358', 'FI'], ['359', 'BG'], ['370', 'LT'],
  ['371', 'LV'], ['372', 'EE'], ['373', 'MD'], ['374', 'AM'], ['375', 'BY'],
  ['376', 'AD'], ['377', 'MC'], ['380', 'UA'], ['381', 'RS'], ['382', 'ME'],
  ['383', 'XK'], ['385', 'HR'], ['386', 'SI'], ['387', 'BA'], ['389', 'MK'],
  ['420', 'CZ'], ['421', 'SK'], ['423', 'LI'], ['852', 'HK'], ['886', 'TW'],
  ['961', 'LB'], ['962', 'JO'], ['965', 'KW'], ['966', 'SA'], ['971', 'AE'],
  ['972', 'IL'], ['974', 'QA'],
]

const COUNTRY_NAMES: Record<string, string> = {
  DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz', NL: 'Niederlande', BE: 'Belgien',
  CZ: 'Tschechien', PL: 'Polen', IT: 'Italien', FR: 'Frankreich', GB: 'Vereinigtes Königreich',
  US: 'USA', RO: 'Rumänien', HR: 'Kroatien', BG: 'Bulgarien', HU: 'Ungarn', LV: 'Lettland',
  LT: 'Litauen', EE: 'Estland', SK: 'Slowakei', SI: 'Slowenien', DK: 'Dänemark',
  SE: 'Schweden', NO: 'Norwegen', FI: 'Finnland', ES: 'Spanien', PT: 'Portugal',
  LU: 'Luxemburg', IE: 'Irland', UA: 'Ukraine', RS: 'Serbien', TR: 'Türkei',
  GR: 'Griechenland', IL: 'Israel', CN: 'China', IN: 'Indien', AU: 'Australien',
}

function countryFromPhone(phone: string | null | undefined): string | null {
  if (!phone) return null
  let digits = phone.replace(/[^\d+]/g, '')
  if (digits.startsWith('00')) digits = `+${digits.slice(2)}`
  if (!digits.startsWith('+')) {
    // Nationale Schreibweise ohne Landeskennung (z. B. 0176…) → nicht bestimmbar,
    // außer bei typischen deutschen Mobilfunk-/Festnetz-Nummern.
    return /^0[1-9]\d{6,}$/.test(digits) ? 'DE' : null
  }
  const num = digits.slice(1)
  let best: string | null = null
  let bestLen = 0
  for (const [code, iso] of DIAL_CODES) {
    if (num.startsWith(code) && code.length > bestLen) {
      best = iso
      bestLen = code.length
    }
  }
  return best
}

function countryLabel(code: string): string {
  if (code === 'unbekannt') return 'unbekannt (keine verwertbare Telefonnummer)'
  return COUNTRY_NAMES[code] ? `${COUNTRY_NAMES[code]} (${code})` : code
}

function emptyStats(): Stats {
  return { bookings: 0, arrivals: 0, nights: 0, stays: 0, byApartment: {}, byCountry: {} }
}

function bump(map: Record<string, { arrivals: number; nights: number }>, key: string, arrivals: number, nights: number) {
  const cur = map[key] ?? { arrivals: 0, nights: 0 }
  map[key] = { arrivals: cur.arrivals + arrivals, nights: cur.nights + nights }
}

// ─── Smoobu ──────────────────────────────────────────────────────────────────

/**
 * Alle Buchungen, die den Zeitraum berühren. Der from/to-Filter von Smoobu ist
 * bei „modification of booking" in engen Zeiträumen unzuverlässig – deshalb
 * großzügig abfragen und lokal auf den Monat eingrenzen.
 */
async function fetchBookings(from: string, to: string): Promise<SmoobuBooking[]> {
  const all: SmoobuBooking[] = []
  let page = 1
  let pageCount = 1
  do {
    const url = `${SMOOBU_BASE}/reservations?from=${from}&to=${to}&pageSize=100&page=${page}`
    const res = await fetch(url, { headers: smoobuHeaders('GET', url), cache: 'no-store' })
    if (!res.ok) throw new Error(`Smoobu /reservations antwortete ${res.status}`)
    const json = await res.json() as { page_count?: number; bookings?: SmoobuBooking[] }
    all.push(...(json.bookings ?? []))
    pageCount = json.page_count ?? 1
    page++
  } while (page <= pageCount && page <= 20)
  return all
}

// ─── Auswertung ──────────────────────────────────────────────────────────────

type Excluded = { id: number; apartment: string; arrival: string; departure: string; channel: string; reason: string }

type Stay = {
  ids: number[]
  group: Group
  label: string
  arrival: string
  departure: string
  persons: number
  country: string
  channel: string
}

function guestKey(b: SmoobuBooking): string {
  const mail = (b.email ?? '').trim().toLowerCase()
  if (mail) return mail
  return (b['guest-name'] ?? '').trim().toLowerCase().replace(/\s+/g, ' ')
}

/**
 * Buchungen → Aufenthalte: Stornos raus, Blockierungen raus, nahtlos
 * anschließende Buchungen desselben Gastes im selben Apartment verschmelzen.
 */
function toStays(bookings: SmoobuBooking[]): { stays: Stay[]; excluded: Excluded[] } {
  const excluded: Excluded[] = []
  const seen = new Set<number>()
  const raw: Array<Stay & { key: string }> = []

  for (const b of bookings) {
    if (seen.has(b.id)) continue
    seen.add(b.id)
    if (!b.arrival || !b.departure || b.departure <= b.arrival) continue
    const { group, label } = classifyApartment(b.apartment?.id, b.apartment?.name)
    // Stornierungen kommen als eigener Typ. (Die Airbnb-Preisdetails enthalten bei
    // JEDER Buchung Zeilen wie „Cancellation Host Fee" – das ist kein Storno-Indiz.)
    if (b.type === 'cancellation') continue
    if (b['is-blocked-booking']) {
      excluded.push({ id: b.id, apartment: label, arrival: b.arrival, departure: b.departure, channel: b.channel?.name ?? '–', reason: 'Blockierung (keine Gästebuchung)' })
      continue
    }
    raw.push({
      ids: [b.id], group, label, arrival: b.arrival, departure: b.departure,
      persons: Math.max(1, (b.adults ?? 0) + (b.children ?? 0)),
      country: countryFromPhone(b.phone) ?? 'unbekannt',
      channel: b.channel?.name ?? '–',
      key: `${label}|${guestKey(b)}`,
    })
  }

  raw.sort((a, b) => a.key.localeCompare(b.key) || a.arrival.localeCompare(b.arrival))
  const merged: Array<Stay & { key: string }> = []
  for (const cur of raw) {
    const prev = merged[merged.length - 1]
    const hasGuest = cur.key.split('|')[1] !== ''
    if (prev && hasGuest && prev.key === cur.key && prev.departure === cur.arrival) {
      prev.departure = cur.departure
      prev.persons = Math.max(prev.persons, cur.persons)
      prev.ids.push(...cur.ids)
      continue
    }
    merged.push({ ...cur, ids: [...cur.ids] })
  }
  const stays: Stay[] = merged.map(m => {
    const { key, ...stay } = m
    void key
    return stay
  })
  return { stays, excluded }
}

function evaluateMonth(stays: Stay[], month: string): Record<Group, Stats> {
  const { start, endExclusive } = monthRange(month)
  const stats: Record<Group, Stats> = { schoenblick: emptyStats(), haus28: emptyStats(), other: emptyStats() }

  for (const st of stays) {
    let nightsInMonth = 0
    for (let d = st.arrival; d < st.departure; d = addDaysUtc(d, 1)) {
      if (d >= start && d < endExclusive) nightsInMonth++
    }
    const arrivedInMonth = st.arrival >= start && st.arrival < endExclusive
    if (nightsInMonth === 0 && !arrivedInMonth) continue

    const arrivals = arrivedInMonth ? st.persons : 0
    const nights = st.persons * nightsInMonth
    const s = stats[st.group]
    s.stays++
    if (arrivedInMonth) s.bookings++
    s.arrivals += arrivals
    s.nights += nights
    bump(s.byApartment, st.label, arrivals, nights)
    bump(s.byCountry, st.country, arrivals, nights)
  }
  return stats
}

/** Liste der Monate YYYY-MM von from bis to (inklusive). */
function monthsBetween(from: string, to: string): string[] {
  const out: string[] = []
  let [y, m] = from.split('-').map(Number)
  const [ty, tm] = to.split('-').map(Number)
  while (y < ty || (y === ty && m <= tm)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`)
    m++
    if (m > 12) { m = 1; y++ }
    if (out.length > 36) break
  }
  return out
}

// ─── Mail ────────────────────────────────────────────────────────────────────

function table(rows: Array<[string, number, number]>, firstCol: string): string {
  const tr = rows
    .map(([k, a, n]) => `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;">${escapeHtml(k)}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;">${a}</td><td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;">${n}</td></tr>`)
    .join('')
  return `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:13px;margin:8px 0 16px;">
    <tr style="background:#f5f0e8;"><th style="text-align:left;padding:6px 10px;">${firstCol}</th><th style="text-align:right;padding:6px 10px;">Ankünfte</th><th style="text-align:right;padding:6px 10px;">Übernachtungen</th></tr>${tr}</table>`
}

function sortedRows(map: Record<string, { arrivals: number; nights: number }>, labelFn: (k: string) => string): Array<[string, number, number]> {
  return Object.entries(map)
    .sort((a, b) => b[1].nights - a[1].nights)
    .map(([k, v]) => [labelFn(k), v.arrivals, v.nights])
}

function section(title: string, subtitle: string, s: Stats, beds: number, days: number): string {
  if (s.stays === 0) {
    return `<h2 style="font-size:17px;margin:24px 0 4px;color:#1a2e1a;">${title}</h2><p style="font-size:13px;color:#666;margin:0 0 12px;">${subtitle}</p><p style="font-size:13px;">Keine Aufenthalte im Berichtsmonat.</p>`
  }
  return `
    <h2 style="font-size:17px;margin:24px 0 4px;color:#1a2e1a;">${title}</h2>
    <p style="font-size:13px;color:#666;margin:0 0 12px;">${subtitle}</p>
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin:0 0 12px;">
      <tr><td style="padding:4px 16px 4px 0;color:#666;">Ankünfte (Personen)</td><td style="font-weight:600;">${s.arrivals}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#666;">Übernachtungen (Personen × Nächte)</td><td style="font-weight:600;">${s.nights}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#666;">Aufenthalte mit Anreise im Monat</td><td>${s.bookings}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#666;">Aufenthalte, die den Monat berühren</td><td>${s.stays}</td></tr>
      ${beds ? `<tr><td style="padding:4px 16px 4px 0;color:#666;">Angebotene Schlafgelegenheiten</td><td>${beds}</td></tr>` : ''}
      <tr><td style="padding:4px 16px 4px 0;color:#666;">Öffnungstage</td><td>${days}</td></tr>
    </table>
    ${table(sortedRows(s.byApartment, k => k), 'Apartment')}
    ${table(sortedRows(s.byCountry, countryLabel), 'Wohnsitzland (Heuristik: Telefon-Vorwahl)')}`
}

function buildMail(month: string, stats: Record<Group, Stats>, excluded: Excluded[], schoenblickBeds: number, haus28Beds: number) {
  const label = monthLabel(month)
  const { days } = monthRange(month)
  const sb = stats.schoenblick

  const gemeindeText = `Sehr geehrte Frau Zitzelsperger,

anbei wie besprochen unsere Monatszahlen für das Haus Schönblick (Schöfweg) für ${label}:

Ankünfte: ${sb.arrivals} Personen (${sb.bookings} Aufenthalte)
Übernachtungen: ${sb.nights}

Mit freundlichen Grüßen
Vincent Sarfi`

  const excludedHtml = excluded.length
    ? `<h2 style="font-size:15px;margin:24px 0 8px;color:#1a2e1a;">Nicht gezählt (bitte kurz prüfen)</h2>
       <ul style="font-size:12px;color:#555;padding-left:18px;margin:0;">${excluded.map(e =>
         `<li>#${e.id} · ${escapeHtml(e.apartment)} · ${e.arrival} – ${e.departure} · ${escapeHtml(e.channel)} – ${escapeHtml(e.reason)}</li>`).join('')}</ul>`
    : ''

  const html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1a2e1a;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px;"><tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#fff;border-radius:12px;overflow:hidden;">
  <tr><td style="background:#1a2e1a;padding:24px 32px;">
    <p style="margin:0;color:#c9a84c;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;">SARFI Collection · Backoffice</p>
    <h1 style="margin:6px 0 0;color:#f5f0e8;font-size:20px;font-weight:600;">Beherbergungsstatistik ${label}</h1>
  </td></tr>
  <tr><td style="padding:24px 32px;">
    <p style="font-size:13px;line-height:1.6;margin:0 0 8px;">Zählweise wie in der amtlichen Statistik: Ankünfte = im Monat angereiste Personen, Übernachtungen = Personen × Nächte im Monat (Aufenthalte über den Monatswechsel anteilig). Quelle: Smoobu.</p>

    ${section('Haus Schönblick (Schöfweg)', 'Monatsmeldung an die Gemeinde Schöfweg · Pflichtmeldung BeherbStatG ans Landesamt (≥ 10 Schlafgelegenheiten)', sb, schoenblickBeds, days)}

    <h3 style="font-size:14px;margin:8px 0 6px;">Vorlage für die Mail an die Gemeinde</h3>
    <pre style="white-space:pre-wrap;font-family:inherit;font-size:13px;background:#f5f0e8;border-radius:8px;padding:12px 14px;margin:0 0 8px;">${escapeHtml(gemeindeText)}</pre>
    <p style="font-size:12px;color:#666;margin:0 0 8px;">Landesamt: Zahlen (inkl. Aufteilung nach Wohnsitzland) im IDEV-Portal unter <a href="https://www.statistik.bayern.de" style="color:#1a2e1a;">statistik.bayern.de</a> eintragen.</p>

    ${section('HAUS28 (Grattersdorf)', 'Zur Info – für Grattersdorf gilt die dortige Regelung; unter 10 Schlafgelegenheiten, keine BeherbStatG-Meldung', stats.haus28, haus28Beds, days)}

    ${stats.other.stays ? section('Nicht zugeordnete Apartments', 'In Smoobu vorhanden, aber nicht in der Website-Konfiguration – bitte prüfen', stats.other, 0, days) : ''}

    ${excludedHtml}
  </td></tr>
  <tr><td style="background:#f5f0e8;padding:14px 32px;border-top:1px solid #e8e2d6;">
    <p style="margin:0;font-size:11px;color:#888;">Automatisch erzeugt von sarfi-collection.de · /api/cron/beherbergungsstatistik · Wohnsitzland ist eine Schätzung über die Telefon-Vorwahl.</p>
  </td></tr>
</table></td></tr></table></body></html>`

  return { subject: `Beherbergungsstatistik ${label} – Schönblick: ${sb.arrivals} Ankünfte, ${sb.nights} Übernachtungen`, html, gemeindeText }
}

function rangeTable(rows: Array<{ month: string; s: Stats }>): string {
  const tr = rows.map(({ month, s }) =>
    `<tr><td style="padding:6px 10px;border-bottom:1px solid #eee;">${monthLabel(month)}</td>` +
    `<td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;">${s.bookings}</td>` +
    `<td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;">${s.arrivals}</td>` +
    `<td style="padding:6px 10px;border-bottom:1px solid #eee;text-align:right;">${s.nights}</td></tr>`).join('')
  const sum = rows.reduce((a, r) => ({ b: a.b + r.s.bookings, ar: a.ar + r.s.arrivals, n: a.n + r.s.nights }), { b: 0, ar: 0, n: 0 })
  return `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:13px;margin:8px 0 16px;">
    <tr style="background:#f5f0e8;"><th style="text-align:left;padding:6px 10px;">Monat</th><th style="text-align:right;padding:6px 10px;">Aufenthalte</th><th style="text-align:right;padding:6px 10px;">Ankünfte (Personen)</th><th style="text-align:right;padding:6px 10px;">Übernachtungen</th></tr>
    ${tr}
    <tr style="font-weight:600;"><td style="padding:6px 10px;">Summe</td><td style="padding:6px 10px;text-align:right;">${sum.b}</td><td style="padding:6px 10px;text-align:right;">${sum.ar}</td><td style="padding:6px 10px;text-align:right;">${sum.n}</td></tr>
  </table>`
}

function plainRangeText(rows: Array<{ month: string; s: Stats }>): string {
  return rows.map(({ month, s }) => `${monthLabel(month)}: ${s.arrivals} Ankünfte, ${s.nights} Übernachtungen (${s.bookings} Aufenthalte)`).join('\n')
}

function buildRangeMail(from: string, to: string, perMonth: Array<{ month: string; stats: Record<Group, Stats> }>, excluded: Excluded[]) {
  const sb = perMonth.map(m => ({ month: m.month, s: m.stats.schoenblick }))
  const h28 = perMonth.map(m => ({ month: m.month, s: m.stats.haus28 }))
  const title = `${monthLabel(from)} – ${monthLabel(to)}`

  const gemeindeText = `Sehr geehrte Frau Zitzelsperger,

wie angekündigt erhalten Sie hiermit die Monatszahlen für das Haus Schönblick (Schöfweg) seit Betriebsbeginn, diesmal direkt im Text der E-Mail:

${plainRangeText(sb)}

Zählweise wie in der Beherbergungsstatistik: Ankünfte = angereiste Personen, Übernachtungen = Personen × Nächte im jeweiligen Monat.

Ab jetzt erhalten Sie die Zahlen automatisch zu Beginn jedes Monats.

Mit freundlichen Grüßen
Vincent Sarfi`

  const excludedHtml = excluded.length
    ? `<h2 style="font-size:15px;margin:24px 0 8px;color:#1a2e1a;">Nicht gezählt</h2>
       <ul style="font-size:12px;color:#555;padding-left:18px;margin:0;">${excluded.map(e =>
         `<li>#${e.id} · ${escapeHtml(e.apartment)} · ${e.arrival} – ${e.departure} · ${escapeHtml(e.channel)} – ${escapeHtml(e.reason)}</li>`).join('')}</ul>`
    : ''

  const html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1a2e1a;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px;"><tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#fff;border-radius:12px;overflow:hidden;">
  <tr><td style="background:#1a2e1a;padding:24px 32px;">
    <p style="margin:0;color:#c9a84c;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;">SARFI Collection · Backoffice</p>
    <h1 style="margin:6px 0 0;color:#f5f0e8;font-size:20px;font-weight:600;">Beherbergungsstatistik ${title}</h1>
  </td></tr>
  <tr><td style="padding:24px 32px;">
    <p style="font-size:13px;line-height:1.6;margin:0 0 8px;">Nachmeldung über mehrere Monate. Ankünfte = angereiste Personen, Übernachtungen = Personen × Nächte im Monat, Aufenthalte = Anreisen (nahtlos verlängerte Aufenthalte desselben Gastes einmal gezählt). Quelle: Smoobu.</p>
    <h2 style="font-size:17px;margin:24px 0 4px;color:#1a2e1a;">Haus Schönblick (Schöfweg)</h2>
    ${rangeTable(sb)}
    <h3 style="font-size:14px;margin:8px 0 6px;">Vorlage für die Mail an die Gemeinde</h3>
    <pre style="white-space:pre-wrap;font-family:inherit;font-size:13px;background:#f5f0e8;border-radius:8px;padding:12px 14px;margin:0 0 8px;">${escapeHtml(gemeindeText)}</pre>
    <h2 style="font-size:17px;margin:24px 0 4px;color:#1a2e1a;">HAUS28 (Grattersdorf)</h2>
    ${rangeTable(h28)}
    ${excludedHtml}
  </td></tr>
  <tr><td style="background:#f5f0e8;padding:14px 32px;border-top:1px solid #e8e2d6;">
    <p style="margin:0;font-size:11px;color:#888;">Automatisch erzeugt von sarfi-collection.de · /api/cron/beherbergungsstatistik?from=${from}&amp;to=${to}</p>
  </td></tr>
</table></td></tr></table></body></html>`

  return { subject: `Beherbergungsstatistik ${title} (Nachmeldung)`, html, gemeindeText }
}

// ─── Route ───────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const expected = process.env.CRON_SECRET
  if (!expected) {
    console.error('[cron/statistik] CRON_SECRET nicht gesetzt – Abbruch')
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }
  const auth = request.headers.get('authorization') ?? ''
  if (!safeEqual(auth, `Bearer ${expected}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/
  const pick = (k: string) => { const v = searchParams.get(k); return v && MONTH_RE.test(v) ? v : null }
  const fromParam = pick('from')
  const toParam = pick('to')
  const isRange = Boolean(fromParam && toParam && fromParam <= toParam)
  const month = pick('month') ?? previousMonth()
  const to = searchParams.get('mailto') || process.env.STATISTIK_MAIL_TO || DEFAULT_TO
  const dryRun = searchParams.get('dry') === '1'

  const months = isRange ? monthsBetween(fromParam!, toParam!) : [month]
  const { start } = monthRange(months[0])
  const { endExclusive } = monthRange(months[months.length - 1])

  try {
    // 60 Tage Vorlauf: fängt lange Aufenthalte und die from/to-Schwäche von Smoobu ab
    const bookings = await fetchBookings(addDaysUtc(start, -60), endExclusive)
    const { stays, excluded } = toStays(bookings)
    const perMonth = months.map(m => ({ month: m, stats: evaluateMonth(stays, m) }))

    const schoenblickBeds = Object.values(PROPERTY_CONFIGS).filter(c => c.id !== 'haus28').reduce((n, c) => n + c.maxGuests, 0)
    const haus28Beds = PROPERTY_CONFIGS.haus28?.maxGuests ?? 0

    const mail = isRange
      ? buildRangeMail(months[0], months[months.length - 1], perMonth, excluded)
      : buildMail(month, perMonth[0].stats, excluded, schoenblickBeds, haus28Beds)

    const summary = {
      months,
      fetched: bookings.length,
      stays: stays.length,
      perMonth: perMonth.map(m => ({
        month: m.month,
        schoenblick: m.stats.schoenblick,
        haus28: m.stats.haus28,
        other: m.stats.other,
      })),
      excluded,
      gemeindeText: mail.gemeindeText,
      to,
      dryRun,
    }

    if (dryRun) return NextResponse.json(summary)

    const { error } = await getResend().emails.send({
      from: 'Buchungssystem <buchung@sarfi-collection.de>',
      to: [to],
      subject: mail.subject,
      html: mail.html,
    })
    if (error) {
      console.error('[cron/statistik] Resend error:', error)
      return NextResponse.json({ ...summary, error: 'Mailversand fehlgeschlagen' }, { status: 500 })
    }
    return NextResponse.json({ ...summary, sent: true })
  } catch (err) {
    console.error('[cron/statistik] Fehler:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Fehler' }, { status: 500 })
  }
}
