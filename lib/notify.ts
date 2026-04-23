import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface GuestConfirmationData {
  propertyName: string
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  totalPrice: number
  depositAmount: number
  paymentOption?: "50" | "100"
  firstName: string
  lastName: string
  email: string
  smoobuBookingId?: string | number
  remainingPaymentUrl?: string
}

export interface BookingNotificationData {
  // Unterkunft
  propertyName: string
  apartmentId: string
  // Datum & Gäste
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  // Preise
  totalPrice: number
  depositAmount: number
  paymentOption?: "50" | "100"
  // Gast
  firstName: string
  lastName: string
  email: string
  phone: string
  message?: string
  // Stripe
  paymentIntentId: string
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}.${month}.${year}`
}

function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('de-DE', { minimumFractionDigits: 2 }) + ' €'
}

export async function sendCheckoutStartedNotification(data: BookingNotificationData) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey === 'PLACEHOLDER') return

  const nights    = data.nights
  const deposit   = data.depositAmount
  const total     = data.totalPrice
  const remaining = total - deposit
  const isFullPay = data.paymentOption === "100"

  const html = `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header – gelb/orange für "noch offen" -->
        <tr>
          <td style="background:#92400e;padding:28px 32px;">
            <p style="margin:0;color:#fcd34d;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;">⏳ Checkout gestartet – noch nicht bezahlt</p>
            <h1 style="margin:6px 0 0;color:#fef3c7;font-size:22px;font-weight:700;">${data.propertyName}</h1>
          </td>
        </tr>

        <!-- Hinweis -->
        <tr>
          <td style="padding:20px 32px 0;">
            <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:14px 16px;">
              <p style="margin:0;font-size:13px;color:#92400e;">
                <strong>Achtung:</strong> Dieser Gast hat das Zahlungsformular geöffnet, die Zahlung aber noch <strong>nicht abgeschlossen</strong>. Du erhältst eine zweite Mail sobald die Zahlung erfolgreich war.
              </p>
            </div>
          </td>
        </tr>

        <!-- Buchungsdetails -->
        <tr>
          <td style="padding:20px 32px 0;">
            <p style="margin:0 0 12px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.12em;font-weight:600;">Buchungsdetails</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding:0 8px 12px 0;">
                  <div style="background:#f5f0e8;border-radius:8px;padding:14px;">
                    <p style="margin:0 0 4px;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Anreise</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#1a2e1a;">${formatDate(data.checkIn)}</p>
                  </div>
                </td>
                <td width="50%" style="padding:0 0 12px 8px;">
                  <div style="background:#f5f0e8;border-radius:8px;padding:14px;">
                    <p style="margin:0 0 4px;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Abreise</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#1a2e1a;">${formatDate(data.checkOut)}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="50%" style="padding:0 8px 12px 0;">
                  <div style="background:#f5f0e8;border-radius:8px;padding:14px;">
                    <p style="margin:0 0 4px;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Nächte</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#1a2e1a;">${nights}</p>
                  </div>
                </td>
                <td width="50%" style="padding:0 0 12px 8px;">
                  <div style="background:#f5f0e8;border-radius:8px;padding:14px;">
                    <p style="margin:0 0 4px;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Gäste</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#1a2e1a;">${data.guests}</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Preise -->
        <tr>
          <td style="padding:0 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eee;border-bottom:1px solid #eee;padding:16px 0;">
              <tr>
                <td style="padding:4px 0;font-size:14px;color:#555;">Gesamtpreis</td>
                <td align="right" style="padding:4px 0;font-size:14px;color:#1a2e1a;font-weight:600;">${total.toLocaleString('de-DE')} €</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:14px;color:#555;">${isFullPay ? '100% Vollzahlung' : '50% Anzahlung'}</td>
                <td align="right" style="padding:4px 0;font-size:14px;color:#92400e;font-weight:700;">${deposit.toLocaleString('de-DE')} € (noch ausstehend)</td>
              </tr>
              ${!isFullPay ? `<tr>
                <td style="padding:4px 0;font-size:14px;color:#555;">Restbetrag</td>
                <td align="right" style="padding:4px 0;font-size:14px;color:#1a2e1a;">${remaining.toLocaleString('de-DE')} €</td>
              </tr>` : ''}
            </table>
          </td>
        </tr>

        <!-- Gast -->
        <tr>
          <td style="padding:20px 32px 0;">
            <p style="margin:0 0 12px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.12em;font-weight:600;">Gast</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:5px 0;font-size:14px;color:#888;width:130px;">Name</td>
                <td style="padding:5px 0;font-size:14px;color:#1a2e1a;font-weight:500;">${data.firstName} ${data.lastName}</td>
              </tr>
              <tr>
                <td style="padding:5px 0;font-size:14px;color:#888;">E-Mail</td>
                <td style="padding:5px 0;font-size:14px;"><a href="mailto:${data.email}" style="color:#1a2e1a;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding:5px 0;font-size:14px;color:#888;">Telefon</td>
                <td style="padding:5px 0;font-size:14px;"><a href="tel:${data.phone}" style="color:#1a2e1a;">${data.phone}</a></td>
              </tr>
              ${data.message ? `<tr><td style="padding:5px 0;font-size:14px;color:#888;vertical-align:top;">Nachricht</td><td style="padding:5px 0;font-size:14px;color:#1a2e1a;">${data.message}</td></tr>` : ''}
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 32px 28px;">
            <p style="margin:0;font-size:11px;color:#aaa;">Stripe Payment Intent: <code style="font-size:11px;color:#888;">${data.paymentIntentId}</code></p>
          </td>
        </tr>

        <tr>
          <td style="background:#f5f0e8;padding:18px 32px;border-top:1px solid #e8e2d6;">
            <p style="margin:0;font-size:12px;color:#999;text-align:center;">SARFI Collection · sarfi-collection.de</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    await resend.emails.send({
      from: 'Buchungssystem <buchung@sarfi-collection.de>',
      to:   ['28imwald@gmail.com'],
      subject: `⏳ Checkout gestartet (noch nicht bezahlt): ${data.propertyName} · ${formatDate(data.checkIn)}–${formatDate(data.checkOut)} · ${data.firstName} ${data.lastName}`,
      html,
    })
    console.log(`[notify] Checkout-Benachrichtigung gesendet für ${data.firstName} ${data.lastName}`)
  } catch (err) {
    console.error('[notify] Checkout-Benachrichtigung Fehler:', err)
  }
}

