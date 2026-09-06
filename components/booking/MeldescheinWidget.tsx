'use client'

// Digitaler Meldeschein (§ 29 Abs. 5 BMG). Ablauf:
//   1. Status laden (Token b = Buchungslink, u = QR-Code in der Einheit)
//   2. Frage: deutsche Staatsangehörigkeit? → ja: fertig (kein Meldeschein nötig)
//   3. Scan: Pass/Ausweis fotografieren → Dashboard liest die MRZ (OCR) → Formular vorausgefüllt
//   4. Formular: Pflichtangaben nach § 30 BMG prüfen/ergänzen
//   5. Bestätigung (nur ab Anreisetag): Apple Pay / Google Pay / Karte mit 3-D Secure
//      (Stripe SetupIntent, keine Abbuchung) ersetzt die Unterschrift; das Dashboard
//      prüft das Ergebnis serverseitig.
// Alle Daten gehen über den Proxy /api/meldeschein ins Dashboard.

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js/pure'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { getDict } from '@/lib/i18n'
import { useLocale } from '@/lib/i18n/LocaleProvider'
import { STRIPE_APPEARANCE } from './PaymentStep'

type StatusData = {
  ok: boolean
  status: 'offen' | 'eingereicht' | 'erhalten' | 'entfaellt' | 'vernichtet'
  pflicht?: 'ja' | 'nein' | 'unklar'
  einheit?: string
  arrival?: string
  departure?: string
  personen?: number
  gast?: { vorname: string; familienname: string } | null
  stripe?: boolean
  bestaetigungAb?: string
  bestaetigungErlaubt?: boolean
  error?: string
}

type Mitreisender = { name: string; geburtsdatum: string; staat: string }
type OcrFelder = Partial<{
  ausweisArt: string; familienname: string; vorname: string; geburtsdatum: string | null
  staatsangehoerigkeit: string | null; ausstellendesLand: string | null; passnummer: string
}>

const LAENDER = [
  'AT', 'CH', 'NL', 'BE', 'LU', 'FR', 'IT', 'ES', 'PT', 'GB', 'IE', 'DK', 'SE', 'NO', 'FI', 'IS',
  'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'RS', 'BA', 'ME', 'MK', 'AL', 'XK', 'GR', 'CY', 'MT',
  'LV', 'LT', 'EE', 'UA', 'MD', 'BY', 'RU', 'TR', 'IL', 'US', 'CA', 'MX', 'BR', 'AR', 'AU', 'NZ',
  'JP', 'KR', 'CN', 'IN', 'AE', 'SA', 'ZA', 'EG',
]

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

const LEER = {
  familienname: '', vorname: '', geburtsdatum: '', staatsangehoerigkeit: '', anschrift: '',
  ausweisArt: 'Reisepass', passnummer: '', ausstellendesLand: '',
}

