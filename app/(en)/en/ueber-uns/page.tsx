import type { Metadata } from "next";
import UeberUnsPageContent from "@/components/pages/UeberUnsPageContent";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/ueber-uns",
  locale: "en",
  title: "About us – your hosts Vincent & Elena Sarfi",
  description:
    "Meet the hosts behind SARFI Collection. We love the Bavarian Forest and share that love with our guests.",
});

export default function EnglishUeberUnsPage() {
  return <UeberUnsPageContent locale="en" />;
}
