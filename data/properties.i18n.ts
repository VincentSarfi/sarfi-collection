// English overlay for data/properties.ts.
//
// The German data in properties.ts is the single source of truth for the live
// site and stays untouched. This file only layers English translations for
// guest-facing text on top of it via `localizeProperty`.
//
// Matching strategy (robust against reordering in properties.ts):
// - subtitle / description / shortDescription: per property/apartment overlay
// - FAQs: matched by their German question (`de` key)
// - amenity labels, gallery alt texts, bedroom names & bed types: matched by
//   their German source string via global lookup maps
// Anything without a translation falls back to the German original.

import type { Locale } from "@/lib/i18n";
import type { ApartmentData, PropertyData } from "./properties";

// ---------------------------------------------------------------------------
// Overlay types
// ---------------------------------------------------------------------------

type FaqTranslation = {
  /** German question of the original FAQ entry (used for matching). */
  de: string;
  question: string;
  answer: string;
};

type TextOverlay = {
  subtitle?: string;
  shortDescription?: string;
  description?: string;
  faqs?: FaqTranslation[];
  apartments?: Record<string, TextOverlay>;
};

// ---------------------------------------------------------------------------
// Global lookup maps (German source string → English)
// ---------------------------------------------------------------------------

const amenityLabelEn: Record<string, string> = {
  WLAN: "Wi-Fi",
  "Voll ausgestattete Küche": "Fully equipped kitchen",
  "Kostenloser Parkplatz": "Free parking",
  Klimaanlage: "Air conditioning",
  Feuerschale: "Fire pit",
  "Große Terrasse": "Large terrace",
  Grill: "BBQ grill",
  Waschmaschine: "Washing machine",
  Trockner: "Dryer",
  "Smart TV": "Smart TV",
  Heizung: "Heating",
  Kaffeemaschine: "Coffee machine",
  "Hochwertige Bettwäsche": "Premium bed linen",
  "Handtücher inklusive": "Towels included",
  "Self-Check-in": "Self check-in",
  Rauchmelder: "Smoke detector",
  Kinderreisebett: "Travel cot",
  Waldlage: "Forest setting",
  "Balkon / Terrasse": "Balcony / terrace",
  Panoramablick: "Panoramic views",
  "Balkon mit Bergblick": "Balcony with mountain views",
  "Blick auf den Bayerischen Wald": "Bavarian Forest views",
};

const bedroomNameEn: Record<string, string> = {
  "Schlafzimmer 1": "Bedroom 1",
  "Schlafzimmer 2": "Bedroom 2",
};

const bedLabelEn: Record<string, string> = {
  "1 Kingsize-Doppelbett": "1 king-size double bed",
  "1 Kingsize-Bett (180×200 cm)": "1 king-size bed (180×200 cm)",
  "1 Doppelbett": "1 double bed",
  "2 Einzelbetten": "2 single beds",
  "Stockbett (2 Einzelbetten)": "Bunk bed (2 single beds)",
  "Ausziehbares Einzelbett (2× 90 cm)": "Pull-out single bed (2× 90 cm)",
};

