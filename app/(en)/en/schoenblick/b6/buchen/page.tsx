import type { Metadata } from "next"
import ApartmentBuchenContent from "@/components/pages/ApartmentBuchenContent"
import { alternatesFor } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Book Apartment B6 – Haus Schönblick",
  description:
    "Book Apartment B6 at Haus Schönblick directly. Panorama apartment in the Bavarian Forest. No platform fees.",
  robots: { index: false },
  alternates: alternatesFor("/schoenblick/b6/buchen", "en"),
}

export default function EnglishB6BuchenPage() {
  return <ApartmentBuchenContent aptId="b6" locale="en" />
}
