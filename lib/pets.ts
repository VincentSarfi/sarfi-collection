// Hunde direkt mitbuchen (Haus Schönblick, nur Apartments mit robustem Boden –
// welche, steht als `petsAllowed` in config/properties.config.ts).
//
// Eine Stelle für Widget, Preisprüfung und Smoobu-Notiz, damit Aufpreis und
// Notizzeile nie auseinanderlaufen. Gebühr und Höchstzahl kommen aus
// data/surroundings.ts, wo auch die Texte (Hausregeln, FAQ) sie lesen.
import { PET_FEE_PER_NIGHT, PET_MAX } from '@/data/surroundings'

export { PET_FEE_PER_NIGHT, PET_MAX }

/** Hundeaufpreis eines Aufenthalts in EUR. */
export function petTotal(pets: number, nights: number): number {
  return pets * PET_FEE_PER_NIGHT * nights
}

/**
 * Hundezahl aus einem Request-Wert. Fehlt sie (Alt-Clients, HAUS28), sind es 0.
 * null = ungültig: keine ganze Zahl, über PET_MAX oder Hunde in einer
 * Unterkunft, die keine erlaubt.
 */
export function parsePets(value: unknown, petsAllowed: boolean): number | null {
  if (value === undefined || value === null || value === 0) return 0
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > PET_MAX) return null
  return petsAllowed ? value : null
}

/**
 * Zeile für die Smoobu-Notiz, z. B. „Hunde: 1 × 15 € × 3 Nächte = 45 €".
 * Die Rechnungs-Engine des Dashboards liest sie (backend/invoices/hunde.js)
 * und weist den Betrag als eigene Rechnungsposition aus.
 *
 * FORMAT NUR GEMEINSAM MIT DEM DASHBOARD ÄNDERN.
 */
export function hundeZeile(pets: number, nights: number): string {
  return `Hunde: ${pets} × ${PET_FEE_PER_NIGHT} € × ${nights} ${nights === 1 ? 'Nacht' : 'Nächte'} = ${petTotal(pets, nights)} €`
}
