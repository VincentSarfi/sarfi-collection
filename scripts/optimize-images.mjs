// Erzeugt beim Build alle responsive Bild-Varianten statisch vor (WebP, feste
// Breiten-Stufen) → public/img-opt/. Zur Laufzeit liefert der Server nur noch
// statische Dateien aus — kein on-demand-sharp auf der kleinen Prod-VM mehr.
// Läuft als "prebuild"-Hook automatisch vor `next build` (auch im Docker-Build
// auf Sliplanes großen Build-Servern). Gegenstück: lib/imageLoader.ts.
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SRC_DIR = 'public/images'
const OUT_DIR = 'public/img-opt'
// Muss zu images.deviceSizes/imageSizes in next.config.ts und zur Stufen-Liste
// in lib/imageLoader.ts passen.
export const WIDTHS = [384, 640, 828, 1080, 1200, 1920]
const QUALITY = 78
const EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png'])
const CONCURRENCY = 8

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(p)
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) yield p
  }
}

async function processImage(srcPath) {
  const rel = path.relative('public', srcPath) // images/…/foo.webp
  const meta = await sharp(srcPath).metadata()
  // EXIF-Orientierung 5–8 = um 90° gedreht gespeichert → wirksame Breite ist
  // die physische Höhe (rotate() unten richtet das Bild entsprechend auf).
  const rotated = (meta.orientation ?? 1) >= 5
  const srcW = (rotated ? meta.height : meta.width) ?? 1920
  let made = 0
  for (const w of WIDTHS) {
    const outPath = path.join(OUT_DIR, `${rel}.w${w}.webp`)
    // Nur (re-)erzeugen, wenn Quelle neuer ist — macht lokale Re-Builds billig.
    try {
      const [s, o] = await Promise.all([fs.stat(srcPath), fs.stat(outPath)])
      if (o.mtimeMs >= s.mtimeMs) continue
    } catch { /* Variante fehlt → erzeugen */ }
    await fs.mkdir(path.dirname(outPath), { recursive: true })
    // Nie hochskalieren: kleinere Quellen behalten ihre Breite, der Dateiname
    // bleibt trotzdem .w<stufe>. — der Loader kennt so immer einen gültigen Pfad.
    await sharp(srcPath)
      // EXIF-Orientierung anwenden – beim Neukodieren gehen die EXIF-Daten
      // verloren; ohne rotate() landen solche Bilder gedreht im Output.
      .rotate()
      .resize({ width: Math.min(w, srcW), withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath)
    made++
  }
  return made
}

const files = []
for await (const f of walk(SRC_DIR)) files.push(f)

const t0 = Date.now()
let done = 0, generated = 0
// simpler Concurrency-Pool
const queue = [...files]
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    for (;;) {
      const f = queue.shift()
      if (!f) return
      try {
        generated += await processImage(f)
      } catch (e) {
        console.error(`✗ ${f}: ${e.message}`)
        process.exitCode = 1
      }
      done++
    }
  })
)
console.log(
  `img-opt: ${done} Quellbilder, ${generated} Varianten erzeugt/aktualisiert in ${((Date.now() - t0) / 1000).toFixed(1)}s`
)
