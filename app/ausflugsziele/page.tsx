import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconMapPin, IconMountain } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Ausflugsziele Bayerischer Wald – Tipps rund um HAUS28 & Haus Schönblick",
  description:
    "Die besten Ausflugsziele im Bayerischen Wald: Pullman City, Büchelstein-Wanderung ab HAUS28, Skigebiet Sonnenwald, Indoor Golf Rusel-Arena, Baumwipfelpfad & Nationalpark. Alle Infos auf einen Blick.",
  keywords: [
    "Ausflugsziele Bayerischer Wald",
    "Pullman City Eging am See",
    "Büchelstein Wanderung",
    "Skigebiet Sonnenwald",
    "Indoor Golf Rusel",
    "Baumwipfelpfad Neuschönau",
    "Nationalpark Bayerischer Wald",
    "Ausflüge Grattersdorf",
    "Ausflüge Schöfweg",
    "Freizeitangebote Bayerischer Wald",
  ],
  openGraph: {
    title: "Ausflugsziele Bayerischer Wald – Tipps von SARFI Collection",
    description:
      "Pullman City, Büchelstein-Wanderung, Skigebiet Sonnenwald, Indoor Golf & mehr – die besten Ausflüge rund um HAUS28 und Haus Schönblick.",
    images: [{ url: "/images/shared/region-bayerischer-wald.jpg", alt: "Bayerischer Wald" }],
  },
  alternates: {
    canonical: "https://www.sarfi-collection.de/ausflugsziele",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Ausflugsziele Bayerischer Wald",
  description: "Die besten Ausflugsziele rund um HAUS28 und Haus Schönblick im Bayerischen Wald",
  url: "https://www.sarfi-collection.de/ausflugsziele",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "TouristAttraction",
        name: "Pullman City – Westernstadt Eging am See",
        description: "Europas größtes Western-Erlebnisdorf mit über 30 Shows täglich, Ponyreiten, Wildwasserbahn und authentischem Western-Flair.",
        url: "https://www.pullmancity.de",
        address: { "@type": "PostalAddress", addressLocality: "Eging am See", addressCountry: "DE" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "TouristAttraction",
        name: "Büchelstein Wanderroute ab HAUS28",
        description: "Rundwanderung vom HAUS28 über die Wallfahrtskapelle Rastbuche (18. Jh.) bei Grattersdorf, Kleiner Büchelstein zum Großen Büchelstein (831 m) und zurück – mit Blicken ins Donautal.",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "SportsActivityLocation",
        name: "Skigebiet Sonnenwald / Steinberglift",
        description: "Familienfreundliches Skigebiet mit 4 Liften am Brotjacklriegel (1.011 m), Langlaufloipen und Live-Webcam.",
        url: "https://www.steinberglift.de",
        address: { "@type": "PostalAddress", addressLocality: "Langfurth / Schöfweg", addressCountry: "DE" },
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "SportsActivityLocation",
        name: "Rusel-Arena Indoor Golf",
        description: "370 m² Indoor-Golfsimulator mit 6 TrackMan-Stationen am Golfplatz Rusel bei Deggendorf.",
        url: "https://arena.deggendorfer-golfclub.de",
        address: { "@type": "PostalAddress", addressLocality: "Deggendorf", addressCountry: "DE" },
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "TouristAttraction",
        name: "Baumwipfelpfad Neuschönau",
        description: "Europas längster Baumwipfelpfad mit 1.300 m Länge und atemberaubenden Blicken über den Nationalpark Bayerischer Wald.",
        url: "https://www.baumwipfelpfad.de",
        address: { "@type": "PostalAddress", addressLocality: "Neuschönau", addressCountry: "DE" },
      },
    },
    {
      "@type": "ListItem",
      position: 6,
      item: {
        "@type": "Park",
        name: "Nationalpark Bayerischer Wald",
        description: "Deutschlands ältester Nationalpark – 24.250 ha unberührte Natur mit Tierfreigehegen, Besucherzentrum und 300 km Wanderwegen.",
        url: "https://www.nationalpark-bayerischer-wald.de",
        address: { "@type": "PostalAddress", addressLocality: "Grafenau", addressCountry: "DE" },
      },
    },
  ],
};

