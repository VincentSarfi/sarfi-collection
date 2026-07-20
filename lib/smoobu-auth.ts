/**
 * Smoobu-API-Authentifizierung (HMAC-SHA256) — Server-only.
 * Import ONLY from API routes / Server Components – never from client components.
 *
 * Smoobu schaltet die Legacy-`Api-Key`-Auth am 25.09.2026 ab; danach müssen alle
 * Requests HMAC-signiert sein. Spec: https://docs.smoobu.com/ → Authentication.
 *
 * Kanonischer String (7 Zeilen, mit "\n" verbunden):
 *   METHOD \n PATH \n QUERY_STRING \n TIMESTAMP \n NONCE \n BODY_HASH \n API_KEY
 *   • QUERY_STRING = Query-Parameter alphabetisch nach Key sortiert ("k=v&k=v"),
 *     leere Zeile wenn keine
 *   • BODY_HASH    = SHA256-HEX des Bodys (Hash des leeren Strings bei GET)
 * Signatur = base64( HMAC-SHA256( kanonischer String, API_SECRET ) )
 *
 * FEATURE-FLAG: HMAC-signiert wird nur, wenn SMOOBU_API_SECRET gesetzt ist; sonst
 * fällt der Client auf den Legacy-`Api-Key`-Header zurück (= bisheriges Verhalten).
 * Damit bricht ein Deploy nichts, bevor Key+Secret in Smoobu erzeugt und die Env-
 * Vars gesetzt sind; Rollback = SMOOBU_API_SECRET entfernen.
 *
 * ⚠️ `url` MUSS die vollständige Request-URL inkl. Query-String sein und `body` exakt
 * der gesendete Body-String — sonst weicht die serverseitig neu berechnete Signatur
 * von unserer ab. PATH/QUERY werden aus dieser URL abgeleitet, also deckungsgleich
 * mit dem, was der Server empfängt (robust gegen /api/v1-Doku-Uneinheitlichkeit).
 *
 * Logik ist byte-identisch zur Dashboard-Implementierung
 * (sarfi-dashboard/backend/lib/smoobu-auth.js); dort verankert ein Golden-Test die
 * Kanonisierung an den offiziellen Doku-Beispielen.
 */

import crypto from 'node:crypto'

export type SmoobuMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

function sha256hex(s: string): string {
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex')
}

// UTC-ISO-8601 ohne Millisekunden (Doku-Format: 2026-07-20T12:00:00Z).
function isoTimestamp(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
}

// Query-Parameter alphabetisch nach Key (dann Wert) sortiert, ohne führendes "?".
function canonicalQuery(sp: URLSearchParams): string {
  const entries = [...sp.entries()].sort((a, b) => {
    if (a[0] !== b[0]) return a[0] < b[0] ? -1 : 1
    if (a[1] !== b[1]) return a[1] < b[1] ? -1 : 1
    return 0
  })
  return entries.map(([k, v]) => `${k}=${v}`).join('&')
}

export function hmacEnabled(): boolean {
  return Boolean(process.env.SMOOBU_API_SECRET)
}

/**
 * Baut die HTTP-Header für einen Smoobu-Request.
 * @param method HTTP-Verb
 * @param url    VOLLSTÄNDIGE Request-URL inkl. Query-String
 * @param body   exakter Body-String (leer bei GET/DELETE)
 * @param extra  zusätzliche Header
 */
export function smoobuHeaders(
  method: SmoobuMethod,
  url: string,
  body = '',
  extra: Record<string, string> = {},
): Record<string, string> {
  const base: Record<string, string> = {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    ...extra,
  }

  const apiKey = process.env.SMOOBU_API_KEY ?? ''
  const secret = process.env.SMOOBU_API_SECRET

  if (!secret) {
    if (!apiKey) console.warn('[Smoobu] SMOOBU_API_KEY is not set.')
    return { 'Api-Key': apiKey, ...base }
  }

  const u = new URL(url)
  const timestamp = isoTimestamp()
  const nonce = crypto.randomUUID()
  const canonical = [
    method.toUpperCase(),
    u.pathname,
    canonicalQuery(u.searchParams),
    timestamp,
    nonce,
    sha256hex(body),
    apiKey,
  ].join('\n')
  const signature = crypto.createHmac('sha256', secret).update(canonical, 'utf8').digest('base64')

  return {
    'X-API-Key': apiKey,
    'X-Timestamp': timestamp,
    'X-Nonce': nonce,
    'X-Signature': signature,
    ...base,
  }
}
