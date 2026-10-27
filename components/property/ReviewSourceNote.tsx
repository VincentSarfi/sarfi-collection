"use client";

import { Fragment, type ReactNode } from "react";
import { getDict } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";

// Plattformen, auf denen nur Gäste nach ihrem Aufenthalt bewerten können.
const NUR_GAESTE = ["Airbnb", "Booking.com", "FeWo-direkt"];

/** „A, B und C“; Namen brechen nicht um („FeWo-direkt“ nicht am Bindestrich). */
function aufzaehlung(names: string[], und: string): ReactNode {
  return names.map((name, i) => (
    <Fragment key={name}>
      {i > 0 && (i === names.length - 1 ? ` ${und} ` : ", ")}
      <span className="whitespace-nowrap">{name}</span>
    </Fragment>
  ));
}

/**
 * Echtheitshinweis nach § 5b Abs. 3 UWG: steht als Fußnote sichtbar unter den
 * Bewertungen (nicht aufklappbar) und nennt die Plattformen, von denen die
 * gezeigten Bewertungen stammen (reviewPlatforms in data/properties.ts).
 */
export default function ReviewSourceNote({ platforms, className = "" }: { platforms: string[]; className?: string }) {
  const locale = useLocale();
  const t = getDict(locale).property.reviews.sourceNote;
  const nurGaeste = platforms.filter((p) => NUR_GAESTE.includes(p));

  return (
    <p className={`font-body text-xs text-forest-500 leading-relaxed text-balance ${className}`}>
      {t.from} {aufzaehlung(platforms, t.and)}.
      {nurGaeste.length > 0 && (
        <>
          {" "}
          {t.guestsOnlyPre} {aufzaehlung(nurGaeste, t.and)}{t.guestsOnlyPost}
        </>
      )}
    </p>
  );
}
