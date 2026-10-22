import crypto from 'crypto'

// Signierter Self-Service-Rechnungslink. Muss zum Dashboard (backend/invoices/link.js)
// passen: gleicher HMAC-Algorithmus + gleiches INVOICE_LINK_SECRET (im Dashboard und in Sliplane für die Website).

// Muss zum Dashboard (backend/invoices/link.js) passen: gleiches INVOICE_LINK_SECRET,
// kein unsicherer Fallback. Ohne Secret wird kein Token erzeugt (Link ohne gültigen t).
function secret(): string {
  return process.env.INVOICE_LINK_SECRET || process.env.JWT_SECRET || ''
}

const TAG_S = 86400
// Wie link() im Dashboard: gültig bis sieben Tage nach der Abreise, mindestens
// sieben Tage ab Versand; ohne Abreise 30 Tage.
const NACH_ABREISE_TAGE = 7
const MIN_TAGE = 7
const OHNE_ABREISE_TAGE = 30

function hmac(msg: string): string {
  return crypto.createHmac('sha256', secret()).update(msg).digest('hex').slice(0, 24)
}

/** Ablauf in Unix-Sekunden, berechnet wie im Dashboard. */
function ablauf(abreise?: string): number {
  const jetzt = Math.floor(Date.now() / 1000)
  const abreiseMs = abreise ? Date.parse(`${abreise.slice(0, 10)}T23:59:59Z`) : NaN
  return Number.isFinite(abreiseMs)
    ? Math.max(Math.floor(abreiseMs / 1000) + NACH_ABREISE_TAGE * TAG_S, jetzt + MIN_TAGE * TAG_S)
    : jetzt + OHNE_ABREISE_TAGE * TAG_S
}

/**
 * Token im Format "<exp>.<hmac(resId.exp)>" – der Ablauf reist im Token mit
 * und ist mitsigniert. Früher erzeugte die Website Tokens ohne Ablauf, die
 * unbegrenzt galten; die nimmt das Dashboard nur noch übergangsweise an.
 */
export function invoiceToken(resId: string | number, abreise?: string): string {
  if (!secret()) return ''
  const exp = ablauf(abreise)
  return `${exp}.${hmac(`${resId}.${exp}`)}`
}

export function invoiceLink(resId: string | number, abreise?: string): string | null {
  if (!secret()) return null // ohne Secret keinen (ungültigen) Link erzeugen
  const base = process.env.SELF_SERVICE_BASE || 'https://www.sarfi-collection.de/rechnung'
  return `${base}?res=${encodeURIComponent(String(resId))}&t=${encodeURIComponent(invoiceToken(resId, abreise))}`
}
