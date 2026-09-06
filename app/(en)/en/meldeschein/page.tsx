import { Suspense } from 'react'
import type { Metadata } from 'next'
import MeldescheinWidget from '@/components/booking/MeldescheinWidget'

// English twin of /meldeschein — same widget, locale from the (en) layout.
// Guest links for English-speaking bookings point here directly.
export const metadata: Metadata = {
  title: 'Registration form · SARFI Collection',
  robots: { index: false, follow: false },
}

export default function EnglishMeldescheinPage() {
  return (
    <main className="min-h-screen bg-cream-50 px-4 pt-28 pb-20">
      <Suspense
        fallback={<div className="mx-auto max-w-xl text-center font-body text-sm text-forest-600">Loading …</div>}
      >
        <MeldescheinWidget />
      </Suspense>
    </main>
  )
}
