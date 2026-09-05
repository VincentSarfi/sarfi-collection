'use client'

// Gast-Widget hinter dem QR-Code in der Einheit: Late Checkout buchen und/oder
// den Aufenthalt um Nächte verlängern. Die Logik (Verfügbarkeit, Preise,
// Stripe, Verbuchung) lebt komplett im Dashboard — diese Seite redet nur mit
// dem Proxy unter /api/late-checkout und zeigt an, was der Server erlaubt.
//
// Zweisprachig über die Site-Locale (LocaleProvider); der QR-Code landet auf
// der deutschen Seite, der Umschalter hier nimmt — anders als der im Header —
// den QR-Token `u` mit in die andere Sprache.

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getDict } from '@/lib/i18n'
import { useLocale } from '@/lib/i18n/LocaleProvider'

type Verlaengerung = {
  status: string
  freieNaechte?: number
  maxNaechte?: number
  preise?: number[]
  abreise?: string
  zahlungUrl?: string | null
  offeneNaechte?: number | null
  naechte?: number
  bis?: string
}

type StatusData = {
  ok: boolean
  status: string
  einheit?: string | null
  abreise?: string | null
  angebot?: { uhrzeit: string; preisBrutto: number }
  gebuchtBis?: string
  zahlungUrl?: string | null
  verlaengerung?: Verlaengerung
  error?: string
}

function eur(n: number) {
  return Math.round(n).toLocaleString('de-DE') + ' €'
}

const karte = 'rounded-3xl bg-white border border-cream-200 shadow-card p-6 sm:p-8 text-center'
const cta =
  'inline-block w-full rounded-full bg-gold-500 hover:bg-gold-600 transition-colors ' +
  'px-6 py-4 font-body text-sm font-semibold uppercase tracking-wider text-forest-900 disabled:opacity-60'
const preisbox = 'rounded-2xl bg-forest-900 text-cream-50 px-5 py-6 my-6'
const label = 'font-body text-[11px] uppercase tracking-[0.22em] text-gold-400 font-semibold'
const klein = 'font-body text-xs text-forest-600 leading-relaxed mt-4'

function Einheit({ name }: { name?: string | null }) {
  if (!name) return null
  return (
    <p className="font-body text-xs uppercase tracking-[0.18em] text-forest-600 mb-4">{name}</p>
  )
}

