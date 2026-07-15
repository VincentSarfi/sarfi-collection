import Image from "next/image";
import { IconStar } from "@/components/ui/Icons";
import { haus28 } from "@/data/properties";
import { getDict, type Locale } from "@/lib/i18n";

/**
 * Kompakte Auszeichnungs-Leiste für die Startseite.
 * Beide Awards gehören zu HAUS28 (Airbnb Gäste-Favorit + Booking.com
 * Traveller Review Award 2026) – daher entsprechend ausgewiesen.
 */
export default function AwardsStrip({ locale = "de" }: { locale?: Locale }) {
  const t = getDict(locale).home.awards;
  return (
    <section className="bg-forest-900" aria-labelledby="awards-heading">
      <div className="container-site py-12">
        <p
          id="awards-heading"
          className="font-body text-xs uppercase tracking-widest text-gold-300 text-center mb-8"
        >
          {t.heading}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
          {/* Airbnb Gäste-Favorit */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="flex items-center gap-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/awards/laurel-left.svg" alt="" width={42} height={64} className="h-16 w-auto object-contain -mr-3" />
              <span className="font-display text-5xl text-cream-50 tracking-tight -mt-4">{t.airbnbScore}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/awards/laurel-right.svg" alt="" width={42} height={64} className="h-16 w-auto object-contain -ml-3" />
            </div>
            <p className="font-display text-xl text-cream-50">{t.airbnbTitle}</p>
            <p className="font-body text-xs text-cream-50/50">
              {t.airbnbNote} · {haus28.airbnbReviewCount} {t.reviewsSuffix}
            </p>
          </div>

          {/* Booking.com Traveller Review Award */}
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Image
              src="/images/awards/booking-award-2026.png"
              alt={t.bookingAlt}
              width={120}
              height={90}
              className="h-16 w-auto object-contain"
            />
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5 text-gold-300">
                {[1, 2, 3, 4, 5].map((i) => <IconStar key={i} size={12} filled />)}
              </div>
              <span className="font-display text-xl text-cream-50">{t.bookingScore}</span>
            </div>
            <p className="font-body text-xs text-cream-50/50">
              {t.bookingNote} · {haus28.bookingReviewCount} {t.reviewsSuffix}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