export async function sendBookingNotification(data: BookingNotificationData) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey === 'PLACEHOLDER') {
    console.warn('[notify] RESEND_API_KEY nicht gesetzt – Benachrichtigung übersprungen')
    return
  }

  const nights    = data.nights
  const deposit   = data.depositAmount
  const total     = data.totalPrice
  const remaining = total - deposit
  const isFullPay = data.paymentOption === "100"

  const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1a2e1a;padding:28px 32px;">
            <p style="margin:0;color:#c9a84c;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;">Neue Buchungsanfrage</p>
            <h1 style="margin:6px 0 0;color:#f5f0e8;font-size:22px;font-weight:700;">${data.propertyName}</h1>
          </td>
        </tr>

        <!-- Buchungsdetails -->
        <tr>
          <td style="padding:28px 32px 0;">
            <p style="margin:0 0 16px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.12em;font-weight:600;">Buchungsdetails</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding:0 8px 12px 0;vertical-align:top;">
                  <div style="background:#f5f0e8;border-radius:8px;padding:14px;">
                    <p style="margin:0 0 4px;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Anreise</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#1a2e1a;">${formatDate(data.checkIn)}</p>
                  </div>
                </td>
                <td width="50%" style="padding:0 0 12px 8px;vertical-align:top;">
                  <div style="background:#f5f0e8;border-radius:8px;padding:14px;">
                    <p style="margin:0 0 4px;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Abreise</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#1a2e1a;">${formatDate(data.checkOut)}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="50%" style="padding:0 8px 12px 0;vertical-align:top;">
                  <div style="background:#f5f0e8;border-radius:8px;padding:14px;">
                    <p style="margin:0 0 4px;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Nächte</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#1a2e1a;">${nights}</p>
                  </div>
                </td>
                <td width="50%" style="padding:0 0 12px 8px;vertical-align:top;">
                  <div style="background:#f5f0e8;border-radius:8px;padding:14px;">
                    <p style="margin:0 0 4px;font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Gäste</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#1a2e1a;">${data.guests}</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Preise -->
        <tr>
          <td style="padding:0 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eee;border-bottom:1px solid #eee;padding:16px 0;margin:8px 0;">
              <tr>
                <td style="padding:4px 0;font-size:14px;color:#555;">Gesamtpreis</td>
                <td align="right" style="padding:4px 0;font-size:14px;color:#1a2e1a;font-weight:600;">${total.toLocaleString('de-DE')} €</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:14px;color:#555;">${isFullPay ? '100% Vollzahlung' : '50% Anzahlung'} <span style="color:#2d7a2d;font-size:12px;">✓ bezahlt</span></td>
                <td align="right" style="padding:4px 0;font-size:14px;color:#2d7a2d;font-weight:700;">${deposit.toLocaleString('de-DE')} €</td>
              </tr>
              ${!isFullPay ? `<tr>
                <td style="padding:4px 0;font-size:14px;color:#555;">Restbetrag (fällig 14 Tage vor Anreise)</td>
                <td align="right" style="padding:4px 0;font-size:14px;color:#1a2e1a;font-weight:600;">${remaining.toLocaleString('de-DE')} €</td>
              </tr>` : ''}
            </table>
          </td>
        </tr>

        <!-- Gast -->
        <tr>
          <td style="padding:20px 32px 0;">
            <p style="margin:0 0 12px;font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.12em;font-weight:600;">Gast</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:5px 0;font-size:14px;color:#888;width:130px;">Name</td>
                <td style="padding:5px 0;font-size:14px;color:#1a2e1a;font-weight:500;">${data.firstName} ${data.lastName}</td>
              </tr>
              <tr>
                <td style="padding:5px 0;font-size:14px;color:#888;">E-Mail</td>
                <td style="padding:5px 0;font-size:14px;color:#1a2e1a;">
                  <a href="mailto:${data.email}" style="color:#1a2e1a;">${data.email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:5px 0;font-size:14px;color:#888;">Telefon</td>
                <td style="padding:5px 0;font-size:14px;color:#1a2e1a;">
                  <a href="tel:${data.phone}" style="color:#1a2e1a;">${data.phone}</a>
                </td>
              </tr>
              ${data.message ? `
              <tr>
                <td style="padding:5px 0;font-size:14px;color:#888;vertical-align:top;">Nachricht</td>
                <td style="padding:5px 0;font-size:14px;color:#1a2e1a;">${data.message}</td>
              </tr>` : ''}
            </table>
          </td>
        </tr>

        <!-- Stripe ID -->
        <tr>
          <td style="padding:20px 32px 28px;">
            <p style="margin:0;font-size:11px;color:#aaa;">Stripe Payment Intent: <code style="font-size:11px;color:#888;">${data.paymentIntentId}</code></p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f5f0e8;padding:18px 32px;border-top:1px solid #e8e2d6;">
            <p style="margin:0;font-size:12px;color:#999;text-align:center;">SARFI Collection · sarfi-collection.de</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
`

  const textContent = `
Neue Buchungsanfrage – ${data.propertyName}

BUCHUNGSDETAILS
Unterkunft: ${data.propertyName}
Anreise:    ${formatDate(data.checkIn)}
Abreise:    ${formatDate(data.checkOut)}
Nächte:     ${nights}
Gäste:      ${data.guests}

PREISE
Gesamt:     ${total.toLocaleString('de-DE')} €
Zahlung:    ${isFullPay ? '100% Vollzahlung' : '50% Anzahlung'} – ${deposit.toLocaleString('de-DE')} € ✓ bezahlt
${!isFullPay ? `Restbetrag: ${remaining.toLocaleString('de-DE')} € (14 Tage vor Anreise)` : 'Vollständig bezahlt – kein Restbetrag'}

GAST
Name:       ${data.firstName} ${data.lastName}
E-Mail:     ${data.email}
Telefon:    ${data.phone}
${data.message ? `Nachricht:  ${data.message}` : ''}

Stripe PI: ${data.paymentIntentId}
`.trim()

  try {
    const { error } = await resend.emails.send({
      from: 'Buchungssystem <buchung@sarfi-collection.de>',
      to:   ['28imwald@gmail.com'],
      subject: `🏠 Neue Buchung: ${data.propertyName} · ${formatDate(data.checkIn)}–${formatDate(data.checkOut)} · ${data.firstName} ${data.lastName}`,
      html,
      text: textContent,
    })

    if (error) {
      console.error('[notify] Resend Fehler:', error)
    } else {
      console.log(`[notify] Benachrichtigung gesendet für ${data.firstName} ${data.lastName}`)
    }
  } catch (err) {
    console.error('[notify] Unerwarteter Fehler:', err)
  }
}

export async function sendGuestConfirmationEmail(data: GuestConfirmationData) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey === 'PLACEHOLDER') return

  const isFullPay = data.paymentOption === "100"
  const remaining = Math.round(data.totalPrice - data.depositAmount)

  const html = `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#ede8df;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ede8df;padding:40px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 40px rgba(0,0,0,0.13);">

  <!-- ── Header ── -->
  <tr>
    <td align="center" style="background:#1a2e1a;padding:52px 48px 40px;">
      <img src="https://www.sarfi-collection.de/images/logo.svg" width="240" alt="SARFI Collection" style="display:block;margin:0 auto;" />
      <div style="width:28px;height:1px;background:#c9a84c;margin:28px auto 24px;"></div>
      <p style="margin:0 0 10px;color:#c9a84c;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;font-weight:500;">Buchung bestätigt</p>
      <h1 style="margin:0;color:#f5f0e8;font-size:30px;font-weight:300;letter-spacing:0.01em;">Vielen Dank, ${data.firstName}!</h1>
      <p style="margin:12px 0 0;color:rgba(245,240,232,0.55);font-size:13px;letter-spacing:0.02em;">${data.propertyName} &nbsp;·&nbsp; ${formatDate(data.checkIn)} – ${formatDate(data.checkOut)}</p>
    </td>
  </tr>

  <!-- ── Intro ── -->
  <tr>
    <td style="padding:36px 48px 0;">
      <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.8;">
        Deine Zahlung ist eingegangen und deine Buchung ist bestätigt. Wir freuen uns, dich bald bei uns begrüßen zu dürfen.${!isFullPay ? ' Den ausstehenden Restbetrag bitten wir dich bis 14&nbsp;Tage vor Anreise zu begleichen.' : ''}
      </p>
    </td>
  </tr>

  <!-- ── Trennlinie ── -->
  <tr><td style="padding:28px 48px 0;"><div style="height:1px;background:#ede8df;"></div></td></tr>

  <!-- ── Buchungsdetails ── -->
  <tr>
    <td style="padding:28px 48px 0;">
      <p style="margin:0 0 18px;font-size:9px;color:#c9a84c;text-transform:uppercase;letter-spacing:0.22em;font-weight:600;">Buchungsdetails</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #ede8df;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:0.1em;">Unterkunft</td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid #ede8df;font-size:14px;font-weight:600;color:#1a2e1a;">${data.propertyName}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #ede8df;">
            <span style="font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:0.1em;">Anreise</span>
          </td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid #ede8df;">
            <span style="font-size:14px;font-weight:600;color:#1a2e1a;">${formatDate(data.checkIn)}</span>
            <span style="font-size:11px;color:#aaa;display:block;text-align:right;">ab 15:00 Uhr</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #ede8df;">
            <span style="font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:0.1em;">Abreise</span>
          </td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid #ede8df;">
            <span style="font-size:14px;font-weight:600;color:#1a2e1a;">${formatDate(data.checkOut)}</span>
            <span style="font-size:11px;color:#aaa;display:block;text-align:right;">bis 10:00 Uhr</span>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #ede8df;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:0.1em;">Nächte</td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid #ede8df;font-size:14px;font-weight:600;color:#1a2e1a;">${data.nights}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;font-size:11px;color:#aaa;text-transform:uppercase;letter-spacing:0.1em;">Gäste</td>
          <td align="right" style="padding:12px 0;font-size:14px;font-weight:600;color:#1a2e1a;">${data.guests}</td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── Trennlinie ── -->
  <tr><td style="padding:28px 48px 0;"><div style="height:1px;background:#ede8df;"></div></td></tr>

  <!-- ── Zahlungsübersicht ── -->
  <tr>
    <td style="padding:28px 48px 0;">
      <p style="margin:0 0 18px;font-size:9px;color:#c9a84c;text-transform:uppercase;letter-spacing:0.22em;font-weight:600;">Zahlungsübersicht</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #ede8df;font-size:13px;color:#4a5568;">Gesamtpreis</td>
          <td align="right" style="padding:12px 0;border-bottom:1px solid #ede8df;font-size:13px;color:#1a2e1a;font-weight:600;">${data.totalPrice.toLocaleString('de-DE')} €</td>
        </tr>
        <tr>
          <td style="padding:12px 0;${!isFullPay ? 'border-bottom:1px solid #ede8df;' : ''}font-size:13px;color:#2d6a4f;">
            ✓ &nbsp;${isFullPay ? 'Vollzahlung beglichen' : 'Anzahlung (50 %) beglichen'}
          </td>
          <td align="right" style="padding:12px 0;${!isFullPay ? 'border-bottom:1px solid #ede8df;' : ''}font-size:13px;color:#2d6a4f;font-weight:700;">
            ${data.depositAmount.toLocaleString('de-DE')} €
          </td>
        </tr>
        ${!isFullPay ? `<tr>
          <td style="padding:12px 0;font-size:13px;color:#4a5568;">Restbetrag <span style="font-size:11px;color:#aaa;">(fällig 14 Tage vor Anreise)</span></td>
          <td align="right" style="padding:12px 0;font-size:13px;color:#1a2e1a;font-weight:700;">${remaining.toLocaleString('de-DE')} €</td>
        </tr>` : ''}
      </table>
      ${data.smoobuBookingId ? `<p style="margin:16px 0 0;font-size:11px;color:#c9c2b5;">Buchungs-Nr. <strong style="color:#999;">#${data.smoobuBookingId}</strong></p>` : ''}
    </td>
  </tr>

  ${!isFullPay && data.remainingPaymentUrl ? `
  <!-- ── Restbetrag CTA ── -->
  <tr>
    <td style="padding:32px 48px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a2e1a;border-radius:4px;">
        <tr>
          <td align="center" style="padding:32px 32px 28px;">
            <p style="margin:0 0 6px;font-size:9px;color:#c9a84c;text-transform:uppercase;letter-spacing:0.22em;font-weight:600;">Ausstehender Restbetrag</p>
            <p style="margin:0 0 6px;font-size:36px;font-weight:300;color:#f5f0e8;letter-spacing:-0.5px;">${remaining.toLocaleString('de-DE')} €</p>
            <p style="margin:0 0 24px;font-size:12px;color:rgba(245,240,232,0.5);">Fällig bis 14 Tage vor Anreise am ${formatDate(data.checkIn)}</p>
            <a href="${data.remainingPaymentUrl}" style="display:inline-block;background:#c9a84c;color:#1a2e1a;font-size:13px;font-weight:700;text-decoration:none;padding:15px 36px;border-radius:2px;letter-spacing:0.08em;text-transform:uppercase;">
              Jetzt bezahlen
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>` : ''}

  <!-- ── Gastgeber ── -->
  <tr>
    <td style="padding:32px 48px 0;">
      <p style="margin:0 0 18px;font-size:9px;color:#c9a84c;text-transform:uppercase;letter-spacing:0.22em;font-weight:600;">Dein Gastgeber</p>
      <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#1a2e1a;">SARFI Collection</p>
      <p style="margin:0 0 14px;font-size:12px;color:#aaa;">Bayerischer Wald, Deutschland</p>
      <p style="margin:0 0 6px;font-size:13px;color:#4a5568;"><a href="mailto:hallo@sarfi-collection.de" style="color:#1a2e1a;text-decoration:none;">hallo@sarfi-collection.de</a></p>
      <p style="margin:0;font-size:13px;color:#4a5568;"><a href="tel:+4917656850146" style="color:#1a2e1a;text-decoration:none;">+49 176 56850146</a></p>
    </td>
  </tr>

  <!-- ── Stornierung ── -->
  <tr>
    <td style="padding:20px 48px 36px;">
      <p style="margin:0;font-size:11px;color:#c9c2b5;">
        Stornierungsbedingungen: <a href="https://www.sarfi-collection.de/stornierung" style="color:#aaa;text-decoration:underline;">sarfi-collection.de/stornierung</a>
      </p>
    </td>
  </tr>

  <!-- ── Footer ── -->
  <tr>
    <td align="center" style="background:#1a2e1a;padding:28px 48px;">
      <p style="margin:0 0 6px;font-size:10px;color:#f5f0e8;letter-spacing:0.22em;text-transform:uppercase;font-weight:500;">SARFI COLLECTION</p>
      <a href="https://www.sarfi-collection.de" style="font-size:11px;color:#c9a84c;text-decoration:none;letter-spacing:0.05em;">sarfi-collection.de</a>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`

  try {
    await resend.emails.send({
      from: 'SARFI Collection <buchung@sarfi-collection.de>',
      to:   [data.email],
      subject: `✅ Buchungsbestätigung: ${data.propertyName} · ${formatDate(data.checkIn)}–${formatDate(data.checkOut)}`,
      html,
    })
    console.log(`[notify] Gastbestätigung gesendet an ${data.email}`)
  } catch (err) {
    console.error('[notify] Gastbestätigung Fehler:', err)
  }
}
