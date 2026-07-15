import type { Metadata } from "next"
import Haus28BuchenContent from "@/components/pages/Haus28BuchenContent"

export const metadata: Metadata = {
  title: "HAUS28 buchen – Direkt & günstig",
  description:
    "Buche HAUS28 direkt und spare Plattformgebühren. Modernes A-Frame Ferienhaus im Bayerischen Wald. Ab 199 € / Nacht. Jetzt Verfügbarkeit prüfen.",
  robots: { index: false },
}

export default function Haus28BuchenPage() {
  return <Haus28BuchenContent locale="de" />
}
