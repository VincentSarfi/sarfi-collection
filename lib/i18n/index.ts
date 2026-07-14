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
 * Seiten, die es auch auf Englisch gibt (deutsche Pfade als Referenz).
 * Alles andere (Blog, Ausflugsziele, Rechtliches …) existiert nur auf Deutsch –
 * Links darauf bleiben auch aus /en heraus präfixlos.
 */
const translatedRoutes = new Set([
  "/",
  "/haus28",
  "/haus28/buchen",
  "/schoenblick",
  "/schoenblick/a2",
  "/schoenblick/b5",
  "/schoenblick/b6",
  "/schoenblick/b7",
  "/schoenblick/b8",
  "/schoenblick/a2/buchen",
  "/schoenblick/b5/buchen",
  "/schoenblick/b6/buchen",
  "/schoenblick/b7/buchen",
  "/schoenblick/b8/buchen",
  "/schoenblick/buchen",
  "/buchen",
  "/kontakt",
  "/ueber-uns",
]);

export function hasEnglishVersion(path: string): boolean {
  return translatedRoutes.has(path.split("#")[0]);
}

/** '/en/haus28' → '/haus28', '/en' → '/', deutsche Pfade unverändert. */
export function stripLocale(pathname: string): string {
  if (pathname === "/en") return "/";
  return pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
}

/**
 * Interner Pfad → Pfad in der Ziel-Locale (ohne Rücksicht darauf, ob die
 * Seite übersetzt ist). Für Links besser localizeHref verwenden.
 */
export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith("/")) return path;
  const bare = stripLocale(path);
  if (locale === "de") return bare;
  return bare === "/" ? "/en" : `/en${bare}`;
}

/**
 * Link-Ziel für die aktuelle Locale: übersetzte Seiten bekommen /en-Präfix,
 * nur deutsch existierende Seiten behalten ihren Pfad. Anker bleiben erhalten.
 */
export function localizeHref(path: string, locale: Locale): string {
  if (locale === "de" || !path.startsWith("/")) return path;
  const [bare, hash] = path.split("#");
  if (!hasEnglishVersion(bare)) return path;
  return localizePath(bare, "en") + (hash ? `#${hash}` : "");
}

/**
 * Ziel des Sprachumschalters: dieselbe Seite in der anderen Sprache,
 * falls vorhanden – sonst die Startseite der Zielsprache.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  const bare = stripLocale(pathname);
  if (target === "de") return bare;
  return hasEnglishVersion(bare) ? localizePath(bare, "en") : "/en";
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
