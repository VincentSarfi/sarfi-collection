import type { Metadata } from "next";
import { haus28 } from "@/data/properties";
import Haus28ClientPage from "@/components/property/Haus28ClientPage";

export const metadata: Metadata = {
  title: "HAUS28 – Modernes A-Frame im Wald | Bayerischer Wald",
  description:
    "HAUS28 am Büchelstein in Grattersdorf: 157 m² A-Frame Ferienhaus im Bayerischen Wald – 18× 5★ auf Airbnb. Bis zu 8 Personen, hochwertig ausgestattet, mitten im Wald. Ab 199€ / Nacht. Jetzt direkt buchen!",
  openGraph: {
    title: "HAUS28 – Modernes A-Frame im Wald",
    description:
      "Einzigartiges A-Frame Ferienhaus am Büchelstein im Bayerischen Wald. Natur pur, hochwertig, bis zu 8 Personen. Direkt buchen & sparen.",
    images: [{ url: haus28.images.hero, alt: "HAUS28 – A-Frame Ferienhaus am Büchelstein, Grattersdorf" }],
  },
  alternates: {
    canonical: "https://www.sarfi-collection.de/haus28",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: haus28.faqs.map((faq) => ({
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
    { "@type": "ListItem", position: 2, name: "HAUS28", item: "https://www.sarfi-collection.de/haus28" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VacationRental",
  "@id": "https://www.sarfi-collection.de/haus28",
  identifier: "haus28-sarfi-collection",
  name: "HAUS28",
  description: haus28.description,
  url: "https://www.sarfi-collection.de/haus28",
  image: haus28.images.gallery.map((g) => g.src),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Büchelstein 28",
    addressLocality: "Grattersdorf",
    postalCode: "94541",
    addressCountry: "DE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: haus28.coordinates.lat,
    longitude: haus28.coordinates.lng,
  },
  containsPlace: [
    { "@type": "BedRoom", name: "Schlafzimmer 1 (EG)", description: "Kingsize-Bett" },
    { "@type": "BedRoom", name: "Schlafzimmer 2 (EG)", description: "Doppelbett" },
    { "@type": "BedRoom", name: "Schlafzimmer 3 (OG)", description: "Doppelbett" },
    { "@type": "BedRoom", name: "Schlafzimmer 4 (OG)", description: "Doppelbett" },
  ],
  additionalType: "https://schema.org/House",
  numberOfRooms: haus28.bedrooms,
  numberOfBedrooms: haus28.bedrooms,
  numberOfBathroomsTotal: haus28.bathrooms,
  floorSize: {
    "@type": "QuantitativeValue",
    value: haus28.sqm,
    unitCode: "MTK",
  },
  occupancy: {
    "@type": "QuantitativeValue",
    maxValue: haus28.maxGuests,
    unitCode: "C62",
  },
  checkinTime: "T16:00",
  checkoutTime: "T10:00",
  petsAllowed: false,
  priceRange: `ab ${haus28.priceFrom}€ / Nacht`,
  sameAs: [
    haus28.airbnbUrl,
    "https://maps.app.goo.gl/uXtDYxT6oLuCGWm58",
    "https://www.buechelstein.com",
    "https://www.haus28.com",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount:
      (haus28.airbnbReviewCount ?? 0) +
      (haus28.bookingReviewCount ?? 0) +
      (haus28.fewoReviewCount ?? 0) +
      (haus28.googleReviewCount ?? 0),
    bestRating: "5",
    worstRating: "1",
  },
};

export default function Haus28Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Haus28ClientPage />
    </>
  );
}
