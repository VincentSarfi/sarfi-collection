import { Suspense } from 'react'
import type { Metadata } from 'next'
import MeldescheinWidget from '@/components/booking/MeldescheinWidget'

// Digitaler Meldeschein (§ 29 Abs. 5 BMG): Zielseite des Links aus der
// Smoobu-Gästenachricht (?b=…) bzw. des QR-Codes in der Einheit (?u=…). Ohne
// gültigen Token nutzlos, deshalb noindex. Die Logik lebt im Dashboard, diese
// Seite redet nur mit dem Proxy unter /api/meldeschein.
export const metadata: Metadata = {
  title: 'Meldeschein · SARFI Collection',
  robots: { index: false, follow: false },
}

export default function MeldescheinPage() {
  return (
    <main className="min-h-screen bg-cream-50 px-4 pt-28 pb-20">
      <Suspense
        fallback={<div className="mx-auto max-w-xl text-center font-body text-sm text-forest-600">Laden …</div>}
      >
        <MeldescheinWidget />
      </Suspense>
    </main>
  )
}
