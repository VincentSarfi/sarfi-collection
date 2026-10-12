// Höhendaten (Relief) für die Lagekarte einmalig erzeugen → public/map/dem/{z}/{x}/{y}.webp
//
// Quelle: Terrain Tiles (AWS Open Data, Terrarium-Kodierung; in Europa EU-DEM von
// Copernicus – Quellenangabe steht in der Karte). Wir hosten den Ausschnitt
// Bayerischer Wald selbst, damit beim Seitenbesuch kein weiterer Drittanbieter
// geladen wird. Höhen auf ganze Meter gerundet + verlustfreies WebP: ~3 MB statt
// ~15 MB PNG. Kein prebuild-Hook – das Ergebnis liegt im Repo; nur neu laufen
// lassen, wenn sich BOUNDS oder MAX_ZOOM ändern (müssen zu components/property/
// mapStyle.ts passen).
//
//   node scripts/build-dem-tiles.mjs
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

export const BOUNDS = [12.6, 48.45, 13.9, 49.3] // W, S, E, N
const MIN_ZOOM = 6
const MAX_ZOOM = 11
const OUT_DIR = 'public/map/dem'
const SRC = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium'

const tileX = (lng, z) => Math.floor(((lng + 180) / 360) * 2 ** z)
const tileY = (lat, z) => {
  const r = (lat * Math.PI) / 180
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z)
}

async function buildTile(z, x, y) {
  const res = await fetch(`${SRC}/${z}/${x}/${y}.png`)
  if (!res.ok) throw new Error(`${z}/${x}/${y}: HTTP ${res.status}`)
  const { data, info } = await sharp(Buffer.from(await res.arrayBuffer()))
    .raw()
    .toBuffer({ resolveWithObject: true })
  // Terrarium: Höhe = R·256 + G + B/256 − 32768 → auf ganze Meter runden, B = 0
  for (let i = 0; i < data.length; i += info.channels) {
    const h = Math.round(data[i] * 256 + data[i + 1] + data[i + 2] / 256)
    data[i] = h >> 8
    data[i + 1] = h & 255
    data[i + 2] = 0
  }
  const out = path.join(OUT_DIR, String(z), String(x), `${y}.webp`)
  await fs.mkdir(path.dirname(out), { recursive: true })
  await sharp(data, { raw: info }).removeAlpha().webp({ lossless: true, effort: 6 }).toFile(out)
  return (await fs.stat(out)).size
}

const [W, S, E, N] = BOUNDS
const jobs = []
for (let z = MIN_ZOOM; z <= MAX_ZOOM; z++)
  for (let x = tileX(W, z); x <= tileX(E, z); x++)
    for (let y = tileY(N, z); y <= tileY(S, z); y++) jobs.push([z, x, y])

await fs.rm(OUT_DIR, { recursive: true, force: true })
let bytes = 0
for (let i = 0; i < jobs.length; i += 8) {
  const sizes = await Promise.all(jobs.slice(i, i + 8).map((j) => buildTile(...j)))
  bytes += sizes.reduce((a, b) => a + b, 0)
}
console.log(`${jobs.length} Kacheln, ${(bytes / 1e6).toFixed(1)} MB → ${OUT_DIR}`)
