import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { hasEnglishVersion, localizedUrl } from "@/lib/i18n";

const BASE_URL = "https://www.sarfi-collection.de";

type Freq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

/**
 * Eintrag für einen deutschen Pfad; existiert eine englische Version,
 * werden hreflang-Alternates gesetzt und zusätzlich die /en-URL gelistet.
 */
function entries(path: string, changeFrequency: Freq, priority: number): MetadataRoute.Sitemap {
  const url = path === "/" ? BASE_URL : `${BASE_URL}${path}`;
  if (!hasEnglishVersion(path)) {
    return [{ url, changeFrequency, priority }];
  }
  const languages = {
    de: localizedUrl(path, "de"),
    en: localizedUrl(path, "en"),
  };
  return [
    { url, changeFrequency, priority, alternates: { languages } },
    { url: localizedUrl(path, "en"), changeFrequency, priority, alternates: { languages } },
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...entries("/", "weekly", 1),
    ...entries("/haus28", "weekly", 0.9),
    ...entries("/schoenblick", "weekly", 0.9),
    ...entries("/buchen", "weekly", 0.8),
    ...entries("/schoenblick/b5", "weekly", 0.8),
    ...entries("/schoenblick/b6", "weekly", 0.8),
    ...entries("/schoenblick/b7", "weekly", 0.8),
    ...entries("/schoenblick/b8", "weekly", 0.8),
    ...entries("/schoenblick/a2", "weekly", 0.8),
    ...entries("/blog", "weekly", 0.7),
    ...entries("/ausflugsziele", "monthly", 0.7),
    ...entries("/gutschein", "yearly", 0.5),
    ...entries("/ueber-uns", "monthly", 0.5),
    ...entries("/kontakt", "monthly", 0.5),
    ...entries("/impressum", "yearly", 0.2),
    ...entries("/datenschutz", "yearly", 0.2),
    ...entries("/agb", "yearly", 0.2),
    ...blogPosts,
  ];
}