const galleryAltEn: Record<string, string> = {
  // HAUS28
  "HAUS28 – A-Frame Frontansicht im Abendlicht": "HAUS28 – A-frame front view in evening light",
  "HAUS28 – Wohnbereich mit Panoramafenster zum Wald": "HAUS28 – Living area with panoramic window facing the forest",
  "HAUS28 – Offene Wohn- und Küchenfläche": "HAUS28 – Open-plan living and kitchen area",
  "HAUS28 – Außenansicht durch den Wald": "HAUS28 – Exterior view through the forest",
  "HAUS28 – Schlafbereich OG mit Dreiecksfenster": "HAUS28 – Upstairs sleeping area with triangular window",
  "HAUS28 – Essbereich": "HAUS28 – Dining area",
  "HAUS28 – Schlafzimmer EG": "HAUS28 – Ground-floor bedroom",
  "HAUS28 – Zweites Schlafzimmer": "HAUS28 – Second bedroom",
  "HAUS28 – Schlafzimmer mit Terrassenzugang": "HAUS28 – Bedroom with terrace access",
  "HAUS28 – Badezimmer": "HAUS28 – Bathroom",
  "HAUS28 – Terrasse von oben": "HAUS28 – Terrace seen from above",
  "HAUS28 – Wohnraum": "HAUS28 – Living space",
  "HAUS28 – Küchenbereich": "HAUS28 – Kitchen area",
  "HAUS28 – Innenbereich Detail": "HAUS28 – Interior detail",
  "HAUS28 – Eingang Hausfront": "HAUS28 – Entrance and house front",
  "HAUS28 – Außenbereich mit Naturblick": "HAUS28 – Outdoor area with views of nature",
  "HAUS28 – Eingangsbereich": "HAUS28 – Entrance area",
  "HAUS28 – Detailansicht Architektur": "HAUS28 – Architectural detail",
  "HAUS28 – Detailansicht Innen": "HAUS28 – Interior detail view",
  "HAUS28 – A-Frame im Grünen, Sommeransicht": "HAUS28 – A-frame in the greenery, summer view",
  // Haus Schönblick – exterior & house gallery
  "Haus Schönblick – Außenansicht": "Haus Schönblick – Exterior view",
  "Haus Schönblick – Eingang und Umgebung": "Haus Schönblick – Entrance and surroundings",
  "Haus Schönblick – Gartenbereich": "Haus Schönblick – Garden area",
  "Haus Schönblick – Außenansicht Schöfweg": "Haus Schönblick – Exterior view in Schöfweg",
  "Haus Schönblick – Panoramablick vom Haus": "Haus Schönblick – Panoramic view from the house",
  "Haus Schönblick – Natur und Umgebung": "Haus Schönblick – Nature and surroundings",
  "Haus Schönblick – Bayerischer Wald": "Haus Schönblick – Bavarian Forest",
  // Apartment B5
  "Apartment B5 – Wohnbereich": "Apartment B5 – Living area",
  "Apartment B5 – Schlafzimmer": "Apartment B5 – Bedroom",
  "Apartment B5 – Wohnzimmer mit Backsteinwand": "Apartment B5 – Living room with brick wall",
  "Apartment B5 – Wohn- und Essbereich": "Apartment B5 – Living and dining area",
  "Apartment B5 – Schlafzimmer Doppelbett": "Apartment B5 – Bedroom with double bed",
  "Apartment B5 – Kinderschlafzimmer Etagenbett": "Apartment B5 – Kids' bedroom with bunk bed",
  "Apartment B5 – Etagenbett Seitenansicht": "Apartment B5 – Bunk bed side view",
  "Apartment B5 – Etagenbett Detail": "Apartment B5 – Bunk bed detail",
  "Apartment B5 – Küche": "Apartment B5 – Kitchen",
  "Apartment B5 – Küche Übersicht": "Apartment B5 – Kitchen overview",
  "Apartment B5 – Küchendetail": "Apartment B5 – Kitchen detail",
  "Apartment B5 – Küchenbereich": "Apartment B5 – Kitchen area",
  "Apartment B5 – Schlafzimmer Detail": "Apartment B5 – Bedroom detail",
  "Apartment B5 – Schlafbereich": "Apartment B5 – Sleeping area",
  "Apartment B5 – Schlafzimmer Fenster": "Apartment B5 – Bedroom window",
  "Apartment B5 – Badezimmer": "Apartment B5 – Bathroom",
  "Apartment B5 – Balkon Aussicht": "Apartment B5 – View from the balcony",
  "Apartment B5 – Panoramablick": "Apartment B5 – Panoramic view",
  "Apartment B5 – Abendstimmung": "Apartment B5 – Evening mood",
  "Apartment B5 – Weitblick Bayerischer Wald": "Apartment B5 – Sweeping view of the Bavarian Forest",
  "Apartment B5 – Außenbereich": "Apartment B5 – Outdoor area",
  "Apartment B5 – Umgebung": "Apartment B5 – Surroundings",
  "Apartment B5 – Natur": "Apartment B5 – Nature",
  "Apartment B5 – Waldblick": "Apartment B5 – Forest view",
  "Apartment B5 – Detail": "Apartment B5 – Detail",
  "Apartment B5 – Eingang": "Apartment B5 – Entrance",
  "Apartment B5 – Hausansicht": "Apartment B5 – View of the house",
  "Apartment B5 – Bayerischer Wald": "Apartment B5 – Bavarian Forest",
  // Apartment B6
  "Apartment B6 – Wohnbereich": "Apartment B6 – Living area",
  "Apartment B6 – Wohnzimmer mit grünem Sofa": "Apartment B6 – Living room with green sofa",
  "Apartment B6 – Wohn- und Essbereich Übersicht": "Apartment B6 – Living and dining area overview",
  "Apartment B6 – Wohnzimmer Balkonzugang": "Apartment B6 – Living room with balcony access",
  "Apartment B6 – Schlafzimmer 1 Doppelbett": "Apartment B6 – Bedroom 1 with double bed",
  "Apartment B6 – Schlafzimmer 2": "Apartment B6 – Bedroom 2",
  "Apartment B6 – Schlafzimmer 2 Übersicht": "Apartment B6 – Bedroom 2 overview",
  "Apartment B6 – Badezimmer": "Apartment B6 – Bathroom",
  "Apartment B6 – Badezimmer Detail": "Apartment B6 – Bathroom detail",
  "Apartment B6 – Terrasse": "Apartment B6 – Terrace",
  "Apartment B6 – Wohnzimmer Sonnenlicht": "Apartment B6 – Living room in sunlight",
  "Apartment B6 – Essbereich Dekoration": "Apartment B6 – Dining area decor",
  "Apartment B6 – Eingang": "Apartment B6 – Entrance",
  "Apartment B6 – Ausblick Bayerischer Wald": "Apartment B6 – View of the Bavarian Forest",
  "Apartment B6 – Herbstdekoration": "Apartment B6 – Autumn decor",
  "Apartment B6 – Küche": "Apartment B6 – Kitchen",
  "Apartment B6 – Küche Detail": "Apartment B6 – Kitchen detail",
  // Apartment B8
  "Apartment B8 – Wohnbereich": "Apartment B8 – Living area",
  "Apartment B8 – Schlafzimmer": "Apartment B8 – Bedroom",
  "Apartment B8 – Wohnzimmer mit blauem Sofa": "Apartment B8 – Living room with blue sofa",
  "Apartment B8 – Wohnbereich Übersicht": "Apartment B8 – Living area overview",
  "Apartment B8 – Schlafzimmer 1 Nahansicht": "Apartment B8 – Bedroom 1 close-up",
  "Apartment B8 – Schlafzimmer 1": "Apartment B8 – Bedroom 1",
  "Apartment B8 – Schlafzimmer mit Teppich": "Apartment B8 – Bedroom with rug",
  "Apartment B8 – Panoramablick vom Balkon": "Apartment B8 – Panoramic view from the balcony",
  "Apartment B8 – Balkon Winterpanorama": "Apartment B8 – Winter panorama from the balcony",
  "Apartment B8 – Essbereich": "Apartment B8 – Dining area",
  "Apartment B8 – Küche": "Apartment B8 – Kitchen",
  "Apartment B8 – Küchendetail": "Apartment B8 – Kitchen detail",
  "Apartment B8 – Schlafzimmer 1 Detail": "Apartment B8 – Bedroom 1 detail",
  "Apartment B8 – Schlafzimmer 2": "Apartment B8 – Bedroom 2",
  "Apartment B8 – Schlafzimmer 2 Detail": "Apartment B8 – Bedroom 2 detail",
  "Apartment B8 – Badezimmer": "Apartment B8 – Bathroom",
  "Apartment B8 – Weitblick": "Apartment B8 – Sweeping view",
  "Apartment B8 – Panorama Bayerischer Wald": "Apartment B8 – Bavarian Forest panorama",
  "Apartment B8 – Waldblick": "Apartment B8 – Forest view",
  "Apartment B8 – Natur": "Apartment B8 – Nature",
  "Apartment B8 – Umgebung": "Apartment B8 – Surroundings",
  "Apartment B8 – Bayerischer Wald": "Apartment B8 – Bavarian Forest",
  "Apartment B8 – Abendstimmung": "Apartment B8 – Evening mood",
  "Apartment B8 – Eingang": "Apartment B8 – Entrance",
  "Apartment B8 – Außenansicht": "Apartment B8 – Exterior view",
  "Apartment B8 – Hausansicht": "Apartment B8 – View of the house",
  "Apartment B8 – Umgebung Schöfweg": "Apartment B8 – Around Schöfweg",
  "Apartment B8 – Natur Detail": "Apartment B8 – Nature detail",
  "Apartment B8 – Waldspaziergang": "Apartment B8 – Forest walk",
  // Apartment B7
  "Apartment B7 – Badezimmer mit Naturstein-Waschbecken & Holzdecke":
    "Apartment B7 – Bathroom with natural stone washbasin & wooden ceiling",
  "Apartment B7 – Wohnzimmer mit Balkon & Bergblick": "Apartment B7 – Living room with balcony & mountain views",
  "Apartment B7 – Wohnzimmer mit Balkonzugang & Waldblick":
    "Apartment B7 – Living room with balcony access & forest views",
  "Apartment B7 – Wohnzimmer & Essbereich": "Apartment B7 – Living room & dining area",
  "Apartment B7 – Sofabereich mit Backsteinwand": "Apartment B7 – Sofa area with brick wall",
  "Apartment B7 – Wohnzimmer mit TV & Zimmerzugang": "Apartment B7 – Living room with TV & access to the bedrooms",
  "Apartment B7 – Schlafzimmer 1 mit Kingsize-Bett": "Apartment B7 – Bedroom 1 with king-size bed",
  "Apartment B7 – Schlafzimmer 1 Frontansicht": "Apartment B7 – Bedroom 1 front view",
  "Apartment B7 – Schlafzimmer 1 Messinglampe Detail": "Apartment B7 – Bedroom 1 brass lamp detail",
  "Apartment B7 – Schlafzimmer 2 mit Tagesbett & Wandlampen": "Apartment B7 – Bedroom 2 with daybed & wall lamps",
  "Apartment B7 – Schlafzimmer 2 Gesamtansicht mit Wandlampen":
    "Apartment B7 – Bedroom 2 full view with wall lamps",
  "Apartment B7 – Schlafzimmer 2 mit Waldblick": "Apartment B7 – Bedroom 2 with forest view",
  "Apartment B7 – Badezimmer Gesamtansicht": "Apartment B7 – Bathroom full view",
  "Apartment B7 – Naturstein-Waschbecken Detail": "Apartment B7 – Natural stone washbasin detail",
  "Apartment B7 – Dusche & WC": "Apartment B7 – Shower & WC",
  "Apartment B7 – Küche mit Herd & Ofen": "Apartment B7 – Kitchen with hob & oven",
  "Apartment B7 – Küchenüberblick": "Apartment B7 – Kitchen overview",
  "Apartment B7 – Küche Nahaufnahme": "Apartment B7 – Kitchen close-up",
  "Apartment B7 – Panoramablick auf den Bayerischen Wald":
    "Apartment B7 – Panoramic view of the Bavarian Forest",
  "Apartment B7 – Blick auf den Bayerischen Wald": "Apartment B7 – View of the Bavarian Forest",
  "Apartment B7 – Flur mit Zimmerzugang": "Apartment B7 – Hallway with room access",
  // Apartment A2
  "Apartment A2 – Wohnbereich": "Apartment A2 – Living area",
  "Apartment A2 – Küchendetail": "Apartment A2 – Kitchen detail",
  "Apartment A2 – Außenbereich & Umgebung": "Apartment A2 – Outdoor area & surroundings",
  "Apartment A2 – Schlafzimmer mit Stockbett & Wandschrank":
    "Apartment A2 – Bedroom with bunk bed & built-in wardrobe",
  "Apartment A2 – Schlafzimmer mit Einzelbetten": "Apartment A2 – Bedroom with single beds",
  "Apartment A2 – Schlafzimmer Detail": "Apartment A2 – Bedroom detail",
  "Apartment A2 – Schlafbereich": "Apartment A2 – Sleeping area",
  "Apartment A2 – Badezimmer": "Apartment A2 – Bathroom",
  "Apartment A2 – Bad Detail": "Apartment A2 – Bathroom detail",
  "Apartment A2 – Wohnzimmer": "Apartment A2 – Living room",
  "Apartment A2 – Essbereich": "Apartment A2 – Dining area",
  "Apartment A2 – Eingangsbereich": "Apartment A2 – Entrance area",
  "Apartment A2 – Küche": "Apartment A2 – Kitchen",
  "Apartment A2 – Küchenbereich": "Apartment A2 – Kitchen area",
  "Apartment A2 – Wohnzimmer mit Panoramablick": "Apartment A2 – Living room with panoramic view",
  "Apartment A2 – Balkon Aussicht": "Apartment A2 – View from the balcony",
  "Apartment A2 – Gartenblick": "Apartment A2 – Garden view",
  "Apartment A2 – Umgebung": "Apartment A2 – Surroundings",
  "Apartment A2 – Natur": "Apartment A2 – Nature",
  "Apartment A2 – Waldblick": "Apartment A2 – Forest view",
  "Apartment A2 – Bayerischer Wald": "Apartment A2 – Bavarian Forest",
  "Apartment A2 – Abendstimmung": "Apartment A2 – Evening mood",
};

