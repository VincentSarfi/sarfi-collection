import type { Metadata } from "next";
import Link from "next/link";
import { schoenblick } from "@/data/properties";
import BookingWidget from "@/components/booking/BookingWidget";
import { PROPERTY_CONFIGS, resolveSmoobuId } from "@/config/properties.config";
import { IconArrowRight, IconStar } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Haus Schönblick buchen – Apartments im Bayerischen Wald",
  description:
    "Buche direkt eines der vier Panorama-Apartments im Haus Schönblick. Ab 85€ / Nacht. Ohne Plattformgebühren.",
  robots: { index: false },
};

const apartments = Object.values(schoenblick.apartments ?? {});

export default function SchoenblickBuchenPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Header */}
      <div className="bg-forest-900 border-b border-cream-50/10">
        <div className="container-site py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <nav aria-label="Breadcrumb" className="mb-1">
              <ol className="flex items-center gap-2 font-body text-xs text-cream-50/40">
                <li><Link href="/" className="hover:text-cream-50/70 transition-colors">Startseite</Link></li>
                <li className="flex items-center gap-2">
                  <IconArrowRight size={10} />
                  <Link href="/schoenblick" className="hover:text-cream-50/70 transition-colors">Haus Schönblick</Link>
                </li>
                <li className="flex items-center gap-2">
                  <IconArrowRight size={10} />
                  <span className="text-cream-50/60">Buchen</span>
                </li>
              </ol>
            </nav>
            <h1 className="font-display text-2xl text-cream-50">
              Haus Schönblick <span className="text-gold-300">buchen</span>
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5 text-gold-300">
              {[1,2,3,4,5].map(i => <IconStar key={i} size={12} filled />)}
            </div>
            <span className="font-body text-sm text-cream-50/70">
              {schoenblick.airbnbRating} · {schoenblick.airbnbReviewCount} Bewertungen
            </span>
          </div>
        </div>
      </div>

      {/* Apartment selector */}
      <div className="container-site py-8">
        <h2 className="font-display text-xl text-forest-900 mb-4">Wähle dein Apartment:</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {apartments.map((apt) => (
            <a
              key={apt.id}
              href={`#${apt.id}`}
              className="p-3 rounded-xl border border-forest-200 bg-white hover:border-gold-400 hover:bg-gold-300/5 transition-all text-center group"
            >
              <p className="font-body text-sm font-medium text-forest-800 group-hover:text-gold-700">
                {apt.name}
              </p>
              <p className="font-body text-xs text-forest-400">
                ab {apt.priceFrom}€ / Nacht
              </p>
            </a>
          ))}
        </div>
        <p className="font-body text-sm text-forest-500">
          Für Gruppenbuchungen mehrerer Apartments:{" "}
          <Link href="/kontakt" className="text-gold-600 underline underline-offset-2">
            Anfrage stellen
          </Link>
        </p>
      </div>

      {/* Booking widgets for all apartments */}
      {apartments.map((apt, idx) => {
        const config = PROPERTY_CONFIGS[apt.id];
        if (!config) return null;
        const smoobuId = resolveSmoobuId(config);
        return (
          <div key={apt.id} id={apt.id} className="scroll-mt-20">
            {/* Divider between apartments */}
            {idx > 0 && (
              <div className="border-t-4 border-forest-900/10 mx-auto" />
            )}

            {/* Apartment header */}
            <div className="bg-forest-900">
              <div className="container-site py-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-body text-xs text-cream-50/40 mb-0.5 uppercase tracking-wider">
                    Haus Schönblick · Apartment {apt.id.toUpperCase()}
                  </p>
                  <h2 className="font-display text-xl text-cream-50">
                    {apt.name} <span className="text-gold-300">buchen</span>
                  </h2>
                  <p className="font-body text-sm text-cream-50/60 mt-0.5">
                    {config.subtitle} · bis {config.maxGuests} Personen · ab {config.priceFrom}€ / Nacht
                  </p>
                </div>
                <Link
                  href={config.propertyHref}
                  className="font-body text-xs text-cream-50/50 hover:text-cream-50/80 transition-colors underline underline-offset-2"
                >
                  Apartment ansehen →
                </Link>
              </div>
            </div>

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
              hideMobileBar
            />
          </div>
        );
      })}

      {/* Trust */}
      <div className="container-site pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          {[
            { icon: "🔒", title: "Sichere Zahlung", text: "SSL-verschlüsselt" },
            { icon: "👪", title: "Gruppenfreundlich", text: "Mehrere Apartments kombinierbar" },
            { icon: "💰", title: "Keine Gebühren", text: "Günstiger als Plattformen" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-cream-200 shadow-card">
              <span className="text-2xl">{item.icon}</span>
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
