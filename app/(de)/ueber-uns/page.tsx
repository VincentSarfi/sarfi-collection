import type { Metadata } from "next";
import UeberUnsPageContent from "@/components/pages/UeberUnsPageContent";
import { breadcrumbSchema, hostsSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/ueber-uns",
  locale: "de",
  title: "Über uns – Gastgeber Vincent & Elena Sarfi",
  description:
    "Lerne die Gastgeber hinter SARFI Collection kennen. Wir lieben den Bayerischen Wald und teilen diese Liebe mit unseren Gästen.",
});

const jsonLd = [...hostsSchema("de"), breadcrumbSchema([["Startseite", "/"], ["Über uns", "/ueber-uns"]])];

export default function UeberUnsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UeberUnsPageContent locale="de" />
    </>
  );
}