export default function LateCheckoutWidget() {
  const locale = useLocale()
  const t = getDict(locale).lateCheckout
  const datumsLocale = locale === 'de' ? 'de-DE' : 'en-GB'

  const params = useSearchParams()
  const u = params.get('u') ?? ''
  const kamVonZahlung = params.get('bezahlt') === '1'

  const [daten, setDaten] = useState<StatusData | null>(null)
  const [phase, setPhase] = useState<'laden' | 'bestaetigen' | 'haengt' | 'fertig' | 'fehler'>('laden')
  const [fehlerText, setFehlerText] = useState('')
  const [naechte, setNaechte] = useState(1)
  const [sendet, setSendet] = useState<'lc' | 'vl' | null>(null)
  const versuchRef = useRef(0)

  const schoenesDatum = useCallback(
    (iso?: string | null, plusTage = 0) => {
      if (!iso) return ''
      const zeit = Date.parse(`${iso}T12:00:00`)
      if (!Number.isFinite(zeit)) return ''
      return new Date(zeit + plusTage * 86400000).toLocaleDateString(datumsLocale, {
        weekday: 'long', day: 'numeric', month: 'long',
      })
    },
    [datumsLocale],
  )

  const laden = useCallback(async () => {
    setPhase('laden')
    try {
      const r = await fetch(`/api/late-checkout?u=${encodeURIComponent(u)}`)
      const d: StatusData = await r.json()
      if (!d.ok) {
        setFehlerText(r.status === 404 ? t.fehler.qrUngueltig : d.error || t.fehler.standard)
        setPhase('fehler')
        return
      }
      setDaten(d)
      setNaechte((n) => Math.min(Math.max(1, n), d.verlaengerung?.freieNaechte || 1))
      setPhase('fertig')
    } catch {
      setFehlerText(t.fehler.standard)
      setPhase('fehler')
    }
  }, [u, t])

  // Rückkehr von Stripe: Zahlung serverseitig bestätigen. Stripe meldet die
  // Session manchmal erst Sekunden später — deshalb bis zu 6 Versuche.
  const bestaetigen = useCallback(async () => {
    setPhase('bestaetigen')
    versuchRef.current += 1
    try {
      const r = await fetch('/api/late-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm', u }),
      })
      const d = await r.json()
      if (d.ok && d.bezahlt) {
        await laden()
        return
      }
    } catch {
      /* weiter unten erneut versuchen */
    }
    if (versuchRef.current < 6) {
      setTimeout(bestaetigen, 2500)
    } else {
      setPhase('haengt')
    }
  }, [u, laden])

  useEffect(() => {
    if (!u) {
      setFehlerText(t.fehler.keinToken)
      setPhase('fehler')
      return
    }
    if (kamVonZahlung) void bestaetigen()
    else void laden()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function bestellen(art: 'late_checkout' | 'verlaengerung') {
    setSendet(art === 'verlaengerung' ? 'vl' : 'lc')
    try {
      const r = await fetch('/api/late-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'order', u, art, ...(art === 'verlaengerung' ? { naechte } : {}) }),
      })
      const d = await r.json()
      if (d.ok && d.url) {
        window.location.href = d.url
        return
      }
      // Verfügbarkeit hat sich geändert → Status neu laden, die Seite erklärt es.
      setSendet(null)
      await laden()
    } catch {
      setSendet(null)
      setFehlerText(t.fehler.bestellung)
      setPhase('fehler')
    }
  }

  // Kopf mit Sprachumschalter — der QR-Token reist mit in die andere Sprache.
  const kopf = (
    <div className="mx-auto mb-8 max-w-xl text-center">
      <p className="font-body text-xs font-semibold uppercase tracking-[0.28em] text-gold-600">
        {t.eyebrow}
      </p>
      <h1 className="font-display text-display-md text-forest-900 mt-2 text-balance">{t.titel}</h1>
      <Link
        href={`${locale === 'de' ? '/en/late-checkout' : '/late-checkout'}${u ? `?u=${encodeURIComponent(u)}` : ''}`}
        className="mt-3 inline-block font-body text-xs text-forest-600 underline underline-offset-4 hover:text-forest-900"
      >
        {t.sprachwechsel}
      </Link>
    </div>
  )

  // ── Zwischenzustände ────────────────────────────────────────────────────

  if (phase === 'laden' || phase === 'bestaetigen') {
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl`}>
          <div className="mx-auto my-6 h-9 w-9 animate-spin rounded-full border-[3px] border-cream-200 border-t-gold-500" />
          <p className="font-body text-sm text-forest-600">
            {phase === 'bestaetigen' ? t.zahlungBestaetigen : t.laden}
          </p>
        </div>
      </>
    )
  }

  if (phase === 'haengt') {
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl`}>
          <h2 className="font-display text-2xl text-forest-900 mb-3">{t.haengt.titel}</h2>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{t.haengt.text}</p>
          <button className={`${cta} mt-6`} onClick={() => window.location.reload()}>{t.haengt.knopf}</button>
        </div>
      </>
    )
  }

  if (phase === 'fehler' || !daten) {
    return (
      <>
        {kopf}
        <div className={`${karte} mx-auto max-w-xl`}>
          <h2 className="font-display text-2xl text-forest-900 mb-3">{t.fehler.titel}</h2>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{fehlerText}</p>
          <button className={`${cta} mt-6`} onClick={() => window.location.reload()}>{t.fehler.erneut}</button>
        </div>
      </>
    )
  }

  // ── Karte 1: Late Checkout ──────────────────────────────────────────────

  // HAUS28 ist ein Haus, alles andere eine Ferienwohnung — „Zimmer" gibt es
  // bei uns nicht. Großform für den Satzanfang.
  const istHaus = (daten.einheit || '').toUpperCase().includes('HAUS28')
  const unterkunft = istHaus ? t.unterkunft.haus : t.unterkunft.wohnung
  const unterkunftGross = unterkunft.charAt(0).toUpperCase() + unterkunft.slice(1)

  const lc = (() => {
    if (daten.status === 'bereits_gebucht') {
      return (
        <div className={karte}>
          <Einheit name={daten.einheit} />
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-2xl">✓</span>
          <h2 className="font-display text-2xl text-forest-900 mb-2">{t.lc.gebuchtTitel}</h2>
          <div className={preisbox}>
            <p className={label}>{t.lc.gebuchtLabel}</p>
            <p className="font-display text-4xl font-light mt-2">{t.lc.bisUhr(daten.gebuchtBis ?? '')}</p>
          </div>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{t.lc.gebuchtText}</p>
          <p className={klein}>{t.lc.gebuchtHinweis}</p>
        </div>
      )
    }
    if (daten.status === 'verfuegbar' && daten.angebot) {
      return (
        <div className={karte}>
          <Einheit name={daten.einheit} />
          <h2 className="font-display text-2xl sm:text-3xl text-forest-900 text-balance">{t.lc.angebotTitel(unterkunft)}</h2>
          <p className="font-body text-sm text-forest-600 mt-3">
            {t.lc.angebotText(schoenesDatum(daten.abreise))}
          </p>
          <div className={preisbox}>
            <p className={label}>{t.lc.label}</p>
            <p className="font-display text-4xl font-light mt-2">{t.lc.bisUhr(daten.angebot.uhrzeit)}</p>
            <p className="font-body text-sm text-cream-100/85 mt-1">{t.lc.einmalig(eur(daten.angebot.preisBrutto))}</p>
          </div>
          <button className={cta} disabled={sendet !== null} onClick={() => bestellen('late_checkout')}>
            {sendet === 'lc' ? t.lc.knopfWartet : t.lc.knopf}
          </button>
          <p className={klein}>{t.lc.zahlungsHinweis}</p>
          {daten.zahlungUrl && (
            <p className={klein}>
              {t.zahlungBegonnen(null)}{' '}
              <a className="underline text-forest-900" href={daten.zahlungUrl}>{t.zahlungFortsetzen}</a>
            </p>
          )}
        </div>
      )
    }
    const text =
      daten.status === 'folgebelegung'
        ? t.lc.folgebelegung
        : daten.status === 'zu_frueh'
          ? t.lc.zuFrueh(schoenesDatum(daten.abreise))
          : daten.status === 'zu_spaet'
            ? t.lc.zuSpaet
            : t.lc.nichtStandard
    return (
      <div className={karte}>
        <Einheit name={daten.einheit} />
        <h2 className="font-display text-2xl text-forest-900 mb-3">{t.lc.nichtTitel}</h2>
        <p className="font-body text-sm text-forest-600 leading-relaxed">{text}</p>
        <p className={klein}>{t.lc.kontaktHinweis}</p>
      </div>
    )
  })()

  // ── Karte 2: Aufenthalt verlängern ──────────────────────────────────────

  const v = daten.verlaengerung
  const vl = (() => {
    if (!v || (v.status !== 'verfuegbar' && v.status !== 'gebucht')) return null

    if (v.status === 'gebucht') {
      return (
        <div className={karte}>
          <Einheit name={daten.einheit} />
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-2xl">✓</span>
          <h2 className="font-display text-2xl text-forest-900 mb-2">{t.vl.gebuchtTitel}</h2>
          <div className={preisbox}>
            <p className={label}>{t.vl.gebuchtLabel}</p>
            <p className="font-display text-3xl font-light mt-2">{schoenesDatum(v.bis)}</p>
            <p className="font-body text-sm text-cream-100/85 mt-1">{t.vl.zusatzNaechte(v.naechte ?? 0)}</p>
          </div>
          <p className="font-body text-sm text-forest-600 leading-relaxed">{t.vl.gebuchtText}</p>
        </div>
      )
    }

    const preise = v.preise ?? []
    const frei = v.freieNaechte ?? preise.length
    const n = Math.min(Math.max(1, naechte), frei)
    const gesamt = preise.slice(0, n).reduce((s, p) => s + p, 0)
    return (
      <div className={karte}>
        <Einheit name={daten.einheit} />
        <h2 className="font-display text-2xl sm:text-3xl text-forest-900 text-balance">{t.vl.angebotTitel}</h2>
        <p className="font-body text-sm text-forest-600 mt-3">{t.vl.angebotText(unterkunftGross, frei)}</p>
        <div className={preisbox}>
          <p className={label}>{t.vl.label}</p>
          <div className="mt-3 flex items-center justify-center gap-5">
            <button
              aria-label={t.vl.minusAria}
              className="h-11 w-11 rounded-full border border-gold-400 text-xl text-gold-400 disabled:opacity-35"
              disabled={n <= 1}
              onClick={() => setNaechte(n - 1)}
            >−</button>
            <span className="font-display min-w-[7rem] text-3xl font-light">{t.vl.naechte(n)}</span>
            <button
              aria-label={t.vl.plusAria}
              className="h-11 w-11 rounded-full border border-gold-400 text-xl text-gold-400 disabled:opacity-35"
              disabled={n >= frei}
              onClick={() => setNaechte(n + 1)}
            >+</button>
          </div>
          <p className="font-body text-sm text-cream-100/85 mt-3">
            {t.vl.gesamt} <strong className="text-cream-50">{eur(gesamt)}</strong>
            {n > 1 ? ` ${t.vl.proNacht(eur(gesamt / n))}` : ''}
            {v.abreise ? <><br />{t.vl.neueAbreise(schoenesDatum(v.abreise, n))}</> : null}
          </p>
        </div>
        <button className={cta} disabled={sendet !== null} onClick={() => bestellen('verlaengerung')}>
          {sendet === 'vl' ? t.lc.knopfWartet : t.vl.knopf}
        </button>
        <p className={klein}>{t.vl.zahlungsHinweis}</p>
        {v.zahlungUrl && (
          <p className={klein}>
            {t.zahlungBegonnen(v.offeneNaechte ?? null)}{' '}
            <a className="underline text-forest-900" href={v.zahlungUrl}>{t.zahlungFortsetzen}</a>
          </p>
        )}
      </div>
    )
  })()

  return (
    <>
      {kopf}
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        {lc}
        {vl}
      </div>
    </>
  )
}
