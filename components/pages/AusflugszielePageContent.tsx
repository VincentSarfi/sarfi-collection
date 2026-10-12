import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconArrowRight, IconMapPin } from "@/components/ui/Icons";
import { ausflugszieleMaterial } from "@/data/ausflugsziele-bildmaterial";
import SteinbergliftWebcam from "@/components/pages/SteinbergliftWebcam";
import { driveMinutes, restaurants } from "@/data/surroundings";
import { getDict, localizedUrl, localizeHref, type Locale } from "@/lib/i18n";

const SITE = "https://www.sarfi-collection.de";

// Darstellung je Ausflugsziel (Texte: locales/*/ausflugsziele.ts,
// Websites/Links/Bilder: data/ausflugsziele-bildmaterial.ts).
const ATTRACTION_STYLE: Record<
  string,
  { emoji: string; tagColor: string; bgColor: string; borderColor: string }
> = {
  "pullman-city": {
    emoji: "🤠",
    tagColor: "bg-amber-100 text-amber-800",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  baumwipfelpfad: {
    emoji: "🌲",
    tagColor: "bg-green-100 text-green-800",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  nationalpark: {
    emoji: "🦌",
    tagColor: "bg-forest-100 text-forest-800",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },
  "skigebiet-sonnenwald": {
    emoji: "⛷️",
    tagColor: "bg-blue-100 text-blue-800",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
  },
  "indoor-golf": {
    emoji: "⛳",
    tagColor: "bg-lime-100 text-lime-800",
    bgColor: "bg-lime-50",
    borderColor: "border-lime-200",
  },
  elypso: {
    emoji: "🏊",
    tagColor: "bg-cyan-100 text-cyan-800",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
  },
  joska: {
    emoji: "💎",
    tagColor: "bg-violet-100 text-violet-800",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
  },
};

// Stil der Büchelstein-Karte in der Übersicht (eigener Abschnitt, kein attractions-Eintrag)
const HIKE_CARD_STYLE = { emoji: "🥾", tagColor: "bg-forest-100 text-forest-800", bgColor: "bg-forest-50" };

// schema.org-Typ und Ort je Ausflugsziel
const ATTRACTION_SCHEMA: Record<string, { type: string; locality: string }> = {
  "pullman-city": { type: "TouristAttraction", locality: "Eging am See" },
  baumwipfelpfad: { type: "TouristAttraction", locality: "Neuschönau" },
  nationalpark: { type: "Park", locality: "Neuschönau" },
  "skigebiet-sonnenwald": { type: "SportsActivityLocation", locality: "Langfurth / Schöfweg" },
  "indoor-golf": { type: "SportsActivityLocation", locality: "Deggendorf" },
  elypso: { type: "SportsActivityLocation", locality: "Deggendorf" },
  joska: { type: "TouristAttraction", locality: "Bodenmais" },
};

/** ItemList der Ausflugsziele inkl. Büchelstein-Wanderung (JSON-LD). */
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
    { "@type": "TouristAttraction", name: t.hike.schemaName, description: t.hike.schemaDescription },
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

// Reihenfolge wie hike.waypoints: Start, Großer Büchelstein, Kleiner Büchelstein, Rastbuche, Rückweg
const WAYPOINT_ICONS = ["🏠", "🏔️", "⛰️", "⛪", "🏠"];
const WAYPOINT_HIGHLIGHT = 1; // Großer Büchelstein

// Filter der Übersicht (CSS-only, siehe .ausflug-filter in globals.css).
// Zuordnung sprachunabhängig; die sichtbaren Tags kommen aus den Locales.
type FilterKey = "kinder" | "regen" | "winter";
const FILTER_KEYS: FilterKey[] = ["kinder", "regen", "winter"];
const ATTRACTION_FILTER: Record<string, FilterKey[]> = {
  "pullman-city": ["kinder"],
  baumwipfelpfad: ["kinder"],
  nationalpark: ["kinder"],
  "skigebiet-sonnenwald": ["kinder", "winter"],
  "indoor-golf": ["regen"],
  elypso: ["kinder", "regen", "winter"],
  joska: ["kinder", "regen"],
};

// Fahrzeit-Eintrag je Ziel in data/surroundings.ts – daraus die Spannen der Gruppen
const DRIVE_KEY: Record<string, keyof typeof driveMinutes> = {
  "pullman-city": "pullmanCity",
  baumwipfelpfad: "nationalparkLusen",
  nationalpark: "nationalparkLusen",
  "skigebiet-sonnenwald": "steinberglift",
  "indoor-golf": "ruselArena",
  elypso: "elypso",
  joska: "joska",
};

// Gruppen nach Entfernung, innerhalb nach Fahrzeit. HIKE_ID und EINKEHR_ID
// sind eigene Karten (Wanderung bzw. Sprung zu den Gasthäusern).
const HIKE_ID = "buechelstein-wanderung";
const EINKEHR_ID = "einkehren";
const GROUPS: { key: "naehe" | "nah" | "weiter"; ids: string[] }[] = [
  { key: "naehe", ids: [HIKE_ID, "skigebiet-sonnenwald", EINKEHR_ID] },
  { key: "nah", ids: ["indoor-golf", "pullman-city", "elypso"] },
  { key: "weiter", ids: ["baumwipfelpfad", "nationalpark", "joska"] },
];

const EINKEHR_STYLE = { emoji: "🍽️", bgColor: "bg-orange-50" };

/** „{von}–{bis}“ in einem Locale-Text füllen */
function spanne(text: string, minuten: number[]) {
  return text.replace("{von}", String(Math.min(...minuten))).replace("{bis}", String(Math.max(...minuten)));
}

/** „~5 min“ → 5 (Fahrzeiten der Gasthäuser stehen als Text in data/surroundings.ts) */
const minutenAus = (s: string) => parseInt(s.replace(/\D/g, ""), 10);

/** „~5 min“ ohne Umbruch zwischen Zahl und Einheit */
const nbsp = (s: string) => s.replace(/ /g, " ");

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/** Ausflugsziele-Seite (Inhalt) – von app/(de)/ausflugsziele und app/(en)/en/ausflugsziele gerendert. */
export default function AusflugszielePageContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).ausflugsziele;
  const href = (path: string) => localizeHref(path, locale);

  /** Gruppen-Notiz mit Fahrzeit-Spanne aus data/surroundings.ts */
  const gruppenNotiz = (ids: string[], note: string) =>
    spanne(
      note,
      ids.flatMap((id) => {
        const key = DRIVE_KEY[id];
        return key ? [driveMinutes[key].haus28, driveMinutes[key].schoenblick] : [];
      }),
    );

  const kartenKlasse =
    "group flex flex-col rounded-2xl border border-cream-200 bg-white overflow-hidden shadow-card hover:shadow-card-lg transition-shadow";

  const emojiKachel = (emoji: string, bgColor: string) => (
    <div className={`aspect-[16/10] sm:aspect-[3/2] lg:aspect-[2/1] flex items-center justify-center text-5xl ${bgColor}`} aria-hidden="true">
      {emoji}
    </div>
  );

  const kartenText = (name: string, tags: string[], tagColor: string, unten: ReactNode) => (
    <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1">
      <p className="font-body text-sm font-semibold text-forest-900 leading-snug group-hover:underline underline-offset-2">
        {name}
      </p>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span key={tag} className={`px-1.5 py-0.5 rounded-full text-[10px] font-body font-medium ${tagColor}`}>
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="mt-auto font-body text-[11px] text-forest-500 leading-relaxed">{unten}</p>
    </div>
  );

  /** Karte der Übersicht: Ausflugsziel, Wanderung oder Sprung zu den Gasthäusern */
  const karte = (id: string) => {
    if (id === HIKE_ID) {
      return (
        <a key={id} href={`#${HIKE_ID}`} data-filter="" className={kartenKlasse}>
          {emojiKachel(HIKE_CARD_STYLE.emoji, HIKE_CARD_STYLE.bgColor)}
          {kartenText(t.hike.heading, t.hike.cardTags, HIKE_CARD_STYLE.tagColor, t.hike.cardNote)}
        </a>
      );
    }
    if (id === EINKEHR_ID) {
      const minuten = restaurants.flatMap((r) => [minutenAus(r.fromHaus28), minutenAus(r.fromSchoenblick)]);
      return (
        <a key={id} href={`#${EINKEHR_ID}`} data-filter="" className={kartenKlasse}>
          {emojiKachel(EINKEHR_STYLE.emoji, EINKEHR_STYLE.bgColor)}
          {kartenText(t.restaurants.cardTitle, [], "", spanne(t.restaurants.cardNote, minuten))}
        </a>
      );
    }
    const attr = t.attractions.find((a) => a.id === id);
    if (!attr) return null;
    const style = ATTRACTION_STYLE[id];
    const thumb = ausflugszieleMaterial[id]?.bilder[0];
    return (
      <a key={id} href={`#${id}`} data-filter={(ATTRACTION_FILTER[id] ?? []).join(" ")} className={kartenKlasse}>
        {thumb ? (
          <div>
            <div className="relative aspect-[16/10] sm:aspect-[3/2] lg:aspect-[2/1]">
              <Image
                src={thumb.src}
                alt={thumb.alt[locale]}
                fill
                priority={id === "skigebiet-sonnenwald"}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <p className="px-3 sm:px-4 pt-1.5 font-body text-[10px] text-forest-500 leading-snug">
              {t.photoLabel}: {thumb.credit}
            </p>
          </div>
        ) : (
          emojiKachel(style.emoji, style.bgColor)
        )}
        {kartenText(
          attr.name,
          attr.cardTags,
          style.tagColor,
          <>
            {t.distanceTable.colHaus28} {attr.fromHaus28}
            <br />
            {t.distanceTable.colSchoenblick} {attr.fromSchoenblick}
          </>,
        )}
      </a>
    );
  };

  /** Büchelstein-Rundwanderung als erster Eintrag „Vor der Tür“ */
  const wanderung = () => (
    <article
      key={HIKE_ID}
      id={HIKE_ID}
      className="rounded-3xl bg-forest-900 text-cream-50 overflow-hidden scroll-mt-20"
      aria-labelledby="hike-heading"
    >
      <div className="p-5 sm:p-8">
        <p className="font-body text-xs tracking-[0.15em] uppercase text-gold-400 mb-2">
          <span aria-hidden="true">🥾 </span>
          {t.hike.eyebrow}
        </p>
        <h3 id="hike-heading" className="font-display text-2xl sm:text-3xl text-cream-50 mb-3">
          {t.hike.heading}
        </h3>
        <p className="font-body text-base text-cream-50/70 leading-relaxed mb-6 max-w-3xl">{t.hike.intro}</p>

        <div className="flex flex-wrap gap-x-6 gap-y-3 mb-6 font-body text-sm">
          {t.hike.stats.map((s) => (
            <div key={s.label}>
              <p className="text-cream-50/60 text-xs mb-0.5">{s.label}</p>
              <p className="text-cream-50 font-medium">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Wegpunkte: mobil einklappbar, ab lg offen (wie die Highlights) */}
        <details className="ausflug-details group mb-6">
          <summary className="flex items-center gap-2 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden py-1 font-body text-xs font-semibold tracking-[0.12em] uppercase text-cream-50/60 hover:text-cream-50 transition-colors">
            <span className="transition-transform group-open:rotate-90" aria-hidden="true">▸</span>
            {t.hike.routeSummary}
          </summary>
          <div className="relative pt-4 max-w-3xl">
            <div className="absolute left-5 top-9 bottom-5 w-px bg-gold-500/30 hidden sm:block" aria-hidden="true" />
            <div className="flex flex-col gap-0">
              {t.hike.waypoints.map((wp, i) => {
                const highlight = i === WAYPOINT_HIGHLIGHT;
                return (
                  <div key={wp.name} className="flex gap-4 sm:gap-5">
                    <div
                      className={`relative z-10 flex-none w-10 h-10 rounded-full flex items-center justify-center text-base ${highlight ? "bg-gold-500 shadow-[0_0_0_4px_rgba(202,163,93,0.3)]" : "bg-forest-800 border border-forest-700"}`}
                    >
                      <span aria-hidden="true">{WAYPOINT_ICONS[i]}</span>
                    </div>
                    <div className={i === t.hike.waypoints.length - 1 ? "pb-0" : "pb-6"}>
                      <p className={`font-body font-semibold text-sm mb-0.5 ${highlight ? "text-gold-300" : "text-cream-50"}`}>
                        {wp.name}
                      </p>
                      <p className="font-body text-sm text-cream-50/60 leading-snug">{wp.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </details>

        <div className="p-4 sm:p-5 rounded-2xl bg-cream-50/5 border border-cream-50/10">
          <p className="font-body text-sm text-cream-50/70 mb-3">
            <strong className="text-cream-50">{t.hike.mapStrong}</strong>
            {t.hike.mapText}
          </p>
          <Link
            href={href("/haus28")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-forest-900 text-sm font-body font-medium rounded-full hover:bg-gold-400 transition-colors"
          >
            {t.hike.cta}
            <IconArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );

  /** Ausflugsziel im Detail: Fotos, Beschreibung, Webcam, Highlights, Links */
  const artikel = (id: string) => {
    const attr = t.attractions.find((a) => a.id === id);
    if (!attr) return null;
    const style = ATTRACTION_STYLE[id];
    const material = ausflugszieleMaterial[id];
    const bilder = material?.bilder ?? [];
    return (
      <article
        key={id}
        id={id}
        className={`rounded-3xl border ${style.borderColor} ${style.bgColor} overflow-hidden scroll-mt-20`}
      >
        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden="true">{style.emoji}</span>
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-body font-medium ${style.tagColor} mb-1`}>
                  {attr.tag}
                </span>
                <h3 className="font-display text-2xl text-forest-900">{attr.name}</h3>
                <p className="font-body text-sm text-forest-500">{attr.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-forest-500 text-xs font-body">
              <IconMapPin size={12} />
              <span>{attr.distance}</span>
            </div>
          </div>

          {/* Freigegebene Fotos des Betreibers, Bildnachweis darunter.
              Desktop: Leitbild 16:9 + Leiste kleiner Bilder; mobil: Wischleiste mit Scroll-Snap. */}
          {bilder.length > 0 && (
            <div className="mb-6">
              <figure className="m-0 hidden sm:block">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={bilder[0].src}
                    alt={bilder[0].alt[locale]}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 90vw, 1150px"
                  />
                </div>
                <figcaption className="mt-1 font-body text-[11px] text-forest-500">
                  {t.photoLabel}: {bilder[0].credit}
                </figcaption>
              </figure>
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide sm:mt-3 sm:grid sm:grid-cols-3 sm:overflow-visible">
                {bilder.map((b, i) => (
                  <figure key={b.src} className={`m-0 w-[85%] flex-none snap-start sm:w-auto ${i === 0 ? "sm:hidden" : ""}`}>
                    <div className="relative aspect-[3/2] sm:aspect-[4/3] rounded-lg overflow-hidden">
                      <Image src={b.src} alt={b.alt[locale]} fill className="object-cover" sizes="(max-width: 640px) 85vw, 320px" />
                    </div>
                    <figcaption className="mt-1 font-body text-[11px] text-forest-500 leading-snug">
                      {t.photoLabel}: {b.credit}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          <p className="font-body text-base text-forest-700 leading-relaxed mb-6">{attr.description}</p>

          {/* Live-Webcam (Steinberglift) – serverseitig durchgereicht */}
          {material?.webcam && (
            <div className="mb-6">
              <SteinbergliftWebcam page={material.webcam.seite} labels={{ ...t.webcam, newTab: t.newTabHint }} />
            </div>
          )}

          {/* Highlights + Praktische Infos: mobil einklappbar (natives details),
              ab lg per CSS immer offen ohne Summary – siehe .ausflug-details in globals.css */}
          <details className="ausflug-details group mb-5">
            <summary className="flex items-center gap-2 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden py-1 font-body text-xs font-semibold tracking-[0.12em] uppercase text-forest-500 hover:text-forest-700 transition-colors">
              <span className="transition-transform group-open:rotate-90" aria-hidden="true">▸</span>
              {t.detailsSummary}
            </summary>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
              <div>
                <p className="font-body text-xs font-semibold tracking-[0.12em] uppercase text-forest-400 mb-3">
                  {t.highlightsLabel}
                </p>
                <ul className="space-y-2">
                  {attr.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 font-body text-sm text-forest-700">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-forest-900/10 flex-none flex items-center justify-center">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                          <path d="M1.5 4L3.5 6L6.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-forest-600" />
                        </svg>
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-body text-xs font-semibold tracking-[0.12em] uppercase text-forest-400 mb-3">
                  {t.practicalLabel}
                </p>
                <dl className="space-y-2">
                  {attr.practicalInfo.map((info) => (
                    <div key={info.label} className="flex gap-2">
                      <dt className="font-body text-xs font-medium text-forest-500 w-20 flex-none pt-0.5">{info.label}</dt>
                      <dd className="font-body text-sm text-forest-700">{info.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </details>

          {/* Offizielle Website + freigegebene Zusatzlinks (data/ausflugsziele-bildmaterial.ts) */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href={material.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-body text-sm text-forest-600 hover:text-forest-900 underline underline-offset-2 transition-colors"
            >
              {t.officialWebsiteLabel}
              <span className="text-xs text-forest-500 no-underline">
                ({material.website.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")})
              </span>
              <ExternalIcon />
              <span className="sr-only"> {t.newTabHint}</span>
            </a>
            {material.links?.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-forest-700 hover:text-forest-900 underline underline-offset-2 transition-colors"
              >
                {l.label[locale]}
                <ExternalIcon />
                <span className="sr-only"> {t.newTabHint}</span>
              </a>
            ))}
          </div>
        </div>
      </article>
    );
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-forest-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/shared/region-bayerischer-wald.jpg')] bg-cover bg-center opacity-25" />
        <div className="relative z-10 container-site section-pad">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 font-body text-sm text-cream-50/50">
              <li><Link href={href("/")} className="hover:text-cream-50/80 transition-colors">{t.breadcrumbHome}</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-cream-50/80">{t.breadcrumbCurrent}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-400 mb-4">
              {t.hero.eyebrow}
            </p>
            <h1 className="font-display text-display-lg text-cream-50 mb-5 text-balance">
              {t.hero.h1}
            </h1>
            <p className="font-body text-lg text-cream-50/70 leading-relaxed mb-8 max-w-2xl">
              {t.hero.intro}
            </p>

            {/* Property pills */}
            <div className="flex flex-wrap gap-3">
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
      </section>

      {/* ── Übersicht: Filter + Karten nach Entfernung, darunter die Ziele im Detail ── */}
      <section className="section-pad bg-cream-50" aria-label={t.overview.ariaLabel}>
        <div className="container-site">
          <div className="mb-6">
            <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-2">
              {t.overview.eyebrow}
            </p>
            <h2 className="font-display text-display-md text-forest-900 mb-3">
              {t.overview.heading}
            </h2>
            <p className="font-body text-lg text-forest-600 max-w-2xl leading-relaxed">
              {t.overview.intro}
            </p>
          </div>

          {/* Filter ohne JS: Radios + :has() in globals.css blenden Karten und leere Gruppen aus */}
          <div className="ausflug-filter">
            <div className="relative flex items-center gap-2 mb-7 py-1 -mx-4 px-4 overflow-x-auto scrollbar-hide sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible">
              <fieldset className="flex flex-none items-center gap-2 sm:flex-wrap">
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
              <a href={`#${EINKEHR_ID}`} className="ausflug-chip flex-none">
                {t.filter.essen}
                <span aria-hidden="true">&nbsp;↓</span>
              </a>
            </div>

            <div className="flex flex-col gap-8 sm:gap-10">
              {GROUPS.map((g) => {
                const gt = t.groups[g.key];
                const filter = Array.from(new Set(g.ids.flatMap((id) => ATTRACTION_FILTER[id] ?? [])));
                return (
                  <div key={g.key} data-filter={filter.join(" ")}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                      <h3 className="font-display text-xl sm:text-2xl text-forest-900">{gt.heading}</h3>
                      <p className="font-body text-sm text-forest-500">{gruppenNotiz(g.ids, gt.note)}</p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {g.ids.map((id) => karte(id))}
                    </div>
                    {gt.hint && <p className="mt-3 font-body text-sm text-forest-600">{gt.hint}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ziele im Detail – gleiche Gruppen und Reihenfolge wie die Übersicht */}
          <div className="mt-16 sm:mt-24 flex flex-col gap-14 sm:gap-20">
            {GROUPS.map((g) => (
              <div key={g.key} className="flex flex-col gap-6 sm:gap-8">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-cream-200 pb-3">
                  <h2 className="font-display text-2xl sm:text-3xl text-forest-900">{t.groups[g.key].heading}</h2>
                  <p className="font-body text-sm text-forest-500">{gruppenNotiz(g.ids, t.groups[g.key].note)}</p>
                </div>
                {g.ids.filter((id) => id !== EINKEHR_ID).map((id) => (id === HIKE_ID ? wanderung() : artikel(id)))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Einkehren: Gasthäuser aus data/surroundings.ts (eine Quelle mit Gruppenseite & FAQ) ── */}
      <section id={EINKEHR_ID} className="section-pad bg-cream-100 scroll-mt-16" aria-labelledby="einkehren-heading">
        <div className="container-site">
          <div className="mb-8 max-w-2xl">
            <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-2">
              {t.restaurants.eyebrow}
            </p>
            <h2 id="einkehren-heading" className="font-display text-2xl sm:text-3xl text-forest-900 mb-3">
              {t.restaurants.heading}
            </h2>
            <p className="font-body text-base text-forest-600 leading-relaxed">{t.restaurants.intro}</p>
          </div>
          <div className="relative flex gap-3 -mx-4 px-4 scroll-px-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 sm:overflow-visible">
            {restaurants.map((r) => (
              <article key={r.name} className="flex flex-col flex-none w-[80%] snap-start sm:w-auto rounded-2xl border border-cream-200 bg-white p-5">
                <h3 className="font-body text-base font-semibold text-forest-900 leading-snug">{r.name}</h3>
                <p className="font-body text-xs text-forest-500 mb-3">{locale === "en" ? r.placeEn : r.place}</p>
                <p className="font-body text-sm text-forest-700 leading-relaxed mb-4">{locale === "en" ? r.en : r.de}</p>
                <p className="mt-auto font-body text-[11px] text-forest-500 leading-relaxed mb-3">
                  {t.distanceTable.colHaus28} {nbsp(r.fromHaus28)}
                  <br />
                  {t.distanceTable.colSchoenblick} {nbsp(r.fromSchoenblick)}
                </p>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-body text-sm text-forest-600 hover:text-forest-900 underline underline-offset-2 transition-colors"
                >
                  {t.restaurants.websiteLabel}
                  <ExternalIcon />
                  <span className="sr-only"> {t.newTabHint}</span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jahreszeiten (kompakt) + Entfernungstabelle (eingeklappt, bleibt im DOM für Snippets) ── */}
      <section className="section-pad bg-cream-50" aria-labelledby="seasons-heading">
        <div className="container-site">
          <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-2">
            {t.seasons.eyebrow}
          </p>
          <h2 id="seasons-heading" className="font-display text-2xl sm:text-3xl text-forest-900 mb-6">
            {t.seasons.heading}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 mb-12">
            {t.seasons.items.map((s, i) => (
              <li key={s.season} className="font-body text-sm text-forest-700 leading-relaxed">
                <span aria-hidden="true">{SEASON_EMOJI[i]} </span>
                <strong className="font-semibold text-forest-900">{s.season}</strong>{" "}
                <span className="text-forest-500">({s.months})</span>: {s.activities.join(" · ")}
              </li>
            ))}
          </ul>

          <details className="group rounded-2xl border border-cream-200 bg-white">
            <summary className="flex items-center gap-2 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden px-4 py-3 font-body text-sm font-semibold text-forest-700 hover:text-forest-900">
              <span className="transition-transform group-open:rotate-90" aria-hidden="true">▸</span>
              {t.distanceTable.summary}
            </summary>
            <div className="overflow-x-auto border-t border-cream-200">
              <table className="w-full font-body text-sm text-left">
                <caption className="sr-only">{t.distanceTable.heading}</caption>
                <thead className="bg-cream-100 text-forest-700">
                  <tr>
                    <th scope="col" className="px-3 sm:px-4 py-3 font-semibold">{t.distanceTable.colDestination}</th>
                    <th scope="col" className="px-3 sm:px-4 py-3 font-semibold">{t.distanceTable.colHaus28}</th>
                    <th scope="col" className="px-3 sm:px-4 py-3 font-semibold">{t.distanceTable.colSchoenblick}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 text-forest-700">
                  {GROUPS.flatMap((g) => g.ids)
                    .map((id) => t.attractions.find((a) => a.id === id))
                    .filter((attr): attr is (typeof t.attractions)[number] => Boolean(attr))
                    .map((attr) => (
                      <tr key={attr.id}>
                        <th scope="row" className="px-3 sm:px-4 py-3 font-semibold text-forest-900">
                          <a href={`#${attr.id}`} className="underline underline-offset-2 hover:text-gold-700">
                            {attr.name}
                          </a>
                        </th>
                        <td className="px-3 sm:px-4 py-3">{attr.fromHaus28}</td>
                        <td className="px-3 sm:px-4 py-3">{attr.fromSchoenblick}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="section-pad bg-forest-900" aria-labelledby="ausflugsziele-cta-heading">
        <div className="container-site text-center max-w-2xl mx-auto">
          <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-400 mb-3">
            {t.cta.eyebrow}
          </p>
          <h2
            id="ausflugsziele-cta-heading"
            className="font-display text-display-md text-cream-50 mb-4 text-balance"
          >
            {t.cta.heading}
          </h2>
          <p className="font-body text-base text-cream-50/60 leading-relaxed mb-8">
            {t.cta.text}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
