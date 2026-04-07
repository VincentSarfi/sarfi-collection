/**
 * PriceLabs API wrapper – server-side only.
 * Fetches dynamic nightly prices per listing.
 */

const PRICELABS_BASE = 'https://api.pricelabs.co/v1'

function getHeaders() {
  return {
    'X-API-Key': process.env.PRICELABS_API_KEY ?? '',
    'Content-Type': 'application/json',
  }
}

export type NightRate = {
  date: string       // YYYY-MM-DD
  price: number      // EUR
  minStay: number
}

/**
 * Get nightly prices from PriceLabs for a Smoobu listing.
 * Returns a map of date → NightRate.
 */
export async function getPricingMap(
  smoobuListingId: string,
  startDate: string,
  endDate: string,
): Promise<Record<string, NightRate>> {
  const url =
    `${PRICELABS_BASE}/listing_prices` +
    `?integration=smoobu` +
    `&listing_ids=${smoobuListingId}` +
    `&start_date=${startDate}` +
    `&end_date=${endDate}`

  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 }, // cache 1 hour
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`PriceLabs API ${res.status}: ${text}`)
  }

  const json = await res.json()

  // PriceLabs can return either an array or an object keyed by listing_id
  // Normalise both formats
  const map: Record<string, NightRate> = {}

  const rows: Array<{ date?: string; price?: number; min_stay?: number }> =
    Array.isArray(json)
      ? json
      : Array.isArray(json.data)
        ? json.data
        : Array.isArray(json[smoobuListingId])
          ? json[smoobuListingId]
          : Object.values(json).flat() as Array<{ date?: string; price?: number; min_stay?: number }>

  for (const row of rows) {
    if (!row.date) continue
    map[row.date] = {
      date: row.date,
      price: row.price ?? 0,
      minStay: row.min_stay ?? 1,
    }
  }

  return map
}