export default function MeldescheinWidget() {
  const locale = useLocale()
  const t = getDict(locale).meldeschein
  const datumsLocale = locale === 'de' ? 'de-DE' : 'en-GB'

  const params = useSearchParams()
  const b = params.get('b') ?? ''
  const u = params.get('u') ?? ''
  const token = useMemo<Record<string, string> | null>(() => {
    const obj: Record<string, string> = {}
    if (b) obj.b = b
    else if (u) obj.u = u
    return Object.keys(obj).length ? obj : null
  }, [b, u])

  const [daten, setDaten] = useState<StatusData | null>(null)
  const [phase, setPhase] = useState<'laden' | 'frage' | 'scan' | 'formular' | 'karte' | 'fertig' | 'fehler'>('laden')
  const [fehlerText, setFehlerText] = useState('')
  const [sendet, setSendet] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [setupIntentId, setSetupIntentId] = useState<string | null>(null)
  const [karteFehler, setKarteFehler] = useState('')

  // Scan
  const [scanLaeuft, setScanLaeuft] = useState(false)
  const [scanHinweis, setScanHinweis] = useState<'' | 'erkannt' | 'unsicher' | 'nichtErkannt'>('')
  const [fotoVorhanden, setFotoVorhanden] = useState(false)

  // Formular
  const [f, setF] = useState({ ...LEER })
  const [mitreisende, setMitreisende] = useState<Mitreisender[]>([])
  const [foto, setFoto] = useState<string | null>(null)
  const [fotoName, setFotoName] = useState('')
  const [fotoFehler, setFotoFehler] = useState(false)
  const [einwilligung, setEinwilligung] = useState(false)
  const [fehlerFelder, setFehlerFelder] = useState<string[]>([])

  const [stripePromise] = useState(() =>
    typeof window === 'undefined' ? null : loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''),
  )

  const schoenesDatum = useCallback((iso?: string | null) => {
    if (!iso) return ''
    const zeit = Date.parse(`${iso}T12:00:00`)
    return Number.isFinite(zeit) ? new Date(zeit).toLocaleDateString(datumsLocale, { day: 'numeric', month: 'long' }) : ''
  }, [datumsLocale])

  const laden = useCallback(async () => {
    setPhase('laden')
    if (!token) { setFehlerText(t.fehler.keinToken); setPhase('fehler'); return }
    try {
      const r = await fetch(`/api/meldeschein?${new URLSearchParams(token).toString()}`)
      const d: StatusData = await r.json()
      if (!d.ok) {
        setFehlerText(r.status === 404 ? (u ? t.fehler.keinAufenthalt : t.fehler.linkUngueltig) : d.error || t.fehler.standard)
        setPhase('fehler')
        return
      }
      setDaten(d)
      if (d.gast) setF((x) => ({ ...x, familienname: x.familienname || d.gast!.familienname, vorname: x.vorname || d.gast!.vorname }))
      setPhase(d.status === 'offen' ? 'frage' : 'fertig')
    } catch {
      setFehlerText(t.fehler.standard)
      setPhase('fehler')
    }
  }, [token, u, t])

  useEffect(() => { laden() }, [laden])

  const post = useCallback(async (action: string, body: Record<string, unknown> = {}) => {
    const r = await fetch('/api/meldeschein', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...token, ...body }),
    })
    const d = await r.json()
    return { status: r.status, d }
  }, [token])

  const deutsch = async () => {
    setSendet(true)
    try {
      const { d } = await post('deutsch')
      if (d.ok) { setDaten((x) => (x ? { ...x, status: 'entfaellt' } : x)); setPhase('fertig') }
      else { setFehlerText(d.error || t.fehler.standard); setPhase('fehler') }
    } catch { setFehlerText(t.fehler.standard); setPhase('fehler') }
    setSendet(false)
  }

  // ── Scan: Foto → OCR → Vorausfüllen ─────────────────────────────────────
  const scannen = async (file: File | null) => {
    if (!file || scanLaeuft) return
    setScanLaeuft(true)
    setScanHinweis('')
    try {
      const dataUrl = await fotoVerkleinern(file)
      const { d } = await post('ausweis-lesen', { ausweisFoto: dataUrl })
      if (!d.ok) { setScanHinweis('nichtErkannt'); setScanLaeuft(false); return }
      setFotoVorhanden(true)
      setFoto(dataUrl)
      setFotoName(file.name)
      if (d.gefunden && d.felder) {
        const o = d.felder as OcrFelder
        setF((x) => ({
          ...x,
          familienname: o.familienname || x.familienname,
          vorname: o.vorname || x.vorname,
          geburtsdatum: o.geburtsdatum || x.geburtsdatum,
          staatsangehoerigkeit: o.staatsangehoerigkeit && o.staatsangehoerigkeit !== 'DE' ? o.staatsangehoerigkeit : x.staatsangehoerigkeit,
          ausstellendesLand: o.ausstellendesLand || x.ausstellendesLand,
          passnummer: o.passnummer || x.passnummer,
          ausweisArt: o.ausweisArt || x.ausweisArt,
        }))
        setScanHinweis(d.sicher ? 'erkannt' : 'unsicher')
      } else {
        setScanHinweis('nichtErkannt')
      }
      setPhase('formular')
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

  const einreichen = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sendet) return
    const lokal: string[] = []
    if (!f.familienname.trim()) lokal.push('familienname')
    if (!f.vorname.trim()) lokal.push('vorname')
    if (!f.geburtsdatum) lokal.push('geburtsdatum')
    if (!f.staatsangehoerigkeit || f.staatsangehoerigkeit === 'DE') lokal.push('staatsangehoerigkeit')
    if (f.anschrift.trim().length < 8) lokal.push('anschrift')
    if (f.passnummer.trim().length < 4) lokal.push('passnummer')
    if (!foto && !fotoVorhanden) lokal.push('ausweisFoto')
    setFehlerFelder(lokal)
    if (lokal.length || !einwilligung) return
    setSendet(true)
    try {
      const body: Record<string, unknown> = { ...f, mitreisende: mitreisende.filter((m) => m.name.trim()) }
      if (foto && !fotoVorhanden) body.ausweisFoto = foto
      const { d } = await post('einreichen', body)
      if (!d.ok) {
        if (Array.isArray(d.fehler) && d.fehler.length) setFehlerFelder(d.fehler)
        else { setFehlerText(d.error || t.fehler.standard); setPhase('fehler') }
        setSendet(false)
        return
      }
      setDaten((x) => (x ? { ...x, status: 'eingereicht', bestaetigungErlaubt: !d.zuFrueh, bestaetigungAb: d.ab || x.bestaetigungAb, stripe: d.stripe ?? x.stripe } : x))
      if (d.clientSecret) {
        setClientSecret(d.clientSecret)
        setSetupIntentId(d.setupIntentId)
        setPhase('karte')
      } else {
        // Vor dem Anreisetag (oder ohne Stripe): Angaben liegen vor, Bestätigung später.
        setPhase('fertig')
      }
    } catch { setFehlerText(t.fehler.standard); setPhase('fehler') }
    setSendet(false)
  }

  const bestaetigungStarten = async () => {
    setSendet(true)
    try {
      const { d } = await post('bestaetigung-starten')
      if (d.ok && d.clientSecret) {
        setClientSecret(d.clientSecret); setSetupIntentId(d.setupIntentId); setKarteFehler(''); setPhase('karte')
      } else if (d.code === 'zu_frueh') {
        setDaten((x) => (x ? { ...x, bestaetigungErlaubt: false, bestaetigungAb: d.ab || x.bestaetigungAb } : x))
      } else {
        setKarteFehler(t.karte.fehlgeschlagen)
      }
    } catch { setKarteFehler(t.karte.fehlgeschlagen) }
    setSendet(false)
  }

  const bestaetigt = async () => {
    setKarteFehler('')
    try {
      const { d } = await post('bestaetigen', { setupIntentId })
      if (d.ok) { setDaten((x) => (x ? { ...x, status: 'erhalten' } : x)); setPhase('fertig'); return }
      setKarteFehler(d.code === 'keine_sca' ? t.karte.keineSca : t.karte.fehlgeschlagen)
    } catch { setKarteFehler(t.karte.fehlgeschlagen) }
  }

  const tokenQuery = token ? `?${new URLSearchParams(token).toString()}` : ''
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
  const fuss = <p className={`${klein} mx-auto mt-6 max-w-xl text-center`}>{t.fuss}</p>
  const spinner = <div className="mx-auto my-6 h-9 w-9 animate-spin rounded-full border-[3px] border-cream-200 border-t-gold-500" />

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

  if (phase === 'fertig') {
    const s = daten.status
    const eingereicht = s === 'eingereicht'
    const titel = s === 'entfaellt' ? t.fertig.entfaelltTitel : eingereicht ? t.fertig.eingereichtTitel : t.fertig.erhaltenTitel
    let text = s === 'entfaellt' ? t.fertig.entfaelltText : t.fertig.erhaltenText
    if (eingereicht) {
      text = !daten.stripe ? t.karte.ohneStripe
        : daten.bestaetigungErlaubt ? t.fertig.eingereichtText
          : t.karte.zuFrueh(schoenesDatum(daten.bestaetigungAb || daten.arrival))
    }
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl text-center`}>
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-2xl">✓</span>
          <h2 className="font-display text-2xl text-forest-900 mb-2">{titel}</h2>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{text}</p>
          {eingereicht && daten.stripe && daten.bestaetigungErlaubt && (
            <button className={`${cta} mt-6`} disabled={sendet} onClick={bestaetigungStarten}>{t.fertig.nochmal}</button>
          )}
          {karteFehler && <p className="font-body text-sm text-red-600 mt-3">{karteFehler}</p>}
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
            <button className={cta} disabled={sendet} onClick={deutsch}>{t.frage.ja}</button>
            <button className={sekundaer} disabled={sendet} onClick={() => setPhase('scan')}>{t.frage.nein}</button>
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
          {scanLaeuft ? (
            <>{spinner}<p className="font-body text-sm text-forest-600">{t.scan.liest}</p></>
          ) : (
            <div className="mt-6 flex flex-col gap-3">
              <label className={`${cta} cursor-pointer text-center`}>
                {t.scan.knopf}
                <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => scannen(e.target.files?.[0] ?? null)} />
              </label>
              {scanHinweis === 'nichtErkannt' && <p className="font-body text-sm text-red-600">{t.scan.nichtErkannt}</p>}
              <button className={sekundaer} onClick={() => setPhase('formular')}>{t.scan.manuell}</button>
            </div>
          )}
        </div>
        {fuss}
      </>
    )
  }

  if (phase === 'karte' && clientSecret && stripePromise) {
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl`}>
          <h2 className="font-display text-2xl text-forest-900 mb-3 text-center">{t.karte.titel}</h2>
          <p className="font-body text-sm text-forest-600 leading-relaxed mb-5 text-center">{t.karte.text}</p>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: STRIPE_APPEARANCE,
              locale: locale === 'de' ? 'de' : 'en',
              fonts: [{ family: 'DM Sans', src: `url(${window.location.origin}/fonts/dm-sans-latin.woff2)`, weight: '400 600', display: 'swap' }],
            }}
          >
            <KartenBestaetigung
              name={`${f.vorname} ${f.familienname}`.trim()}
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
  const hat = (k: string) => fehlerFelder.includes(k)
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((x) => ({ ...x, [k]: e.target.value }))
  const laender = LAENDER.map((c) => ({ c, n: landName(c, locale) })).sort((a, b2) => a.n.localeCompare(b2.n, locale))
  const optionen = (
    <>
      <option value="">{t.formular.landWaehlen}</option>
      {laender.map((l) => <option key={l.c} value={l.c}>{l.n}</option>)}
    </>
  )

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
            <input className={`${feld} ${hat('familienname') ? feldFehler : ''}`} value={f.familienname} onChange={set('familienname')} autoComplete="family-name" />
          </div>
          <div>
            <label className={lbl}>{t.formular.vorname}</label>
            <input className={`${feld} ${hat('vorname') ? feldFehler : ''}`} value={f.vorname} onChange={set('vorname')} autoComplete="given-name" />
          </div>
          <div>
            <label className={lbl}>{t.formular.geburtsdatum}</label>
            <input type="date" className={`${feld} ${hat('geburtsdatum') ? feldFehler : ''}`} value={f.geburtsdatum} onChange={set('geburtsdatum')} max={new Date().toISOString().slice(0, 10)} />
          </div>
          <div>
            <label className={lbl}>{t.formular.staatsangehoerigkeit}</label>
            <select className={`${feld} ${hat('staatsangehoerigkeit') ? feldFehler : ''}`} value={f.staatsangehoerigkeit} onChange={set('staatsangehoerigkeit')}>{optionen}</select>
          </div>
        </div>

        <div>
          <label className={lbl}>{t.formular.anschrift}</label>
          <input className={`${feld} ${hat('anschrift') ? feldFehler : ''}`} value={f.anschrift} onChange={set('anschrift')} autoComplete="street-address" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={lbl}>{t.formular.ausweisArt}</label>
            <select className={feld} value={f.ausweisArt} onChange={set('ausweisArt')}>
              <option value="Reisepass">{t.formular.reisepass}</option>
              <option value="Personalausweis">{t.formular.personalausweis}</option>
            </select>
          </div>
          <div>
            <label className={lbl}>{t.formular.passnummer}</label>
            <input className={`${feld} ${hat('passnummer') ? feldFehler : ''}`} value={f.passnummer} onChange={set('passnummer')} autoCapitalize="characters" />
          </div>
          <div>
            <label className={lbl}>{t.formular.ausstellendesLand}</label>
            <select className={`${feld} ${hat('ausstellendesLand') ? feldFehler : ''}`} value={f.ausstellendesLand} onChange={set('ausstellendesLand')}>{optionen}</select>
          </div>
        </div>

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
          <label className={lbl}>{t.formular.mitreisende}</label>
          <p className={`${klein} mb-2`}>{t.formular.mitreisendeHinweis}</p>
          <div className="space-y-3">
            {mitreisende.map((m, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 rounded-2xl bg-cream-50 p-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
                <input className={feld} placeholder={t.formular.mitName} value={m.name}
                  onChange={(e) => setMitreisende((l) => l.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                <input type="date" className={feld} title={t.formular.mitGeburtsdatum} value={m.geburtsdatum}
                  onChange={(e) => setMitreisende((l) => l.map((x, j) => (j === i ? { ...x, geburtsdatum: e.target.value } : x)))} />
                <select className={feld} value={m.staat} title={t.formular.mitStaat}
                  onChange={(e) => setMitreisende((l) => l.map((x, j) => (j === i ? { ...x, staat: e.target.value } : x)))}>{optionen}</select>
                <button type="button" className="font-body text-xs text-forest-600 underline" onClick={() => setMitreisende((l) => l.filter((_, j) => j !== i))}>{t.formular.entfernen}</button>
              </div>
            ))}
          </div>
          {mitreisende.length < 12 && (
            <button type="button" className="mt-2 font-body text-sm text-forest-800 underline underline-offset-4"
              onClick={() => setMitreisende((l) => [...l, { name: '', geburtsdatum: '', staat: '' }])}>
              {t.formular.mitHinzufuegen}
            </button>
          )}
          {hat('mitreisende') && <p className="font-body text-xs text-red-600 mt-2">{t.formular.feldFehler.mitreisende}</p>}
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-gold-500" checked={einwilligung} onChange={(e) => setEinwilligung(e.target.checked)} />
          <span className={klein}>
            {t.formular.einwilligung}{' '}
            <Link href="/datenschutz" target="_blank" className="underline">{t.formular.datenschutz}</Link>
          </span>
        </label>

        {fehlerFelder.length > 0 && (
          <p className="font-body text-sm text-red-600">
            {t.formular.pflicht}{' '}
            {fehlerFelder.map((k) => (t.formular.feldFehler as Record<string, string>)[k]).filter(Boolean).join(' · ')}
          </p>
        )}

        <button type="submit" className={cta} disabled={sendet || !einwilligung}>{sendet ? t.formular.sendet : t.formular.weiter}</button>
      </form>
      {fuss}
    </>
  )
}

