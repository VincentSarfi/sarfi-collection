import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import PropertyCards from "@/components/home/PropertyCards";
import Highlights from "@/components/home/Highlights";
import ReviewsSection from "@/components/home/ReviewsSection";
import AwardsStrip from "@/components/home/AwardsStrip";
import RegionSection from "@/components/home/RegionSection";
import CtaSection from "@/components/home/CtaSection";
import { getAggregateReviewStats } from "@/data/properties";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "SARFI Collection – Exclusive Holiday Homes in the Bavarian Forest",
  description:
    "HAUS28 – a modern A-frame at Büchelstein near Grattersdorf. Haus Schönblick – panorama apartments in Schöfweg. Two unique holiday homes in the Bavarian Forest, Germany. Book direct & save.",
  openGraph: {
    title: "SARFI Collection – Your Retreat in the Bavarian Forest",
    description:
      "Two exclusive holiday homes in the heart of the Bavarian Forest. Book direct and save up to 20%.",
    url: "https://www.sarfi-collection.de/en",
    // og:image wird von der Datei-Konvention app/opengraph-image.tsx (1200×630) geliefert
  },
  alternates: alternatesFor("/", "en"),
};

// Aggregierte Bewertungen dynamisch aus data/properties.ts
const reviewStats = getAggregateReviewStats();

// JSON-LD structured data (englische Beschreibung, sonst analog zur DE-Startseite)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "SARFI Collection",
  description:
    "Exclusive holiday homes in the Bavarian Forest – HAUS28 and Haus Schönblick",
  url: "https://www.sarfi-collection.de/en",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Bayern",
    addressCountry: "DE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "48.85",
    longitude: "13.2",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: String(reviewStats.ratingValue),
    reviewCount: String(reviewStats.reviewCount),
    bestRating: "5",
    worstRating: "1",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
  ],
};

export default function EnglishHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeHero />
      <PropertyCards />
      <Highlights />
      <ReviewsSection />
      <AwardsStrip locale="en" />
      <RegionSection />
      <CtaSection />
    </>
  );
}
