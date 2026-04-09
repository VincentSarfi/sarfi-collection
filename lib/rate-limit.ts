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
 * Extract the real client IP from a Next.js request,
 * falling back through common proxy headers.
 */
export function getClientIp(request: Request): string {
  const headers = new Headers((request as Request).headers)
  return (
    headers.get('x-real-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'unknown'
  )
}
