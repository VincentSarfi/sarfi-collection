import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";
import { SpeedInsights } from "@vercel/speed-insights/next";

// ─── Fonts ──────────────────────────────────────────────────────────────────
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});

// ─── Root Metadata ──────────────────────────────────────────────────────────
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
    "Ferienwohnung Schöfweg",
    "Urlaub Bayerischer Wald",
    "HAUS28 Grattersdorf",
    "Haus Schönblick",
    "Ferienunterkunft Niederbayern",
    "Luxus Ferienhaus Wald",
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
    images: [
      {
        url: "/og-image.jpg", // TODO: Create OG image
        width: 1200,
        height: 630,
        alt: "SARFI Collection – Ferienunterkünfte im Bayerischen Wald",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SARFI Collection – Exklusive Ferienunterkünfte im Bayerischen Wald",
    description: "Zwei einzigartige Ferienunterkünfte mitten im Bayerischen Wald.",
    images: ["/og-image.jpg"], // TODO: Create OG image
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
    google: "TODO_GOOGLE_SEARCH_CONSOLE_TOKEN", // TODO: eintragen
  },
};

// ─── Root Layout ────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream-50">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <SpeedInsights />
      </body>
    </html>
  );
}
