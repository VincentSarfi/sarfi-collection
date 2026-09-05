import { Suspense } from 'react'
import type { Metadata } from 'next'
import LateCheckoutWidget from '@/components/booking/LateCheckoutWidget'

// Zielseite des STATISCHEN QR-Codes in den Einheiten (Late-Checkout-Widget im
// Dashboard erzeugt die Codes). Nur mit gültigem HMAC-Token `u` nützlich,
// deshalb noindex — Laufkundschaft hat hier nichts zu sehen. Kopfzeile und
// Sprachumschalter leben im Widget (der Token muss beim Wechsel mitreisen).
export const metadata: Metadata = {
  title: 'Später auschecken oder länger bleiben · SARFI Collection',
  robots: { index: false, follow: false },
}

export default function LateCheckoutPage() {
  return (
    <main className="min-h-screen bg-cream-50 px-4 pt-28 pb-20">
      <Suspense
        fallback={<div className="mx-auto max-w-xl text-center font-body text-sm text-forest-600">Laden …</div>}
      >
        <LateCheckoutWidget />
      </Suspense>
    </main>
  )
}
