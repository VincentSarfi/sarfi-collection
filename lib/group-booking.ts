/**
 * Gruppenbuchung Haus Schönblick – geteilte, reine Logik.
 *
 * Client (GroupBookingWidget) und Server (group-payment-intent, Webhook)
 * rechnen mit denselben Funktionen, damit Anzeige, Preisprüfung und
 * Smoobu-Buchungen nie auseinanderlaufen. Hier stehen bewusst KEINE
 * API-Aufrufe – nur Verteilung, Kombination und Summen.
 */

import { PROPERTY_CONFIGS, type PropertyBookingConfig } from '@/config/properties.config'

/** IDs der Schönblick-Apartments, die gemeinsam buchbar sind. */
export const GROUP_APARTMENT_IDS = ['b5', 'b6', 'b7', 'b8', 'a2'] as const
export type GroupApartmentId = (typeof GROUP_APARTMENT_IDS)[number]

export const GROUP_MIN_GUESTS = 5
export const GROUP_MAX_GUESTS = GROUP_APARTMENT_IDS
  .reduce((sum, id) => sum + PROPERTY_CONFIGS[id].maxGuests, 0) // 20

export function isGroupApartmentId(id: string): id is GroupApartmentId {
  return (GROUP_APARTMENT_IDS as readonly string[]).includes(id)
}

export function groupConfigs(): PropertyBookingConfig[] {
  return GROUP_APARTMENT_IDS.map((id) => PROPERTY_CONFIGS[id])
}

/**
 * Verteilt Gäste deterministisch auf die gewählten Apartments:
 * erst jedes Apartment bis baseOccupancy füllen, dann reihum bis maxGuests.
 * Reihenfolge = übergebene Apartment-Reihenfolge (stabil sortiert nach id),
 * damit Client und Server identisch verteilen.
 * Liefert null, wenn die Gäste nicht hineinpassen.
 */
export function distributeGuests(
  apartmentIds: string[],
  guests: number,
): Record<string, number> | null {
  const ids = [...apartmentIds].sort()
  const caps = ids.map((id) => PROPERTY_CONFIGS[id]?.maxGuests ?? 0)
  const base = ids.map((id) => PROPERTY_CONFIGS[id]?.baseOccupancy ?? 0)
  const totalCap = caps.reduce((a, b) => a + b, 0)
  if (guests < 1 || guests > totalCap || ids.length === 0) return null

  const result: Record<string, number> = {}
  let remaining = guests

  // 1. Grundbelegung
  ids.forEach((id, i) => {
    const take = Math.min(base[i], remaining)
    result[id] = take
    remaining -= take
  })
  // 2. Rest reihum auf freie Plätze
  let idx = 0
  while (remaining > 0) {
    const id = ids[idx % ids.length]
    const i = idx % ids.length
    if (result[id] < caps[i]) {
      result[id]++
      remaining--
    }
    idx++
    if (idx > 1000) return null // Sicherheitsnetz, sollte nie greifen
  }
  // Jedes gewählte Apartment braucht mindestens 1 Gast – sonst stünde in
  // Smoobu eine Buchung mit 0 Personen.
  for (const id of ids) {
    if (result[id] === 0) {
      // Von den vollsten nehmen
      const donor = ids.find((d) => result[d] > (PROPERTY_CONFIGS[d]?.baseOccupancy ?? 1))
        ?? ids.find((d) => result[d] > 1)
      if (!donor) return null
      result[donor]--
      result[id]++
    }
  }
  return result
}

/** Kapazität einer Apartment-Auswahl. */
export function capacityOf(apartmentIds: string[]): number {
  return apartmentIds.reduce((sum, id) => sum + (PROPERTY_CONFIGS[id]?.maxGuests ?? 0), 0)
}

export type ApartmentQuote = {
  id: string
  name: string
  guests: number
  nightlyTotal: number
  extraPersonTotal: number
  cleaningFee: number
  total: number
  /** true, wenn für alle Nächte dynamische Raten vorlagen */
  hadFullRates: boolean
}

export type GroupQuote = {
  nights: number
  apartments: ApartmentQuote[]
  total: number
}

/**
 * Preis einer Apartment-Auswahl für einen Aufenthalt. `rateMaps` liefert je
 * Apartment-ID die Nachtpreise (YYYY-MM-DD → EUR); fehlende Nächte fallen auf
 * priceFrom zurück – identisch zur Einzelbuchung (calcPrice/computeExpectedPrice).
 */
export function quoteGroup(
  apartmentIds: string[],
  guestsByApartment: Record<string, number>,
  nightsKeys: string[],
  rateMaps: Record<string, Record<string, number>>,
): GroupQuote {
  const nights = nightsKeys.length
  const apartments: ApartmentQuote[] = [...apartmentIds].sort().map((id) => {
    const cfg = PROPERTY_CONFIGS[id]
    const rates = rateMaps[id] ?? {}
    let nightlyTotal = 0
    let ratedNights = 0
    for (const key of nightsKeys) {
      const r = rates[key]
      if (r && r > 0) {
        nightlyTotal += r
        ratedNights++
      } else {
        nightlyTotal += cfg.priceFrom
      }
    }
    const guests = guestsByApartment[id] ?? 0
    const extraGuests = Math.max(0, guests - cfg.baseOccupancy)
    const extraPersonTotal = extraGuests * cfg.extraPersonFee * nights
    const total = Math.round(nightlyTotal + extraPersonTotal + cfg.cleaningFee)
    return {
      id,
      name: cfg.name,
      guests,
      nightlyTotal: Math.round(nightlyTotal),
      extraPersonTotal,
      cleaningFee: cfg.cleaningFee,
      total,
      hadFullRates: ratedNights === nights,
    }
  })
  return {
    nights,
    apartments,
    total: apartments.reduce((sum, a) => sum + a.total, 0),
  }
}

/**
 * Empfohlene Kombination: so wenige Apartments wie nötig, davon die
 * günstigsten (nach Nachtpreissumme + Reinigung). `availableIds` sind die
 * für den kompletten Aufenthalt freien Apartments.
 */
export function suggestCombination(
  availableIds: string[],
  guests: number,
  nightsKeys: string[],
  rateMaps: Record<string, Record<string, number>>,
): string[] | null {
  if (capacityOf(availableIds) < guests) return null
  // Günstigste zuerst (Basispreis ohne Extra-Personen – die sind überall gleich)
  const byPrice = [...availableIds].sort((a, b) => {
    const cost = (id: string) => {
      const cfg = PROPERTY_CONFIGS[id]
      const rates = rateMaps[id] ?? {}
      let t = cfg.cleaningFee
      for (const key of nightsKeys) t += rates[key] && rates[key] > 0 ? rates[key] : cfg.priceFrom
      return t
    }
    return cost(a) - cost(b) || a.localeCompare(b)
  })
  const picked: string[] = []
  for (const id of byPrice) {
    picked.push(id)
    if (capacityOf(picked) >= guests) return picked.sort()
  }
  return null
}
