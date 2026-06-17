/**
 * Server-side Cloudflare Turnstile verification.
 *
 * Used to keep bots out of endpoints that trigger side effects (contact mail,
 * Stripe PaymentIntent creation). If no secret is configured the check is
 * skipped (returns true) so local/dev environments without Turnstile still work.
 */
const SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  // No secret configured → don't block (dev/local fallback).
  if (!secret) return true
  if (!token) return false

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}
