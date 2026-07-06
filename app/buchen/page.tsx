import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { haus28, schoenblick } from "@/data/properties";
import { IconStar, IconArrowRight, IconUsers } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Unterkunft wählen – Sarfi Collection | Bayerischer Wald",
  description:
    "Wähle deine Unterkunft: HAUS28 A-Frame oder eines der Panorama-Apartments im Haus Schönblick. Direkt buchen, bis zu 20 % günstiger.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.sarfi-collection.de/buchen" },
};

const apartments = Object.values(schoenblick.apartments ?? {});

export default function BuchenOverviewPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Header */}
      <div className="bg-forest-900 border-b border-cream-50/10">
        <div className="container-site py-5">
          <nav aria-label="Breadcrumb" className="mb-1">
            <ol className="flex items-center gap-2 font-body text-xs text-cream-50/40">
              <li><Link href="/" className="hover:text-cream-50/70 transition-colors">Startseite</Link></li>
              <li className="flex items-center gap-2">
                <IconArrowRight size={10} />
                <span className="text-cream-50/60">Unterkunft wählen</span>
              </li>
            </ol>
          </nav>
          <h1 className="font-display text-2xl text-cream-50">
            Unterkunft <span className="text-gold-300">wählen</span>
          </h1>
          <p className="font-body text-sm text-cream-50/60 mt-1">
            Direkt buchen · bis zu 20 % günstiger als auf Buchungsportalen
          </p>
        </div>
      </div>

      <div className="container-site py-8 space-y-10">

        {/* ── HAUS28 ── */}
        <section>
          <h2 className="font-display text-xl text-forest-900 mb-4">HAUS28 · A-Frame Ferienhaus</h2>
          <Link
            href="/haus28"
            className="group block rounded-2xl overflow-hidden bg-white border border-cream-200 shadow-card hover:shadow-card-lg hover:border-gold-400 transition-all duration-200"
          >
            <div className="sm:flex">
              {/* Image */}
              <div className="relative sm:w-72 lg:w-96 aspect-[3/2] sm:aspect-auto shrink-0 overflow-hidden">
                <Image
                  src={haus28.images.hero}
                  alt="HAUS28 A-Frame Ferienhaus"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 384px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/40 to-transparent sm:bg-gradient-to-r" />
                {haus28.airbnbRating > 0 && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-forest-900/70 backdrop-blur-sm rounded-full">
                    <IconStar size={10} className="text-gold-300 fill-gold-300" filled />
                    <span className="font-body text-xs font-semibold text-cream-50">{haus28.airbnbRating}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col justify-between gap-4 flex-1">
                <div>
                  <h3 className="font-display text-2xl text-forest-900 mb-1">HAUS28</h3>
                  <p className="font-body text-sm text-forest-500 mb-4 leading-snug">
                    A-Frame Ferienhaus · Büchelstein 28, Grattersdorf · Bayerischer Wald
                  </p>
                  <div className="flex flex-wrap gap-3 text-forest-400 text-xs font-body mb-4">
                    <span className="flex items-center gap-1"><IconUsers size={12} />{haus28.maxGuests} Gäste</span>
                    <span>·</span>
                    <span>{haus28.bedrooms} Schlafzimmer</span>
                    <span>·</span>
                    <span>{haus28.sqm} m²</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Panoramafenster", "Sauna", "Kamin", "Self-Check-in"].map((feat) => (
                      <span key={feat} className="font-body text-xs px-2.5 py-1 bg-forest-50 text-forest-600 rounded-full border border-forest-100">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-body text-xs text-forest-400">ab </span>
                    <span className="font-display text-2xl text-forest-800">{haus28.priceFrom}€</span>
                    <span className="font-body text-xs text-forest-400"> / Nacht</span>
                  </div>
                  <span className="font-body text-sm font-medium px-4 py-2 bg-forest-900 text-cream-50 rounded-full group-hover:bg-gold-500 group-hover:text-forest-900 transition-colors">
                    Ansehen &amp; Buchen →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* ── SCHÖNBLICK APARTMENTS ── */}
        <section>
          <h2 className="font-display text-xl text-forest-900 mb-4">Haus Schönblick · Panorama-Apartments</h2>
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
                  <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/10 transition-colors duration-200 flex items-end justify-end p-4">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-body text-xs font-medium px-3 py-1.5 bg-gold-500 text-forest-900 rounded-full">
                      Ansehen &amp; Buchen →
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-display text-lg text-forest-900 mb-0.5">{apt.name}</h3>
                  <p className="font-body text-xs text-forest-500 mb-3 leading-snug">{apt.subtitle}</p>
                  <div className="flex items-center gap-3 text-forest-400 text-xs font-body mb-3">
                    <span className="flex items-center gap-1"><IconUsers size={12} />{apt.maxGuests} Gäste</span>
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
        </section>

        {/* Trust */}
        <div className="pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: "🔒", title: "Sichere Zahlung", text: "SSL-verschlüsselt" },
              { icon: "💰", title: "Bis zu 20 % günstiger", text: "Als auf Buchungsportalen" },
              { icon: "💬", title: "Persönliche Betreuung", text: "Direkt vom Gastgeber" },
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
    </div>
  );
}