const attractions = [
  {
    id: "pullman-city",
    emoji: "🤠",
    tag: "Familie & Unterhaltung",
    tagColor: "bg-amber-100 text-amber-800",
    name: "Pullman City",
    subtitle: "Europas größte Westernstadt",
    distance: "~15 min von Haus Schönblick · ~20 min von HAUS28",
    description:
      "Mitten im Bayerischen Wald taucht die Westernstadt Pullman City in Eging am See auf – Europas größtes Western-Erlebnisdorf. Auf über 80.000 m² warten täglich mehr als 30 Live-Shows, Ponyreiten, Wildwasserbahn, Goldwaschen, Indianerlager und authentische Western-Gastronomie. Ein echtes Highlight für Familien und alle, die den Wilden Westen erleben wollen – ohne die USA zu verlassen.",
    highlights: [
      "30+ Live-Shows täglich",
      "Wildwasserbahn & Saloon",
      "Pferdeshow & Ponyreiten",
      "Goldwaschen für Kinder",
      "Übernachtung im Western-Camp möglich",
    ],
    practicalInfo: [
      { label: "Saison", value: "Mai – Oktober" },
      { label: "Anfahrt", value: "B85 Richtung Eging am See" },
      { label: "Tipp", value: "Kombi mit Baumwipfelpfad (gleiche Region)" },
    ],
    link: { href: "https://www.pullmancity.de", label: "pullmancity.de" },
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    id: "baumwipfelpfad",
    emoji: "🌲",
    tag: "Natur & Erlebnis",
    tagColor: "bg-green-100 text-green-800",
    name: "Baumwipfelpfad Neuschönau",
    subtitle: "Europas längster Baumwipfelpfad",
    distance: "~25 min von Haus Schönblick · ~30 min von HAUS28",
    description:
      "Der Baumwipfelpfad Neuschönau im Nationalpark Bayerischer Wald ist der längste seiner Art in Europa. 1.300 m barrierearmer Holzsteg führt durch die Baumkronen des Urwalds – bis zu 44 m über dem Boden. Am Ende erwartet ein 44 m hoher Aussichtsturm mit 360°-Panoramablick über den Nationalpark. Für Kinder gibt es spannende Erlebnisinseln und interaktive Stationen entlang des Weges.",
    highlights: [
      "1.300 m Holzsteg in den Baumkronen",
      "44 m hoher Aussichtsturm",
      "Barrierefrei & kinderwagentauglich",
      "Interaktive Erlebnisstationen",
      "Direkt am Nationalpark-Tierfreigehege",
    ],
    practicalInfo: [
      { label: "Öffnung", value: "täglich, ganzjährig" },
      { label: "Eintritt", value: "Erwachsene ca. 11 €, Kinder ca. 8 €" },
      { label: "Tipp", value: "Kombi mit Tierfreigehege (nebenan, kostenlos)" },
    ],
    link: { href: "https://www.baumwipfelpfad.de", label: "baumwipfelpfad.de" },
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    id: "nationalpark",
    emoji: "🦌",
    tag: "Natur & Wandern",
    tagColor: "bg-forest-100 text-forest-800",
    name: "Nationalpark Bayerischer Wald",
    subtitle: "Deutschlands ältester Nationalpark",
    distance: "~20 km von Haus Schönblick · ~25 km von HAUS28",
    description:
      "Seit 1970 ist der Bayerische Wald Deutschlands erster Nationalpark – 24.250 ha wilder, unberührter Natur, in der die Natur sich selbst überlassen bleibt. Das Besucherzentrum Hans-Eisenmann-Haus in Neuschönau und das Haus zur Wildnis in Ludwigsthal bieten spannende Ausstellungen. Im großen Tierfreigehege leben Luchse, Wölfe, Bären, Wisente und Hirsche in naturnahen Gehegen – kostenloser Eintritt.",
    highlights: [
      "Tierfreigehege: Luchs, Wolf, Bär, Bison (kostenlos)",
      "300 km markierte Wanderwege",
      "Ranger-Führungen & Naturprogramme",
      "Besucherzentrum mit interaktiven Ausstellungen",
      "Urwald – Natur ohne menschliche Eingriffe",
    ],
    practicalInfo: [
      { label: "Eintritt", value: "Tierfreigehege kostenlos" },
      { label: "Saison", value: "ganzjährig geöffnet" },
      { label: "Tipp", value: "Morgendliche Wanderungen für Wildtierbeobachtung" },
    ],
    link: { href: "https://www.nationalpark-bayerischer-wald.de", label: "nationalpark-bayerischer-wald.de" },
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
  },
  {
    id: "skigebiet-sonnenwald",
    emoji: "⛷️",
    tag: "Winter & Sport",
    tagColor: "bg-blue-100 text-blue-800",
    name: "Skigebiet Sonnenwald / Steinberglift",
    subtitle: "Familienski am Brotjacklriegel (1.011 m)",
    distance: "direkt bei Haus Schönblick in Langfurth · ~10 min von HAUS28",
    description:
      "Das Skigebiet Sonnenwald rund um den Steinberglift in Langfurth / Schöfweg liegt buchstäblich vor der Haustür von Haus Schönblick. Der Brotjacklriegel mit 1.011 m bietet familienfreundliche Abfahrten, einen beleuchteten Naturrodelhang und gut präparierte Langlaufloipen. Eine Live-Webcam zeigt den aktuellen Schneezustand – ideal zur Planung direkt aus der Unterkunft.",
    highlights: [
      "Steinberglift & Brotjacklriegellift",
      "Beleuchteter Naturrodelhang",
      "Langlaufloipen direkt nebenan",
      "Live-Webcam für Schneekontrolle",
      "Familien- & anfängerfreundlich",
    ],
    practicalInfo: [
      { label: "Saison", value: "Dezember – März (schneeabhängig)" },
      { label: "Livecam", value: "steinberglift.de" },
      { label: "Tipp", value: "Schlittschuhlaufen in Grafenau als Alternative" },
    ],
    link: { href: "https://www.steinberglift.de", label: "steinberglift.de" },
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
  },
  {
    id: "indoor-golf",
    emoji: "⛳",
    tag: "Sport & Spaß",
    tagColor: "bg-lime-100 text-lime-800",
    name: "Rusel-Arena Indoor Golf",
    subtitle: "6 TrackMan-Simulatoren am Golfplatz Rusel",
    distance: "~25 min von HAUS28 & Haus Schönblick",
    description:
      "Die brandneue Rusel-Arena am Golfplatz Deggendorf-Rusel ist das modernste Indoor-Golf-Erlebnis im Bayerischen Wald. Auf 370 m² stehen 6 TrackMan-Simulationsstationen bereit – mit präziser Schlaganalyse und virtuellen Golferlebnissen auf über 100 weltberühmten Plätzen. Anfänger, Fortgeschrittene und Profis sind gleichermaßen willkommen, witterungsunabhängig das ganze Jahr.",
    highlights: [
      "6 TrackMan-Simulationsstationen",
      "370 m² Indoor-Anlage",
      "Über 100 virtuelle Golfplätze weltweit",
      "Präzise Schlaganalyse & Auswertung",
      "Ganzjährig & wetterunabhängig",
    ],
    practicalInfo: [
      { label: "Preis", value: "ab 44 € / 55 min / Station" },
      { label: "Buchung", value: "Online über arena.deggendorfer-golfclub.de" },
      { label: "Tipp", value: "Auch für Nicht-Golfer ideal als Gruppenaktivität" },
    ],
    link: { href: "https://arena.deggendorfer-golfclub.de", label: "arena.deggendorfer-golfclub.de" },
    bgColor: "bg-lime-50",
    borderColor: "border-lime-200",
  },
];

