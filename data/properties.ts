// Central data file for all property content.
// Edit values here – all pages pull from this file.

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
  smoobuPropertyId: string;
  maxGuests: number;
  bedrooms: number;
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
  fewoRating?: number;
  fewoReviewCount?: number;
  googleRating?: number;
  googleReviewCount?: number;
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
  superhost?: boolean;
  apartments?: Record<string, ApartmentData>;
};

// ---------------------------------------------------------------------------
// HAUS28
// ---------------------------------------------------------------------------
export const haus28: PropertyData = {
  id: "haus28",
  name: "HAUS28",
  subtitle: "Modernes A-Frame im Bayerischen Wald",
  address: "Büchelstein 28, 94541 Grattersdorf",
  coordinates: {
    lat: 48.8136,
    lng: 13.1450,
  },
  maxGuests: 8,
  bedrooms: 4,
  bathrooms: 2,
  sqm: 157,
  priceFrom: 199,
  superhost: true,
  airbnbUrl: "https://www.airbnb.de/rooms/1375439439358638425",
  airbnbRating: 5.0,
  airbnbReviewCount: 17,
  bookingRating: 10,
  bookingReviewCount: 10,
  fewoRating: 5.0,
  fewoReviewCount: 13,
  googleRating: 5.0,
  googleReviewCount: 9,
  smoobuPropertyId: "2610828",
  smoobuEmbedUrl: "https://login.smoobu.com/de/booking-tool/iframe/2610828",
  shortDescription:
    "Architektonisch einzigartiges A-Frame Ferienhaus für bis zu 8 Personen – ein echter Rückzugsort im Herzen des Bayerischen Waldes.",
  description:
    "Inmitten des ruhigen Bayerischen Waldes erwartet dich HAUS28 – ein modernes A-Frame Ferienhaus mit 157 m² Wohnfläche, das Architektur und Natur zu einer einzigartigen Atmosphäre verbindet. Die markante Dreiecksform, das hochwertige Holz-Interior und das raumhohe Panoramafenster lassen die Grenze zwischen drinnen und draußen verschwimmen. Vier Schlafzimmer und zwei Bäder bieten Platz für bis zu 8 Personen. Morgens erwachst du im Wald, abends sitzt du an der Feuerschale oder auf der großzügigen Terrasse. Perfekt für Familien, Freundesgruppen oder alle, die wirklich abschalten wollen.",
  amenities: [
    { icon: "wifi", label: "WLAN" },
    { icon: "kitchen", label: "Voll ausgestattete Küche" },
    { icon: "parking", label: "Kostenloser Parkplatz" },
    { icon: "ac", label: "Klimaanlage" },
    { icon: "firepit", label: "Feuerschale" },
    { icon: "terrace", label: "Große Terrasse" },
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
      { src: "/images/haus28/gallery/haus_28_250523_113.webp", alt: "HAUS28 – Eingang und Gartenbereich" },
      { src: "/images/haus28/gallery/haus_28_250523_147.webp", alt: "HAUS28 – Luftbild Gartenanlage" },
      { src: "/images/haus28/gallery/haus_28_250523_165.webp", alt: "HAUS28 – Außenansicht durch den Wald" },
      { src: "/images/haus28/gallery/haus_28_250523_455.webp", alt: "HAUS28 – Wohnbereich mit Panoramafenster zum Wald" },
      { src: "/images/haus28/gallery/haus_28_250523_556.webp", alt: "HAUS28 – Offene Wohn- und Küchenfläche" },
      { src: "/images/haus28/gallery/haus_28_250523_380.webp", alt: "HAUS28 – Schlafbereich OG mit Dreiecksfenster" },
      { src: "/images/haus28/gallery/haus_28_250523_604.webp", alt: "HAUS28 – Schlafzimmer EG" },
      { src: "/images/haus28/gallery/haus_28_250523_625.webp", alt: "HAUS28 – Zweites Schlafzimmer" },
      { src: "/images/haus28/gallery/haus_28_250523_647.webp", alt: "HAUS28 – Schlafzimmer mit Terrassenzugang" },
      { src: "/images/haus28/gallery/haus_28_250523_699.webp", alt: "HAUS28 – Badezimmer" },
      { src: "/images/haus28/gallery/haus_28_250523_522.webp", alt: "HAUS28 – Terrasse von oben" },
      { src: "/images/haus28/gallery/haus_28_250523_730.webp", alt: "HAUS28 – Innenbereich Detail" },
      { src: "/images/haus28/gallery/haus_28_250523_413.webp", alt: "HAUS28 – Essbereich" },
      { src: "/images/haus28/gallery/haus_28_250523_175.webp", alt: "HAUS28 – Außenbereich mit Naturblick" },
      { src: "/images/haus28/gallery/haus_28_250523_207.webp", alt: "HAUS28 – Eingangsbereich" },
      { src: "/images/haus28/gallery/haus_28_250523_264.webp", alt: "HAUS28 – Detailansicht Architektur" },
      { src: "/images/haus28/gallery/haus_28_250523_303.webp", alt: "HAUS28 – Wohnraum" },
      { src: "/images/haus28/gallery/haus_28_250523_433.webp", alt: "HAUS28 – Küchenbereich" },
      { src: "/images/haus28/gallery/haus_28_250523_591.webp", alt: "HAUS28 – Detailansicht Innen" },
    ],
  },
  faqs: [
    {
      question: "Wie läuft der Check-in ab?",
      answer:
        "HAUS28 bietet Self-Check-in mit Schlüsselbox. Du erhältst den Code ca. 24 Stunden vor deiner Ankunft per Nachricht. Check-in ab 15:00 Uhr.",
    },
    {
      question: "Wann ist der Check-out?",
      answer: "Check-out ist bis 11:00 Uhr. Ein späterer Check-out ist auf Anfrage und bei Verfügbarkeit möglich.",
    },
    {
      question: "Wie viele Personen passen ins HAUS28?",
      answer:
        "HAUS28 bietet Platz für bis zu 8 Personen in 4 Schlafzimmern. Perfekt für Familien oder Freundesgruppen.",
    },
    {
      question: "Wie ist die Stornierungsbedingung?",
      answer:
        "Es gilt die moderate Stornierungsrichtlinie: Kostenlose Stornierung bis 5 Tage vor Anreise. Details beim Buchungsvorgang.",
    },
    {
      question: "Gibt es WLAN?",
      answer: "Ja, schnelles WLAN ist kostenfrei inklusive.",
    },
    {
      question: "Wie weit ist es zum nächsten Ort?",
      answer:
        "Grattersdorf liegt direkt nebenan, Deggendorf (Einkaufen, Restaurants) ca. 20 Minuten entfernt. Wanderwege starten direkt vor der Haustür.",
    },
    {
      question: "Gibt es eine Mindeststay-Regelung?",
      answer: "Der Mindestaufenthalt beträgt 2 Nächte. In der Hauptsaison ggf. mehr – Details beim Buchungsvorgang.",
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
      "Self-Check-in mit Schlüsselbox. Du erhältst den Code ca. 24 Stunden vor der Ankunft. Check-in ab 15:00 Uhr.",
  },
  {
    question: "Wann ist der Check-out?",
    answer: "Check-out bis 11:00 Uhr. Später-Check-out auf Anfrage.",
  },
  {
    question: "Können mehrere Apartments gleichzeitig gebucht werden?",
    answer:
      "Ja! Haus Schönblick eignet sich ideal für Gruppen oder Familien, die mehrere Wohnungen nebeneinander buchen möchten. Kontaktiere uns für Gruppen-Anfragen.",
  },
  {
    question: "Sind Haustiere erlaubt?",
    answer: "Bitte kontaktiere uns vor der Buchung bezüglich Haustieren.",
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
];

export const schoenblick: PropertyData = {
  id: "schoenblick",
  name: "Haus Schönblick",
  subtitle: "Panorama-Apartments im Herzen des Bayerischen Waldes",
  address: "Hochwaldstraße 18/20, 94572 Schöfweg",
  coordinates: {
    lat: 48.9072,
    lng: 13.2124,
  },
  priceFrom: 59,
  airbnbRating: 4.97,
  airbnbReviewCount: 95,
  smoobuPropertyId: "2934161",
  shortDescription:
    "Vier geschmackvolle Ferienwohnungen mit Panoramablick über den Bayerischen Wald – ideal für Paare, Familien und Gruppen.",
  description:
    "Haus Schönblick in Schöfweg vereint vier individuell eingerichtete Ferienwohnungen unter einem Dach. Alle Apartments bieten einen atemberaubenden Ausblick über die sanfte Hügellandschaft des Bayerischen Waldes. Ob du solo verreist, mit der Familie oder in einer Gruppe – hier findest du dein perfektes Zuhause auf Zeit. Die ruhige Lage, die frische Waldluft und die herzliche Atmosphäre laden zum echten Entschleunigen ein.",
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
      { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_188.webp", alt: "Apartment B5 – Wohnbereich" },
      { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_222.webp", alt: "Apartment B5 – Schlafzimmer" },
      { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_003.webp", alt: "Apartment B8 – Wohnbereich" },
      { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_083.webp", alt: "Apartment B8 – Schlafzimmer" },
      { src: "/images/schoenblick/b6/gallery/img_9750.webp", alt: "Apartment B6 – Wohnbereich" },
      { src: "/images/schoenblick/a2/gallery/img_9799.webp", alt: "Apartment A2 – Wohnbereich" },
    ],
  },
  apartments: {
    b5: {
      id: "b5",
      name: "Apartment B5",
      subtitle: "Helles Apartment mit Waldblick & Terrasse",
      airbnbUrl: "https://www.airbnb.de/rooms/1542179745378169386",
      airbnbRating: 4.97,
      airbnbReviewCount: 22,
      smoobuPropertyId: "3025621",
      maxGuests: 4,
      bedrooms: 1,
      bathrooms: 1,
      sqm: 55,
      priceFrom: 59,
      shortDescription: "Helles, komfortables Apartment mit Waldblick und Terrasse für bis zu 4 Personen.",
      description:
        "Apartment B5 im Haus Schönblick bietet dir einen gemütlichen Rückzugsort mit direktem Waldblick und sonniger Terrasse. Die liebevolle Einrichtung, die gut ausgestattete Küche und der direkte Zugang zur frischen Waldluft machen deinen Aufenthalt zu einem echten Erlebnis. Perfekt für Paare oder kleine Familien.",
      amenities: schoenblickAmenities,
      images: {
        hero: "/images/schoenblick/b5/hero.webp",
        thumbnail: "/images/schoenblick/b5/hero-thumb.webp",
        gallery: [
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_188.webp", alt: "Apartment B5 – Wohnbereich" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_190.webp", alt: "Apartment B5 – Wohnzimmer" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_191.webp", alt: "Apartment B5 – Essbereich" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_192.webp", alt: "Apartment B5 – Küche" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_197.webp", alt: "Apartment B5 – Küchendetail" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_199.webp", alt: "Apartment B5 – Wohnzimmer Blick" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_201.webp", alt: "Apartment B5 – Schlafzimmer" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_202.webp", alt: "Apartment B5 – Schlafzimmer Detail" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_222.webp", alt: "Apartment B5 – Schlafbereich" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_223.webp", alt: "Apartment B5 – Schlafzimmer Fenster" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_227.webp", alt: "Apartment B5 – Badezimmer" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_230.webp", alt: "Apartment B5 – Bad Detail" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_234.webp", alt: "Apartment B5 – Balkon" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_237.webp", alt: "Apartment B5 – Balkon Aussicht" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_249.webp", alt: "Apartment B5 – Ausblick" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_265.webp", alt: "Apartment B5 – Panorama" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_269.webp", alt: "Apartment B5 – Außenbereich" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_271.webp", alt: "Apartment B5 – Umgebung" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_277.webp", alt: "Apartment B5 – Natur" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_278.webp", alt: "Apartment B5 – Waldblick" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_281.webp", alt: "Apartment B5 – Detail" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_285.webp", alt: "Apartment B5 – Eingang" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_287.webp", alt: "Apartment B5 – Hausansicht" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_290.webp", alt: "Apartment B5 – Bayerischer Wald" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_291.webp", alt: "Apartment B5 – Abendstimmung" },
          { src: "/images/schoenblick/b5/gallery/haus_schoenblick_251228_298.webp", alt: "Apartment B5 – Weitblick" },
        ],
      },
      faqs: schoenblickFaqs,
    },
    b6: {
      id: "b6",
      name: "Apartment B6",
      subtitle: "Lichtdurchflutete Wohnung mit Panoramablick",
      airbnbUrl: "https://www.airbnb.de/rooms/1511581373647900244",
      airbnbRating: 4.97,
      airbnbReviewCount: 19,
      smoobuPropertyId: "2934141",
      maxGuests: 4,
      bedrooms: 1,
      bathrooms: 1,
      sqm: 55,
      priceFrom: 59,
      shortDescription: "Großzügiges Apartment mit herrlichem Panorama über die Hügel des Bayerischen Waldes.",
      description:
        "Apartment B6 besticht durch seinen atemberaubenden Panoramablick und die lichtdurchfluteten Räume. Die moderne Einrichtung verbindet Komfort mit bayerischem Charme. Genießt den Morgen auf dem Balkon bei frischer Waldluft und Weitblick über den Schöfweger Wald.",
      amenities: schoenblickAmenities,
      images: {
        hero: "/images/schoenblick/b6/gallery/img_9762.webp",
        thumbnail: "/images/schoenblick/b6/gallery/m_img_9762.webp",
        gallery: [
          { src: "/images/schoenblick/b6/gallery/img_9750.webp", alt: "Apartment B6 – Wohnbereich" },
          { src: "/images/schoenblick/b6/gallery/img_9751.webp", alt: "Apartment B6 – Wohnzimmer" },
          { src: "/images/schoenblick/b6/gallery/img_9754.webp", alt: "Apartment B6 – Essbereich" },
          { src: "/images/schoenblick/b6/gallery/img_9758.webp", alt: "Apartment B6 – Küche" },
          { src: "/images/schoenblick/b6/gallery/img_9759.webp", alt: "Apartment B6 – Küchenbereich" },
          { src: "/images/schoenblick/b6/gallery/img_9760.webp", alt: "Apartment B6 – Küchendetail" },
          { src: "/images/schoenblick/b6/gallery/img_9762.webp", alt: "Apartment B6 – Schlafzimmer" },
          { src: "/images/schoenblick/b6/gallery/img_9767.webp", alt: "Apartment B6 – Schlafzimmer Detail" },
          { src: "/images/schoenblick/b6/gallery/img_9769.webp", alt: "Apartment B6 – Schlafbereich" },
          { src: "/images/schoenblick/b6/gallery/img_9772.webp", alt: "Apartment B6 – Badezimmer" },
          { src: "/images/schoenblick/b6/gallery/img_9774.webp", alt: "Apartment B6 – Bad" },
          { src: "/images/schoenblick/b6/gallery/img_9775.webp", alt: "Apartment B6 – Balkon" },
          { src: "/images/schoenblick/b6/gallery/img_9778.webp", alt: "Apartment B6 – Ausblick" },
          { src: "/images/schoenblick/b6/gallery/img_9780.webp", alt: "Apartment B6 – Panorama" },
          { src: "/images/schoenblick/b6/gallery/img_9781.webp", alt: "Apartment B6 – Weitblick" },
          { src: "/images/schoenblick/b6/gallery/img_9783.webp", alt: "Apartment B6 – Bayerischer Wald" },
        ],
      },
      faqs: schoenblickFaqs,
    },
    b8: {
      id: "b8",
      name: "Apartment B8",
      subtitle: "Großzügige Ferienwohnung für Familien",
      airbnbUrl: "https://www.airbnb.de/rooms/1525349872389165473",
      airbnbRating: 4.97,
      airbnbReviewCount: 28,
      smoobuPropertyId: "3025606",
      maxGuests: 6,
      bedrooms: 2,
      bathrooms: 1,
      sqm: 72,
      priceFrom: 79,
      shortDescription: "Großzügiges 2-Zimmer-Apartment für bis zu 6 Personen – ideal für Familien und Freundesgruppen.",
      description:
        "Das größte Apartment im Haus Schönblick bietet viel Platz für die ganze Familie oder eine Gruppe von Freunden. Zwei Schlafzimmer, eine vollausgestattete Küche und ein sonniger Balkon mit Weitblick machen B8 zum perfekten Basislager für Wanderungen, Ausflüge und unvergessliche Momente im Bayerischen Wald.",
      amenities: schoenblickAmenities,
      images: {
        hero: "/images/schoenblick/b8/hero.webp",
        thumbnail: "/images/schoenblick/b8/hero-thumb.webp",
        gallery: [
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_003.webp", alt: "Apartment B8 – Wohnbereich" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_006.webp", alt: "Apartment B8 – Wohnzimmer" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_013.webp", alt: "Apartment B8 – Essbereich" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_015.webp", alt: "Apartment B8 – Küche" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_026.webp", alt: "Apartment B8 – Küchendetail" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_036.webp", alt: "Apartment B8 – Wohnzimmer Detail" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_041.webp", alt: "Apartment B8 – Schlafzimmer 1" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_048.webp", alt: "Apartment B8 – Schlafzimmer 1 Detail" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_049.webp", alt: "Apartment B8 – Schlafzimmer 2" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_065.webp", alt: "Apartment B8 – Schlafzimmer 2 Detail" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_083.webp", alt: "Apartment B8 – Badezimmer" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_088.webp", alt: "Apartment B8 – Bad" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_093.webp", alt: "Apartment B8 – Balkon" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_098.webp", alt: "Apartment B8 – Ausblick" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_099.webp", alt: "Apartment B8 – Panorama" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_123.webp", alt: "Apartment B8 – Weitblick" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_134.webp", alt: "Apartment B8 – Waldblick" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_145.webp", alt: "Apartment B8 – Natur" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_149.webp", alt: "Apartment B8 – Umgebung" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_150.webp", alt: "Apartment B8 – Bayerischer Wald" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_151.webp", alt: "Apartment B8 – Abendstimmung" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_157.webp", alt: "Apartment B8 – Eingang" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_162.webp", alt: "Apartment B8 – Außenansicht" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_165.webp", alt: "Apartment B8 – Hausansicht" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_172.webp", alt: "Apartment B8 – Umgebung Schöfweg" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_175.webp", alt: "Apartment B8 – Natur Detail" },
          { src: "/images/schoenblick/b8/gallery/haus_schoenblick_251228_183.webp", alt: "Apartment B8 – Waldspaziergang" },
        ],
      },
      faqs: schoenblickFaqs,
    },
    a2: {
      id: "a2",
      name: "Apartment A2",
      subtitle: "Gemütliches Apartment mit ruhiger Gartenaussicht",
      airbnbUrl: "https://www.airbnb.de/rooms/1512149022196493833",
      airbnbRating: 5.0,
      airbnbReviewCount: 26,
      smoobuPropertyId: "2934161",
      maxGuests: 3,
      bedrooms: 1,
      bathrooms: 1,
      sqm: 48,
      priceFrom: 59,
      shortDescription: "Gemütliches Apartment für Paare oder kleine Familien mit ruhiger Garten- und Waldaussicht.",
      description:
        "Apartment A2 ist der gemütlichste Rückzugsort im Haus Schönblick – ideal für Paare oder kleine Familien, die echte Ruhe suchen. Die ruhige Lage mit Garten- und Waldblick, die warme Einrichtung und die direkte Nähe zu Wanderwegen sorgen für einen entspannten Urlaub abseits des Alltags.",
      amenities: schoenblickAmenities,
      images: {
        hero: "/images/schoenblick/a2/hero.webp",
        thumbnail: "/images/schoenblick/a2/hero-thumb.webp",
        gallery: [
          { src: "/images/schoenblick/a2/gallery/img_9799.webp", alt: "Apartment A2 – Wohnbereich" },
          { src: "/images/schoenblick/a2/gallery/img_9803.webp", alt: "Apartment A2 – Wohnzimmer" },
          { src: "/images/schoenblick/a2/gallery/img_9804.webp", alt: "Apartment A2 – Essbereich" },
          { src: "/images/schoenblick/a2/gallery/img_9805.webp", alt: "Apartment A2 – Küche" },
          { src: "/images/schoenblick/a2/gallery/img_9806.webp", alt: "Apartment A2 – Küchenbereich" },
          { src: "/images/schoenblick/a2/gallery/img_9807.webp", alt: "Apartment A2 – Küchendetail" },
          { src: "/images/schoenblick/a2/gallery/img_9810.webp", alt: "Apartment A2 – Schlafzimmer" },
          { src: "/images/schoenblick/a2/gallery/img_9811.webp", alt: "Apartment A2 – Schlafzimmer Detail" },
          { src: "/images/schoenblick/a2/gallery/img_9812.webp", alt: "Apartment A2 – Schlafbereich" },
          { src: "/images/schoenblick/a2/gallery/img_9813.webp", alt: "Apartment A2 – Badezimmer" },
          { src: "/images/schoenblick/a2/gallery/img_9814.webp", alt: "Apartment A2 – Bad Detail" },
          { src: "/images/schoenblick/a2/gallery/img_9815.webp", alt: "Apartment A2 – Balkon" },
          { src: "/images/schoenblick/a2/gallery/img_9816.webp", alt: "Apartment A2 – Balkon Aussicht" },
          { src: "/images/schoenblick/a2/gallery/img_9817.webp", alt: "Apartment A2 – Ausblick" },
          { src: "/images/schoenblick/a2/gallery/img_9819.webp", alt: "Apartment A2 – Gartenblick" },
          { src: "/images/schoenblick/a2/gallery/img_9820.webp", alt: "Apartment A2 – Außenbereich" },
          { src: "/images/schoenblick/a2/gallery/img_9824.webp", alt: "Apartment A2 – Umgebung" },
          { src: "/images/schoenblick/a2/gallery/img_9825.webp", alt: "Apartment A2 – Natur" },
          { src: "/images/schoenblick/a2/gallery/img_9826.webp", alt: "Apartment A2 – Waldblick" },
          { src: "/images/schoenblick/a2/gallery/img_9827.webp", alt: "Apartment A2 – Bayerischer Wald" },
          { src: "/images/schoenblick/a2/gallery/img_9828.webp", alt: "Apartment A2 – Abendstimmung" },
        ],
      },
      faqs: schoenblickFaqs,
    },
  },
};

// ---------------------------------------------------------------------------
// All properties index
// ---------------------------------------------------------------------------
export const allProperties = { haus28, schoenblick };
