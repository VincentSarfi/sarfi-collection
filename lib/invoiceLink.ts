import crypto from 'crypto'

// Signierter Self-Service-Rechnungslink. Muss zum Dashboard (backend/invoices/link.js)
// passen: gleicher HMAC-Algorithmus + gleiches INVOICE_LINK_SECRET (Railway + Vercel).

// Muss zum Dashboard (backend/invoices/link.js) passen: gleiches INVOICE_LINK_SECRET,
// kein unsicherer Fallback. Ohne Secret wird kein Token erzeugt (Link ohne gültigen t).
function secret(): string {
  return process.env.INVOICE_LINK_SECRET || process.env.JWT_SECRET || ''
}

export function invoiceToken(resId: string | number): string {
  const s = secret()
  if (!s) return ''
  return crypto.createHmac('sha256', s).update(String(resId)).digest('hex').slice(0, 24)
}

export function invoiceLink(resId: string | number): string | null {
  if (!secret()) return null // ohne Secret keinen (ungültigen) Link erzeugen
  const base = process.env.SELF_SERVICE_BASE || 'https://www.sarfi-collection.de/rechnung'
  return `${base}?res=${encodeURIComponent(String(resId))}&t=${invoiceToken(resId)}`
}
