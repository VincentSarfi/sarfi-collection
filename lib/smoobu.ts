/**
 * Server-side Smoobu API wrapper.
 * Import ONLY from API routes / Server Components – never from client components.
 */

import { smoobuHeaders } from './smoobu-auth'

const SMOOBU_BASE = 'https://login.smoobu.com/api'
// Website-Buchungen laufen auf den Kanal „Webseite", NICHT auf „Direktbuchung".
// Grund ist die Buchungsbestätigung: Smoobu-Vorlagen lassen sich nur je Kanal
// schalten, und der Website-Gast bekommt bereits die eigene, gestaltete Mail aus
// lib/notify.ts. „Direktbuchung" bleibt damit frei für telefonisch/von Hand in
// Smoobu eingetragene Buchungen — die bekommen die Smoobu-Vorlage, sonst gar
// nichts. Fachlich sind beide Kanäle dasselbe; das Dashboard behandelt sie in
// backend/invoices/mapping.js (istDirekt) gemeinsam als Direktvertrieb.
const DIRECT_CHANNEL_ID = 4393853 // „Webseite"-Kanal dieses Smoobu-Kontos
// Hauszeiten für alle Einheiten (data/properties.ts, AGB, JSON-LD). Smoobu
// erwartet "HH:ii"; fehlen sie, bleiben die Zeitfelder der Buchung leer.
const CHECK_IN_TIME = '16:00'
const CHECK_OUT_TIME = '10:00'

// ─── Types ────────────────────────────────────────────────────────────────────

export type DayAvailability = {
  available: boolean
  price: number
  minimumStay: number
}

/** Keys are ISO date strings (YYYY-MM-DD) */
export type AvailabilityMap = Record<string, DayAvailability>

export type BookingRequest = {
  apartmentId: string
  checkIn: string
  checkOut: string
  guests: number
  firstName: string
  lastName: string
  email: string
  phone: string
  message?: string
  totalPrice: number
  /** Tatsächlich gezahlte Anzahlung in EUR (bei 50%-Zahlung < totalPrice). */
  depositAmount?: number
  /** Sprache des Gasts für Smoobu-Gastkommunikation (Default: de). */
  language?: 'de' | 'en'
}

