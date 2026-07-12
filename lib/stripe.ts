/**
 * Server-side Stripe helper.
 * Import ONLY from API routes / Server Components.
 */
import Stripe from 'stripe'

// Lazy-Client: erst beim ersten Zugriff (Laufzeit) instanziieren. Sonst wirft
// `new Stripe('')` schon beim `next build` (Modul-Evaluierung), wenn der
// STRIPE_SECRET_KEY zur Build-Zeit fehlt (bei Self-Hosting ohne Vercel-Env-Inject).
let _stripe: Stripe | null = null
function stripeClient(): Stripe {
  return (_stripe ??= new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
    apiVersion: '2025-03-31.basil' as any,
  }))
}

// Proxy hält die bestehende `stripe.xyz.method()`-API aller Consumer unverändert,
// leitet aber jeden Zugriff an den lazy erzeugten Client weiter.
export const stripe = new Proxy({} as Stripe, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(_t, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (stripeClient() as any)[prop]
  },
}) as Stripe

/** Deposit fraction – 50% */
export const DEPOSIT_FRACTION = 0.5

/** Convert EUR amount to Stripe cents */
export const toCents = (eur: number) => Math.round(eur * 100)

/** Convert Stripe cents to EUR */