// ---------------------------------------------------------------------------
// Shared FAQ translations – Haus Schönblick (house + all apartments)
// ---------------------------------------------------------------------------

const schoenblickFaqsEn: FaqTranslation[] = [
  {
    de: "Wie läuft der Check-in ab?",
    question: "How does check-in work?",
    answer:
      "Self check-in with a key box. You'll receive the code around 24 hours before arrival. Check-in from 4:00 p.m.",
  },
  {
    de: "Wann ist der Check-out?",
    question: "When is check-out?",
    answer: "Check-out by 10:00 a.m. Late check-out on request.",
  },
  {
    de: "Können mehrere Apartments gleichzeitig gebucht werden?",
    question: "Can several apartments be booked at the same time?",
    answer:
      "Yes! Haus Schönblick is ideal for groups or families who'd like to book several apartments side by side. Get in touch with us for group enquiries.",
  },
  {
    de: "Sind Haustiere erlaubt?",
    question: "Are pets allowed?",
    answer: "Please contact us before booking if you'd like to bring a pet.",
  },
  {
    de: "Wie ist der Blick?",
    question: "What's the view like?",
    answer:
      "Every apartment enjoys glorious views across the Bavarian Forest and the countryside around Schöfweg – the name Schönblick (“beautiful view”) says it all.",
  },
  {
    de: "Wie weit ist es zu Wanderwegen?",
    question: "How far is it to the hiking trails?",
    answer:
      "Schöfweg sits right in the heart of the Bavarian Forest. Countless hiking trails start directly outside the house.",
  },
  {
    de: "Gibt es WLAN?",
    question: "Is there Wi-Fi?",
    answer: "Yes, fast Wi-Fi is included free of charge in every apartment.",
  },
  {
    de: "Wie weit ist es zur Pullman City?",
    question: "How far is it to Pullman City?",
    answer:
      "The Pullman City western town is only around 15 minutes by car from Haus Schönblick in Schöfweg – an ideal day trip for the whole family.",
  },
  {
    de: "Welche Ausflugsziele gibt es in der Nähe?",
    question: "What is there to see and do nearby?",
    answer:
      "There's plenty waiting for you around Schöfweg in the Bavarian Forest: Pullman City (~15 min), the Neuschönau treetop walk (~25 min), the Bavarian Forest National Park (~20 km), Grafenau (~15 min), the thermal baths in Regen (~30 min) and the Großer Arber ski area (~45 min).",
  },
  {
    de: "Wie sind die Stornierungsbedingungen?",
    question: "What is the cancellation policy?",
    answer:
      "Up to 14 days before arrival: 100% refund. 7 to 14 days before arrival: 50% refund. Less than 7 days before arrival: no refund. Full details at sarfi-collection.de/stornierung.",
  },
];

