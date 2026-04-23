import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

export async function sendBookingNotification(data: BookingNotificationData) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey === 'PLACEHOLDER') {
    console.warn('[notify] RESEND_API_KEY nicht gesetzt – Benachrichtigung übersprungen')
    return
  }

  const nights = data.nights
  const deposit = data.depositAmount   // already in €
  const total   = data.totalPrice      // already in €
  const remaining = total - deposit

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
                <td style="padding:4px 0;font-size:14px;color:#555;">Anzahlung 50% <span style="color:#2d7a2d;font-size:12px;">(wird jetzt bezahlt)</span></td>
                <td align="right" style="padding:4px 0;font-size:14px;color:#2d7a2d;font-weight:700;">${deposit.toLocaleString('de-DE')} €</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:14px;color:#555;">Restbetrag (fällig 14 Tage vor Anreise)</td>
                <td align="right" style="padding:4px 0;font-size:14px;color:#1a2e1a;font-weight:600;">${remaining.toLocaleString('de-DE')} €</td>
              </tr>
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
Anzahlung:  ${deposit.toLocaleString('de-DE')} € (wird jetzt bezahlt)
Restbetrag: ${remaining.toLocaleString('de-DE')} € (14 Tage vor Anreise)

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
