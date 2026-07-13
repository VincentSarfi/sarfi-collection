'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Prefill = {
  ok: boolean
  error?: string
  bereitsVersendet?: boolean
  propertyName?: string
  guestName?: string
  arrival?: string
  departure?: string
  betrag?: number
}

function deDate(iso?: string) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export default function RechnungForm() {
  const params = useSearchParams()
  const res = params.get('res') ?? ''
  const t = params.get('t') ?? ''

  const [prefill, setPrefill] = useState<Prefill | null>(null)
  const [form, setForm] = useState({ firma: '', ustId: '', strasse: '', plz: '', ort: '', email: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!res || !t) {
      // Ohne signierten Link (res+t aus der Rechnungs-Mail) gibt es hier nichts zu
      // laden — freundlich erklären statt nur „Ungültig" (z. B. bei abgelaufenem Link).
      setPrefill({
        ok: false,
        error:
          'Diese Seite ist nur über Ihren persönlichen Rechnungs-Link erreichbar, den Sie per E-Mail von uns erhalten. Falls Ihr Link nicht mehr funktioniert, schreiben Sie uns kurz an hallo@sarfi-collection.de — wir senden Ihnen gerne einen neuen.',
      })
      return
    }
    fetch(`/api/rechnung?res=${encodeURIComponent(res)}&t=${encodeURIComponent(t)}`)
      .then(r => r.json())
      .then((d: Prefill) => setPrefill(d))
      .catch(() => setPrefill({ ok: false, error: 'Buchung konnte nicht geladen werden.' }))
  }, [res, t])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending'); setMessage('')
    try {
      const r = await fetch('/api/rechnung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ res, t, ...form }),
      })
      const d = await r.json()
      if (d.ok) {
        setStatus('done')
        setMessage(d.invoiceNumber ? `Rechnung ${d.invoiceNumber} wurde an ${form.email} gesendet.` : 'Ihre Rechnung wurde versendet.')
      } else {
        setStatus('error'); setMessage(d.error || 'Es ist ein Fehler aufgetreten.')
      }
    } catch {
      setStatus('error'); setMessage('Service nicht erreichbar. Bitte später erneut versuchen.')
    }
  }

  const card = 'max-w-xl mx-auto bg-white rounded-lg shadow-sm border border-[#e8e2d6] p-8'
  const label = 'block text-sm font-medium text-[#1a2e1a] mb-1'
  const input = 'w-full rounded-md border border-[#d8d0c0] px-3 py-2 text-[#1a2e1a] focus:outline-none focus:ring-2 focus:ring-[#c9a84c]'

  if (!prefill) {
    return <div className={card}><p className="text-[#4a5568]">Buchung wird geladen …</p></div>
  }
  if (!prefill.ok) {
    return <div className={card}><h1 className="text-xl font-bold text-[#1a2e1a] mb-2">Rechnung anfordern</h1><p className="text-[#b91c1c]">{prefill.error}</p></div>
  }
  if (prefill.bereitsVersendet || status === 'done') {
    return (
      <div className={card}>
        <h1 className="text-xl font-bold text-[#1a2e1a] mb-3">Vielen Dank!</h1>
        <p className="text-[#4a5568]">{status === 'done' ? message : 'Für diese Buchung wurde bereits eine Rechnung erstellt und versendet.'}</p>
      </div>
    )
  }

  return (
    <div className={card}>
      <h1 className="text-2xl font-bold text-[#1a2e1a] mb-1">Rechnung anfordern</h1>
      <p className="text-sm text-[#4a5568] mb-6">Bitte ergänzen Sie Ihre Rechnungsdaten – wir senden Ihnen die Rechnung als PDF per E-Mail.</p>

      <div className="bg-[#f7f4ef] rounded-md p-4 mb-6 text-sm text-[#4a5568]">
        <p><strong className="text-[#1a2e1a]">{prefill.propertyName}</strong></p>
        <p>{deDate(prefill.arrival)} – {deDate(prefill.departure)} · {prefill.betrag?.toLocaleString('de-DE')} €</p>
        <p>Gast: {prefill.guestName}</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className={label}>Firma <span className="text-[#aaa] font-normal">(optional)</span></label>
          <input className={input} value={form.firma} onChange={e => setForm({ ...form, firma: e.target.value })} autoComplete="organization" />
        </div>
        <div>
          <label className={label}>USt-IdNr. <span className="text-[#aaa] font-normal">(optional)</span></label>
          <input className={input} value={form.ustId} onChange={e => setForm({ ...form, ustId: e.target.value })} placeholder="z. B. DE123456789" />
        </div>
        <div>
          <label className={label}>Straße &amp; Hausnummer</label>
          <input className={input} value={form.strasse} onChange={e => setForm({ ...form, strasse: e.target.value })} autoComplete="street-address" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={label}>PLZ</label>
            <input className={input} value={form.plz} onChange={e => setForm({ ...form, plz: e.target.value })} autoComplete="postal-code" />
          </div>
          <div className="col-span-2">
            <label className={label}>Ort</label>
            <input className={input} value={form.ort} onChange={e => setForm({ ...form, ort: e.target.value })} autoComplete="address-level2" />
          </div>
        </div>
        <div>
          <label className={label}>E-Mail für die Rechnung</label>
          <input type="email" className={input} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" required />
        </div>

        {status === 'error' && <p className="text-sm text-[#b91c1c]">{message}</p>}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-[#1a2e1a] text-[#f5f0e8] font-semibold py-3 rounded-md hover:bg-[#24412a] disabled:opacity-60 transition-colors"
        >
          {status === 'sending' ? 'Wird gesendet …' : 'Rechnung anfordern'}
        </button>
      </form>
    </div>
  )
}
