import type { Metadata } from "next";
import "../globals.css";
import { cormorant, dmSans } from "../fonts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { organizationSchema } from "@/lib/seo";

// ─── Root Metadata (Deutsch) ────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://www.sarfi-collection.de"),
  title: {
    default: "SARFI Collection – Exklusive Ferienunterkünfte im Bayerischen Wald",
    template: "%s | SARFI Collection",
  },
  description:
    "Entdecke einzigartige Ferienunterkünfte im Bayerischen Wald. HAUS28 – modernes A-Frame mitten im Wald. Haus Schönblick – Panorama-Apartments mit atemberaubender Aussicht.",
  keywords: [
    "Ferienhaus Bayerischer Wald",
    "A-Frame Ferienhaus Deutschland",
    "Ferienhaus Büchelstein",
    "Unterkunft Büchelstein",
    "Ferienhaus Grattersdorf",
    "Ferienwohnung Schöfweg",
    "Urlaub Bayerischer Wald",
    "HAUS28 Büchelstein Grattersdorf",
    "A-Frame Büchelstein",
    "Haus Schönblick Schöfweg",
    "Ferienunterkunft Niederbayern",
    "Ferienhaus Pullman City Bayerischer Wald",
    "Unterkunft nahe Pullman City",
  ],
  authors: [{ name: "SARFI Collection" }],
  creator: "SARFI Collection",
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "https://www.sarfi-collection.de",
    siteName: "SARFI Collection",
    title: "SARFI Collection – Exklusive Ferienunterkünfte im Bayerischen Wald",
    description:
      "Zwei einzigartige Ferienunterkünfte mitten im Bayerischen Wald. Buche direkt und spare.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SARFI Collection – Exklusive Ferienunterkünfte im Bayerischen Wald",
    description: "Zwei einzigartige Ferienunterkünfte mitten im Bayerischen Wald.",
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
  verification: {
    google: "eXWn8iad1B56rLWFv_qoKxcZgacLS2k4KR",
  },
};

// ─── Root Layout (Deutsch, URLs ohne Präfix) ────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <LocaleProvider locale="de">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer locale="de" />
        </LocaleProvider>
      </body>
    </html>
  );
}
