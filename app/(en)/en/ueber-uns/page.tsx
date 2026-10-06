import type { Metadata } from "next";
import UeberUnsPageContent from "@/components/pages/UeberUnsPageContent";
import { breadcrumbSchema, hostsSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/ueber-uns",
  locale: "en",
  title: "About us – your hosts Vincent & Elena Sarfi",
  description:
    "Meet the hosts behind SARFI Collection. We love the Bavarian Forest and share that love with our guests.",
});

const jsonLd = [...hostsSchema("en"), breadcrumbSchema([["Home", "/en"], ["About us", "/en/ueber-uns"]])];

export default function EnglishUeberUnsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <UeberUnsPageContent locale="en" />
    </>
  );
}
