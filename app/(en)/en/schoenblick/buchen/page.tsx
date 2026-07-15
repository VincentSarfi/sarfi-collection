import type { Metadata } from "next";
import SchoenblickBuchenContent from "@/components/pages/SchoenblickBuchenContent";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Book Haus Schönblick – apartments in the Bavarian Forest",
  description:
    "Book one of the five panorama apartments at Haus Schönblick directly. From 59€ / night. No platform fees.",
  robots: { index: false },
  alternates: alternatesFor("/schoenblick/buchen", "en"),
};

export default function EnglishSchoenblickBuchenPage() {
  return <SchoenblickBuchenContent locale="en" />;
}
