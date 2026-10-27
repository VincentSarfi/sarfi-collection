import type { Metadata } from "next"
import Haus28BuchenContent from "@/components/pages/Haus28BuchenContent"

export const metadata: Metadata = {
  title: "HAUS28 buchen – direkt bei den Gastgebern",
  description:
    "Buche HAUS28 direkt bei Vincent und Elena. Modernes A-Frame Ferienhaus im Bayerischen Wald. Ab 199 € / Nacht. Jetzt Verfügbarkeit prüfen.",
  robots: { index: false },
}

export default function Haus28BuchenPage() {
  return <Haus28BuchenContent locale="de" />
}