export type BookingResult = {
  id: number
  referenceId?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function addDays(dateStr: string, n: number): string {
  // Durchgängig UTC: 'YYYY-MM-DD' wird als UTC geparst – lokale Arithmetik
  // (setDate/getDate) bleibt sonst in Zeitzonen östlich von UTC am Tag der
  // Sommerzeit-Umstellung hängen (addDays('2027-03-28', 1) === '2027-03-28'
  // unter Europe/Berlin → Endlosschleife in daysBetween).
  const d = new Date(dateStr)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().split('T')[0]
}

function daysBetween(start: string, end: string): string[] {
  const days: string[] = []
  let cur = start
  // Obergrenze als Notbremse gegen ungültige Eingaben (max. ~3 Jahre)
  while (cur < end && days.length < 1100) {
    days.push(cur)
    cur = addDays(cur, 1)
  }
  return days
}

// ─── Availability via Reservations ───────────────────────────────────────────

/**
 * Builds an AvailabilityMap by fetching all reservations + rates for the range.
 * Strategy:
 *  1. GET /reservations  → mark booked nights as unavailable
 *  2. GET /apartments/{id}/rates → get nightly prices (optional, graceful fallback)
 */
export async function getAvailability(
  apartmentId: string,
  startDate: string,
  endDate: string,
): Promise<AvailabilityMap> {
  const result: AvailabilityMap = {}

  // Initialise all days as available with price 0
  for (const day of daysBetween(startDate, endDate)) {
    result[day] = { available: true, price: 0, minimumStay: 1 }
  }

  // ── 1. Fetch reservations ──────────────────────────────────────────────────
  try {
    // Smoobu may paginate; fetch up to 3 pages (300 reservations) – more than enough
    let page = 1
    let hasMore = true

    while (hasMore && page <= 3) {
      const url =
        `${SMOOBU_BASE}/reservations` +
        `?apartmentId=${apartmentId}` +
        `&from=${startDate}&to=${endDate}` +
        `&pageSize=100&page=${page}`

      const res = await fetch(url, {
        headers: smoobuHeaders('GET', url),
        next: { revalidate: 300 },
      })

      if (!res.ok) break

      const json = await res.json() as {
        total_items?: number  // Smoobu uses snake_case
        page_size?: number
        bookings?: Array<{
          arrival?: string
          departure?: string
          type?: string        // "reservation" | "cancellation" | "modification of booking"
        }>
      }

      const bookings = json.bookings ?? []

      for (const booking of bookings) {
        if (!booking.arrival || !booking.departure) continue
        // Skip cancellations – those dates are free again
        if (booking.type === 'cancellation') continue
        // Block all nights: arrival (inclusive) up to departure (exclusive)
        for (const night of daysBetween(booking.arrival, booking.departure)) {
          if (result[night]) {
            result[night] = { ...result[night], available: false }
          }
        }
      }

      const fetched = page * (json.page_size ?? 100)
      hasMore = (json.total_items ?? 0) > fetched
      page++
    }
  } catch (err) {
    console.error('[Smoobu] reservations fetch failed:', err)
    // Continue – UI shows all dates as available (safe fallback)
  }

  // ── 2. Fetch rates (optional, for price display) ───────────────────────────
  try {
    const ratesUrl =
      `${SMOOBU_BASE}/apartments/${apartmentId}/rates` +
      `?startDate=${startDate}&endDate=${endDate}`

    const res = await fetch(ratesUrl, {
      headers: smoobuHeaders('GET', ratesUrl),
      next: { revalidate: 300 },
    })

    if (res.ok) {
      const json = await res.json() as {
        data?: Record<string, {
          price?: number
          minimumLength?: number
          available?: number
        }>
      }

      for (const [date, day] of Object.entries(json.data ?? {})) {
        if (result[date]) {
          if (day.price) result[date].price = day.price
          if (day.minimumLength) result[date].minimumStay = day.minimumLength
          // If rates endpoint also marks unavailability, respect it
          if (day.available === 0) result[date].available = false
        }
      }
    }
  } catch {
    // Silent – rates are optional, price fallback is used in UI
  }

  return result
}

// ─── Verify Availability ─────────────────────────────────────────────────────

export async function verifyAvailability(
  apartmentId: string,
  checkIn: string,
  checkOut: string,
): Promise<string | null> {
  const availability = await getAvailability(apartmentId, checkIn, checkOut)
  for (const night of daysBetween(checkIn, checkOut)) {
    if (!availability[night]?.available) return night
  }
  return null
}

// ─── Create Booking ───────────────────────────────────────────────────────────

export async function createBooking(req: BookingRequest): Promise<BookingResult> {
  const body = {
    apartmentId: parseInt(req.apartmentId, 10),
    arrivalDate: req.checkIn,
    departureDate: req.checkOut,
    // Ohne diese beiden Felder legt Smoobu die Buchung ohne Zeiten an, und die
    // Gästevorlagen rendern dann "Anreise: 25.10.26 ab" bzw. "Check-out bis
    // 00:00". Die Zeiten sind die Hauszeiten aus data/properties.ts (Check-in
    // ab 16:00, Check-out bis 10:00) und gelten für alle Einheiten.
    arrivalTime: CHECK_IN_TIME,
    departureTime: CHECK_OUT_TIME,
    channelId: DIRECT_CHANNEL_ID, // Kanal „Webseite" — Begründung oben an der Konstante
    firstName: req.firstName,
    lastName: req.lastName,
    email: req.email,
    phone: req.phone,
    adults: req.guests,
    children: 0,
    price: req.totalPrice,
    priceStatus: 1,
    deposit: req.depositAmount ?? req.totalPrice,
    language: req.language ?? 'de',
    guestAppMessage: req.message ?? '',
    country: 'DE',
    address: { street: 'k.A.', zip: '00000', city: 'Deutschland', country: 'DE' },
  }

  // Body EINMAL serialisieren: derselbe String wird signiert UND gesendet, sonst
  // weicht der BODY_HASH in der Signatur vom tatsächlich übertragenen Body ab.
  const url = `${SMOOBU_BASE}/reservations`
  const payload = JSON.stringify(body)
  // Timeout: bleibt Smoobu hängen, soll der Webhook noch Zeit haben, per
  // findExistingBooking nachzusehen, ob die Buchung trotzdem angelegt wurde.
  const res = await fetch(url, {
    method: 'POST',
    headers: smoobuHeaders('POST', url, payload),
    body: payload,
    signal: AbortSignal.timeout(12_000),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string; message?: string }
    throw new Error(err.detail ?? err.message ?? `Smoobu booking failed: ${res.status}`)
  }

  const json = await res.json() as { id?: number; referenceId?: string }
  return { id: json.id ?? 0, referenceId: json.referenceId }
}

// ─── Find Existing Booking ────────────────────────────────────────────────────

/**
 * Sucht eine bereits angelegte Direktbuchung für genau diesen Aufenthalt.
 *
 * Anlass (16.09.2026): Smoobu hat die Reservierung angelegt, dem Webhook aber
 * keine Erfolgsantwort geliefert. Jeder Stripe-Retry scheiterte danach mit
 * „Failed validation" (Zeitraum durch die eigene Buchung belegt) — die
 * Buchungsbestätigung an den Gast und die Meldung an uns gingen nie raus.
 * Mit dieser Suche übernimmt der Webhook die vorhandene Buchung, statt
 * sie ein zweites Mal anlegen zu wollen.
 *
 * Nie gecacht: die Antwort muss den Stand von JETZT zeigen.
 */
export async function findExistingBooking(req: {
  apartmentId: string
  checkIn: string
  checkOut: string
  email?: string
  lastName?: string
}): Promise<BookingResult | null> {
  const url =
    `${SMOOBU_BASE}/reservations` +
    `?apartmentId=${encodeURIComponent(req.apartmentId)}` +
    `&from=${req.checkIn}&to=${req.checkOut}&pageSize=100`
  const res = await fetch(url, {
    headers: smoobuHeaders('GET', url),
    cache: 'no-store',
    signal: AbortSignal.timeout(8_000),
  })
  if (!res.ok) throw new Error(`Smoobu reservations lookup failed: ${res.status}`)

  const json = await res.json() as {
    bookings?: Array<{
      id?: number
      'reference-id'?: string | null
      arrival?: string
      departure?: string
      type?: string
      email?: string | null
      'guest-name'?: string | null
      channel?: { id?: number; name?: string }
    }>
  }

  const email = (req.email ?? '').trim().toLowerCase()
  const lastName = (req.lastName ?? '').trim().toLowerCase()

  const hit = (json.bookings ?? []).find((b) => {
    if (!b.id || b.type === 'cancellation') return false
    if (b.arrival !== req.checkIn || b.departure !== req.checkOut) return false
    if (b.channel?.id !== DIRECT_CHANNEL_ID) return false
    const sameMail = !!email && (b.email ?? '').trim().toLowerCase() === email
    const sameName = !!lastName && (b['guest-name'] ?? '').toLowerCase().includes(lastName)
    return sameMail || sameName
  })

  return hit?.id ? { id: hit.id, referenceId: hit['reference-id'] ?? undefined } : null
}
