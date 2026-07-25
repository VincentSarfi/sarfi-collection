/**
 * Simple in-memory rate limiter for Next.js API routes.
 *
 * Works per serverless instance – good enough for a low-traffic booking site.
 * Limits brute-force and bot abuse on sensitive endpoints.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes to avoid memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key)
  }
}, 5 * 60 * 1000)

/**
 * Check and increment rate limit for a given key.
 *
 * @param key       - Unique identifier (e.g. `ip:endpoint`)
 * @param limit     - Max requests allowed in the window
 * @param windowMs  - Window duration in milliseconds
 * @returns `{ allowed: true }` or `{ allowed: false, retryAfter: seconds }`
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    // First request in this window
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, retryAfter }
  }

  entry.count++
  return { allowed: true }
}

/**
 * Extract the real client IP from a Next.js request.
 *
 * Trust model (Sliplane-Hosting): Der Reverse-Proxy hängt die echte Client-IP
 * als LETZTES Element an `x-forwarded-for` an – empirisch verifiziert (rotierende
 * x-forwarded-for-Werte umgehen das Limit NICHT, weil der Proxy die echte IP
 * anhängt). Nur dieses letzte Element ist vertrauenswürdig.
 *
 * `x-real-ip` und vordere x-forwarded-for-Einträge sind vom Client frei setzbar
 * und werden vom Sliplane-Proxy NICHT überschrieben – sie dürfen daher niemals
 * als Rate-Limit-Schlüssel dienen, sonst umgeht ein Bot das Limit trivial per
 * Header-Spoofing (`x-real-ip: 10.0.0.<n>` → jede Fake-IP = eigener Zähler).
 *
 * Annahme: genau EIN vertrauenswürdiger Proxy-Hop (aktueller Stand: kein
 * Cloudflare/CDN davor). Käme ein weiterer Proxy davor, müsste hier der
 * vorletzte Eintrag genutzt werden.
 */
export function getClientIp(request: Request): string {
  const headers = new Headers((request as Request).headers)
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    // Letztes nicht-leeres Element = vom vertrauenswürdigen Proxy angehängte IP.
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length > 0) return parts[parts.length - 1]
  }
  // Fallback nur für lokale/Direktverbindungen ohne Proxy (dort kein Angreifer).
  const realIp = headers.get('x-real-ip')
  if (realIp) return realIp
  return 'unknown'
}
