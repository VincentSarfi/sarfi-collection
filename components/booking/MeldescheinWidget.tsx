'use client'

// Digitaler Meldeschein (§ 29 Abs. 5 BMG). Ablauf:
//   1. Status laden (Token b = Buchungslink, u = QR-Code in der Einheit
//      <apId>.<hmac> oder Link aus der Smoobu-Check-in-Vorlage
//      <apId>.<hmac>.<Buchungs-ID>.<PIN> — beide reicht die Seite unverändert durch)
//   2. Frage: alle deutsche Staatsangehörigkeit? → ja: fertig (kein Meldeschein nötig)
//   3. Scan: Einwilligung, dann Pass/Ausweis fotografieren → Dashboard liest die
//      MRZ (OCR) → Formular vorausgefüllt
//   4. Formular: Pflichtangaben nach § 30 BMG prüfen/ergänzen
//   5. Bestätigung (nur ab Anreisetag): Apple Pay oder Karte mit 3-D Secure
//      (Stripe SetupIntent, keine Abbuchung) ersetzt die Unterschrift; das Dashboard
//      prüft das Ergebnis serverseitig und antwortet notfalls „papier_noetig".
//   6. Weitere Personen (§ 29 Abs. 2 Satz 1 BMG): Jede:r ausländische Erwachsene,
//      der nicht Ehe-/Lebenspartner:in oder minderjähriges Kind ist, füllt einen
//      eigenen Schein aus — auf diesem Handy oder über denselben Link auf dem
//      eigenen — und bestätigt ihn mit der eigenen Karte.
// Der erste Schein läuft ohne Kennung wie bisher. Nur „weitere Person“ bekommt
// ein eigenes Zufalls-Token (MeldescheinPersonen.tsx); ein Token schreibt nie den
// ersten Schein. Liegt der erste Schein schon vor und wurde er nicht auf diesem
// Gerät begonnen, fragt die Seite „Bist du eine weitere Person?“ statt ihn zum
// Bestätigen anzubieten; die buchende Person kommt über den Erinnerungslink
// (…&e=1) direkt zur Bestätigung. Schreibt dieses Gerät den ersten Schein, ohne
// ihn begonnen zu haben, schickt es `nurWennFrei`: Kam jemand zuvor (409),
// speichert die Seite die Angaben auf Wunsch als eigenen Schein.
// Alle Daten gehen über den Proxy /api/meldeschein ins Dashboard. Der Link-Token
// steht nur in der ersten Seiten-URL: danach liegt er im State und im
// sessionStorage, die Adresszeile wird geleert, alle Abfragen laufen per POST.
// Kennt das Dashboard noch keine weiteren Scheine (Status ohne `weitere`), läuft
// alles wie vorher; die neuen Felder ignoriert es dann.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js/pure'
import type { Stripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { getDict } from '@/lib/i18n'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { STRIPE_APPEARANCE } from './PaymentStep'
import {
  WeiterePersonen, heuteIso, neuesToken, scheinSchluessel, scheinSpeicher, speicherArt, vortag, zuordnen,
  type Eigener, type ListenEintrag, type MeinSchein, type ScheinStatus, type WeitereInfo,
} from './MeldescheinPersonen'

type StatusData = {
  ok: boolean
  status: ScheinStatus // Stand des Hauptscheins
  pflicht?: 'ja' | 'nein' | 'unklar'
  einheit?: string
  arrival?: string
  departure?: string
  personen?: number
  gast?: { vorname: string; familienname: string } | null
  stripe?: boolean
  bestaetigungAb?: string
  bestaetigungErlaubt?: boolean
  weitere?: WeitereInfo
  meine?: MeinSchein[]
  error?: string
}

/** Stand des Scheins, den dieses Gerät gerade bearbeitet (Haupt- oder weiterer Schein). */
type Stand = { status: ScheinStatus; bestaetigungErlaubt: boolean; bestaetigungAb?: string }
/** token null = der erste Schein (ohne Schein-Token). nr: 1 erster Schein, sonst die des weiteren; null = noch unbekannt. */
type Aktiv = { token: string | null; nr: number | null }
type Phase = 'laden' | 'frage' | 'schonDa' | 'konflikt' | 'nameFrage' | 'ichFertig' | 'scan' | 'formular' | 'karte' | 'fertig' | 'fehler'
/** Der erste Schein kam beim Schreiben jemand anderem zuvor (409): was dieses Gerät gerade senden wollte. */
type Konflikt = { code: string; aktion: 'ausweis-lesen' | 'einreichen'; foto?: string; fotoName?: string; body?: Record<string, unknown> }

// Schreibt ein Gerät den ersten Schein, ohne ihn begonnen zu haben (nurWennFrei), heißen diese Antworten: jemand anderes war schneller.
const KONFLIKT = ['bereits_begonnen', 'bereits_eingereicht', 'erledigt']
const SCHREIBT_HAUPT = ['deutsch', 'ausweis-lesen', 'einreichen']

type OcrFelder = Partial<{ familienname: string; vorname: string; geburtsdatum: string | null; staatsangehoerigkeit: string | null; passnummer: string }>

// ISO 3166-1 und Kosovo: Monteure kommen auch aus Georgien, Kasachstan oder
// Vietnam. Fehlt ein Land in der Auswahl, hinge der Schein am Pflichtfeld.
const ISO = (
  'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ ' +
  'CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR ' +
  'GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP ' +
  'KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT ' +
  'MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW ' +
  'SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG ' +
  'UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW'
).split(' ')
// Unbewohnte Gebiete: als Wohnsitz oder Staatsangehörigkeit sinnlos.
const UNBEWOHNT = new Set(['AQ', 'BV', 'GS', 'HM', 'TF', 'UM'])

const karte = 'rounded-3xl bg-white border border-cream-200 shadow-card p-6 sm:p-8'
const cta =
  'inline-block w-full rounded-full bg-gold-500 hover:bg-gold-600 transition-colors ' +
  'px-6 py-4 font-body text-sm font-semibold uppercase tracking-wider text-forest-900 disabled:opacity-60'
const sekundaer =
  'inline-block w-full rounded-full border border-forest-200 bg-white hover:bg-cream-100 transition-colors ' +
  'px-6 py-4 font-body text-sm font-semibold uppercase tracking-wider text-forest-800 disabled:opacity-60'
const feld = 'w-full rounded-xl border border-cream-300 bg-white px-4 py-3 font-body text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-gold-400'
const feldFehler = 'border-red-400 ring-2 ring-red-100'
const lbl = 'block font-body text-xs font-semibold uppercase tracking-wider text-forest-600 mb-1.5'
const klein = 'font-body text-xs text-forest-600 leading-relaxed'

function landName(code: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale === 'de' ? 'de' : 'en'], { type: 'region' }).of(code) || code
  } catch {
    return code
  }
}

/** Foto clientseitig auf max. 1800 px verkleinern und als JPEG-data-URL liefern. */
async function fotoVerkleinern(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const max = 1800
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas')
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.88)
}

// Art und ausstellender Staat des Dokuments fragt das Formular nicht mehr ab:
// Sie dienen nur dem Abgleich mit dem Foto und dürfen nicht gespeichert werden
// (§ 30 Abs. 2 BMG „ausschließlich“). Die Anschrift ist gegliedert wie im
// Datensatz nach BeherbMeldV; mitreisende Angehörige zählen nur als Zahl.
const LEER = {
  familienname: '', vorname: '', geburtsdatum: '', staatsangehoerigkeit: '', staatsangehoerigkeit2: '',
  strasse: '', hausnummer: '', plz: '', ort: '', land: '', passnummer: '', angehoerige: '0',
}
type Felder = typeof LEER

/** Anschrift als eine Zeile — so nimmt sie auch ein Dashboard ohne gegliederte Felder an. */
function anschriftZeile(f: Felder): string {
  return [
    `${f.strasse.trim()} ${f.hausnummer.trim()}`.trim(),
    `${f.plz.trim()} ${f.ort.trim()}`.trim(),
    f.land ? landName(f.land, 'de') : '',
  ].filter(Boolean).join(', ')
}

/** Ablage-Schlüssel der Tokens: je Aufenthalt (Einheit + Anreise), gleich über alle Linkarten. */
const schluessel = (d: StatusData | null) => (d?.einheit && d.arrival ? scheinSchluessel(d.einheit, d.arrival) : null)

