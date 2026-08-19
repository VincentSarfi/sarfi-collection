import type { Metadata } from "next";
import GruppenPageContent from "@/components/pages/GruppenPageContent";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Gruppenunterkunft für bis zu 20 Personen – Haus Schönblick",
  description:
    "Mehrere Apartments, eine Buchung: Haus Schönblick in Schöfweg bietet Platz für bis zu 20 Personen in 5 Ferienwohnungen unter einem Dach. Direkt buchen, ohne Portalgebühren.",
  openGraph: {
    title: "Gruppenunterkunft für bis zu 20 Personen – Haus Schönblick",
    description:
      "5 Apartments unter einem Dach, ein Zeitraum, eine Zahlung. Ideal für Familienfeiern, Vereinsausflüge und Firmen-Retreats im Bayerischen Wald.",
    images: [{ url: "/images/schoenblick/aussen/hero.webp", alt: "Haus Schönblick – Gruppenunterkunft im Bayerischen Wald" }],
  },
  alternates: alternatesFor("/schoenblick/gruppen", "de"),
};

export default function GruppenPage() {
  return <GruppenPageContent locale="de" />;
}
