// E2E-Rauchtest des Buchungswegs (M45). Muss vor jeder Änderung am
// Buchungsweg grün sein: `npm run build && npm run e2e`.
//
// Je Fall: Buchungsseite öffnen, Anreise und Abreise im Kalender wählen,
// Gäste (und Hunde) setzen, Preis prüfen, Formular ausfüllen, bis zum
// Zahlungsschritt gehen. Geprüft werden der Preis im Buchungspanel, der
// Body des payment-intent-Aufrufs und die Beträge im Zahlungsschritt.
// Alle Preise rechnet der Test selbst aus den Testdaten (Raten aus
// e2e/attrappen.ts) und der Hauskonfiguration nach.
//
// Stripe.js ist blockiert, eine echte Zahlung findet nicht statt.
// Später bis zur Bestätigung erweitern, sobald Stripe-Testschlüssel als
// GitHub-Secrets da sind:
//   1. Im E2E-Job pk_test_… als NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY zur
//      Build-Zeit und sk_test_… als STRIPE_SECRET_KEY für `npm run start`
//      setzen, dazu Cloudflares Turnstile-Testschlüssel (Site-Key
//      1x00000000000000000000AA, Secret 1x0000000000000000000000000000000AA).
//      Mail-Schlüssel (Resend) dort nie setzen.
//   2. In attrappen.ts den payment-intent-Aufruf an den Server durchlassen
//      (route.continue()) und js.stripe.com sowie api.stripe.com nicht mehr
//      blockieren. Smoobu und PriceLabs bleiben ohne Schlüssel: Der Server
//      prüft den Preis dann gegen die priceFrom-Untergrenze und sieht alle
//      Tage als frei.
//   3. Im Payment Element die Testkarte 4242 4242 4242 4242 eingeben
//      (page.frameLocator auf das Stripe-iframe), bezahlen und
//      „Buchung eingegangen!“ erwarten. Die Smoobu-Buchung legt erst der
//      Webhook an, der im Test nicht läuft.
import { test, expect, type Locator, type Page } from "@playwright/test"
import { PROPERTY_CONFIGS, resolveSmoobuId, type PropertyBookingConfig } from "@/config/properties.config"
import { PET_FEE_PER_NIGHT } from "@/lib/pets"
import {
  TURNSTILE_TOKEN,
  attrappenEinrichten,
  heuteBerlin,
  kalenderTag,
  plusTage,
} from "./attrappen"

// Anteil der Anzahlung (lib/stripe.ts DEPOSIT_FRACTION). Nicht importiert,
// weil lib/stripe.ts den Stripe-Server-Client lädt.
const ANZAHLUNG = 0.5

const GAST = {
  firstName: "Erika",
  lastName: "Testfrau",
  email: "e2e-test@example.com",
  phone: "+49 151 00000000",
}

interface Fall {
  titel: string
  pfad: string
  /** Auf /schoenblick/buchen: Name der Apartment-Karte, die zuerst gewählt wird */
  karte?: string
  config: PropertyBookingConfig
  /** Tage ab heute bis zur Anreise, mindestens 15 (sonst keine Anzahlung).
   *  Vorlauf plus Nächte höchstens 28: dann liegen An- und Abreise immer im
   *  aktuellen oder nächsten Monat, die der Kalender ohne Blättern zeigt. */
  vorlauf: number
  /** PriceLabs-Rate je Nacht, Länge = Anzahl Nächte */
  raten: number[]
  gaeste: number
  hunde: number
  zahlung: "50" | "100"
}

const FAELLE: Fall[] = [
  {
    // 189 + 199 + 239 = 627, Aufschlag 2 × 35 € × 3 = 210, Reinigung 120
    // → 957 €, Anzahlung 479 € (478,5 aufgerundet)
    titel: "HAUS28 mit 6 Gästen (Personenaufschlag), 50 % Anzahlung",
    pfad: "/haus28/buchen",
    config: PROPERTY_CONFIGS.haus28,
    vorlauf: 21,
    raten: [189, 199, 239],
    gaeste: 6,
    hunde: 0,
    zahlung: "50",
  },
  {
    // 109 + 119 + 129 = 357, Hund 1 × 15 € × 3 = 45, Reinigung 65 → 467 €
    titel: "Apartment A2 mit Hund, Vollzahlung",
    pfad: "/schoenblick/a2/buchen",
    config: PROPERTY_CONFIGS.a2,
    vorlauf: 24,
    raten: [109, 119, 129],
    gaeste: 2,
    hunde: 1,
    zahlung: "100",
  },
  {
    // 99 + 104 = 203, Aufschlag 1 × 29 € × 2 = 58, Reinigung 65
    // → 326 €, Anzahlung 163 €
    titel: "Apartment B5 ohne Hund über die Apartment-Auswahl, 50 % Anzahlung",
    pfad: "/schoenblick/buchen",
    karte: "Apartment B5",
    config: PROPERTY_CONFIGS.b5,
    vorlauf: 18,
    raten: [99, 104],
    gaeste: 3,
    hunde: 0,
    zahlung: "50",
  },
]

