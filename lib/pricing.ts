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

/**
 * Tolerance on the server-side expected total. Absorbs drift between page load
 * and checkout: PriceLabs re-prices daily and /api/pricelabs/rates is cached for
 * an hour, so the total the guest saw can legitimately be a bit below ours.
 */
const PRICE_TOLERANCE = 0.15

/**
 * Absolute sanity bound as a share of `priceFrom` per night, used only when we
 * have no dynamic rates at all. Dynamic pricing dips well below the "from"
 * price in the low season, so `priceFrom` itself must never be a lower bound.
 */
const FALLBACK_FLOOR_FACTOR = 0.5

export type PriceCheck = {
  /** Best server-side estimate of the legitimate total (EUR). */
  expectedTotal: number
  /** Gross-manipulation bound used when dynamic rates are unavailable (EUR). */
  floor: number
  /** Smallest acceptable client total (EUR) before we treat it as manipulation. */
  minAcceptable: number
  /** True when PriceLabs delivered real rates – only then is `expectedTotal`
   *  authoritative enough to charge more than the guest was shown. */
  usedDynamicRates: boolean
  nights: number
  /** Required minimum stay in nights (config minStay, raised by the dynamic
   *  PriceLabs min_stay of the check-in day when available). */
  minStayRequired: number
}

/**
 * Recompute the expected price for a stay. Mirrors the client-side calcPrice:
 *   total = sum(nightly) + extraGuests * extraPersonFee * nights + cleaningFee
 *
 * The accepted lower bound is derived from `expectedTotal` (PRICE_TOLERANCE).
 * Only when PriceLabs delivers no rate at all does `floor` step in, and then as
 * a deliberately low bound – it just has to catch totalPrice = 1, not defend the
 * exact price. The real safeguard is the caller charging
 * max(clientTotal, expectedTotal), so this check may err on the lenient side;
 * a bound that rejects honest guests costs bookings.
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
  let daysWithRate = 0
  try {
    const map = await getPricingMap(smoobuListingId, checkIn, checkOut)
    for (const day of daysBetween(checkIn, checkOut)) {
      const dynamic = map[day]?.price
      if (dynamic && dynamic > 0) {
        nightlyTotal += dynamic
        daysWithRate++
      } else {
        nightlyTotal += config.priceFrom
      }
    }
    const dynamicMinStay = map[checkIn]?.minStay ?? 0
    minStayRequired = Math.max(config.minStay, dynamicMinStay)
  } catch {
    nightlyTotal = config.priceFrom * nights
    daysWithRate = 0
  }
  if (nightlyTotal <= 0) {
    nightlyTotal = config.priceFrom * nights
    daysWithRate = 0
  }

  const extraGuests = Math.max(0, guests - config.baseOccupancy)
  const extraPersonTotal = extraGuests * config.extraPersonFee * nights

  const expectedTotal = Math.round(nightlyTotal + extraPersonTotal + config.cleaningFee)
  const tolerated = Math.round(expectedTotal * (1 - PRICE_TOLERANCE))
  const floor =
    Math.round(config.priceFrom * FALLBACK_FLOOR_FACTOR) * nights +
    extraPersonTotal +
    config.cleaningFee

  // With dynamic rates the expected total is authoritative. Without them it is
  // built from `priceFrom` and therefore too high – the client may have priced
  // the stay from Smoobu rates that sit below it, so take the lower bound.
  const usedDynamicRates = daysWithRate > 0
  const minAcceptable = usedDynamicRates ? tolerated : Math.min(tolerated, floor)

  return { expectedTotal, floor, minAcceptable, usedDynamicRates, nights, minStayRequired }
}
