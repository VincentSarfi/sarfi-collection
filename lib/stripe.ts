/**
 * Server-side Stripe helper.
 * Import ONLY from API routes / Server Components.
 */
import Stripe from 'stripe'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-03-31.basil' as any,
})

/** Deposit fraction – 50% */
export const DEPOSIT_FRACTION = 0.5

/** Convert EUR amount to Stripe cents */
export const toCents = (eur: number) => Math.round(eur * 100)

/** Convert Stripe cents to EUR */
export const fromCents = (cents: number) => Math.round(cents) / 100
