import Link from "next/link";
import { IconArrowRight, IconMapPin } from "@/components/ui/Icons";
import { getDict, localizedUrl, localizeHref, type Locale } from "@/lib/i18n";

// Darstellung je Ausflugsziel (Texte kommen aus locales/*/ausflugsziele.ts).
const ATTRACTION_STYLE: Record<
  string,
  { emoji: string; tagColor: string; bgColor: string; borderColor: string; link: string }
> = {
  "pullman-city": {
    emoji: "🤠",
    tagColor: "bg-amber-100 text-amber-800",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    link: "https://www.pullmancity.de",
  },
  baumwipfelpfad: {
    emoji: "🌲",
    tagColor: "bg-green-100 text-green-800",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    link: "https://www.baumwipfelpfad.de",
  },
  nationalpark: {
    emoji: "🦌",
    tagColor: "bg-forest-100 text-forest-800",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    link: "https://www.nationalpark-bayerischer-wald.de",
  },
  "skigebiet-sonnenwald": {
    emoji: "⛷️",
    tagColor: "bg-blue-100 text-blue-800",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    link: "https://www.steinberglift.de",
  },
  "indoor-golf": {
    emoji: "⛳",
    tagColor: "bg-lime-100 text-lime-800",
    bgColor: "bg-lime-50",
    borderColor: "border-lime-200",
    link: "https://arena.deggendorfer-golfclub.de",
  },
};

// schema.org-Typ und Ort je Ausflugsziel
const ATTRACTION_SCHEMA: Record<string, { type: string; locality: string }> = {
  "pullman-city": { type: "TouristAttraction", locality: "Eging am See" },
  baumwipfelpfad: { type: "TouristAttraction", locality: "Neuschönau" },
  nationalpark: { type: "Park", locality: "Grafenau" },
  "skigebiet-sonnenwald": { type: "SportsActivityLocation", locality: "Langfurth / Schöfweg" },
  "indoor-golf": { type: "SportsActivityLocation", locality: "Deggendorf" },
};

