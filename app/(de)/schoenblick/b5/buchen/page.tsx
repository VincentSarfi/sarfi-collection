import type { Metadata } from "next"
import ApartmentBuchenContent from "@/components/pages/ApartmentBuchenContent"

export const metadata: Metadata = {
  title: "Apartment B5 buchen – Haus Schönblick",
  description:
    "Buche Apartment B5 im Haus Schönblick direkt bei den Gastgebern. Panorama-Apartment im Bayerischen Wald.",
  robots: { index: false },
}

export default function B5BuchenPage() {
  return <ApartmentBuchenContent aptId="b5" locale="de" />
}
