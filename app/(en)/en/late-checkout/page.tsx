import { Suspense } from 'react'
import type { Metadata } from 'next'
import LateCheckoutWidget from '@/components/booking/LateCheckoutWidget'

// English twin of /late-checkout — same widget, locale comes from the (en)
// layout's LocaleProvider. The QR code lands on the German page; the widget's
// own language switch carries the token over to this one.
export const metadata: Metadata = {
  title: 'Late checkout or stay longer · SARFI Collection',
  robots: { index: false, follow: false },
}

export default function EnglishLateCheckoutPage() {
  return (
    <main className="min-h-screen bg-cream-50 px-4 pt-28 pb-20">
      <Suspense
        fallback={<div className="mx-auto max-w-xl text-center font-body text-sm text-forest-600">Loading …</div>}
      >
        <LateCheckoutWidget />
      </Suspense>
    </main>
  )
}
