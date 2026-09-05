'use client'

// Gast-Widget hinter dem QR-Code in der Einheit: Late Checkout buchen und/oder
// den Aufenthalt um Nächte verlängern. Die Logik (Verfügbarkeit, Preise,
// Stripe, Verbuchung) lebt komplett im Dashboard — diese Seite redet nur mit
// dem Proxy unter /api/late-checkout und zeigt an, was der Server erlaubt.

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'

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

function schoenesDatum(iso?: string | null, plusTage = 0) {
  if (!iso) return ''
  const t = Date.parse(`${iso}T12:00:00`)
  if (!Number.isFinite(t)) return ''
  return new Date(t + plusTage * 86400000).toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
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
  const params = useSearchParams()
  const u = params.get('u') ?? ''
  const kamVonZahlung = params.get('bezahlt') === '1'

  const [daten, setDaten] = useState<StatusData | null>(null)
  const [phase, setPhase] = useState<'laden' | 'bestaetigen' | 'haengt' | 'fertig' | 'fehler'>('laden')
  const [fehlerText, setFehlerText] = useState('')
  const [naechte, setNaechte] = useState(1)
  const [sendet, setSendet] = useState<'lc' | 'vl' | null>(null)
  const versuchRef = useRef(0)

  const laden = useCallback(async () => {
    setPhase('laden')
    try {
      const r = await fetch(`/api/late-checkout?u=${encodeURIComponent(u)}`)
      const d: StatusData = await r.json()
      if (!d.ok) {
        setFehlerText(
          r.status === 404
            ? 'Dieser QR-Code ist nicht (mehr) gültig. Bitte scanne den Code in deiner Unterkunft erneut.'
            : d.error || 'Die Verfügbarkeit kann gerade nicht geprüft werden. Bitte versuche es gleich noch einmal.',
        )
        setPhase('fehler')
        return
      }
      setDaten(d)
      setNaechte((n) => Math.min(Math.max(1, n), d.verlaengerung?.freieNaechte || 1))
      setPhase('fertig')
    } catch {
      setFehlerText('Die Verfügbarkeit kann gerade nicht geprüft werden. Bitte versuche es gleich noch einmal.')
      setPhase('fehler')
    }
  }, [u])

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
      setFehlerText('Diese Seite gehört zum QR-Code in deiner Unterkunft — bitte scanne ihn dort.')
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
      setFehlerText('Das hat gerade nicht geklappt. Bitte versuche es in einem Moment noch einmal.')
      setPhase('fehler')
    }
  }

  // ── Zwischenzustände ────────────────────────────────────────────────────

  if (phase === 'laden' || phase === 'bestaetigen') {
    return (
      <div className={karte}>
        <div className="mx-auto my-6 h-9 w-9 animate-spin rounded-full border-[3px] border-cream-200 border-t-gold-500" />
        <p className="font-body text-sm text-forest-600">
          {phase === 'bestaetigen' ? 'Zahlung wird bestätigt …' : 'Einen Moment — wir prüfen die Verfügbarkeit …'}
        </p>
      </div>
    )
  }

  if (phase === 'haengt') {
    return (
      <div className={karte}>
        <h2 className="font-display text-2xl text-forest-900 mb-3">Zahlung wird noch geprüft</h2>
        <p className="font-body text-sm text-forest-600 leading-relaxed">
          Deine Zahlung ist unterwegs. Das System prüft im Hintergrund weiter — in wenigen Minuten
          ist deine Buchung eingetragen. Du kannst diese Seite über den QR-Code jederzeit neu öffnen.
        </p>
        <button className={`${cta} mt-6`} onClick={() => window.location.reload()}>Jetzt erneut prüfen</button>
      </div>
    )
  }

  if (phase === 'fehler' || !daten) {
    return (
      <div className={karte}>
        <h2 className="font-display text-2xl text-forest-900 mb-3">Das hat gerade nicht geklappt</h2>
        <p className="font-body text-sm text-forest-600 leading-relaxed">{fehlerText}</p>
        <button className={`${cta} mt-6`} onClick={() => window.location.reload()}>Erneut versuchen</button>
      </div>
    )
  }

  // ── Karte 1: Late Checkout ──────────────────────────────────────────────

  const lc = (() => {
    if (daten.status === 'bereits_gebucht') {
      return (
        <div className={karte}>
          <Einheit name={daten.einheit} />
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest-100 text-2xl">✓</span>
          <h2 className="font-display text-2xl text-forest-900 mb-2">Late Checkout bestätigt</h2>
          <div className={preisbox}>
            <p className={label}>Dein Checkout</p>
            <p className="font-display text-4xl font-light mt-2">bis {daten.gebuchtBis} Uhr</p>
          </div>
          <p className="font-body text-sm text-forest-600 leading-relaxed">
            Alles erledigt — unser Team ist informiert. Lass dir Zeit und genieße den Morgen.
          </p>
          <p className={klein}>Diese Seite gilt als deine Bestätigung — über den QR-Code jederzeit erneut aufrufbar.</p>
        </div>
      )
    }
    if (daten.status === 'verfuegbar' && daten.angebot) {
      return (
        <div className={karte}>
          <Einheit name={daten.einheit} />
          <h2 className="font-display text-2xl sm:text-3xl text-forest-900 text-balance">
            Gute Nachricht — dein Zimmer wird am Abreisetag nicht direkt wieder gebraucht.
          </h2>
          <p className="font-body text-sm text-forest-600 mt-3">
            Verlängere deinen Abreisetag{daten.abreise ? ` am ${schoenesDatum(daten.abreise)}` : ''} ganz entspannt:
          </p>
          <div className={preisbox}>
            <p className={label}>Late Checkout</p>
            <p className="font-display text-4xl font-light mt-2">bis {daten.angebot.uhrzeit} Uhr</p>
            <p className="font-body text-sm text-cream-100/85 mt-1">
              einmalig {eur(daten.angebot.preisBrutto)} · inkl. MwSt.
            </p>
          </div>
          <button className={cta} disabled={sendet !== null} onClick={() => bestellen('late_checkout')}>
            {sendet === 'lc' ? 'Einen Moment …' : 'Late Checkout buchen'}
          </button>
          <p className={klein}>
            Sichere Zahlung per Karte, Apple Pay oder Google Pay über Stripe. Direkt nach der
            Zahlung ist dein Late Checkout fest eingetragen.
          </p>
          {daten.zahlungUrl && (
            <p className={klein}>
              Zahlung bereits begonnen? <a className="underline text-forest-900" href={daten.zahlungUrl}>Zahlung fortsetzen</a>
            </p>
          )}
        </div>
      )
    }
    const text =
      daten.status === 'folgebelegung'
        ? 'An deinem Abreisetag reist bereits der nächste Gast an — das Housekeeping braucht das Zimmer pünktlich. Wir bitten um Verständnis.'
        : daten.status === 'zu_frueh'
          ? `Ein Late Checkout lässt sich ab dem Vortag deiner Abreise buchen${daten.abreise ? ` (deine Abreise: ${schoenesDatum(daten.abreise)})` : ''}. Schau einfach dann noch einmal vorbei.`
          : daten.status === 'zu_spaet'
            ? 'Für heute ist die Buchungszeit leider vorbei.'
            : 'Für diese Einheit ist aktuell kein Late Checkout verfügbar.'
    return (
      <div className={karte}>
        <Einheit name={daten.einheit} />
        <h2 className="font-display text-2xl text-forest-900 mb-3">Late Checkout — heute nicht möglich</h2>
        <p className="font-body text-sm text-forest-600 leading-relaxed">{text}</p>
        <p className={klein}>Fragen? Schreib uns gern — die Kontaktdaten findest du in deiner Buchungsbestätigung.</p>
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
          <h2 className="font-display text-2xl text-forest-900 mb-2">Aufenthalt verlängert</h2>
          <div className={preisbox}>
            <p className={label}>Neue Abreise</p>
            <p className="font-display text-3xl font-light mt-2">{schoenesDatum(v.bis)}</p>
            <p className="font-body text-sm text-cream-100/85 mt-1">
              {v.naechte} zusätzliche {v.naechte === 1 ? 'Nacht' : 'Nächte'}
            </p>
          </div>
          <p className="font-body text-sm text-forest-600 leading-relaxed">
            Deine Verlängerung ist fest eingetragen — bleib einfach, alles Weitere übernehmen wir.
          </p>
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
        <h2 className="font-display text-2xl sm:text-3xl text-forest-900 text-balance">
          Oder gleich ein paar Nächte länger bleiben?
        </h2>
        <p className="font-body text-sm text-forest-600 mt-3">
          Deine Unterkunft ist nach der Abreise noch frei{frei > 1 ? ` — bis zu ${frei} Nächte` : ''}.
        </p>
        <div className={preisbox}>
          <p className={label}>Verlängerung</p>
          <div className="mt-3 flex items-center justify-center gap-5">
            <button
              aria-label="Eine Nacht weniger"
              className="h-11 w-11 rounded-full border border-gold-400 text-xl text-gold-400 disabled:opacity-35"
              disabled={n <= 1}
              onClick={() => setNaechte(n - 1)}
            >−</button>
            <span className="font-display min-w-[7rem] text-3xl font-light">
              {n} {n === 1 ? 'Nacht' : 'Nächte'}
            </span>
            <button
              aria-label="Eine Nacht mehr"
              className="h-11 w-11 rounded-full border border-gold-400 text-xl text-gold-400 disabled:opacity-35"
              disabled={n >= frei}
              onClick={() => setNaechte(n + 1)}
            >+</button>
          </div>
          <p className="font-body text-sm text-cream-100/85 mt-3">
            gesamt <strong className="text-cream-50">{eur(gesamt)}</strong>
            {n > 1 ? ` (Ø ${eur(gesamt / n)}/Nacht)` : ''}
            {v.abreise ? <><br />neue Abreise {schoenesDatum(v.abreise, n)}</> : null}
          </p>
        </div>
        <button className={cta} disabled={sendet !== null} onClick={() => bestellen('verlaengerung')}>
          {sendet === 'vl' ? 'Einen Moment …' : 'Verlängern & bezahlen'}
        </button>
        <p className={klein}>
          Tagesaktuelle Nachtpreise, inkl. MwSt. · Sichere Zahlung über Stripe. Direkt nach der
          Zahlung ist deine Verlängerung fest im Kalender eingetragen.
        </p>
        {v.zahlungUrl && (
          <p className={klein}>
            Zahlung{v.offeneNaechte ? ` für ${v.offeneNaechte} ${v.offeneNaechte === 1 ? 'Nacht' : 'Nächte'}` : ''} bereits
            begonnen? <a className="underline text-forest-900" href={v.zahlungUrl}>Zahlung fortsetzen</a>
          </p>
        )}
      </div>
    )
  })()

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      {lc}
      {vl}
    </div>
  )
}
