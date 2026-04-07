/**
 * PriceLabs API wrapper – server-side only.
 *
 * PriceLabs does not expose per-night prices via their Customer API.
 * They push nightly rates to Smoobu (and other channels) internally,
 * but the only price data available via API is:
 *   GET /v1/listings → recommended_base_price (updated daily)
 *
 * We use recommended_base_price to fill the calendar with an up-to-date
 * nightly rate. It is the same for all nights in the range (no per-night
 * breakdown), but it reflects PriceLabs' current daily recommendation.
 */

const PRICELABS_BASE = 'https://api.pricelabs.co/v1'

function getHeaders() {
  return {
    'X-API-Key': process.env.PRICELABS_API_KEY ?? '',
    'Content-Type': 'application/json',
  }
}

export type NightRate = {
  date: string    // YYYY-MM-DD
  price: number   // EUR
  minStay: number
}

type PriceLabsListing = {
  id: string
  recommended_base_price: number | null
  min: number | null
  base: number | null
}

/**
 * Fetch the recommended_base_price for a listing from PriceLabs.
 * Returns it as a flat date-map so the calendar can display it.
 */
export async function getPricingMap(
  smoobuListingId: string,
  startDate: string,
  endDate: string,
): Promise<Record<string, NightRate>> {
  const url = `${PRICELABS_BASE}/listings/${smoobuListingId}`

  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 }, // cache 1 hour
  })

  if (!res.ok) {
    throw new Error(`PriceLabs /listings/${smoobuListingId} → ${res.status}`)
  }

  const json = await res.json()

  // Response: { listings: [{ id, recommended_base_price, min, base, ... }] }
  const listings: PriceLabsListing[] = json.listings ?? []
  const listing = listings.find((l) => String(l.id) === String(smoobuListingId))

  const price =
    listing?.recommended_base_price ??
    listing?.base ??
    listing?.min ??
    0

  if (price <= 0) return {}

  // Fill every date in the range with the recommended base price
  const map: Record<string, NightRate> = {}
  const cursor = new Date(startDate)
  const endD   = new Date(endDate)

  while (cursor < endD) {
    const key = cursor.toISOString().split('T')[0]
    map[key] = { date: key, price, minStay: 1 }
    cursor.setDate(cursor.getDate() + 1)
  }

  return map
}
