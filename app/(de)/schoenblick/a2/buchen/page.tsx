import type { Metadata } from "next"
import ApartmentBuchenContent from "@/components/pages/ApartmentBuchenContent"

export const metadata: Metadata = {
  title: "Apartment A2 buchen – Haus Schönblick",
  description:
    "Buche Apartment A2 im Haus Schönblick direkt bei den Gastgebern. Panorama-Apartment im Bayerischen Wald.",
  robots: { index: false },
}

export default function A2BuchenPage() {
  return <ApartmentBuchenContent aptId="a2" locale="de" />
}
