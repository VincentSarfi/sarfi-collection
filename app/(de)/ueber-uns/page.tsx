import type { Metadata } from "next";
import UeberUnsPageContent from "@/components/pages/UeberUnsPageContent";
import { alternatesFor } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Über uns – SARFI Collection",
  description:
    "Lerne die Gastgeber hinter SARFI Collection kennen. Wir lieben den Bayerischen Wald und teilen diese Liebe mit unseren Gästen.",
  alternates: alternatesFor("/ueber-uns", "de"),
};

export default function UeberUnsPage() {
  return <UeberUnsPageContent locale="de" />;
}
