import type { Metadata } from "next"
import ApartmentBuchenContent from "@/components/pages/ApartmentBuchenContent"
import { alternatesFor } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Book Apartment B5 – Haus Schönblick",
  description:
    "Book Apartment B5 at Haus Schönblick directly. Panorama apartment in the Bavarian Forest. No platform fees.",
  robots: { index: false },
  alternates: alternatesFor("/schoenblick/b5/buchen", "en"),
}

export default function EnglishB5BuchenPage() {
  return <ApartmentBuchenContent aptId="b5" locale="en" />
}
