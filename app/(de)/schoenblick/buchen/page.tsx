import type { Metadata } from "next";
import Link from "next/link";
import { schoenblick } from "@/data/properties";
import { PROPERTY_CONFIGS, resolveSmoobuId } from "@/config/properties.config";
import ApartmentSelector from "@/components/booking/ApartmentSelector";
import { IconStar, IconArrowRight } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Haus Schönblick buchen – Apartments im Bayerischen Wald",
  description:
    "Buche direkt eines der fünf Panorama-Apartments im Haus Schönblick. Ab 59€ / Nacht. Ohne Plattformgebühren.",
  robots: { index: false },
};

const apartments = Object.values(schoenblick.apartments ?? {})
  .map((apt) => {
    const config = PROPERTY_CONFIGS[apt.id as keyof typeof PROPERTY_CONFIGS];
    if (!config) return null;
    return { apt, config, smoobuId: resolveSmoobuId(config) };
  })
  .filter((o): o is NonNullable<typeof o> => o !== null);

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

      {/* Apartment selection + inline booking */}
      <ApartmentSelector apartments={apartments} />

      {/* Group hint */}
      <div className="container-site pb-2">
        <div className="p-4 rounded-2xl bg-forest-900/5 border border-forest-200">
          <p className="font-body text-sm text-forest-700">
            <strong className="font-semibold">Für Gruppen:</strong> Mehrere Apartments gleichzeitig buchen – ideal für Familienfeiern oder Firmenausflüge.{" "}
            <Link href="/kontakt" className="text-gold-600 underline underline-offset-2 hover:text-gold-700">
              Anfrage stellen →
            </Link>
          </p>
        </div>
      </div>

      {/* Trust */}
      <div className="container-site pb-12 pt-6">
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
