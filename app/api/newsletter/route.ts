import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { Resend } from 'resend'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const resend = new Resend(process.env.RESEND_API_KEY)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const BASE_URL = 'https://www.sarfi-collection.de'

/** Signierter Double-Opt-in-Token über die (normalisierte) E-Mail. */
function newsletterToken(email: string): string {
  const secret = process.env.NEWSLETTER_SECRET
  if (!secret) throw new Error('NEWSLETTER_SECRET is not set')
  return createHmac('sha256', secret).update(email.toLowerCase()).digest('hex')
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = rateLimit(`newsletter:${ip}`, 5, 10 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte warte kurz und versuche es erneut.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  try {
    const body = await request.json()
    const email = String(body?.email ?? '').trim().toLowerCase()
    const consent = body?.consent === true

    if (!EMAIL_RE.test(email) || email.length > 254 || !consent) {
      return NextResponse.json({ error: 'Bitte gib eine gültige E-Mail-Adresse an und stimme der Datenschutzerklärung zu.' }, { status: 400 })
    }

    let token: string
    try {
      token = newsletterToken(email)
    } catch (e) {
      console.error('[newsletter] misconfiguration:', e)
      return NextResponse.json({ error: 'Der Newsletter ist gerade nicht verfügbar. Bitte versuche es später erneut.' }, { status: 500 })
    }

    const confirmUrl = `${BASE_URL}/api/newsletter/confirm?email=${encodeURIComponent(email)}&token=${token}`

    const html = `<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#1a2e1a;padding:24px 32px;">
          <p style="margin:0;color:#c9a84c;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;">SARFI Collection</p>
          <h1 style="margin:6px 0 0;color:#f5f0e8;font-size:20px;font-weight:600;">Newsletter bestätigen</h1>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <p style="margin:0 0 16px;font-size:14px;color:#1a2e1a;line-height:1.7;">
            Hallo, bitte bestätige deine Anmeldung zum SARFI-Collection-Newsletter mit einem Klick:
          </p>
          <p style="margin:0 0 20px;">
            <a href="${confirmUrl}" style="display:inline-block;background:#1a2e1a;color:#f5f0e8;text-decoration:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;">Anmeldung bestätigen</a>
          </p>
          <p style="margin:0;font-size:12px;color:#888;line-height:1.6;">
            Falls du dich nicht angemeldet hast, ignoriere diese E-Mail einfach – ohne Bestätigung wird deine Adresse nicht gespeichert.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

    const { error } = await resend.emails.send({
      from: 'SARFI Collection <buchung@sarfi-collection.de>',
      to: [email],
      subject: 'Bitte bestätige deine Newsletter-Anmeldung',
      html,
    })

    if (error) {
      console.error('[newsletter] Resend error:', error)
      // Neutral antworten – keine E-Mail-Enumeration
    }

    return NextResponse.json({
      success: true,
      message: 'Wenn die Adresse gültig ist, haben wir dir eine Bestätigungsmail geschickt. Bitte prüfe dein Postfach.',
    })
  } catch (err) {
    console.error('[newsletter] Unexpected error:', err)
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 })
  }
}