const hauptStand = (d: StatusData): Stand => ({
  status: d.status, bestaetigungErlaubt: Boolean(d.bestaetigungErlaubt), bestaetigungAb: d.bestaetigungAb || d.arrival,
})

// Wallet-Regel (wie setupIntentPruefen im Dashboard): Apple Pay zählt als starke
// Kundenauthentifizierung, Google Pay nur mit echter 3-D-Secure-Challenge. Die
// lässt sich bei Google Pay nicht erzwingen — ein Gerätetoken liefe ins
// „papier_noetig". Deshalb hier aus; Android-Gäste nehmen die Karte mit Freigabe
// in der Banking-App. Link ist eine Stripe-Anmeldung, keine SCA der Bank.
// Wer Google Pay einschaltet, muss Kartentext und Datenschutzerklärung mitziehen.
const WALLETS = { applePay: 'auto', googlePay: 'never', link: 'never' } as const
// Kein Mandatstext („künftige Zahlungen belasten"): die Karte wird direkt nach
// der Prüfung wieder gelöst, es gibt keine späteren Abbuchungen.
const TERMS = { card: 'never', applePay: 'never', googlePay: 'never' } as const

// Stripe.js erst laden, wenn die Kartenphase wirklich beginnt, nicht beim Öffnen
// der Seite: wer nur „deutsch" wählt oder vor dem Anreisetag ausfüllt, bekommt
// weder Stripe-Skript noch Stripe-Cookies (Datenschutzerklärung Abschnitt 4).
let stripeEinmal: Promise<Stripe | null> | null = null
function stripeLaden(): Promise<Stripe | null> {
  if (!stripeEinmal) stripeEinmal = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')
  return stripeEinmal
}

// Token für Reload und Sprachwechsel, nachdem er aus der Adresszeile entfernt
// wurde. sessionStorage gilt nur für diesen Tab und endet mit ihm. `e=1`: Link
// aus der Erinnerung „nur noch bestätigen“ (geht an die buchende Person).
const SPEICHER = 'sarfi-meldeschein-token'
function tokenAusSpeicher(): string | null {
  try {
    const s = window.sessionStorage.getItem(SPEICHER)
    return s && /^[bu]=[^&]+(&e=1)?$/.test(s) ? s : null
  } catch {
    return null // Speicher gesperrt: dann gibt es nur den Link selbst
  }
}