/** ItemList der Ausflugsziele inkl. Büchelstein-Wanderung (JSON-LD). */
export function ausflugszieleJsonLd(locale: Locale) {
  const t = getDict(locale).ausflugsziele;
  const items = [
    ...t.attractions.map((attr) => ({
      "@type": ATTRACTION_SCHEMA[attr.id].type,
      name: attr.schemaName,
      description: attr.schemaDescription,
      url: ATTRACTION_STYLE[attr.id].link,
      address: {
        "@type": "PostalAddress",
        addressLocality: ATTRACTION_SCHEMA[attr.id].locality,
        addressCountry: "DE",
      },
    })),
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

const QUICK_LINK_EMOJI: Record<string, string> = {
  "pullman-city": "🤠",
  baumwipfelpfad: "🌲",
  nationalpark: "🦌",
  "skigebiet-sonnenwald": "⛷️",
  "indoor-golf": "⛳",
  "buechelstein-wanderung": "🥾",
};

const SEASON_STYLE = [
  { emoji: "🌸", color: "bg-pink-50 border-pink-200" },
  { emoji: "☀️", color: "bg-yellow-50 border-yellow-200" },
  { emoji: "🍂", color: "bg-orange-50 border-orange-200" },
  { emoji: "❄️", color: "bg-blue-50 border-blue-200" },
];

const WAYPOINT_ICONS = ["🏠", "⛪", "⛰️", "🏔️", "🏠"];
const WAYPOINT_HIGHLIGHT = 3; // Großer Büchelstein

/** Ausflugsziele-Seite (Inhalt) – von app/(de)/ausflugsziele und app/(en)/en/ausflugsziele gerendert. */
export default function AusflugszielePageContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).ausflugsziele;
  const href = (path: string) => localizeHref(path, locale);

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

      {/* Quick-links */}
      <section className="bg-cream-100 border-b border-cream-200 sticky top-0 z-30 overflow-x-auto scrollbar-hide">
        <div className="container-site">
          <div className="flex items-center gap-1 py-3 w-max min-w-full">
            {Object.entries(t.quickLinks).map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex-none px-4 py-2 font-body text-sm text-forest-700 hover:text-forest-900 hover:bg-cream-200 rounded-full transition-colors whitespace-nowrap"
              >
                {QUICK_LINK_EMOJI[id]} {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Attractions Grid ──────────────────────────────────────────── */}
      <section className="section-pad bg-cream-50" aria-label={t.overview.ariaLabel}>
        <div className="container-site">
          <div className="mb-10">
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

          {/* Entfernungstabelle – als echte <table> für Featured Snippets & KI-Antworten */}
          <h3 id="entfernungen-heading" className="font-display text-2xl text-forest-900 mb-4">
            {t.distanceTable.heading}
          </h3>
          <div className="mb-12 overflow-x-auto rounded-2xl border border-cream-200 bg-white">
            <table aria-labelledby="entfernungen-heading" className="w-full font-body text-sm text-left">
              <thead className="bg-cream-100 text-forest-700">
                <tr>
                  <th scope="col" className="px-3 sm:px-4 py-3 font-semibold">{t.distanceTable.colDestination}</th>
                  <th scope="col" className="px-3 sm:px-4 py-3 font-semibold">{t.distanceTable.colHaus28}</th>
                  <th scope="col" className="px-3 sm:px-4 py-3 font-semibold">{t.distanceTable.colSchoenblick}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 text-forest-700">
                {t.attractions.map((attr) => (
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

          {/* Für wen? – beantwortet Suchen wie „Ausflugsziele … für Senioren / mit Kindern“ */}
          <h3 className="font-display text-2xl text-forest-900 mb-4">{t.audiences.heading}</h3>
          <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.audiences.groups.map((group) => (
              <div key={group.title} className="rounded-2xl border border-cream-200 bg-white p-5">
                <h4 className="font-body text-sm font-semibold text-forest-900 mb-3">{group.title}</h4>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item.text} className="font-body text-sm text-forest-700 flex items-start gap-1.5">
                      <span className="text-forest-400 mt-0.5" aria-hidden="true">·</span>
                      {"anchor" in item && item.anchor ? (
                        <a href={`#${item.anchor}`} className="underline underline-offset-2 hover:text-gold-700">
                          {item.text}
                        </a>
                      ) : (
                        item.text
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-8">
            {t.attractions.map((attr) => {
              const style = ATTRACTION_STYLE[attr.id];
              return (
                <article
                  key={attr.id}
                  id={attr.id}
                  className={`rounded-3xl border ${style.borderColor} ${style.bgColor} overflow-hidden scroll-mt-20`}
                >
                  <div className="p-6 sm:p-8">
                    {/* Header */}
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

                    {/* Description */}
                    <p className="font-body text-base text-forest-700 leading-relaxed mb-6">
                      {attr.description}
                    </p>

                    {/* Two-column: Highlights + Practical */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      {/* Highlights */}
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

                      {/* Practical Info */}
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

                    {/* External link */}
                    <a
                      href={style.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-body text-sm text-forest-600 hover:text-forest-900 underline underline-offset-2 transition-colors"
                    >
                      {style.link.replace(/^https:\/\/(www\.)?/, "")}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Season Overview ───────────────────────────────────────────── */}
      <section className="section-pad bg-cream-100" aria-labelledby="seasons-heading">
        <div className="container-site">
          <div className="mb-8">
            <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-2">
              {t.seasons.eyebrow}
            </p>
            <h2 id="seasons-heading" className="font-display text-display-sm text-forest-900">
              {t.seasons.heading}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.seasons.items.map((s, i) => (
              <div key={s.season} className={`rounded-2xl border p-5 ${SEASON_STYLE[i].color}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl" aria-hidden="true">{SEASON_STYLE[i].emoji}</span>
                  <h3 className="font-display text-lg text-forest-900">{s.season}</h3>
                </div>
                <p className="font-body text-xs text-forest-500 mb-3">{s.months}</p>
                <ul className="space-y-1.5">
                  {s.activities.map((a) => (
                    <li key={a} className="font-body text-sm text-forest-700 flex items-start gap-1.5">
                      <span className="text-forest-400 mt-0.5">·</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Büchelstein Wanderroute ──────────────────────────────────── */}
      <section
        id="buechelstein-wanderung"
        className="section-pad bg-forest-900 text-cream-50 overflow-hidden scroll-mt-16"
        aria-labelledby="hike-heading"
      >
        <div className="container-site">
          <div className="max-w-3xl mx-auto">
            <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-400 mb-3">
              🥾 {t.hike.eyebrow}
            </p>
            <h2
              id="hike-heading"
              className="font-display text-display-md text-cream-50 mb-4"
            >
              {t.hike.heading}
            </h2>
            <p className="font-body text-base text-cream-50/70 leading-relaxed mb-3">
              {t.hike.intro}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-10 font-body text-sm">
              {t.hike.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-cream-50/40 text-xs mb-0.5">{s.label}</p>
                  <p className="text-cream-50 font-medium">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Waypoints */}
            <div className="relative">
              <div className="absolute left-5 top-5 bottom-5 w-px bg-gold-500/30 hidden sm:block" aria-hidden="true" />
              <div className="flex flex-col gap-0">
                {t.hike.waypoints.map((wp, i) => {
                  const highlight = i === WAYPOINT_HIGHLIGHT;
                  return (
                    <div key={wp.name} className="flex gap-4 sm:gap-5">
                      <div className={`relative z-10 flex-none w-10 h-10 rounded-full flex items-center justify-center text-base ${highlight ? "bg-gold-500 shadow-[0_0_0_4px_rgba(202,163,93,0.3)]" : "bg-forest-800 border border-forest-700"}`}>
                        <span aria-hidden="true">{WAYPOINT_ICONS[i]}</span>
                      </div>
                      <div className={`pb-6 ${i === t.hike.waypoints.length - 1 ? "pb-0" : ""}`}>
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

            {/* Info box */}
            <div className="mt-10 p-5 rounded-2xl bg-cream-50/5 border border-cream-50/10">
              <p className="font-body text-sm text-cream-50/70 mb-3">
                <strong className="text-cream-50">{t.hike.mapStrong}</strong>{t.hike.mapText}
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
