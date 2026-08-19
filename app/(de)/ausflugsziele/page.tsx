import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconMapPin } from "@/components/ui/Icons";
import AusflugszieleFilter, {
  type OverviewCategory,
  type OverviewItem,
} from "@/components/pages/AusflugszieleFilter";
import FaqAccordion from "@/components/property/FaqAccordion";

export const metadata: Metadata = {
  title: "Ausflugsziele Bayerischer Wald – Tipps rund um HAUS28 & Haus Schönblick",
  description:
    "Die besten Ausflugsziele im Bayerischen Wald – sortiert nach Familie, Natur, Wandern, Winter, Golf, Wellness & Schlechtwetter. Mit Entfernungen ab HAUS28 (Grattersdorf) und Haus Schönblick (Schöfweg).",
  keywords: [
    "Ausflugsziele Bayerischer Wald",
    "Pullman City Eging am See",
    "Büchelstein Wanderung",
    "Skigebiet Sonnenwald",
    "Indoor Golf Rusel",
    "Baumwipfelpfad Neuschönau",
    "Nationalpark Bayerischer Wald",
    "Schlechtwetter Bayerischer Wald",
    "Ausflüge mit Kindern Bayerischer Wald",
    "Gruppenausflug Bayerischer Wald",
    "Ausflüge Grattersdorf",
    "Ausflüge Schöfweg",
    "Freizeitangebote Bayerischer Wald",
  ],
  openGraph: {
    title: "Ausflugsziele Bayerischer Wald – Tipps von SARFI Collection",
    description:
      "Pullman City, Büchelstein-Wanderung, Skigebiet Sonnenwald, Baumwipfelpfad, Indoor Golf & Schlechtwetter-Tipps – alle Ausflüge rund um HAUS28 und Haus Schönblick mit Entfernungen und Saison-Infos.",
    url: "https://www.sarfi-collection.de/ausflugsziele",
    type: "website",
    locale: "de_DE",
    images: [{ url: "/images/shared/region-bayerischer-wald.jpg", alt: "Hügellandschaft des Bayerischen Waldes" }],
  },
  alternates: {
    canonical: "https://www.sarfi-collection.de/ausflugsziele",
  },
};

// ---------------------------------------------------------------------------
// FAQ – sichtbarer Inhalt und FAQPage-Schema nutzen dieselbe Quelle
// ---------------------------------------------------------------------------
const faqs = [
  {
    question: "Welche Ausflugsziele im Bayerischen Wald eignen sich für Familien mit Kindern?",
    answer:
      "Klassiker für Familien sind die Westernstadt Pullman City in Eging am See (ca. 15 Min. von Haus Schönblick, ca. 20 Min. von HAUS28), der barrierearme Baumwipfelpfad in Neuschönau und die kostenlosen Tier-Freigelände des Nationalparks Bayerischer Wald. Im Winter kommt das familienfreundliche Skigebiet Sonnenwald direkt bei Schöfweg dazu.",
  },
  {
    question: "Was kann man im Bayerischen Wald bei Regen und Schlechtwetter unternehmen?",
    answer:
      "Wetterunabhängig sind die Indoor-Golfanlage Rusel-Arena am Deggendorfer Golfclub, das Freizeit- und Erlebnisbad elypso in Deggendorf mit Bade- und Saunawelt sowie die Besucherzentren des Nationalparks (Hans-Eisenmann-Haus und Haus zur Wildnis). Und im HAUS28 wartet der private Outdoor-Whirlpool im Garten – gerade bei Regen oder Schneefall ein Highlight.",
  },
  {
    question: "Wie weit ist Pullman City von HAUS28 und Haus Schönblick entfernt?",
    answer:
      "Die Westernstadt Pullman City in Eging am See erreichst du von HAUS28 in Grattersdorf in ca. 20 Minuten und von Haus Schönblick in Schöfweg in ca. 15 Minuten mit dem Auto.",
  },
  {
    question: "Welche Wanderung startet direkt an HAUS28?",
    answer:
      "Die Büchelstein-Rundwanderung: HAUS28 liegt an der Adresse Büchelstein 28, direkt am markierten Rundweg Nr. 54. Die Tour führt über den Kleinen Büchelstein und den Großen Büchelstein (832 m) zur Wallfahrtskapelle Rastbuche aus dem 18. Jahrhundert. Ab Ortsmitte Grattersdorf sind es rund 10 km mit ca. 400 Höhenmetern, die kürzere Variante ab Kerschbaum ca. 7 km.",
  },
  {
    question: "Gibt es Ausflugsziele und Unterkünfte für Gruppen bis 20 Personen?",
    answer:
      "Ja. Pullman City, der Nationalpark, das Skigebiet Sonnenwald und die Rusel-Arena eignen sich gut für Gruppenausflüge. Übernachten kann eure Gruppe im Haus Schönblick: Dort lassen sich bis zu 5 Apartments für bis zu 20 Personen in einer einzigen Buchung mit einer Zahlung reservieren.",
  },
  {
    question: "Was lohnt sich im Winter rund um HAUS28 und Haus Schönblick?",
    answer:
      "Das Skigebiet Sonnenwald mit dem Steinberglift liegt nur wenige Autominuten von Haus Schönblick und ca. 10 Minuten von HAUS28 entfernt – mit familienfreundlichen Abfahrten und Rodelhang. Dazu kommen Winterwandern, Langlauf in der Region Sonnenwald und Wellness: Der Outdoor-Whirlpool am HAUS28 ist ganzjährig nutzbar, auch wenn ringsum Schnee liegt.",
  },
  {
    question: "Kommt man ohne Auto zu den Ausflugszielen?",
    answer:
      "Einige Ziele erreichst du zu Fuß: Die Büchelstein-Wanderung startet direkt an HAUS28, und ab Haus Schönblick in Schöfweg führen markierte Wanderwege in die Region Sonnenwald, u. a. Richtung Brotjacklriegel (1.011 m). Für Pullman City, den Baumwipfelpfad oder das elypso empfehlen wir aber ein Auto – der öffentliche Nahverkehr ist in dieser Region begrenzt.",
  },
];

