import type { Metadata } from "next";
import GruppenPageContent from "@/components/pages/GruppenPageContent";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/schoenblick/gruppen",
  locale: "de",
  // absolute: der Markenname steckt schon im Titel, sonst wird er zu lang
  title: { absolute: "Gruppenunterkunft bis 20 Personen – Haus Schönblick" },
  description:
    "Mehrere Apartments, eine Buchung: Haus Schönblick in Schöfweg bietet bis zu 20 Personen Platz in 5 Ferienwohnungen. Direkt buchen, ohne Portalgebühren.",
  ogDescription:
    "5 Apartments unter einem Dach, ein Zeitraum, eine Zahlung. Ideal für Familienfeiern, Vereinsausflüge und Firmen-Retreats im Bayerischen Wald.",
  image: { url: "/images/schoenblick/aussen/hero.webp", alt: "Haus Schönblick – Gruppenunterkunft im Bayerischen Wald" },
});

const breadcrumbJsonLd = breadcrumbSchema([["Startseite", "/"], ["Haus Schönblick", "/schoenblick"], ["Gruppen", "/schoenblick/gruppen"]]);

export default function GruppenPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <GruppenPageContent locale="de" />
    </>
  );
}
