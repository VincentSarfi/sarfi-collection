import type { Metadata } from "next";
import BuchenOverviewContent from "@/components/pages/BuchenOverviewContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/buchen",
  locale: "en",
  title: "Choose your accommodation – Bavarian Forest",
  description:
    "Choose your stay: the HAUS28 A-frame or one of the panorama apartments at Haus Schönblick. Book direct and save up to 20%.",
  noindex: true,
});

export default function EnglishBuchenOverviewPage() {
  return <BuchenOverviewContent locale="en" />;
}