// ---------------------------------------------------------------------------
// Strukturierte Daten: Ausflugsziele (ItemList), FAQ, Breadcrumb
// ---------------------------------------------------------------------------
const itemListJsonLd = {
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
        name: "Pullman City – lebende Westernstadt Eging am See",
        description:
          "Westernstadt im Bayerischen Wald mit Live-Shows, Western-Gastronomie und Events – Showprogramm von Frühjahr bis Spätherbst.",
        url: "https://www.pullmancity.de",
        address: { "@type": "PostalAddress", addressLocality: "Eging am See", addressCountry: "DE" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "TouristAttraction",
        name: "Baumwipfelpfad Bayerischer Wald (Neuschönau)",
        description:
          "1.300 m langer, barrierearmer Baumwipfelpfad mit 44 m hohem Aussichtsturm über dem Nationalpark Bayerischer Wald – einer der längsten Baumwipfelpfade der Welt.",
        url: "https://www.baumwipfelpfad.de",
        address: { "@type": "PostalAddress", addressLocality: "Neuschönau", addressCountry: "DE" },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Park",
        name: "Nationalpark Bayerischer Wald",
        description:
          "Deutschlands ältester Nationalpark (gegründet 1970) mit rund 25.000 ha Waldwildnis, zwei kostenlosen Tier-Freigeländen und markierten Wanderwegen.",
        url: "https://www.nationalpark-bayerischer-wald.bayern.de",
        address: { "@type": "PostalAddress", addressLocality: "Grafenau", addressCountry: "DE" },
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "TouristAttraction",
        name: "Büchelstein-Rundwanderung ab HAUS28",
        description:
          "Rundwanderung ab HAUS28 (Büchelstein 28, Grattersdorf) über die Wallfahrtskapelle Rastbuche (18. Jh.), den Kleinen Büchelstein und den Großen Büchelstein (832 m) – mit Blick ins Donautal.",
        address: { "@type": "PostalAddress", addressLocality: "Grattersdorf", addressCountry: "DE" },
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "SportsActivityLocation",
        name: "Skigebiet Sonnenwald / Steinberglift",
        description:
          "Familienfreundliches Skigebiet am Brotjacklriegel (1.011 m) mit Schleppliften, Rodelhang und Flutlicht – wenige Autominuten von Haus Schönblick.",
        url: "https://www.steinberglift.de",
        address: { "@type": "PostalAddress", addressLocality: "Langfurth / Schöfweg", addressCountry: "DE" },
      },
    },
    {
      "@type": "ListItem",
      position: 6,
      item: {
        "@type": "SportsActivityLocation",
        name: "Rusel-Arena Indoor Golf",
        description:
          "Indoor-Golfanlage des Deggendorfer Golfclubs auf der Rusel: 370 m² mit TrackMan-Simulatoren, über 200 virtuellen Golfplätzen und Puttinggrün – ganzjährig und wetterunabhängig.",
        url: "https://arena.deggendorfer-golfclub.de",
        address: { "@type": "PostalAddress", addressLocality: "Deggendorf", addressCountry: "DE" },
      },
    },
    {
      "@type": "ListItem",
      position: 7,
      item: {
        "@type": "TouristAttraction",
        name: "elypso Freizeit- und Erlebnisbad Deggendorf",
        description:
          "Bade- und Saunawelt in Deggendorf mit Themensaunen, Dampfbad und Saunagarten – im Sommer zusätzlich Freibad. Ideal bei Schlechtwetter.",
        url: "https://www.elypso.de",
        address: { "@type": "PostalAddress", addressLocality: "Deggendorf", addressCountry: "DE" },
      },
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Startseite", item: "https://www.sarfi-collection.de" },
    { "@type": "ListItem", position: 2, name: "Ausflugsziele", item: "https://www.sarfi-collection.de/ausflugsziele" },
  ],
};

// ---------------------------------------------------------------------------
// Übersicht: Kategorien + kompakte Karten (Filter)
// ---------------------------------------------------------------------------
const overviewCategories: OverviewCategory[] = [
  { id: "familie", label: "Familie", emoji: "👨‍👩‍👧" },
  { id: "natur", label: "Natur", emoji: "🌲" },
  { id: "wandern", label: "Wandern", emoji: "🥾" },
  { id: "winter", label: "Winter", emoji: "❄️" },
  { id: "golf", label: "Golf", emoji: "⛳" },
  { id: "wellness", label: "Wellness", emoji: "💆" },
  { id: "schlechtwetter", label: "Schlechtwetter", emoji: "🌧️" },
];

