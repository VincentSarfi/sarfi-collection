import type { Metadata } from "next"
import ApartmentBuchenContent from "@/components/pages/ApartmentBuchenContent"
import { alternatesFor } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Book Apartment A2 – Haus Schönblick",
  description:
    "Book Apartment A2 at Haus Schönblick directly. Panorama apartment in the Bavarian Forest. No platform fees.",
  robots: { index: false },
  alternates: alternatesFor("/schoenblick/a2/buchen", "en"),
}

export default function EnglishA2BuchenPage() {
  return <ApartmentBuchenContent aptId="a2" locale="en" />
}
