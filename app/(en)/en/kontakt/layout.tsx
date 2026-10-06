import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getDict } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/kontakt",
  locale: "en",
  title: "Contact & FAQ",
  description:
    "Get in touch with SARFI Collection or browse our frequently asked questions. We're happy to help with bookings, check-in, group enquiries and more.",
});

// FAQ-JSON-LD aus dem englischen Dictionary – bleibt so automatisch synchron
// mit den sichtbaren FAQ-Texten der Seite.
const faq = getDict("en").kontakt.faq;

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
