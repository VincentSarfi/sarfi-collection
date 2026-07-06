import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Geschenkgutschein – SARFI Collection",
  description:
    "Verschenke eine Auszeit im Bayerischen Wald: Geschenkgutscheine für HAUS28 und die Apartments im Haus Schönblick – frei wählbarer Wert, einlösbar für alle Unterkünfte.",
  alternates: { canonical: "https://www.sarfi-collection.de/gutschein" },
  openGraph: {
    title: "Geschenkgutschein – SARFI Collection",
    description:
      "Verschenke eine Auszeit im Bayerischen Wald – frei wählbarer Wert, einlösbar für alle Unterkünfte.",
    url: "https://www.sarfi-collection.de/gutschein",
  },
};

const MAILTO =
  "mailto:hallo@sarfi-collection.de?subject=" +
  encodeURIComponent("Geschenkgutschein-Anfrage") +
  "&body=" +
  encodeURIComponent(
    "Hallo SARFI Collection,\n\nich möchte einen Geschenkgutschein bestellen.\n\nWunschbetrag: \nUnterkunft (optional): \nName des/der Beschenkten (optional): \n\nViele Grüße",
  );

export default function GutscheinPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="container-site max-w-3xl">
        <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-3">
          Geschenkidee
        </p>
        <h1 className="font-display text-display-md text-forest-900 mb-5 text-balance">
          Verschenke eine Auszeit im Bayerischen Wald
        </h1>
        <p className="font-body text-forest-600 leading-relaxed mb-10 max-w-2xl">
          Ob Geburtstag, Weihnachten oder einfach so – mit einem Geschenkgutschein
          der SARFI Collection verschenkst du Natur, Ruhe und Design. Der Gutschein
          ist im Wert frei wählbar und für alle unsere Unterkünfte einlösbar:
          das moderne A-Frame <strong>HAUS28</strong> und die Panorama-Apartments
          im <strong>Haus Schönblick</strong>.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: "🎁", title: "Frei wählbarer Wert", text: "Du bestimmst den Betrag." },
            { icon: "🏡", title: "Für alle Unterkünfte", text: "HAUS28 & Haus Schönblick." },
            { icon: "✉️", title: "Schnell per E-Mail", text: "Als PDF zum Ausdrucken." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-white border border-cream-200 shadow-card p-5">
              <span className="text-2xl">{f.icon}</span>
              <p className="font-body text-sm font-semibold text-forest-800 mt-2">{f.title}</p>
              <p className="font-body text-xs text-forest-500 mt-0.5">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-forest-900 p-8 text-center">
          <h2 className="font-display text-2xl text-cream-50 mb-2">Gutschein anfragen</h2>
          <p className="font-body text-sm text-cream-50/70 mb-6 max-w-md mx-auto">
            Schreib uns kurz deinen Wunschbetrag – wir schicken dir den Gutschein
            als PDF und alle Infos zur Zahlung zu. Meist innerhalb eines Tages.
          </p>
          <a
            href={MAILTO}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-500 text-forest-900 font-body text-sm font-semibold hover:bg-gold-400 transition-colors"
          >
            Gutschein per E-Mail anfragen
          </a>
          <p className="font-body text-xs text-cream-50/50 mt-4">
            Lieber telefonisch? <Link href="/kontakt" className="underline hover:text-cream-50/80">Kontaktseite</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
