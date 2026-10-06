import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getDict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/kontakt",
  locale: "de",
  title: "Kontakt & FAQ",
  description:
    "Kontaktiere SARFI Collection oder lies unsere häufig gestellten Fragen. Wir helfen dir bei Buchungen, Check-in, Gruppenanfragen und mehr.",
});

// FAQ-JSON-LD aus dem Dictionary – bleibt so automatisch synchron mit den
// sichtbaren FAQ-Texten der Seite (vorher hartkodiert und veraltet).
const faq = getDict("de").kontakt.faq;

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text:
        typeof item.a === "string"
          ? item.a
          : `${item.a.beforeLink} ${item.a.linkLabel}${item.a.afterLink}`,
    },
  })),
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
