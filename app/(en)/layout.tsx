import type { Metadata } from "next";
import "../globals.css";
import { cormorant, dmSans } from "../fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { organizationSchema } from "@/lib/seo";

// ─── Root Metadata (English, /en/…) ─────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://www.sarfi-collection.de"),
  title: {
    default: "SARFI Collection – Exclusive Holiday Homes in the Bavarian Forest",
    template: "%s | SARFI Collection",
  },
  description:
    "Discover unique holiday homes in the Bavarian Forest, Germany. HAUS28 – a modern A-frame cabin in the woods. Haus Schönblick – panorama apartments with breathtaking views.",
  keywords: [
    "holiday home Bavarian Forest",
    "A-frame cabin Germany",
    "vacation rental Bavaria",
    "Bavarian Forest apartment",
    "HAUS28 Büchelstein",
    "Haus Schönblick Schöfweg",
    "cabin rental Germany",
    "Pullman City accommodation",
  ],
  authors: [{ name: "SARFI Collection" }],
  creator: "SARFI Collection",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.sarfi-collection.de/en",
    siteName: "SARFI Collection",
    title: "SARFI Collection – Exclusive Holiday Homes in the Bavarian Forest",
    description:
      "Two unique holiday homes in the heart of the Bavarian Forest. Book direct and save.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SARFI Collection – Exclusive Holiday Homes in the Bavarian Forest",
    description: "Two unique holiday homes in the heart of the Bavarian Forest.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ─── Root Layout (English, /en-Präfix) ──────────────────────────────────────
export default function EnglishRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <LocaleProvider locale="en">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer locale="en" />
        </LocaleProvider>
      </body>
    </html>
  );
}
