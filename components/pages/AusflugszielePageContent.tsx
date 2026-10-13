import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconArrowRight, IconMapPin } from "@/components/ui/Icons";
import { ausflugszieleMaterial, gasthausMaterial, wanderungBilder, type AusflugszielMaterial, type BildFreigabe } from "@/data/ausflugsziele-bildmaterial";
import SteinbergliftWebcam from "@/components/pages/SteinbergliftWebcam";
import DetailsHashOpener from "@/components/pages/DetailsHashOpener";
import AusflugFilterHelfer from "@/components/pages/AusflugFilterHelfer";
import { driveMinutes, restaurants } from "@/data/surroundings";
import { getDict, localizedUrl, localizeHref, type Locale } from "@/lib/i18n";

const SITE = "https://www.sarfi-collection.de";

// Symbol je Ausflugsziel, wenn kein freigegebenes Foto da ist
// (Texte: locales/*/ausflugsziele.ts, Websites/Fotos: data/ausflugsziele-bildmaterial.ts).
const ATTRACTION_EMOJI: Record<string, string> = {
  "pullman-city": "🤠",
  baumwipfelpfad: "🌲",
  nationalpark: "🦌",
  "skigebiet-sonnenwald": "⛷️",
  "indoor-golf": "⛳",
  elypso: "🏊",
  joska: "💎",
  arber: "🏔️",
  passau: "⛪",
  museumsdorf: "🏡",
  "glasmuseum-frauenau": "🏛️",
};

// schema.org-Typ und Ort je Ausflugsziel
const ATTRACTION_SCHEMA: Record<string, { type: string; locality: string }> = {
  "pullman-city": { type: "TouristAttraction", locality: "Eging am See" },
  baumwipfelpfad: { type: "TouristAttraction", locality: "Neuschönau" },
  nationalpark: { type: "Park", locality: "Neuschönau" },
  "skigebiet-sonnenwald": { type: "SportsActivityLocation", locality: "Langfurth / Schöfweg" },
  "indoor-golf": { type: "SportsActivityLocation", locality: "Deggendorf" },
  elypso: { type: "SportsActivityLocation", locality: "Deggendorf" },
  joska: { type: "TouristAttraction", locality: "Bodenmais" },
  arber: { type: "TouristAttraction", locality: "Bayerisch Eisenstein" },
  passau: { type: "TouristAttraction", locality: "Passau" },
  museumsdorf: { type: "Museum", locality: "Tittling" },
  "glasmuseum-frauenau": { type: "Museum", locality: "Frauenau" },
};

/** ItemList der Ausflugsziele inkl. Büchelstein- und Brotjacklriegel-Wanderung (JSON-LD). */
export function ausflugszieleJsonLd(locale: Locale) {
  const t = getDict(locale).ausflugsziele;
  const items = [
    ...t.attractions.map((attr) => {
      const material = ausflugszieleMaterial[attr.id];
      const bilder = material?.bilder ?? [];
      return {
        "@type": ATTRACTION_SCHEMA[attr.id].type,
        name: attr.schemaName,
        description: attr.schemaDescription,
        url: material?.website,
        ...(bilder.length > 0 ? { image: bilder.map((b) => SITE + b.src) } : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: ATTRACTION_SCHEMA[attr.id].locality,
          addressCountry: "DE",
        },
      };
    }),
    {
      "@type": "TouristAttraction",
      name: t.hike.schemaName,
      description: t.hike.schemaDescription,
      ...(wanderungBilder.length > 0 ? { image: wanderungBilder.map((b) => SITE + b.src) } : {}),
    },
    {
      "@type": "TouristAttraction",
      name: t.brotjacklriegel.schemaName,
      description: t.brotjacklriegel.schemaDescription,
      url: ausflugszieleMaterial[BROTJACKL_ID]?.website,
    },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.schemaListName,
    description: t.schemaListDescription,
    url: localizedUrl("/ausflugsziele", locale),
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, item })),
  };
}

const SEASON_EMOJI = ["🌸", "☀️", "🍂", "❄️"];

// Großer Büchelstein – in der Wegpunkt-Liste hervorgehoben (Reihenfolge wie hike.waypoints)
const WAYPOINT_HIGHLIGHT = 1;

