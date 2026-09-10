/**
 * PriceLabs API wrapper – server-side only.
 *
 * Uses POST /v1/listing_prices to fetch per-night dynamic prices.
 * Auth: X-API-Key header
 * Docs: https://app.swaggerhub.com/apis-docs/Customer_API/customer_api/1.0.0-oas3
 */

const PRICELABS_BASE = 'https://api.pricelabs.co/v1'

/**
 * Direktbuchungs-Faktor auf den PriceLabs-Basispreis.
 *
 * PriceLabs liefert den Smoobu-Basispreis B. Airbnb und Booking.com bekommen
 * von Smoobu +15 % Kanalaufschlag, FeWo-direkt +6 %. Die Website verkauft mit
 * diesem Faktor: Der Gast zahlt weiterhin deutlich weniger als auf den
 * Portalen (1,05 vs. 1,15), uns bleibt netto aber mehr als auf jedem Portal
 * (Airbnb netto ≈ 0,97·B, Booking ≈ 0,97·B, Website ≈ 1,03·B nach Stripe).
 * Überschreibbar per Env DIRECT_PRICE_FACTOR (z. B. "1.00" für Basispreis).
 */
export const DIRECT_PRICE_FACTOR = (() => {
  const raw = Number.parseFloat(process.env.DIRECT_PRICE_FACTOR ?? '')
  return Number.isFinite(raw) && raw >= 0.5 && raw <= 1.5 ? raw : 1.05
})()

function getHeaders() {
  return {
    'X-API-Key': process.env.PRICELABS_API_KEY ?? '',
    'Content-Type': 'application/json',
  }
}

export type NightRate = {
  date: string    // YYYY-MM-DD
  price: number   // EUR – user_price if set, else PriceLabs dynamic price
  minStay: number
}

type PriceLabsDay = {
  date: string
  price: number
  user_price: number   // -1 means not set
  min_stay: number
  booking_status: string
}

type PriceLabsListing = {
  id: string
  data: PriceLabsDay[]
}

/**
 * Fetch per-night dynamic prices from PriceLabs for a Smoobu listing.
 * Returns a map of date → NightRate.
 */
export async function getPricingMap(
  smoobuListingId: string,
  startDate: string,
  endDate: string,
): Promise<Record<string, NightRate>> {
  const body = {
    listings: [
      {
        id: smoobuListingId,
        pms: 'smoobu',
        dateFrom: startDate,
        dateTo: endDate,
      },
    ],
  }

  const res = await fetch(`${PRICELABS_BASE}/listing_prices`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
    next: { revalidate: 3600 }, // cache 1 hour
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`PriceLabs POST /listing_prices → ${res.status}: ${text}`)
  }

  const json: PriceLabsListing[] = await res.json()

  const listing = json.find((l) => String(l.id) === String(smoobuListingId))
  if (!listing?.data?.length) return {}

  const map: Record<string, NightRate> = {}

  for (const day of listing.data) {
    if (!day.date) continue
    // Use user_price if manually set, otherwise PriceLabs dynamic price
    const basePrice = day.user_price > 0 ? day.user_price : day.price
    if (basePrice <= 0) continue
    const price = Math.round(basePrice * DIRECT_PRICE_FACTOR)
    map[day.date] = {
      date: day.date,
      price,
      minStay: day.min_stay ?? 1,
    }
  }

  return map
}
