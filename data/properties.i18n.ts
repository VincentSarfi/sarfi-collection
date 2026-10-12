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
import { arrival, driveMinutes as m, PET_FEE_PER_NIGHT, PET_MAX, restaurantsAnswer } from "./surroundings";
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
  location?: string;
  outdoor?: string;
  style?: string;
  shortDescription?: string;
  description?: string;
  faqs?: FaqTranslation[];
  apartments?: Record<string, TextOverlay>;
};

// ---------------------------------------------------------------------------
// Global lookup maps (German source string → English)
// ---------------------------------------------------------------------------

const amenityLabelEn: Record<string, string> = {
  "Privater Outdoor-Whirlpool": "Private outdoor hot tub",
  WLAN: "Wi-Fi",
  "Voll ausgestattete Küche": "Fully equipped kitchen",
  "Kostenloser Parkplatz": "Free parking",
  Klimaanlage: "Air conditioning",
  Feuerschale: "Fire pit",
  "Große Terrasse": "Large terrace",
  "2 Balkone": "2 balconies",
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
  "HAUS28 – Privater Outdoor-Whirlpool im Garten am Waldrand":
    "HAUS28 – Private outdoor hot tub in the garden at the forest's edge",
  "HAUS28 – Wohnbereich mit Panoramafenster zum Wald": "HAUS28 – Living area with panoramic window facing the forest",
  "HAUS28 – Offene Wohn- und Küchenfläche": "HAUS28 – Open-plan living and kitchen area",
  "HAUS28 – Außenansicht durch den Wald": "HAUS28 – Exterior view through the forest",
  "HAUS28 – Terrasse von oben": "HAUS28 – Terrace seen from above",
  "HAUS28 – Eingang Hausfront": "HAUS28 – Entrance and house front",
  "HAUS28 – Privater HotTub mit Holzofen im Garten": "HAUS28 – Private wood-fired hot tub in the garden",
  "HAUS28 – Schlafzimmer 3 im Obergeschoss mit Dreiecksfenster": "HAUS28 – Bedroom 3 upstairs with triangular window",
  "HAUS28 – Küche mit grünen Schränken": "HAUS28 – Kitchen with green cabinets",
  "HAUS28 – Wohn- und Essbereich unter dem Giebelfenster": "HAUS28 – Living and dining area beneath the gable window",
  "HAUS28 – Whirlpool mit Blick auf das A-Frame": "HAUS28 – Hot tub with a view of the A-frame",
  "HAUS28 – Gartenseite mit Terrasse und Balkon": "HAUS28 – Garden side with terrace and balcony",
  "HAUS28 – Schlafzimmer 1 im Erdgeschoss": "HAUS28 – Bedroom 1 on the ground floor",
  "HAUS28 – Schlafzimmer 2 mit Terrassenzugang": "HAUS28 – Bedroom 2 with terrace access",
  "HAUS28 – Schlafzimmer 4 im Obergeschoss": "HAUS28 – Bedroom 4 upstairs",
  "HAUS28 – Badezimmer mit blauen Fliesen": "HAUS28 – Bathroom with blue tiles",
  "HAUS28 – Zweites Bad mit Dusche": "HAUS28 – Second bathroom with shower",
  "HAUS28 – Esstisch am Panoramafenster": "HAUS28 – Dining table by the panoramic window",
  "HAUS28 – Leseecke am Dreiecksfenster": "HAUS28 – Reading corner by the triangular window",
  "HAUS28 – Gedeckter Tisch auf der Terrasse": "HAUS28 – Table set on the terrace",
  "HAUS28 – Feuerschale im Garten": "HAUS28 – Fire bowl in the garden",
  "HAUS28 – Grundstück von oben": "HAUS28 – The property from above",
  "HAUS28 – Eingangsbereich mit Treppe": "HAUS28 – Entrance area with staircase",
  "HAUS28 – Kaffeestation in der Küche": "HAUS28 – Coffee station in the kitchen",
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
  "Apartment B5 – Küche": "Apartment B5 – Kitchen",
  "Apartment B5 – Badezimmer mit Dusche": "Apartment B5 – Bathroom with shower",
  "Apartment B5 – Couchtisch mit Deko": "Apartment B5 – Coffee table with decor",
  "Apartment B5 – Dekoration": "Apartment B5 – Decor",
  "Apartment B5 – Eingang mit Sitzplatz": "Apartment B5 – Entrance with seating",
  "Apartment B5 – Essbereich mit Sideboard": "Apartment B5 – Dining area with sideboard",
  "Apartment B5 – Flur vom Eingang aus": "Apartment B5 – Hallway seen from the entrance",
  "Apartment B5 – Kaffeemaschine": "Apartment B5 – Coffee maker",
  "Apartment B5 – Kinderzimmer mit Etagenbett": "Apartment B5 – Children's room with bunk bed",
  "Apartment B5 – Küchenzeile mit Spüle": "Apartment B5 – Kitchenette with sink",
  "Apartment B5 – Schlafzimmer mit Doppelbett": "Apartment B5 – Bedroom with double bed",
  "Apartment B5 – Schlafzimmer mit Fenster": "Apartment B5 – Bedroom with window",
  "Apartment B5 – Sideboard mit Deko": "Apartment B5 – Sideboard with decor",
  "Apartment B5 – Sofa mit Kissen": "Apartment B5 – Sofa with cushions",
  "Apartment B5 – TV-Ecke mit Terrassentür": "Apartment B5 – TV corner with terrace door",
  "Apartment B5 – Terrasse mit Sitzgruppe": "Apartment B5 – Terrace with seating",
  "Apartment B5 – Wohn- und Essbereich mit Terrassentür": "Apartment B5 – Living and dining area with terrace door",
  "Apartment B5 – Wohnbereich mit Blick zum Flur": "Apartment B5 – Living area looking towards the hallway",
  "Apartment B5 – Wohnzimmer mit Backsteinwand und Essbereich":
    "Apartment B5 – Living room with brick wall and dining area",
  // Apartment B6
  "Apartment B6 – Wohnbereich": "Apartment B6 – Living area",
  "Apartment B6 – Wohnzimmer mit grünem Sofa": "Apartment B6 – Living room with green sofa",
  "Apartment B6 – Samtsofa vor Backsteinwand": "Apartment B6 – Velvet sofa against a brick wall",
  "Apartment B6 – Wohnbereich mit Esstisch und Sofa": "Apartment B6 – Living area with dining table and sofa",
  "Apartment B6 – Essbereich mit Backsteinwand": "Apartment B6 – Dining area with brick wall",
  "Apartment B6 – Schlafzimmer 1 Doppelbett": "Apartment B6 – Bedroom 1 with double bed",
  "Apartment B6 – Schlafzimmer 2": "Apartment B6 – Bedroom 2",
  "Apartment B6 – Schlafzimmer 2 Übersicht": "Apartment B6 – Bedroom 2 overview",
  "Apartment B6 – Badezimmer": "Apartment B6 – Bathroom",
  "Apartment B6 – Badezimmer Detail": "Apartment B6 – Bathroom detail",
  "Apartment B6 – Terrasse": "Apartment B6 – Terrace",
  "Apartment B6 – Wohnzimmer Sonnenlicht": "Apartment B6 – Living room in sunlight",
  "Apartment B6 – Eingang": "Apartment B6 – Entrance",
  "Apartment B6 – Ausblick Bayerischer Wald": "Apartment B6 – View of the Bavarian Forest",
  "Apartment B6 – Herbstdekoration": "Apartment B6 – Autumn decor",
  "Apartment B6 – Küche": "Apartment B6 – Kitchen",
  "Apartment B6 – Küche Detail": "Apartment B6 – Kitchen detail",
  // Apartment B8
  "Apartment B8 – Wohnbereich": "Apartment B8 – Living area",
  "Apartment B8 – Schlafzimmer": "Apartment B8 – Bedroom",
  "Apartment B8 – Panoramablick vom Balkon": "Apartment B8 – Panoramic view from the balcony",
  "Apartment B8 – Essbereich": "Apartment B8 – Dining area",
  "Apartment B8 – Badezimmer mit Dusche": "Apartment B8 – Bathroom with shower",
  "Apartment B8 – Eingangsflur": "Apartment B8 – Entrance hallway",
  "Apartment B8 – Gemälde an der Holzwand": "Apartment B8 – Painting on the wooden wall",
  "Apartment B8 – Handtücher": "Apartment B8 – Towels",
  "Apartment B8 – Kinderzimmer mit Etagenbett": "Apartment B8 – Children's room with bunk bed",
  "Apartment B8 – Küche mit Dachschräge": "Apartment B8 – Kitchen under the sloping roof",
  "Apartment B8 – Schlafzimmer mit Doppelbett": "Apartment B8 – Bedroom with double bed",
  "Apartment B8 – Schlafzimmer mit Fenster": "Apartment B8 – Bedroom with window",
  "Apartment B8 – Wohn- und Essbereich": "Apartment B8 – Living and dining area",
  "Apartment B8 – Wohnbereich mit TV und Balkontür": "Apartment B8 – Living area with TV and balcony door",
  "Apartment B8 – Wohnzimmer mit blauem Sofa und Balkon": "Apartment B8 – Living room with blue sofa and balcony",
  // Apartment B7
  "Apartment B7 – Badezimmer mit Naturstein-Waschbecken & Holzdecke":
    "Apartment B7 – Bathroom with natural stone washbasin & wooden ceiling",
  "Apartment B7 – Wohnzimmer mit Balkon & Bergblick": "Apartment B7 – Living room with balcony & mountain views",
  "Apartment B7 – Sofabereich mit Backsteinwand": "Apartment B7 – Sofa area with brick wall",
  "Apartment B7 – Wohnzimmer mit TV & Zimmerzugang": "Apartment B7 – Living room with TV & access to the bedrooms",
  "Apartment B7 – Schlafzimmer 1 mit Kingsize-Bett": "Apartment B7 – Bedroom 1 with king-size bed",
  "Apartment B7 – Schlafzimmer 1 Messinglampe Detail": "Apartment B7 – Bedroom 1 brass lamp detail",
  "Apartment B7 – Schlafzimmer 2 Gesamtansicht mit Wandlampen": "Apartment B7 – Bedroom 2 full view with wall lamps",
  "Apartment B7 – Schlafzimmer 2 mit Waldblick": "Apartment B7 – Bedroom 2 with forest view",
  "Apartment B7 – Naturstein-Waschbecken Detail": "Apartment B7 – Natural stone washbasin detail",
  "Apartment B7 – Küche Nahaufnahme": "Apartment B7 – Kitchen close-up",
  "Apartment B7 – Panoramablick auf den Bayerischen Wald": "Apartment B7 – Panoramic view of the Bavarian Forest",
  "Apartment B7 – Blick auf den Bayerischen Wald": "Apartment B7 – View of the Bavarian Forest",
  "Apartment B7 – Flur mit Zimmerzugang": "Apartment B7 – Hallway with room access",
  // Apartment A2
  "Apartment A2 – Wohnbereich": "Apartment A2 – Living area",
  "Apartment A2 – Schlafzimmer mit Stockbett & Wandschrank": "Apartment A2 – Bedroom with bunk bed & built-in wardrobe",
  "Apartment A2 – Schlafzimmer mit Einzelbetten": "Apartment A2 – Bedroom with single beds",
  "Apartment A2 – Küche": "Apartment A2 – Kitchen",
  "Apartment A2 – Wohnzimmer mit Panoramablick": "Apartment A2 – Living room with panoramic view",
  "Apartment A2 – Ausblick vom Balkon": "Apartment A2 – View from the balcony",
  "Apartment A2 – Badezimmer mit Dusche": "Apartment A2 – Bathroom with shower",
  "Apartment A2 – Bemalte Kommode": "Apartment A2 – Painted chest of drawers",
  "Apartment A2 – Eingang": "Apartment A2 – Entrance",
  "Apartment A2 – Essecke mit Eckbank und Balkontür": "Apartment A2 – Dining nook with corner bench and balcony door",
  "Apartment A2 – Flur": "Apartment A2 – Hallway",
  "Apartment A2 – Gedicht von Peter Rosegger": "Apartment A2 – Poem by Peter Rosegger",
  "Apartment A2 – Herbstdeko": "Apartment A2 – Autumn decor",
  "Apartment A2 – Wohnbereich mit TV und Bauernmöbeln":
    "Apartment A2 – Living area with TV and painted farmhouse furniture",
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
      "Yes! With our group booking you can book several apartments for up to 20 guests in one go – one date range, one payment. All details at sarfi-collection.de/en/schoenblick/gruppen.",
  },
  {
    de: "Sind Haustiere erlaubt?",
    question: "Are pets allowed?",
    answer: `Yes, in apartments A2, B7 and B8: you can add up to ${PET_MAX} dogs directly when booking, at a surcharge of €${PET_FEE_PER_NIGHT} per dog per night. B5 and B6 have real-wood parquet floors, so pets are unfortunately not allowed there.`,
  },
  {
    de: "Wie komme ich zum Haus Schönblick?",
    question: "How do I get to Haus Schönblick?",
    answer: arrival.en,
  },
  {
    de: "Wo kann man in der Nähe essen gehen?",
    question: "Where can I eat out nearby?",
    answer: restaurantsAnswer("schoenblick", "en"),
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
    de: "Gibt es Parkplätze?",
    question: "Is there parking?",
    answer: "Yes, there are parking spaces right in front of the building that you can simply use – free of charge.",
  },
  {
    de: "Welche Kosten kommen zum Übernachtungspreis dazu?",
    question: "Are there any costs on top of the nightly rate?",
    answer:
      "Only a one-off final cleaning fee per stay, which is shown directly when you book. There is no tourist tax. You'll see the nightly rate for your dates in the booking calendar.",
  },
  {
    de: "Wie weit ist es zur Pullman City?",
    question: "How far is it to Pullman City?",
    answer:
      `The Pullman City western town in Eging am See is about ${m.pullmanCity.schoenblick} minutes by car from Haus Schönblick in Schöfweg – an ideal day trip for the whole family.`,
  },
  {
    de: "Welche Ausflugsziele gibt es in der Nähe?",
    question: "What is there to see and do nearby?",
    answer:
      `There's plenty waiting for you around Schöfweg in the Bavarian Forest – the Steinberg ski lift is right by the house, plus (driving time): Grafenau (~${m.grafenau.schoenblick} min), Pullman City (~${m.pullmanCity.schoenblick} min), the elypso leisure pool in Deggendorf (~${m.elypso.schoenblick} min), the national park with the treetop walk in Neuschönau (~${m.nationalparkLusen.schoenblick} min) and the Großer Arber ski area (~${m.arber.schoenblick} min).`,
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
      "At the Büchelstein near Grattersdorf, HAUS28 awaits – a modern A-frame holiday home with 157 m² of living space and a private outdoor hot tub in the garden, where architecture and nature blend into an atmosphere all of its own. The striking triangular silhouette, warm wooden interior and floor-to-ceiling panoramic window blur the line between inside and out. Four bedrooms and two bathrooms sleep up to 8 guests. Wake up among the trees in the morning, and end the day in the warm water, around the fire pit or on the spacious terrace. Perfect for families, groups of friends, or anyone who truly wants to switch off.",
    faqs: [
      {
        de: "Wo genau liegt HAUS28 am Büchelstein?",
        question: "Where exactly is HAUS28 at the Büchelstein?",
        answer:
          "HAUS28 is located at Büchelstein 28 near Grattersdorf in the Bavarian Forest – right at the foot of the Büchelstein (831 m), surrounded by forest and nature. The Büchelstein summit with its panoramic views is about a 30-minute walk away.",
      },
      {
        de: "Gibt es einen Whirlpool – und ist er ganzjährig nutzbar?",
        question: "Is there a hot tub – and can it be used all year round?",
        answer:
          "Yes. HAUS28 comes with a private outdoor hot tub in the garden, exclusively yours. It can be used all year round – including in winter with snow all around. It is heated by a wood-burning stove right next to the tub.",
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
        de: "Gibt es einen Parkplatz?",
        question: "Is there parking?",
        answer:
          "Yes, and it's free: two parking spaces are right in front of the house, and there's a large car park about 100 m away for additional vehicles.",
      },
      {
        de: "Welche Kosten kommen zum Übernachtungspreis dazu?",
        question: "Are there any costs on top of the nightly rate?",
        answer:
          "Only a one-off final cleaning fee per stay, which is shown directly when you book. There is no tourist tax. You'll see the nightly rate for your dates in the booking calendar.",
      },
      {
        de: "Sind Haustiere im HAUS28 erlaubt?",
        question: "Are pets allowed at HAUS28?",
        answer:
          "Unfortunately, pets are not allowed at HAUS28. If you'd like to travel with your dog: at Haus Schönblick you can add dogs directly when booking apartments A2, B7 and B8.",
      },
      {
        de: "Wie komme ich zum HAUS28?",
        question: "How do I get to HAUS28?",
        answer: arrival.en,
      },
      {
        de: "Wo kann man in der Nähe essen gehen?",
        question: "Where can I eat out nearby?",
        answer: restaurantsAnswer("haus28", "en"),
      },
      {
        de: "Wie weit ist es vom Büchelstein zum nächsten Ort?",
        question: "How far is it from the Büchelstein to the nearest town?",
        answer:
          `From HAUS28 at the Büchelstein, Grattersdorf is about 5 minutes away by car. For shopping, Hengersberg is about ${m.hengersberg.haus28} minutes and Deggendorf (shops, restaurants) about ${m.deggendorf.haus28} minutes away. The hike up to the Büchelstein summit starts right at the front door.`,
      },
      {
        de: "Wie lange ist der Mindestaufenthalt?",
        question: "Is there a minimum stay?",
        answer:
          "The minimum stay is 2 nights. It may be longer in high season – you'll see the details during booking.",
      },
      {
        de: "Wie weit ist es zur Pullman City?",
        question: "How far is it to Pullman City?",
        answer:
          `The Pullman City western town in Eging am See is about ${m.pullmanCity.haus28} minutes by car from HAUS28 at the Büchelstein – a perfect day trip for families with kids!`,
      },
      {
        de: "Welche Ausflugsziele gibt es im Bayerischen Wald?",
        question: "What is there to see and do in the Bavarian Forest?",
        answer:
          `There's plenty to discover near HAUS28 (driving time): the Steinberg ski lift (~${m.steinberglift.haus28} min), Pullman City (~${m.pullmanCity.haus28} min), the elypso leisure pool in Deggendorf (~${m.elypso.haus28} min), the national park with the treetop walk in Neuschönau (~${m.nationalparkLusen.haus28} min), the Großer Arber ski area (~${m.arber.haus28} min) – and of course the Büchelstein hike straight from the house.`,
      },
    ],
  },
  schoenblick: {
    subtitle: "Panoramic holiday apartments in Schöfweg, Bavarian Forest",
    shortDescription:
      "Five tastefully furnished holiday apartments with panoramic views across the Bavarian Forest – ideal for couples, families and groups.",
    description:
      "Haus Schönblick in Schöfweg brings together five individually furnished holiday apartments under one roof. Every apartment enjoys breathtaking views across the rolling hills of the Bavarian Forest. Whether you're travelling solo, with your family or in a group – you'll find your perfect home away from home here. The peaceful setting, fresh forest air and warm, welcoming atmosphere invite you to truly slow down.",
    faqs: schoenblickFaqsEn,
    apartments: {
      b5: {
        location: "Ground floor",
        outdoor: "Terrace",
        style: "A modern apartment with parquet floors, a red kitchen and its own terrace.",
        subtitle: "Bright apartment with forest views & terrace",
        shortDescription: "A bright, comfortable apartment with forest views and a terrace for up to 4 guests.",
        description:
          "Apartment B5 at Haus Schönblick is your cosy hideaway with direct forest views and a sunny terrace. Lovingly furnished, with a well-equipped kitchen and fresh forest air right outside the door, it turns your stay into a real experience. With 55 m² and 2 bedrooms, it's ideal for families or small groups of up to 4. Bedroom 1: king-size bed · Bedroom 2: bunk bed (one bed below, one above).",
        faqs: schoenblickFaqsEn,
      },
      b6: {
        location: "Ground floor",
        outdoor: "Terrace",
        style: "A modern apartment with parquet floors, terrace access and two double beds.",
        subtitle: "Light-filled apartment with panoramic views",
        shortDescription: "A generous apartment with glorious panoramic views over the hills of the Bavarian Forest.",
        description:
          "Apartment B6 wins you over with its breathtaking panoramic views and light-filled rooms. The modern interior combines comfort with Bavarian charm. Enjoy your mornings on the terrace with fresh forest air and views over the Schöfweg woods. Bedroom 1: king-size bed · Bedroom 2: double bed.",
        faqs: schoenblickFaqsEn,
      },
      b8: {
        location: "First floor",
        outdoor: "Panoramic balcony",
        style: "Wood-panelled walls give B8 a rustic feel, the modern furniture keeps it fresh and cosy – with a panoramic balcony.",
        subtitle: "Spacious holiday apartment for families",
        shortDescription: "A roomy 2-bedroom apartment for up to 4 guests – ideal for families.",
        description:
          "Apartment B8 at Haus Schönblick offers plenty of space for the whole family. Two bedrooms, a fully equipped kitchen and a sunny balcony with sweeping views make B8 the perfect base camp for hikes, day trips and unforgettable moments in the Bavarian Forest. Bedroom 1: king-size bed · Bedroom 2: bunk bed (one bed below, one above).",
        faqs: schoenblickFaqsEn,
      },
      b7: {
        location: "First floor",
        outdoor: "Panoramic balcony",
        style: "Our most modern apartment: herringbone parquet, modern furniture, splashes of colour and a panoramic balcony.",
        subtitle: "Our most beautiful apartment – herringbone parquet, mountain views & balcony",
        shortDescription:
          "Premium apartment at Haus Schönblick: newly renovated, herringbone parquet, natural stone washbasin, balcony and forest views.",
        description:
          "Apartment B7 is the newest and most beautiful apartment at Haus Schönblick – and you can tell at first glance. Modern herringbone parquet throughout, a thoughtful layout and high-quality details make B7 a place you won't want to leave.\n\nThe first bedroom features a generous king-size bed set against an elegant dark blue accent wall with a brass lamp – calm, stylish, unforgettable. The second bedroom offers a pull-out single bed that converts into two separate 90 cm beds when needed – ideal for children or guests who like to stay flexible.\n\nThe bathroom impresses with a unique natural stone washbasin on a solid wood countertop, an illuminated mirror, a wooden ceiling and a modern shower. The fully equipped kitchen under the sloping roof is full of charm: a Bosch oven, an induction hob, a sink and a vintage mug shelf on the wall.\n\nIn the living room, a light-coloured sofa in front of a whitewashed brick wall invites you to unwind – with direct access to the balcony and an open view of the Bavarian Forest. This is where holiday mode truly kicks in.\n\nBedroom 1: king-size bed (180×200 cm) · Bedroom 2: pull-out single bed (2× 90×200 cm when needed) · Balcony with forest views · Smart TV · Fully equipped kitchen · Natural stone washbasin",
        faqs: schoenblickFaqsEn,
      },
      a2: {
        location: "House no. 20",
        outdoor: "Balcony with a view",
        style: "Our cabin-style apartment with old farmhouse furniture, wood-panelled walls and a lovely view from the balcony – the only holiday apartment in house no. 20.",
        subtitle: "Cabin-style apartment with farmhouse furniture & balcony views",
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
  if ("location" in copy) {
    if (overlay?.location !== undefined) copy.location = overlay.location;
    if (overlay?.outdoor !== undefined) copy.outdoor = overlay.outdoor;
    if (overlay?.style !== undefined) copy.style = overlay.style;
  }

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
