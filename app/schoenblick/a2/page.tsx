import type { Metadata } from "next";
import ApartmentPage from "@/components/property/ApartmentPage";
import { schoenblick } from "@/data/properties";
import { PROPERTY_CONFIGS } from "@/config/properties.config";

const apt = schoenblick.apartments!.a2;
const config = PROPERTY_CONFIGS.a2;

export const metadata: Metadata = {
  title: `${apt.name} – Haus Schönblick, Schöfweg`,
  description: apt.shortDescription + " Ab " + apt.priceFrom + "€ / Nacht. Jetzt direkt buchen!",
  openGraph: {
    title: `${apt.name} – Haus Schönblick im Bayerischen Wald`,
    description: apt.shortDescription,
    images: [{ url: apt.images.hero, alt: apt.name }],
  },
  alternates: { canonical: "https://www.sarfi-collection.de/schoenblick/a2" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VacationRental",
  "@id": "https://www.sarfi-collection.de/schoenblick/a2",
  identifier: "a2-schoenblick-sarfi-collection",
  additionalType: "https://schema.org/Apartment",
  containsPlace: {
    "@type": "Accommodation",
    name: apt.name,
    numberOfBedrooms: apt.bedrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: apt.sqm,
      unitCode: "MTK",
    },
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: apt.maxGuests,
      unitCode: "C62",
    },
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Schlafzimmer", value: 2 },
    { "@type": "LocationFeatureSpecification", name: "Badezimmer", value: 1 },
    { "@type": "LocationFeatureSpecification", name: "WLAN", value: true },
    { "@type": "LocationFeatureSpecification", name: "Küche", value: true },
    { "@type": "LocationFeatureSpecification", name: "Balkon", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parkplatz", value: true },
  ],
  name: apt.name,
  description: apt.description,
  url: "https://www.sarfi-collection.de/schoenblick/a2",
  image: apt.images.gallery.map((g) => g.src),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hochwaldstraße 18/20",
    addressLocality: "Schöfweg",
    postalCode: "94572",
    addressCountry: "DE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 48.8280385187145,
    longitude: 13.202348503081259,
  },
  numberOfBedrooms: apt.bedrooms,
  occupancy: {
    "@type": "QuantitativeValue",
    maxValue: apt.maxGuests,
    unitCode: "C62",
  },
  checkinTime: "T16:00",
  checkoutTime: "T10:00",
  priceRange: `ab ${apt.priceFrom}€ / Nacht`,
  sameAs: [apt.airbnbUrl],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: apt.airbnbRating,
    reviewCount: apt.airbnbReviewCount,
    bestRating: "5",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: apt.faqs.map((faq) => ({
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
    { "@type": "ListItem", position: 3, name: apt.name, item: "https://www.sarfi-collection.de/schoenblick/a2" },
  ],
};

export default function A2Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ApartmentPage apartment={apt} config={config} />
    </>
  );
}
