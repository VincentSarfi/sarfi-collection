import type { Metadata } from "next";
import BuchenOverviewContent from "@/components/pages/BuchenOverviewContent";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  // Kurzform: Das Root-Layout-Template ergänzt "| SARFI Collection".
  title: "Choose your accommodation – Bavarian Forest",
  description:
    "Choose your stay: the HAUS28 A-frame or one of the panorama apartments at Haus Schönblick. Book direct and save up to 20%.",
  robots: { index: true, follow: true },
  alternates: alternatesFor("/buchen", "en"),
};

export default function EnglishBuchenOverviewPage() {
  return <BuchenOverviewContent locale="en" />;
}
