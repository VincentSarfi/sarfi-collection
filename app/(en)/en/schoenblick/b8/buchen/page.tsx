import type { Metadata } from "next"
import ApartmentBuchenContent from "@/components/pages/ApartmentBuchenContent"
import { alternatesFor } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Book Apartment B8 – Haus Schönblick",
  description:
    "Book Apartment B8 at Haus Schönblick directly. Panorama apartment in the Bavarian Forest. No platform fees.",
  robots: { index: false },
  alternates: alternatesFor("/schoenblick/b8/buchen", "en"),
}

export default function EnglishB8BuchenPage() {
  return <ApartmentBuchenContent aptId="b8" locale="en" />
}
