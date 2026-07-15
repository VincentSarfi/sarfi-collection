import type { Metadata } from "next";
import BuchenOverviewContent from "@/components/pages/BuchenOverviewContent";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Unterkunft wählen – Sarfi Collection | Bayerischer Wald",
  description:
    "Wähle deine Unterkunft: HAUS28 A-Frame oder eines der Panorama-Apartments im Haus Schönblick. Direkt buchen, bis zu 20 % günstiger.",
  robots: { index: true, follow: true },
  alternates: alternatesFor("/buchen", "de"),
};

export default function BuchenOverviewPage() {
  return <BuchenOverviewContent locale="de" />;
}
