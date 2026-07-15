import type { Metadata } from "next"
import ApartmentBuchenContent from "@/components/pages/ApartmentBuchenContent"

export const metadata: Metadata = {
  title: "Apartment B7 buchen – Haus Schönblick",
  description:
    "Buche Apartment B7 im Haus Schönblick direkt. Premium-Apartment im Bayerischen Wald. Ohne Plattformgebühren.",
  robots: { index: false },
}

export default function B7BuchenPage() {
  return <ApartmentBuchenContent aptId="b7" locale="de" />
}
