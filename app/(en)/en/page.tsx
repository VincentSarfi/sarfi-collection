import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";
import PropertyCards from "@/components/home/PropertyCards";
import Highlights from "@/components/home/Highlights";
import ReviewsSection from "@/components/home/ReviewsSection";
import AwardsStrip from "@/components/home/AwardsStrip";
import RegionSection from "@/components/home/RegionSection";
import CtaSection from "@/components/home/CtaSection";
import { localizedUrl } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/",
  locale: "en",
  title: { absolute: "SARFI Collection – Exclusive Holiday Homes in the Bavarian Forest" },
  description:
    "HAUS28 – an A-frame with hot tub at the Büchelstein. Haus Schönblick – panorama apartments in Schöfweg. Holiday homes in the Bavarian Forest, book direct.",
  ogTitle: "SARFI Collection – Your Retreat in the Bavarian Forest",
  ogDescription:
    "Two exclusive holiday homes in the heart of the Bavarian Forest. Book direct and save up to 20%.",
});

// Die Startseite stellt zwei Häuser an zwei Orten vor: ausgezeichnet als Liste
// der Unterkünfte. Adresse, Geo und Bewertungen tragen die Detailseiten – ein
// LodgingBusiness mit Phantom-Adresse und Sammel-Bewertung wäre irreführend.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "SARFI Collection – Holiday Homes in the Bavarian Forest",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "HAUS28 – A-frame holiday home in Grattersdorf", url: localizedUrl("/haus28", "en") },
    { "@type": "ListItem", position: 2, name: "Haus Schönblick – panorama apartments in Schöfweg", url: localizedUrl("/schoenblick", "en") },
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
