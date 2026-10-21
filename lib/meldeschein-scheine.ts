// Meldeschein je Person: Ablage der Schein-Tokens, Zuordnung zur Status-Antwort
// und die Wahl beim Laden, ohne React (components/booking/MeldescheinWidget.tsx
// und MeldescheinPersonen.tsx). Getestet mit
// `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test lib/meldeschein-scheine.test.mjs`.
//
// Warum localStorage statt sessionStorage: Wer am Vortag ausfüllt oder den Link
// im Booking-/WhatsApp-Browser öffnet, verlöre das Token mit dem Tab, könnte am
// Anreisetag nicht mehr bestätigen, und es entstünde ein doppelter Schein. Das
// Token sagt nichts über die Person und öffnet nur zusammen mit dem Link etwas.
// Abgelegt ist es unter Einheit und Anreise, mit der Abreise als Ablaufdatum;
// nach der Abreise fällt es beim nächsten Aufruf der Seite weg
// (Datenschutzerklärung, Abschnitt „Digitaler Meldeschein“). Ist localStorage
// gesperrt oder voll, hält sessionStorage die Tokens nur für diesen Tab, und
// ohne beides nur der Arbeitsspeicher; das Widget sagt das dann (speicherHinweis).

export type ScheinStatus = 'offen' | 'eingereicht' | 'erhalten' | 'entfaellt' | 'vernichtet'

/** Ein weiterer Schein zu einem mitgeschickten Token. Das Token selbst kommt nie zurück. */
export type MeinSchein = { nr: number; status: ScheinStatus; vorname?: string; bestaetigungErlaubt?: boolean; papierNoetig?: boolean; eigeneKarte?: boolean }
export type Eigener = MeinSchein & { token: string }

/** Ein Eintrag der Statusantwort; `i` ist die Stelle seines Tokens in den mitgeschickten personTokens. */
export type MeinTreffer = MeinSchein & { i: number }
export type SpeicherArt = 'dauerhaft' | 'sitzung'

// Gemerkt wird nur das Token, keine Nr.: Zugeordnet wird allein über die Statusantwort (zuordnen).
type Gemerkt = { t: string }
type Eintrag = { bis: string; tokens: Gemerkt[]; haupt?: boolean }
type Alle = Record<string, Eintrag>

const SCHLUESSEL = 'sarfi-meldeschein-scheine'
// So viele nimmt das Dashboard je Status-Abfrage an (bis zu 24 weitere Einträge,
// gezählt werden höchstens 12, angefangene belegen keinen Platz).
const MAX_TOKENS = 25
const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/

// Kopie im Arbeitsspeicher: ohne Browser-Speicher die einzige (gilt bis zum
// Neuladen), nach einem Schreibfehler die maßgebliche (Codex-Befund W3,
// 21.10.2026). Bis dahin las lesen() danach wieder den alten Stand aus dem
// Speicher, in den der neue Eintrag nicht mehr passte, und der eingereichte
// Schein war nach der Rückkehr weg.
let fluechtig: Alle = {}
let schreibFehler = false
// Nutzbare Speicher in Rangfolge; einer, in den das Schreiben scheitert, fällt für diese Seite heraus.
let ablagen: { s: Storage; art: SpeicherArt }[] | undefined

function verfuegbar() {
  if (ablagen) return ablagen
  ablagen = []
  for (const [name, art] of [['localStorage', 'dauerhaft'], ['sessionStorage', 'sitzung']] as const) {
    try {
      const s = window[name]
      s.setItem(`${SCHLUESSEL}-probe`, '1')
      s.removeItem(`${SCHLUESSEL}-probe`)
      ablagen.push({ s, art })
    } catch {
      // gesperrt (privates Fenster, Einstellungen): dann der nächste
    }
  }
  return ablagen
}

/** Wo die Tokens gerade liegen: dauerhaft (localStorage), nur in diesem Tab (sessionStorage) oder null (nur bis zum Neuladen). */
export function speicherArt(): SpeicherArt | null {
  return verfuegbar()[0]?.art ?? null
}

