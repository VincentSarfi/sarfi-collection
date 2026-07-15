import type { Metadata } from "next"
import ApartmentBuchenContent from "@/components/pages/ApartmentBuchenContent"
import { alternatesFor } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Book Apartment B7 – Haus Schönblick",
  description:
    "Book Apartment B7 at Haus Schönblick directly. Premium apartment in the Bavarian Forest. No platform fees.",
  robots: { index: false },
  alternates: alternatesFor("/schoenblick/b7/buchen", "en"),
}

export default function EnglishB7BuchenPage() {
  return <ApartmentBuchenContent aptId="b7" locale="en" />
}
