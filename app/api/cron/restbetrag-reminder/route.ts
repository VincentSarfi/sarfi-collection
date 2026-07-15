import { createHash, timingSafeEqual } from 'crypto'
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

/** Timing-sicherer Vergleich zweier Strings (über SHA-256-Hashes). */
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

/** Link-Metadaten aktualisieren, mit 2 Retries bei Fehlschlag. */
async function updateLinkMetadata(
  linkId: string,
  metadata: Record<string, string>,
): Promise<boolean> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await stripe.paymentLinks.update(linkId, { metadata })
      return true
    } catch (e) {
      if (attempt === 3) {
        console.error(`[cron/restbetrag] Metadaten-Update für ${linkId} nach 3 Versuchen fehlgeschlagen:`, e)
        return false
      }
    }
  }
  return false
}

export async function GET(request: NextRequest) {
  // --- Auth ---
  const expected = process.env.CRON_SECRET
  if (!expected) {
    console.error('[cron/restbetrag] CRON_SECRET nicht gesetzt – Abbruch')
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }
  const auth = request.headers.get('authorization') ?? ''
  if (!safeEqual(auth, `Bearer ${expected}`)) {
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
    errors: [] as Array<{ pi?: string; link: string; reason: string }>,
    dryRun,
  }

  try {
    // Alle Restbetrag-Links durchgehen (auto-paginierend)
    for await (const link of stripe.paymentLinks.list({ active: true, limit: 100 })) {
      const md = link.metadata ?? {}
      if (md.type !== 'restbetrag') continue

      const piId = md.original_payment_intent
      if (only && piId !== only) continue

      summary.scanned++

      // Schon bezahlt oder erinnert? (im Test-/only-Modus mit to-Override erneut erlauben)
      if (md.paid_at) {
        summary.skipped.push({ pi: piId, link: link.id, reason: `bereits bezahlt am ${md.paid_at}` })
        continue
      }
      if (md.reminder_sent_at && !toOverride) {
        summary.skipped.push({ pi: piId, link: link.id, reason: `bereits erinnert am ${md.reminder_sent_at}` })
        continue
      }

      // Bezahlt?
      let paid = false
      try {
        paid = await isLinkPaid(link.id)
      } catch (e) {
        // Zahlungsstatus unklar → keinesfalls mahnen, Link überspringen
        summary.skipped.push({ pi: piId, link: link.id, reason: `Zahlungsstatus nicht prüfbar (${e instanceof Error ? e.message : 'Fehler'})` })
        continue
      }
      if (paid) {
        summary.skipped.push({ pi: piId, link: link.id, reason: 'bereits bezahlt' })
        if (!dryRun) {
          await updateLinkMetadata(link.id, { ...md, paid_at: new Date().toISOString() })
          try { await stripe.paymentLinks.update(link.id, { active: false }) } catch (e) {
            console.error(`[cron/restbetrag] Konnte bezahlten Link ${link.id} nicht deaktivieren:`, e)
          }
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
        if (!dryRun) {
          try { await stripe.paymentLinks.update(link.id, { active: false }) } catch (e) {
            console.error(`[cron/restbetrag] Konnte abgelaufenen Link ${link.id} nicht deaktivieren:`, e)
          }
        }
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

      // Buchungssprache: aus den PI-Metadaten (Alt-Buchungen ohne locale → de)
      const guestLocale = pm.locale === 'en' ? 'en' as const : 'de' as const

      const ok = await sendRemainingPaymentReminderEmail({
        propertyName:        pm.propertyName ?? (guestLocale === 'en' ? 'your accommodation' : 'deine Unterkunft'),
        checkIn,
        checkOut:            checkOut ?? checkIn,
        firstName:           pm.firstName ?? '',
        lastName:            pm.lastName ?? '',
        email:               recipient,
        remainingAmount:     remaining,
        remainingPaymentUrl: link.url,
        subjectPrefix:       toOverride ? '[TEST] ' : '',
        locale:              guestLocale,
      })

      if (!ok) {
        summary.skipped.push({ pi: piId, link: link.id, reason: 'Versand fehlgeschlagen' })
        continue
      }

      summary.sent.push({ pi: piId, to: recipient, property: pm.propertyName ?? '?', checkIn, amount: remaining })

      // Nur im echten Versand (nicht bei to-Override-Test) als gesendet markieren
      if (!toOverride) {
        const marked = await updateLinkMetadata(link.id, { ...md, reminder_sent_at: new Date().toISOString() })
        if (!marked) {
          summary.errors.push({ pi: piId, link: link.id, reason: 'reminder_sent_at konnte nicht gesetzt werden – Gefahr doppelter Erinnerung' })
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
