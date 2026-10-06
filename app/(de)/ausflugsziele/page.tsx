import type { Metadata } from "next";
import AusflugszielePageContent, { ausflugszieleJsonLd } from "@/components/pages/AusflugszielePageContent";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/ausflugsziele",
    locale: "de",
    title: "Ausflugsziele im Bayerischen Wald",
    description:
      "Pullman City, Büchelstein-Wanderung, Steinberglift, Rusel-Arena, Baumwipfelpfad & Nationalpark: die besten Ausflugsziele im Bayerischen Wald.",
    ogTitle: "Ausflugsziele Bayerischer Wald – Tipps von SARFI Collection",
    ogDescription:
      "Pullman City, Büchelstein-Wanderung, Steinberglift, Indoor Golf & mehr – die besten Ausflüge rund um HAUS28 und Haus Schönblick.",
    image: { url: "/images/shared/region-bayerischer-wald.jpg", alt: "Bayerischer Wald" },
  }),
  keywords: [
    "Ausflugsziele Bayerischer Wald",
    "Pullman City Eging am See",
    "Büchelstein Wanderung",
    "Skilift Steinberg Schöfweg",
    "Indoor Golf Rusel",
    "Baumwipfelpfad Neuschönau",
    "Nationalpark Bayerischer Wald",
    "Ausflüge Grattersdorf",
    "Ausflüge Schöfweg",
    "Freizeitangebote Bayerischer Wald",
  ],
};

const jsonLd = ausflugszieleJsonLd("de");
const breadcrumbJsonLd = breadcrumbSchema([["Startseite", "/"], ["Ausflugsziele", "/ausflugsziele"]]);

export default function AusflugszielePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <AusflugszielePageContent locale="de" />
    </>
  );
}
