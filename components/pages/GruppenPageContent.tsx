import Link from "next/link";
import Image from "next/image";
import GroupBookingWidget from "@/components/booking/GroupBookingWidget";
import { GROUP_APARTMENT_IDS, GROUP_MAX_GUESTS } from "@/lib/group-booking";
import { PROPERTY_CONFIGS } from "@/config/properties.config";
import { schoenblick } from "@/data/properties";
import { IconArrowRight, IconUsers } from "@/components/ui/Icons";
import { getDict, localizeHref, type Locale } from "@/lib/i18n";

// Statischer Seitenrahmen (Server Component) um das interaktive
// GroupBookingWidget. Texte für Hero/Vorteile/Kombis liegen im
// booking.groupPage-Dictionary.
export default function GruppenPageContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).booking.groupPage;
  const tg = getDict(locale).booking.group;

  // Beispiel-Kombinationen für den statischen Überblick (Preise "ab", aus
  // priceFrom – die echten Tagespreise zeigt das Widget nach Datumswahl).
  const combos = t.combos.map((c) => {
    const ids = c.ids as readonly string[];
    const capacity = ids.reduce((s, id) => s + PROPERTY_CONFIGS[id].maxGuests, 0);
    const fromPerNight = ids.reduce((s, id) => s + PROPERTY_CONFIGS[id].priceFrom, 0);
    return { ...c, capacity, fromPerNight, count: ids.length };
  });

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* ── Hero ── */}
      <div className="bg-forest-900">
        <div className="container-site py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <nav aria-label="Breadcrumb" className="mb-3">
              <ol className="flex items-center gap-2 font-body text-xs text-cream-50/40">
                <li><Link href={localizeHref("/", locale)} className="hover:text-cream-50/70 transition-colors">{t.home}</Link></li>
                <li className="flex items-center gap-2">
                  <IconArrowRight size={10} />
                  <Link href={localizeHref("/schoenblick", locale)} className="hover:text-cream-50/70 transition-colors">Haus Schönblick</Link>
                </li>
                <li className="flex items-center gap-2">
                  <IconArrowRight size={10} />
                  <span className="text-cream-50/60">{t.breadcrumb}</span>
                </li>
              </ol>
            </nav>
            <p className="font-body text-xs tracking-[0.14em] uppercase text-gold-300 mb-2">{tg.kicker}</p>
            <h1 className="font-display text-display-md text-cream-50 leading-tight mb-4">{t.h1}</h1>
            <p className="font-body text-base text-cream-50/70 max-w-lg mb-6">{t.intro(GROUP_MAX_GUESTS)}</p>
            <ul className="space-y-2">
              {[tg.benefit1, tg.benefit2, tg.benefit3].map((b) => (
                <li key={b} className="flex items-center gap-2.5 font-body text-sm text-cream-50/80">
                  <span className="text-gold-300">✓</span>{b}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image
              src={schoenblick.images.hero}
              alt={t.heroAlt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* ── Beispiel-Kombinationen ── */}
      <div className="container-site py-12">
        <h2 className="font-display text-2xl text-forest-900 mb-2">{t.combosHeading}</h2>
        <p className="font-body text-sm text-forest-500 mb-6 max-w-2xl">{t.combosSub}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {combos.map((c) => (
            <div key={c.label} className="rounded-2xl border border-cream-200 bg-white p-5 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <IconUsers size={16} className="text-gold-600" />
                <span className="font-body text-sm font-semibold text-forest-900">{c.label}</span>
              </div>
              <p className="font-body text-xs text-forest-500 mb-3">{c.desc}</p>
              <div className="flex items-baseline justify-between border-t border-cream-200 pt-3">
                <span className="font-body text-xs text-forest-400">
                  {c.count} {t.apartmentsWord} · {tg.capacityShort(c.capacity)}
                </span>
                <span className="font-body text-sm text-forest-900">
                  {t.fromPre}{c.fromPerNight} €{t.perNight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Buchungs-Widget ── */}
      <div className="container-site pb-16" id="buchen">
        <div className="border-t border-cream-200 pt-10">
          <GroupBookingWidget />
        </div>
      </div>

      {/* ── Alle 5 Apartments ── */}
      <div className="bg-white border-t border-cream-200">
        <div className="container-site py-12">
          <h2 className="font-display text-2xl text-forest-900 mb-6">{t.allApartmentsHeading}</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {GROUP_APARTMENT_IDS.map((id) => {
              const cfg = PROPERTY_CONFIGS[id];
              const apt = schoenblick.apartments?.[id];
              return (
                <Link
                  key={id}
                  href={localizeHref(`/schoenblick/${id}`, locale)}
                  className="group rounded-xl overflow-hidden border border-cream-200 bg-cream-50 hover:shadow-card-lg transition-shadow"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={apt?.images.hero ?? cfg.heroImage}
                      alt={cfg.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-body text-sm font-semibold text-forest-900">{cfg.name}</p>
                    <p className="font-body text-xs text-forest-500">{tg.capacityShort(cfg.maxGuests)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
