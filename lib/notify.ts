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
<body style="margin:0;padding:0;background:#f5f0e8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

  <!-- ── Logo Header ── -->
  <tr>
    <td align="center" style="background:#1a2e1a;padding:36px 32px 28px;">
      <!-- Echtes Logo als Bild (SVG mit transparentem Hintergrund, cremefarbene Schrift) -->
      <img src="https://www.sarfi-collection.de/images/logo.svg" width="160" height="100" alt="SARFI Collection" style="display:block;margin:0 auto;" />
      <!-- Divider -->
      <div style="width:40px;height:1px;background:#c9a84c;margin:20px auto 18px;"></div>
      <!-- Status -->
      <p style="margin:0 0 6px;color:#c9a84c;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:600;font-family:'Helvetica Neue',Arial,sans-serif;">✅ Buchung bestätigt</p>
      <h1 style="margin:0;color:#f5f0e8;font-size:26px;font-weight:700;font-family:'Helvetica Neue',Arial,sans-serif;">Vielen Dank, ${data.firstName}!</h1>
      <p style="margin:8px 0 0;color:#f5f0e8;opacity:0.65;font-size:14px;font-family:'Helvetica Neue',Arial,sans-serif;">Deine Buchung für <strong style="opacity:1;">${data.propertyName}</strong> ist bestätigt.</p>
    </td>
  </tr>

  <!-- ── Grüner Hinweis ── -->
  <tr>
    <td style="padding:24px 32px 0;">
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px 18px;">
        <p style="margin:0;font-size:13px;color:#166534;line-height:1.5;">
          Deine Zahlung wurde erfolgreich verarbeitet. Wir freuen uns auf deinen Aufenthalt!${!isFullPay ? ' Den Restbetrag bitten wir dich <strong>14 Tage vor Anreise</strong> zu begleichen.' : ''}
        </p>
      </div>
    </td>
  </tr>

  <!-- ── Buchungsdetails ── -->
  <tr>
    <td style="padding:24px 32px 0;">
      <p style="margin:0 0 14px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.14em;font-weight:600;">Buchungsdetails</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" style="padding:0 6px 10px 0;">
            <div style="background:#f5f0e8;border-radius:10px;padding:14px 16px;">
              <p style="margin:0 0 3px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Anreise</p>
              <p style="margin:0;font-size:18px;font-weight:700;color:#1a2e1a;font-family:'Helvetica Neue',Arial,sans-serif;">${formatDate(data.checkIn)}</p>
              <p style="margin:4px 0 0;font-size:11px;color:#999;">ab 15:00 Uhr</p>
            </div>
          </td>
          <td width="50%" style="padding:0 0 10px 6px;">
            <div style="background:#f5f0e8;border-radius:10px;padding:14px 16px;">
              <p style="margin:0 0 3px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Abreise</p>
              <p style="margin:0;font-size:18px;font-weight:700;color:#1a2e1a;font-family:'Helvetica Neue',Arial,sans-serif;">${formatDate(data.checkOut)}</p>
              <p style="margin:4px 0 0;font-size:11px;color:#999;">bis 10:00 Uhr</p>
            </div>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding:0 6px 0 0;">
            <div style="background:#f5f0e8;border-radius:10px;padding:14px 16px;">
              <p style="margin:0 0 3px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Nächte</p>
              <p style="margin:0;font-size:18px;font-weight:700;color:#1a2e1a;font-family:'Helvetica Neue',Arial,sans-serif;">${data.nights}</p>
            </div>
          </td>
          <td width="50%" style="padding:0 0 0 6px;">
            <div style="background:#f5f0e8;border-radius:10px;padding:14px 16px;">
              <p style="margin:0 0 3px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.1em;">Gäste</p>
              <p style="margin:0;font-size:18px;font-weight:700;color:#1a2e1a;font-family:'Helvetica Neue',Arial,sans-serif;">${data.guests}</p>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── Zahlungsübersicht ── -->
  <tr>
    <td style="padding:20px 32px 0;">
      <p style="margin:0 0 12px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.14em;font-weight:600;">Zahlungsübersicht</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e2d6;border-radius:10px;overflow:hidden;">
        <tr style="background:#fafaf8;">
          <td style="padding:11px 16px;font-size:13px;color:#666;">Gesamtpreis</td>
          <td align="right" style="padding:11px 16px;font-size:13px;color:#1a2e1a;font-weight:600;">${data.totalPrice.toLocaleString('de-DE')} €</td>
        </tr>
        <tr style="background:#f0fdf4;">
          <td style="padding:11px 16px;font-size:13px;color:#166534;border-top:1px solid #e8e2d6;">
            ✅ ${isFullPay ? 'Vollzahlung beglichen' : 'Anzahlung (50%) beglichen'}
          </td>
          <td align="right" style="padding:11px 16px;font-size:13px;color:#166534;font-weight:700;border-top:1px solid #e8e2d6;">
            ${data.depositAmount.toLocaleString('de-DE')} €
          </td>
        </tr>
        ${!isFullPay ? `<tr>
          <td style="padding:11px 16px;font-size:13px;color:#666;border-top:1px solid #e8e2d6;">Restbetrag (fällig 14 Tage vor Anreise)</td>
          <td align="right" style="padding:11px 16px;font-size:13px;color:#1a2e1a;font-weight:700;border-top:1px solid #e8e2d6;">${remaining.toLocaleString('de-DE')} €</td>
        </tr>` : ''}
      </table>
      ${data.smoobuBookingId ? `<p style="margin:10px 0 0;font-size:11px;color:#bbb;">Buchungs-Nr.: <strong style="color:#999;">#${data.smoobuBookingId}</strong></p>` : ''}
    </td>
  </tr>

  ${!isFullPay && data.remainingPaymentUrl ? `
  <!-- ── Restbetrag CTA ── -->
  <tr>
    <td style="padding:24px 32px 0;">
      <div style="background:#1a2e1a;border-radius:12px;padding:22px 24px;text-align:center;">
        <p style="margin:0 0 4px;font-size:11px;color:#c9a84c;text-transform:uppercase;letter-spacing:0.12em;font-weight:600;">Restbetrag</p>
        <p style="margin:0 0 16px;font-size:28px;font-weight:700;color:#f5f0e8;font-family:'Helvetica Neue',Arial,sans-serif;">${remaining.toLocaleString('de-DE')} €</p>
        <p style="margin:0 0 18px;font-size:13px;color:#f5f0e8;opacity:0.65;">Bitte 14 Tage vor deiner Anreise am ${formatDate(data.checkIn)} begleichen.</p>
        <a href="${data.remainingPaymentUrl}" style="display:inline-block;background:#c9a84c;color:#1a2e1a;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:100px;letter-spacing:0.02em;">
          Jetzt Restbetrag bezahlen →
        </a>
      </div>
    </td>
  </tr>` : ''}

  <!-- ── Gastgeber ── -->
  <tr>
    <td style="padding:24px 32px 0;">
      <p style="margin:0 0 12px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:0.14em;font-weight:600;">Dein Gastgeber</p>
      <div style="border:1px solid #e8e2d6;border-radius:10px;padding:18px;">
        <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#1a2e1a;font-family:'Helvetica Neue',Arial,sans-serif;">SARFI Collection</p>
        <p style="margin:0 0 12px;font-size:13px;color:#888;">Bayerischer Wald, Deutschland</p>
        <p style="margin:0 0 6px;font-size:13px;color:#555;">📧 <a href="mailto:hallo@sarfi-collection.de" style="color:#1a2e1a;text-decoration:none;border-bottom:1px solid #e8e2d6;">hallo@sarfi-collection.de</a></p>
        <p style="margin:0;font-size:13px;color:#555;">📞 <a href="tel:+4917656850146" style="color:#1a2e1a;text-decoration:none;border-bottom:1px solid #e8e2d6;">+49 176 56850146</a></p>
      </div>
    </td>
  </tr>

  <!-- ── Stornierung ── -->
  <tr>
    <td style="padding:16px 32px 28px;">
      <p style="margin:0;font-size:12px;color:#aaa;line-height:1.5;">
        Stornierungsbedingungen: <a href="https://www.sarfi-collection.de/stornierung" style="color:#888;">sarfi-collection.de/stornierung</a>
      </p>
    </td>
  </tr>

  <!-- ── Footer ── -->
  <tr>
    <td align="center" style="background:#1a2e1a;padding:22px 32px;">
      <p style="margin:0 0 4px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;color:#f5f0e8;letter-spacing:1px;">SARFI COLLECTION</p>
      <p style="margin:0;font-size:11px;color:#c9a84c;letter-spacing:0.05em;">
        <a href="https://www.sarfi-collection.de" style="color:#c9a84c;text-decoration:none;">sarfi-collection.de</a>
      </p>
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
