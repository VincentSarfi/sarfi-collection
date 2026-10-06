import type { Metadata } from "next";
import { haus28, getAggregateReviewStats } from "@/data/properties";
import Haus28ClientPage from "@/components/property/Haus28ClientPage";
import { absoluteUrl, hostingYears, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/haus28",
  locale: "de",
  title: { absolute: "HAUS28 – A-Frame mit Whirlpool im Bayerischen Wald" },
  description:
    "Privater Outdoor-Whirlpool, 4 Schlafzimmer, 8 Gäste – modernes A-Frame in Grattersdorf. Direkt beim Gastgeber buchen, ohne Portalgebühren.",
  ogDescription:
    "Privater Outdoor-Whirlpool, ganzjährig nutzbar, 4 Schlafzimmer, Platz für 8 Gäste: modernes A-Frame am Büchelstein im Bayerischen Wald. Direkt buchen & sparen.",
  image: { url: haus28.images.hero, alt: "HAUS28 – A-Frame Ferienhaus mit Whirlpool am Büchelstein, Grattersdorf" },
});

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
  image: haus28.images.gallery.map((g) => absoluteUrl(g.src)),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Büchelstein 28",
    addressLocality: "Grattersdorf",
    addressRegion: "Bayern",
    postalCode: "94541",
    addressCountry: "DE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: haus28.coordinates.lat,
    longitude: haus28.coordinates.lng,
  },
  containsPlace: {
    "@type": "Accommodation",
    additionalType: "House",
    name: "HAUS28 – A-Frame Ferienhaus",
    numberOfBedrooms: haus28.bedrooms,
    numberOfBathroomsTotal: haus28.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: haus28.sqm,
      unitCode: "MTK",
    },
    occupancy: {
      "@type": "QuantitativeValue",
      value: haus28.maxGuests,
      maxValue: haus28.maxGuests,
      unitCode: "C62",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Whirlpool", value: true },
      { "@type": "LocationFeatureSpecification", name: "WLAN", value: true },
      { "@type": "LocationFeatureSpecification", name: "Küche", value: true },
      { "@type": "LocationFeatureSpecification", name: "Balkone", value: 2 },
      { "@type": "LocationFeatureSpecification", name: "Terrasse", value: true },
      { "@type": "LocationFeatureSpecification", name: "Feuerschale", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parkplatz", value: true },
    ],
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Schlafzimmer", value: 4 },
    { "@type": "LocationFeatureSpecification", name: "Badezimmer", value: 2 },
    { "@type": "LocationFeatureSpecification", name: "Whirlpool", value: true },
    { "@type": "LocationFeatureSpecification", name: "Feuerschale", value: true },
    { "@type": "LocationFeatureSpecification", name: "WLAN", value: true },
    { "@type": "LocationFeatureSpecification", name: "Küche", value: true },
    { "@type": "LocationFeatureSpecification", name: "Balkone", value: 2 },
    { "@type": "LocationFeatureSpecification", name: "Terrasse", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parkplatz", value: true },
    { "@type": "LocationFeatureSpecification", name: "Self-Check-in", value: true },
  ],
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
    value: haus28.maxGuests,
    maxValue: haus28.maxGuests,
    unitCode: "C62",
  },
  checkinTime: "T16:00",
  checkoutTime: "T10:00",
  petsAllowed: false,
  priceRange: `ab ${haus28.priceFrom}€ / Nacht`,
  hasMap: haus28.googleMapsUrl,
  sameAs: [
    haus28.airbnbUrl,
    haus28.googleMapsUrl,
    "https://www.buechelstein.com",
    "https://www.haus28.com",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: String(getAggregateReviewStats([haus28]).ratingValue),
    reviewCount: getAggregateReviewStats([haus28]).reviewCount,
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
      <Haus28ClientPage hostingYears={hostingYears()} />
    </>
  );
}
