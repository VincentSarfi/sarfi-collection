// Objektseiten (HAUS28, Haus Schönblick, Apartments): UI-Texte der Property-Komponenten.
// Daten-Texte (Beschreibungen, FAQs, Amenities, alt-Texte) kommen aus data/properties.i18n.ts.
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
    mapTitlePre: "Karte: ",
    mapAriaPre: "OpenStreetMap Karte für ",
    defaultAttractions: [
      { name: "Nationalpark Bayerischer Wald", distance: "~20 km" },
      { name: "Deggendorf (Einkaufen)", distance: "~20 min" },
      { name: "Thermalbad Regen", distance: "~30 min" },
      { name: "Glasmuseum Frauenau", distance: "~25 min" },
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
    reviewsPost: " Bewertungen",
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
        text: "Wanderwege zum Büchelstein-Gipfel starten direkt vor der Haustür. Pullman City und Nationalpark in 20–25 Minuten.",
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
      "HAUS28 liegt am Büchelstein bei Grattersdorf, idyllisch am Rand des Bayerischen Waldes. Wanderwege zum Büchelstein-Gipfel starten direkt vor der Haustür. Die Westernstadt Pullman City ist in nur 20 Minuten erreichbar – perfekt für Familien. Deggendorf mit Einkaufsmöglichkeiten und Restaurants liegt ebenfalls ca. 20 Minuten entfernt.",
    attractions: [
      { name: "Büchelstein-Gipfel (Wanderung)", distance: "~15 min zu Fuß" },
      { name: "Pullman City (Westernstadt)", distance: "~20 min" },
      { name: "Nationalpark Bayerischer Wald", distance: "~25 km" },
      { name: "Deggendorf Zentrum", distance: "~20 min" },
      { name: "Thermalbad Regen", distance: "~35 min" },
      { name: "Arber (Skigebiet)", distance: "~50 min" },
    ],
    excursions: {
      eyebrow: "Direkt ab HAUS28",
      heading: "Wanderung zum Büchelstein & weitere Ausflüge",
      text: "Die Büchelstein-Rundwanderung startet direkt vor der Haustür – über die historische Wallfahrtskapelle Rastbuche (18. Jh.) auf 831 m Höhe. Alle Ausflugstipps für die Region auf einen Blick.",
      cta: "Alle Ausflugsziele",
    },
    awards: {
      heading: "Auszeichnungen",
      airbnbScore: "5,0",
      guestFavorite: "Gäste-Favorit",
      top5: "Oberste 5 % der Inserate auf Airbnb",
      bookingScore: "9,9/10",
    },
    hostProfile: {
      heading: "Lerne deine:n Gastgeber:in kennen",
      statReviews: "Bewertungen",
      statRating: "Sternebewertung",
      statYears: "Jahr Gastgeber",
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
        text: "Wanderwege beginnen direkt vor der Haustür. Mitten in der Natur, nah an Grafenau.",
      },
      {
        title: "Direktbuchung – bis zu 20 % günstiger",
        text: "Buche direkt bei uns und spare gegenüber den gängigen Buchungsportalen.",
      },
    ],
    aboutHeading: "Über diese Unterkunft",
    amenitiesHeading: "Was diese Unterkunft bietet",
    locationDescription:
      "Schöfweg liegt im Herzen des Bayerischen Waldes. Wanderwege starten direkt vor dem Haus. Einkaufsmöglichkeiten und Sehenswürdigkeiten sind in wenigen Minuten erreichbar.",
    attractions: [
      { name: "Wanderweg ab Haustür", distance: "0 m" },
      { name: "Grafenau Zentrum", distance: "~15 min" },
      { name: "Pullman City", distance: "~15 min" },
      { name: "Nationalpark Bayerischer Wald", distance: "~20 km" },
      { name: "Baumwipfelpfad Neuschönau", distance: "~25 min" },
      { name: "Thermalbad Regen", distance: "~30 min" },
      { name: "Skigebiet Arber", distance: "~45 min" },
    ],
    rulePets: "Haustiere nach Absprache",
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
      " Mehrere Apartments gleichzeitig buchen und den ganzen Hausbereich genießen – ideal für Familienfeiern, Geburtstage oder Firmenausflüge.",
    groupCta: "Anfrage stellen →",
    locationDescription:
      "Haus Schönblick liegt im Ortsteil Langfurth bei Schöfweg, mitten im Bayerischen Wald. Wanderwege beginnen direkt vor der Haustür. Die beliebte Westernstadt Pullman City ist nur 15 Minuten entfernt – ideal für Familien mit Kindern. Die Region bietet Natur pur, klare Luft und echte Erholung zu jeder Jahreszeit.",
    attractions: [
      { name: "Wanderweg ab Haustür", distance: "0 m" },
      { name: "Pullman City (Westernstadt)", distance: "~15 min" },
      { name: "Grafenau Zentrum", distance: "~15 min" },
      { name: "Nationalpark Bayerischer Wald", distance: "~20 km" },
      { name: "Baumwipfelpfad Neuschönau", distance: "~25 min" },
      { name: "Thermalbad Regen", distance: "~30 min" },
      { name: "Skigebiet Arber", distance: "~45 min" },
    ],
    relatedTitle: "Auch interessant",
    relatedHaus28Subtitle: "Modernes A-Frame im Wald",
  },
};

export default property;