export default function MeldescheinWidget() {
  const locale = useLocale()
  const t = getDict(locale).meldeschein
  const datumsLocale = locale === 'de' ? 'de-DE' : 'en-GB'

  const params = useSearchParams()
  const b = params.get('b') ?? ''
  const u = params.get('u') ?? ''
  const e1 = params.get('e') === '1'
  // undefined = noch nicht gelesen; sonst "b=…" / "u=…" (mit "&e=1" aus der Erinnerung) oder null (kein Token)
  const [tokenStr, setTokenStr] = useState<string | null | undefined>(undefined)
  const [imSpeicher, setImSpeicher] = useState(true)

  useEffect(() => {
    if (b || u) {
      const q = new URLSearchParams(b ? { b } : { u })
      if (e1) q.set('e', '1')
      const s = q.toString()
      let ok = true
      try { window.sessionStorage.setItem(SPEICHER, s) } catch { ok = false }
      setImSpeicher(ok)
      setTokenStr(s)
      // Token aus der Adresszeile nehmen: Stripe-iframes bekommen die URL der
      // Elternseite mit, dazu Screenshots und weitergeleitete Links. Ohne Speicher
      // bleibt er stehen, sonst liefen Reload und Sprachwechsel ins Leere.
      if (ok) window.history.replaceState(null, '', window.location.pathname)
      return
    }
    setTokenStr((alt) => alt ?? tokenAusSpeicher())
  }, [b, u, e1])

  const token = useMemo<Record<string, string> | null>(() => {
    if (!tokenStr) return null
    const q = new URLSearchParams(tokenStr)
    const o: Record<string, string> = {}
    const bb = q.get('b')
    const uu = q.get('u')
    if (bb) o.b = bb
    else if (uu) o.u = uu
    else return null
    return o
  }, [tokenStr])
  // Link aus der Erinnerung „nur noch bestätigen“: Die geht an die buchende Person.
  const erinnerung = useMemo(() => Boolean(tokenStr && new URLSearchParams(tokenStr).get('e') === '1'), [tokenStr])
  // Vierteiliges u = Link aus der Smoobu-Check-in-Vorlage (eigene Fehlertexte)
  const istVorlage = Boolean(token?.u && token.u.split('.').length > 2)

  const [daten, setDaten] = useState<StatusData | null>(null)
  const [phase, setPhase] = useState<Phase>('laden')
  const [fehlerText, setFehlerText] = useState('')
  const [hinweis, setHinweis] = useState('')
  const [sendet, setSendet] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [setupIntentId, setSetupIntentId] = useState<string | null>(null)
  const [karteFehler, setKarteFehler] = useState('')
  const [papierNoetig, setPapierNoetig] = useState(false)
  // Karte bzw. Apple Pay schon für eine andere Person verwendet (Dashboard: eigene_karte).
  const [eigeneKarteFehlt, setEigeneKarteFehlt] = useState(false)
  const [applePayAus, setApplePayAus] = useState(false)
  const [nurIch, setNurIch] = useState(false)
  const [konflikt, setKonflikt] = useState<Konflikt | null>(null)
  const [nameEingabe, setNameEingabe] = useState('')
  const [nameFehler, setNameFehler] = useState('')

  // Aktiver Schein als Ref, damit ein Klick, der das Token gerade erst anlegt,
  // es im selben Aufruf schon mitschickt; dazu der Stand des Scheins und die
  // eigenen weiteren Scheine auf diesem Gerät. hauptRef: Auf diesem Gerät wurde
  // der erste Schein begonnen (dann ohne nurWennFrei, Korrektur wie bisher).
  const aktivRef = useRef<Aktiv>({ token: null, nr: null })
  const [aktiv, setAktivAnzeige] = useState<Aktiv>(aktivRef.current)
  const aktivSetzen = useCallback((a: Aktiv) => { aktivRef.current = a; setAktivAnzeige(a) }, [])
  const hauptRef = useRef(false)
  const [hauptHier, setHauptHierAnzeige] = useState(false)
  const hauptSetzen = useCallback((v: boolean) => { hauptRef.current = v; setHauptHierAnzeige(v) }, [])
  const [stand, setStand] = useState<Stand>({ status: 'offen', bestaetigungErlaubt: false })
  const [eigene, setEigene] = useState<Eigener[]>([])
  const [ohneSpeicher, setOhneSpeicher] = useState(false)

  // Scan
  const [scanLaeuft, setScanLaeuft] = useState(false)
  const [scanHinweis, setScanHinweis] = useState<'' | 'erkannt' | 'unsicher' | 'nichtErkannt'>('')
  const [fotoVorhanden, setFotoVorhanden] = useState(false)

  // Formular
  const [f, setF] = useState<Felder>({ ...LEER })
  const [foto, setFoto] = useState<string | null>(null)
  const [fotoName, setFotoName] = useState('')
  const [fotoFehler, setFotoFehler] = useState(false)
  const [einwilligung, setEinwilligung] = useState(false)
  const [einwilligungFehlt, setEinwilligungFehlt] = useState(false)
  const [fehlerFelder, setFehlerFelder] = useState<string[]>([])

  const schoenesDatum = useCallback((iso?: string | null) => {
    if (!iso) return ''
    const zeit = Date.parse(`${iso}T12:00:00`)
    return Number.isFinite(zeit) ? new Date(zeit).toLocaleDateString(datumsLocale, { day: 'numeric', month: 'long' }) : ''
  }, [datumsLocale])

  const post = useCallback(async (action: string, body: Record<string, unknown> = {}) => {
    const tok = aktivRef.current.token
    // Schein-Token bei jeder Aktion eines weiteren Scheins; die Status-Abfrage schickt stattdessen personTokens.
    const person = action !== 'status' && tok ? { personToken: tok } : {}
    // Den ersten Schein, der nicht auf diesem Gerät begonnen wurde, nur schreiben, solange niemand damit angefangen hat.
    const frei = !tok && !hauptRef.current && SCHREIBT_HAUPT.includes(action) ? { nurWennFrei: true } : {}
    const r = await fetch('/api/meldeschein', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...token, ...person, ...frei, ...body }),
    })
    const d = await r.json()
    return { status: r.status, d }
  }, [token])

  /** Fehlertext für einen Abbruch. Die 404 des Dashboards sind absichtlich
   *  gleich (verraten nicht, ob es eine Buchung gibt) — unterschieden wird nur
   *  nach Linkart, damit der Gast den passenden Rückweg liest. */
  const fehlerFuer = useCallback((status: number, d: { code?: string; error?: string }) => {
    if (d.code === 'vorlage_unvollstaendig') return t.fehler.vorlageUnvollstaendig
    if (status === 404) return token?.b ? t.fehler.linkUngueltig : istVorlage ? t.fehler.vorlageUngueltig : t.fehler.keinAufenthalt
    if (status === 429) return t.fehler.zuViele
    if (status >= 500) return t.fehler.standard
    return d.error || t.fehler.standard
  }, [t, token, istVorlage])

  // ── Eigene Scheine ──────────────────────────────────────────────────────
  /** `meine` den gemerkten Tokens zuordnen. Tokens ohne bekannte nr fragt die
   *  Seite einzeln ab (nur die aus `klaeren`); `aufraeumen` vergisst dabei
   *  Tokens, die nie etwas geschrieben haben. */
  const eigeneErmitteln = useCallback(async (s: StatusData, klaeren: string[] | 'alle', aufraeumen: boolean) => {
    const k = schluessel(s)
    if (!s.weitere || !Array.isArray(s.meine) || !k) return []
    const { eigene: liste, ohneNr } = zuordnen(scheinSpeicher.eigene(k), s.meine)
    for (const tok of ohneNr) {
      if (klaeren !== 'alle' && !klaeren.includes(tok)) continue
      const { d } = await post('status', { personTokens: [tok] })
      const m = d?.ok && Array.isArray(d.meine) && d.meine.length === 1 ? (d.meine[0] as MeinSchein) : null
      if (m && typeof m.nr === 'number') { scheinSpeicher.nrMerken(k, tok, m.nr); liste.push({ ...m, token: tok }) }
      else if (aufraeumen && d?.ok) scheinSpeicher.vergessen(k, tok)
    }
    const reihe = scheinSpeicher.eigene(k).map((g) => g.t)
    return liste.sort((x, y) => reihe.indexOf(x.token) - reihe.indexOf(y.token))
  }, [post])

  /** Neues Schein-Token anlegen und VOR dem ersten Schreiben merken (idempotent bei Doppeltipp). */
  const neuerSchein = () => {
    const tok = neuesToken()
    const k = schluessel(daten)
    if (k && daten) scheinSpeicher.merken(k, daten.departure || daten.arrival || heuteIso(), tok)
    aktivSetzen({ token: tok, nr: null })
    return tok
  }

  const scheinVergessen = (tok: string | null) => {
    const k = schluessel(daten)
    if (k && tok) scheinSpeicher.vergessen(k, tok)
  }

  /** Den ersten Schein hat dieses Gerät begonnen: ab jetzt ohne nurWennFrei. */
  const hauptMerken = () => {
    const k = schluessel(daten)
    if (k && daten) scheinSpeicher.hauptMerken(k, daten.departure || daten.arrival || heuteIso())
    hauptSetzen(true)
    aktivSetzen({ token: null, nr: 1 })
  }

  /** Antwort eines Schreibschritts: beim weiteren Schein die nr merken, beim ersten den Vermerk. */
  const geschrieben = (d: { ich?: { nr?: unknown } | null }) => {
    const tok = aktivRef.current.token
    if (!tok) { hauptMerken(); return }
    const nr = d.ich && typeof d.ich.nr === 'number' ? d.ich.nr : null
    const k = schluessel(daten)
    if (nr === null) return
    if (k) scheinSpeicher.nrMerken(k, tok, nr)
    aktivSetzen({ token: tok, nr })
  }

  /** Zahlen und eigene Liste im Hintergrund auffrischen; Phase und Stand bleiben. */
  const nachladen = useCallback(async () => {
    try {
      const { d } = await post('status', { personTokens: scheinSpeicher.alle() })
      if (!d.ok) return
      const s = d as StatusData
      const tok = aktivRef.current.token
      const liste = await eigeneErmitteln(s, tok ? [tok] : [], false)
      setDaten(s)
      setEigene(liste)
      const ich = liste.find((e) => e.token === tok)
      if (ich && aktivRef.current.token === tok) aktivSetzen({ token: tok, nr: ich.nr })
    } catch {
      // Nur die Zahlen und die Liste bleiben dann alt; der Ablauf hängt nicht daran.
    }
  }, [post, eigeneErmitteln, aktivSetzen])

  const laden = useCallback(async () => {
    if (tokenStr === undefined) return // Token wird noch gelesen
    setPhase('laden')
    if (!token) { setFehlerText(t.fehler.keinToken); setPhase('fehler'); return }
    // Nicht ersetzte Smoobu-Platzhalter ([bookingID] …) gar nicht erst schicken
    if (token.u && /[[\]{}]/.test(token.u)) { setFehlerText(t.fehler.vorlageUnvollstaendig); setPhase('fehler'); return }
    try {
      const { status, d } = await post('status', { personTokens: scheinSpeicher.alle() })
      if (!d.ok) { setFehlerText(fehlerFuer(status, d)); setPhase('fehler'); return }
      const s = d as StatusData
      const liste = await eigeneErmitteln(s, 'alle', true)
      const k = schluessel(s)
      const hier = hauptRef.current || Boolean(k && scheinSpeicher.hatHaupt(k))
      hauptSetzen(hier)
      setDaten(s)
      setEigene(liste)
      setOhneSpeicher(speicherArt() === null)
      const namen = () => { if (s.gast) setF((x) => ({ ...x, familienname: x.familienname || s.gast!.familienname, vorname: x.vorname || s.gast!.vorname })) }
      const ersterZeigen = () => {
        aktivSetzen({ token: null, nr: 1 })
        setStand(hauptStand(s))
        if (s.status === 'offen') { namen(); setPhase('frage') } else setPhase('fertig')
      }
      const eigenenZeigen = (e: Eigener) => {
        aktivSetzen({ token: e.token, nr: e.nr })
        setStand({ status: e.status, bestaetigungErlaubt: Boolean(e.bestaetigungErlaubt), bestaetigungAb: s.arrival })
        setPapierNoetig(Boolean(e.papierNoetig) && !e.eigeneKarte)
        setEigeneKarteFehlt(Boolean(e.eigeneKarte))
        setPhase(e.status === 'offen' ? 'scan' : 'fertig')
      }
      if (!s.weitere) { aktivSetzen({ token: null, nr: null }); setStand(hauptStand(s)); namen(); setPhase(s.status === 'offen' ? 'frage' : 'fertig'); return } // älteres Dashboard
      const vorher = aktivRef.current
      const braucht = (st: ScheinStatus) => st === 'offen' || st === 'eingereicht'
      const offenerEigener = [...liste].reverse().find((e) => braucht(e.status))
      const gerade = liste.find((e) => e.token === vorher.token)
      if (gerade) return eigenenZeigen(gerade)
      if ((vorher.nr === 1 && hier) || (erinnerung && s.status === 'eingereicht')) return ersterZeigen()
      if (offenerEigener) return eigenenZeigen(offenerEigener)
      if (hier) return ersterZeigen()
      if (liste.length) return eigenenZeigen(liste[liste.length - 1])
      // Kein eigener Schein auf diesem Gerät. Den Namen aus dem Buchungslink nur
      // für den ersten Schein vorausfüllen: Wer danach kommt, ist meist nicht die buchende Person.
      aktivSetzen({ token: null, nr: null })
      setStand(hauptStand(s))
      if (s.status === 'offen' && !s.weitere.begonnen) { namen(); setPhase('frage') }
      else setPhase('schonDa')
    } catch {
      setFehlerText(t.fehler.standard)
      setPhase('fehler')
    }
  }, [tokenStr, token, t, post, fehlerFuer, eigeneErmitteln, aktivSetzen, hauptSetzen, erinnerung])

  useEffect(() => { laden() }, [laden])

  /** Mit Schein-Kennung kam ein 409 (über QR-Code oder Vorlagen-Link hat schon
   *  jemand eingereicht): nichts überschreiben, Stand neu laden. */
  const schonEingereicht = () => {
    setHinweis(t.fehler.bereitsEingereicht)
    return laden()
  }

  /** Den ersten Schein schreibt dieses Gerät mit nurWennFrei, und jemand anderes war schneller? */
  const istKonflikt = (code?: string) => !aktivRef.current.token && !hauptRef.current && KONFLIKT.includes(code || '')

  /** Fehler aus dem Personen-Ablauf (Dashboard): true, wenn behandelt. */
  const personFehler = (code?: string) => {
    const zuFrueh = Boolean(daten?.arrival && heuteIso() < vortag(daten.arrival))
    const text = code === 'grenze' ? (zuFrueh ? t.weitere.abVortag(schoenesDatum(vortag(daten!.arrival!))) : t.weitere.voll)
      : code === 'abgelaufen' ? t.person.abgelaufen
        : code === 'zu_viele' ? t.fehler.zuVieleNeu
          : code === 'person_token' ? t.fehler.standard : ''
    if (!text) return false
    setFehlerText(text)
    setPhase('fehler')
    return true
  }

  /** Alles für die nächste Person zurücksetzen; die Einwilligung gibt jede:r selbst. */
  const formularLeeren = () => {
    setF({ ...LEER }); setFoto(null); setFotoName(''); setFotoVorhanden(false); setFotoFehler(false)
    setScanHinweis(''); setEinwilligung(false); setEinwilligungFehlt(false); setFehlerFelder([])
    setClientSecret(null); setSetupIntentId(null); setKarteFehler(''); setPapierNoetig(false); setEigeneKarteFehlt(false); setHinweis('')
  }

  const weitereStarten = () => {
    formularLeeren()
    neuerSchein()
    setStand({ status: 'offen', bestaetigungErlaubt: false, bestaetigungAb: daten?.arrival })
    setPhase('scan')
    window.scrollTo({ top: 0 })
  }

  /** Den ersten Schein auf diesem Gerät (neu) beginnen: Startseite mit den drei Wahlen. */
  const ersterHier = () => {
    hauptMerken()
    setStand(daten ? hauptStand(daten) : { status: 'offen', bestaetigungErlaubt: false })
    setPhase('frage')
  }

  const deutsch = async (nurIchErklaert = false) => {
    setSendet(true)
    const tok = aktivRef.current.token
    try {
      const { status, d } = await post('deutsch', nurIchErklaert ? { nurIch: true } : {})
      if (d.ok && d.ich === null) {
        // Zu diesem Token gibt es keinen Schein: für diese Person nichts zu tun
        scheinVergessen(tok); aktivSetzen({ token: null, nr: null }); setPhase('ichFertig')
      } else if (d.ok) {
        if (!tok) { hauptMerken(); setNurIch(nurIchErklaert) }
        setStand((x) => ({ ...x, status: d.status === 'erhalten' ? 'erhalten' : 'entfaellt' }))
        setPhase('fertig')
        void nachladen()
      } else if (istKonflikt(d.code)) await laden() // jemand anderes hat mit dem ersten Schein angefangen
      else if (d.code === 'bereits_eingereicht') await schonEingereicht()
      else if (!personFehler(d.code)) { setFehlerText(fehlerFuer(status, d)); setPhase('fehler') }
    } catch { setFehlerText(t.fehler.standard); setPhase('fehler') }
    setSendet(false)
  }

  /** „Ich habe doch die deutsche Staatsangehörigkeit“ beim Ausfüllen: weiterer Schein entfällt samt Foto, beim ersten zurück zur Startseite. */
  const zurueckDeutsch = () => {
    if (aktivRef.current.token) { void deutsch(); return }
    setPhase('frage')
  }

  // ── Scan: Foto → OCR → Vorausfüllen ─────────────────────────────────────
  /** Dashboard lehnt ohne Einwilligung ab (422 einwilligung): zurück zum Haken. */
  const einwilligungNachholen = () => {
    setEinwilligung(false)
    setEinwilligungFehlt(true)
    setPhase('scan')
  }

  const fotoSenden = async (dataUrl: string, name: string) => {
    const { status, d } = await post('ausweis-lesen', { ausweisFoto: dataUrl, einwilligung: true })
    if (!d.ok) {
      if (d.code === 'einwilligung') einwilligungNachholen()
      else if (istKonflikt(d.code)) { setKonflikt({ code: d.code, aktion: 'ausweis-lesen', foto: dataUrl, fotoName: name }); setPhase('konflikt') }
      else if (d.code === 'bereits_eingereicht') await schonEingereicht()
      else if (d.code === 'erledigt') await laden()
      else if (status === 429 && d.code !== 'zu_viele') { setFehlerText(t.fehler.zuViele); setPhase('fehler') }
      else if (!personFehler(d.code)) setScanHinweis('nichtErkannt')
      return
    }
    geschrieben(d)
    setFotoVorhanden(true)
    setFoto(dataUrl)
    setFotoName(name)
    if (d.gefunden && d.felder) {
      const o = d.felder as OcrFelder
      setF((x) => ({
        ...x,
        familienname: o.familienname || x.familienname,
        vorname: o.vorname || x.vorname,
        geburtsdatum: o.geburtsdatum || x.geburtsdatum,
        staatsangehoerigkeit: o.staatsangehoerigkeit && o.staatsangehoerigkeit !== 'DE' ? o.staatsangehoerigkeit : x.staatsangehoerigkeit,
        passnummer: o.passnummer || x.passnummer,
      }))
      setScanHinweis(d.sicher ? 'erkannt' : 'unsicher')
    } else {
      setScanHinweis('nichtErkannt')
    }
    setPhase('formular')
  }

  const scannen = async (file: File | null) => {
    if (!file || scanLaeuft) return
    if (!einwilligung) { setEinwilligungFehlt(true); return }
    setScanLaeuft(true)
    setScanHinweis('')
    try {
      await fotoSenden(await fotoVerkleinern(file), file.name)
    } catch {
      setScanHinweis('nichtErkannt')
    }
    setScanLaeuft(false)
  }

  const fotoWaehlen = async (file: File | null) => {
    if (!file) return
    setFotoFehler(false)
    try {
      setFoto(await fotoVerkleinern(file))
      setFotoName(file.name)
      setFotoVorhanden(false) // neues Foto → wird mit dem Formular geschickt
    } catch {
      setFoto(null); setFotoName(''); setFotoFehler(true)
    }
  }

  const einreichenSenden = async (body: Record<string, unknown>) => {
    setSendet(true)
    try {
      const { status, d } = await post('einreichen', body)
      if (!d.ok) {
        setSendet(false)
        if (d.code === 'einwilligung') einwilligungNachholen()
        else if (istKonflikt(d.code)) { setKonflikt({ code: d.code, aktion: 'einreichen', body }); setPhase('konflikt') }
        else if (d.code === 'bereits_eingereicht') await schonEingereicht()
        else if (Array.isArray(d.fehler) && d.fehler.length) { setFehlerFelder(d.fehler); setPhase('formular') }
        else if (!personFehler(d.code)) { setFehlerText(fehlerFuer(status, d)); setPhase('fehler') }
        return
      }
      geschrieben(d)
      setStand({ status: 'eingereicht', bestaetigungErlaubt: !d.zuFrueh, bestaetigungAb: d.ab || daten?.arrival })
      setDaten((x) => (x ? { ...x, stripe: d.stripe ?? x.stripe } : x))
      if (d.clientSecret) {
        setClientSecret(d.clientSecret)
        setSetupIntentId(d.setupIntentId)
        setPhase('karte')
      } else {
        // Vor dem Anreisetag (oder ohne Stripe): Angaben liegen vor, Bestätigung später.
        setPhase('fertig')
      }
      void nachladen()
    } catch { setFehlerText(t.fehler.standard); setPhase('fehler') }
    setSendet(false)
  }

  const einreichen = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sendet) return
    const lokal: string[] = []
    if (!f.familienname.trim()) lokal.push('familienname')
    if (!f.vorname.trim()) lokal.push('vorname')
    if (!f.geburtsdatum) lokal.push('geburtsdatum')
    if (!f.staatsangehoerigkeit || f.staatsangehoerigkeit === 'DE') lokal.push('staatsangehoerigkeit')
    if (f.strasse.trim().length < 2) lokal.push('strasse')
    if (f.ort.trim().length < 2) lokal.push('ort')
    if (!f.land) lokal.push('land')
    if (f.passnummer.trim().length < 4) lokal.push('passnummer')
    if (!foto && !fotoVorhanden) lokal.push('ausweisFoto')
    setFehlerFelder(lokal)
    if (!einwilligung) { einwilligungNachholen(); return }
    if (lokal.length) return
    const staaten = [f.staatsangehoerigkeit, f.staatsangehoerigkeit2].filter((s, i, l) => s && s !== 'DE' && l.indexOf(s) === i)
    const body: Record<string, unknown> = {
      familienname: f.familienname, vorname: f.vorname, geburtsdatum: f.geburtsdatum,
      staatsangehoerigkeit: f.staatsangehoerigkeit, staatsangehoerigkeiten: staaten,
      anschrift: anschriftZeile(f),
      anschriftTeile: { land: f.land, plz: f.plz, ort: f.ort, strasse: f.strasse, hausnummer: f.hausnummer },
      passnummer: f.passnummer, anzahlAngehoerige: Number(f.angehoerige) || 0, einwilligung: true,
    }
    if (foto && !fotoVorhanden) body.ausweisFoto = foto
    await einreichenSenden(body)
  }

  /** Konflikt beim ersten Schein: dieselben Angaben samt Foto noch einmal senden, als eigener Schein (neues Token) oder als erster. */
  const konfliktLoesen = async (alsEigener: boolean) => {
    const k = konflikt
    if (!k) return
    setKonflikt(null)
    if (alsEigener) neuerSchein()
    else hauptMerken()
    setStand({ status: 'offen', bestaetigungErlaubt: false, bestaetigungAb: daten?.arrival })
    if (k.aktion === 'ausweis-lesen') {
      setPhase('scan')
      setScanLaeuft(true)
      try { await fotoSenden(k.foto || '', k.fotoName || '') } catch { setScanHinweis('nichtErkannt') }
      setScanLaeuft(false)
      return
    }
    setPhase('formular')
    await einreichenSenden({ ...(k.body || {}), ...(!(k.body || {}).ausweisFoto && foto ? { ausweisFoto: foto } : {}) })
  }

  const bestaetigungStarten = async (extra: Record<string, unknown> = {}) => {
    setSendet(true)
    try {
      const { d } = await post('bestaetigung-starten', extra)
      if (d.ok && d.clientSecret) {
        setClientSecret(d.clientSecret); setSetupIntentId(d.setupIntentId); setKarteFehler(''); setPapierNoetig(false); setEigeneKarteFehlt(false); setPhase('karte')
      } else if (d.code === 'name_falsch') {
        setNameFehler(t.name.falsch)
      } else if (d.code === 'zu_frueh') {
        setStand((x) => ({ ...x, bestaetigungErlaubt: false, bestaetigungAb: d.ab || x.bestaetigungAb }))
      } else if (d.code === 'nicht_eingereicht') {
        await laden()
      } else if (!personFehler(d.code)) {
        setKarteFehler(t.karte.fehlgeschlagen)
      }
    } catch { setKarteFehler(t.karte.fehlgeschlagen) }
    setSendet(false)
  }

  /** Schein aus der Liste „Auf diesem Handy“ bestätigen. */
  const bestaetigenFuer = (a: Aktiv, st: Stand, vorname = '') => {
    formularLeeren()
    if (vorname) setF((x) => ({ ...x, vorname }))
    aktivSetzen(a)
    setStand(st)
    setPhase('fertig')
    void bestaetigungStarten()
  }

  const fortsetzenMit = (e: Eigener | null) => {
    formularLeeren()
    if (!e) { aktivSetzen({ token: null, nr: 1 }); setStand(daten ? hauptStand(daten) : stand); setPhase('frage'); return }
    if (e.vorname) setF((x) => ({ ...x, vorname: e.vorname! }))
    aktivSetzen({ token: e.token, nr: e.nr })
    setStand({ status: 'offen', bestaetigungErlaubt: false, bestaetigungAb: daten?.arrival })
    setPhase('scan')
  }

  /** Ersten Schein von diesem Gerät bestätigen, auf dem er nicht ausgefüllt wurde: nur mit dessen Familiennamen. */
  const nameSenden = (e: React.FormEvent) => {
    e.preventDefault()
    if (!daten || sendet) return
    setNameFehler('')
    setKarteFehler('')
    aktivSetzen({ token: null, nr: 1 })
    setStand(hauptStand(daten))
    void bestaetigungStarten({ familienname: nameEingabe.trim() })
  }

  const bestaetigt = async () => {
    setKarteFehler('')
    try {
      const { status, d } = await post('bestaetigen', { setupIntentId })
      if (d.ok) { setStand((x) => ({ ...x, status: 'erhalten' })); setPapierNoetig(false); setEigeneKarteFehlt(false); setPhase('fertig'); void nachladen(); return }
      // Dashboard/Stripe gerade nicht erreichbar: derselbe SetupIntent lässt sich
      // gleich noch einmal prüfen, der Gast bleibt in der Kartenphase.
      if (status >= 500 || status === 429) { setKarteFehler(t.karte.fehlgeschlagen); return }
      // Schon bestätigt (andere Sitzung oder verlorene Antwort): den echten Stand
      // laden statt einen Fehler zu zeigen, „erhalten“ erscheint dann als fertig.
      if (d.code === 'nicht_eingereicht') { setClientSecret(null); setSetupIntentId(null); await laden(); return }
      // Abgelehnt: dieser SetupIntent ist verbraucht. Status bleibt „eingereicht",
      // ein neuer Versuch startet über „Jetzt bestätigen" mit frischem SetupIntent.
      setClientSecret(null); setSetupIntentId(null)
      if (d.code === 'zu_frueh') setStand((x) => ({ ...x, bestaetigungErlaubt: false, bestaetigungAb: d.ab || x.bestaetigungAb }))
      // Karte schon für eine andere Person verwendet: Das Apple Pay dieses Geräts gehört dann wohl ihr.
      const fremdeKarte = d.code === 'eigene_karte'
      if (fremdeKarte) setApplePayAus(true)
      setEigeneKarteFehlt(fremdeKarte)
      setPapierNoetig(d.code === 'papier_noetig')
      setKarteFehler(d.code === 'papier_noetig' || fremdeKarte ? '' : d.code === 'keine_sca' ? t.karte.keineSca : t.karte.fehlgeschlagen)
      setPhase('fertig')
    } catch { setKarteFehler(t.karte.fehlgeschlagen) }
  }

  const laenderListe = useMemo(() => {
    let namen: Intl.DisplayNames | null = null
    try { namen = new Intl.DisplayNames([locale === 'de' ? 'de' : 'en'], { type: 'region' }) } catch { namen = null }
    const sortiert = ISO.filter((c) => !UNBEWOHNT.has(c))
      .map((c) => ({ c, n: namen?.of(c) || c }))
      .sort((x, y) => x.n.localeCompare(y.n, locale))
    return {
      staaten: sortiert.filter((l) => l.c !== 'DE'),
      // Wohnsitz in Deutschland ist bei ausländischen Monteuren häufig: oben anbieten
      wohnsitz: [...sortiert.filter((l) => l.c === 'DE'), ...sortiert.filter((l) => l.c !== 'DE')],
    }
  }, [locale])

  // Sprachwechsel: Token kommt aus dem sessionStorage; nur wenn der gesperrt ist,
  // muss er wie früher in die URL.
  const tokenQuery = tokenStr && token && !imSpeicher ? `?${tokenStr}` : ''
  const kopf = (
    <div className="mx-auto mb-8 max-w-xl text-center">
      <p className="font-body text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">{t.eyebrow}</p>
      <h1 className="font-display text-display-md text-forest-900 mt-2 text-balance">{t.titel}</h1>
      {daten?.einheit && (
        <p className="font-body text-xs uppercase tracking-[0.18em] text-forest-600 mt-3">
          {t.aufenthalt(daten.einheit, schoenesDatum(daten.arrival), schoenesDatum(daten.departure))}
        </p>
      )}
      <Link
        href={`${locale === 'de' ? '/en/meldeschein' : '/meldeschein'}${tokenQuery}`}
        className="mt-3 inline-block font-body text-xs text-forest-600 underline underline-offset-4 hover:text-forest-900"
      >
        {t.sprachwechsel}
      </Link>
    </div>
  )
  const fuss = (
    <>
      <p className={`${klein} mx-auto mt-6 max-w-xl text-center`}>{t.fuss}</p>
      {/* Englische Gäste: Kurzfassung der (nur deutschen) Datenschutzerklärung, Art. 12 DSGVO */}
      {t.datenschutzKurz && <p className={`${klein} mx-auto mt-3 max-w-xl text-center`}>{t.datenschutzKurz}</p>}
    </>
  )
  const spinner = <div className="mx-auto my-6 h-9 w-9 animate-spin rounded-full border-[3px] border-cream-200 border-t-gold-500" />
  const textLink = 'font-body text-sm font-semibold text-forest-800 underline underline-offset-4 disabled:opacity-60'

  if (phase === 'laden') {
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl text-center`}>
          {spinner}
          <p className="font-body text-sm text-forest-600">{t.laden}</p>
        </div>
      </>
    )
  }

  if (phase === 'fehler' || !daten) {
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl text-center`}>
          <h2 className="font-display text-2xl text-forest-900 mb-3">{t.fehler.titel}</h2>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{fehlerText}</p>
          <button className={`${cta} mt-6`} onClick={() => window.location.reload()}>{t.fehler.erneut}</button>
        </div>
      </>
    )
  }

  const istWeiterer = Boolean(aktiv.token)
  // Scheine auf diesem Gerät für die Liste „Auf diesem Handy“: der erste, wenn er hier begonnen wurde, und die eigenen weiteren.
  const kannBestaetigen = (st: ScheinStatus, erlaubt?: boolean) => st === 'eingereicht' && Boolean(erlaubt) && Boolean(daten.stripe)
  const eintraege: ListenEintrag[] = [
    ...(hauptHier ? [{
      key: 'erster', label: t.weitere.haupt, status: daten.status, aktiv: !aktiv.token,
      bestaetigen: kannBestaetigen(daten.status, daten.bestaetigungErlaubt) ? () => bestaetigenFuer({ token: null, nr: 1 }, hauptStand(daten)) : undefined,
      fortsetzen: daten.status === 'offen' ? () => fortsetzenMit(null) : undefined,
    }] : []),
    ...eigene.map((e) => ({
      key: e.token, label: e.vorname || t.weitere.schein(e.nr), status: e.status, aktiv: e.token === aktiv.token,
      bestaetigen: kannBestaetigen(e.status, e.bestaetigungErlaubt)
        ? () => bestaetigenFuer({ token: e.token, nr: e.nr }, { status: e.status, bestaetigungErlaubt: true, bestaetigungAb: daten.arrival }, e.vorname)
        : undefined,
      fortsetzen: e.status === 'offen' ? () => fortsetzenMit(e) : undefined,
    })),
  ]
  const weitereBlock = daten.weitere ? (
    <WeiterePersonen
      t={t.weitere}
      weitere={daten.weitere}
      eintraege={eintraege}
      arrival={daten.arrival}
      departure={daten.departure}
      sendet={sendet}
      datum={schoenesDatum}
      stil={{ sekundaer, klein, lbl }}
      onNeu={weitereStarten}
    />
  ) : null
  const speicherHinweis = daten.weitere && ohneSpeicher ? <p className="font-body text-sm text-amber-700 mt-3">{t.person.ohneSpeicher}</p> : null
  const dochDeutsch = daten.weitere ? (
    <p className="mt-4 text-center">
      <button type="button" className={textLink} disabled={sendet} onClick={zurueckDeutsch}>{t.scan.dochDeutsch}</button>
    </p>
  ) : null
  const neueErstAb = daten.arrival && heuteIso() < vortag(daten.arrival) ? vortag(daten.arrival) : null

  if (phase === 'fertig') {
    const eigenerVorname = eigene.find((e) => e.token === aktiv.token)?.vorname || ''
    const s = stand.status
    const eingereicht = s === 'eingereicht'
    const titel = s === 'entfaellt' ? (nurIch && !istWeiterer ? t.schonDa.fertigTitel : t.fertig.entfaelltTitel) : eingereicht ? t.fertig.eingereichtTitel : t.fertig.erhaltenTitel
    let text = s === 'entfaellt' ? (nurIch && !istWeiterer ? t.fertig.nurIchText : t.fertig.entfaelltText) : t.fertig.erhaltenText
    if (eingereicht) {
      const ab = schoenesDatum(stand.bestaetigungAb || daten.arrival)
      text = !daten.stripe ? t.karte.ohneStripe
        // Weitere Personen bekommen keine Erinnerung: kein Kanal zu ihnen
        : !stand.bestaetigungErlaubt ? (istWeiterer ? t.person.zuFrueh(ab) : t.karte.zuFrueh(ab))
          : eigeneKarteFehlt ? t.karte.eigeneKarte
            : papierNoetig ? t.karte.papierNoetig
              : t.fertig.eingereichtText
    }
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl text-center`}>
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-2xl">✓</span>
          <h2 className="font-display text-2xl text-forest-900 mb-2">{titel}</h2>
          {/* Mehrere Scheine auf einem Handy: sagen, wessen Schein hier steht */}
          {eintraege.length > 1 && eigenerVorname && <p className="font-body text-sm text-forest-800 mb-2">{t.weitere.von(eigenerVorname)}</p>}
          {eingereicht && hinweis && <p className="font-body text-sm text-forest-800 mb-2">{hinweis}</p>}
          <p className="font-body text-sm text-forest-600 leading-relaxed">{text}</p>
          {eingereicht && daten.stripe && stand.bestaetigungErlaubt && (
            <button className={`${cta} mt-6`} disabled={sendet} onClick={() => bestaetigungStarten()}>
              {eigeneKarteFehlt ? t.fertig.eigeneKarte : papierNoetig ? t.fertig.andereKarte : t.fertig.nochmal}
            </button>
          )}
          {karteFehler && <p className="font-body text-sm text-red-600 mt-3">{karteFehler}</p>}
          {eingereicht && speicherHinweis}
          {weitereBlock}
        </div>
        {fuss}
      </>
    )
  }

  if (phase === 'ichFertig') {
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl text-center`}>
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-2xl">✓</span>
          <h2 className="font-display text-2xl text-forest-900 mb-2">{t.schonDa.fertigTitel}</h2>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{t.schonDa.fertigText}</p>
          {weitereBlock}
        </div>
        {fuss}
      </>
    )
  }

  if (phase === 'schonDa') {
    // Der erste Schein liegt vor oder ist begonnen, aber nicht auf diesem Gerät. Statt
    // ihn zum Bestätigen anzubieten (das wäre oft der Schein eines anderen), zuerst
    // die Frage nach der eigenen Person. Die buchende Person kommt über den
    // Erinnerungslink zur Bestätigung, sonst über „ersten bestätigen“ mit dem Familiennamen.
    const st = daten.status
    const variante = st === 'offen' ? 'begonnen' : st === 'entfaellt' ? 'entfaellt' : 'vorhanden'
    const ersterOffen = st === 'eingereicht' && Boolean(daten.weitere?.ersterOffen) && Boolean(daten.stripe)
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl text-center`}>
          <p className="font-body text-sm text-forest-800 leading-relaxed mb-4">{t.schonDa[variante]}</p>
          <h2 className="font-display text-2xl text-forest-900 mb-3">{t.schonDa.titel}</h2>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{t.schonDa.text}</p>
          <div className="mt-6 flex flex-col gap-3">
            {/* Nicht erst nach Foto und Formular am Einreichen scheitern (409 grenze) */}
            {neueErstAb
              ? <p className={klein}>{t.weitere.abVortag(schoenesDatum(neueErstAb))}</p>
              : daten.weitere && !daten.weitere.moeglich
                ? <p className={klein}>{t.weitere.voll}</p>
                : <button className={cta} disabled={sendet} onClick={weitereStarten}>{t.schonDa.eigenen}</button>}
            <button className={sekundaer} disabled={sendet} onClick={() => setPhase('ichFertig')}>{t.schonDa.deutsch}</button>
          </div>
          <div className="mt-6 flex flex-col items-center gap-3">
            {ersterOffen && (
              <button className={textLink} disabled={sendet} onClick={() => { setNameEingabe(''); setNameFehler(''); setKarteFehler(''); setPhase('nameFrage') }}>
                {t.schonDa.ersterBestaetigen}
              </button>
            )}
            {variante === 'begonnen' && <button className={textLink} disabled={sendet} onClick={ersterHier}>{t.schonDa.selbstBegonnen}</button>}
            {/* Über den QR-Code eingereicht, hier der Buchungs-Link: Den QR-Code kann auch ein früherer Gast fotografiert haben (Rangfolge b > qr). */}
            {daten.weitere?.ersterUeberQr && <button className={textLink} disabled={sendet} onClick={ersterHier}>{t.schonDa.ueberQr}</button>}
            {variante === 'entfaellt' && <button className={textLink} disabled={sendet} onClick={ersterHier}>{t.schonDa.selbstEntfaellt}</button>}
          </div>
        </div>
        {fuss}
      </>
    )
  }

  if (phase === 'nameFrage') {
    return (
      <>
        {kopf}
        <form className={`${karte} mx-auto max-w-xl space-y-4`} onSubmit={nameSenden} noValidate>
          <h2 className="font-display text-2xl text-forest-900">{t.name.titel}</h2>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{t.name.text}</p>
          <div>
            <label className={lbl} htmlFor="meldeschein-erster-name">{t.name.feld}</label>
            <input id="meldeschein-erster-name" className={`${feld} ${nameFehler ? feldFehler : ''}`} value={nameEingabe}
              onChange={(e) => setNameEingabe(e.target.value)} autoComplete="family-name" />
          </div>
          {nameFehler && <p className="font-body text-sm text-red-600">{nameFehler}</p>}
          {karteFehler && <p className="font-body text-sm text-red-600">{karteFehler}</p>}
          <button type="submit" className={cta} disabled={sendet || nameEingabe.trim().length < 2}>{t.name.weiter}</button>
          <button type="button" className={sekundaer} disabled={sendet} onClick={() => setPhase('schonDa')}>{t.name.zurueck}</button>
        </form>
        {fuss}
      </>
    )
  }

  if (phase === 'konflikt' && konflikt) {
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl text-center`}>
          <h2 className="font-display text-2xl text-forest-900 mb-3">{t.konflikt.titel}</h2>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{t.konflikt.text}</p>
          <div className="mt-6 flex flex-col gap-3">
            <button className={cta} disabled={sendet} onClick={() => konfliktLoesen(true)}>{t.konflikt.speichern}</button>
            {/* Nur ein Foto, noch nichts eingereicht: vielleicht der eigene Anlauf auf einem anderen Gerät */}
            {konflikt.code === 'bereits_begonnen' && (
              <button className={sekundaer} disabled={sendet} onClick={() => konfliktLoesen(false)}>{t.konflikt.selbst}</button>
            )}
          </div>
        </div>
        {fuss}
      </>
    )
  }

  if (phase === 'frage') {
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl text-center`}>
          <h2 className="font-display text-2xl text-forest-900 mb-3">{t.frage.titel}</h2>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{t.frage.text}</p>
          {daten.personen && daten.personen > 1 && <p className={`${klein} mt-3`}>{t.frage.hinweisPersonen(daten.personen)}</p>}
          <div className="mt-6 flex flex-col gap-3">
            <button className={cta} disabled={sendet} onClick={() => deutsch()}>{t.frage.ja}</button>
            <button className={sekundaer} disabled={sendet}
              onClick={() => { aktivSetzen({ token: null, nr: 1 }); setPhase('scan') }}>
              {t.frage.nein}
            </button>
            {/* Deutsche:r Bucher:in mit ausländischen Kolleg:innen: erster Schein entfällt, danach die Kolleg:innen melden */}
            {daten.weitere && daten.personen !== 1 && (
              <button className={sekundaer} disabled={sendet} onClick={() => deutsch(true)}>{t.frage.nurIch}</button>
            )}
          </div>
        </div>
        {fuss}
      </>
    )
  }

  if (phase === 'scan') {
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl text-center`}>
          <h2 className="font-display text-2xl text-forest-900 mb-3">{t.scan.titel}</h2>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{t.scan.text}</p>
          <p className={`${klein} mt-2`}>{t.scan.tipp}</p>
          {speicherHinweis}
          {scanLaeuft ? (
            <>{spinner}<p className="font-body text-sm text-forest-600">{t.scan.liest}</p></>
          ) : (
            <>
              {/* Einwilligung VOR dem ersten Foto: schon /ausweis-lesen speichert es. */}
              <label className="mt-6 flex items-start gap-3 cursor-pointer text-left">
                <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-gold-500" checked={einwilligung}
                  onChange={(e) => { setEinwilligung(e.target.checked); if (e.target.checked) setEinwilligungFehlt(false) }} />
                <span className={klein}>
                  {t.einwilligung.text}{' '}
                  <Link href="/datenschutz" target="_blank" className="underline">{t.einwilligung.datenschutz}</Link>
                </span>
              </label>
              {einwilligungFehlt && <p className="font-body text-sm text-red-600 mt-2 text-left">{t.einwilligung.fehlt}</p>}
              <div className="mt-5 flex flex-col gap-3">
                <label className={`${cta} text-center ${einwilligung ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                  onClick={() => { if (!einwilligung) setEinwilligungFehlt(true) }}>
                  {t.scan.knopf}
                  <input type="file" accept="image/*" capture="environment" className="sr-only" disabled={!einwilligung}
                    onChange={(e) => scannen(e.target.files?.[0] ?? null)} />
                </label>
                {scanHinweis === 'nichtErkannt' && <p className="font-body text-sm text-red-600">{t.scan.nichtErkannt}</p>}
                <button className={sekundaer} disabled={!einwilligung} onClick={() => setPhase('formular')}>{t.scan.manuell}</button>
              </div>
              {dochDeutsch}
            </>
          )}
        </div>
        {fuss}
      </>
    )
  }

  if (phase === 'karte' && clientSecret) {
    // Das Apple Pay dieses Geräts hat schon eine andere Person bestätigt (hier oder laut Dashboard): nur die Karte anbieten.
    const anderesBestaetigt = (hauptHier && istWeiterer && daten.status === 'erhalten')
      || eigene.some((e) => e.token !== aktiv.token && e.status === 'erhalten')
    const applePay = !applePayAus && !anderesBestaetigt
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl`}>
          <h2 className="font-display text-2xl text-forest-900 mb-3 text-center">{t.karte.titel}</h2>
          <p className="font-body text-sm text-forest-600 leading-relaxed mb-5 text-center">{t.karte.text}</p>
          {!applePay && <p className="font-body text-sm text-amber-700 leading-relaxed mb-5 text-center">{t.karte.ohneApplePay}</p>}
          <Elements
            key={clientSecret /* clientSecret ist in Elements nicht änderbar: neuer SetupIntent → neu aufbauen */}
            stripe={stripeLaden()}
            options={{
              clientSecret,
              appearance: STRIPE_APPEARANCE,
              locale: locale === 'de' ? 'de' : 'en',
              fonts: [{ family: 'DM Sans', src: `url(${window.location.origin}/fonts/dm-sans-latin.woff2)`, weight: '400 600', display: 'swap' }],
            }}
          >
            <KartenBestaetigung
              applePay={applePay}
              t={t}
              fehler={karteFehler}
              onFehler={setKarteFehler}
              onErfolg={bestaetigt}
            />
          </Elements>
          <p className={`${klein} mt-5 text-center`}>{t.karte.papier}</p>
        </div>
        {fuss}
      </>
    )
  }

  // ── Formular ────────────────────────────────────────────────────────────
  // Fehlerschlüssel des Dashboards sind die Feldnamen des Rumpfs; „staatsangehoerigkeit“
  // gilt für alle Staaten, „anschrift“ markiert zusätzlich die Einzelfelder der Anschrift.
  const hat = (k: string) => fehlerFelder.includes(k)
    || (['strasse', 'ort', 'land'].includes(k) && fehlerFelder.includes('anschrift'))
  const set = (k: keyof Felder) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((x) => ({ ...x, [k]: e.target.value }))
  const rahmen = (k: string) => `${feld} ${hat(k) ? feldFehler : ''}`
  const staatOptionen = laenderListe.staaten.map((l) => <option key={l.c} value={l.c}>{l.n}</option>)

  return (
    <>
      {kopf}
      <form className={`${karte} mx-auto max-w-xl space-y-5`} onSubmit={einreichen} noValidate>
        <div>
          <h2 className="font-display text-2xl text-forest-900 mb-2">{t.formular.titel}</h2>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{t.formular.intro}</p>
          {scanHinweis === 'erkannt' && <p className="font-body text-sm text-forest-800 mt-2">✓ {t.scan.erkannt}</p>}
          {scanHinweis === 'unsicher' && <p className="font-body text-sm text-amber-700 mt-2">{t.scan.unsicher}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={lbl}>{t.formular.familienname}</label>
            <input className={rahmen('familienname')} value={f.familienname} onChange={set('familienname')} autoComplete="family-name" />
          </div>
          <div>
            <label className={lbl}>{t.formular.vorname}</label>
            <input className={rahmen('vorname')} value={f.vorname} onChange={set('vorname')} autoComplete="given-name" />
          </div>
          <div>
            <label className={lbl}>{t.formular.geburtsdatum}</label>
            <input type="date" className={rahmen('geburtsdatum')} value={f.geburtsdatum} onChange={set('geburtsdatum')} max={new Date().toISOString().slice(0, 10)} />
          </div>
          <div>
            <label className={lbl}>{t.formular.passnummer}</label>
            <input className={rahmen('passnummer')} value={f.passnummer} onChange={set('passnummer')} autoCapitalize="characters" />
          </div>
          <div>
            <label className={lbl}>{t.formular.staatsangehoerigkeit}</label>
            <select className={rahmen('staatsangehoerigkeit')} value={f.staatsangehoerigkeit} onChange={set('staatsangehoerigkeit')}>
              <option value="">{t.formular.landWaehlen}</option>
              {staatOptionen}
            </select>
          </div>
          <div>
            <label className={lbl}>{t.formular.staatsangehoerigkeit2}</label>
            <select className={feld} value={f.staatsangehoerigkeit2} onChange={set('staatsangehoerigkeit2')}>
              <option value="">{t.formular.keine}</option>
              {staatOptionen}
            </select>
          </div>
        </div>

        <fieldset>
          <legend className={lbl}>{t.formular.anschrift}</legend>
          <div className="grid grid-cols-[1fr_6.5rem] gap-3">
            <input className={rahmen('strasse')} value={f.strasse} onChange={set('strasse')} autoComplete="address-line1"
              placeholder={t.formular.strasse} aria-label={t.formular.strasse} />
            <input className={feld} value={f.hausnummer} onChange={set('hausnummer')}
              placeholder={t.formular.hausnummer} aria-label={t.formular.hausnummer} />
          </div>
          <div className="mt-3 grid grid-cols-[6.5rem_1fr] gap-3">
            <input className={feld} value={f.plz} onChange={set('plz')} autoComplete="postal-code"
              placeholder={t.formular.plz} aria-label={t.formular.plz} />
            <input className={rahmen('ort')} value={f.ort} onChange={set('ort')} autoComplete="address-level2"
              placeholder={t.formular.ort} aria-label={t.formular.ort} />
          </div>
          <select className={`${rahmen('land')} mt-3`} value={f.land} onChange={set('land')} autoComplete="country" aria-label={t.formular.land}>
            <option value="">{t.formular.land} …</option>
            {laenderListe.wohnsitz.map((l) => <option key={l.c} value={l.c}>{l.n}</option>)}
          </select>
        </fieldset>

        <div>
          <label className={lbl}>{t.formular.foto}</label>
          <p className={`${klein} mb-2`}>{t.formular.fotoHinweis}</p>
          <label className={`${sekundaer} cursor-pointer text-center ${hat('ausweisFoto') || fotoFehler ? 'border-red-400' : ''}`}>
            {foto || fotoVorhanden ? `✓ ${t.formular.fotoOk}${fotoName ? ` · ${fotoName}` : ''}` : t.formular.fotoWaehlen}
            <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => fotoWaehlen(e.target.files?.[0] ?? null)} />
          </label>
          {fotoFehler && <p className="font-body text-xs text-red-600 mt-2">{t.formular.fotoFehler}</p>}
          {/* eslint-disable-next-line @next/next/no-img-element -- data-URL-Vorschau, kein Optimierungsfall */}
          {foto && <img src={foto} alt="" className="mt-3 max-h-40 rounded-xl border border-cream-200 object-contain" />}
        </div>

        <div>
          <label className={lbl} htmlFor="meldeschein-angehoerige">{t.formular.mitreisende}</label>
          <p className={`${klein} mb-2`}>{t.formular.mitreisendeHinweis}</p>
          <select id="meldeschein-angehoerige" className={`${rahmen('anzahlAngehoerige')} sm:max-w-[12rem]`} value={f.angehoerige} onChange={set('angehoerige')}>
            {Array.from({ length: 13 }, (_, n) => <option key={n} value={String(n)}>{n === 0 ? t.formular.angehoerigeKeine : n}</option>)}
          </select>
        </div>

        {fehlerFelder.length > 0 && (
          <p className="font-body text-sm text-red-600">
            {t.formular.pflicht}{' '}
            {fehlerFelder.map((k) => (t.formular.feldFehler as Record<string, string>)[k]).filter(Boolean).join(' · ')}
          </p>
        )}

        <button type="submit" className={cta} disabled={sendet}>{sendet ? t.formular.sendet : t.formular.weiter}</button>
        {dochDeutsch}
      </form>
      {fuss}
    </>
  )
}

