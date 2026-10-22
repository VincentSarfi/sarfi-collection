import { getClientIp } from '@/lib/rate-limit'

/**
 * Kopfzeilen für die Weiterleitung an die öffentlichen Dashboard-Endpunkte
 * (Meldeschein, Late Checkout, Rechnung).
 *
 * Das Dashboard sieht sonst nur die IP der Website und zählt seine Rate-Limits
 * für alle Gäste gemeinsam: Ein einzelner Besucher konnte so den Late Checkout
 * für alle sperren. Mit SARFI_PROXY_SECRET (gleicher Wert in Website und
 * Dashboard) nimmt das Dashboard die mitgeschickte Gast-IP als Schlüssel.
 * Ohne Secret gehen nur die üblichen Kopfzeilen raus, alles wie bisher.
 */
export function dashboardHeaders(request: Request, json = false): Record<string, string> {
  const headers: Record<string, string> = json ? { 'Content-Type': 'application/json' } : {}
  const secret = process.env.SARFI_PROXY_SECRET
  if (secret) {
    headers['X-Sarfi-Proxy'] = secret
    headers['X-Sarfi-Client-Ip'] = getClientIp(request)
  }
  return headers
}
