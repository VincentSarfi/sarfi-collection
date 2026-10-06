import type { Metadata } from "next";
import GruppenPageContent, { groupFaqs } from "@/components/pages/GruppenPageContent";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/schoenblick/gruppen",
  locale: "en",
  title: { absolute: "Group Accommodation for 20 Guests – Haus Schönblick" },
  description:
    "Several apartments, one booking: Haus Schönblick in Schöfweg sleeps up to 20 guests in 5 holiday apartments under one roof. Book direct, no platform fees.",
  ogDescription:
    "5 apartments under one roof, one date range, one payment. Ideal for family celebrations, club trips and company retreats in the Bavarian Forest.",
  image: { url: "/images/schoenblick/aussen/hero.webp", alt: "Haus Schönblick – group accommodation in the Bavarian Forest" },
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: groupFaqs("en").map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const breadcrumbJsonLd = breadcrumbSchema([["Home", "/en"], ["Haus Schönblick", "/en/schoenblick"], ["Groups", "/en/schoenblick/gruppen"]]);

export default function GroupPageEn() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <GruppenPageContent locale="en" />
    </>
  );
}
