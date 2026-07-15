import type { Metadata } from "next";
import { haus28, getAggregateReviewStats } from "@/data/properties";
import { localizeProperty } from "@/data/properties.i18n";
import Haus28ClientPage from "@/components/property/Haus28ClientPage";
import { alternatesFor } from "@/lib/i18n";

const haus28En = localizeProperty(haus28, "en");

export const metadata: Metadata = {
  title: "HAUS28 – A-Frame Holiday Home in the Bavarian Forest",
  description:
    "HAUS28 at the Büchelstein in Grattersdorf: a 157 m² A-frame holiday home in the Bavarian Forest – 5.0★ on Airbnb. Sleeps up to 8, beautifully appointed, deep in the woods. From 199€ / night. Book direct now!",
  openGraph: {
    title: "HAUS28 – A Modern A-Frame in the Woods",
    description:
      "A one-of-a-kind A-frame holiday home at the Büchelstein in the Bavarian Forest. Pure nature, premium quality, up to 8 guests. Book direct & save.",
    images: [{ url: haus28.images.hero, alt: "HAUS28 – A-frame holiday home at the Büchelstein, Grattersdorf" }],
  },
  alternates: alternatesFor("/haus28", "en"),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: haus28En.faqs.map((faq) => ({
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
    { "@type": "ListItem", position: 2, name: "HAUS28", item: "https://www.sarfi-collection.de/en/haus28" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VacationRental",
  "@id": "https://www.sarfi-collection.de/en/haus28",
  identifier: "haus28-sarfi-collection",
  name: "HAUS28",
  description: haus28En.description,
  url: "https://www.sarfi-collection.de/en/haus28",
  image: haus28.images.gallery.map((g) => g.src),
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
    name: "HAUS28 – A-frame holiday home",
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
      { "@type": "LocationFeatureSpecification", name: "Sauna", value: true },
      { "@type": "LocationFeatureSpecification", name: "Fireplace", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Kitchen", value: true },
      { "@type": "LocationFeatureSpecification", name: "Balcony", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
    ],
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Bedrooms", value: 4 },
    { "@type": "LocationFeatureSpecification", name: "Bathrooms", value: 2 },
    { "@type": "LocationFeatureSpecification", name: "Sauna", value: true },
    { "@type": "LocationFeatureSpecification", name: "Fireplace", value: true },
    { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Kitchen", value: true },
    { "@type": "LocationFeatureSpecification", name: "Balcony", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Self check-in", value: true },
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
  priceRange: `from ${haus28.priceFrom}€ / night`,
  sameAs: [
    haus28.airbnbUrl,
    "https://maps.app.goo.gl/uXtDYxT6oLuCGWm58",
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

export default function EnglishHaus28Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Haus28ClientPage />
    </>
  );
}
