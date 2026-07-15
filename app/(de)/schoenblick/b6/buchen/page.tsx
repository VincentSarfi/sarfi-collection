import type { Metadata } from "next"
import ApartmentBuchenContent from "@/components/pages/ApartmentBuchenContent"

export const metadata: Metadata = {
  title: "Apartment B6 buchen – Haus Schönblick",
  description:
    "Buche Apartment B6 im Haus Schönblick direkt. Panorama-Apartment im Bayerischen Wald. Ohne Plattformgebühren.",
  robots: { index: false },
}

export default function B6BuchenPage() {
  return <ApartmentBuchenContent aptId="b6" locale="de" />
}
