// Custom next/image-Loader: mappt lokale Bilder auf die beim Build vorberechneten
// statischen Varianten unter /img-opt (siehe scripts/optimize-images.mjs).
// Kein on-demand-/_next/image mehr → keine sharp-CPU-Last auf der Prod-VM.
// Läuft im Browser: muss klein und deterministisch bleiben.

// Muss zu WIDTHS in scripts/optimize-images.mjs passen.
const STEPS = [384, 640, 828, 1080, 1200, 1920]

export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  // Remote-Bilder (z. B. Avatare von muscache/unsplash) unverändert durchreichen.
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  // Nicht vorberechnete lokale Pfade (z. B. SVGs) unverändert lassen.
  if (!src.startsWith('/images/')) return src
  // kleinste vorberechnete Stufe ≥ angefragter Breite (sonst größte)
  const step = STEPS.find((s) => s >= width) ?? STEPS[STEPS.length - 1]
  return `/img-opt${src}.w${step}.webp`
}
