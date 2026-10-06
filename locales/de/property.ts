// Objektseiten (HAUS28, Haus Schönblick, Apartments): UI-Texte der Property-Komponenten.
// Daten-Texte (Beschreibungen, FAQs, Amenities, alt-Texte) kommen aus data/properties.i18n.ts.

import { PET_FEE_PER_NIGHT, ca, driveMinutes as m } from "@/data/surroundings";

// Umgebung von Haus Schönblick – gleiche Liste auf der Haus- und den Apartmentseiten.
const schoenblickAttractions = [
  { name: "Wanderweg ab Haustür", distance: "0 m" },
  { name: "Skilift Steinberg", distance: "~600 m" },
  { name: "Grafenau Zentrum", distance: ca(m.grafenau.schoenblick) },
  { name: "Pullman City (Westernstadt)", distance: ca(m.pullmanCity.schoenblick) },
  { name: "Nationalpark & Baumwipfelpfad (Neuschönau)", distance: ca(m.nationalparkLusen.schoenblick) },
  { name: "Erlebnisbad elypso Deggendorf", distance: ca(m.elypso.schoenblick) },
  { name: "Skigebiet Arber", distance: ca(m.arber.schoenblick) },
];

const property = {
  // components/property/PropertyHero.tsx
  hero: {
    breadcrumbHome: "Startseite",
    reviewsOnAirbnbPost: " Bewertungen auf Airbnb",
    guestFavoriteBadge: "🏅 Gäste-Favorit",
    pricePre: "ab",
    priceUnit: "/ Nacht",
    bookNow: "Jetzt buchen",
    allPhotosAria: "Alle Fotos anzeigen",
    allPhotosPre: "Alle ",
    allPhotosPost: " Fotos",
  },
  // components/property/QuickFacts.tsx
  quickFacts: {
    regionAria: "Eckdaten",
    guests: "Gäste",
    guestsUpToPre: "bis zu ",
    bedrooms: "Schlafzimmer",
    bathrooms: "Badezimmer",
    area: "Fläche",
    rating: "Bewertung",
    address: "Adresse",
  },
  // components/property/FaqAccordion.tsx
  faq: {
    heading: "Häufige Fragen",
  },
  // components/property/PropertyDescription.tsx
  description: {
    aboutPre: "Über ",
    aboutFallback: "Über diese Unterkunft",
    readMore: "Weiterlesen",
    showLess: "Weniger anzeigen",
  },
  // components/property/LocationMap.tsx
  location: {
    heading: "Lage & Umgebung",
    surroundings: "Die Umgebung",
    nearby: "In der Nähe",
    gps: "GPS-Koordinaten",
    openInGoogleMaps: "Auf Google Maps ansehen",
    mapTitlePre: "Karte: ",
    mapAriaPre: "OpenStreetMap Karte für ",
    defaultAttractions: [
      { name: "Nationalparkzentrum Lusen", distance: "~40–45 min" },
      { name: "Deggendorf (Einkaufen)", distance: ca(m.deggendorf.haus28) },
      { name: "Erlebnisbad elypso Deggendorf", distance: ca(m.elypso.haus28) },
      { name: "Glasmuseum Frauenau", distance: "~35–40 min" },
    ],
  },
  // components/property/AmenitiesGrid.tsx
  amenitiesGrid: {
    heading: "Ausstattung",
  },
  // components/property/ImageGallery.tsx
  imageGallery: {
    heading: "Fotos",
    enlarge: "Vergrößern",
    enlargeAriaPost: " – Vergrößern",
    morePhotos: "weitere Fotos",
    allPhotosAria: "Alle Fotos anzeigen",
    showAllPre: "Alle ",
    showAllPost: " Fotos anzeigen",
  },
  // components/property/RatingsBar.tsx
  ratingsBar: {
    regionAria: "Bewertungen auf allen Plattformen",
    reviewSingular: "Bewertung",
    reviewPlural: "Bewertungen",
    platformRatings: "Plattform-Bewertungen",
    reviewsPost: " Bewertungen",
    allTopRated: "Überall 5★ / 10/10",
  },
  // components/property/PropertyReviews.tsx
  reviews: {
    heading: "Gästebewertungen",
    // Die Bewertungs-Sektion zeigt immer die Airbnb-Werte
    reviewsOnAirbnbPost: " Bewertungen auf Airbnb",
    prevAria: "Vorherige Bewertungen",
    nextAria: "Nächste Bewertungen",
    allOnAirbnb: "Alle auf Airbnb",
    swipeHint: "Wische für mehr Bewertungen →",
    showMore: "Mehr anzeigen",
    showLess: "Weniger anzeigen",
  },
  // components/property/RelatedProperties.tsx
  related: {
    defaultTitle: "Weitere Unterkünfte",
    fromPre: "ab ",
    perNight: " / Nacht",
    book: "Buchen",
  },
  // components/property/SmoobuBookingWidget.tsx
  smoobu: {
    eyebrow: "Direkt buchen & sparen",
    bookPre: "",
    bookPost: " buchen",
    bookNow: "Jetzt buchen",
    notConfigured: "Smoobu Property-ID noch nicht konfiguriert.",
    bookOnSmoobu: "Direkt auf Smoobu buchen →",
    trustLine: "Sichere Direktbuchung · Keine Plattformgebühren · Persönliche Betreuung",
  },
  // Gemeinsame Strings der Airbnb-Style-Detailseiten (Haus28ClientPage + ApartmentPage)
  listing: {
    enlargePhotoAria: "Foto vergrößern",
    allPhotosPre: "Alle ",
    allPhotosPost: " Fotos",
    photosPost: " Fotos",
    guestsWord: "Gäste",
    bedroomsWord: "Schlafzimmer",
    bedsWord: "Betten",
    bathroomWord: "Badezimmer",
    bathroomsWord: "Badezimmer",
    reviewsPost: " Bewertungen",
    hostLine: "Gastgeber: Vincent & Elena",
    superhost: "Superhost",
    checkInFrom: "Check-in ab 16:00",
    checkOutBy: "Check-out bis 10:00",
    showMore: "Mehr anzeigen",
    showLess: "Weniger anzeigen",
    whereYouSleep: "Wo du schlafen wirst",
    showAllAmenitiesPre: "Alle ",
    showAllAmenitiesPost: " Ausstattungsmerkmale anzeigen",
    selectDatesForPrices: "Zeitraum wählen, um Preise anzuzeigen",
    checkAvailability: "Verfügbarkeit prüfen",
    closeAria: "Schließen",
    galleryClose: "Schließen",
    galleryCloseAria: "Galerie schließen",
    enlargeItemAriaPost: " – vergrößern",
    whatToKnow: "Was du wissen solltest",
    houseRules: "Hausregeln",
    ruleCheckIn: "Check-in ab 16:00 Uhr",
    ruleMaxGuestsPre: "Höchstens ",
    ruleMaxGuestsPost: " Gäste",
    ruleNoSmoking: "Nicht rauchen",
    decimal: ",",
  },
  // components/property/Haus28ClientPage.tsx
  haus28: {
    // Zweite H1-Zeile – bewusst identisch zum <title>, damit Google Titel & H1 als dieselbe Seite liest.
    hotTubPost: "Neu am HAUS28: der Premium-HotTub – alle Details im Blog",
    h1Suffix: "– A-Frame mit Whirlpool im Bayerischen Wald",
    typePre: "A-Frame Ferienhaus · ",
    guestFavorite: "Gäste-Favorit",
    bedroomsList: [
      { name: "Schlafzimmer 1", bed: "1 Kingsize-Doppelbett" },
      { name: "Schlafzimmer 2", bed: "1 Kingsize-Doppelbett" },
      { name: "Schlafzimmer 3", bed: "1 Kingsize-Doppelbett" },
      { name: "Schlafzimmer 4", bed: "1 Queensize-Doppelbett" },
    ],
    highlights: [
      {
        title: "Gäste-Favorit – oberste 5 % auf Airbnb",
        text: "Aufgrund der Bewertungen und Zuverlässigkeit zählt HAUS28 zu den am besten bewerteten Unterkünften.",
      },
      {
        title: "Schöne Lage – mitten im Bayerischen Wald",
        text: `Die Wanderung auf den Büchelstein-Gipfel startet direkt an der Haustür. Pullman City erreichst du in rund ${m.pullmanCity.haus28} Minuten.`,
      },
      {
        title: "Eigenständiger Check-in per Schlüsselbox",
        text: "Flexible Anreise – checke jederzeit ab 16:00 Uhr bequem per Schlüsselbox ein.",
      },
      {
        title: "Direktbuchung – bis zu 20 % günstiger",
        text: "Buche direkt bei uns und spare gegenüber den gängigen Buchungsportalen.",
      },
    ],
    amenitiesHeading: "Das bietet dir diese Unterkunft",
    locationDescription:
      `HAUS28 liegt am Büchelstein bei Grattersdorf, idyllisch am Rand des Bayerischen Waldes. Die Wanderung auf den Büchelstein-Gipfel startet direkt an der Haustür. Die Westernstadt Pullman City erreichst du in rund ${m.pullmanCity.haus28} Minuten – perfekt für Familien. Zum Einkaufen sind es nach Hengersberg rund ${m.hengersberg.haus28}, nach Deggendorf mit Geschäften und Restaurants rund ${m.deggendorf.haus28} Minuten.`,
    attractions: [
      { name: "Büchelstein-Gipfel (Wanderung)", distance: "~30 min zu Fuß" },
      { name: "Hengersberg (Einkaufen)", distance: ca(m.hengersberg.haus28) },
      { name: "Pullman City (Westernstadt)", distance: ca(m.pullmanCity.haus28) },
      { name: "Deggendorf Zentrum", distance: ca(m.deggendorf.haus28) },
      { name: "Nationalpark & Baumwipfelpfad (Neuschönau)", distance: ca(m.nationalparkLusen.haus28) },
      { name: "Erlebnisbad elypso Deggendorf", distance: ca(m.elypso.haus28) },
      { name: "Arber (Skigebiet)", distance: ca(m.arber.haus28) },
    ],
    excursions: {
      eyebrow: "Direkt ab HAUS28",
      heading: "Wanderung zum Büchelstein & weitere Ausflüge",
      text: "Die Büchelstein-Rundwanderung startet direkt an der Haustür und führt auf den Gipfel (831 m) und zur historischen Wallfahrtskapelle Rastbuche (18. Jh.). Alle Ausflugstipps für die Region auf einen Blick.",
      cta: "Alle Ausflugsziele",
    },
    awards: {
      heading: "Auszeichnungen",
      guestFavorite: "Gäste-Favorit",
      top5: "Oberste 5 % der Inserate auf Airbnb",
    },
    hostProfile: {
      heading: "Lerne deine:n Gastgeber:in kennen",
      statReviews: "Bewertungen",
      statRating: "Sternebewertung",
      statYears: (n: number): string => (n === 1 ? "Jahr Gastgeber" : "Jahre Gastgeber"),
      bio: "Wir sind Vincent und Elena – mit unseren zwei Kindern leben wir mitten in der Natur und lieben es, Gäste willkommen zu heißen. Unsere Ferienhäuser haben wir mit viel Herz und Handarbeit gestaltet – mal modern im A-Frame, mal gemütlich direkt am Skilift. Wir teilen gern unsere liebsten Tipps für Wanderungen, Skitage oder Ausflüge und sind jederzeit für dich da, wenn du etwas brauchst.",
      superhostTitle: "Superhost",
      superhostText:
        "Superhosts sind erfahrene, herausragend bewertete Gastgeber:innen, die ihren Gästen großartige Aufenthalte bieten.",
      responseRateLabel: "Antwortrate:",
      responseRateValue: " 100 %",
      respondsWithin: "Antwortet innerhalb einer Stunde",
      messageHost: "Nachricht an Gastgeber:in",
    },
    ruleCheckOut: "Check-out vor 10:00 Uhr",
    ruleNoPets: "Keine Haustiere",
    cancellationTitle: "Stornierungsbedingungen",
    cancellationText:
      "Kostenlose Stornierung bis 30 Tage vor Anreise. Danach gelten unsere Stornobedingungen.",
    cancellationCta: "Bedingungen anzeigen →",
    safetyTitle: "Sicherheit & Unterkunft",
    safetyItems: ["Rauchmelder vorhanden", "Erste-Hilfe-Set vorhanden", "Feuerlöscher vorhanden"],
    relatedTitle: "Auch interessant: Haus Schönblick",
  },
  // components/property/ApartmentPage.tsx
  apartment: {
    h1Suffix: "– Ferienwohnung in Schöfweg, Bayerischer Wald",
    newBadge: "Neu",
    typePre: "Apartment · ",
    typeMid: " m² · ",
    highlights: [
      {
        title: "Ganzes Apartment für dich",
        text: "Du hast das gesamte Apartment für dich allein.",
      },
      {
        title: "Traumhafte Lage im Bayerischen Wald",
        text: "Wanderwege beginnen direkt vor der Haustür. Mitten in der Natur, direkt am Skilift Steinberg.",
      },
      {
        title: "Direktbuchung – bis zu 20 % günstiger",
        text: "Buche direkt bei uns und spare gegenüber den gängigen Buchungsportalen.",
      },
    ],
    aboutHeading: "Über diese Unterkunft",
    amenitiesHeading: "Was diese Unterkunft bietet",
    locationDescription:
      `Haus Schönblick liegt in Langfurth bei Schöfweg, direkt am Skilift Steinberg im Bayerischen Wald. Wanderwege starten direkt vor dem Haus, zwei Gasthäuser erreichst du in wenigen Minuten. Nach Grafenau sind es rund ${m.grafenau.schoenblick}, zum Nationalpark rund ${m.nationalparkLusen.schoenblick} Minuten.`,
    attractions: schoenblickAttractions,
    rulePets: `Hunde auf Anfrage (${PET_FEE_PER_NIGHT} € pro Nacht)`,
    cancellationTitle: "Stornierung & Zugang",
    cancellationTextPre: "Kostenlose Stornierung bis 30 Tage vor Anreise. Danach gelten unsere ",
    cancellationLink: "Stornobedingungen",
    cancellationTextPost: ".",
    accessibilityPre: "Barrierefreiheit: Bitte ",
    accessibilityLink: "sprich uns vor der Buchung an",
    accessibilityPost: " – wir informieren dich gern zu Zugang und Ausstattung.",
    safetyTitle: "Sicherheit",
    safetySmokeDetector: "Rauchmelder vorhanden",
    relatedTitle: "Weitere Apartments im Haus Schönblick",
  },
  // app/(de|en)/…/schoenblick/page.tsx (Haus-Übersichtsseite)
  schoenblickPage: {
    aboutHeading: "Über Haus Schönblick",
    aboutLocation:
      `Haus Schönblick liegt im Ortsteil Langfurth bei Schöfweg, direkt am Skilift Steinberg. Die fünf Ferienwohnungen verteilen sich auf die Hausnummern 18 und 20: B5 und B6 im Erdgeschoss mit Terrasse, B7 und B8 im ersten Stock mit Panoramabalkon, dazu die Hüttenwohnung A2 in Hausnummer 20. Alle Gäste teilen sich eine große Panoramaterrasse mit Sitzplätzen und einen kleinen Garten; geparkt wird kostenlos direkt vor dem Gebäude. Bis zur Westernstadt Pullman City sind es rund ${m.pullmanCity.schoenblick} Minuten mit dem Auto.`,
    apartmentsEyebrow: "5 Ferienwohnungen",
    apartmentsHeading: "Wähle dein Apartment",
    apartmentsIntro:
      "Alle fünf Apartments befinden sich im selben Haus – perfekt für Gruppen, die mehrere Wohnungen gleichzeitig buchen möchten.",
    newBadge: "Neu",
    guestsPost: " Gäste",
    bedroomsAbbrPost: " SZ",
    fromPre: "ab ",
    perNight: " / Nacht",
    details: "Details",
    book: "Buchen",
    groupStrong: "Für Gruppen:",
    groupText:
      " Mehrere Apartments für bis zu 20 Personen direkt online buchen – ein Zeitraum, eine Zahlung. Ideal für Familienfeiern, Geburtstage oder Firmenausflüge.",
    groupCta: "Gruppenbuchung starten →",
    compareHeading: "Die Apartments im Vergleich",
    compareCols: {
      apartment: "Apartment",
      size: "Größe",
      location: "Lage & Außenbereich",
      bedrooms: "Schlafzimmer",
      beds: "Betten",
      guests: "Gäste",
      price: "Preis ab",
    },
    locationDescription:
      `Haus Schönblick liegt im Ortsteil Langfurth bei Schöfweg, mitten im Bayerischen Wald. Wanderwege beginnen direkt vor der Haustür. Die Westernstadt Pullman City erreichst du in rund ${m.pullmanCity.schoenblick} Minuten – ideal für Familien mit Kindern. Die Region bietet Natur pur, klare Luft und echte Erholung zu jeder Jahreszeit.`,
    attractions: schoenblickAttractions,
    relatedTitle: "Auch interessant",
    relatedHaus28Subtitle: "Modernes A-Frame im Wald",
  },
};

export default property;
