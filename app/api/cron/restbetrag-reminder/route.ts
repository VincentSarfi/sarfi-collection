import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { sendRemainingPaymentReminderEmail } from '@/lib/notify'

/**
 * Restbetrag-Zahlungserinnerung.
 *
 * Läuft täglich als Vercel-Cron (siehe vercel.json) und schickt jedem Gast
 * mit noch offenem Restbetrag EINMALIG eine Erinnerung, sobald die Anreise
 * näher rückt (Standard: spätestens ~REMINDER_WINDOW_DAYS Tage vorher, also
 * mindestens 14 Tage vor Anreise).
 *
 * Datenquelle: die beim Buchungs-Webhook erzeugten Stripe Payment Links
 * (metadata.type === 'restbetrag'). Gast-/Aufenthaltsdaten stammen aus den
 * Metadaten des ursprünglichen Payment Intents (original_payment_intent).
 *
 * Idempotenz: nach Versand wird reminder_sent_at in den Link-Metadaten
 * gesetzt – so wird niemand doppelt angeschrieben.
 *
 * Bezahlt-Erkennung: existiert auf dem Link eine bezahlte Checkout-Session,
 * wird nichts geschickt (und der Link als bezahlt markiert).
 *
 * Auth: Authorization: Bearer <CRON_SECRET>. Vercel-Cron sendet diesen Header
 * automatisch, wenn CRON_SECRET als Env-Variable gesetzt ist.
 *
 * Manuelle / Test-Aufrufe (zusätzlich zum Bearer-Header):
 *   ?only=<pi_id>         → nur die Buchung dieses Payment Intents, ignoriert das Zeitfenster
 *   ?to=<email>           → Empfänger überschreiben (Test); markiert NICHT als gesendet
 *   ?dry=1                → nichts senden, nur auflisten was passieren würde
 */

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Sende die (einmalige) Erinnerung, sobald die Anreise <= so viele Tage entfernt
// ist. 20 Tage stellt sicher, dass jeder Gast die Mail mindestens 14 Tage vor
// Anreise erhält – und fängt auch kurzfristige Buchungen ein.
const REMINDER_WINDOW_DAYS = 20

const DAY_MS = 1000 * 60 * 60 * 24

