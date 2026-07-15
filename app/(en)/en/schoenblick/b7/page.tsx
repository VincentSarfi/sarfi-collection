import type { Metadata } from "next";
import ApartmentPage from "@/components/property/ApartmentPage";
import { schoenblick } from "@/data/properties";
import { localizeProperty } from "@/data/properties.i18n";
import { PROPERTY_CONFIGS } from "@/config/properties.config";
import { alternatesFor } from "@/lib/i18n";

const apt = schoenblick.apartments!.b7;
const aptEn = localizeProperty(apt, "en");
const config = PROPERTY_CONFIGS.b7;

export const metadata: Metadata = {
  title: `${apt.name} – Haus Schönblick, Schöfweg`,
  description: aptEn.shortDescription + " From " + apt.priceFrom + "€ / night. Book direct now!",
  openGraph: {
    title: `${apt.name} – The most beautiful apartment at Haus Schönblick`,
    description: aptEn.shortDescription,
    images: [{ url: apt.images.hero, alt: apt.name }],
  },
  alternates: alternatesFor("/schoenblick/b7", "en"),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VacationRental",
  "@id": "https://www.sarfi-collection.de/en/schoenblick/b7",
  identifier: "b7-schoenblick-sarfi-collection",
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
      value: apt.maxGuests,
      maxValue: apt.maxGuests,
      unitCode: "C62",
    },
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Bedrooms", value: 2 },
    { "@type": "LocationFeatureSpecification", name: "Bathrooms", value: 1 },
    { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Kitchen", value: true },
    { "@type": "LocationFeatureSpecification", name: "Balcony", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
  ],
  name: apt.name,
  description: aptEn.description,
  url: "https://www.sarfi-collection.de/en/schoenblick/b7",
  image: apt.images.gallery.map((g) => g.src),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hochwaldstraße 18/20",
    addressLocality: "Schöfweg",
    addressRegion: "Bayern",
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
  priceRange: `from ${apt.priceFrom}€ / night`,
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
  mainEntity: aptEn.faqs.map((faq) => ({
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
    { "@type": "ListItem", position: 3, name: apt.name, item: "https://www.sarfi-collection.de/en/schoenblick/b7" },
  ],
};

export default function EnglishB7Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ApartmentPage apartment={aptEn} config={config} />
    </>
  );
}
