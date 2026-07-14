import { Suspense } from 'react'
import type { Metadata } from 'next'
import RechnungForm from '@/components/booking/RechnungForm'

export const metadata: Metadata = {
  title: 'Rechnung anfordern · SARFI Collection',
  robots: { index: false, follow: false },
}

export default function RechnungPage() {
  return (
    <main className="min-h-screen bg-[#ede8df] py-16 px-4">
      <Suspense fallback={<div className="max-w-xl mx-auto text-center text-[#4a5568]">Laden …</div>}>
        <RechnungForm />
      </Suspense>
    </main>
  )
}
