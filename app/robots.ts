import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/haus28/buchen",
        "/schoenblick/buchen",
        "/schoenblick/b5/buchen",
        "/schoenblick/b6/buchen",
        "/schoenblick/b7/buchen",
        "/schoenblick/b8/buchen",
        "/schoenblick/a2/buchen",
      ],
    },
    sitemap: "https://www.sarfi-collection.de/sitemap.xml",
  };
}
