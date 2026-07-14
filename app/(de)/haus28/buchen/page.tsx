import type { Metadata } from "next"
import Link from "next/link"
import { haus28 } from "@/data/properties"
import BookingWidget from "@/components/booking/BookingWidget"
import { PROPERTY_CONFIGS, resolveSmoobuId } from "@/config/properties.config"
import { IconArrowRight, IconStar, IconMapPin } from "@/components/ui/Icons"

export const metadata: Metadata = {
  title: "HAUS28 buchen – Direkt & günstig",
  description:
    "Buche HAUS28 direkt und spare Plattformgebühren. Modernes A-Frame Ferienhaus im Bayerischen Wald. Ab 199 € / Nacht. Jetzt Verfügbarkeit prüfen.",
  robots: { index: false },
}

export default function Haus28BuchenPage() {
  const config = PROPERTY_CONFIGS.haus28
  const smoobuId = resolveSmoobuId(config)

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* ── Header bar ── */}
      <div className="bg-forest-900 border-b border-cream-50/10">
        <div className="container-site py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <nav aria-label="Breadcrumb" className="mb-1">
              <ol className="flex items-center gap-2 font-body text-xs text-cream-50/40">
                <li>
                  <Link href="/" className="hover:text-cream-50/70 transition-colors">
                    Startseite
                  </Link>
                </li>
                {config.breadcrumb.map((crumb) => (
                  <li key={crumb.href} className="flex items-center gap-2">
                    <IconArrowRight size={10} />
                    <Link href={crumb.href} className="hover:text-cream-50/70 transition-colors">
                      {crumb.label}
                    </Link>
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <IconArrowRight size={10} />
                  <span className="text-cream-50/60">Buchen</span>
                </li>
              </ol>
            </nav>
            <h1 className="font-display text-2xl text-cream-50">
              HAUS28 <span className="text-gold-300">buchen</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5 text-gold-300">
                {[1, 2, 3, 4, 5].map((i) => (
                  <IconStar key={i} size={12} filled />
                ))}
              </div>
              <span className="font-body text-sm text-cream-50/70">
                {haus28.airbnbRating} · {haus28.airbnbReviewCount} Bewertungen
              </span>
            </div>
            <div className="flex items-center gap-1 text-cream-50/50">
              <IconMapPin size={13} />
              <span className="font-body text-xs">{haus28.address}</span>
            </div>
          </div>
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
