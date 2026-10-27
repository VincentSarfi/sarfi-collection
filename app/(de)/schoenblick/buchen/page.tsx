import type { Metadata } from "next";
import SchoenblickBuchenContent from "@/components/pages/SchoenblickBuchenContent";

export const metadata: Metadata = {
  title: "Haus Schönblick buchen – Apartments im Bayerischen Wald",
  description:
    "Buche eines der fünf Panorama-Apartments im Haus Schönblick direkt bei den Gastgebern. Ab 59 € / Nacht.",
  robots: { index: false },
};

export default function SchoenblickBuchenPage() {
  return <SchoenblickBuchenContent locale="de" />;
}
