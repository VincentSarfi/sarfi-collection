"use client";

import { getDict } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";

// Plattformen, auf denen nur Gäste nach ihrem Aufenthalt bewerten können.
const NUR_GAESTE = ["Airbnb", "Booking.com", "FeWo-direkt"];

function aufzaehlung(names: string[], und: string): string {
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} ${und} ${names.at(-1)}` : names.join("");
}

/**
 * Echtheitshinweis nach § 5b Abs. 3 UWG: steht sichtbar direkt am
 * Bewertungsblock (nicht aufklappbar) und nennt die Plattformen, von denen die
 * gezeigten Bewertungen stammen (reviewPlatforms in data/properties.ts).
 */
export default function ReviewSourceNote({ platforms, className = "" }: { platforms: string[]; className?: string }) {
  const locale = useLocale();
  const t = getDict(locale).property.reviews.sourceNote;
  const nurGaeste = platforms.filter((p) => NUR_GAESTE.includes(p));

  let text = t.shown(aufzaehlung(platforms, t.and));
  if (nurGaeste.length > 0) {
    text += ` ${t.guestsOnly(aufzaehlung(nurGaeste, t.and))}${platforms.includes("Google") ? t.notGoogle : ""}.`;
  }

  return <p className={`font-body text-xs text-forest-500 leading-relaxed ${className}`}>{text}</p>;
}