/** Preis, wie ihn Widget und Server rechnen sollen – unabhängig nachgerechnet. */
function erwarteterPreis(fall: Fall) {
  const { config, raten, gaeste, hunde } = fall
  const naechte = raten.length
  const naechteSumme = raten.reduce((s, r) => s + r, 0)
  const zusatzGaeste = Math.max(0, gaeste - config.baseOccupancy)
  const aufschlag = zusatzGaeste * config.extraPersonFee * naechte
  const hundeBetrag = hunde * PET_FEE_PER_NIGHT * naechte
  const gesamt = naechteSumme + aufschlag + hundeBetrag + config.cleaningFee
  const heute = Math.round(gesamt * (fall.zahlung === "100" ? 1 : ANZAHLUNG))
  return { naechte, naechteSumme, zusatzGaeste, aufschlag, hundeBetrag, gesamt, heute }
}

const zahl = (n: number) => new Intl.NumberFormat("de-DE").format(n)
const eur = (n: number) => `${zahl(n)} €`

/** Sichtbare Zeile „Beschriftung … Betrag“ im Preispanel bzw. in der
 *  Zusammenfassung. Sichtbar, weil die Mobil-Preisliste unter dem Kalender
 *  (lg:hidden) dieselben Texte enthält. */
const zeile = (bereich: Page | Locator, beschriftung: string | RegExp) =>
  bereich.getByText(beschriftung, { exact: true }).filter({ visible: true }).locator("..")

