'use client'

// Meldeschein je Person (§ 29 Abs. 2 Satz 1 BMG): Jede:r ausländische Erwachsene,
// der nicht als Ehe-/Lebenspartner:in oder minderjähriges Kind auf einem anderen
// Schein steht (typisch: Monteur-Kolleg:innen), braucht einen eigenen Meldeschein
// mit eigener Bestätigung.
//
// Der erste Meldeschein einer Buchung läuft wie bisher ohne Kennung. Wählt
// jemand „weitere Person“, erzeugt die Seite ein zufälliges Schein-Token und
// schickt es bei jeder Aktion dieses Scheins mit; das Dashboard legt dazu einen
// eigenen Schein an. Ein Token schreibt nie den ersten Schein. Damit ein anderes
// Gerät den ersten Schein nicht versehentlich überschreibt, merkt sich das Gerät,
// auf dem er begonnen wurde, das hier (`haupt`); die übrigen schicken beim
// Schreiben `nurWennFrei` (MeldescheinWidget.tsx).
// Hier liegen die Helfer: Ablage der Tokens, Zuordnung zur Status-Antwort und
// der Block „Weitere“ unter dem fertigen Schein.
//
// Warum localStorage statt sessionStorage: Wer am Vortag ausfüllt oder den Link
// im Booking-/WhatsApp-Browser öffnet, verlöre das Token mit dem Tab, könnte am
// Anreisetag nicht mehr bestätigen, und es entstünde ein doppelter Schein. Das
// Token sagt nichts über die Person und öffnet nur zusammen mit dem Link etwas.
// Abgelegt ist es unter Einheit und Anreise, mit der Abreise als Ablaufdatum;
// nach der Abreise fällt es beim nächsten Aufruf der Seite weg
// (Datenschutzerklärung, Abschnitt „Digitaler Meldeschein“).

export type ScheinStatus = 'offen' | 'eingereicht' | 'erhalten' | 'entfaellt' | 'vernichtet'

/** Status-Zusatz des Dashboards; fehlt er, kennt das Dashboard noch keine weiteren Scheine. */
export type WeitereInfo = { moeglich: boolean; begonnen: boolean; ersterOffen?: boolean; ersterUeberQr?: boolean; anzahl?: number; bestaetigt?: number }
/** Ein weiterer Schein zu einem mitgeschickten Token. Das Token selbst kommt nie zurück. */
export type MeinSchein = { nr: number; status: ScheinStatus; vorname?: string; bestaetigungErlaubt?: boolean; papierNoetig?: boolean; eigeneKarte?: boolean }
export type Eigener = MeinSchein & { token: string }

type Gemerkt = { t: string; nr?: number }
type Eintrag = { bis: string; tokens: Gemerkt[]; haupt?: boolean }
type Alle = Record<string, Eintrag>

const SCHLUESSEL = 'sarfi-meldeschein-scheine'
// So viele nimmt das Dashboard je Status-Abfrage an (bis zu 24 weitere Einträge,
// gezählt werden höchstens 12, angefangene belegen keinen Platz).
const MAX_TOKENS = 25
const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/

// Rückfall ohne Browser-Speicher: gilt nur bis zum Neuladen (Hinweis person.ohneSpeicher).
let fluechtig: Alle = {}
let gewaehlt: { s: Storage; art: 'dauerhaft' | 'sitzung' } | null | undefined

function ablage() {
  if (gewaehlt !== undefined) return gewaehlt
  gewaehlt = null
  for (const [name, art] of [['localStorage', 'dauerhaft'], ['sessionStorage', 'sitzung']] as const) {
    try {
      const s = window[name]
      s.setItem(`${SCHLUESSEL}-probe`, '1')
      s.removeItem(`${SCHLUESSEL}-probe`)
      gewaehlt = { s, art }
      break
    } catch {
      gewaehlt = null // gesperrt (privates Fenster, Einstellungen): nächster Rückfall
    }
  }
  return gewaehlt
}

export function speicherArt(): 'dauerhaft' | 'sitzung' | null {
  return ablage()?.art ?? null
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
  if (!g || typeof g.t !== 'string' || !TOKEN_RE.test(g.t)) return null
  return typeof g.nr === 'number' ? { t: g.t, nr: g.nr } : { t: g.t }
}

function schreiben(alle: Alle) {
  fluechtig = alle
  const a = ablage()
  if (!a) return
  try {
    a.s.setItem(SCHLUESSEL, JSON.stringify(alle))
  } catch {
    fluechtig = alle // Speicher voll: für diese Seite bleibt die Kopie im Arbeitsspeicher
  }
}