const overviewItems: OverviewItem[] = [
  {
    id: "ov-buechelstein",
    emoji: "🥾",
    name: "Büchelstein-Wanderung",
    anchor: "buechelstein-wanderung",
    categories: ["wandern", "natur"],
    haus28: "direkt am Haus – zu Fuß",
    schoenblick: "ca. 10 Min. zum Startpunkt",
    season: "ganzjährig",
    audience: "Wanderer, aktive Familien",
  },
  {
    id: "ov-pullman",
    emoji: "🤠",
    name: "Pullman City",
    anchor: "pullman-city",
    categories: ["familie"],
    haus28: "ca. 20 Min. mit dem Auto",
    schoenblick: "ca. 15 Min. mit dem Auto",
    season: "Frühjahr bis Spätherbst",
    audience: "Familien, Gruppen",
  },
  {
    id: "ov-baumwipfelpfad",
    emoji: "🌲",
    name: "Baumwipfelpfad Neuschönau",
    anchor: "baumwipfelpfad",
    categories: ["natur", "familie"],
    haus28: "ca. 30 Min. mit dem Auto",
    schoenblick: "ca. 25 Min. mit dem Auto",
    season: "ganzjährig (witterungsabhängig)",
    audience: "Familien, barrierearm",
  },
  {
    id: "ov-nationalpark",
    emoji: "🦌",
    name: "Nationalpark Bayerischer Wald",
    anchor: "nationalpark",
    categories: ["natur", "wandern", "familie"],
    haus28: "ca. 25 km bis Neuschönau",
    schoenblick: "ca. 20 km bis Neuschönau",
    season: "ganzjährig",
    audience: "Naturfans, Familien",
  },
  {
    id: "ov-skigebiet",
    emoji: "⛷️",
    name: "Skigebiet Sonnenwald",
    anchor: "skigebiet-sonnenwald",
    categories: ["winter", "familie"],
    haus28: "ca. 10 Min. mit dem Auto",
    schoenblick: "ca. 5 Min. mit dem Auto",
    season: "Dez. – März (schneeabhängig)",
    audience: "Familien, Ski-Einsteiger",
  },
  {
    id: "ov-golf",
    emoji: "⛳",
    name: "Rusel-Arena Indoor Golf",
    anchor: "indoor-golf",
    categories: ["golf", "schlechtwetter"],
    haus28: "ca. 25 Min. mit dem Auto",
    schoenblick: "ca. 25 Min. mit dem Auto",
    season: "ganzjährig",
    audience: "Golfer, Gruppen",
  },
  {
    id: "ov-elypso",
    emoji: "💆",
    name: "elypso Bade- & Saunawelt",
    anchor: "elypso",
    categories: ["wellness", "schlechtwetter", "familie", "winter"],
    haus28: "ca. 20 Min. mit dem Auto",
    schoenblick: "ca. 30 Min. mit dem Auto",
    season: "ganzjährig",
    audience: "Wellness, Familien",
  },
];

// ---------------------------------------------------------------------------
// Detail-Sektionen der Ausflugsziele
// ---------------------------------------------------------------------------
type AttractionCta = {
  href: string;
  label: string;
  note?: { text: string; href: string; linkLabel: string };
};

type Attraction = {
  id: string;
  emoji: string;
  tag: string;
  tagColor: string;
  name: string;
  subtitle: string;
  description: string;
  highlights: string[];
  practicalInfo: { label: string; value: string }[];
  link: { href: string; label: string };
  cta: AttractionCta;
  bgColor: string;
  borderColor: string;
};

