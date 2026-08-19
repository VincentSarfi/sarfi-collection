/**
 * Geschenkgutscheine – gemeinsame Logik für Kauf-API, Webhook und Druckansicht.
 *
 * Bewusst OHNE Datenbank: Das "Register" ist Stripe selbst. Jeder verkaufte
 * Gutschein ist ein bezahlter PaymentIntent mit metadata.type = "voucher" und
 * dem Code in metadata.voucher_code – im Dashboard per Metadaten-Suche
 * auffindbar. Einlösung ist manuell (Code prüfen, PI-Metadata redeemed=ja
 * setzen); das passt zum Volumen und zur restlichen Architektur der Seite.
 *
 * Rechtliches (auf der Seite und im Gutschein abgebildet):
 * - Gültigkeit 3 Jahre ab Ende des Ausstellungsjahres (Regelverjährung § 195,
 *   § 199 BGB) – keine kürzere Befristung.
 * - Wertgutschein ohne Termin → 14 Tage Widerrufsrecht im Fernabsatz
 *   (§ 312g BGB); die Beherbergungs-Ausnahme (Abs. 2 Nr. 9) greift erst bei
 *   termingebundenen Buchungen.
 */
import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

/** Kaufbare Beträge in EUR (inklusive Grenzen). */
export const VOUCHER_MIN_EUR = 50
export const VOUCHER_MAX_EUR = 2500
/** Vorschläge auf der Seite. */
export const VOUCHER_PRESETS = [100, 200, 300, 500] as const

/** Zeichensatz ohne verwechselbare Zeichen (kein 0/O, 1/I/L). */
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

/** Gutscheincode: SC-XXXXX-XXXXX (crypto-zufällig, ~51 Bit Entropie). */
export function generateVoucherCode(): string {
  const chars = (n: number) =>
    Array.from(randomBytes(n), (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
  return `SC-${chars(5)}-${chars(5)}`
}

export function isValidVoucherAmount(eur: unknown): eur is number {
  return (
    typeof eur === 'number' &&
    Number.isInteger(eur) &&
    eur >= VOUCHER_MIN_EUR &&
    eur <= VOUCHER_MAX_EUR
  )
}

/** Letzter Gültigkeitstag: 31.12. des dritten Jahres nach Ausstellung. */
export function voucherValidUntil(issuedOn: Date = new Date()): string {
  return `31.12.${issuedOn.getFullYear() + 3}`
}

// ── Signierte Druckansicht ───────────────────────────────────────────────────
// Die Mail verlinkt auf /gutschein/karte?…&sig=…, damit nur echte Käufe eine
// darstellbare Gutschein-Karte ergeben. Secret: eigenes VOUCHER_SECRET oder
// (stabiler Fallback ohne neue Env-Var) der Stripe-Secret-Key.

function secret(): string {
  const s = process.env.VOUCHER_SECRET ?? process.env.STRIPE_SECRET_KEY
  if (!s) throw new Error('VOUCHER_SECRET/STRIPE_SECRET_KEY fehlt')
  return s
}

export type VoucherCardParams = {
  code: string
  /** Wert in EUR (ganzzahlig) */
  value: number
  /** Name des/der Beschenkten (optional, erscheint auf der Karte) */
  recipient?: string
  /** Persönliche Nachricht (optional) */
  message?: string
  /** Ausstellungsdatum als YYYY-MM-DD */
  issued: string
}

function payload(p: VoucherCardParams): string {
  return [p.code, String(p.value), p.recipient ?? '', p.message ?? '', p.issued].join('\n')
}

export function signVoucherCard(p: VoucherCardParams): string {
  return createHmac('sha256', secret()).update(payload(p)).digest('hex').slice(0, 32)
}

export function verifyVoucherCard(p: VoucherCardParams, sig: string): boolean {
  const expected = signVoucherCard(p)
  const a = Buffer.from(expected)
  const b = Buffer.from(sig)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Absolute URL der Druckansicht für die Gutschein-Mail. */
export function voucherCardUrl(p: VoucherCardParams): string {
  const q = new URLSearchParams({
    code: p.code,
    value: String(p.value),
    issued: p.issued,
    ...(p.recipient ? { recipient: p.recipient } : {}),
    ...(p.message ? { message: p.message } : {}),
    sig: signVoucherCard(p),
  })
  return `https://www.sarfi-collection.de/gutschein/karte?${q.toString()}`
}
