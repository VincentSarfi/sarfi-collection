// Firmenangaben einer Buchung („Firmenbuchung / Rechnung gewünscht") für die
// Rechnungs-Engine des Dashboards. Sie stehen als fester Block in der Smoobu-
// Notiz, weil Smoobu Firma und Anschrift am Gast nicht zuverlässig übernimmt
// (PUT verwirft sie still, beim Anlegen kommt nur die Straße an). Das Dashboard
// liest den Block deterministisch (backend/invoices/empfaenger.js, firmenblockAus)
// und stellt die Rechnung dann an die Firma aus — nur an die Firma.
//
// FORMAT NUR GEMEINSAM MIT DEM DASHBOARD ÄNDERN:
//   Firmenbuchung – Rechnung an: <Firma>
//   USt-IdNr.: <Nummer>
//   Rechnungsanschrift: <Straße> | <PLZ> | <Ort> | <Land>
// Ist das Häkchen gesetzt, aber keine Firma eingetragen (Privatgast mit
// Rechnungswunsch), lautet die erste Zeile „Rechnung gewünscht – ohne Firma".
//
// Bis 09/2026 fragte das Formular diese Felder ab, die Route verwarf sie aber —
// die Rechnung ging an die buchende Person.

export type Firmenangaben = {
  company: string
  vatId?: string
  street?: string
  zip?: string
  city?: string
  country?: string
}

// Zeilenumbrüche und das Trennzeichen „|" würden den Block zerlegen.
function feld(value: unknown, maxLen: number): string {
  return typeof value === 'string'
    ? value.replace(/[\r\n|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLen)
    : ''
}

/** Aus dem Request-Body: nur bei angehaktem „Firmenbuchung / Rechnung gewünscht".
 *  Ohne Firmennamen bleibt company leer — der Rechnungswunsch und die Anschrift
 *  gehen trotzdem mit (bis 09/2026 gingen sie in diesem Fall still verloren). */
export function firmenangabenAus(body: Record<string, unknown>): Firmenangaben | null {
  if (body.isBusinessBooking !== true) return null
  const company = feld(body.company, 200)
  return {
    company,
    vatId: feld(body.vatId, 30),
    street: feld(body.street, 200),
    zip: feld(body.zip, 10),
    city: feld(body.city, 100),
    country: feld(body.country, 60),
  }
}

export function firmenblock(f: Firmenangaben): string {
  const firma = feld(f.company, 200)
  const zeilen = [firma ? `Firmenbuchung – Rechnung an: ${firma}` : 'Rechnung gewünscht – ohne Firma']
  if (firma && f.vatId) zeilen.push(`USt-IdNr.: ${feld(f.vatId, 30)}`)
  if (f.street || f.zip || f.city) {
    zeilen.push(`Rechnungsanschrift: ${[f.street, f.zip, f.city, f.country].map(v => feld(v, 200)).join(' | ')}`)
  }
  return zeilen.join('\n')
}