const attractions: Attraction[] = [
  {
    id: "pullman-city",
    emoji: "🤠",
    tag: "Familie & Unterhaltung",
    tagColor: "bg-amber-100 text-amber-800",
    name: "Pullman City",
    subtitle: "Die lebende Westernstadt in Eging am See",
    description:
      "Mitten im Bayerischen Wald liegt die Westernstadt Pullman City in Eging am See. Von Frühjahr bis Spätherbst läuft ein tägliches Showprogramm mit Stunt-, Pferde- und Westernshows, dazu kommen Saloons, Western-Gastronomie und Veranstaltungen für die ganze Familie. Von Haus Schönblick bist du in ca. 15 Minuten dort, von HAUS28 in ca. 20 Minuten – perfekt für einen ganzen Familientag, nach dem abends alle zufrieden in die eigene Ferienwohnung zurückkehren.",
    highlights: [
      "Live-Shows: Stunts, Pferde & Westernflair",
      "Saloons & Western-Gastronomie",
      "Erlebnisse & Mitmach-Angebote für Kinder",
      "Events und Feste über die ganze Saison",
    ],
    practicalInfo: [
      { label: "Fahrzeit", value: "ca. 20 Min. ab HAUS28 · ca. 15 Min. ab Haus Schönblick" },
      { label: "Saison", value: "Frühjahr bis Spätherbst – aktuelle Öffnungszeiten und Eintrittspreise auf der offiziellen Website" },
      { label: "Für wen", value: "Familien mit Kindern, Gruppen, Western-Fans" },
      { label: "Tipp", value: "Gut kombinierbar mit einem Abstecher an den Eginger See" },
    ],
    link: { href: "https://www.pullmancity.de", label: "pullmancity.de" },
    cta: {
      href: "/schoenblick",
      label: "Haus Schönblick für Gruppen und Familien entdecken",
      note: {
        text: "Neu: Bis zu 20 Personen buchen mehrere Apartments in einem Schritt – ",
        href: "/schoenblick/gruppen",
        linkLabel: "zur Gruppenbuchung",
      },
    },
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    id: "baumwipfelpfad",
    emoji: "🌲",
    tag: "Natur & Erlebnis",
    tagColor: "bg-emerald-100 text-emerald-800",
    name: "Baumwipfelpfad Neuschönau",
    subtitle: "Einer der längsten Baumwipfelpfade der Welt",
    description:
      "Der Baumwipfelpfad Bayerischer Wald in Neuschönau zählt zu den längsten Baumwipfelpfaden der Welt: 1.300 m barrierearmer Holzsteg führen in 8 bis 25 m Höhe durch die Baumkronen des Nationalparks. Am Ende wartet der 44 m hohe Aussichtsturm mit Panoramablick über den Bayerischen Wald. Erlebnisstationen mit Seil- und Wackelbrücken machen den Weg auch für Kinder spannend, ein Aufzug macht den Einstieg mit Kinderwagen oder Rollstuhl möglich.",
    highlights: [
      "1.300 m Holzsteg in den Baumkronen (8–25 m Höhe)",
      "44 m hoher Aussichtsturm mit Panoramablick",
      "Barrierearm – Aufzug, kinderwagen- & rollstuhltauglich",
      "Erlebnisstationen entlang des Weges",
      "Direkt am kostenlosen Tier-Freigelände des Nationalparks",
    ],
    practicalInfo: [
      { label: "Fahrzeit", value: "ca. 30 Min. ab HAUS28 · ca. 25 Min. ab Haus Schönblick" },
      { label: "Öffnung", value: "ganzjährig – bei extremem Wetter geschlossen; aktuelle Zeiten und Preise auf der offiziellen Website" },
      { label: "Für wen", value: "Familien, Naturfans, auch mit Kinderwagen oder Rollstuhl" },
      { label: "Tipp", value: "Kombi mit dem Tier-Freigelände nebenan – der Eintritt dort ist frei" },
    ],
    link: { href: "https://www.baumwipfelpfad.de", label: "baumwipfelpfad.de" },
    cta: {
      href: "/schoenblick",
      label: "Haus Schönblick – dein Basislager fürs Nationalpark-Gebiet",
    },
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
    description:
      "Seit 1970 ist der Bayerische Wald Deutschlands erster Nationalpark – rund 25.000 ha Waldwildnis, in der die Natur sich selbst überlassen bleibt. Die Besucherzentren Hans-Eisenmann-Haus in Neuschönau und Haus zur Wildnis in Ludwigsthal bieten Ausstellungen für jedes Wetter. In den beiden Tier-Freigeländen leben u. a. Luchse, Wölfe, Elche und Wisente in naturnahen Gehegen – der Eintritt ist frei. Wer nach der Wanderung echte Ruhe sucht, findet sie im HAUS28 am Waldrand von Grattersdorf.",
    highlights: [
      "Zwei Tier-Freigelände mit Luchs, Wolf, Elch & Wisent – Eintritt frei",
      "Markierte Wanderwege durch echte Waldwildnis",
      "Ranger-Führungen & Naturprogramme",
      "Besucherzentren mit Ausstellungen (auch bei Regen)",
      "Gegründet 1970 – Deutschlands ältester Nationalpark",
    ],
    practicalInfo: [
      { label: "Entfernung", value: "ca. 25 km ab HAUS28 · ca. 20 km ab Haus Schönblick (Neuschönau)" },
      { label: "Saison", value: "ganzjährig geöffnet, Tier-Freigelände kostenlos" },
      { label: "Für wen", value: "Naturfans, Wanderer, Familien" },
      { label: "Tipp", value: "Früh morgens sind die Chancen auf Tierbeobachtungen am besten" },
    ],
    link: { href: "https://www.nationalpark-bayerischer-wald.bayern.de", label: "nationalpark-bayerischer-wald.bayern.de" },
    cta: {
      href: "/haus28",
      label: "HAUS28 für deine Wellness- und Naturauszeit buchen",
    },
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
    description:
      "Das Skigebiet Sonnenwald rund um den Steinberglift in Langfurth (Gemeinde Schöfweg) liegt nur wenige Autominuten von Haus Schönblick und ca. 10 Minuten von HAUS28 entfernt. Am Brotjacklriegel (1.011 m) warten familienfreundliche Abfahrten mit Schleppliften, ein Rodelhang und ein Kinderland mit Förderband – teils mit Flutlicht am Abend. Langlauf ist in der Region Sonnenwald ebenfalls möglich. Nach dem Skitag ist die warme Ferienwohnung im Haus Schönblick nur einen Katzensprung entfernt – und im HAUS28 wartet der Outdoor-Whirlpool im Schnee.",
    highlights: [
      "Schlepplifte am Steinberg & Brotjacklriegel",
      "Rodelhang & Kinderland mit Förderband",
      "Abfahrten mit Flutlicht",
      "Langlauf in der Region Sonnenwald",
      "Familien- & anfängerfreundlich",
    ],
    practicalInfo: [
      { label: "Fahrzeit", value: "ca. 10 Min. ab HAUS28 · ca. 5 Min. ab Haus Schönblick" },
      { label: "Saison", value: "Dezember – März (schneeabhängig); aktueller Schneebericht auf der offiziellen Website" },
      { label: "Für wen", value: "Familien, Einsteiger, Rodler" },
      { label: "Tipp", value: "Skitag + Abend im ganzjährig nutzbaren Whirlpool am HAUS28" },
    ],
    link: { href: "https://www.steinberglift.de", label: "steinberglift.de" },
    cta: {
      href: "/schoenblick",
      label: "Haus Schönblick – Winterurlaub wenige Minuten vom Lift",
    },
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
  },
  {
    id: "indoor-golf",
    emoji: "⛳",
    tag: "Sport & Schlechtwetter",
    tagColor: "bg-lime-100 text-lime-800",
    name: "Rusel-Arena Indoor Golf",
    subtitle: "TrackMan-Simulatoren am Golfplatz Rusel",
    description:
      "Die Rusel-Arena am Deggendorfer Golfclub (eröffnet 2024) bringt Golf ins Trockene: Auf 370 m² stehen TrackMan-Simulatoren mit präziser Schlaganalyse und über 200 virtuellen Golfplätzen aus aller Welt bereit, dazu ein Puttinggrün und ein gemütlicher Bar-Bereich. Anfänger, Fortgeschrittene und Profis spielen hier ganzjährig und wetterunabhängig – auch als Gruppenaktivität für Nicht-Golfer ein Erlebnis.",
    highlights: [
      "TrackMan-Simulatoren mit präziser Schlaganalyse",
      "370 m² Indoor-Anlage mit Puttinggrün",
      "Über 200 virtuelle Golfplätze weltweit",
      "Bar-Bereich zum Ausklingen",
      "Ganzjährig & wetterunabhängig",
    ],
    practicalInfo: [
      { label: "Fahrzeit", value: "ca. 25 Min. ab HAUS28 und ab Haus Schönblick" },
      { label: "Preise", value: "aktuelle Preise und Online-Buchung auf der offiziellen Website" },
      { label: "Für wen", value: "Golfer, Gruppen, Schlechtwetter-Tage" },
      { label: "Tipp", value: "Auch für Nicht-Golfer eine unterhaltsame Gruppenaktivität" },
    ],
    link: { href: "https://arena.deggendorfer-golfclub.de", label: "arena.deggendorfer-golfclub.de" },
    cta: {
      href: "/haus28",
      label: "HAUS28 für deine Wellness- und Naturauszeit buchen",
    },
    bgColor: "bg-lime-50",
    borderColor: "border-lime-200",
  },
  {
    id: "elypso",
    emoji: "💆",
    tag: "Wellness & Baden",
    tagColor: "bg-cyan-100 text-cyan-800",
    name: "elypso Deggendorf",
    subtitle: "Freizeit- und Erlebnisbad mit Saunawelt",
    description:
      "Das elypso in Deggendorf verbindet Badewelt und Saunawelt unter einem Dach: Schwimm- und Erlebnisbecken für Familien, dazu mehrere Themensaunen, Dampfbad und Saunagarten für alle, die Entspannung suchen. Im Sommer öffnet zusätzlich das Freibad. Damit ist das elypso eine verlässliche Adresse für Regentage – und die perfekte Ergänzung zum privaten Whirlpool am HAUS28.",
    highlights: [
      "Badewelt mit Schwimm- & Erlebnisbecken",
      "Saunawelt mit Themensaunen, Dampfbad & Saunagarten",
      "Freibad im Sommer",
      "Ganzjährig geöffnet – ideal bei Schlechtwetter",
    ],
    practicalInfo: [
      { label: "Fahrzeit", value: "ca. 20 Min. ab HAUS28 · ca. 30 Min. ab Haus Schönblick" },
      { label: "Öffnung", value: "ganzjährig; aktuelle Zeiten und Preise auf der offiziellen Website" },
      { label: "Für wen", value: "Wellness-Fans, Familien, Schlechtwetter-Tage" },
      { label: "Tipp", value: "Sauna-Tag im elypso, abends Whirlpool unterm Sternenhimmel am HAUS28" },
    ],
    link: { href: "https://www.elypso.de", label: "elypso.de" },
    cta: {
      href: "/haus28",
      label: "HAUS28 mit privatem Outdoor-Whirlpool entdecken",
    },
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
  },
];