// Der Name des Karteninhabers ist nicht vorbelegt: Mit dem Namen aus dem
// Meldeschein sagte namePasst im Cockpit nichts mehr darüber, wessen Karte es war.
function KartenBestaetigung({ applePay, t, fehler, onFehler, onErfolg }: {
  applePay: boolean
  t: ReturnType<typeof getDict>['meldeschein']
  fehler: string
  onFehler: (s: string) => void
  onErfolg: () => Promise<void>
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [laeuft, setLaeuft] = useState(false)
  const [karteName, setKarteName] = useState('')

  const bestaetigen = async () => {
    if (!stripe || !elements || laeuft) return
    if (!karteName.trim()) { onFehler(t.karte.nameFehlt); return }
    setLaeuft(true)
    onFehler('')
    try {
      const { error } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
        confirmParams: { payment_method_data: { billing_details: { name: karteName.trim() } } },
      })
      // Schon bestätigt, nur die Prüfung im Dashboard hing (z. B. kurz nicht
      // erreichbar): nicht neu authentifizieren, nur erneut prüfen lassen —
      // ob das zählt, entscheidet ohnehin der Server.
      const schonBestaetigt = error?.setup_intent?.status === 'succeeded'
      if (error && !schonBestaetigt) { onFehler(error.message || t.karte.fehlgeschlagen); setLaeuft(false); return }
      await onErfolg()
    } catch {
      onFehler(t.karte.fehlgeschlagen)
    }
    setLaeuft(false)
  }

  return (
    <div className="space-y-4">
      {/* Apple Pay oben (nur wenn das Gerät es hat), Karte darunter — Regel siehe WALLETS. Hat das
          Apple Pay dieses Geräts schon eine andere Person bestätigt, nur die Karte (das Dashboard lehnte es ab). */}
      <PaymentElement options={{
        fields: { billingDetails: { name: 'never' } },
        wallets: { ...WALLETS, applePay: applePay ? 'auto' : 'never' },
        terms: TERMS,
        paymentMethodOrder: applePay ? ['apple_pay', 'card'] : ['card'],
      }} />
      <div>
        <label className={lbl}>{t.karte.name}</label>
        <input className={feld} value={karteName} onChange={(e) => setKarteName(e.target.value)} autoComplete="cc-name" placeholder={t.karte.nameHinweis} />
      </div>
      {fehler && <p className="font-body text-sm text-red-600">{fehler}</p>}
      <button className={cta} disabled={!stripe || laeuft} onClick={bestaetigen}>{laeuft ? t.karte.wartet : t.karte.knopf}</button>
    </div>
  )
}