/** Liest alle gemerkten Scheine und wirft abgelaufene (Abreise vorbei) gleich hinaus. */
function lesen(): Alle {
  const a = ablage()
  let roh: unknown = fluechtig
  if (a) {
    try { roh = JSON.parse(a.s.getItem(SCHLUESSEL) || '{}') } catch { roh = {} }
  }
  const heute = heuteIso()
  const alle: Alle = {}
  let weg = false
  for (const [k, v] of Object.entries(roh && typeof roh === 'object' ? roh as Record<string, unknown> : {})) {
    const e = v as Partial<Eintrag> | null
    if (!e || typeof e.bis !== 'string' || !Array.isArray(e.tokens) || e.bis < heute) { weg = true; continue }
    const tokens = e.tokens.map(gemerktAus).filter((g): g is Gemerkt => g !== null)
    alle[k] = e.haupt === true ? { bis: e.bis, tokens, haupt: true } : { bis: e.bis, tokens }
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
  eigene(schluessel: string): Gemerkt[] {
    return lesen()[schluessel]?.tokens ?? []
  },
  /** Vor dem ersten Schreiben merken: Doppeltipps und verlorene Antworten treffen so denselben Schein. */
  merken(schluessel: string, bis: string, t: string) {
    aendern(schluessel, bis, (e) => { if (!e.tokens.some((g) => g.t === t)) e.tokens.push({ t }) })
  },
  nrMerken(schluessel: string, t: string, nr: number) {
    const alle = lesen()
    const g = alle[schluessel]?.tokens.find((x) => x.t === t)
    if (!g || g.nr === nr) return
    g.nr = nr
    schreiben(alle)
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
 * Ordnet `meine` (nur nr, ohne Token) den gemerkten Tokens zu. Bekannte nr direkt;
 * Tokens ohne nr klärt der Aufrufer einzeln (Status mit nur diesem Token) — ein
 * Raten nach Reihenfolge könnte einen fremden Schein bestätigen lassen.
 */
export function zuordnen(gemerkt: Gemerkt[], meine: MeinSchein[]): { eigene: Eigener[]; ohneNr: string[] } {
  const frei = new Map(meine.map((m) => [m.nr, m]))
  const eigene: Eigener[] = []
  const ohneNr: string[] = []
  for (const g of gemerkt) {
    if (g.nr === undefined) { ohneNr.push(g.t); continue }
    const m = frei.get(g.nr)
    if (!m) continue // Schein gibt es nicht mehr (z. B. nach zwei Stunden ohne Einreichen verworfen)
    eigene.push({ ...m, token: g.t })
    frei.delete(g.nr)
  }
  return { eigene, ohneNr: frei.size ? ohneNr : [] }
}

type Texte = {
  titel: string
  text: string
  knopf: string
  stand: (n: number, x: number) => string
  voll: string
  abVortag: (datum: string) => string
  diesesHandy: string
  staende: Record<ScheinStatus, string>
  bestaetigen: string
  fortsetzen: string
}

/** Ein Schein auf diesem Gerät für die Liste „Auf diesem Handy“ (der erste Schein ohne Vornamen). */
export type ListenEintrag = { key: string; label: string; status: ScheinStatus; aktiv: boolean; bestaetigen?: () => void; fortsetzen?: () => void }

/**
 * Block unter dem fertigen Schein: Scheine auf diesem Handy (mit Vornamen, nur
 * zu eigenen Tokens), die Zahl der übrigen (ohne Namen) und der Knopf für die
 * nächste Person.
 */
export function WeiterePersonen({ t, weitere, eintraege, arrival, departure, sendet, datum, stil, onNeu }: {
  t: Texte
  weitere: WeitereInfo
  eintraege: ListenEintrag[]
  arrival?: string
  departure?: string
  sendet: boolean
  datum: (iso?: string) => string
  stil: { sekundaer: string; klein: string; lbl: string }
  onNeu: () => void
}) {
  const heute = heuteIso()
  if (departure && heute > departure) return null
  const zuFrueh = Boolean(arrival && heute < vortag(arrival))
  const andere = weitere.anzahl ?? 0
  const link = 'font-body text-sm font-semibold text-forest-800 underline underline-offset-4 disabled:opacity-60'

  return (
    <div className="mt-8 border-t border-cream-200 pt-6 text-left">
      {eintraege.length > 1 && (
        <div className="mb-5">
          <p className={stil.lbl}>{t.diesesHandy}</p>
          <ul className="space-y-2">
            {eintraege.map((e) => (
              <li key={e.key} className="flex items-center justify-between gap-3 rounded-2xl bg-cream-50 px-4 py-3">
                <span className="font-body text-sm text-forest-800">
                  {e.label}
                  <span className="text-forest-600"> · {t.staende[e.status]}</span>
                </span>
                {!e.aktiv && e.bestaetigen && <button className={link} disabled={sendet} onClick={e.bestaetigen}>{t.bestaetigen}</button>}
                {!e.aktiv && e.fortsetzen && <button className={link} disabled={sendet} onClick={e.fortsetzen}>{t.fortsetzen}</button>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {andere > 0 && <p className={`${stil.klein} mb-4`}>{t.stand(andere, weitere.bestaetigt ?? 0)}</p>}
      <h3 className="font-display text-xl text-forest-900 mb-2">{t.titel}</h3>
      {zuFrueh ? (
        <p className="font-body text-sm text-forest-600 leading-relaxed">{t.abVortag(datum(arrival ? vortag(arrival) : undefined))}</p>
      ) : weitere.moeglich ? (
        <>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{t.text}</p>
          <button className={`${stil.sekundaer} mt-4`} disabled={sendet} onClick={onNeu}>{t.knopf}</button>
        </>
      ) : (
        <p className="font-body text-sm text-forest-600 leading-relaxed">{t.voll}</p>
      )}
    </div>
  )
}
