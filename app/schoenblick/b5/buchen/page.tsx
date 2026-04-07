import type { Metadata } from "next"
import Link from "next/link"
import { schoenblick } from "@/data/properties"
import BookingWidget from "@/components/booking/BookingWidget"
import { PROPERTY_CONFIGS, resolveSmoobuId } from "@/config/properties.config"
import { IconArrowRight, IconStar } from "@/components/ui/Icons"

export const metadata: Metadata = {
  title: "Apartment B5 buchen – Haus Schönblick",
  description:
    "Buche Apartment B5 im Haus Schönblick direkt. Panorama-Apartment im Bayerischen Wald. Ohne Plattformgebühren.",
  robots: { index: false },
}

export default function B5BuchenPage() {
  const config = PROPERTY_CONFIGS.b5
  const smoobuId = resolveSmoobuId(config)
  const apt = schoenblick.apartments?.b5

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* ── Header bar ── */}
      <div className="bg-forest-900 border-b border-cream-50/10">
        <div className="container-site py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <nav aria-label="Breadcrumb" className="mb-1">
              <ol className="flex items-center gap-2 font-body text-xs text-cream-50/40">
                <li>
                  <Link href="/" className="hover:text-cream-50/70 transition-colors">Startseite</Link>
                </li>
                {config.breadcrumb.map((crumb) => (
                  <li key={crumb.href} className="flex items-center gap-2">
                    <IconArrowRight size={10} />
                    <Link href={crumb.href} className="hover:text-cream-50/70 transition-colors">{crumb.label}</Link>
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <IconArrowRight size={10} />
                  <span className="text-cream-50/60">Buchen</span>
                </li>
              </ol>
            </nav>
            <h1 className="font-display text-2xl text-cream-50">
              Apartment B5 <span className="text-gold-300">buchen</span>
            </h1>
          </div>
          {apt && (
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5 text-gold-300">
                {[1, 2, 3, 4, 5].map((i) => <IconStar key={i} size={12} filled />)}
              </div>
              <span className="font-body text-sm text-cream-50/70">
                {apt.airbnbRating} · {apt.airbnbReviewCount} Bewertungen
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
        breadcrumb={config.breadcrumb}
        propertyHref={config.propertyHref}
      />
    </div>
  )
}