const hikeWaypoints = [
  {
    step: 1,
    name: "Start: HAUS28",
    detail: "Büchelstein 28, Grattersdorf – direkt am Haus beginnt der Wanderweg in den Wald.",
    icon: "🏠",
  },
  {
    step: 2,
    name: "Wallfahrtskapelle Rastbuche",
    detail: "Die malerische Wallfahrtskapelle Rastbuche bei Grattersdorf stammt aus dem 18. Jahrhundert und liegt idyllisch nahe dem Büchelstein. Sie ist ein bekanntes Ziel auf regionalen Wanderwegen – darunter die \"Rastbuchen-Runde\" (Nr. 52) – und bietet bei klarer Sicht beeindruckende Ausblicke ins Donautal.",
    icon: "⛪",
  },
  {
    step: 3,
    name: "Rastbuche",
    detail: "Die markante alte Buche bietet Schatten und eine tolle Aussicht auf den bewaldeten Hang. Ideal für eine erste kurze Pause.",
    icon: "🌳",
  },
  {
    step: 4,
    name: "Kleiner Büchelstein",
    detail: "Der erste Gipfelpunkt der Tour. Schöner Ausblick ins Tal und in die bewaldeten Hügel des Bayerischen Waldes.",
    icon: "⛰️",
  },
  {
    step: 5,
    name: "Großer Büchelstein (831 m)",
    detail: "Der Hauptgipfel und Höhepunkt der Tour. Auf 831 m Höhe erwartet dich bei klarem Wetter ein herrliches Panorama über den Bayerischen Wald – manchmal bis zu den Alpen.",
    icon: "🏔️",
    highlight: true,
  },
  {
    step: 6,
    name: "Rückweg zu HAUS28",
    detail: "Der Abstieg führt auf einem anderen Pfad zurück zum Ausgangspunkt – die Schleife macht die Tour abwechslungsreich ohne Streckenwiederholung.",
    icon: "🏠",
  },
];

