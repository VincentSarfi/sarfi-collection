/**
 * Server-side authoritative price computation.
 *
 * The client sends `totalPrice` in the booking/payment requests, but a client
 * value must never be trusted for charging. These helpers recompute the
 * expected price from the same sources the client uses (PriceLabs dynamic
 * rates + property config) so the API can reject manipulated prices.
 */
import {
  PROPERTY_CONFIGS,
  resolveSmoobuId,
  type PropertyBookingConfig,
} from '@/config/properties.config'
import { getPricingMap } from '@/lib/pricelabs'

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function daysBetween(start: string, end: string): string[] {
  const days: string[] = []
  let cur = start
  while (cur < end) {
    days.push(cur)
    cur = addDays(cur, 1)
  }
  return days
}

/**
 * Resolve a property config from a Smoobu listing id (the value the booking
 * APIs receive as `apartmentId`). Returns null for unknown listings.
 */
export function findConfigBySmoobuId(smoobuId: string): PropertyBookingConfig | null {
  for (const cfg of Object.values(PROPERTY_CONFIGS)) {
    if (resolveSmoobuId(cfg) === smoobuId || cfg.smoobuIdFallback === smoobuId) {
      return cfg
    }
  }
  return null
}

export type PriceCheck = {
  /** Best server-side estimate of the legitimate total (EUR). */
  expectedTotal: number
  /** Hard lower bound independent of dynamic pricing (EUR). */
  floor: number
  /** Smallest acceptable client total (EUR) before we treat it as manipulation. */
  minAcceptable: number
  nights: number
  /** Required minimum stay in nights (config minStay, raised by the dynamic
   *  PriceLabs min_stay of the check-in day when available). */
  minStayRequired: number
}

/**
 * Recompute the expected price for a stay. Mirrors the client-side calcPrice:
 *   total = sum(nightly) + extraGuests * extraPersonFee * nights + cleaningFee
 *
 * `floor` uses the config `priceFrom` (the lowest possible nightly rate) so it
 * stays valid even when PriceLabs is unreachable, catching gross manipulation
 * like totalPrice = 1. A 5% tolerance on `expectedTotal` absorbs dynamic-rate
 * drift between page load and checkout.
 */
export async function computeExpectedPrice(
  config: PropertyBookingConfig,
  smoobuListingId: string,
  checkIn: string,
  checkOut: string,
  guests: number,
): Promise<PriceCheck> {
  const nights = Math.max(1, daysBetween(checkIn, checkOut).length)

  let nightlyTotal = 0
  let minStayRequired = config.minStay
  try {
    const map = await getPricingMap(smoobuListingId, checkIn, checkOut)
    for (const day of daysBetween(checkIn, checkOut)) {
      const rate = map[day]?.price && map[day].price > 0 ? map[day].price : config.priceFrom
      nightlyTotal += rate
    }
    const dynamicMinStay = map[checkIn]?.minStay ?? 0
    minStayRequired = Math.max(config.minStay, dynamicMinStay)
  } catch {
    nightlyTotal = config.priceFrom * nights
  }
  if (nightlyTotal <= 0) nightlyTotal = config.priceFrom * nights

  const extraGuests = Math.max(0, guests - config.baseOccupancy)
  const extraPersonTotal = extraGuests * config.extraPersonFee * nights

  const expectedTotal = Math.round(nightlyTotal + extraPersonTotal + config.cleaningFee)
  const floor = config.priceFrom * nights + config.cleaningFee
  const minAcceptable = Math.max(floor, Math.round(expectedTotal * 0.95))

  return { expectedTotal, floor, minAcceptable, nights, minStayRequired }
}
