import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { schoenblick } from "@/data/properties";
import { IconStar, IconArrowRight, IconUsers } from "@/components/ui/Icons";

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

      {/* Intro */}
      <div className="container-site pt-8 pb-2">
        <h2 className="font-display text-xl text-forest-900 mb-1">Wähle dein Apartment:</h2>
        <p className="font-body text-sm text-forest-500">
          Klicke auf ein Apartment, um Fotos, Infos und den Buchungskalender zu sehen.
        </p>
      </div>

      {/* Apartment Cards */}
      <div className="container-site py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {apartments.map((apt) => (
            <Link
              key={apt.id}
              href={`/schoenblick/${apt.id}`}
              className="group rounded-2xl overflow-hidden bg-white border border-cream-200 shadow-card hover:shadow-card-lg hover:border-gold-400 transition-all duration-200"
            >
              {/* Image */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={apt.images.hero}
                  alt={apt.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/50 to-transparent" />

                {apt.isNew && (
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-gold-500 rounded-full">
                    <span className="font-body text-xs font-bold text-forest-900 tracking-widest uppercase">Neu</span>
                  </div>
                )}

                {apt.airbnbRating > 0 && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-forest-900/70 backdrop-blur-sm rounded-full">
                    <IconStar size={10} className="text-gold-300 fill-gold-300" filled />
                    <span className="font-body text-xs font-semibold text-cream-50">{apt.airbnbRating}</span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-colors duration-200 flex items-end justify-end p-4">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-body text-xs font-medium px-3 py-1.5 bg-gold-500 text-forest-900 rounded-full">
                    Ansehen & Buchen →
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-display text-lg text-forest-900 mb-0.5">{apt.name}</h3>
                <p className="font-body text-xs text-forest-500 mb-3 leading-snug">{apt.subtitle}</p>

                <div className="flex items-center gap-3 text-forest-400 text-xs font-body mb-3">
                  <span className="flex items-center gap-1">
                    <IconUsers size={12} />
                    {apt.maxGuests} Gäste
                  </span>
                  <span>·</span>
                  <span>{apt.bedrooms} SZ</span>
                  <span>·</span>
                  <span>{apt.sqm} m²</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-body text-xs text-forest-400">ab </span>
                    <span className="font-display text-xl text-forest-800">{apt.priceFrom}€</span>
                    <span className="font-body text-xs text-forest-400"> / Nacht</span>
                  </div>
                  <span className="font-body text-xs font-medium px-3 py-1.5 bg-forest-900 text-cream-50 rounded-full group-hover:bg-gold-500 group-hover:text-forest-900 transition-colors">
                    Jetzt buchen
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Group hint */}
        <div className="mt-6 p-4 rounded-2xl bg-forest-900/5 border border-forest-200">
          <p className="font-body text-sm text-forest-700">
            <strong className="font-semibold">Für Gruppen:</strong> Mehrere Apartments gleichzeitig buchen – ideal für Familienfeiern oder Firmenausflüge.{" "}
            <Link href="/kontakt" className="text-gold-600 underline underline-offset-2 hover:text-gold-700">
              Anfrage stellen →
            </Link>
          </p>
        </div>
      </div>

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
