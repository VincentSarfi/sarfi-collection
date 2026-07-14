import { dictionaries, type Dictionary } from "@/locales";

export type Locale = "de" | "en";

export const locales: readonly Locale[] = ["de", "en"] as const;
export const defaultLocale: Locale = "de";

export function isLocale(value: unknown): value is Locale {
  return value === "de" || value === "en";
}

/** Dictionary für eine Locale; unbekannte Werte fallen auf Deutsch zurück. */
export function getDict(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/**
 * Interner Pfad → Pfad in der Ziel-Locale.
 * Deutsch bleibt präfixlos (/haus28), Englisch bekommt /en (/en/haus28).
 * Externe URLs und Anker werden unverändert durchgereicht.
 */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith("/")) return path;
  const bare = path.startsWith("/en/") || path === "/en" ? path.replace(/^\/en/, "") || "/" : path;
  if (locale === "de") return bare;
  return bare === "/" ? "/en" : `/en${bare}`;
}

/** Absolute URL der Seite in der jeweiligen Locale (für hreflang/canonical). */
export function localizedUrl(path: string, locale: Locale): string {
  return `https://www.sarfi-collection.de${localizePath(path, locale)}`;
}

/** alternates-Objekt (canonical + hreflang) für eine in beiden Sprachen vorhandene Seite. */
export function alternatesFor(path: string, locale: Locale) {
  return {
    canonical: localizedUrl(path, locale),
    languages: {
      de: localizedUrl(path, "de"),
      en: localizedUrl(path, "en"),
      "x-default": localizedUrl(path, "de"),
    },
  };
}
