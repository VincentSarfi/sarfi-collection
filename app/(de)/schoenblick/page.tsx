import type { Metadata } from "next";
import { schoenblick } from "@/data/properties";
import SchoenblickPageContent from "@/components/property/SchoenblickPageContent";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Haus Schönblick – Panorama-Ferienwohnungen in Schöfweg",
  description: `5 Ferienwohnungen mit atemberaubendem Panoramablick im Bayerischen Wald. Ideal für Familien und Gruppen. Ab ${schoenblick.priceFrom}€ / Nacht. Jetzt direkt buchen!`,
  openGraph: {
    title: "Haus Schönblick – Panorama-Apartments im Bayerischen Wald",
    description:
      "5 Ferienwohnungen mit Panoramablick in Schöfweg. Für Paare, Familien und Gruppen. Direkt buchen und sparen.",
    images: [{ url: schoenblick.images.hero, alt: "Haus Schönblick" }],
  },
  alternates: alternatesFor("/schoenblick", "de"),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: schoenblick.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.sarfi-collection.de" },
    { "@type": "ListItem", position: 2, name: "Haus Schönblick", item: "https://www.sarfi-collection.de/schoenblick" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Haus Schönblick",
  description: schoenblick.description,
  url: "https://www.sarfi-collection.de/schoenblick",
  image: schoenblick.images.gallery.map((g) => g.src),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hochwaldstraße 18/20",
    addressLocality: "Schöfweg",
    postalCode: "94572",
    addressCountry: "DE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: schoenblick.coordinates.lat,
    longitude: schoenblick.coordinates.lng,
  },
  checkinTime: "T16:00",
  checkoutTime: "T10:00",
  sameAs: [
    "https://maps.app.goo.gl/y3CiwE29n7m17LJs9",
  ],
  priceRange: `ab ${schoenblick.priceFrom}€ / Nacht`,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: schoenblick.airbnbRating,
    reviewCount: schoenblick.airbnbReviewCount,
    bestRating: "5",
  },
};

export default function SchoenblickPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SchoenblickPageContent locale="de" />
    </>
  );
}