// ---------------------------------------------------------------------------
// Büchelstein-Wanderung
// ---------------------------------------------------------------------------
const hikeStats = [
  { label: "Länge", value: "ca. 10 km ab Grattersdorf · ca. 7 km ab Kerschbaum" },
  { label: "Gehzeit", value: "ca. 3–3,5 Std. · kurze Variante ca. 2–2,5 Std." },
  { label: "Höhenmeter", value: "ca. 400 hm · kurze Variante ca. 300 hm" },
  { label: "Schwierigkeit", value: "mittel – auch für geübte Familien" },
  { label: "Gipfel", value: "Großer Büchelstein, 832 m" },
  { label: "Markierung", value: "Rundweg Nr. 54 „Büchelstein-Runde“" },
];

const hikeWaypoints = [
  {
    step: 1,
    name: "Start: HAUS28",
    detail: "Büchelstein 28, Grattersdorf – das Haus liegt direkt am markierten Rundweg Nr. 54, du startest ohne Anfahrt.",
    icon: "🏠",
  },
  {
    step: 2,
    name: "Wallfahrtskapelle Rastbuche",
    detail:
      "Die malerische Wallfahrtskapelle Rastbuche bei Grattersdorf stammt aus dem 18. Jahrhundert und ist ein bekanntes Ziel auf den regionalen Wanderwegen – darunter die Rastbuchen-Runde (Nr. 52, ca. 8 km).",
    icon: "⛪",
  },
  {
    step: 3,
    name: "Kleiner Büchelstein",
    detail: "Der erste Gipfelpunkt der Tour mit schönem Ausblick über Grattersdorf und die bewaldeten Hügel des Bayerischen Waldes.",
    icon: "⛰️",
  },
  {
    step: 4,
    name: "Großer Büchelstein (832 m)",
    detail:
      "Der Hauptgipfel und Höhepunkt der Tour: Aussichtsfelsen mit Gipfelkreuz und – bei klarem Wetter – weitem Blick ins Donautal, bei sehr guter Fernsicht bis zu den Alpen. Der Büchelstein ist als Geotop ausgewiesen.",
    icon: "🏔️",
    highlight: true,
  },
  {
    step: 5,
    name: "Rückweg zu HAUS28",
    detail: "Als Rundweg führt die Tour auf anderem Pfad zurück zum Ausgangspunkt – abwechslungsreich und ohne Streckenwiederholung.",
    icon: "🏠",
  },
];

// ---------------------------------------------------------------------------
// Saisonübersicht mit Unterkunfts-CTAs
// ---------------------------------------------------------------------------
const seasons = [
  {
    season: "Frühling",
    emoji: "🌸",
    months: "März – Mai",
    activities: [
      "Büchelstein & ruhige Wanderwege ohne Trubel",
      "Tier-Freigelände im Nationalpark (kostenlos)",
      "Wildblumen & Vogelbeobachtung",
    ],
    color: "bg-pink-50 border-pink-200",
    cta: { href: "/schoenblick", label: "Haus Schönblick ab 59 € / Nacht entdecken" },
  },
  {
    season: "Sommer",
    emoji: "☀️",
    months: "Juni – August",
    activities: [
      "Pullman City & Baumwipfelpfad",
      "Büchelstein-Wanderung ab HAUS28",
      "Badeseen der Umgebung, z. B. Eginger See",
      "Radfahren durch die Hügellandschaft",
    ],
    color: "bg-yellow-50 border-yellow-200",
    cta: { href: "/schoenblick/gruppen", label: "Sommer mit Familie oder Gruppe? Zur Gruppenbuchung" },
  },
  {
    season: "Herbst",
    emoji: "🍂",
    months: "September – November",
    activities: [
      "Herbstfarben & klare Fernsicht am Büchelstein",
      "Indoor Golf in der Rusel-Arena",
      "Saunatag im elypso Deggendorf",
      "Whirlpool-Abende am HAUS28",
    ],
    color: "bg-orange-50 border-orange-200",
    cta: { href: "/haus28", label: "HAUS28 für deine Wellness-Auszeit buchen" },
  },
  {
    season: "Winter",
    emoji: "❄️",
    months: "Dezember – Februar",
    activities: [
      "Skifahren & Rodeln im Skigebiet Sonnenwald",
      "Langlauf & Winterwandern",
      "Outdoor-Whirlpool im Schnee am HAUS28",
    ],
    color: "bg-blue-50 border-blue-200",
    cta: { href: "/haus28", label: "HAUS28 mit Whirlpool im Winter buchen" },
  },
];