// Filter der Liste (CSS-only, siehe .ausflug-filter in globals.css).
// Zuordnung sprachunabhängig; die sichtbaren Tags kommen aus den Locales.
// „essen“ zeigt nur die Gasthäuser; die Gasthäuser gehören zu keinem anderen Filter
type FilterKey = "kinder" | "regen" | "winter" | "essen";
const FILTER_KEYS: FilterKey[] = ["kinder", "regen", "winter", "essen"];
const ATTRACTION_FILTER: Record<string, FilterKey[]> = {
  "pullman-city": ["kinder"],
  baumwipfelpfad: ["kinder"],
  nationalpark: ["kinder"],
  "skigebiet-sonnenwald": ["kinder", "winter"],
  "indoor-golf": ["regen"],
  elypso: ["kinder", "regen", "winter"],
  joska: ["kinder", "regen"],
  arber: ["winter"],
  passau: ["regen"],
  museumsdorf: ["kinder"],
  "glasmuseum-frauenau": ["kinder", "regen"],
  // Sonnenwald-Erlebnispfad, „besonders für Kinder und Familien“ (Touristikverein, 13.10.2026)
  brotjacklriegel: ["kinder"],
  einkehren: ["essen"],
};

// Fahrzeit-Eintrag je Ziel in data/surroundings.ts – Quelle für die Minuten der Leiste
const DRIVE_KEY: Record<string, keyof typeof driveMinutes> = {
  "pullman-city": "pullmanCity",
  baumwipfelpfad: "nationalparkLusen",
  nationalpark: "nationalparkLusen",
  "skigebiet-sonnenwald": "steinberglift",
  "indoor-golf": "ruselArena",
  elypso: "elypso",
  joska: "joska",
  arber: "arber",
  passau: "passau",
  museumsdorf: "museumsdorf",
  "glasmuseum-frauenau": "glasmuseumFrauenau",
  brotjacklriegel: "brotjacklriegel",
};

// Die Liste ist die Fahrzeit-Leiste: drei Abschnitte, innerhalb nach Minuten.
// HIKE_ID, BROTJACKL_ID und EINKEHR_ID sind eigene Einträge (Wanderungen bzw. Gasthäuser).
const HIKE_ID = "buechelstein-wanderung";
const BROTJACKL_ID = "brotjacklriegel";
const EINKEHR_ID = "einkehren";
const GROUPS: { key: "naehe" | "nah" | "weiter"; ids: string[] }[] = [
  { key: "naehe", ids: [HIKE_ID, BROTJACKL_ID, "skigebiet-sonnenwald", EINKEHR_ID] },
  { key: "nah", ids: ["indoor-golf", "museumsdorf", "pullman-city", "elypso"] },
  { key: "weiter", ids: ["glasmuseum-frauenau", "baumwipfelpfad", "nationalpark", "joska", "passau", "arber"] },
];

/** Texte einer Wanderung (locales: hike, brotjacklriegel) */
type WanderungTexte = {
  heading: string;
  cardNote: string;
  cardTags: string[];
  intro: string;
  notice?: string;
  stats: { label: string; value: string }[];
  waypoints?: { name: string; detail: string }[];
  routeSummary?: string;
  moreRoutesHeading?: string;
  moreRoutes?: { name: string; detail: string }[];
  mapStrong?: string;
  mapText?: string;
  cta: string;
};

/** „{von}–{bis}“ in einem Locale-Text füllen */
function spanne(text: string, minuten: number[]) {
  return text.replace("{von}", String(Math.min(...minuten))).replace("{bis}", String(Math.max(...minuten)));
}

/** „~5 min“ → 5 (Fahrzeiten der Gasthäuser stehen als Text in data/surroundings.ts) */
const minutenAus = (s: string) => parseInt(s.replace(/\D/g, ""), 10);

/** „~5 min“ ohne Umbruch zwischen Zahl und Einheit */
const nbsp = (s: string) => s.replace(/ /g, " ");

