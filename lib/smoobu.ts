/**
 * Server-side Smoobu API wrapper.
 * Import ONLY from API routes / Server Components – never from client components.
 * The SMOOBU_API_KEY environment variable stays server-side.
 */

const SMOOBU_BASE = 'https://login.smoobu.com/api'

function getHeaders() {
  const apiKey = process.env.SMOOBU_API_KEY
  if (!apiKey) {
    console.warn('[Smoobu] SMOOBU_API_KEY is not set. API calls will fail.')
  }
  return {
    'Api-Key': apiKey ?? '',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type DayAvailability = {
  available: boolean
  /** Nightly price in EUR (0 if not returned by API) */
  price: number
  /** Minimum stay starting from this day */
  minimumStay: number
}

/** Keys are ISO date strings (YYYY-MM-DD) */
export type AvailabilityMap = Record<string, DayAvailability>

export type BookingRequest = {
  apartmentId: string
  checkIn: string    // YYYY-MM-DD
  checkOut: string   // YYYY-MM-DD
  guests: number
  firstName: string
  lastName: string
  email: string
  phone: string
  message?: string
  /** Pre-calculated total (nights × rate + cleaning fee) */
  totalPrice: number
}

export type BookingResult = {
  id: number
  referenceId?: string
}

// ─── Availability ─────────────────────────────────────────────────────────────

/**
 * Fetch availability + nightly rates for a date range.
 * Cached for 5 minutes via Next.js fetch cache.
 */
export async function getAvailability(
  apartmentId: string,
  startDate: string,
  endDate: string,
): Promise<AvailabilityMap> {
  const url =
    `${SMOOBU_BASE}/apartments/${apartmentId}/availability` +
    `?startDate=${startDate}&endDate=${endDate}`

  const res = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 300 }, // 5-minute server-side cache
  })

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`Smoobu availability error ${res.status}: ${text}`)
  }

  const json = (await res.json()) as {
    data?: Record<
      string,
      { available: number; price?: number; minimumLength?: number }
    >
  }

  const result: AvailabilityMap = {}
  for (const [date, day] of Object.entries(json.data ?? {})) {
    result[date] = {
      available: day.available === 1,
      price: day.price ?? 0,
      minimumStay: day.minimumLength ?? 1,
    }
  }
  return result
}

// ─── Create Booking ───────────────────────────────────────────────────────────

/**
 * Verify availability for the requested range (double-check before confirming).
 * Returns null if all clear, or the first blocked date as string if conflict.
 */
export async function verifyAvailability(
  apartmentId: string,
  checkIn: string,
  checkOut: string,
): Promise<string | null> {
  const availability = await getAvailability(apartmentId, checkIn, checkOut)

  // Check each night (checkIn inclusive, checkOut exclusive)
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const cursor = new Date(start)
  while (cursor < end) {
    const key = cursor.toISOString().split('T')[0]
    if (!availability[key]?.available) {
      return key // first blocked night found
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return null
}

/**
 * Create a reservation via Smoobu API.
 * channelId 16 = Website Direct.
 */
export async function createBooking(req: BookingRequest): Promise<BookingResult> {
  const body = {
    apartmentId: parseInt(req.apartmentId, 10),
    arrivalDate: req.checkIn,
    departureDate: req.checkOut,
    channelId: 16, // Website Direct – verify in your Smoobu channel settings
    firstName: req.firstName,
    lastName: req.lastName,
    email: req.email,
    phone: req.phone,
    adults: req.guests,
    children: 0,
    price: req.totalPrice,
    priceStatus: 1, // 1 = price confirmed
    deposit: 0,
    language: 'de',
    guestAppMessage: req.message ?? '',
  }

  const res = await fetch(`${SMOOBU_BASE}/reservations`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string; message?: string }
    throw new Error(
      err.detail ?? err.message ?? `Smoobu booking failed: ${res.status}`,
    )
  }

  const json = (await res.json()) as { id?: number; referenceId?: string }
  return {
    id: json.id ?? 0,
    referenceId: json.referenceId,
  }
}
