/**
 * Buchungsfenster – wie weit im Voraus gebucht werden kann.
 *
 * PriceLabs liefert dynamische Raten nur rund ein Jahr im Voraus. Dahinter
 * rechnen Client (calcPrice) und Server (computeExpectedPrice) mangels Raten
 * mit `priceFrom`, und die Serverprüfung akzeptiert dort sogar den halben
 * `priceFrom` als Untergrenze (FALLBACK_FLOOR_FACTOR) – Buchungen jenseits des
 * Fensters wären also systematisch zu billig. Deshalb endet die Verfügbarkeit
 * hier hart: Kalender, Verfügbarkeits-/Raten-APIs und Buchungsstrecke lesen
 * alle dieselbe Grenze.
 */

/** Buchbarer Vorlauf in Tagen (heute + N = letzter buchbarer Tag). */
export const BOOKING_WINDOW_DAYS = 365

/** Heutiges Datum in der Zeitzone der Unterkunft als YYYY-MM-DD. */
export function todayBerlin(): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin' }).format(new Date())
}

/**
 * Letzter buchbarer Tag (inklusive) als YYYY-MM-DD. Der Aufenthalt muss
 * vollständig innerhalb des Fensters liegen – auch die Abreise.
 */
export function bookingWindowEnd(from: string = todayBerlin()): string {
  const d = new Date(`${from}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + BOOKING_WINDOW_DAYS)
  return d.toISOString().split('T')[0]
}

/** true, wenn das Datum (YYYY-MM-DD) noch im Buchungsfenster liegt. */
export function isWithinBookingWindow(date: string): boolean {
  return date <= bookingWindowEnd()
}

/**
 * Client-Variante für den Kalender: letzter buchbarer Tag als lokales Date
 * (Mitternacht), passend zu den lokalen Date-Objekten im BookingCalendar.
 */
export function bookingWindowEndDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + BOOKING_WINDOW_DAYS)
}
