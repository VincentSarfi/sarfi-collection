// Zentrale Validierungs-Helfer (E-Mail / Datum).
// Vereinheitlicht die zuvor mehrfach in den API-Routen kopierten Regexes
// (contact, newsletter, newsletter/confirm, rechnung, stripe/payment-intent,
// smoobu/booking). Eingeführt 2026-07-10 im Rahmen der Phase-0-Bereinigung.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function isValidEmail(s: string) {
  return EMAIL_RE.test(s)
}

export function isValidDate(s: string) {
  return DATE_RE.test(s) && !isNaN(Date.parse(s))
}

/** Text für einen Stripe-Metadata-Wert: Stripe nimmt höchstens 500 Zeichen je
 *  Wert, darüber scheitert der ganze PaymentIntent. Gekürzt nach Codepunkten,
 *  damit kein Emoji zerschnitten wird. */
export function metadataText(text: string | undefined, max = 500): string {
  const zeichen = Array.from(text ?? '')
  return zeichen.length > max ? zeichen.slice(0, max - 1).join('') + '…' : zeichen.join('')
}
