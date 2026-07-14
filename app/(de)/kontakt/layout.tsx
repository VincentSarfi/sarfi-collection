import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Kontakt & FAQ – SARFI Collection",
  description:
    "Kontaktiere SARFI Collection oder lies unsere häufig gestellten Fragen. Wir helfen dir bei Buchungen, Check-in, Gruppenanfragen und mehr.",
  alternates: {
    canonical: "https://www.sarfi-collection.de/kontakt",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Wie buche ich direkt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nutze den Buchungsbutton auf der jeweiligen Unterkunftsseite. Du wirst zum sicheren Smoobu-Buchungsformular weitergeleitet.",
      },
    },
    {
      "@type": "Question",
      name: "Kann ich mehrere Apartments gleichzeitig buchen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja! Schreibe uns einfach eine Nachricht und wir helfen dir beim Buchen mehrerer Apartments im Haus Schönblick.",
      },
    },
    {
      "@type": "Question",
      name: "Wie läuft der Check-in ab?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wir bieten Self-Check-in mit Schlüsselbox an. Du erhältst alle Infos ca. 24h vor Anreise per E-Mail/Nachricht.",
      },
    },
    {
      "@type": "Question",
      name: "Was passiert bei Stornierung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HAUS28: kostenlos bis 30 Tage vor Anreise, 50 % bis 14 Tage, danach keine Erstattung. Schönblick-Apartments: kostenlos bis 14 Tage vor Anreise, 50 % bis 7 Tage, danach keine Erstattung.",
      },
    },
    {
      "@type": "Question",
      name: "Gibt es Rabatte für längere Aufenthalte?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ja, für Aufenthalte ab 7 Nächten gibt es Wochenrabatte. Kontaktiere uns für individuelle Angebote.",
      },
    },
    {
      "@type": "Question",
      name: "Sind Haustiere willkommen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Auf Anfrage und je nach Unterkunft. Bitte kontaktiere uns vor der Buchung.",
      },
    },
  ],
};

export default function KontaktLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
