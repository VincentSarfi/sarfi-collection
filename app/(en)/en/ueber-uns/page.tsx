import type { Metadata } from "next";
import UeberUnsPageContent from "@/components/pages/UeberUnsPageContent";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  // Kurzform: Das Root-Layout-Template ergänzt "| SARFI Collection".
  title: "About us",
  description:
    "Meet the hosts behind SARFI Collection. We love the Bavarian Forest and share that love with our guests.",
  alternates: alternatesFor("/ueber-uns", "en"),
};

export default function EnglishUeberUnsPage() {
  return <UeberUnsPageContent locale="en" />;
}
