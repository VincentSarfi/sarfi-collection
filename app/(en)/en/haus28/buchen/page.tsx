import type { Metadata } from "next"
import Haus28BuchenContent from "@/components/pages/Haus28BuchenContent"
import { alternatesFor } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Book HAUS28 – direct & at the best rate",
  description:
    "Book HAUS28 directly and skip the platform fees. Modern A-frame holiday home in the Bavarian Forest. From 199 € / night. Check availability now.",
  robots: { index: false },
  alternates: alternatesFor("/haus28/buchen", "en"),
}

export default function EnglishHaus28BuchenPage() {
  return <Haus28BuchenContent locale="en" />
}
