import type { Metadata } from "next";
import AusflugszielePageContent, { ausflugszieleJsonLd } from "@/components/pages/AusflugszielePageContent";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    path: "/ausflugsziele",
    locale: "en",
    title: "Things to Do in the Bavarian Forest",
    description:
      "Pullman City, the Büchelstein hike, Sonnenwald ski area, Rusel-Arena, the Treetop Walk & the national park: the best things to do in the Bavarian Forest.",
    ogTitle: "Things to Do in the Bavarian Forest – Tips from SARFI Collection",
    ogDescription:
      "Pullman City, the Büchelstein hike, Sonnenwald ski area, indoor golf & more – the best day trips around HAUS28 and Haus Schönblick.",
    image: { url: "/images/shared/region-bayerischer-wald.jpg", alt: "Bavarian Forest" },
  }),
  keywords: [
    "things to do Bavarian Forest",
    "Bavarian Forest day trips",
    "Pullman City Eging am See",
    "Büchelstein hike",
    "Treetop Walk Neuschönau",
    "Bavarian Forest National Park",
    "Sonnenwald ski area",
  ],
};

const jsonLd = ausflugszieleJsonLd("en");
const breadcrumbJsonLd = breadcrumbSchema([["Home", "/en"], ["Things to do", "/en/ausflugsziele"]]);

export default function ThingsToDoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <AusflugszielePageContent locale="en" />
    </>
  );
}
