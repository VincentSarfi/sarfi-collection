import type { Metadata } from "next"
import ApartmentBuchenContent from "@/components/pages/ApartmentBuchenContent"

export const metadata: Metadata = {
  title: "Apartment B8 buchen – Haus Schönblick",
  description:
    "Buche Apartment B8 im Haus Schönblick direkt. Panorama-Apartment im Bayerischen Wald. Ohne Plattformgebühren.",
  robots: { index: false },
}

export default function B8BuchenPage() {
  return <ApartmentBuchenContent aptId="b8" locale="de" />
}
