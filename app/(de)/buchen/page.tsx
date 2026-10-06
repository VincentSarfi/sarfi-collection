import type { Metadata } from "next";
import BuchenOverviewContent from "@/components/pages/BuchenOverviewContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/buchen",
  locale: "de",
  title: "Unterkunft wählen – Bayerischer Wald",
  description:
    "Wähle deine Unterkunft: HAUS28 A-Frame oder eines der Panorama-Apartments im Haus Schönblick. Direkt buchen, bis zu 20 % günstiger.",
  // Dünne Auswahlseite, konkurriert mit der Startseite → nicht in den Suchindex
  noindex: true,
});

export default function BuchenOverviewPage() {
  return <BuchenOverviewContent locale="de" />;
}
