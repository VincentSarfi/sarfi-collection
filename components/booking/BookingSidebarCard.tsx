"use client"

import { IconStar } from "@/components/ui/Icons"

interface BookingSidebarCardProps {
  priceFrom: number
  maxGuests: number
  minStay: number
  cleaningFee: number
  airbnbRating: number
  airbnbReviewCount: number
  bookHref: string
}

export default function BookingSidebarCard({
  priceFrom,
  maxGuests,
  minStay,
  cleaningFee,
  airbnbRating,
  airbnbReviewCount,
  bookHref,
}: BookingSidebarCardProps) {
  return (
    <div className="rounded-2xl border border-cream-200 shadow-[0_6px_32px_rgba(0,0,0,0.10)] p-6 bg-white">
      {/* Price + Rating */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <span className="font-body text-sm text-forest-500">ab </span>
          <span className="font-display text-3xl text-forest-900">{priceFrom}€</span>
          <span className="font-body text-sm text-forest-500"> / Nacht</span>
        </div>
        {airbnbRating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <IconStar size={13} className="text-forest-900 fill-forest-900" filled />
            <span className="font-body text-sm font-semibold text-forest-900">{airbnbRating}</span>
            <span className="font-body text-xs text-forest-400">·</span>
            <a href="#bewertungen" className="font-body text-xs text-forest-400 underline hover:text-forest-600 transition-colors">
              {airbnbReviewCount} Bewertungen
            </a>
          </div>
        )}
      </div>

      {/* Date + Guest Fields */}
      <div className="rounded-xl border-2 border-forest-200 overflow-hidden mb-3 hover:border-forest-400 transition-colors">
        <div className="grid grid-cols-2 divide-x-2 divide-forest-200">
          <a href={bookHref} className="p-3 hover:bg-cream-100 transition-colors block">
            <p className="font-body text-[10px] font-bold uppercase tracking-wider text-forest-700">Anreise</p>
            <p className="font-body text-sm text-forest-400 mt-0.5">Datum wählen</p>
          </a>
          <a href={bookHref} className="p-3 hover:bg-cream-100 transition-colors block">
            <p className="font-body text-[10px] font-bold uppercase tracking-wider text-forest-700">Abreise</p>
            <p className="font-body text-sm text-forest-400 mt-0.5">Datum wählen</p>
          </a>
        </div>
        <div className="border-t-2 border-forest-200 p-3">
          <p className="font-body text-[10px] font-bold uppercase tracking-wider text-forest-700">Gäste</p>
          <p className="font-body text-sm text-forest-400 mt-0.5">bis {maxGuests} Gäste</p>
        </div>
      </div>

      {/* CTA */}
      <a
        href={bookHref}
        className="block w-full text-center py-3.5 rounded-xl bg-gold-500 text-forest-900 font-body font-semibold text-base hover:bg-gold-400 active:scale-95 transition-all shadow-sm"
      >
        Jetzt buchen
      </a>
      <p className="text-center font-body text-xs text-forest-400 mt-2.5">Du wirst noch nicht belastet</p>

      {/* Price Breakdown */}
      <div className="mt-5 pt-4 border-t border-cream-200 space-y-2.5">
        <div className="flex justify-between font-body text-sm text-forest-700">
          <span className="underline underline-offset-2 decoration-forest-300">
            ab {priceFrom}€ × Anzahl Nächte
          </span>
          <span>je nach Verfügbarkeit</span>
        </div>
        <div className="flex justify-between font-body text-sm text-forest-700">
          <span className="underline underline-offset-2 decoration-forest-300">Reinigungsgebühr</span>
          <span>{cleaningFee}€</span>
        </div>
        {minStay > 1 && (
          <p className="font-body text-xs text-forest-400 pt-1">
            Mindestaufenthalt: {minStay} Nächte
          </p>
        )}
      </div>

      {/* Trust */}
      <div className="mt-4 pt-4 border-t border-cream-200 flex flex-col gap-2">
        {[
          { icon: "🔒", text: "Sichere, SSL-verschlüsselte Zahlung" },
          { icon: "💬", text: "Persönliche Betreuung direkt vom Gastgeber" },
          { icon: "💰", text: "Bis zu 20 % günstiger als auf gängigen Buchungsportalen" },
        ].map((item) => (
          <div key={item.icon} className="flex items-center gap-2.5">
            <span className="text-base">{item.icon}</span>
            <span className="font-body text-xs text-forest-500">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
