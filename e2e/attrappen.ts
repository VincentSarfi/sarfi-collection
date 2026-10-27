// Attrappen für den E2E-Rauchtest des Buchungswegs (M45).
//
// Der Browser spricht im Test mit keinem echten Dienst: Alle Aufrufe an
// /api/** beantwortet page.route mit festen Testdaten, Cloudflare Turnstile
// ersetzt ein Stub-Skript, alles andere außerhalb des lokalen Servers
// (Stripe.js, Kartenkacheln, …) wird abgebrochen. Der lokale Next-Server
// bekommt dadurch keinen /api-Aufruf zu sehen und ruft weder Smoobu noch
// PriceLabs noch Stripe an.
import type { Page } from "@playwright/test"

export const TURNSTILE_TOKEN = "e2e-turnstile-token"

/** Bekannte Endpunkte, die der Buchungsweg aufrufen darf. */
const VERFUEGBARKEIT = "/api/smoobu/availability"
const RATEN = "/api/pricelabs/rates"
const PAYMENT_INTENT = "/api/stripe/payment-intent"

/** Heute in Berlin als YYYY-MM-DD. Der Browser läuft in derselben Zeitzone
 *  (timezoneId in playwright.config.ts), Kalender und Test zählen also gleich. */
export function heuteBerlin(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(new Date())
}

/** Datum (YYYY-MM-DD) plus n Tage. */
export function plusTage(datum: string, n: number): string {
  const d = new Date(`${datum}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().split("T")[0]
}

/** So beschriftet der Kalender einen Tag (aria-label, de-DE): 05.11.2026 */
export function kalenderTag(datum: string): string {
  const [j, m, t] = datum.split("-")
  return `${t}.${m}.${j}`
}

export interface AttrappenDaten {
  /** PriceLabs-Rate je Nacht (YYYY-MM-DD → EUR) für den gebuchten Zeitraum */
  raten: Record<string, number>
  /** Rate aller übrigen Tage */
  standardRate: number
  /** Belegte Tage laut Smoobu */
  belegt: string[]
  /** Antwort des Servers auf den payment-intent-Aufruf */
  paymentIntentAntwort: { depositAmount: number; totalAmount: number }
}

export interface Mitschnitt {
  /** Body jedes POST an /api/stripe/payment-intent */
  paymentIntent: Record<string, unknown>[]
  /** Abgefragte Smoobu-/PriceLabs-IDs */
  abgefragteIds: string[]
  /** /api-Aufrufe ohne Attrappe – müssen leer bleiben */
  unerwartet: string[]
  /** Abgebrochene externe Aufrufe (nur zur Info im Bericht) */
  blockiert: string[]
}

function lokal(url: URL): boolean {
  return url.hostname === "localhost" || url.hostname === "127.0.0.1"
}

/** Tage von start bis einschließlich ende */
function tage(start: string, ende: string): string[] {
  const liste: string[] = []
  for (let d = start; d <= ende && liste.length < 400; d = plusTage(d, 1)) liste.push(d)
  return liste
}

// Ersatz für https://challenges.cloudflare.com/turnstile/v0/api.js: meldet
// sich wie das echte Skript über den onload-Callback und löst beim Rendern
// sofort mit einem Test-Token aus.
const TURNSTILE_STUB = `
(function () {
  var zaehler = 0;
  window.turnstile = {
    render: function (el, opts) {
      var id = "e2e-" + (++zaehler);
      setTimeout(function () { if (opts && opts.callback) opts.callback(${JSON.stringify(TURNSTILE_TOKEN)}); }, 0);
      return id;
    },
    remove: function () {}, reset: function () {}, execute: function () {},
    getResponse: function () { return ${JSON.stringify(TURNSTILE_TOKEN)}; },
    isExpired: function () { return false; }
  };
  var src = document.currentScript && document.currentScript.src;
  var onload = src ? new URL(src).searchParams.get("onload") : null;
  if (onload && typeof window[onload] === "function") window[onload]();
})();
`

export async function attrappenEinrichten(page: Page, daten: AttrappenDaten): Promise<Mitschnitt> {
  const mitschnitt: Mitschnitt = { paymentIntent: [], abgefragteIds: [], unerwartet: [], blockiert: [] }

  // Alles außerhalb des lokalen Servers: Turnstile-Stub oder abbrechen.
  await page.route((url) => !lokal(url), async (route) => {
    const url = new URL(route.request().url())
    if (url.hostname === "challenges.cloudflare.com" && url.pathname === "/turnstile/v0/api.js") {
      return route.fulfill({ contentType: "application/javascript", body: TURNSTILE_STUB })
    }
    mitschnitt.blockiert.push(`${url.hostname}${url.pathname}`)
    return route.abort("blockedbyclient")
  })

  // Eigene API: feste Testdaten statt Smoobu, PriceLabs und Stripe.
  await page.route((url) => lokal(url) && url.pathname.startsWith("/api/"), async (route) => {
    const anfrage = route.request()
    const url = new URL(anfrage.url())

    if (url.pathname === VERFUEGBARKEIT && anfrage.method() === "GET") {
      mitschnitt.abgefragteIds.push(`smoobu:${url.searchParams.get("propertyId")}`)
      const belegt = new Set(daten.belegt)
      const karte: Record<string, { available: boolean; price: number; minimumStay: number }> = {}
      for (const tag of tage(url.searchParams.get("startDate")!, url.searchParams.get("endDate")!)) {
        // Smoobu-Preis absichtlich anders als PriceLabs: das Widget muss die
        // PriceLabs-Rate nehmen, sonst stimmt der Gesamtpreis nicht.
        karte[tag] = { available: !belegt.has(tag), price: 777, minimumStay: 2 }
      }
      return route.fulfill({ json: karte })
    }

    if (url.pathname === RATEN && anfrage.method() === "GET") {
      mitschnitt.abgefragteIds.push(`pricelabs:${url.searchParams.get("listingId")}`)
      const karte: Record<string, { date: string; price: number; minStay: number }> = {}
      for (const tag of tage(url.searchParams.get("startDate")!, url.searchParams.get("endDate")!)) {
        karte[tag] = { date: tag, price: daten.raten[tag] ?? daten.standardRate, minStay: 2 }
      }
      return route.fulfill({ json: karte })
    }

    if (url.pathname === PAYMENT_INTENT && anfrage.method() === "POST") {
      mitschnitt.paymentIntent.push(anfrage.postDataJSON())
      return route.fulfill({
        json: {
          clientSecret: "pi_e2e_secret_e2e",
          paymentIntentId: "pi_e2e",
          depositAmount: daten.paymentIntentAntwort.depositAmount,
          totalAmount: daten.paymentIntentAntwort.totalAmount,
        },
      })
    }

    mitschnitt.unerwartet.push(`${anfrage.method()} ${url.pathname}`)
    return route.fulfill({ status: 501, json: { error: "E2E: keine Attrappe für diesen Aufruf" } })
  })

  return mitschnitt
}