for (const fall of FAELLE) {
  test(fall.titel, async ({ page }) => {
    const { config } = fall
    const smoobuId = resolveSmoobuId(config)
    const preis = erwarteterPreis(fall)

    const anreise = plusTage(heuteBerlin(), fall.vorlauf)
    const abreise = plusTage(anreise, fall.raten.length)
    const belegt = plusTage(anreise, -1)
    const raten = Object.fromEntries(fall.raten.map((r, i) => [plusTage(anreise, i), r]))

    const mitschnitt = await attrappenEinrichten(page, {
      raten,
      standardRate: 150,
      belegt: [belegt],
      paymentIntentAntwort: { depositAmount: preis.heute, totalAmount: preis.gesamt },
    })

    // ── Seite öffnen ──
    await page.goto(fall.pfad)
    if (fall.karte) {
      await page.getByRole("button", { name: new RegExp(fall.karte) }).click()
    }

    // ── Kalender: Raten geladen, belegter Tag gesperrt ──
    const anreiseKnopf = page.getByRole("button", { name: kalenderTag(anreise), exact: true })
    await expect(anreiseKnopf).toContainText(`${fall.raten[0]}€`)
    await expect(
      page.getByRole("button", { name: `${kalenderTag(belegt)} (belegt) (nicht verfügbar)` }),
    ).toBeDisabled()

    await anreiseKnopf.click()
    await page.getByRole("button", { name: kalenderTag(abreise), exact: true }).click()

    // ── Gäste und Hunde im Buchungspanel ──
    await page.getByRole("button", { name: /^Gäste/ }).click()
    for (let g = 2; g < fall.gaeste; g++) {
      await page.getByRole("button", { name: "Mehr Gäste" }).click()
    }
    if (config.petsAllowed) {
      for (let h = 0; h < fall.hunde; h++) {
        await page.getByRole("button", { name: "Mehr Hunde" }).click()
      }
    } else {
      await expect(page.getByRole("button", { name: "Mehr Hunde" })).toHaveCount(0)
    }
    const gaesteText = `${fall.gaeste} Gäste${fall.hunde ? ` · ${fall.hunde === 1 ? "1 Hund" : `${fall.hunde} Hunde`}` : ""}`
    await expect(page.getByRole("button", { name: /^Gäste/ })).toContainText(gaesteText)
    await page.getByRole("button", { name: "Schließen", exact: true }).click()

    // ── Preis: Nächte, Personenaufschlag, Hunde, Reinigung, Gesamt ──
    const naechteText = `${zahl(Math.round(preis.naechteSumme / preis.naechte))} € × ${preis.naechte} Nächte`
    await expect(zeile(page, naechteText)).toContainText(eur(preis.naechteSumme))
    const aufschlagZeile = zeile(page, /^Personenaufschlag \(/)
    if (preis.aufschlag > 0) {
      await expect(aufschlagZeile).toContainText(
        `${preis.zusatzGaeste} ${preis.zusatzGaeste === 1 ? "Person" : "Personen"} × ${config.extraPersonFee} € × ${preis.naechte} Nächte`,
      )
      await expect(aufschlagZeile).toContainText(eur(preis.aufschlag))
    } else {
      await expect(aufschlagZeile).toHaveCount(0)
    }
    const hundeZeile = zeile(page, /^\d Hunde? × /)
    if (preis.hundeBetrag > 0) {
      await expect(hundeZeile).toContainText(`${fall.hunde} Hund × ${PET_FEE_PER_NIGHT} € × ${preis.naechte} Nächte`)
      await expect(hundeZeile).toContainText(eur(preis.hundeBetrag))
    } else {
      await expect(hundeZeile).toHaveCount(0)
    }
    await expect(zeile(page, "Reinigungsgebühr")).toContainText(eur(config.cleaningFee))
    await expect(zeile(page, "Gesamt")).toContainText(eur(preis.gesamt))

    // ── Formular ──
    await page.getByRole("button", { name: "Weiter zur Buchung →" }).click()
    await page.locator('input[name="firstName"]').fill(GAST.firstName)
    await page.locator('input[name="lastName"]').fill(GAST.lastName)
    await page.locator('input[name="email"]').fill(GAST.email)
    await page.locator('input[name="phone"]').fill(GAST.phone)
    if (fall.zahlung === "100") {
      await page.getByRole("button", { name: /^100% Vollzahlung/ }).click()
    }
    await expect(page.getByRole("button", { name: /^50% Anzahlung/ })).toContainText(
      `${zahl(Math.round(preis.gesamt * ANZAHLUNG))} € jetzt`,
    )

    // Turnstile-Attrappe liefert das Token, erst dann wird der Knopf aktiv.
    const weiter = page.getByRole("button", { name: "Weiter zur Zahlung", exact: true })
    await expect(weiter).toBeEnabled()
    await weiter.click()

    // ── payment-intent: was der Server zum Abbuchen bekommt ──
    await expect.poll(() => mitschnitt.paymentIntent.length).toBe(1)
    expect(mitschnitt.paymentIntent[0]).toMatchObject({
      apartmentId: smoobuId,
      propertyName: config.name,
      checkIn: anreise,
      checkOut: abreise,
      guests: fall.gaeste,
      pets: fall.hunde,
      totalPrice: preis.gesamt,
      paymentOption: fall.zahlung,
      firstName: GAST.firstName,
      lastName: GAST.lastName,
      email: GAST.email,
      phone: GAST.phone,
      isBusinessBooking: false,
      turnstileToken: TURNSTILE_TOKEN,
      locale: "de",
    })

    // ── Zahlungsschritt: Zusammenfassung und Betrag ──
    const ueberschrift = page.getByRole("heading", {
      name: fall.zahlung === "100" ? "Vollzahlung" : "Anzahlung",
      exact: true,
    })
    await expect(ueberschrift).toBeVisible()
    const zusammenfassung = ueberschrift.locator("..")
    await expect(zeile(zusammenfassung, "Unterkunft")).toContainText(config.name)
    await expect(zeile(zusammenfassung, "Anreise")).toContainText(kalenderTag(anreise))
    await expect(zeile(zusammenfassung, "Abreise")).toContainText(kalenderTag(abreise))
    await expect(zeile(zusammenfassung, "Gäste")).toContainText(
      `${fall.gaeste}${fall.hunde ? ` · ${fall.hunde === 1 ? "1 Hund" : `${fall.hunde} Hunde`}` : ""}`,
    )
    await expect(zeile(zusammenfassung, "Gesamtpreis")).toContainText(eur(preis.gesamt))
    await expect(
      zeile(zusammenfassung, fall.zahlung === "100" ? "Vollzahlung heute (100%)" : "Anzahlung heute (50%)"),
    ).toContainText(eur(preis.heute))
    if (fall.zahlung === "50") {
      await expect(page.getByText(/Den Restbetrag von/)).toContainText(
        `50% Anzahlung (${eur(preis.heute)}). Den Restbetrag von ${eur(preis.gesamt - preis.heute)}`,
      )
    }
    await expect(
      page.getByRole("button", {
        name: `${zahl(preis.heute)} € ${fall.zahlung === "100" ? "jetzt bezahlen" : "jetzt anzahlen"}`,
      }),
    ).toBeVisible()

    // ── Keine Aufrufe am Mock vorbei ──
    expect(mitschnitt.unerwartet).toEqual([])
    expect(new Set(mitschnitt.abgefragteIds)).toEqual(new Set([`smoobu:${smoobuId}`, `pricelabs:${smoobuId}`]))
    test.info().annotations.push({
      type: "blockiert",
      description: [...new Set(mitschnitt.blockiert)].join(", ") || "nichts",
    })
  })
}
