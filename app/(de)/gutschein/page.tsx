import type { Metadata } from "next";
import Link from "next/link";
import GutscheinWidget from "@/components/pages/GutscheinWidget";

export const metadata: Metadata = {
  title: "Geschenkgutschein kaufen – sofort per E-Mail",
  description:
    "Verschenke eine Auszeit im Bayerischen Wald: Geschenkgutschein für HAUS28 und Haus Schönblick online kaufen – Wert frei wählbar, Zahlung per Karte, PayPal oder Klarna, Gutschein sofort per E-Mail.",
  alternates: { canonical: "https://www.sarfi-collection.de/gutschein" },
  openGraph: {
    title: "Geschenkgutschein – SARFI Collection",
    description:
      "Verschenke eine Auszeit im Bayerischen Wald – Wert frei wählbar, sofort per E-Mail, einlösbar für alle Unterkünfte.",
    url: "https://www.sarfi-collection.de/gutschein",
  },
};

const faqs = [
  {
    q: "Wie schnell bekomme ich den Gutschein?",
    a: "Sofort: Direkt nach der Zahlung schicken wir dir den Gutschein automatisch per E-Mail – mit Gutscheincode und einer druckfertigen Gutschein-Karte (über den Druckdialog auch als PDF speicherbar).",
  },
  {
    q: "Wofür ist der Gutschein einlösbar?",
    a: "Für alle Unterkünfte der SARFI Collection: das A-Frame HAUS28 in Grattersdorf und alle Apartments im Haus Schönblick in Schöfweg – auch für Gruppenbuchungen.",
  },
  {
    q: "Wie wird der Gutschein eingelöst?",
    a: "Bei der Buchung einfach den Gutscheincode angeben – per E-Mail an hallo@sarfi-collection.de oder als Nachricht im Buchungsformular. Wir verrechnen den Wert mit dem Buchungspreis. Teileinlösung ist möglich, ein Restguthaben bleibt bestehen.",
  },
  {
    q: "Wie lange ist der Gutschein gültig?",
    a: "Drei volle Jahre: bis zum 31.12. des dritten Jahres nach dem Kauf. Ein Gutschein, der 2026 gekauft wird, gilt also bis Ende 2029.",
  },
  {
    q: "Kann ich den Kauf widerrufen?",
    a: "Ja. Als Verbraucher:in kannst du den Gutscheinkauf innerhalb von 14 Tagen ohne Angabe von Gründen widerrufen (solange der Gutschein nicht eingelöst wurde) – eine formlose E-Mail an hallo@sarfi-collection.de genügt.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function GutscheinPage() {
  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
            { icon: "⚡", title: "Sofort per E-Mail", text: "Direkt nach der Zahlung, druckfertig als Karte." },
            { icon: "🎁", title: "Frei wählbarer Wert", text: "50 € bis 2.500 € – du bestimmst den Betrag." },
            { icon: "🏡", title: "Für alle Unterkünfte", text: "HAUS28 & Haus Schönblick, 3 Jahre gültig." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-white border border-cream-200 shadow-card p-5">
              <span className="text-2xl">{f.icon}</span>
              <p className="font-body text-sm font-semibold text-forest-800 mt-2">{f.title}</p>
              <p className="font-body text-xs text-forest-500 mt-0.5">{f.text}</p>
            </div>
          ))}
        </div>

        {/* Kauf-Widget */}
        <GutscheinWidget />

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="font-display text-2xl text-forest-900 mb-6">Häufige Fragen</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl bg-white border border-cream-200 px-5 py-4">
                <summary className="font-body text-sm font-semibold text-forest-900 cursor-pointer list-none flex items-center justify-between">
                  {f.q}
                  <span className="text-forest-400 transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                </summary>
                <p className="font-body text-sm text-forest-600 leading-relaxed mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <p className="font-body text-xs text-forest-400 mt-10">
          Fragen zum Gutschein oder lieber klassisch bestellen?{" "}
          <Link href="/kontakt" className="underline hover:text-forest-600">Schreib uns</Link> – wir helfen gern.
          Es gelten unsere <Link href="/agb" className="underline hover:text-forest-600">AGB</Link>.
          Keine Barauszahlung; Widerruf innerhalb von 14 Tagen möglich, solange der Gutschein nicht eingelöst wurde.
        </p>
      </div>
    </div>
  );
}