export default function AusflugszielePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative bg-forest-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/shared/region-bayerischer-wald.jpg')] bg-cover bg-center opacity-25" />
        <div className="relative z-10 container-site section-pad">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 font-body text-sm text-cream-50/50">
              <li><Link href="/" className="hover:text-cream-50/80 transition-colors">Startseite</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-cream-50/80">Ausflugsziele</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-400 mb-4">
              Region Bayerischer Wald
            </p>
            <h1 className="font-display text-display-lg text-cream-50 mb-5 text-balance">
              Ausflugsziele & Freizeitangebote
            </h1>
            <p className="font-body text-lg text-cream-50/70 leading-relaxed mb-8 max-w-2xl">
              Rund um HAUS28 und Haus Schönblick wartet der Bayerische Wald mit einer Fülle an Erlebnissen – von wilder Natur über Westernflair bis zu modernsten Golfsimulationen. Hier findest du unsere persönlichen Empfehlungen für deinen Urlaub.
            </p>

            {/* Property pills */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/haus28"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cream-50/10 border border-cream-50/20 text-cream-50/80 text-sm font-body rounded-full hover:bg-cream-50/15 transition-colors"
              >
                <IconMapPin size={13} />
                HAUS28 · Grattersdorf
              </Link>
              <Link
                href="/schoenblick"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cream-50/10 border border-cream-50/20 text-cream-50/80 text-sm font-body rounded-full hover:bg-cream-50/15 transition-colors"
              >
                <IconMapPin size={13} />
                Haus Schönblick · Schöfweg
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick-links */}
      <section className="bg-cream-100 border-b border-cream-200 sticky top-0 z-30 overflow-x-auto scrollbar-hide">
        <div className="container-site">
          <div className="flex items-center gap-1 py-3 w-max min-w-full">
            {[
              { href: "#pullman-city", label: "🤠 Pullman City" },
              { href: "#baumwipfelpfad", label: "🌲 Baumwipfelpfad" },
              { href: "#nationalpark", label: "🦌 Nationalpark" },
              { href: "#skigebiet-sonnenwald", label: "⛷️ Skigebiet" },
              { href: "#indoor-golf", label: "⛳ Indoor Golf" },
              { href: "#buechelstein-wanderung", label: "🥾 Büchelstein-Tour" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex-none px-4 py-2 font-body text-sm text-forest-700 hover:text-forest-900 hover:bg-cream-200 rounded-full transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Attractions Grid ──────────────────────────────────────────── */}
      <section className="section-pad bg-cream-50" aria-label="Ausflugsziele Übersicht">
        <div className="container-site">
          <div className="mb-10">
            <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-2">
              Alle Jahreszeiten
            </p>
            <h2 className="font-display text-display-md text-forest-900 mb-3">
              Mehr erleben im Bayerischen Wald
            </h2>
            <p className="font-body text-lg text-forest-600 max-w-2xl leading-relaxed">
              Von Westernflair über Ski bis Indoor-Golf – hier ist für jedes Wetter und jede Reisegruppe etwas dabei.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {attractions.map((attr) => (
              <article
                key={attr.id}
                id={attr.id}
                className={`rounded-3xl border ${attr.borderColor} ${attr.bgColor} overflow-hidden scroll-mt-20`}
              >
                <div className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl" aria-hidden="true">{attr.emoji}</span>
                      <div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-body font-medium ${attr.tagColor} mb-1`}>
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
                        Highlights
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
                        Praktische Infos
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
                    href={attr.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-body text-sm text-forest-600 hover:text-forest-900 underline underline-offset-2 transition-colors"
                  >
                    {attr.link.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Season Overview ───────────────────────────────────────────── */}
      <section className="section-pad bg-cream-100" aria-labelledby="seasons-heading">
        <div className="container-site">
          <div className="mb-8">
            <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-2">
              Wann fahren?
            </p>
            <h2 id="seasons-heading" className="font-display text-display-sm text-forest-900">
              Bayerischer Wald – zu jeder Jahreszeit lohnenswert
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                season: "Frühling",
                emoji: "🌸",
                months: "März – Mai",
                activities: ["Wandern auf tauenden Wegen", "Wildblumen & Vogelbeobachtung", "Ruhe vor dem Sommertrubel", "Ostermärkte in Grafenau"],
                color: "bg-pink-50 border-pink-200",
              },
              {
                season: "Sommer",
                emoji: "☀️",
                months: "Juni – August",
                activities: ["Pullman City & Baumwipfelpfad", "Büchelstein-Wanderung", "Badeseen der Region", "Mountainbiken & Radfahren"],
                color: "bg-yellow-50 border-yellow-200",
              },
              {
                season: "Herbst",
                emoji: "🍂",
                months: "September – November",
                activities: ["Herbstfarben im Wald", "Pilzesammeln (mit Erlaubnis)", "Ruhige Wanderungen", "Indoor Golf Rusel-Arena"],
                color: "bg-orange-50 border-orange-200",
              },
              {
                season: "Winter",
                emoji: "❄️",
                months: "Dezember – Februar",
                activities: ["Skifahren am Steinberglift", "Rodeln & Langlaufen", "Weihnachtsmärkte", "Wellness & Thermalbad Regen"],
                color: "bg-blue-50 border-blue-200",
              },
            ].map((s) => (
              <div key={s.season} className={`rounded-2xl border p-5 ${s.color}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl" aria-hidden="true">{s.emoji}</span>
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
              🥾 Direkt ab HAUS28
            </p>
            <h2
              id="hike-heading"
              className="font-display text-display-md text-cream-50 mb-4"
            >
              Büchelstein-Rundwanderung
            </h2>
            <p className="font-body text-base text-cream-50/70 leading-relaxed mb-3">
              Die schönste Wanderung ab HAUS28 führt direkt vom Haus auf den Großen Büchelstein (831 m) – vorbei an der historischen Wallfahrtskapelle Rastbuche, dem Kleinen Büchelstein und durch dichten Bayerwald-Forst. Die Rundtour ist gut markiert, für geübte Familien geeignet und belohnt mit einem herrlichen Panoramablick über den Bayerischen Wald bis ins Donautal.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-10 font-body text-sm">
              {[
                { label: "Startpunkt", value: "HAUS28, Büchelstein 28" },
                { label: "Gipfel", value: "831 m (Großer Büchelstein)" },
                { label: "Charakter", value: "Rundweg, gut markiert" },
                { label: "Schwierigkeit", value: "Mittel – Familien geeignet" },
              ].map((s) => (
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
                {hikeWaypoints.map((wp, i) => (
                  <div key={wp.step} className="flex gap-4 sm:gap-5">
                    <div className={`relative z-10 flex-none w-10 h-10 rounded-full flex items-center justify-center text-base ${wp.highlight ? "bg-gold-500 shadow-[0_0_0_4px_rgba(202,163,93,0.3)]" : "bg-forest-800 border border-forest-700"}`}>
                      <span aria-hidden="true">{wp.icon}</span>
                    </div>
                    <div className={`pb-6 ${i === hikeWaypoints.length - 1 ? "pb-0" : ""}`}>
                      <p className={`font-body font-semibold text-sm mb-0.5 ${wp.highlight ? "text-gold-300" : "text-cream-50"}`}>
                        {wp.name}
                      </p>
                      <p className="font-body text-sm text-cream-50/60 leading-snug">{wp.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info box */}
            <div className="mt-10 p-5 rounded-2xl bg-cream-50/5 border border-cream-50/10">
              <p className="font-body text-sm text-cream-50/70 mb-3">
                <strong className="text-cream-50">Wanderkarte & GPS:</strong> Die Tour ist auf Komoot und AllTrails unter dem Suchbegriff „Büchelstein Grattersdorf" verfügbar. Alternativ einfach der Wanderweg-Beschilderung ab HAUS28 folgen – oder die Rastbuchen-Runde (Nr. 52) nutzen.
              </p>
              <Link
                href="/haus28"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 text-forest-900 text-sm font-body font-medium rounded-full hover:bg-gold-400 transition-colors"
              >
                HAUS28 – direkt am Büchelstein buchen
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
            Dein Ausgangspunkt
          </p>
          <h2
            id="ausflugsziele-cta-heading"
            className="font-display text-display-md text-cream-50 mb-4 text-balance"
          >
            Alle Ausflugsziele direkt vor der Tür
          </h2>
          <p className="font-body text-base text-cream-50/60 leading-relaxed mb-8">
            HAUS28 am Büchelstein und Haus Schönblick in Schöfweg liegen ideal im Herzen des Bayerischen Waldes – perfekt als Ausgangspunkt für alle Ausflüge auf dieser Seite. Buche direkt und spare bis zu 15% gegenüber Buchungsplattformen.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/haus28"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gold-500 text-forest-900 font-body font-medium rounded-full hover:bg-gold-400 transition-colors shadow-cta"
            >
              HAUS28 entdecken
              <IconArrowRight size={16} />
            </Link>
            <Link
              href="/schoenblick"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-cream-50/25 text-cream-50/80 font-body rounded-full hover:border-cream-50/40 hover:text-cream-50 transition-colors"
            >
              Haus Schönblick entdecken
              <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