// ---------------------------------------------------------------------------
// Icons (extern-Link) als kleine Helper
// ---------------------------------------------------------------------------
function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function OfficialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-body text-sm text-forest-700 hover:text-forest-900 underline underline-offset-2 transition-colors"
    >
      Offizielle Website: {label}
      <ExternalIcon />
      <span className="sr-only">(öffnet in neuem Tab)</span>
    </a>
  );
}

export default function AusflugszielePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative bg-forest-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/shared/region-bayerischer-wald.jpg')] bg-cover bg-center opacity-25" />
        <div className="relative z-10 container-site section-pad">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 font-body text-sm text-cream-50/70">
              <li><Link href="/" className="hover:text-cream-50 transition-colors">Startseite</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-cream-50/90" aria-current="page">Ausflugsziele</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-400 mb-4">
              Region Bayerischer Wald
            </p>
            <h1 className="font-display text-display-lg text-cream-50 mb-5 text-balance">
              Ausflugsziele & Freizeitangebote
            </h1>
            <p className="font-body text-lg text-cream-50/80 leading-relaxed mb-8 max-w-2xl">
              Rund um HAUS28 am Büchelstein und Haus Schönblick in Schöfweg wartet der Bayerische Wald mit einer Fülle an Erlebnissen – von wilder Natur über Westernflair bis zu Indoor-Golf und Saunawelt. Hier findest du unsere persönlichen Empfehlungen, sortiert nach Zielgruppe, Entfernung und Jahreszeit.
            </p>

            {/* Property pills */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/haus28"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cream-50/10 border border-cream-50/25 text-cream-50/90 text-sm font-body rounded-full hover:bg-cream-50/15 transition-colors"
              >
                <IconMapPin size={13} />
                HAUS28 · Grattersdorf
              </Link>
              <Link
                href="/schoenblick"
                className="inline-flex items-center gap-2 px-4 py-2 bg-cream-50/10 border border-cream-50/25 text-cream-50/90 text-sm font-body rounded-full hover:bg-cream-50/15 transition-colors"
              >
                <IconMapPin size={13} />
                Haus Schönblick · Schöfweg
              </Link>
              <Link
                href="/buchen"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 text-forest-900 text-sm font-body font-medium rounded-full hover:bg-gold-400 transition-colors"
              >
                Unterkunft wählen & buchen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick-links */}
      <section className="bg-cream-100 border-b border-cream-200 sticky top-0 z-30 overflow-x-auto scrollbar-hide" aria-label="Schnellnavigation">
        <div className="container-site">
          <div className="flex items-center gap-1 py-3 w-max min-w-full">
            {[
              { href: "#uebersicht", label: "🧭 Übersicht" },
              { href: "#buechelstein-wanderung", label: "🥾 Büchelstein-Tour" },
              { href: "#pullman-city", label: "🤠 Pullman City" },
              { href: "#baumwipfelpfad", label: "🌲 Baumwipfelpfad" },
              { href: "#nationalpark", label: "🦌 Nationalpark" },
              { href: "#skigebiet-sonnenwald", label: "⛷️ Skigebiet" },
              { href: "#indoor-golf", label: "⛳ Indoor Golf" },
              { href: "#schlechtwetter", label: "🌧️ Schlechtwetter" },
              { href: "#gruppen", label: "👥 Gruppen" },
              { href: "#saison", label: "📅 Jahreszeiten" },
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

      {/* ── Kompakte Übersicht mit Filter ─────────────────────────────── */}
      <section id="uebersicht" className="section-pad-sm bg-cream-50 scroll-mt-20" aria-labelledby="uebersicht-heading">
        <div className="container-site">
          <div className="mb-8">
            <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-2">
              Alles auf einen Blick
            </p>
            <h2 id="uebersicht-heading" className="font-display text-display-md text-forest-900 mb-3">
              Ausflugsziele im Überblick
            </h2>
            <p className="font-body text-lg text-forest-600 max-w-2xl leading-relaxed">
              Filtere nach dem, was zu deinem Urlaub passt – mit Entfernung ab HAUS28 und Haus Schönblick, Saison und Zielgruppe für jedes Ziel.
            </p>
          </div>
          <AusflugszieleFilter categories={overviewCategories} items={overviewItems} />
        </div>
      </section>

      {/* ── Attractions ───────────────────────────────────────────────── */}
      <section className="section-pad bg-cream-50 pt-0 md:pt-0 lg:pt-0" aria-label="Ausflugsziele im Detail">
        <div className="container-site">
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
                  </div>

                  {/* Description */}
                  <p className="font-body text-base text-forest-700 leading-relaxed mb-6">
                    {attr.description}
                  </p>

                  {/* Two-column: Highlights + Practical */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                    {/* Highlights */}
                    <div>
                      <p className="font-body text-xs font-semibold tracking-[0.12em] uppercase text-forest-500 mb-3">
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
                      <p className="font-body text-xs font-semibold tracking-[0.12em] uppercase text-forest-500 mb-3">
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
                  <OfficialLink href={attr.link.href} label={attr.link.label} />

                  {/* Property CTA */}
                  <div className="mt-5 pt-5 border-t border-forest-900/10">
                    <Link
                      href={attr.cta.href}
                      className="inline-flex items-center gap-2 font-body text-sm font-medium text-forest-900 hover:text-forest-700 transition-colors"
                    >
                      <span className="w-5 h-5 rounded-full bg-gold-500 flex-none flex items-center justify-center text-forest-900">
                        <IconArrowRight size={11} />
                      </span>
                      {attr.cta.label}
                    </Link>
                    {attr.cta.note && (
                      <p className="font-body text-xs text-forest-500 mt-2 ml-7">
                        {attr.cta.note.text}
                        <Link href={attr.cta.note.href} className="underline underline-offset-2 hover:text-forest-700">
                          {attr.cta.note.linkLabel}
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </article>
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
            <p className="font-body text-base text-cream-50/80 leading-relaxed mb-3">
              Unsere Lieblingswanderung startet direkt an der Haustür von HAUS28: Der markierte Rundweg Nr. 54 führt über den Kleinen Büchelstein auf den Großen Büchelstein (832 m) und an der historischen Wallfahrtskapelle Rastbuche vorbei durch dichten Bayerwald-Forst. Die Tour ist mittelschwer, auch für geübte Familien machbar und belohnt mit weitem Blick ins Donautal.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-10 font-body text-sm">
              {hikeStats.map((s) => (
                <div key={s.label}>
                  <p className="text-cream-50/60 text-xs mb-0.5">{s.label}</p>
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
                      <p className="font-body text-sm text-cream-50/70 leading-snug">{wp.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info box */}
            <div className="mt-10 p-5 rounded-2xl bg-cream-50/5 border border-cream-50/10">
              <p className="font-body text-sm text-cream-50/80 mb-3">
                <strong className="text-cream-50">Karte & GPX:</strong> Die Route „Büchelstein, Kleiner Büchelstein und Rastbuche“ (Markierung 54) findest du inklusive GPX-Download auf{" "}
                <a
                  href="https://www.outdooractive.com/de/route/wanderung/bayerischer-wald/buechelstein-kleiner-buechelstein-und-rastbuche/49491575/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 text-cream-50 hover:text-gold-300 transition-colors"
                >
                  Outdooractive
                  <span className="sr-only"> (öffnet in neuem Tab)</span>
                </a>
                . Vor Ort einfach der Wanderweg-Beschilderung Nr. 54 ab HAUS28 folgen – oder die Rastbuchen-Runde (Nr. 52, ca. 8 km) wählen.
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

      {/* ── Schlechtwetter ────────────────────────────────────────────── */}
      <section id="schlechtwetter" className="section-pad bg-cream-100 scroll-mt-16" aria-labelledby="schlechtwetter-heading">
        <div className="container-site">
          <div className="mb-8 max-w-2xl">
            <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-2">
              Plan B fürs Wetter
            </p>
            <h2 id="schlechtwetter-heading" className="font-display text-display-sm text-forest-900 mb-3">
              Schlechtwetter im Bayerischen Wald
            </h2>
            <p className="font-body text-base text-forest-600 leading-relaxed">
              Regen gehört im Bayerwald dazu – langweilig wird es trotzdem nicht. Diese Ziele funktionieren bei jedem Wetter:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                emoji: "⛳",
                title: "Rusel-Arena Indoor Golf",
                text: "370 m² TrackMan-Golf am Deggendorfer Golfclub – ca. 25 Min. von beiden Häusern.",
                href: "#indoor-golf",
                linkLabel: "Zum Ausflugsziel",
              },
              {
                emoji: "💆",
                title: "elypso Bade- & Saunawelt",
                text: "Erlebnisbad und Saunawelt in Deggendorf – ca. 20–30 Min. Fahrzeit.",
                href: "#elypso",
                linkLabel: "Zum Ausflugsziel",
              },
              {
                emoji: "🦉",
                title: "Nationalpark-Besucherzentren",
                text: "Hans-Eisenmann-Haus & Haus zur Wildnis: Ausstellungen zur Waldwildnis, ideal bei Regen.",
                href: "#nationalpark",
                linkLabel: "Zum Ausflugsziel",
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-cream-200 bg-white p-5 shadow-card">
                <p className="text-2xl mb-2" aria-hidden="true">{c.emoji}</p>
                <h3 className="font-display text-lg text-forest-900 mb-1">{c.title}</h3>
                <p className="font-body text-sm text-forest-600 mb-3">{c.text}</p>
                <a href={c.href} className="font-body text-sm text-gold-600 hover:text-gold-700 transition-colors">
                  {c.linkLabel} ↓
                </a>
              </div>
            ))}
          </div>

          {/* HAUS28 Wellness Callout */}
          <div className="rounded-3xl bg-forest-900 p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <p className="font-body text-xs tracking-[0.14em] uppercase text-gold-400 mb-2">
                Oder einfach: drinnen bleiben
              </p>
              <h3 className="font-display text-2xl text-cream-50 mb-2">
                Wellness direkt am HAUS28
              </h3>
              <p className="font-body text-sm text-cream-50/80 leading-relaxed">
                Der schönste Schlechtwetter-Plan wartet im eigenen Garten: Im HAUS28 gehört ein privater, holzbefeuerter Outdoor-Whirlpool zur Ausstattung – ganzjährig nutzbar, auch bei Regen oder Schnee. Zur Wintersaison 26/27 rüsten wir auf einen Premium-HotTub mit Hydromassage und LED-Beleuchtung auf –{" "}
                <Link href="/blog/premium-hottub-rechtzeitig-fur-die-wintersaison-2627-wir-machen-nagel-mit-kopfen" className="underline underline-offset-2 hover:text-gold-300 transition-colors">
                  alle Details im Blog
                </Link>
                . Dazu Panoramafenster mit Waldblick, Kamin und viel Platz zum Ankommen.
              </p>
            </div>
            <div className="flex-none">
              <Link
                href="/haus28"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-forest-900 font-body font-medium text-sm rounded-full hover:bg-gold-400 transition-colors shadow-cta"
              >
                HAUS28 für deine Wellness- und Naturauszeit buchen
                <IconArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Gruppen bis 20 Personen ───────────────────────────────────── */}
      <section id="gruppen" className="section-pad bg-white scroll-mt-16" aria-labelledby="gruppen-heading">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-2">
                Gemeinsam unterwegs
              </p>
              <h2 id="gruppen-heading" className="font-display text-display-sm text-forest-900 mb-4">
                Ausflüge für Gruppen bis 20 Personen
              </h2>
              <p className="font-body text-base text-forest-600 leading-relaxed mb-4">
                Familienfeier, Vereinsausflug oder Firmen-Retreat: Der Bayerische Wald ist ein dankbares Ziel für Gruppen. Pullman City bietet Programm für alle Altersgruppen, im Nationalpark lassen sich gemeinsame Wanderungen und Ranger-Führungen planen, die Rusel-Arena funktioniert als Gruppenaktivität auch für Nicht-Golfer – und im Winter wird das Skigebiet Sonnenwald zum gemeinsamen Spielplatz.
              </p>
              <p className="font-body text-base text-forest-600 leading-relaxed mb-6">
                Übernachtet wird im Haus Schönblick in Schöfweg: 5 Ferienwohnungen unter einem Dach mit Platz für bis zu 20 Personen. Mit der neuen Gruppenbuchung reserviert ihr mehrere Apartments in einem Schritt – ein Zeitraum, eine Zahlung, alles bestätigt.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/schoenblick/gruppen"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-forest-900 font-body font-medium text-sm rounded-full hover:bg-gold-400 transition-colors shadow-cta"
                >
                  Zur Gruppenbuchung – bis 20 Personen
                  <IconArrowRight size={14} />
                </Link>
                <Link
                  href="/schoenblick"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-forest-200 text-forest-700 font-body text-sm rounded-full hover:border-forest-400 hover:text-forest-900 transition-colors"
                >
                  Haus Schönblick entdecken
                </Link>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                { emoji: "🤠", text: "Pullman City: Shows & Western-Gastronomie – Programm für Jung und Alt" },
                { emoji: "🥾", text: "Nationalpark: gemeinsame Wanderungen & Ranger-Führungen" },
                { emoji: "⛳", text: "Rusel-Arena: Indoor-Golf als Team-Event, auch für Einsteiger" },
                { emoji: "⛷️", text: "Skigebiet Sonnenwald: Ski & Rodeln, ca. 5 Min. von Haus Schönblick" },
                { emoji: "🏡", text: "Haus Schönblick: 5 Apartments, bis 20 Personen, eine Buchung" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 rounded-2xl border border-cream-200 bg-cream-50 p-4">
                  <span className="text-xl flex-none" aria-hidden="true">{item.emoji}</span>
                  <span className="font-body text-sm text-forest-700 leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Ohne Auto ─────────────────────────────────────────────────── */}
      <section id="ohne-auto" className="section-pad-sm bg-cream-50 scroll-mt-16" aria-labelledby="ohne-auto-heading">
        <div className="container-site max-w-3xl">
          <h2 id="ohne-auto-heading" className="font-display text-display-sm text-forest-900 mb-3">
            Ausflüge ohne Auto
          </h2>
          <p className="font-body text-base text-forest-600 leading-relaxed mb-5">
            Ganz ehrlich: Für die meisten Ausflugsziele auf dieser Seite empfehlen wir ein Auto, denn der öffentliche Nahverkehr rund um Grattersdorf und Schöfweg ist begrenzt. Zwei Erlebnisse starten aber direkt an der Haustür:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 rounded-2xl border border-cream-200 bg-white p-4 shadow-card">
              <span className="text-xl flex-none" aria-hidden="true">🥾</span>
              <span className="font-body text-sm text-forest-700 leading-relaxed">
                <strong className="text-forest-900">Ab HAUS28:</strong> Die Büchelstein-Rundwanderung (Markierung 54) beginnt direkt am Haus – der Gipfel des Großen Büchelsteins (832 m) ist ohne Anfahrt erreichbar.{" "}
                <a href="#buechelstein-wanderung" className="underline underline-offset-2 hover:text-forest-900">Zur Tour ↑</a>
              </span>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-cream-200 bg-white p-4 shadow-card">
              <span className="text-xl flex-none" aria-hidden="true">🗼</span>
              <span className="font-body text-sm text-forest-700 leading-relaxed">
                <strong className="text-forest-900">Ab Haus Schönblick:</strong> Markierte Wanderwege führen von Schöfweg in die Region Sonnenwald, u. a. über die ausgeschilderten Turmwege hinauf zum Brotjacklriegel (1.011 m) mit seinem hölzernen Aussichtsturm.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Season Overview ───────────────────────────────────────────── */}
      <section id="saison" className="section-pad bg-cream-100 scroll-mt-16" aria-labelledby="seasons-heading">
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
            {seasons.map((s) => (
              <div key={s.season} className={`rounded-2xl border p-5 flex flex-col ${s.color}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl" aria-hidden="true">{s.emoji}</span>
                  <h3 className="font-display text-lg text-forest-900">{s.season}</h3>
                </div>
                <p className="font-body text-xs text-forest-500 mb-3">{s.months}</p>
                <ul className="space-y-1.5 mb-4">
                  {s.activities.map((a) => (
                    <li key={a} className="font-body text-sm text-forest-700 flex items-start gap-1.5">
                      <span className="text-forest-400 mt-0.5" aria-hidden="true">·</span>
                      {a}
                    </li>
                  ))}
                </ul>
                <Link
                  href={s.cta.href}
                  className="mt-auto inline-flex items-center gap-1.5 font-body text-sm font-medium text-forest-900 hover:text-forest-700 underline underline-offset-2 transition-colors"
                >
                  {s.cta.label}
                  <IconArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <div id="faq" className="scroll-mt-16">
        <FaqAccordion faqs={faqs} />
      </div>

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
          <p className="font-body text-base text-cream-50/70 leading-relaxed mb-8">
            HAUS28 am Büchelstein und Haus Schönblick in Schöfweg liegen ideal im Herzen des Bayerischen Waldes – perfekt als Ausgangspunkt für alle Ausflüge auf dieser Seite. Buche direkt und spare bis zu 20 % gegenüber Buchungsplattformen.
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-cream-50/25 text-cream-50/90 font-body rounded-full hover:border-cream-50/40 hover:text-cream-50 transition-colors"
            >
              Haus Schönblick entdecken
              <IconArrowRight size={16} />
            </Link>
          </div>
          <p className="font-body text-sm text-cream-50/60 mt-6">
            Mit Familie oder Gruppe unterwegs?{" "}
            <Link href="/schoenblick/gruppen" className="underline underline-offset-2 text-cream-50/80 hover:text-cream-50 transition-colors">
              Gruppenbuchung für bis zu 20 Personen
            </Link>{" "}
            ·{" "}
            <Link href="/buchen" className="underline underline-offset-2 text-cream-50/80 hover:text-cream-50 transition-colors">
              Alle Unterkünfte & Preise
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
