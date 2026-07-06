import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Die /buchen-Unterseiten und /rechnung tragen Meta-noindex; Google kann
      // das nur lesen, wenn Crawlen erlaubt ist – daher hier NICHT disallowen.
      disallow: ["/api/"],
    },
    sitemap: "https://www.sarfi-collection.de/sitemap.xml",
  };
}
