"use client";

import { useState } from "react";
import { IconMapPin } from "@/components/ui/Icons";

// Kompakte, filterbare Übersicht aller Ausflugsziele.
// Reine Client-Interaktion (Kategorie-Filter), Daten kommen serialisiert
// aus der Server-Page – so bleibt die Seite statisch renderbar.

export type OverviewCategory = {
  id: string;
  label: string;
  emoji: string;
};

export type OverviewItem = {
  id: string;
  emoji: string;
  name: string;
  anchor: string;
  categories: string[];
  haus28: string;
  schoenblick: string;
  season: string;
  audience: string;
};

export default function AusflugszieleFilter({
  categories,
  items,
}: {
  categories: OverviewCategory[];
  items: OverviewItem[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const visible = active ? items.filter((i) => i.categories.includes(active)) : items;

  return (
    <div>
      {/* Filter chips */}
      <div
        role="group"
        aria-label="Ausflugsziele nach Kategorie filtern"
        className="flex flex-wrap gap-2 mb-8"
      >
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          className={`px-4 py-2 rounded-full font-body text-sm transition-colors border ${
            active === null
              ? "bg-forest-900 text-cream-50 border-forest-900"
              : "bg-white text-forest-700 border-cream-200 hover:border-forest-300"
          }`}
        >
          Alle
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(active === c.id ? null : c.id)}
            aria-pressed={active === c.id}
            className={`px-4 py-2 rounded-full font-body text-sm transition-colors border ${
              active === c.id
                ? "bg-forest-900 text-cream-50 border-forest-900"
                : "bg-white text-forest-700 border-cream-200 hover:border-forest-300"
            }`}
          >
            <span aria-hidden="true">{c.emoji}</span> {c.label}
          </button>
        ))}
      </div>

      {/* Compact cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-live="polite">
        {visible.map((item) => (
          <a
            key={item.id}
            href={`#${item.anchor}`}
            className="group flex flex-col rounded-2xl border border-cream-200 bg-white p-5 shadow-card hover:shadow-card-lg transition-shadow"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-2xl" aria-hidden="true">{item.emoji}</span>
              <span className="font-display text-lg text-forest-900 leading-snug group-hover:underline underline-offset-2">
                {item.name}
              </span>
            </div>
            <dl className="space-y-1.5 font-body text-sm text-forest-700 mb-3">
              <div className="flex items-start gap-2">
                <dt className="flex items-center gap-1 text-forest-500 w-28 flex-none text-xs pt-0.5">
                  <IconMapPin size={11} /> ab HAUS28
                </dt>
                <dd>{item.haus28}</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="flex items-center gap-1 text-forest-500 w-28 flex-none text-xs pt-0.5">
                  <IconMapPin size={11} /> ab Schönblick
                </dt>
                <dd>{item.schoenblick}</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="text-forest-500 w-28 flex-none text-xs pt-0.5">Saison</dt>
                <dd>{item.season}</dd>
              </div>
              <div className="flex items-start gap-2">
                <dt className="text-forest-500 w-28 flex-none text-xs pt-0.5">Für wen</dt>
                <dd>{item.audience}</dd>
              </div>
            </dl>
            <span className="mt-auto font-body text-sm text-gold-600 group-hover:text-gold-700">
              Details ansehen ↓
            </span>
          </a>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="font-body text-sm text-forest-500 mt-4">
          Für diese Kategorie haben wir aktuell keinen Eintrag.
        </p>
      )}
    </div>
  );
}
