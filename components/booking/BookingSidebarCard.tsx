"use client"

import { IconStar } from "@/components/ui/Icons"
import { getDict, localizeHref } from "@/lib/i18n"
import { useLocale } from "@/lib/i18n/LocaleProvider"

const SIDEBAR_TRUST_ICONS = ["🔒", "💬", "💰"] as const

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
  const locale = useLocale()
  const t = getDict(locale).booking
  const href = localizeHref(bookHref, locale)
  return (
    <div className="rounded-2xl border border-cream-200 shadow-[0_6px_32px_rgba(0,0,0,0.10)] p-6 bg-white">
      {/* Price + Rating */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <span className="font-body text-sm text-forest-500">{t.labels.from}</span>
          <span className="font-display text-3xl text-forest-900">{priceFrom}€</span>
          <span className="font-body text-sm text-forest-500"> {t.labels.perNight}</span>
        </div>
        {airbnbRating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <IconStar size={13} className="text-forest-900 fill-forest-900" filled />
            <span className="font-body text-sm font-semibold text-forest-900">{airbnbRating}</span>
            <span className="font-body text-xs text-forest-400">·</span>
            <a href="#bewertungen" className="font-body text-xs text-forest-400 underline hover:text-forest-600 transition-colors">
              {t.sidebarCard.reviews(airbnbReviewCount)}
            </a>
          </div>
        )}
      </div>

      {/* Date + Guest Fields */}
      <div className="rounded-xl border-2 border-forest-200 overflow-hidden mb-3 hover:border-forest-400 transition-colors">
        <div className="grid grid-cols-2 divide-x-2 divide-forest-200">
          <a href={href} className="p-3 hover:bg-cream-100 transition-colors block">
            <p className="font-body text-[10px] font-bold uppercase tracking-wider text-forest-700">{t.labels.arrival}</p>
            <p className="font-body text-sm text-forest-400 mt-0.5">{t.sidebarCard.selectDate}</p>
          </a>
          <a href={href} className="p-3 hover:bg-cream-100 transition-colors block">
            <p className="font-body text-[10px] font-bold uppercase tracking-wider text-forest-700">{t.labels.departure}</p>
            <p className="font-body text-sm text-forest-400 mt-0.5">{t.sidebarCard.selectDate}</p>
          </a>
        </div>
        <div className="border-t-2 border-forest-200 p-3">
          <p className="font-body text-[10px] font-bold uppercase tracking-wider text-forest-700">{t.labels.guests}</p>
          <p className="font-body text-sm text-forest-400 mt-0.5">{t.sidebarCard.upToGuests(maxGuests)}</p>
        </div>
      </div>

      {/* CTA */}
      <a
        href={href}
        className="block w-full text-center py-3.5 rounded-xl bg-gold-500 text-forest-900 font-body font-semibold text-base hover:bg-gold-400 active:scale-95 transition-all shadow-sm"
      >
        {t.sidebarCard.bookNow}
      </a>
      <p className="text-center font-body text-xs text-forest-400 mt-2.5">{t.labels.notCharged}</p>

      {/* Price Breakdown */}
      <div className="mt-5 pt-4 border-t border-cream-200 space-y-2.5">
        <div className="flex justify-between font-body text-sm text-forest-700">
          <span className="underline underline-offset-2 decoration-forest-300">
            {t.sidebarCard.fromTimesNights(priceFrom)}
          </span>
          <span>{t.sidebarCard.byAvailability}</span>
        </div>
        <div className="flex justify-between font-body text-sm text-forest-700">
          <span className="underline underline-offset-2 decoration-forest-300">{t.labels.cleaningFee}</span>
          <span>{cleaningFee}€</span>
        </div>
        {minStay > 1 && (
          <p className="font-body text-xs text-forest-400 pt-1">
            {t.sidebarCard.minStay(minStay)}
          </p>
        )}
      </div>

      {/* Trust */}
      <div className="mt-4 pt-4 border-t border-cream-200 flex flex-col gap-2">
        {t.sidebarCard.trust.map((text, i) => (
          <div key={SIDEBAR_TRUST_ICONS[i]} className="flex items-center gap-2.5">
            <span className="text-base">{SIDEBAR_TRUST_ICONS[i]}</span>
            <span className="font-body text-xs text-forest-500">{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
