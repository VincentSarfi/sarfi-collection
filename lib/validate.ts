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
