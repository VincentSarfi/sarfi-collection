// Central data file for all property content.
// Edit values here – all pages pull from this file.

import { arrival, driveMinutes as m, PET_FEE_PER_NIGHT, PET_MAX, restaurantsAnswer } from "./surroundings";
import { PROPERTY_CONFIGS } from "@/config/properties.config";

// Endreinigung und Aufpreis pro Person kommen aus der Buchungskonfiguration,
// damit die Kosten-FAQ nie vom Preis im Buchungsweg abweicht. Im Haus
// Schönblick sind beide in allen Wohnungen gleich, B5 steht für alle.
const kostenHaus28 = PROPERTY_CONFIGS.haus28;
const kostenSchoenblick = PROPERTY_CONFIGS.b5;

export type Amenity = {
  icon: string;
  label: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type ApartmentData = {
  id: string;
  name: string;
  subtitle: string;
  airbnbUrl: string;
  airbnbRating: number;
  airbnbReviewCount: number;
  /** Booking.com, 10er-Skala – nur setzen, wenn Booking den Wert für genau diese
   *  Wohnung zeigt. Das gemeinsame Schönblick-Inserat hat nur einen Wert für
   *  alle Wohnungen (schoenblick.bookingRating). */
  bookingRating?: number;
  bookingReviewCount?: number;
  smoobuPropertyId: string;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  sqm: number;
  priceFrom: number;
  description: string;
  shortDescription: string;
  amenities: Amenity[];
  images: {
    hero: string;
    gallery: GalleryImage[];
    thumbnail: string;
  };
  faqs: { question: string; answer: string }[];
  /** Lage im Haus, z. B. "Erdgeschoss" */
  location: string;
  /** Außenbereich, z. B. "Terrasse" */
  outdoor: string;
  /** Charakter der Wohnung in einem Satz */
  style: string;
  isNew?: boolean;
  bedroomImages?: { name: string; bed: string; img: string }[];
};

export type PropertyData = {
  id: string;
  name: string;
  subtitle: string;
  address: string;
  coordinates: Coordinates;
  description: string;
  shortDescription: string;
  airbnbRating: number;
  airbnbReviewCount: number;
  bookingRating?: number;
  bookingReviewCount?: number;
  /** Wert, mit dem Booking.com den Traveller Review Award vergeben hat. */
  bookingAwardScore?: number;
  /** FeWo-direkt, 10er-Skala wie auf der Plattform */
  fewoRating?: number;
  fewoReviewCount?: number;
  googleRating?: number;
  googleReviewCount?: number;
  hometogoRating?: number;
  hometogoReviewCount?: number;
  priceFrom: number;
  images: {
    hero: string;
    gallery: GalleryImage[];
    thumbnail: string;
  };
  amenities: Amenity[];
  faqs: { question: string; answer: string }[];
  smoobuPropertyId: string;
  smoobuEmbedUrl?: string;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  sqm?: number;
  airbnbUrl?: string;
  /** Google-Unternehmensprofil (stabile CID-URL) */
  googleMapsUrl?: string;
  superhost?: boolean;
  guestFavorite?: boolean;
  apartments?: Record<string, ApartmentData>;
};

// ---------------------------------------------------------------------------
// HAUS28
// ---------------------------------------------------------------------------
export const haus28: PropertyData = {
  id: "haus28",
  name: "HAUS28",
  subtitle: "Modernes A-Frame am Büchelstein, Grattersdorf",
  address: "Büchelstein 28, 94541 Grattersdorf",
  coordinates: {
    lat: 48.8055608808348,
    lng: 13.18477563495356,
  },
  maxGuests: 8,
  bedrooms: 4,
  bathrooms: 2,
  sqm: 157,
  priceFrom: 199,
  superhost: true,
  guestFavorite: true,
  airbnbUrl: "https://www.airbnb.de/rooms/1375439439358638425",
  googleMapsUrl: "https://www.google.com/maps?cid=18249145745632813741",
  // Stand 06.10.2026, abgelesen auf den Plattformen und 1:1 so übernommen,
  // ohne herausgerechnete Bewertungen. FeWo-direkt zeigt 9,4/10 aus 18
  // (darin eine irrtümliche 4/10, die FeWo nicht löscht). Booking.com am
  // 27.10.2026: 9,8 aus 16.
  airbnbRating: 5.0,
  airbnbReviewCount: 25,
  bookingRating: 9.8,
  bookingReviewCount: 16,
  // Traveller Review Award 2026 wurde für 9,9 vergeben – nur dieser Wert steht
  // unter dem Award-Badge, nicht die aktuelle Bewertung.
  bookingAwardScore: 9.9,
  fewoRating: 9.4,
  fewoReviewCount: 18,
  googleRating: 4.8,
  googleReviewCount: 11,
  hometogoRating: 5.0,
  hometogoReviewCount: 1,
  smoobuPropertyId: "2610828",
  smoobuEmbedUrl: "https://login.smoobu.com/de/booking-tool/iframe/2610828",
  shortDescription:
    "Einzigartiges A-Frame Ferienhaus am Büchelstein bei Grattersdorf – ein architektonischer Rückzugsort für bis zu 8 Personen im Bayerischen Wald.",
  description:
    "Am Büchelstein bei Grattersdorf erwartet dich HAUS28 – ein modernes A-Frame Ferienhaus mit 157 m² Wohnfläche und privatem Outdoor-Whirlpool im Garten, das Architektur und Natur zu einer einzigartigen Atmosphäre verbindet. Die markante Dreiecksform, das hochwertige Holz-Interior und das raumhohe Panoramafenster lassen die Grenze zwischen drinnen und draußen verschwimmen. Vier Schlafzimmer und zwei Bäder bieten Platz für bis zu 8 Personen. Morgens erwachst du zwischen Bäumen, abends sitzt du im warmen Wasser, an der Feuerschale oder auf der großzügigen Terrasse. Perfekt für Familien, Freundesgruppen oder alle, die wirklich abschalten wollen.",
  amenities: [
    { icon: "whirlpool", label: "Privater Outdoor-Whirlpool" },
    { icon: "wifi", label: "WLAN" },
    { icon: "kitchen", label: "Voll ausgestattete Küche" },
    { icon: "parking", label: "Kostenloser Parkplatz" },
    { icon: "ac", label: "Klimaanlage" },
    { icon: "firepit", label: "Feuerschale" },
    { icon: "terrace", label: "Große Terrasse" },
    { icon: "terrace", label: "2 Balkone" },
    { icon: "bbq", label: "Grill" },
    { icon: "washing", label: "Waschmaschine" },
    { icon: "dryer", label: "Trockner" },
    { icon: "tv", label: "Smart TV" },
    { icon: "heating", label: "Heizung" },
    { icon: "coffee", label: "Kaffeemaschine" },
    { icon: "bed", label: "Hochwertige Bettwäsche" },
    { icon: "towel", label: "Handtücher inklusive" },
    { icon: "checkin", label: "Self-Check-in" },
    { icon: "smoke_detector", label: "Rauchmelder" },
    { icon: "baby_crib", label: "Kinderreisebett" },
    { icon: "mountain", label: "Waldlage" },
  ],
  images: {
    hero: "/images/haus28/hero.webp",
    thumbnail: "/images/haus28/hero-thumb.webp",
    gallery: [
      { src: "/images/haus28/gallery/haus_28_250523_160.webp", alt: "HAUS28 – A-Frame Frontansicht im Abendlicht" },
      { src: "/images/haus28/gallery/hottub_garten.webp", alt: "HAUS28 – Privater HotTub mit Holzofen im Garten" },
      { src: "/images/haus28/gallery/haus_28_250523_455.webp", alt: "HAUS28 – Wohnbereich mit Panoramafenster zum Wald" },
      { src: "/images/haus28/gallery/haus_28_250523_380.webp", alt: "HAUS28 – Schlafzimmer 3 im Obergeschoss mit Dreiecksfenster" },
      { src: "/images/haus28/gallery/haus_28_250523_581.webp", alt: "HAUS28 – Küche mit grünen Schränken" },
      { src: "/images/haus28/gallery/haus_28_250523_478.webp", alt: "HAUS28 – Wohn- und Essbereich unter dem Giebelfenster" },
      { src: "/images/haus28/gallery/hottub_haus.webp", alt: "HAUS28 – Whirlpool mit Blick auf das A-Frame" },
      { src: "/images/haus28/gallery/haus_28_250523_730.webp", alt: "HAUS28 – Gartenseite mit Terrasse und Balkon" },
      { src: "/images/haus28/gallery/haus_28_250523_604.webp", alt: "HAUS28 – Schlafzimmer 1 im Erdgeschoss" },
      { src: "/images/haus28/gallery/haus_28_250523_647.webp", alt: "HAUS28 – Schlafzimmer 2 mit Terrassenzugang" },
      { src: "/images/haus28/gallery/haus_28_250523_413.webp", alt: "HAUS28 – Schlafzimmer 4 im Obergeschoss" },
      { src: "/images/haus28/gallery/haus_28_250523_699.webp", alt: "HAUS28 – Badezimmer mit blauen Fliesen" },
      { src: "/images/haus28/gallery/haus_28_250523_264.webp", alt: "HAUS28 – Zweites Bad mit Dusche" },
      { src: "/images/haus28/gallery/haus_28_250523_556.webp", alt: "HAUS28 – Offene Wohn- und Küchenfläche" },
      { src: "/images/haus28/gallery/haus_28_250523_442.webp", alt: "HAUS28 – Esstisch am Panoramafenster" },
      { src: "/images/haus28/gallery/haus_28_250523_386.webp", alt: "HAUS28 – Leseecke am Dreiecksfenster" },
      { src: "/images/haus28/gallery/img_5694.webp", alt: "HAUS28 – Privater Outdoor-Whirlpool im Garten am Waldrand" },
      { src: "/images/haus28/gallery/haus_28_250523_721.webp", alt: "HAUS28 – Gedeckter Tisch auf der Terrasse" },
      { src: "/images/haus28/gallery/haus_28_250523_745.webp", alt: "HAUS28 – Feuerschale im Garten" },
      { src: "/images/haus28/gallery/haus_28_250523_165.webp", alt: "HAUS28 – Außenansicht durch den Wald" },
      { src: "/images/haus28/gallery/haus_28_250523_175.webp", alt: "HAUS28 – Grundstück von oben" },
      { src: "/images/haus28/gallery/haus_28_250523_522.webp", alt: "HAUS28 – Terrasse von oben" },
      { src: "/images/haus28/gallery/haus_28_250523_113.webp", alt: "HAUS28 – Eingang Hausfront" },
      { src: "/images/haus28/gallery/haus_28_250523_207.webp", alt: "HAUS28 – Eingangsbereich mit Treppe" },
      { src: "/images/haus28/gallery/haus_28_250523_433.webp", alt: "HAUS28 – Kaffeestation in der Küche" },
    ],
  },
  faqs: [
    {
      question: "Wo genau liegt HAUS28 am Büchelstein?",
      answer:
        "HAUS28 liegt an der Adresse Büchelstein 28 bei Grattersdorf im Bayerischen Wald. Direkt am Fuße des Büchelsteins (831 m), umgeben von Wald und Natur. Zum Büchelstein-Gipfel mit Panoramablick sind es rund 30 Minuten zu Fuß.",
    },
    {
      question: "Gibt es einen Whirlpool – und ist er ganzjährig nutzbar?",
      answer:
        "Ja. Zum HAUS28 gehört ein privater Outdoor-Whirlpool im Garten, den du exklusiv für dich hast. Er ist ganzjährig nutzbar – auch im Winter, wenn ringsum Schnee liegt. Beheizt wird er über einen Holzofen direkt am Becken.",
    },
    {
      question: "Wie läuft der Check-in ab?",
      answer:
        "HAUS28 am Büchelstein bietet Self-Check-in mit Schlüsselbox. Du erhältst den Code ca. 24 Stunden vor deiner Ankunft per Nachricht. Check-in ab 16:00 Uhr.",
    },
    {
      question: "Wann ist der Check-out?",
      answer: "Check-out ist bis 10:00 Uhr. Ein späterer Check-out ist auf Anfrage und bei Verfügbarkeit möglich.",
    },
    {
      question: "Wie viele Personen passen ins HAUS28?",
      answer:
        "HAUS28 bietet Platz für bis zu 8 Personen in 4 Schlafzimmern. Perfekt für Familien oder Freundesgruppen.",
    },
    {
      question: "Wie sind die Stornierungsbedingungen?",
      answer:
        "Bis 30 Tage vor Anreise: 100 % Erstattung. Von 14 bis 30 Tage vor Anreise: 50 % Erstattung. Weniger als 14 Tage vor Anreise: keine Erstattung. Details unter sarfi-collection.de/stornierung.",
    },
    {
      question: "Gibt es WLAN?",
      answer: "Ja, schnelles WLAN ist kostenfrei inklusive.",
    },
    {
      question: "Gibt es einen Parkplatz?",
      answer:
        "Ja, und Parken ist kostenlos: Zwei Stellplätze liegen direkt vor dem Haus, für weitere Fahrzeuge gibt es rund 100 m entfernt einen großen Parkplatz.",
    },
    {
      question: "Welche Kosten kommen zum Übernachtungspreis dazu?",
      answer:
        `Dazu kommen die Endreinigung von ${kostenHaus28.cleaningFee} € pro Aufenthalt und ab dem ${kostenHaus28.baseOccupancy + 1}. Gast ${kostenHaus28.extraPersonFee} € pro Person und Nacht. Beides ist im Preis enthalten, den du bei der Buchung siehst. Den Übernachtungspreis für deinen Reisezeitraum zeigt dir der Buchungskalender.`,
    },
    {
      question: "Sind Haustiere im HAUS28 erlaubt?",
      answer:
        "Nein, im HAUS28 sind Haustiere leider nicht erlaubt. Wenn du mit Hund reisen möchtest: Im Haus Schönblick kannst du in den Apartments A2, B7 und B8 Hunde direkt mitbuchen.",
    },
    {
      question: "Wie komme ich zum HAUS28?",
      answer: arrival.de,
    },
    {
      question: "Wo kann man in der Nähe essen gehen?",
      answer: restaurantsAnswer("haus28", "de"),
    },
    {
      question: "Wie weit ist es vom Büchelstein zum nächsten Ort?",
      answer:
        `Vom HAUS28 am Büchelstein ist Grattersdorf in rund 5 Minuten erreichbar. Zum Einkaufen fährst du rund ${m.hengersberg.haus28} Minuten nach Hengersberg oder ${m.deggendorf.haus28} Minuten nach Deggendorf (Geschäfte, Restaurants). Die Wanderung auf den Büchelstein-Gipfel startet direkt an der Haustür.`,
    },
    {
      question: "Wie lange ist der Mindestaufenthalt?",
      answer: "Der Mindestaufenthalt beträgt 2 Nächte. In der Hauptsaison ggf. mehr – Details beim Buchungsvorgang.",
    },
    {
      question: "Wie weit ist es zur Pullman City?",
      answer:
        `Die Westernstadt Pullman City in Eging am See ist vom HAUS28 am Büchelstein in rund ${m.pullmanCity.haus28} Minuten mit dem Auto erreichbar. Ein perfekter Tagesausflug für Familien mit Kindern!`,
    },
    {
      question: "Welche Ausflugsziele gibt es im Bayerischen Wald?",
      answer:
        `In der Nähe vom HAUS28 findest du zahlreiche Highlights (Fahrzeit mit dem Auto): Skilift Steinberg (~${m.steinberglift.haus28} min), Pullman City (~${m.pullmanCity.haus28} min), Erlebnisbad elypso in Deggendorf (~${m.elypso.haus28} min), Nationalpark mit Baumwipfelpfad in Neuschönau (~${m.nationalparkLusen.haus28} min), Skigebiet am Großen Arber (~${m.arber.haus28} min) und natürlich die Wanderung auf den Büchelstein direkt ab Haus.`,
    },
  ],
};

// ---------------------------------------------------------------------------
// HAUS SCHÖNBLICK – Apartments
// ---------------------------------------------------------------------------
const schoenblickAmenities: Amenity[] = [
  { icon: "wifi", label: "WLAN" },
  { icon: "kitchen", label: "Voll ausgestattete Küche" },
  { icon: "parking", label: "Kostenloser Parkplatz" },
  { icon: "terrace", label: "Balkon / Terrasse" },
  { icon: "tv", label: "Smart TV" },
  { icon: "heating", label: "Heizung" },
  { icon: "coffee", label: "Kaffeemaschine" },
  { icon: "bed", label: "Hochwertige Bettwäsche" },
  { icon: "towel", label: "Handtücher inklusive" },
  { icon: "checkin", label: "Self-Check-in" },
  { icon: "mountain", label: "Panoramablick" },
];

const schoenblickFaqs = [
  {
    question: "Wie läuft der Check-in ab?",
    answer:
      "Self-Check-in mit Schlüsselbox. Du erhältst den Code ca. 24 Stunden vor der Ankunft. Check-in ab 16:00 Uhr.",
  },
  {
    question: "Wann ist der Check-out?",
    answer: "Check-out bis 10:00 Uhr. Später-Check-out auf Anfrage.",
  },
  {
    question: "Können mehrere Apartments gleichzeitig gebucht werden?",
    answer:
      "Ja! Über die Gruppenbuchung buchst du mehrere Apartments für bis zu 20 Personen in einem Schritt – ein Zeitraum, eine Zahlung. Alle Infos unter sarfi-collection.de/schoenblick/gruppen.",
  },
  {
    question: "Sind Haustiere erlaubt?",
    answer: `Ja, in den Apartments A2, B7 und B8: Dort buchst du bis zu ${PET_MAX} Hunde direkt mit, der Aufpreis beträgt ${PET_FEE_PER_NIGHT} € pro Hund und Nacht. In B5 und B6 liegt Echtholzparkett, dort sind Haustiere leider nicht erlaubt.`,
  },
  {
    question: "Wie komme ich zum Haus Schönblick?",
    answer: arrival.de,
  },
  {
    question: "Wo kann man in der Nähe essen gehen?",
    answer: restaurantsAnswer("schoenblick", "de"),
  },
  {
    question: "Wie ist der Blick?",
    answer:
      "Alle Apartments haben eine herrliche Aussicht über den Bayerischen Wald und die Umgebung von Schöfweg – der Name ist Programm.",
  },
  {
    question: "Wie weit ist es zu Wanderwegen?",
    answer:
      "Schöfweg liegt direkt im Herzen des Bayerischen Waldes. Zahlreiche Wanderwege starten direkt vor dem Haus.",
  },
  {
    question: "Gibt es WLAN?",
    answer: "Ja, schnelles WLAN ist kostenfrei in allen Apartments inklusive.",
  },
  {
    question: "Gibt es Parkplätze?",
    answer: "Ja, direkt vor dem Gebäude gibt es Parkplätze, auf die du dich einfach stellen kannst – kostenlos.",
  },
  {
    question: "Welche Kosten kommen zum Übernachtungspreis dazu?",
    answer:
      `Dazu kommen die Endreinigung von ${kostenSchoenblick.cleaningFee} € je Wohnung und Aufenthalt, ab dem ${kostenSchoenblick.baseOccupancy + 1}. Gast ${kostenSchoenblick.extraPersonFee} € pro Person und Nacht und in den Apartments A2, B7 und B8 ${PET_FEE_PER_NIGHT} € pro Hund und Nacht. Alles ist im Preis enthalten, den du bei der Buchung siehst. Den Übernachtungspreis für deinen Reisezeitraum zeigt dir der Buchungskalender.`,
  },
  {
    question: "Wie weit ist es zur Pullman City?",
    answer:
      `Die Westernstadt Pullman City in Eging am See ist vom Haus Schönblick in Schöfweg in rund ${m.pullmanCity.schoenblick} Minuten mit dem Auto erreichbar – ein idealer Tagesausflug für die ganze Familie.`,
  },
  {
    question: "Welche Ausflugsziele gibt es in der Nähe?",
    answer:
      `Rund um Schöfweg im Bayerischen Wald erwartet dich viel – der Skilift Steinberg liegt ca. 600 m vom Haus entfernt, dazu (Fahrzeit mit dem Auto): Grafenau (~${m.grafenau.schoenblick} min), Pullman City (~${m.pullmanCity.schoenblick} min), Erlebnisbad elypso in Deggendorf (~${m.elypso.schoenblick} min), Nationalpark mit Baumwipfelpfad in Neuschönau (~${m.nationalparkLusen.schoenblick} min) und das Skigebiet am Großen Arber (~${m.arber.schoenblick} min).`,
  },
  {
    question: "Wie sind die Stornierungsbedingungen?",
    answer:
      "Bis 14 Tage vor Anreise: 100 % Erstattung. Von 7 bis 14 Tage vor Anreise: 50 % Erstattung. Weniger als 7 Tage vor Anreise: keine Erstattung. Details unter sarfi-collection.de/stornierung.",
  },
];

export const schoenblick: PropertyData = {
  id: "schoenblick",
  name: "Haus Schönblick",
  subtitle: "Panorama-Ferienwohnungen in Schöfweg im Bayerischen Wald",
  address: "Hochwaldstraße 18/20, 94572 Schöfweg",
  coordinates: {
    lat: 48.8280385187145,
    lng: 13.202348503081259,
  },
  priceFrom: 59,
  googleMapsUrl: "https://www.google.com/maps?cid=18059770108920997880",
  // Stand 12.10.2026, Werte 1:1 wie auf den Plattformen, ohne herausgerechnete
  // Bewertungen.
  // Airbnb: Summe der Wohnungs-Inserate (B5, B6, B8 je 5,0 aus 3; B7 5,0 aus 5;
  // A2 4,5 aus 2) = 79 Sterne aus 16 = 4,94.
  // Booking: das aktuelle, gemeinsame Inserat zeigt am 27.10.2026 9,1 aus 10.
  // Die alten Booking-Inserate sind geschlossen und gehören nicht dazu.
  // Google: 18 Rezensionen, 17 × 5 Sterne und 1 × 1 Stern (Vorbesitzer, vor
  // 7 Jahren). Google zeigt den Schnitt mit einer Nachkommastelle:
  // 86 / 18 = 4,78 → 4,8.
  airbnbRating: 4.94,
  airbnbReviewCount: 16,
  bookingRating: 9.1,
  bookingReviewCount: 10,
  googleRating: 4.8,
  googleReviewCount: 18,
  smoobuPropertyId: "2934161",
  shortDescription:
    "Fünf geschmackvolle Ferienwohnungen mit Panoramablick über den Bayerischen Wald – ideal für Paare, Familien und Gruppen.",
  description:
    "Haus Schönblick in Schöfweg vereint fünf individuell eingerichtete Ferienwohnungen unter einem Dach. Alle Apartments bieten einen atemberaubenden Ausblick über die sanfte Hügellandschaft des Bayerischen Waldes. Ob du solo verreist, mit der Familie oder in einer Gruppe – hier findest du dein perfektes Zuhause auf Zeit. Die ruhige Lage, die frische Waldluft und die herzliche Atmosphäre laden zum echten Entschleunigen ein.",
  amenities: schoenblickAmenities,
  faqs: schoenblickFaqs,
  images: {
    hero: "/images/schoenblick/aussen/hero.webp",
    thumbnail: "/images/schoenblick/aussen/hero-thumb.webp",
    gallery: [
      { src: "/images/schoenblick/aussen/gallery/img_9785.webp", alt: "Haus Schönblick – Außenansicht" },
      { src: "/images/schoenblick/aussen/gallery/img_9786.webp", alt: "Haus Schönblick – Eingang und Umgebung" },
      { src: "/images/schoenblick/aussen/gallery/img_9790.webp", alt: "Haus Schönblick – Gartenbereich" },
      { src: "/images/schoenblick/aussen/gallery/img_9792.webp", alt: "Haus Schönblick – Außenansicht Schöfweg" },
      { src: "/images/schoenblick/aussen/gallery/img_9793.webp", alt: "Haus Schönblick – Panoramablick vom Haus" },
      { src: "/images/schoenblick/aussen/gallery/img_9829.webp", alt: "Haus Schönblick – Natur und Umgebung" },
      { src: "/images/schoenblick/aussen/gallery/img_9830.webp", alt: "Haus Schönblick – Bayerischer Wald" },
      { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_249.webp", alt: "Apartment B5 – Wohnbereich" },
      { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_222.webp", alt: "Apartment B5 – Schlafzimmer" },
      { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_123.webp", alt: "Apartment B8 – Wohnbereich" },
      { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_083.webp", alt: "Apartment B8 – Schlafzimmer" },
      { src: "/images/schoenblick/b6/gallery/img_9762.webp", alt: "Apartment B6 – Wohnbereich" },
      { src: "/images/schoenblick/a2/gallery/img_9817.webp", alt: "Apartment A2 – Wohnbereich" },
    ],
  },
  apartments: {
    b5: {
      id: "b5",
      name: "Apartment B5",
      subtitle: "Helles Apartment mit Waldblick & Terrasse",
      airbnbUrl: "https://www.airbnb.de/rooms/1542179745378169386",
      airbnbRating: 5.0,
      airbnbReviewCount: 3,
      smoobuPropertyId: "3025621",
      maxGuests: 4,
      bedrooms: 2,
      beds: 3,
      bathrooms: 1,
      sqm: 55,
      priceFrom: 59,
      shortDescription: "Helles, komfortables Apartment mit Waldblick und Terrasse für bis zu 4 Personen.",
      description:
        "Apartment B5 im Haus Schönblick bietet dir einen gemütlichen Rückzugsort mit direktem Waldblick und sonniger Terrasse. Die liebevolle Einrichtung, die gut ausgestattete Küche und der direkte Zugang zur frischen Waldluft machen deinen Aufenthalt zu einem echten Erlebnis. Mit 55 m² und 2 Schlafzimmern ideal für Familien oder kleine Gruppen bis 4 Personen. Schlafzimmer 1: Kingsize-Bett · Schlafzimmer 2: Stockbett (je ein Bett unten und oben).",
      amenities: schoenblickAmenities,
      images: {
        hero: "/images/schoenblick/b5/hero.webp",
        thumbnail: "/images/schoenblick/b5/hero-thumb.webp",
        gallery: [
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_249.webp", alt: "Apartment B5 – Wohnzimmer mit Backsteinwand und Essbereich" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_199.webp", alt: "Apartment B5 – Küche" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_222.webp", alt: "Apartment B5 – Schlafzimmer mit Doppelbett" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_188.webp", alt: "Apartment B5 – Kinderzimmer mit Etagenbett" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_230.webp", alt: "Apartment B5 – Badezimmer mit Dusche" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_234.webp", alt: "Apartment B5 – Wohn- und Essbereich mit Terrassentür" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_265.webp", alt: "Apartment B5 – Wohnbereich mit Blick zum Flur" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_269.webp", alt: "Apartment B5 – Essbereich mit Sideboard" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_227.webp", alt: "Apartment B5 – Schlafzimmer mit Fenster" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_197.webp", alt: "Apartment B5 – Küchenzeile mit Spüle" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_271.webp", alt: "Apartment B5 – Terrasse mit Sitzgruppe" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_277.webp", alt: "Apartment B5 – TV-Ecke mit Terrassentür" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_281.webp", alt: "Apartment B5 – Sofa mit Kissen" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_285.webp", alt: "Apartment B5 – Couchtisch mit Deko" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_202.webp", alt: "Apartment B5 – Kaffeemaschine" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_192.webp", alt: "Apartment B5 – Dekoration" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_287.webp", alt: "Apartment B5 – Sideboard mit Deko" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_298.webp", alt: "Apartment B5 – Eingang mit Sitzplatz" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_291.webp", alt: "Apartment B5 – Flur vom Eingang aus" },
        ],
      },
      location: "Erdgeschoss",
      outdoor: "Terrasse",
      style: "Moderne Wohnung mit Parkettboden, roter Küche und eigener Terrasse.",
      faqs: schoenblickFaqs,
      bedroomImages: [
        { name: "Schlafzimmer 1", bed: "1 Kingsize-Doppelbett", img: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_227.webp" },
        { name: "Schlafzimmer 2", bed: "Stockbett (2 Einzelbetten)", img: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_188.webp" },
      ],
    },
    b6: {
      id: "b6",
      name: "Apartment B6",
      subtitle: "Lichtdurchflutete Wohnung mit Panoramablick",
      airbnbUrl: "https://www.airbnb.de/rooms/1511581373647900244",
      airbnbRating: 5.0,
      airbnbReviewCount: 3,
      smoobuPropertyId: "2934141",
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      sqm: 55,
      priceFrom: 59,
      shortDescription: "Großzügiges Apartment mit herrlichem Panorama über die Hügel des Bayerischen Waldes.",
      description:
        "Apartment B6 besticht durch seinen atemberaubenden Panoramablick und die lichtdurchfluteten Räume. Die moderne Einrichtung verbindet Komfort mit bayerischem Charme. Genieß den Morgen auf der Terrasse bei frischer Waldluft und Blick über den Schöfweger Wald. Schlafzimmer 1: Kingsize-Bett · Schlafzimmer 2: Doppelbett.",
      amenities: schoenblickAmenities,
      images: {
        hero: "/images/schoenblick/b6/gallery/img_9762.webp",
        thumbnail: "/images/schoenblick/b6/gallery/m_img_9762.webp",
        gallery: [
          { src: "/images/schoenblick/b6/gallery/img_9762.webp", alt: "Apartment B6 – Wohnzimmer mit grünem Sofa" },
          { src: "/images/schoenblick/b6/gallery/img_1812.webp", alt: "Apartment B6 – Essbereich mit Backsteinwand" },
          { src: "/images/schoenblick/b6/gallery/img_9772.webp", alt: "Apartment B6 – Schlafzimmer 1 Doppelbett" },
          { src: "/images/schoenblick/b6/gallery/img_9781.webp", alt: "Apartment B6 – Küche" },
          { src: "/images/schoenblick/b6/gallery/img_9760.webp", alt: "Apartment B6 – Ausblick Bayerischer Wald" },
          { src: "/images/schoenblick/b6/gallery/img_1814.webp", alt: "Apartment B6 – Samtsofa vor Backsteinwand" },
          { src: "/images/schoenblick/b6/gallery/img_1815.webp", alt: "Apartment B6 – Wohnbereich mit Esstisch und Sofa" },
          { src: "/images/schoenblick/b6/gallery/img_9778.webp", alt: "Apartment B6 – Wohnzimmer Sonnenlicht" },
          { src: "/images/schoenblick/b6/gallery/img_9767.webp", alt: "Apartment B6 – Schlafzimmer 2" },
          { src: "/images/schoenblick/b6/gallery/img_9774.webp", alt: "Apartment B6 – Schlafzimmer 2 Übersicht" },
          { src: "/images/schoenblick/b6/gallery/img_9751.webp", alt: "Apartment B6 – Badezimmer" },
          { src: "/images/schoenblick/b6/gallery/img_9754.webp", alt: "Apartment B6 – Badezimmer Detail" },
          { src: "/images/schoenblick/b6/gallery/img_9783.webp", alt: "Apartment B6 – Küche Detail" },
          { src: "/images/schoenblick/b6/gallery/img_9769.webp", alt: "Apartment B6 – Terrasse" },
          { src: "/images/schoenblick/b6/gallery/img_9759.webp", alt: "Apartment B6 – Herbstdekoration" },
          { src: "/images/schoenblick/b6/gallery/img_9750.webp", alt: "Apartment B6 – Eingang" },
        ],
      },
      location: "Erdgeschoss",
      outdoor: "Terrasse",
      style: "Moderne Wohnung mit Parkettboden, Terrassenzugang und zwei Doppelbetten.",
      faqs: schoenblickFaqs,
      bedroomImages: [
        { name: "Schlafzimmer 1", bed: "1 Kingsize-Doppelbett", img: "/images/schoenblick/b6/gallery/img_9772.webp" },
        { name: "Schlafzimmer 2", bed: "1 Doppelbett", img: "/images/schoenblick/b6/gallery/img_9767.webp" },
      ],
    },
    b8: {
      id: "b8",
      name: "Apartment B8",
      subtitle: "Großzügige Ferienwohnung für Familien",
      airbnbUrl: "https://www.airbnb.de/rooms/1525349872389165473",
      airbnbRating: 5.0,
      airbnbReviewCount: 3,
      smoobuPropertyId: "3025606",
      maxGuests: 4,
      bedrooms: 2,
      beds: 3,
      bathrooms: 1,
      sqm: 55,
      priceFrom: 79,
      shortDescription: "Geräumiges 2-Schlafzimmer-Apartment für bis zu 4 Personen – ideal für Familien.",
      description:
        "Apartment B8 im Haus Schönblick bietet viel Platz für die ganze Familie. Zwei Schlafzimmer, eine vollausgestattete Küche und ein sonniger Balkon mit Weitblick machen B8 zum perfekten Basislager für Wanderungen, Ausflüge und unvergessliche Momente im Bayerischen Wald. Schlafzimmer 1: Kingsize-Bett · Schlafzimmer 2: Stockbett (je ein Bett unten und oben).",
      amenities: schoenblickAmenities,
      images: {
        hero: "/images/schoenblick/b8/hero.webp",
        thumbnail: "/images/schoenblick/b8/hero-thumb.webp",
        gallery: [
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_123.webp", alt: "Apartment B8 – Wohnzimmer mit blauem Sofa und Balkon" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_088.webp", alt: "Apartment B8 – Schlafzimmer mit Doppelbett" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_003.webp", alt: "Apartment B8 – Panoramablick vom Balkon" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_134.webp", alt: "Apartment B8 – Kinderzimmer mit Etagenbett" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_162.webp", alt: "Apartment B8 – Küche mit Dachschräge" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_036.webp", alt: "Apartment B8 – Wohn- und Essbereich" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_065.webp", alt: "Apartment B8 – Wohnbereich mit TV und Balkontür" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_048.webp", alt: "Apartment B8 – Essbereich" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_083.webp", alt: "Apartment B8 – Schlafzimmer mit Fenster" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_145.webp", alt: "Apartment B8 – Badezimmer mit Dusche" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_049.webp", alt: "Apartment B8 – Gemälde an der Holzwand" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_099.webp", alt: "Apartment B8 – Handtücher" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_175.webp", alt: "Apartment B8 – Eingangsflur" },
        ],
      },
      location: "1. Stock",
      outdoor: "Panoramabalkon",
      style: "Holzverkleidete Wände machen B8 urig, die modernen Möbel frisch und gemütlich – mit Panoramabalkon.",
      faqs: schoenblickFaqs,
      bedroomImages: [
        { name: "Schlafzimmer 1", bed: "1 Kingsize-Doppelbett", img: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_083.webp" },
        { name: "Schlafzimmer 2", bed: "Stockbett (2 Einzelbetten)", img: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_134.webp" },
      ],
    },
    b7: {
      id: "b7",
      name: "Apartment B7",
      subtitle: "Das schönste Apartment – Fischgrätparkett, Bergblick & Balkon",
      airbnbUrl: "https://www.airbnb.de/rooms/1671190920376277730",
      airbnbRating: 5.0,
      airbnbReviewCount: 5,
      smoobuPropertyId: "3276892",
      maxGuests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1,
      sqm: 55,
      priceFrom: 100,
      shortDescription:
        "Premium-Apartment im Haus Schönblick: neu renoviert, mit Fischgrätparkett, Naturstein-Waschbecken, Balkon und Waldblick.",
      description:
        "Apartment B7 ist das neueste und schönste Apartment im Haus Schönblick – und das sieht man auf den ersten Blick. Durchgängiger moderner Fischgrätparkett, eine durchdachte Raumaufteilung und hochwertige Details machen B7 zu einem echten Wohlfühlort.\n\nIm ersten Schlafzimmer wartet ein großzügiges Kingsize-Bett vor einer eleganten dunkelblauen Akzentwand mit Messinglampe – ruhig, stilvoll, unvergesslich. Das zweite Schlafzimmer bietet ein ausziehbares Einzelbett, das sich bei Bedarf in zwei separate 90-cm-Betten verwandeln lässt – ideal für Kinder oder flexibel reisende Gäste.\n\nDas Badezimmer überzeugt mit einem einzigartigen Naturstein-Waschbecken auf einer Massivholzplatte, einem beleuchteten Spiegel, Holzdecke und moderner Dusche. Die vollausgestattete Küche unter der Dachschräge hat Charme: Bosch-Herd, Induktionskochfeld, Spüle und ein Vintage-Tassenregal an der Wand.\n\nIm Wohnzimmer lädt eine helle Sofacouch vor einer weiß verputzten Backsteinwand zum Entspannen ein – mit direktem Zugang zum Balkon und freiem Blick auf den Bayerischen Wald. Hier kommt echte Urlaubsstimmung auf.\n\nSchlafzimmer 1: Kingsize-Bett (180×200 cm) · Schlafzimmer 2: Ausziehbares Einzelbett (2× 90×200 cm bei Bedarf) · Balkon mit Waldblick · Smart TV · Vollausgestattete Küche · Naturstein-Waschbecken",
      amenities: [
        ...schoenblickAmenities,
        { icon: "balcony", label: "Balkon mit Bergblick" },
        { icon: "nature", label: "Blick auf den Bayerischen Wald" },
      ],
      images: {
        hero: "/images/schoenblick/b7/hero.jpg",
        thumbnail: "/images/schoenblick/b7/hero-thumb.jpg",
        gallery: [
          { src: "/images/schoenblick/b7/gallery/img_3084.jpg", alt: "Apartment B7 – Wohnzimmer mit Balkon & Bergblick" },
          { src: "/images/schoenblick/b7/gallery/img_3059.jpg", alt: "Apartment B7 – Schlafzimmer 1 mit Kingsize-Bett" },
          { src: "/images/schoenblick/b7/gallery/img_3120.jpg", alt: "Apartment B7 – Panoramablick auf den Bayerischen Wald" },
          { src: "/images/schoenblick/b7/gallery/img_3052.jpg", alt: "Apartment B7 – Badezimmer mit Naturstein-Waschbecken & Holzdecke" },
          { src: "/images/schoenblick/b7/gallery/img_3119.jpg", alt: "Apartment B7 – Schlafzimmer 2 Gesamtansicht mit Wandlampen" },
          { src: "/images/schoenblick/b7/gallery/img_3128.jpg", alt: "Apartment B7 – Wohnzimmer mit TV & Zimmerzugang" },
          { src: "/images/schoenblick/b7/gallery/img_3091.jpg", alt: "Apartment B7 – Sofabereich mit Backsteinwand" },
          { src: "/images/schoenblick/b7/gallery/img_3130.jpg", alt: "Apartment B7 – Küche Nahaufnahme" },
          { src: "/images/schoenblick/b7/gallery/img_3062.jpg", alt: "Apartment B7 – Schlafzimmer 1 Messinglampe Detail" },
          { src: "/images/schoenblick/b7/gallery/img_3067.jpg", alt: "Apartment B7 – Schlafzimmer 2 mit Waldblick" },
          { src: "/images/schoenblick/b7/gallery/img_3055.jpg", alt: "Apartment B7 – Naturstein-Waschbecken Detail" },
          { src: "/images/schoenblick/b7/gallery/img_3073.jpg", alt: "Apartment B7 – Blick auf den Bayerischen Wald" },
          { src: "/images/schoenblick/b7/gallery/img_3092.jpg", alt: "Apartment B7 – Flur mit Zimmerzugang" },
        ],
      },
      location: "1. Stock",
      outdoor: "Panoramabalkon",
      style: "Unsere modernste Wohnung: Fischgrätparkett, moderne Möbel, Farbakzente und ein Panoramabalkon.",
      faqs: schoenblickFaqs,
      bedroomImages: [
        { name: "Schlafzimmer 1", bed: "1 Kingsize-Bett (180×200 cm)", img: "/images/schoenblick/b7/gallery/img_3059.jpg" },
        { name: "Schlafzimmer 2", bed: "Ausziehbares Einzelbett (2× 90 cm)", img: "/images/schoenblick/b7/gallery/img_3116.jpg" },
      ],
    },
    a2: {
      id: "a2",
      name: "Apartment A2",
      subtitle: "Hüttenwohnung mit Bauernmöbeln & Balkonblick",
      airbnbUrl: "https://www.airbnb.de/rooms/1512149022196493833",
      airbnbRating: 4.5,
      airbnbReviewCount: 2,
      smoobuPropertyId: "2934161",
      maxGuests: 4,
      bedrooms: 2,
      beds: 4,
      bathrooms: 1,
      sqm: 55,
      priceFrom: 59,
      shortDescription: "Gemütliches Apartment für Familien bis 4 Personen mit ruhiger Garten- und Waldaussicht.",
      description:
        "Apartment A2 ist der gemütlichste Rückzugsort im Haus Schönblick – mit 2 Schlafzimmern und 55 m² ideal für Familien bis 4 Personen, die echte Ruhe suchen. Die ruhige Lage mit Garten- und Waldblick, die warme Einrichtung und die direkte Nähe zu Wanderwegen sorgen für einen entspannten Urlaub abseits des Alltags. Schlafzimmer 1: 2 Einzelbetten · Schlafzimmer 2: Stockbett (je ein Bett unten und oben).",
      amenities: schoenblickAmenities,
      images: {
        hero: "/images/schoenblick/a2/hero.webp",
        thumbnail: "/images/schoenblick/a2/hero-thumb.webp",
        gallery: [
          { src: "/images/schoenblick/a2/gallery/img_9817.webp", alt: "Apartment A2 – Wohnzimmer mit Panoramablick" },
          { src: "/images/schoenblick/a2/gallery/img_9807.webp", alt: "Apartment A2 – Essecke mit Eckbank und Balkontür" },
          { src: "/images/schoenblick/a2/gallery/img_9810.webp", alt: "Apartment A2 – Schlafzimmer mit Einzelbetten" },
          { src: "/images/schoenblick/a2/gallery/img_9815.webp", alt: "Apartment A2 – Schlafzimmer mit Stockbett & Wandschrank" },
          { src: "/images/schoenblick/a2/gallery/img_9820.webp", alt: "Apartment A2 – Ausblick vom Balkon" },
          { src: "/images/schoenblick/a2/gallery/img_9819.webp", alt: "Apartment A2 – Wohnbereich mit TV und Bauernmöbeln" },
          { src: "/images/schoenblick/a2/gallery/img_9803.webp", alt: "Apartment A2 – Badezimmer mit Dusche" },
          { src: "/images/schoenblick/a2/gallery/img_9805.webp", alt: "Apartment A2 – Küche" },
          { src: "/images/schoenblick/a2/gallery/img_9799.webp", alt: "Apartment A2 – Eingang" },
          { src: "/images/schoenblick/a2/gallery/img_9827.webp", alt: "Apartment A2 – Flur" },
          { src: "/images/schoenblick/a2/gallery/img_9824.webp", alt: "Apartment A2 – Bemalte Kommode" },
          { src: "/images/schoenblick/a2/gallery/img_9825.webp", alt: "Apartment A2 – Herbstdeko" },
          { src: "/images/schoenblick/a2/gallery/img_9826.webp", alt: "Apartment A2 – Gedicht von Peter Rosegger" },
        ],
      },
      location: "Hausnummer 20",
      outdoor: "Balkon mit Weitblick",
      style: "Unsere Hüttenwohnung mit alten Bauernmöbeln, holzverkleideten Wänden und schönem Blick vom Balkon – die einzige Ferienwohnung in Hausnummer 20.",
      faqs: schoenblickFaqs,
      bedroomImages: [
        { name: "Schlafzimmer 1", bed: "2 Einzelbetten", img: "/images/schoenblick/a2/gallery/img_9810.webp" },
        { name: "Schlafzimmer 2", bed: "Stockbett (2 Einzelbetten)", img: "/images/schoenblick/a2/gallery/img_9815.webp" },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// All properties index
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Aggregierte Bewertungs-Statistik über alle Plattformen
// (Booking.com und FeWo-direkt bewerten auf der 10er-Skala → auf 5er-Skala umgerechnet)
// ---------------------------------------------------------------------------
export type AggregateReviewStats = {
  ratingValue: number;
  reviewCount: number;
};

function collectPlatformReviews(p: PropertyData): { rating: number; count: number }[] {
  const entries: { rating: number; count: number }[] = [];
  if (p.airbnbRating > 0 && p.airbnbReviewCount > 0) {
    entries.push({ rating: p.airbnbRating, count: p.airbnbReviewCount });
  }
  if (p.bookingRating && p.bookingReviewCount) {
    entries.push({ rating: p.bookingRating / 2, count: p.bookingReviewCount });
  }
  if (p.fewoRating && p.fewoReviewCount) {
    entries.push({ rating: p.fewoRating / 2, count: p.fewoReviewCount });
  }
  if (p.googleRating && p.googleReviewCount) {
    entries.push({ rating: p.googleRating, count: p.googleReviewCount });
  }
  if (p.hometogoRating && p.hometogoReviewCount) {
    entries.push({ rating: p.hometogoRating, count: p.hometogoReviewCount });
  }
  return entries;
}

/**
 * Plattformen, deren Bewertungen für die Häuser vorliegen – für den
 * Echtheitshinweis am Bewertungsblock (ReviewSourceNote) und llms.txt.
 * Welche davon nur Gäste bewerten lassen, legt ReviewSourceNote fest.
 */
export function reviewPlatforms(...properties: PropertyData[]): string[] {
  const hat = (count: (p: PropertyData) => number | undefined) => properties.some((p) => (count(p) ?? 0) > 0);
  return [
    hat((p) => p.airbnbReviewCount) && "Airbnb",
    hat((p) => p.bookingReviewCount) && "Booking.com",
    hat((p) => p.fewoReviewCount) && "FeWo-direkt",
    hat((p) => p.hometogoReviewCount) && "HomeToGo",
    hat((p) => p.googleReviewCount) && "Google",
  ].filter((name): name is string => Boolean(name));
}

/** Note mit einer Nachkommastelle in der Schreibweise der Sprache: 9,7 / 9.7 */
export function formatScore(value: number, locale: "de" | "en"): string {
  return value.toLocaleString(locale === "en" ? "en-GB" : "de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function getAggregateReviewStats(
  properties: PropertyData[] = [haus28, schoenblick],
): AggregateReviewStats {
  const entries = properties.flatMap(collectPlatformReviews);
  const reviewCount = entries.reduce((sum, e) => sum + e.count, 0);
  const ratingValue =
    reviewCount > 0
      ? Math.round((entries.reduce((sum, e) => sum + e.rating * e.count, 0) / reviewCount) * 100) / 100
      : 0;
  return { ratingValue, reviewCount };
}
