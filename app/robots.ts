import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/haus28/buchen", "/schoenblick/buchen"],
    },
    sitemap: "https://www.sarfi-collection.de/sitemap.xml",
  };
}
