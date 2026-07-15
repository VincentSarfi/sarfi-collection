import Link from "next/link"
import { schoenblick } from "@/data/properties"
import BookingWidget from "@/components/booking/BookingWidget"
import { PROPERTY_CONFIGS, resolveSmoobuId } from "@/config/properties.config"
import { IconArrowRight, IconStar } from "@/components/ui/Icons"
import { getDict, localizeHref, type Locale } from "@/lib/i18n"

export type SchoenblickApartmentId = "a2" | "b5" | "b6" | "b7" | "b8"

/** Gemeinsamer Seiteninhalt der Apartment-Buchungsseiten (a2/b5/b6/b7/b8, de + en). */
export default function ApartmentBuchenContent({
  aptId,
  locale,
}: {
  aptId: SchoenblickApartmentId
  locale: Locale
}) {
  const t = getDict(locale).booking.pages
  const config = PROPERTY_CONFIGS[aptId]
  const smoobuId = resolveSmoobuId(config)
  const apt = schoenblick.apartments?.[aptId]
  const h1 = t.bookH1(config.name)

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* ── Header bar ── */}
      <div className="bg-forest-900 border-b border-cream-50/10">
        <div className="container-site py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <nav aria-label="Breadcrumb" className="mb-1">
              <ol className="flex items-center gap-2 font-body text-xs text-cream-50/40">
                <li>
                  <Link href={localizeHref("/", locale)} className="hover:text-cream-50/70 transition-colors">{t.home}</Link>
                </li>
                {config.breadcrumb.map((crumb) => (
                  <li key={crumb.href} className="flex items-center gap-2">
                    <IconArrowRight size={10} />
                    <Link href={localizeHref(crumb.href, locale)} className="hover:text-cream-50/70 transition-colors">{crumb.label}</Link>
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <IconArrowRight size={10} />
                  <span className="text-cream-50/60">{t.book}</span>
                </li>
              </ol>
            </nav>
            <h1 className="font-display text-2xl text-cream-50">
              {h1.plain}<span className="text-gold-300">{h1.gold}</span>
            </h1>
          </div>
          {apt && (
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5 text-gold-300">
                {[1, 2, 3, 4, 5].map((i) => <IconStar key={i} size={12} filled />)}
              </div>
              <span className="font-body text-sm text-cream-50/70">
                {apt.airbnbRating} · {apt.airbnbReviewCount} {t.reviewsWord}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Booking Widget ── */}
      <BookingWidget
        smoobuId={smoobuId}
        propertyName={config.name}
        propertySlug={config.id}
        maxGuests={config.maxGuests}
        minStay={config.minStay}
        cleaningFee={config.cleaningFee}
        priceFrom={config.priceFrom}
        baseOccupancy={config.baseOccupancy}
        extraPersonFee={config.extraPersonFee}
        breadcrumb={config.breadcrumb}
        propertyHref={config.propertyHref}
      />
    </div>
  )
}
