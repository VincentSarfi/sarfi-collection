import Link from "next/link";
import { schoenblick } from "@/data/properties";
import { localizeProperty } from "@/data/properties.i18n";
import { PROPERTY_CONFIGS, resolveSmoobuId } from "@/config/properties.config";
import ApartmentSelector from "@/components/booking/ApartmentSelector";
import { IconStar, IconArrowRight } from "@/components/ui/Icons";
import { getDict, localizeHref, type Locale } from "@/lib/i18n";

const TRUST_ICONS = ["🔒", "👪", "💰"] as const;

export default function SchoenblickBuchenContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).booking.pages;
  const h1 = t.bookH1("Haus Schönblick");

  const apartments = Object.values(localizeProperty(schoenblick, locale).apartments ?? {})
    .map((apt) => {
      const config = PROPERTY_CONFIGS[apt.id as keyof typeof PROPERTY_CONFIGS];
      if (!config) return null;
      return { apt, config, smoobuId: resolveSmoobuId(config) };
    })
    .filter((o): o is NonNullable<typeof o> => o !== null);

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Header */}
      <div className="bg-forest-900 border-b border-cream-50/10">
        <div className="container-site py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <nav aria-label="Breadcrumb" className="mb-1">
              <ol className="flex items-center gap-2 font-body text-xs text-cream-50/40">
                <li><Link href={localizeHref("/", locale)} className="hover:text-cream-50/70 transition-colors">{t.home}</Link></li>
                <li className="flex items-center gap-2">
                  <IconArrowRight size={10} />
                  <Link href={localizeHref("/schoenblick", locale)} className="hover:text-cream-50/70 transition-colors">Haus Schönblick</Link>
                </li>
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
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 text-gold-300">
              {[1,2,3,4,5].map(i => <IconStar key={i} size={12} filled />)}
            </div>
            <span className="font-body text-sm text-cream-50/70">
              {schoenblick.airbnbRating} · {schoenblick.airbnbReviewCount} {t.reviewsWord}
            </span>
          </div>
        </div>
      </div>

      {/* Apartment selection + inline booking */}
      <ApartmentSelector apartments={apartments} />

      {/* Group hint */}
      <div className="container-site pb-2">
        <div className="p-4 rounded-2xl bg-forest-900/5 border border-forest-200">
          <p className="font-body text-sm text-forest-700">
            <strong className="font-semibold">{t.groupHint.strong}</strong>{t.groupHint.text}
            <Link href={localizeHref("/kontakt", locale)} className="text-gold-600 underline underline-offset-2 hover:text-gold-700">
              {t.groupHint.link}
            </Link>
          </p>
        </div>
      </div>

      {/* Trust */}
      <div className="container-site pb-12 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {t.schoenblick.trust.map((item, i) => (
            <div key={item.title} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-cream-200 shadow-card">
              <span className="text-2xl">{TRUST_ICONS[i]}</span>
              <div>
                <p className="font-body text-sm font-medium text-forest-800">{item.title}</p>
                <p className="font-body text-xs text-forest-500">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