function KartenBestaetigung({ name, t, fehler, onFehler, onErfolg }: {
  name: string
  t: ReturnType<typeof getDict>['meldeschein']
  fehler: string
  onFehler: (s: string) => void
  onErfolg: () => Promise<void>
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [laeuft, setLaeuft] = useState(false)
  const [karteName, setKarteName] = useState(name)

  const bestaetigen = async () => {
    if (!stripe || !elements || laeuft) return
    setLaeuft(true)
    onFehler('')
    try {
      const { error } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
        confirmParams: { payment_method_data: { billing_details: { name: karteName } } },
      })
      if (error) { onFehler(error.message || t.karte.fehlgeschlagen); setLaeuft(false); return }
      await onErfolg()
    } catch {
      onFehler(t.karte.fehlgeschlagen)
    }
    setLaeuft(false)
  }

  return (
    <div className="space-y-4">
      {/* Wallets (Apple Pay / Google Pay) zeigt das Payment Element von sich aus oben an, wenn das Gerät sie hat. */}
      <PaymentElement options={{ fields: { billingDetails: { name: 'never' } }, wallets: { applePay: 'auto', googlePay: 'auto' } }} />
      <div>
        <label className={lbl}>{t.karte.name}</label>
        <input className={feld} value={karteName} onChange={(e) => setKarteName(e.target.value)} autoComplete="cc-name" />
      </div>
      {fehler && <p className="font-body text-sm text-red-600">{fehler}</p>}
      <button className={cta} disabled={!stripe || laeuft} onClick={bestaetigen}>{laeuft ? t.karte.wartet : t.karte.knopf}</button>
    </div>
  )
}