/** Heutiges Datum (Gerätezeit) als JJJJ-MM-TT, Vergleich mit arrival/departure. */
export function heuteIso(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Tag vor `iso` (JJJJ-MM-TT); ab da legt das Dashboard weitere Scheine an. */
export function vortag(iso: string): string {
  const t = Date.parse(`${iso}T12:00:00Z`)
  return Number.isFinite(t) ? new Date(t - 86400000).toISOString().slice(0, 10) : iso
}

function gemerktAus(roh: unknown): Gemerkt | null {
  const g = roh as Partial<Gemerkt> | null
  return g && typeof g.t === 'string' && TOKEN_RE.test(g.t) ? { t: g.t } : null
}

/** Ganzer Stand in den ersten Speicher, der ihn nimmt; scheitert er, der nächste (Ersatz), sonst nur der Arbeitsspeicher. */
function schreiben(alle: Alle) {
  fluechtig = alle
  const l = verfuegbar()
  while (l.length) {
    let ok = false
    try {
      l[0].s.setItem(SCHLUESSEL, JSON.stringify(alle))
      ok = true
    } catch {
      // Voll (Quote) oder gesperrt: ab jetzt gilt der Arbeitsspeicher, der nächste Speicher ist der Ersatz.
    }
    if (ok) {
      // Ein älterer Stand im Ersatz würde beim Lesen sonst Vergessenes zurückholen.
      for (const a of l.slice(1)) {
        try { a.s.removeItem(SCHLUESSEL) } catch { /* gesperrt: steht dann nur doppelt */ }
      }
      return
    }
    schreibFehler = true
    l.shift()
  }
}

function rohAus(s: Storage): unknown {
  try { return JSON.parse(s.getItem(SCHLUESSEL) || '{}') } catch { return {} }
}

/**
 * Liest alle gemerkten Scheine und wirft abgelaufene (Abreise vorbei) gleich
 * hinaus. Nach einem Schreibfehler gilt der Arbeitsspeicher; sonst alle Speicher
 * zusammen, denn nach einem Rückfall auf sessionStorage steht im localStorage
 * noch der alte Stand (beim Neuladen ist die Probe dort wieder erfolgreich).
 */
function lesen(): Alle {
  const l = verfuegbar()
  const quellen = schreibFehler || !l.length ? [fluechtig] : l.map((a) => rohAus(a.s))
  const heute = heuteIso()
  const alle: Alle = {}
  let weg = false
  for (const roh of quellen) {
    for (const [k, v] of Object.entries(roh && typeof roh === 'object' ? roh as Record<string, unknown> : {})) {
      const e = v as Partial<Eintrag> | null
      if (!e || typeof e.bis !== 'string' || !Array.isArray(e.tokens) || e.bis < heute) { weg = true; continue }
      const x = alle[k] ?? { bis: e.bis, tokens: [] }
      for (const g of e.tokens.map(gemerktAus)) if (g && !x.tokens.some((y) => y.t === g.t)) x.tokens.push(g)
      if (e.bis > x.bis) x.bis = e.bis
      if (e.haupt === true) x.haupt = true
      alle[k] = x
    }
  }
  if (weg) schreiben(alle)
  return alle
}

export function scheinSchluessel(einheit: string, arrival: string): string {
  return `${einheit}|${arrival}`
}

/** Eintrag holen oder anlegen und ans Ende stellen: Der zuletzt genutzte Aufenthalt geht bei MAX_TOKENS vor. */
function aendern(schluessel: string, bis: string, f: (e: Eintrag) => void) {
  const alle = lesen()
  const e = alle[schluessel] ?? { bis, tokens: [] }
  f(e)
  e.bis = bis
  delete alle[schluessel]
  alle[schluessel] = e
  schreiben(alle)
}

export const scheinSpeicher = {
  /** Alle gemerkten Tokens, jüngste zuletzt — für die Status-Abfrage beim Laden. */
  alle(): string[] {
    const liste: string[] = []
    for (const e of Object.values(lesen())) for (const g of e.tokens) liste.push(g.t)
    return liste.slice(-MAX_TOKENS)
  },
  /** Die Tokens dieses Aufenthalts auf diesem Gerät, älteste zuerst. */
  eigene(schluessel: string): string[] {
    return (lesen()[schluessel]?.tokens ?? []).map((g) => g.t)
  },
  /** Vor dem ersten Schreiben merken (Doppeltipps und verlorene Antworten treffen so denselben Schein), nach jedem erfolgreichen noch einmal. */
  merken(schluessel: string, bis: string, t: string) {
    aendern(schluessel, bis, (e) => { if (!e.tokens.some((g) => g.t === t)) e.tokens.push({ t }) })
  },
  vergessen(schluessel: string, t: string) {
    const alle = lesen()
    const e = alle[schluessel]
    if (!e) return
    e.tokens = e.tokens.filter((g) => g.t !== t)
    if (!e.tokens.length && !e.haupt) delete alle[schluessel]
    schreiben(alle)
  },
  /** Auf diesem Gerät wurde der erste Meldeschein begonnen (ohne Token, nur dieser Vermerk). */
  hauptMerken(schluessel: string, bis: string) {
    aendern(schluessel, bis, (e) => { e.haupt = true })
  },
  hatHaupt(schluessel: string): boolean {
    return lesen()[schluessel]?.haupt === true
  },
}

/** 32 Zufallsbytes als base64url (43 Zeichen) — das Format, das das Dashboard annimmt. */
export function neuesToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Ordnet die Statusantwort den Tokens dieses Aufenthalts zu, allein über die
 * Stelle `i` des Tokens in den mitgeschickten (`gesendet`); das Dashboard löst
 * jedes Token einzeln über seinen Abdruck auf. Nie über eine gemerkte Nr.
 * (Codex-Befund W2, 21.10.2026): Nach dem Verwerfen eines angefangenen Scheins
 * vergab das Dashboard dieselbe Nr. neu, und die Antwort landete beim alten
 * Token eines zweiten Tabs. Ein Raten nach Reihenfolge könnte ebenso einen
 * fremden Schein bestätigen lassen.
 *   eigene     Scheine dieses Geräts samt Token, in der Reihenfolge von `eigene`
 *   unbekannt  mitgeschickt, aber ohne Schein beim Dashboard (zum Vergessen)
 *   ungeprueft nicht mitgeschickt (einzeln nachfragen)
 */
export function zuordnen(gesendet: string[], eigene: string[], meine: MeinTreffer[]): { eigene: Eigener[]; unbekannt: string[]; ungeprueft: string[] } {
  const treffer = new Map<string, MeinSchein>()
  for (const { i, ...m } of meine) {
    const t = Number.isInteger(i) ? gesendet[i] : undefined
    if (t && eigene.includes(t) && !treffer.has(t)) treffer.set(t, m)
  }
  return {
    eigene: eigene.flatMap((t) => { const m = treffer.get(t); return m ? [{ ...m, token: t }] : [] }),
    unbekannt: eigene.filter((t) => gesendet.includes(t) && !treffer.has(t)),
    ungeprueft: eigene.filter((t) => !gesendet.includes(t)),
  }
}

/**
 * Welcher Schein beim Laden gezeigt wird. `neu`: keiner auf diesem Gerät
 * (Startseite oder „schon da“).
 *
 * Erinnerungslink (e=1, an die buchende Person, nur bei eingereichtem
 * Hauptschein): Er führt zur Bestätigung des ersten Scheins wie bisher, auch
 * ohne Vermerk `haupt` auf diesem Gerät. Den Vermerk hat kein Hauptschein, der
 * vor dem Umbau, in einem anderen Browser oder nur im sessionStorage eingereicht
 * wurde, und über `b` meldet das Dashboard für einen Hauptschein aus dem
 * Vorlagen-Link `ersterOffen: false` (Gegenprüfung 21.10.2026: Eine Wahl „erst
 * Familienname“ landete dort in „schon da“ ohne Bestätigungsknopf, es blieb nur
 * Papier). Die Reihenfolge:
 *   1. Hat dieses Gerät den ersten Schein begonnen, ist es das der buchenden
 *      Person: der erste Schein, auch wenn hier noch ein offener Schein eines
 *      Kollegen liegt (geteiltes Handy; sonst bestätigte sie dessen Schein mit
 *      ihrer Karte, und ihr eigener scheiterte an `eigene_karte`).
 *   2. Sonst ein offener eigener weiterer Schein (Codex-Befund W1: Ein Kollege
 *      hat den Hauptschein auf seinem Handy eingereicht, die buchende Person
 *      danach ihren eigenen auf ihrem).
 *   3. Sonst der erste Schein.
 * Ohne Erinnerung wie bisher: eigene offene Scheine vor dem ersten.
 */
export type Wahl = { art: 'eigener'; e: Eigener } | { art: 'erster' } | { art: 'neu' }

export function startWahl(p: {
  liste: Eigener[]
  vorher: { token: string | null; nr: number | null }
  hier: boolean
  erinnerung: boolean
  hauptStatus: ScheinStatus
}): Wahl {
  const { liste, vorher, hier, erinnerung, hauptStatus } = p
  const braucht = (st: ScheinStatus) => st === 'offen' || st === 'eingereicht'
  const offenerEigener = [...liste].reverse().find((e) => braucht(e.status))
  const gerade = liste.find((e) => e.token === vorher.token)
  if (gerade) return { art: 'eigener', e: gerade }
  if (vorher.nr === 1 && hier) return { art: 'erster' }
  if (erinnerung && hauptStatus === 'eingereicht') {
    if (hier) return { art: 'erster' }
    if (offenerEigener) return { art: 'eigener', e: offenerEigener }
    return { art: 'erster' }
  }
  if (offenerEigener) return { art: 'eigener', e: offenerEigener }
  if (hier) return { art: 'erster' }
  if (liste.length) return { art: 'eigener', e: liste[liste.length - 1] }
  return { art: 'neu' }
}

/**
 * Welcher Hinweis zur Ablage über dem Schein steht: keiner, „nur in diesem Tab“
 * oder „gar nicht gespeichert“. Ein weiterer Schein hängt am Token: Liegt es nur
 * im sessionStorage, ist es mit dem Tab weg (Codex-Befund W4, 21.10.2026), und
 * eine Erinnerung gibt es für weitere Personen nicht. Beim ersten Schein bleibt
 * es beim Hinweis ohne jeden Speicher, die buchende Person bekommt die Erinnerung.
 */
export function speicherHinweis(art: SpeicherArt | null, weiterer: boolean): 'keiner' | 'sitzung' | 'nichts' {
  if (art === null) return 'nichts'
  return art === 'sitzung' && weiterer ? 'sitzung' : 'keiner'
}