/** Minuten eines Eintrags ab beiden Häusern */
function minutenVon(id: string): number[] {
  if (id === HIKE_ID) return [0];
  if (id === EINKEHR_ID) return restaurants.flatMap((r) => [minutenAus(r.fromHaus28), minutenAus(r.fromSchoenblick)]);
  const key = DRIVE_KEY[id];
  return key ? [driveMinutes[key].haus28, driveMinutes[key].schoenblick] : [];
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="flex-none text-forest-400 transition-transform duration-200 group-open/item:rotate-180"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

// Raster der Fahrzeit-Leiste: links die Minuten-Spalte, rechts der Inhalt
const LEISTE = "grid grid-cols-[2.75rem_1fr] sm:grid-cols-[4.5rem_1fr] gap-x-2.5 sm:gap-x-5";

const linkKlasse =
  "inline-flex items-center gap-1.5 font-body text-sm text-forest-700 hover:text-forest-900 underline underline-offset-2 decoration-forest-300 hover:decoration-forest-700 transition-colors";

/** Ausflugsziele-Seite (Inhalt) – von app/(de)/ausflugsziele und app/(en)/en/ausflugsziele gerendert. */
export default function AusflugszielePageContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).ausflugsziele;
  const href = (path: string) => localizeHref(path, locale);

  /** Minuten-Marke auf der Leiste: „25“, „40–45“, „≤ 10“ oder „zu Fuß“ */
  const marke = (id: string) => {
    const m = minutenVon(id);
    const min = Math.min(...m);
    const max = Math.max(...m);
    if (max === 0) return { zahl: t.leiste.zuFuss, einheit: "" };
    if (min === 0) return { zahl: `≤${max}`, einheit: t.leiste.min };
    return { zahl: min === max ? String(min) : `${min}–${max}`, einheit: t.leiste.min };
  };

  /** Eine Zeile der Leiste: links die Minuten, rechts der aufklappbare Eintrag */
  const zeile = (id: string, filter: string, inhalt: ReactNode) => {
    const { zahl, einheit } = marke(id);
    return (
      <li key={id} data-filter={filter} className={LEISTE}>
        <div className="relative flex justify-center before:absolute before:inset-y-0 before:left-1/2 before:w-px before:bg-cream-300" aria-hidden="true">
          <div className="relative self-start mt-4 sm:mt-6 flex flex-col items-center justify-center w-full sm:w-auto sm:min-w-[3.5rem] rounded-full border border-gold-300 bg-cream-50 px-1 sm:px-1.5 py-1.5 font-body leading-none">
            <span className="text-[11px] sm:text-sm font-semibold text-forest-900 tabular-nums whitespace-nowrap">{zahl}</span>
            {einheit && <span className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-gold-700">{einheit}</span>}
          </div>
        </div>
        <div className="pb-3 sm:pb-4 min-w-0">{inhalt}</div>
      </li>
    );
  };

  /** Kopfzeile eines Eintrags (summary): Bild oder Symbol, Name, Untertitel, Tags */
  const kopf = (opts: { name: string; untertitel: string; tags: string[]; emoji: string; dunkel?: boolean; foto?: { src: string; alt: string; credit: string; lizenz?: { name: string; url: string } } }) => (
    <summary className="flex items-center gap-2.5 sm:gap-4 p-2.5 sm:p-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden rounded-2xl">
      <div
        className={`relative flex-none w-14 h-14 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex items-center justify-center text-2xl sm:text-4xl ${opts.dunkel ? "bg-forest-900" : "bg-cream-100"}`}
      >
        {opts.foto ? (
          <Image src={opts.foto.src} alt={opts.foto.alt} fill className="object-cover" sizes="80px" />
        ) : (
          <span aria-hidden="true">{opts.emoji}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-lg sm:text-2xl leading-tight text-forest-900">{opts.name}</h3>
        <p className="font-body text-[13px] sm:text-sm text-forest-600 leading-snug line-clamp-1">{opts.untertitel}</p>
        {(opts.tags.length > 0 || opts.foto) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1">
            {opts.tags.map((tag) => (
              <span key={tag} className="px-1.5 sm:px-2 py-0.5 rounded-full bg-forest-50 text-forest-700 font-body text-[10px] sm:text-[11px] font-medium">
                {tag}
              </span>
            ))}
            {opts.foto?.credit && (
              <span className="font-body text-[10px] text-forest-500">
                {t.photoLabel}: {opts.foto.credit}
                {opts.foto.lizenz && ` · ${opts.foto.lizenz.name}`}
              </span>
            )}
          </div>
        )}
      </div>
      <Chevron />
    </summary>
  );

  const karte = "group/item rounded-2xl bg-white border border-cream-200 transition-shadow hover:shadow-card open:shadow-card scroll-mt-36";
  const koerper = "px-2.5 pb-4 sm:px-5 sm:pb-6 pt-1 space-y-4 sm:space-y-5";

  /** Offizielle Website + freigegebene Zusatzlinks (nur aus data/ausflugsziele-bildmaterial.ts) */
  const offizielleLinks = (material: AusflugszielMaterial) => (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <a href={material.website} target="_blank" rel="noopener noreferrer" className={linkKlasse}>
        {t.officialWebsiteLabel}
        <span className="text-xs text-forest-500">({new URL(material.website).hostname.replace(/^www\./, "")})</span>
        <ExternalIcon />
        <span className="sr-only"> {t.newTabHint}</span>
      </a>
      {material.links?.map((l) => (
        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className={`${linkKlasse} font-medium`}>
          {l.label[locale]}
          <ExternalIcon />
          <span className="sr-only"> {t.newTabHint}</span>
        </a>
      ))}
    </div>
  );

  /** Ausflugsziel: Fotos/Webcam zum Wischen, Anfahrt, Beschreibung, Highlights, Infos, Links */
  const ziel = (id: string) => {
    const attr = t.attractions.find((a) => a.id === id);
    if (!attr) return null;
    const material = ausflugszieleMaterial[id];
    const bilder = material?.bilder ?? [];
    const thumb = bilder[0];
    const streifen = bilder.length > 0 || material?.webcam;
    return zeile(
      id,
      (ATTRACTION_FILTER[id] ?? []).join(" "),
      <details id={id} className={karte}>
        {kopf({
          name: attr.name,
          untertitel: attr.subtitle,
          tags: attr.cardTags,
          emoji: ATTRACTION_EMOJI[id],
          foto: thumb ? { src: thumb.src, alt: thumb.alt[locale], credit: thumb.credit } : undefined,
        })}
        <div className={koerper}>
          {streifen && (
            <div className="relative flex gap-3 -mx-2.5 px-2.5 sm:-mx-5 sm:px-5 scroll-px-2.5 sm:scroll-px-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {material?.webcam && (
                <div className="flex-none w-[80%] sm:w-[48%] snap-start [&>figure]:max-w-none">
                  <SteinbergliftWebcam page={material.webcam.seite} labels={{ ...t.webcam, newTab: t.newTabHint }} />
                </div>
              )}
              {bilder.map((b) => (
                <figure key={b.src} className="m-0 flex-none w-[80%] sm:w-[48%] snap-start">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-cream-100">
                    <Image src={b.src} alt={b.alt[locale]} fill className="object-cover" sizes="(max-width: 640px) 80vw, 420px" />
                  </div>
                  <figcaption className="mt-1 font-body text-[11px] text-forest-500 leading-snug">
                    {t.photoLabel}: {b.credit}
                      {b.lizenz && (
                        <>
                          {" · "}
                          <a href={b.lizenz.url} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2 hover:text-forest-700">
                            {b.lizenz.name}
                          </a>
                        </>
                      )}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          <p className="flex items-start gap-1.5 font-body text-xs text-forest-600">
            <IconMapPin size={13} />
            <span>
              {t.distanceTable.colHaus28} {attr.fromHaus28} · {t.distanceTable.colSchoenblick} {attr.fromSchoenblick}
            </span>
          </p>

          <p className="font-body text-[15px] text-forest-700 leading-relaxed">{attr.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 rounded-xl bg-cream-50 p-4">
            <div>
              <p className="font-body text-[11px] font-semibold tracking-[0.12em] uppercase text-gold-700 mb-2">{t.highlightsLabel}</p>
              <ul className="space-y-1.5">
                {attr.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 font-body text-sm text-forest-700 leading-snug">
                    <span className="mt-[0.45rem] w-1 h-1 rounded-full bg-gold-500 flex-none" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-body text-[11px] font-semibold tracking-[0.12em] uppercase text-gold-700 mb-2">{t.practicalLabel}</p>
              <dl className="space-y-1.5">
                {attr.practicalInfo.map((info) => (
                  <div key={info.label} className="font-body text-sm leading-snug">
                    <dt className="inline font-medium text-forest-900">{info.label}: </dt>
                    <dd className="inline text-forest-700">{info.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {offizielleLinks(material)}
        </div>
      </details>,
    );
  };

  /**
   * Wanderung ab der Haustür (Büchelstein ab HAUS28, Brotjacklriegel ab Haus Schönblick):
   * Eckdaten, ggf. Hinweis, Wegpunkte (echte Reihenfolge, daher nummeriert) oder weitere Wege.
   */
  const wanderung = (
    id: string,
    w: WanderungTexte,
    opts: { emoji: string; bilder: BildFreigabe[]; ctaHref: string; highlight?: number },
  ) =>
    zeile(
      id,
      (ATTRACTION_FILTER[id] ?? []).join(" "),
      <details id={id} className={karte}>
        {kopf({
          name: w.heading,
          untertitel: w.cardNote,
          tags: w.cardTags,
          emoji: opts.emoji,
          dunkel: true,
          foto: opts.bilder[0]
            ? { src: opts.bilder[0].src, alt: opts.bilder[0].alt[locale], credit: opts.bilder[0].credit, lizenz: opts.bilder[0].lizenz }
            : undefined,
        })}
        <div className={koerper}>
          {opts.bilder.length > 0 && (
            <div className="relative flex gap-3 -mx-2.5 px-2.5 sm:-mx-5 sm:px-5 scroll-px-2.5 sm:scroll-px-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {opts.bilder.map((b) => (
                <figure key={b.src} className="m-0 flex-none w-[80%] sm:w-[48%] snap-start">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-cream-100">
                    <Image src={b.src} alt={b.alt[locale]} fill className="object-cover" sizes="(max-width: 640px) 80vw, 420px" />
                  </div>
                  {b.credit && (
                    <figcaption className="mt-1 font-body text-[11px] text-forest-500 leading-snug">
                      {t.photoLabel}: {b.credit}
                      {b.lizenz && (
                        <>
                          {" · "}
                          <a href={b.lizenz.url} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2 hover:text-forest-700">
                            {b.lizenz.name}
                          </a>
                        </>
                      )}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
          <p className="font-body text-[15px] text-forest-700 leading-relaxed">{w.intro}</p>
          {w.notice && (
            <p role="note" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-body text-sm text-amber-900 leading-snug">
              {w.notice}
            </p>
          )}
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 rounded-xl bg-cream-50 p-4">
            {w.stats.map((s) => (
              <div key={s.label}>
                <dt className="font-body text-[11px] uppercase tracking-[0.1em] text-gold-700">{s.label}</dt>
                <dd className="font-body text-sm text-forest-900 leading-snug [overflow-wrap:anywhere]">{s.value}</dd>
              </div>
            ))}
          </dl>
          {w.waypoints && w.waypoints.length > 0 && (
            <div>
              <p className="font-body text-[11px] font-semibold tracking-[0.12em] uppercase text-gold-700 mb-2">{w.routeSummary}</p>
              <ol className="space-y-2.5">
                {w.waypoints.map((wp, i) => (
                  <li key={wp.name} className="flex gap-3">
                    <span
                      className={`flex-none mt-0.5 w-6 h-6 rounded-full flex items-center justify-center font-body text-xs font-semibold tabular-nums ${i === opts.highlight ? "bg-gold-500 text-forest-900" : "bg-forest-50 text-forest-700"}`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-body text-sm font-semibold text-forest-900">{wp.name}</p>
                      <p className="font-body text-sm text-forest-600 leading-snug">{wp.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {w.moreRoutes && w.moreRoutes.length > 0 && (
            <div>
              <p className="font-body text-[11px] font-semibold tracking-[0.12em] uppercase text-gold-700 mb-2">{w.moreRoutesHeading}</p>
              <ul className="space-y-1.5">
                {w.moreRoutes.map((r) => (
                  <li key={r.name} className="flex items-start gap-2 font-body text-sm text-forest-700 leading-snug">
                    <span className="mt-[0.45rem] w-1 h-1 rounded-full bg-gold-500 flex-none" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold text-forest-900">{r.name}:</strong> {r.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {w.mapStrong && (
            <p className="font-body text-sm text-forest-700">
              <strong className="text-forest-900">{w.mapStrong}</strong>
              {w.mapText}
            </p>
          )}
          {ausflugszieleMaterial[id] && offizielleLinks(ausflugszieleMaterial[id])}
          <Link
            href={href(opts.ctaHref)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-forest-900 text-sm font-body font-medium rounded-full hover:bg-gold-400 transition-colors"
          >
            {w.cta}
            <IconArrowRight size={14} />
          </Link>
        </div>
      </details>,
    );

  /** Gasthäuser in der Nähe (data/surroundings.ts – dieselbe Quelle wie Gruppenseite & FAQ) */
  const einkehr = () => {
    const titelbild = restaurants.map((r) => gasthausMaterial[r.name]?.bilder[0]).find(Boolean);
    return zeile(
      EINKEHR_ID,
      (ATTRACTION_FILTER[EINKEHR_ID] ?? []).join(" "),
      <details id={EINKEHR_ID} className={karte}>
        {kopf({
          name: t.restaurants.heading,
          untertitel: restaurants.map((r) => r.name.replace(/ \(.*\)$/, "")).join(" · "),
          tags: [],
          emoji: "🍽️",
          foto: titelbild ? { src: titelbild.src, alt: titelbild.alt[locale], credit: titelbild.credit } : undefined,
        })}
        <div className={koerper}>
          <p className="font-body text-[15px] text-forest-700 leading-relaxed">{t.restaurants.intro}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {restaurants.map((r) => (
              <li
                key={r.name}
                className={`flex flex-col rounded-xl bg-cream-50 p-4 ${gasthausMaterial[r.name] ? "sm:col-span-2" : ""}`}
              >
                {(gasthausMaterial[r.name]?.bilder ?? []).length > 0 && (
                  <div className="relative flex gap-2 -mx-4 -mt-4 mb-3 px-4 pt-4 scroll-px-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {gasthausMaterial[r.name].bilder.map((b) => (
                      <figure key={b.src} className="m-0 flex-none w-[85%] sm:w-[calc(50%-0.25rem)] snap-start">
                        <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-cream-100">
                          <Image src={b.src} alt={b.alt[locale]} fill className="object-cover" sizes="(max-width: 640px) 75vw, 420px" />
                        </div>
                        <figcaption className="mt-1 font-body text-[10px] text-forest-500">
                          {t.photoLabel}: {b.credit}
                      {b.lizenz && (
                        <>
                          {" · "}
                          <a href={b.lizenz.url} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2 hover:text-forest-700">
                            {b.lizenz.name}
                          </a>
                        </>
                      )}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                )}
                <p className="font-body text-sm font-semibold text-forest-900">{r.name}</p>
                <p className="font-body text-xs text-forest-500 mb-2">{locale === "en" ? r.placeEn : r.place}</p>
                <p className="font-body text-sm text-forest-700 leading-snug mb-3">{locale === "en" ? r.en : r.de}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                  <span className="font-body text-[11px] text-forest-500">
                    {t.distanceTable.colHaus28} {nbsp(r.fromHaus28)} · {t.distanceTable.colSchoenblick} {nbsp(r.fromSchoenblick)}
                  </span>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className={linkKlasse}>
                    {t.restaurants.websiteLabel}
                    <ExternalIcon />
                    <span className="sr-only"> {t.newTabHint}</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </details>,
    );
  };

  return (
    <>
      <DetailsHashOpener />
      <AusflugFilterHelfer einkehrId={EINKEHR_ID} />

      {/* Hero – kompakt, die Liste soll schnell im Bild sein */}
      <section className="relative bg-forest-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/shared/region-bayerischer-wald.jpg')] bg-cover bg-center opacity-25" />
        <div className="relative z-10 container-site py-10 md:py-14">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex items-center gap-2 font-body text-sm text-cream-50/50">
                <li><Link href={href("/")} className="hover:text-cream-50/80 transition-colors">{t.breadcrumbHome}</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-cream-50/80">{t.breadcrumbCurrent}</li>
              </ol>
            </nav>
            <div className="max-w-3xl">
              <p className="font-body text-xs sm:text-sm tracking-[0.15em] uppercase text-gold-400 mb-3">{t.hero.eyebrow}</p>
              <h1 className="font-display text-display-lg text-cream-50 mb-4 text-balance">{t.hero.h1}</h1>
              <p className="font-body text-base sm:text-lg text-cream-50/70 leading-relaxed mb-6 max-w-2xl">{t.hero.intro}</p>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href={href("/haus28")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cream-50/10 border border-cream-50/20 text-cream-50/80 text-sm font-body rounded-full hover:bg-cream-50/15 transition-colors"
                >
                  <IconMapPin size={13} />
                  {t.hero.pillHaus28}
                </Link>
                <Link
                  href={href("/schoenblick")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-cream-50/10 border border-cream-50/20 text-cream-50/80 text-sm font-body rounded-full hover:bg-cream-50/15 transition-colors"
                >
                  <IconMapPin size={13} />
                  {t.hero.pillSchoenblick}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fahrzeit-Leiste: alle Ziele in einer Liste, nach Minuten ab der Haustür ── */}
      <section className="bg-cream-50 pb-10 md:pb-16" aria-labelledby="leiste-heading">
        <div className="container-site">
          <div className="max-w-4xl mx-auto">
            <h2 id="leiste-heading" className="sr-only">{t.overview.heading}</h2>

            <div className="ausflug-filter">
              {/* Filter ohne JS: Radios + :has() in globals.css; bleibt beim Scrollen oben */}
              <div className="sticky top-16 md:top-[4.5rem] z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 bg-cream-50/95 backdrop-blur-sm border-b border-cream-200 mb-5">
                <div className="relative flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
                  <fieldset className="flex flex-none items-center gap-2">
                    <legend className="sr-only">{t.filter.legend}</legend>
                    <input type="radio" name="ausflug-filter" id="af-alle" defaultChecked className="sr-only" />
                    <label htmlFor="af-alle" className="ausflug-chip">{t.filter.alle}</label>
                    {FILTER_KEYS.map((k) => (
                      <Fragment key={k}>
                        <input type="radio" name="ausflug-filter" id={`af-${k}`} className="sr-only" />
                        <label htmlFor={`af-${k}`} className="ausflug-chip">{t.filter[k]}</label>
                      </Fragment>
                    ))}
                  </fieldset>
                </div>
              </div>

              <ol className="flex flex-col">
                {GROUPS.map((g) => {
                  const gt = t.groups[g.key];
                  const filter = Array.from(new Set(g.ids.flatMap((id) => ATTRACTION_FILTER[id] ?? [])));
                  const minuten = g.ids.flatMap((id) => (id === HIKE_ID || id === BROTJACKL_ID || id === EINKEHR_ID ? [] : minutenVon(id)));
                  return (
                    <li key={g.key} data-filter={filter.join(" ")}>
                      <div className={LEISTE}>
                        <div className={`relative before:absolute before:left-1/2 before:w-px before:bg-cream-300 ${g.key === "naehe" ? "before:top-5 before:bottom-0" : "before:inset-y-0"}`} aria-hidden="true" />
                        <div className="flex flex-wrap items-baseline gap-x-2.5 pt-3 pb-2.5">
                          <p className="font-body text-xs font-semibold tracking-[0.14em] uppercase text-gold-700">{gt.heading}</p>
                          <p className="font-body text-xs text-forest-500">{minuten.length ? spanne(gt.note, minuten) : gt.note}</p>
                        </div>
                      </div>
                      <ol>
                        {g.ids.map((id) =>
                          id === HIKE_ID
                            ? wanderung(HIKE_ID, t.hike, { emoji: "🥾", bilder: wanderungBilder, ctaHref: "/haus28", highlight: WAYPOINT_HIGHLIGHT })
                            : id === BROTJACKL_ID
                              ? wanderung(BROTJACKL_ID, t.brotjacklriegel, { emoji: "⛰️", bilder: ausflugszieleMaterial[BROTJACKL_ID]?.bilder ?? [], ctaHref: "/schoenblick" })
                              : id === EINKEHR_ID
                                ? einkehr()
                                : ziel(id),
                        )}
                      </ol>
                      {gt.hint && (
                        <div className={LEISTE}>
                          <div className="relative before:absolute before:inset-y-0 before:left-1/2 before:w-px before:bg-cream-300" aria-hidden="true" />
                          <p className="pb-4 font-body text-sm text-forest-600">{gt.hint}</p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gut zu wissen: Jahreszeiten + Fahrzeiten-Tabelle (eingeklappt, bleibt im DOM für Snippets) ── */}
      <section className="bg-cream-100 py-10 md:py-14" aria-labelledby="gut-zu-wissen-heading">
        <div className="container-site">
          <div className="max-w-4xl mx-auto">
            <h2 id="gut-zu-wissen-heading" className="font-display text-2xl sm:text-3xl text-forest-900 mb-4">{t.gutZuWissen}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
              <details className="group rounded-2xl border border-cream-200 bg-white">
                <summary className="flex items-center justify-between gap-2 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden px-4 py-3.5 font-body text-sm font-semibold text-forest-900">
                  {t.seasons.heading}
                  <span className="text-forest-400 transition-transform group-open:rotate-180" aria-hidden="true">▾</span>
                </summary>
                <ul className="px-4 pb-4 space-y-2.5">
                  {t.seasons.items.map((s, i) => (
                    <li key={s.season} className="font-body text-sm text-forest-700 leading-relaxed">
                      <span aria-hidden="true">{SEASON_EMOJI[i]} </span>
                      <strong className="font-semibold text-forest-900">{s.season}</strong>{" "}
                      <span className="text-forest-500">({s.months})</span>: {s.activities.join(" · ")}
                    </li>
                  ))}
                </ul>
              </details>

              <details className="group rounded-2xl border border-cream-200 bg-white">
                <summary className="flex items-center justify-between gap-2 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden px-4 py-3.5 font-body text-sm font-semibold text-forest-900">
                  {t.distanceTable.summary}
                  <span className="text-forest-400 transition-transform group-open:rotate-180" aria-hidden="true">▾</span>
                </summary>
                <div className="overflow-x-auto border-t border-cream-200">
                  <table className="w-full font-body text-sm text-left">
                    <caption className="sr-only">{t.distanceTable.heading}</caption>
                    <thead className="bg-cream-50 text-forest-700">
                      <tr>
                        <th scope="col" className="px-3 sm:px-4 py-2.5 font-semibold">{t.distanceTable.colDestination}</th>
                        <th scope="col" className="px-3 sm:px-4 py-2.5 font-semibold">{t.distanceTable.colHaus28}</th>
                        <th scope="col" className="px-3 sm:px-4 py-2.5 font-semibold">{t.distanceTable.colSchoenblick}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-200 text-forest-700">
                      {GROUPS.flatMap((g) => g.ids)
                        .map((id) => t.attractions.find((a) => a.id === id))
                        .filter((attr): attr is (typeof t.attractions)[number] => Boolean(attr))
                        .map((attr) => (
                          <tr key={attr.id}>
                            <th scope="row" className="px-3 sm:px-4 py-2.5 font-medium text-forest-900">
                              <a href={`#${attr.id}`} className="underline underline-offset-2 hover:text-gold-700">
                                {attr.name}
                              </a>
                            </th>
                            <td className="px-3 sm:px-4 py-2.5 whitespace-nowrap">{attr.fromHaus28}</td>
                            <td className="px-3 sm:px-4 py-2.5">{attr.fromSchoenblick}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-forest-900 py-12 md:py-16" aria-labelledby="ausflugsziele-cta-heading">
        <div className="container-site text-center max-w-2xl mx-auto">
          <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-400 mb-3">{t.cta.eyebrow}</p>
          <h2 id="ausflugsziele-cta-heading" className="font-display text-display-md text-cream-50 mb-4 text-balance">
            {t.cta.heading}
          </h2>
          <p className="font-body text-base text-cream-50/60 leading-relaxed mb-7">{t.cta.text}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={href("/haus28")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gold-500 text-forest-900 font-body font-medium rounded-full hover:bg-gold-400 transition-colors shadow-cta"
            >
              {t.cta.haus28}
              <IconArrowRight size={16} />
            </Link>
            <Link
              href={href("/schoenblick")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-cream-50/25 text-cream-50/80 font-body rounded-full hover:border-cream-50/40 hover:text-cream-50 transition-colors"
            >
              {t.cta.schoenblick}
              <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

