import { defineConfig, devices } from "@playwright/test"

// E2E-Rauchtest des Buchungswegs (M45), Tests unter e2e/.
// Läuft gegen den Produktions-Build: erst `npm run build`, dann `npm run e2e`.
// Der Browser spricht dabei mit keinem echten Dienst (siehe e2e/attrappen.ts).
// Lokal startet Google Chrome aus /Applications (channel "chrome"), in CI das
// mit `npx playwright install --with-deps chromium` installierte Chromium.
const PORT = 3210

export default defineConfig({
  testDir: "./e2e",
  // Ein Browser nach dem anderen: schont Rechner und Chrome-Sperre, drei
  // Fälle brauchen keine Parallelität.
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: "de-DE",
    // Gleiche Zeitzone wie die Unterkunft: Kalender, Anzahlungsregel und Test
    // zählen dieselben Tage (e2e/attrappen.ts heuteBerlin).
    timezoneId: "Europe/Berlin",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], channel: process.env.CI ? undefined : "chrome" },
    },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}/robots.txt`,
    // Nie einen fremden Server auf dem Port mittesten.
    reuseExistingServer: false,
    timeout: 60_000,
  },
})
