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
  locale: "de",
  title: { absolute: "SARFI Collection – Exklusive Ferienunterkünfte im Bayerischen Wald" },
  description:
    "HAUS28 – A-Frame mit Whirlpool am Büchelstein. Haus Schönblick – Panorama-Apartments in Schöfweg. Ferienunterkünfte im Bayerischen Wald, direkt buchen.",
  ogTitle: "SARFI Collection – Dein Rückzugsort im Bayerischen Wald",
  ogDescription:
    "Zwei exklusive Ferienunterkünfte mitten im Bayerischen Wald. Direkt buchen und bis zu 20 % sparen.",
});

// Die Startseite stellt zwei Häuser an zwei Orten vor: ausgezeichnet als Liste
// der Unterkünfte. Adresse, Geo und Bewertungen tragen die Detailseiten – ein
// LodgingBusiness mit Phantom-Adresse und Sammel-Bewertung wäre irreführend.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "SARFI Collection – Ferienunterkünfte im Bayerischen Wald",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "HAUS28 – A-Frame Ferienhaus in Grattersdorf", url: localizedUrl("/haus28", "de") },
    { "@type": "ListItem", position: 2, name: "Haus Schönblick – Panorama-Apartments in Schöfweg", url: localizedUrl("/schoenblick", "de") },
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
      <AwardsStrip />
      <RegionSection />
      <CtaSection />
    </>
  );
}
