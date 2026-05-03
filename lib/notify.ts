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
  phone?: string
  smoobuBookingId?: string | number
  remainingPaymentUrl?: string
  heroImageUrl?: string
}

/** Leitet vom Unterkunftsnamen zur Hero-Bild-URL */
function getHeroImageUrl(propertyName: string): string {
  const lower = propertyName.toLowerCase()
  if (lower.includes('haus28') || lower.includes('haus 28')) {
    return 'https://www.sarfi-collection.de/images/haus28/hero.webp'
  }
  return 'https://www.sarfi-collection.de/images/schoenblick/aussen/hero.webp'
}

function getCancellationRows(propertyName: string): string {
  const lower = propertyName.toLowerCase()
  if (lower.includes('haus28') || lower.includes('haus 28')) {
    return `
        <tr>
          <td style="padding:10px 14px;font-size:13px;color:#4a5568;border-bottom:1px solid #f0ece4;">Mehr als 30 Tage</td>
          <td style="padding:10px 14px;font-size:13px;color:#4a5568;border-bottom:1px solid #f0ece4;">100 % Erstattung</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-size:13px;color:#4a5568;border-bottom:1px solid #f0ece4;">14–30 Tage</td>
          <td style="padding:10px 14px;font-size:13px;color:#4a5568;border-bottom:1px solid #f0ece4;">50 % Erstattung</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-size:13px;color:#4a5568;">Weniger als 14 Tage</td>
          <td style="padding:10px 14px;font-size:13px;color:#4a5568;">Keine Erstattung</td>
        </tr>`
  }
  // Schönblick (B5–B8, A2)
  return `
        <tr>
          <td style="padding:10px 14px;font-size:13px;color:#4a5568;border-bottom:1px solid #f0ece4;">Mehr als 14 Tage</td>
          <td style="padding:10px 14px;font-size:13px;color:#4a5568;border-bottom:1px solid #f0ece4;">100 % Erstattung</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-size:13px;color:#4a5568;border-bottom:1px solid #f0ece4;">7–14 Tage</td>
          <td style="padding:10px 14px;font-size:13px;color:#4a5568;border-bottom:1px solid #f0ece4;">50 % Erstattung</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-size:13px;color:#4a5568;">Weniger als 7 Tage</td>
          <td style="padding:10px 14px;font-size:13px;color:#4a5568;">Keine Erstattung</td>
        </tr>`
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
  if (!apiKey || apiKey === 'PLACEHOLDER') {
    console.warn('[notify] RESEND_API_KEY nicht gesetzt – Checkout-Benachrichtigung übersprungen')
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
      to:   ['hallo@sarfi-collection.de'],
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
      to:   ['hallo@sarfi-collection.de'],
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
  const heroUrl = data.heroImageUrl ?? getHeroImageUrl(data.propertyName)
  const bookedAt = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const nightsLabel = data.nights === 1 ? '1 Nacht' : `${data.nights} Nächte`
  const guestsLabel = data.guests === 1 ? '1 Gast' : `${data.guests} Gäste`

  const html = `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#ede8df;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ede8df;padding:40px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden;box-shadow:0 2px 40px rgba(0,0,0,0.13);">

  <!-- Header -->
  <tr>
    <td align="center" style="background:#0c1a10;padding:44px 48px 36px;">
      <img src="https://www.sarfi-collection.de/images/logo-email.png" width="220" alt="SARFI Collection" style="display:block;margin:0 auto;border-radius:3px;" />
    </td>
  </tr>

  <!-- Greeting -->
  <tr>
    <td style="padding:36px 48px 0;">
      <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#1a2e1a;">Hi ${data.firstName} ${data.lastName},</h1>
      <h2 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#1a2e1a;">deine Buchung ist bestätigt!</h2>
      <p style="margin:0;font-size:14px;color:#4a5568;line-height:1.7;">Dein Aufenthalt ist gesichert. Wir freuen uns, dich bald bei uns begrüßen zu dürfen.${!isFullPay ? ' Den ausstehenden Restbetrag bitten wir dich bis 14&nbsp;Tage vor Anreise zu begleichen.' : ''}</p>
    </td>
  </tr>

  <!-- Property photo + name -->
  <tr>
    <td style="padding:24px 48px 0;">
      <div style="border-radius:6px;overflow:hidden;line-height:0;">
        <img src="${heroUrl}" width="484" alt="${data.propertyName}" style="display:block;width:100%;height:auto;max-height:280px;object-fit:cover;" />
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;">
        <tr>
          <td>
            <p style="margin:0 0 2px;font-size:16px;font-weight:700;color:#1a2e1a;">${data.propertyName}</p>
            <p style="margin:0;font-size:12px;color:#aaa;">Bayerischer Wald, Deutschland</p>
            ${data.smoobuBookingId ? `<p style="margin:6px 0 0;font-size:11px;color:#c9c2b5;">Reservierungs-ID: <strong style="color:#999;">#${data.smoobuBookingId}</strong></p>` : ''}
          </td>
          <td align="right" valign="top">
            <a href="https://www.sarfi-collection.de" style="display:inline-block;padding:9px 18px;border:1px solid #1a2e1a;border-radius:4px;font-size:12px;font-weight:600;color:#1a2e1a;text-decoration:none;white-space:nowrap;">Zur Unterkunft</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr><td style="padding:24px 48px 0;"><div style="height:1px;background:#ede8df;"></div></td></tr>

  <!-- Booking Details -->
  <tr>
    <td style="padding:24px 48px 0;">
      <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#1a2e1a;">Buchungsdetails</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;color:#888;">Name</td>
          <td align="right" style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;font-weight:600;color:#1a2e1a;">${data.firstName} ${data.lastName}</td>
        </tr>
        <tr>
          <td style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;color:#888;">Buchungsdatum</td>
          <td align="right" style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;font-weight:600;color:#1a2e1a;">${bookedAt}</td>
        </tr>
        <tr>
          <td style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;color:#888;">E-Mail</td>
          <td align="right" style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;font-weight:600;color:#1a2e1a;"><a href="mailto:${data.email}" style="color:#1a2e1a;text-decoration:none;">${data.email}</a></td>
        </tr>
        ${data.phone ? `<tr>
          <td style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;color:#888;">Telefon</td>
          <td align="right" style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;font-weight:600;color:#1a2e1a;">${data.phone}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;color:#888;">Gäste</td>
          <td align="right" style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;font-weight:600;color:#1a2e1a;">${guestsLabel}</td>
        </tr>
        <tr>
          <td style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;color:#888;">Anzahl Nächte</td>
          <td align="right" style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;font-weight:600;color:#1a2e1a;">${nightsLabel}</td>
        </tr>
        <tr>
          <td style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;color:#888;">Check-in</td>
          <td align="right" style="padding:11px 0;border-bottom:1px solid #f0ece4;">
            <span style="font-size:13px;font-weight:600;color:#1a2e1a;">${formatDate(data.checkIn)}</span>
            <span style="font-size:11px;color:#aaa;display:block;text-align:right;">ab 16:00 Uhr</span>
          </td>
        </tr>
        <tr>
          <td style="padding:11px 0;font-size:13px;color:#888;">Check-out</td>
          <td align="right" style="padding:11px 0;">
            <span style="font-size:13px;font-weight:600;color:#1a2e1a;">${formatDate(data.checkOut)}</span>
            <span style="font-size:11px;color:#aaa;display:block;text-align:right;">bis 10:00 Uhr</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr><td style="padding:24px 48px 0;"><div style="height:1px;background:#ede8df;"></div></td></tr>

  <!-- Payment -->
  <tr>
    <td style="padding:24px 48px 0;">
      <p style="margin:0 0 16px;font-size:16px;font-weight:700;color:#1a2e1a;">Zahlungsübersicht</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;color:#888;">Gesamtpreis</td>
          <td align="right" style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;font-weight:600;color:#1a2e1a;">${data.totalPrice.toLocaleString('de-DE')} €</td>
        </tr>
        <tr>
          <td style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;color:#888;">Zahlungsstatus</td>
          <td align="right" style="padding:11px 0;border-bottom:1px solid #f0ece4;font-size:13px;font-weight:600;color:#2d6a4f;">${isFullPay ? 'Vollständig bezahlt' : '50 % Anzahlung bezahlt'}</td>
        </tr>
        <tr>
          <td style="padding:11px 0;${!isFullPay ? 'border-bottom:1px solid #f0ece4;' : ''}font-size:13px;color:#888;">
            Bezahlter Betrag
            <span style="display:block;font-size:11px;color:#bbb;">Kreditkarte · ${bookedAt}</span>
          </td>
          <td align="right" style="padding:11px 0;${!isFullPay ? 'border-bottom:1px solid #f0ece4;' : ''}font-size:15px;font-weight:700;color:#1a2e1a;">${data.depositAmount.toLocaleString('de-DE')} €</td>
        </tr>
        ${!isFullPay ? `<tr>
          <td style="padding:11px 0;font-size:13px;color:#888;">Ausstehender Restbetrag <span style="display:block;font-size:11px;color:#bbb;">fällig 14 Tage vor Anreise</span></td>
          <td align="right" style="padding:11px 0;font-size:15px;font-weight:700;color:#1a2e1a;">${remaining.toLocaleString('de-DE')} €</td>
        </tr>` : ''}
      </table>
    </td>
  </tr>

  ${!isFullPay && data.remainingPaymentUrl ? `
  <!-- Restbetrag CTA -->
  <tr>
    <td style="padding:24px 48px 0;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a2e1a;border-radius:6px;">
        <tr>
          <td align="center" style="padding:28px 32px 24px;">
            <p style="margin:0 0 4px;font-size:9px;color:#c9a84c;text-transform:uppercase;letter-spacing:0.22em;font-weight:600;">Ausstehender Restbetrag</p>
            <p style="margin:0 0 4px;font-size:34px;font-weight:300;color:#f5f0e8;letter-spacing:-0.5px;">${remaining.toLocaleString('de-DE')} €</p>
            <p style="margin:0 0 20px;font-size:12px;color:rgba(245,240,232,0.5);">Fällig bis 14 Tage vor Anreise am ${formatDate(data.checkIn)}</p>
            <a href="${data.remainingPaymentUrl}" style="display:inline-block;background:#c9a84c;color:#1a2e1a;font-size:13px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:3px;letter-spacing:0.08em;text-transform:uppercase;">Jetzt bezahlen</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>` : ''}

  <tr><td style="padding:24px 48px 0;"><div style="height:1px;background:#ede8df;"></div></td></tr>

  <!-- House Rules -->
  <tr>
    <td style="padding:24px 48px 0;">
      <p style="margin:0 0 14px;font-size:16px;font-weight:700;color:#1a2e1a;">Hausregeln</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#4a5568;">&#9679;&nbsp; Check-in ab 16:00 Uhr &nbsp;·&nbsp; Check-out bis 10:00 Uhr</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#4a5568;">&#9679;&nbsp; Rauchen nur im Außenbereich erlaubt</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#4a5568;">&#9679;&nbsp; Haustiere auf Anfrage – bitte vorab abstimmen</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#4a5568;">&#9679;&nbsp; Wasser und Energie bitte sorgsam verwenden</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#4a5568;">&#9679;&nbsp; Bitte beim Verlassen alle Türen und Fenster schließen</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#4a5568;">&#9679;&nbsp; Schäden bitte sofort melden</td>
        </tr>
      </table>
    </td>
  </tr>

  <tr><td style="padding:24px 48px 0;"><div style="height:1px;background:#ede8df;"></div></td></tr>

  <!-- Cancellation Policy -->
  <tr>
    <td style="padding:24px 48px 0;">
      <p style="margin:0 0 14px;font-size:16px;font-weight:700;color:#1a2e1a;">Stornierungsbedingungen</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0ece4;border-radius:6px;overflow:hidden;">
        <tr style="background:#f7f4ef;">
          <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #f0ece4;">Zeitraum vor Anreise</td>
          <td style="padding:10px 14px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #f0ece4;">Erstattung</td>
        </tr>
        ${getCancellationRows(data.propertyName)}
      </table>
      <p style="margin:10px 0 0;font-size:11px;color:#bbb;">Vollständige Bedingungen: <a href="https://www.sarfi-collection.de/stornierung" style="color:#999;text-decoration:underline;">sarfi-collection.de/stornierung</a></p>
    </td>
  </tr>

  <tr><td style="padding:24px 48px 0;"><div style="height:1px;background:#ede8df;"></div></td></tr>

  <!-- Host -->
  <tr>
    <td style="padding:24px 48px 0;">
      <p style="margin:0 0 14px;font-size:16px;font-weight:700;color:#1a2e1a;">Brauchst du Hilfe?</p>
      <p style="margin:0 0 8px;font-size:13px;color:#4a5568;">Melde dich jederzeit direkt bei uns:</p>
      <p style="margin:0 0 4px;font-size:13px;color:#4a5568;">&#128222;&nbsp; <a href="tel:+4917656850146" style="color:#1a2e1a;text-decoration:none;font-weight:600;">+49 176 56850146</a></p>
      <p style="margin:0;font-size:13px;color:#4a5568;">&#9993;&nbsp; <a href="mailto:hallo@sarfi-collection.de" style="color:#1a2e1a;text-decoration:none;font-weight:600;">hallo@sarfi-collection.de</a></p>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td align="center" style="background:#1a2e1a;padding:28px 48px;margin-top:32px;">
      <img src="https://www.sarfi-collection.de/images/logo-email.png" width="140" alt="SARFI Collection" style="display:block;margin:0 auto 14px;border-radius:2px;opacity:0.9;" />
      <p style="margin:0 0 4px;font-size:10px;color:rgba(245,240,232,0.5);letter-spacing:0.1em;">SARFI Collection &nbsp;·&nbsp; Bayerischer Wald</p>
      <a href="https://www.sarfi-collection.de" style="font-size:11px;color:#c9a84c;text-decoration:none;">sarfi-collection.de</a>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`

  try {
    await resend.emails.send({
      from: 'Sarfi Collection <buchung@sarfi-collection.de>',
      to:   [data.email],
      subject: `Buchungsbestätigung: ${data.propertyName} · ${formatDate(data.checkIn)}–${formatDate(data.checkOut)}`,
      html,
    })
    console.log(`[notify] Gastbestätigung gesendet an ${data.email}`)
  } catch (err) {
    console.error('[notify] Gastbestätigung Fehler:', err)
  }
}
