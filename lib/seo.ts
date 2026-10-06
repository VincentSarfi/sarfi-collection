import type { Metadata } from "next";
import { alternatesFor, hasEnglishVersion, localizedUrl, type Locale } from "@/lib/i18n";

export const SITE_URL = "https://www.sarfi-collection.de";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/** Pfad → absolute URL. JSON-LD kennt keine metadataBase, Google erwartet volle URLs. */
export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

// Sprachneutrales Organization-Schema, von beiden Root-Layouts genutzt.
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "SARFI Collection",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.svg`,
  email: "hallo@sarfi-collection.de",
  telephone: "+49 176 56850146",
  // Anschrift laut Impressum
  address: {
    "@type": "PostalAddress",
    streetAddress: "Büchelstein 2",
    postalCode: "94541",
    addressLocality: "Grattersdorf",
    addressRegion: "Bayern",
    addressCountry: "DE",
  },
  sameAs: [
    "https://www.instagram.com/haus28imwald/",
    "https://www.airbnb.de/users/show/582496095",
  ],
};

/** WebSite-Schema je Sprache (Root-Layouts). */
export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "SARFI Collection",
    url: localizedUrl("/", locale),
    inLanguage: locale === "de" ? "de-DE" : "en",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

/** Die Gastgeber als Person-Schema (Über-uns-Seiten). */
export function hostsSchema(locale: Locale) {
  return ["Vincent Sarfi", "Elena Sarfi"].map((name) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle: locale === "de" ? "Gastgeber" : "Host",
    image: absoluteUrl("/images/team/profilbild.jpg"),
    url: localizedUrl("/ueber-uns", locale),
    worksFor: { "@id": ORGANIZATION_ID },
  }));
}

/** BreadcrumbList aus [Name, Pfad]-Paaren. */
export function breadcrumbSchema(items: [name: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: path === "/" ? SITE_URL : absoluteUrl(path),
    })),
  };
}

// Fallback-Vorschaubild für Seiten ohne eigenes Motiv (app/opengraph-image.tsx).
const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "SARFI Collection – Ferienunterkünfte im Bayerischen Wald",
};

export const defaultOgImages = [DEFAULT_OG_IMAGE];

type PageMetadataInput = {
  /** Deutscher Pfad der Seite, z. B. "/haus28" (auch für die englische Fassung). */
  path: string;
  locale: Locale;
  title: string | { absolute: string };
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  image?: { url: string; alt: string };
  type?: "website" | "article";
  noindex?: boolean;
};

/**
 * Einheitliche Seiten-Metadaten: Canonical + hreflang, vollständige
 * Open-Graph-/Twitter-Tags mit korrekter og:url und immer einem Vorschaubild.
 * Nötig, weil Next ein `openGraph`-Objekt der Seite nicht mit dem des Layouts
 * zusammenführt, sondern komplett ersetzt.
 */
export function pageMetadata({
  path,
  locale,
  title,
  description,
  ogTitle,
  ogDescription,
  image,
  type = "website",
  noindex = false,
}: PageMetadataInput): Metadata {
  const translated = hasEnglishVersion(path);
  const url = localizedUrl(path, translated ? locale : "de");
  const shareTitle = ogTitle ?? (typeof title === "string" ? title : title.absolute);
  const shareDescription = ogDescription ?? description;
  const images = image ? [image] : defaultOgImages;

  return {
    title,
    description,
    alternates: translated ? alternatesFor(path, locale) : { canonical: url },
    openGraph: {
      type,
      siteName: "SARFI Collection",
      locale: locale === "de" ? "de_DE" : "en_US",
      url,
      title: shareTitle,
      description: shareDescription,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: shareDescription,
      images,
    },
    ...(noindex && { robots: { index: false, follow: true } }),
  };
}
