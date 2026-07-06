import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import PropertyCards from "@/components/home/PropertyCards";
import Highlights from "@/components/home/Highlights";
import ReviewsSection from "@/components/home/ReviewsSection";
import RegionSection from "@/components/home/RegionSection";
import CtaSection from "@/components/home/CtaSection";
import { getAggregateReviewStats } from "@/data/properties";

export const metadata: Metadata = {
  title: "SARFI Collection – Exklusive Ferienunterkünfte im Bayerischen Wald",
  description:
    "HAUS28 – modernes A-Frame am Büchelstein bei Grattersdorf. Haus Schönblick – Panorama-Apartments in Schöfweg. Zwei einzigartige Ferienunterkünfte im Bayerischen Wald. Direkt buchen & sparen.",
  openGraph: {
    title: "SARFI Collection – Dein Rückzugsort im Bayerischen Wald",
    description:
      "Zwei exklusive Ferienunterkünfte mitten im Bayerischen Wald. Direkt buchen und bis zu 20 % sparen.",
    url: "https://www.sarfi-collection.de",
    images: [
      {
        url: "/images/shared/panorama-drohne.jpg",
        alt: "SARFI Collection – Ferienunterkünfte im Bayerischen Wald",
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: "https://www.sarfi-collection.de",
  },
};

// Aggregierte Bewertungen dynamisch aus data/properties.ts
const reviewStats = getAggregateReviewStats();

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "SARFI Collection",
  description:
    "Exklusive Ferienunterkünfte im Bayerischen Wald – HAUS28 und Haus Schönblick",
  url: "https://www.sarfi-collection.de",
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
    { "@type": "LocationFeatureSpecification", name: "WLAN", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parkplatz", value: true },
  ],
};

export default function HomePage() {
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
      <RegionSection />
      <CtaSection />
    </>
  );
}
