import type { Metadata } from "next";
import GruppenPageContent from "@/components/pages/GruppenPageContent";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Group Accommodation for up to 20 Guests – Haus Schönblick",
  description:
    "Several apartments, one booking: Haus Schönblick in Schöfweg sleeps up to 20 guests in 5 holiday apartments under one roof. Book direct, no platform fees.",
  openGraph: {
    title: "Group Accommodation for up to 20 Guests – Haus Schönblick",
    description:
      "5 apartments under one roof, one date range, one payment. Ideal for family celebrations, club trips and company retreats in the Bavarian Forest.",
    images: [{ url: "/images/schoenblick/aussen/hero.webp", alt: "Haus Schönblick – group accommodation in the Bavarian Forest" }],
  },
  alternates: alternatesFor("/schoenblick/gruppen", "en"),
};

export default function GroupPageEn() {
  return <GruppenPageContent locale="en" />;
}
