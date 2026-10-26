// Kopiert den Web-Worker von MapLibre (ab v6 reines ESM) nach public/maplibre/.
// Turbopack macht aus new URL(..., import.meta.url) zwar ein Asset, lässt aber
// das Geschwister-Modul maplibre-gl-shared.mjs weg – der Worker scheitert dann
// am ersten Import und die Karte lädt keine Kacheln. Darum beide Dateien selbst
// ausliefern (Vorgehen laut MapLibre-Doku, Abschnitt Turbopack). Läuft als
// "prebuild"/"predev"-Hook, also immer passend zur installierten Version.
// Gegenstück: setWorkerUrl in components/property/PlaceMap.tsx.
import { copyFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const dist = path.join(path.dirname(createRequire(import.meta.url).resolve('maplibre-gl/package.json')), 'dist')
const dest = path.join(process.cwd(), 'public', 'maplibre')

mkdirSync(dest, { recursive: true })
for (const file of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) {
  copyFileSync(path.join(dist, file), path.join(dest, file))
}