// ---------------------------------------------------------------------------
// Property overlays (keyed by property id / apartment id)
// ---------------------------------------------------------------------------

const propertyOverlaysEn: Record<string, TextOverlay> = {
  haus28: {
    subtitle: "Modern A-frame at the Büchelstein, Grattersdorf",
    shortDescription:
      "A one-of-a-kind A-frame holiday home at the Büchelstein near Grattersdorf – an architectural retreat for up to 8 guests in the Bavarian Forest.",
    description:
      "At the Büchelstein near Grattersdorf, HAUS28 awaits – a modern A-frame holiday home with 157 m² of living space, where architecture and nature blend into an atmosphere all of its own. The striking triangular silhouette, warm wooden interior and floor-to-ceiling panoramic window blur the line between inside and out. Four bedrooms and two bathrooms sleep up to 8 guests. Wake up in the forest in the morning, and end the day around the fire pit or on the spacious terrace. Perfect for families, groups of friends, or anyone who truly wants to switch off.",
    faqs: [
      {
        de: "Wo genau liegt HAUS28 am Büchelstein?",
        question: "Where exactly is HAUS28 at the Büchelstein?",
        answer:
          "HAUS28 is located at Büchelstein 28 near Grattersdorf in the Bavarian Forest – right at the foot of the Büchelstein (831 m), surrounded by forest and nature. The Büchelstein summit with its panoramic views is just a few minutes away on foot.",
      },
      {
        de: "Wie läuft der Check-in ab?",
        question: "How does check-in work?",
        answer:
          "HAUS28 at the Büchelstein offers self check-in with a key box. You'll receive the code by message around 24 hours before your arrival. Check-in from 4:00 p.m.",
      },
      {
        de: "Wann ist der Check-out?",
        question: "When is check-out?",
        answer: "Check-out is by 10:00 a.m. A later check-out may be possible on request, subject to availability.",
      },
      {
        de: "Wie viele Personen passen ins HAUS28?",
        question: "How many guests does HAUS28 sleep?",
        answer: "HAUS28 sleeps up to 8 guests across 4 bedrooms – perfect for families or groups of friends.",
      },
      {
        de: "Wie sind die Stornierungsbedingungen?",
        question: "What is the cancellation policy?",
        answer:
          "Up to 30 days before arrival: 100% refund. 14 to 30 days before arrival: 50% refund. Less than 14 days before arrival: no refund. Full details at sarfi-collection.de/stornierung.",
      },
      {
        de: "Gibt es WLAN?",
        question: "Is there Wi-Fi?",
        answer: "Yes, fast Wi-Fi is included free of charge.",
      },
      {
        de: "Wie weit ist es vom Büchelstein zum nächsten Ort?",
        question: "How far is it from the Büchelstein to the nearest town?",
        answer:
          "From HAUS28 at the Büchelstein, Grattersdorf is just a few minutes away, and Deggendorf (shopping, restaurants) is around 20 minutes by car. Hiking trails to the Büchelstein summit and through the Bavarian Forest start right outside the front door.",
      },
      {
        de: "Gibt es eine Mindeststay-Regelung?",
        question: "Is there a minimum stay?",
        answer:
          "The minimum stay is 2 nights. It may be longer in high season – you'll see the details during booking.",
      },
      {
        de: "Wie weit ist es zur Pullman City?",
        question: "How far is it to Pullman City?",
        answer:
          "The Pullman City western town in Eging am See is around 20 minutes by car from HAUS28 at the Büchelstein – a perfect day trip for families with kids!",
      },
      {
        de: "Welche Ausflugsziele gibt es im Bayerischen Wald?",
        question: "What is there to see and do in the Bavarian Forest?",
        answer:
          "There's plenty to discover near HAUS28: Pullman City (~20 min), the Bavarian Forest National Park (~25 km), the Neuschönau treetop walk (~30 min), the thermal baths in Regen (~35 min), the Großer Arber ski area (~50 min) – and of course the Büchelstein summit right on your doorstep.",
      },
    ],
  },
  schoenblick: {
    subtitle: "Panoramic apartments in the heart of the Bavarian Forest",
    shortDescription:
      "Five tastefully furnished holiday apartments with panoramic views across the Bavarian Forest – ideal for couples, families and groups.",
    description:
      "Haus Schönblick in Schöfweg brings together five individually furnished holiday apartments under one roof. Every apartment enjoys breathtaking views across the rolling hills of the Bavarian Forest. Whether you're travelling solo, with your family or in a group – you'll find your perfect home away from home here. The peaceful setting, fresh forest air and warm, welcoming atmosphere invite you to truly slow down.",
    faqs: schoenblickFaqsEn,
    apartments: {
      b5: {
        subtitle: "Bright apartment with forest views & terrace",
        shortDescription: "A bright, comfortable apartment with forest views and a terrace for up to 4 guests.",
        description:
          "Apartment B5 at Haus Schönblick is your cosy hideaway with direct forest views and a sunny terrace. Lovingly furnished, with a well-equipped kitchen and fresh forest air right outside the door, it turns your stay into a real experience. With 55 m² and 2 bedrooms, it's ideal for families or small groups of up to 4. Bedroom 1: king-size bed · Bedroom 2: bunk bed (one bed below, one above).",
        faqs: schoenblickFaqsEn,
      },
      b6: {
        subtitle: "Light-filled apartment with panoramic views",
        shortDescription: "A generous apartment with glorious panoramic views over the hills of the Bavarian Forest.",
        description:
          "Apartment B6 wins you over with its breathtaking panoramic views and light-filled rooms. The modern interior combines comfort with Bavarian charm. Enjoy your mornings on the balcony with fresh forest air and sweeping views over the Schöfweg woods. Bedroom 1: king-size bed · Bedroom 2: double bed.",
        faqs: schoenblickFaqsEn,
      },
      b8: {
        subtitle: "Spacious holiday apartment for families",
        shortDescription: "A roomy 2-bedroom apartment for up to 4 guests – ideal for families.",
        description:
          "Apartment B8 at Haus Schönblick offers plenty of space for the whole family. Two bedrooms, a fully equipped kitchen and a sunny balcony with sweeping views make B8 the perfect base camp for hikes, day trips and unforgettable moments in the Bavarian Forest. Bedroom 1: king-size bed · Bedroom 2: bunk bed (one bed below, one above).",
        faqs: schoenblickFaqsEn,
      },
      b7: {
        subtitle: "Our most beautiful apartment – herringbone parquet, mountain views & balcony",
        shortDescription:
          "The premium apartment at Haus Schönblick – newly renovated with modern herringbone parquet, a natural stone washbasin, a balcony and dreamy views of the Bavarian Forest.",
        description:
          "Apartment B7 is the newest and most beautiful apartment at Haus Schönblick – and you can tell at first glance. Modern herringbone parquet throughout, a thoughtful layout and high-quality details make B7 a place you won't want to leave.\n\nThe first bedroom features a generous king-size bed set against an elegant dark blue accent wall with a brass lamp – calm, stylish, unforgettable. The second bedroom offers a pull-out single bed that converts into two separate 90 cm beds when needed – ideal for children or guests who like to stay flexible.\n\nThe bathroom impresses with a unique natural stone washbasin on a solid wood countertop, an illuminated mirror, a wooden ceiling and a modern shower. The fully equipped kitchen under the sloping roof is full of charm: a Bosch oven, an induction hob, a sink and a vintage mug shelf on the wall.\n\nIn the living room, a light-coloured sofa in front of a whitewashed brick wall invites you to unwind – with direct access to the balcony and an open view of the Bavarian Forest. This is where holiday mode truly kicks in.\n\nBedroom 1: king-size bed (180×200 cm) · Bedroom 2: pull-out single bed (2× 90×200 cm when needed) · Balcony with forest views · Smart TV · Fully equipped kitchen · Natural stone washbasin",
        faqs: schoenblickFaqsEn,
      },
      a2: {
        subtitle: "Cosy apartment with peaceful garden views",
        shortDescription: "A cosy apartment for families of up to 4, with peaceful garden and forest views.",
        description:
          "Apartment A2 is the cosiest hideaway at Haus Schönblick – with 2 bedrooms and 55 m², it's ideal for families of up to 4 in search of real peace and quiet. The tranquil setting with garden and forest views, the warm interior and hiking trails right on the doorstep make for a relaxing holiday far from the everyday. Bedroom 1: 2 single beds · Bedroom 2: bunk bed (one bed below, one above).",
        faqs: schoenblickFaqsEn,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Localization
// ---------------------------------------------------------------------------

type Localizable = PropertyData | ApartmentData;

/** Find the overlay for a property or apartment id (apartment ids are unique). */
function overlayFor(id: string): TextOverlay | undefined {
  const top = propertyOverlaysEn[id];
  if (top) return top;
  for (const overlay of Object.values(propertyOverlaysEn)) {
    const apartment = overlay.apartments?.[id];
    if (apartment) return apartment;
  }
  return undefined;
}

function applyOverlay<T extends Localizable>(entity: T, overlay: TextOverlay | undefined): T {
  const copy: Localizable = structuredClone(entity);

  if (overlay?.subtitle !== undefined) copy.subtitle = overlay.subtitle;
  if (overlay?.shortDescription !== undefined) copy.shortDescription = overlay.shortDescription;
  if (overlay?.description !== undefined) copy.description = overlay.description;

  copy.amenities = copy.amenities.map((amenity) => ({
    ...amenity,
    label: amenityLabelEn[amenity.label] ?? amenity.label,
  }));

  copy.images.gallery = copy.images.gallery.map((image) => ({
    ...image,
    alt: galleryAltEn[image.alt] ?? image.alt,
  }));

  copy.faqs = copy.faqs.map((faq) => {
    const translated = overlay?.faqs?.find((t) => t.de === faq.question);
    return translated ? { question: translated.question, answer: translated.answer } : faq;
  });

  if ("bedroomImages" in copy && copy.bedroomImages) {
    copy.bedroomImages = copy.bedroomImages.map((bedroom) => ({
      ...bedroom,
      name: bedroomNameEn[bedroom.name] ?? bedroom.name,
      bed: bedLabelEn[bedroom.bed] ?? bedroom.bed,
    }));
  }

  if ("apartments" in copy && copy.apartments) {
    for (const [key, apartment] of Object.entries(copy.apartments)) {
      copy.apartments[key] = applyOverlay(apartment, overlay?.apartments?.[key]);
    }
  }

  return copy as T;
}

/**
 * Returns the property (or single apartment) in the requested locale.
 *
 * - `"de"` returns the original object unchanged (same reference).
 * - `"en"` returns a deep copy with English guest-facing texts merged in;
 *   any field without a translation keeps its German original.
 */
export function localizeProperty<T extends PropertyData | ApartmentData>(property: T, locale: Locale): T {
  if (locale !== "en") return property;
  return applyOverlay(property, overlayFor(property.id));
}
