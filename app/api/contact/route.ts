import { NextRequest, NextResponse } from 'next/server'
import { EMAIL_RE } from '@/lib/validate'
import { Resend } from 'resend'
import { escapeHtml } from '@/lib/escape'
import { verifyTurnstile } from '@/lib/turnstile'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Lazy: Client erst zur Laufzeit erzeugen. Sonst wirft `new Resend(undefined)`
// bereits beim `next build` (Modul-Evaluierung), wenn der Key zur Build-Zeit fehlt.
const getResend = () => new Resend(process.env.RESEND_API_KEY)


const SUBJECT_LABELS: Record<string, string> = {
  haus28:      'HAUS28 – Anfrage',
  schoenblick: 'Haus Schönblick – Anfrage',
  gruppe:      'Gruppenbuchung',
  other:       'Sonstiges',
}

export async function POST(request: NextRequest) {
  // Rate limit: max 5 contact mails per IP per 10 minutes
  const ip = getClientIp(request)
  const rl = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Zu viele Anfragen. Bitte warte kurz und versuche es erneut.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  try {
    const body = await request.json()
    const { name, email, phone, subject, message, turnstileToken } = body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }

    if (!EMAIL_RE.test(email.trim())) {
      return NextResponse.json({ error: 'Ungültige E-Mail-Adresse' }, { status: 400 })
    }

    // CAPTCHA-Verifikation
    const valid = await verifyTurnstile(turnstileToken ?? '')
    if (!valid) {
      return NextResponse.json({ error: 'CAPTCHA-Verifikation fehlgeschlagen. Bitte versuche es erneut.' }, { status: 400 })
    }

    const subjectLabel = SUBJECT_LABELS[subject] ?? 'Kontaktanfrage'

    // Escape all user-controlled values before interpolating into HTML
    const safeName    = escapeHtml(name)
    const safeEmail   = escapeHtml(email)
    const safePhone   = escapeHtml(phone?.trim() ?? '')
    const safeMessage = escapeHtml(message)

    const html = `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <tr>
          <td style="background:#1a2e1a;padding:24px 32px;">
            <p style="margin:0;color:#c9a84c;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;">Neue Nachricht über sarfi-collection.de</p>
            <h1 style="margin:6px 0 0;color:#f5f0e8;font-size:20px;font-weight:600;">${subjectLabel}</h1>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#888;width:100px;">Name</td>
                <td style="padding:6px 0;font-size:14px;color:#1a2e1a;font-weight:500;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#888;">E-Mail</td>
                <td style="padding:6px 0;font-size:14px;">
                  <a href="mailto:${safeEmail}" style="color:#1a2e1a;">${safeEmail}</a>
                </td>
              </tr>
              ${safePhone ? `<tr>
                <td style="padding:6px 0;font-size:13px;color:#888;">Telefon</td>
                <td style="padding:6px 0;font-size:14px;">
                  <a href="tel:${safePhone}" style="color:#1a2e1a;">${safePhone}</a>
                </td>
              </tr>` : ''}
              <tr>
                <td style="padding:6px 0;font-size:13px;color:#888;">Betreff</td>
                <td style="padding:6px 0;font-size:14px;color:#1a2e1a;">${subjectLabel}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 32px 0;">
            <div style="height:1px;background:#eee;"></div>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 32px 32px;">
            <p style="margin:0 0 8px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.12em;font-weight:600;">Nachricht</p>
            <p style="margin:0;font-size:14px;color:#1a2e1a;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
          </td>
        </tr>

        <tr>
          <td style="background:#f5f0e8;padding:16px 32px;border-top:1px solid #e8e2d6;">
            <p style="margin:0;font-size:11px;color:#aaa;text-align:center;">
              Direkt antworten an: <a href="mailto:${safeEmail}" style="color:#888;">${safeEmail}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    const { error } = await getResend().emails.send({
      from:     'Website <buchung@sarfi-collection.de>',
      to:       ['hallo@sarfi-collection.de'],
      replyTo:  email,
      subject:  `📬 ${subjectLabel} von ${name}`,
      html,
    })

    if (error) {
      console.error('[contact] Resend error:', error)
      return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] Unexpected error:', err)
    return NextResponse.json({ error: 'Serverfehler' }, { status: 500 })
  }
}
