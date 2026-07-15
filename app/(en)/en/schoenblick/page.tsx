import type { Metadata } from "next";
import { schoenblick } from "@/data/properties";
import { localizeProperty } from "@/data/properties.i18n";
import SchoenblickPageContent from "@/components/property/SchoenblickPageContent";
import { alternatesFor } from "@/lib/i18n";

const schoenblickEn = localizeProperty(schoenblick, "en");

export const metadata: Metadata = {
  title: "Haus Schönblick – Panorama Holiday Apartments in Schöfweg",
  description: `5 holiday apartments with breathtaking panoramic views in the Bavarian Forest. Ideal for families and groups. From ${schoenblick.priceFrom}€ / night. Book direct now!`,
  openGraph: {
    title: "Haus Schönblick – Panorama Apartments in the Bavarian Forest",
    description:
      "5 holiday apartments with panoramic views in Schöfweg. For couples, families and groups. Book direct and save.",
    images: [{ url: schoenblick.images.hero, alt: "Haus Schönblick" }],
  },
  alternates: alternatesFor("/schoenblick", "en"),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: schoenblickEn.faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.sarfi-collection.de/en" },
    { "@type": "ListItem", position: 2, name: "Haus Schönblick", item: "https://www.sarfi-collection.de/en/schoenblick" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Haus Schönblick",
  description: schoenblickEn.description,
  url: "https://www.sarfi-collection.de/en/schoenblick",
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
  priceRange: `from ${schoenblick.priceFrom}€ / night`,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: schoenblick.airbnbRating,
    reviewCount: schoenblick.airbnbReviewCount,
    bestRating: "5",
  },
};

export default function EnglishSchoenblickPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SchoenblickPageContent locale="en" />
    </>
  );
}