function daysUntil(dateStr: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${dateStr}T00:00:00`)
  return Math.round((target.getTime() - today.getTime()) / DAY_MS)
}

/** Ist der Restbetrag-Link bereits bezahlt? (mind. eine bezahlte Checkout-Session) */
async function isLinkPaid(linkId: string): Promise<boolean> {
  const sessions = await stripe.checkout.sessions.list({ payment_link: linkId, limit: 100 })
  return sessions.data.some(s => s.payment_status === 'paid' || s.status === 'complete')
}

export async function GET(request: NextRequest) {
  // --- Auth ---
  const expected = process.env.CRON_SECRET
  if (!expected) {
    console.error('[cron/restbetrag] CRON_SECRET nicht gesetzt – Abbruch')
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }
  const auth = request.headers.get('authorization') ?? ''
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const only    = searchParams.get('only')          // pi_... → nur diese Buchung
  const toOverride = searchParams.get('to')          // Empfänger überschreiben (Test)
  const dryRun  = searchParams.get('dry') === '1'
  const isManual = Boolean(only || toOverride)

  const summary = {
    scanned: 0,
    sent: [] as Array<{ pi: string; to: string; property: string; checkIn: string; amount: number }>,
    skipped: [] as Array<{ pi?: string; link: string; reason: string }>,
    dryRun,
  }

  try {
    // Alle Restbetrag-Links durchgehen (auto-paginierend)
    for await (const link of stripe.paymentLinks.list({ limit: 100 })) {
      const md = link.metadata ?? {}
      if (md.type !== 'restbetrag') continue

      const piId = md.original_payment_intent
      if (only && piId !== only) continue

      summary.scanned++

      // Schon erinnert? (im Test-/only-Modus mit to-Override erneut erlauben)
      if (md.reminder_sent_at && !toOverride) {
        summary.skipped.push({ pi: piId, link: link.id, reason: `bereits erinnert am ${md.reminder_sent_at}` })
        continue
      }

      // Bezahlt?
      let paid = false
      try { paid = await isLinkPaid(link.id) } catch { /* im Zweifel weiter */ }
      if (paid) {
        summary.skipped.push({ pi: piId, link: link.id, reason: 'bereits bezahlt' })
        if (!dryRun && !md.reminder_sent_at) {
          try { await stripe.paymentLinks.update(link.id, { metadata: { ...md, paid_at: new Date().toISOString() } }) } catch { /* egal */ }
        }
        continue
      }

      // Gast-/Aufenthaltsdaten aus dem ursprünglichen Payment Intent
      if (!piId) {
        summary.skipped.push({ link: link.id, reason: 'kein original_payment_intent in Metadaten' })
        continue
      }
      let pi
      try { pi = await stripe.paymentIntents.retrieve(piId) } catch {
        summary.skipped.push({ pi: piId, link: link.id, reason: 'Payment Intent nicht abrufbar' })
        continue
      }
      const pm = pi.metadata ?? {}
      const checkIn  = pm.checkIn
      const checkOut = pm.checkOut
      const email    = pm.email
      if (!checkIn || !email) {
        summary.skipped.push({ pi: piId, link: link.id, reason: 'unvollständige Buchungsdaten (checkIn/email)' })
        continue
      }

      const dleft = daysUntil(checkIn)
      // Anreise vorbei → nichts mehr schicken
      if (dleft < 0) {
        summary.skipped.push({ pi: piId, link: link.id, reason: `Anreise vorbei (${checkIn})` })
        continue
      }
      // Zeitfenster (im manuellen only-Modus überspringen wir den Fenster-Check)
      if (!isManual && dleft > REMINDER_WINDOW_DAYS) {
        summary.skipped.push({ pi: piId, link: link.id, reason: `noch ${dleft} Tage – außerhalb Fenster (${REMINDER_WINDOW_DAYS})` })
        continue
      }

      const totalPrice   = parseFloat(pm.totalPrice ?? '0')
      const depositAmount = parseFloat(pm.depositAmount ?? '0')
      const remaining    = Math.round(totalPrice - depositAmount)
      const recipient    = toOverride || email

      if (dryRun) {
        summary.sent.push({ pi: piId, to: recipient, property: pm.propertyName ?? '?', checkIn, amount: remaining })
        continue
      }

      const ok = await sendRemainingPaymentReminderEmail({
        propertyName:        pm.propertyName ?? 'deine Unterkunft',
        checkIn,
        checkOut:            checkOut ?? checkIn,
        firstName:           pm.firstName ?? '',
        lastName:            pm.lastName ?? '',
        email:               recipient,
        remainingAmount:     remaining,
        remainingPaymentUrl: link.url,
        subjectPrefix:       toOverride ? '[TEST] ' : '',
      })

      if (!ok) {
        summary.skipped.push({ pi: piId, link: link.id, reason: 'Versand fehlgeschlagen' })
        continue
      }

      summary.sent.push({ pi: piId, to: recipient, property: pm.propertyName ?? '?', checkIn, amount: remaining })

      // Nur im echten Versand (nicht bei to-Override-Test) als gesendet markieren
      if (!toOverride) {
        try {
          await stripe.paymentLinks.update(link.id, { metadata: { ...md, reminder_sent_at: new Date().toISOString() } })
        } catch (e) {
          console.error('[cron/restbetrag] Konnte reminder_sent_at nicht setzen:', e)
        }
      }
    }

    console.log(`[cron/restbetrag] fertig – gesendet: ${summary.sent.length}, übersprungen: ${summary.skipped.length}`)
    return NextResponse.json({ ok: true, ...summary })
  } catch (err) {
    console.error('[cron/restbetrag] Fehler:', err)
    return NextResponse.json({ error: 'Cron fehlgeschlagen' }, { status: 500 })
  }
}
