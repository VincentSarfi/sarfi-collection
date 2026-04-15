import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { IconStar, IconArrowRight } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Über uns – SARFI Collection",
  description:
    "Lerne die Gastgeber hinter SARFI Collection kennen. Wir lieben den Bayerischen Wald und teilen diese Liebe mit unseren Gästen.",
  alternates: { canonical: "https://www.sarfi-collection.de/ueber-uns" },
};

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div className="relative h-64 md:h-80 bg-forest-900 flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/images/shared/panorama-drohne.jpg"
            alt="Panorama-Drohnenaufnahme Bayerischer Wald"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 container-site pb-8 pt-24">
          <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-300 mb-2">
            Über uns
          </p>
          <h1 className="font-display text-display-lg text-cream-50">
            Die Menschen hinter SARFI Collection
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container-site py-16 max-w-4xl">
        {/* Profilbild + Name */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-card-lg mb-4">
            <Image
              src="/images/team/profilbild.jpg"
              alt="Vincent und Elena Sarfi"
              fill
              className="object-cover"
            />
          </div>
          <h2 className="font-display text-2xl text-forest-900">Vincent &amp; Elena Sarfi</h2>
          <p className="font-body text-sm text-forest-500 mt-1">Gastgeber &amp; Inhaber SARFI Collection</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Story */}
          <div>
            <h2 className="font-display text-2xl text-forest-900 mb-4">Unsere Geschichte</h2>
            <div className="space-y-4 font-body text-base text-forest-600 leading-relaxed">
              <p>
                Willkommen bei der SARFI Collection! Wir sind Vincent und Elena Sarfi und haben uns den Traum erfüllt, Menschen mit den schönsten Ecken des Bayerischen Waldes zu verbinden.
              </p>
              <p>
                Der Bayerische Wald ist unsere Heimat – und wir lieben ihn für seine Ruhe, seine Ursprünglichkeit und seine besondere Atmosphäre. Mit HAUS28 und Haus Schönblick haben wir zwei Orte geschaffen, an denen unsere Gäste das spüren können, was uns so begeistert.
              </p>
              <p>
                {/* TODO: Weitere persönliche Details ergänzen */}
                Als Superhost auf Airbnb legen wir größten Wert auf Qualität, Sauberkeit und persönliche Betreuung. Jeder Gast soll sich bei uns wie zu Hause fühlen – nur schöner.
              </p>
            </div>
          </div>

          {/* Values */}
          <div>
            <h2 className="font-display text-2xl text-forest-900 mb-4">Unsere Werte</h2>
            <div className="space-y-4">
              {[
                {
                  icon: "🌲",
                  title: "Naturnähe",
                  text: "Unsere Unterkünfte sind so gestaltet, dass die Natur immer präsent ist – nicht trotz ihr, sondern mit ihr.",
                },
                {
                  icon: "✦",
                  title: "Qualität",
                  text: "Hochwertige Ausstattung, liebevolle Details und sorgfältige Pflege – das ist unser Standard.",
                },
                {
                  icon: "💬",
                  title: "Persönlichkeit",
                  text: "Wir sind immer für unsere Gäste da. Direkte Kommunikation, schnelle Antworten, persönliche Tipps.",
                },
                {
                  icon: "🌿",
                  title: "Nachhaltigkeit",
                  text: "Wir achten auf einen schonenden Umgang mit der Natur und der Region, die wir so lieben.",
                },
              ].map((value) => (
                <div key={value.title} className="flex gap-4 p-4 rounded-xl bg-white border border-cream-200 shadow-card">
                  <span className="text-2xl shrink-0">{value.icon}</span>
                  <div>
                    <p className="font-body text-sm font-semibold text-forest-800 mb-1">{value.title}</p>
                    <p className="font-body text-sm text-forest-500 leading-relaxed">{value.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Awards / Social Proof */}
        <div className="mt-16 p-8 rounded-3xl bg-forest-900 text-center">
          <div className="flex justify-center gap-0.5 text-gold-300 mb-3">
            {[1,2,3,4,5].map(i => <IconStar key={i} size={20} filled />)}
          </div>
          <p className="font-display text-2xl text-cream-50 mb-2">
            Superhost auf Airbnb
          </p>
          <p className="font-body text-sm text-cream-50/60 max-w-md mx-auto">
            Wir sind als Superhost ausgezeichnet – für außergewöhnliche Gastfreundschaft, schnelle Kommunikation und konsequent 5-Sterne-Bewertungen.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="font-body text-lg text-forest-600 mb-6">
            Lerne uns persönlich kennen – wir freuen uns auf deine Anfrage.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest-700 text-cream-50 rounded-full font-body font-medium text-sm hover:bg-forest-800 transition-colors"
            >
              Kontakt aufnehmen
              <IconArrowRight size={16} />
            </Link>
            <Link
              href="/haus28"
              className="inline-flex items-center gap-2 px-6 py-3 border border-forest-200 text-forest-700 rounded-full font-body text-sm hover:border-forest-400 transition-colors"
            >
              Unsere Unterkünfte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
