// Property pages (HAUS28, Haus Schönblick, apartments): UI copy for the property components.
// Data copy (descriptions, FAQs, amenities, alt texts) comes from data/properties.i18n.ts.

import { PET_FEE_PER_NIGHT, PET_MAX, ca, driveMinutes as m } from "@/data/surroundings";

// Surroundings of Haus Schönblick – same list on the house and the apartment pages.
const schoenblickAttractions = [
  { name: "Hiking trail from the doorstep", distance: "0 m" },
  { name: "Steinberg ski lift", distance: "~600 m" },
  { name: "Grafenau town centre", distance: ca(m.grafenau.schoenblick) },
  { name: "Pullman City (western town)", distance: ca(m.pullmanCity.schoenblick) },
  { name: "National park & treetop walk (Neuschönau)", distance: ca(m.nationalparkLusen.schoenblick) },
  { name: "elypso leisure pool, Deggendorf", distance: ca(m.elypso.schoenblick) },
  { name: "Arber ski area", distance: ca(m.arber.schoenblick) },
];

const property = {
  // components/property/PropertyHero.tsx
  hero: {
    breadcrumbHome: "Home",
    reviewsOnAirbnbPost: " reviews on Airbnb",
    guestFavoriteBadge: "Guest favourite",
    pricePre: "from",
    priceUnit: "/ night",
    bookNow: "Book now",
    allPhotosAria: "Show all photos",
    allPhotosPre: "All ",
    allPhotosPost: " photos",
  },
  // components/property/QuickFacts.tsx
  quickFacts: {
    regionAria: "Key facts",
    guests: "Guests",
    guestsUpToPre: "up to ",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    area: "Size",
    rating: "Rating",
    address: "Address",
  },
  // components/property/FaqAccordion.tsx
  faq: {
    heading: "Frequently asked questions",
  },
  // components/property/PropertyDescription.tsx
  description: {
    aboutPre: "About ",
    aboutFallback: "About this place",
    readMore: "Read more",
    showLess: "Show less",
  },
  // components/property/LocationMap.tsx
  location: {
    heading: "Location & surroundings",
    surroundings: "The area",
    nearby: "Nearby",
    gps: "GPS coordinates",
    openInGoogleMaps: "View on Google Maps",
    // components/property/PlaceMap.tsx
    map: {
      ariaPre: "Map of things to do around ",
      viewRegion: "Things to do",
      viewNearby: "Around the house",
      byCar: "{min} min by car from {house}",
      onFoot: "on foot from {house}",
      labelWalk: "on foot",
      more: "More on the things-to-do page",
      failed: "The map can't be displayed in this browser.",
      places: {
        "pullman-city": "Pullman City",
        lusen: "Treetop Walk & National Park",
        "indoor-golf": "Rusel-Arena indoor golf",
        elypso: "elypso leisure pool",
        joska: "JOSKA glass paradise",
        "skigebiet-sonnenwald": "Steinberglift & Stoaberg Alm",
        "buechelstein-wanderung": "Büchelstein hike",
        museumsdorf: "Bavarian Forest Museum Village",
        "glasmuseum-frauenau": "Frauenau Glass Museum",
        passau: "Passau",
        arber: "Großer Arber",
        brotjacklriegel: "Brotjacklriegel",
      } as Record<string, string>,
      // MapLibre gesture hints and buttons
      ui: {
        "CooperativeGesturesHandler.WindowsHelpText": "Use Ctrl + scroll to zoom the map",
        "CooperativeGesturesHandler.MacHelpText": "Use ⌘ + scroll to zoom the map",
        "CooperativeGesturesHandler.MobileHelpText": "Use two fingers to move the map",
        "NavigationControl.ZoomIn": "Zoom in",
        "NavigationControl.ZoomOut": "Zoom out",
        "AttributionControl.ToggleAttribution": "Toggle attribution",
        "Popup.Close": "Close",
      } as Record<string, string>,
    },
    defaultAttractions: [
      { name: "Lusen National Park Centre", distance: ca(m.nationalparkLusen.haus28) },
      { name: "Deggendorf (shopping)", distance: ca(m.deggendorf.haus28) },
      { name: "elypso leisure pool, Deggendorf", distance: ca(m.elypso.haus28) },
      { name: "Frauenau Glass Museum", distance: ca(m.glasmuseumFrauenau.haus28) },
    ],
  },
  // components/property/AmenitiesGrid.tsx
  amenitiesGrid: {
    heading: "Amenities",
  },
  // components/property/ImageGallery.tsx
  imageGallery: {
    heading: "Photos",
    enlarge: "Enlarge",
    enlargeAriaPost: " – enlarge",
    morePhotos: "more photos",
    allPhotosAria: "Show all photos",
    showAllPre: "Show all ",
    showAllPost: " photos",
  },
  // components/property/RatingsBar.tsx
  ratingsBar: {
    regionAria: "Ratings across all platforms",
    reviewSingular: "review",
    reviewPlural: "reviews",
    platformRatings: "Platform ratings",
    reviewsPost: " reviews",
    allTopRated: "5★ / 10/10 everywhere",
  },
  // components/property/PropertyReviews.tsx
  reviews: {
    heading: "Guest reviews",
    // The reviews section always shows the Airbnb figures
    reviewsOnAirbnbPost: " reviews on Airbnb",
    onBooking: (score: string, n: number) => `${score}/10 from ${n} ${n === 1 ? "review" : "reviews"} on Booking.com`,
    prevAria: "Previous reviews",
    nextAria: "Next reviews",
    allOnAirbnb: "All on Airbnb",
    swipeHint: "Swipe for more reviews →",
    showMore: "Show more",
    showLess: "Show less",
    // Source and authenticity notice (§ 5b(3) UWG, ReviewSourceNote).
    sourceNote: {
      and: "and",
      from: "Reviews from",
      guestsOnlyPre: "On",
      guestsOnlyPost: ", only guests can review after their stay.",
    },
  },
  // components/property/RelatedProperties.tsx
  related: {
    defaultTitle: "More places to stay",
    fromPre: "from ",
    perNight: " / night",
    book: "Book",
  },
  // components/property/SmoobuBookingWidget.tsx
  smoobu: {
    eyebrow: "Book direct with your hosts",
    bookPre: "Book ",
    bookPost: "",
    bookNow: "Book now",
    notConfigured: "Smoobu property ID not configured yet.",
    bookOnSmoobu: "Book directly on Smoobu →",
    trustLine: "Secure direct booking · Flexible payment options · Personal service",
  },
  // Shared copy for the Airbnb-style detail pages (Haus28ClientPage + ApartmentPage)
  listing: {
    enlargePhotoAria: "Enlarge photo",
    allPhotosPre: "All ",
    allPhotosPost: " photos",
    photosPost: " photos",
    guestsWord: "guests",
    bedroomsWord: "bedrooms",
    bedsWord: "beds",
    bathroomWord: "bathroom",
    bathroomsWord: "bathrooms",
    reviewsPost: " reviews",
    hostLine: "Hosted by Vincent & Elena",
    superhost: "Superhost",
    checkInFrom: "Check-in from 4 p.m.",
    checkOutBy: "Check-out by 10 a.m.",
    showMore: "Show more",
    showLess: "Show less",
    whereYouSleep: "Where you'll sleep",
    showAllAmenitiesPre: "Show all ",
    showAllAmenitiesPost: " amenities",
    selectDatesForPrices: "Select dates to see prices",
    checkAvailability: "Check availability",
    closeAria: "Close",
    galleryClose: "Close",
    galleryCloseAria: "Close gallery",
    enlargeItemAriaPost: " – enlarge",
    whatToKnow: "What you should know",
    houseRules: "House rules",
    ruleCheckIn: "Check-in from 4 p.m.",
    ruleMaxGuestsPre: "Maximum of ",
    ruleMaxGuestsPost: " guests",
    ruleNoSmoking: "No smoking",
    decimal: ".",
  },
  // components/property/Haus28ClientPage.tsx
  haus28: {
    // Second H1 line – deliberately identical to the <title> so Google reads title & H1 as the same page.
    hotTubPost: "New at HAUS28: the premium hot tub – all details on our blog (in German)",
    h1Suffix: "– A-Frame with Hot Tub in the Bavarian Forest",
    typePre: "A-frame holiday home · ",
    guestFavorite: "Guest favourite",
    bedroomsList: [
      { name: "Bedroom 1", bed: "1 king-size double bed" },
      { name: "Bedroom 2", bed: "1 king-size double bed" },
      { name: "Bedroom 3", bed: "1 king-size double bed" },
      { name: "Bedroom 4", bed: "1 queen-size double bed" },
    ],
    highlights: [
      {
        title: "Guest favourite – top 5% on Airbnb",
        text: "Thanks to its reviews and reliability, HAUS28 is among the highest-rated places to stay.",
      },
      {
        title: "Beautiful setting – in the heart of the Bavarian Forest",
        text: `The hike up to the Büchelstein summit starts right at the front door. Pullman City is about ${m.pullmanCity.haus28} minutes away.`,
      },
      {
        title: "Self check-in with a key box",
        text: "Flexible arrival – check in whenever suits you from 4 p.m. using the key box.",
      },
      {
        title: "Book direct with Vincent and Elena",
        text: "Personal contact with us, your hosts. Pay by card, Apple Pay, Google Pay, PayPal or Klarna – or a 50% deposit now and the rest up to 14 days before arrival.",
      },
    ],
    amenitiesHeading: "What this place offers",
    locationDescription:
      `HAUS28 sits at the Büchelstein near Grattersdorf, idyllically placed on the edge of the Bavarian Forest. The hike up to the Büchelstein summit starts right at the front door. The Pullman City western town is about ${m.pullmanCity.haus28} minutes away – perfect for families. For shopping, Hengersberg is about ${m.hengersberg.haus28} minutes away and Deggendorf, with its shops and restaurants, about ${m.deggendorf.haus28}.`,
    attractions: [
      { name: "Büchelstein summit (hike)", distance: "~30 min on foot" },
      { name: "Hengersberg (shopping)", distance: ca(m.hengersberg.haus28) },
      { name: "Pullman City (western town)", distance: ca(m.pullmanCity.haus28) },
      { name: "Deggendorf town centre", distance: ca(m.deggendorf.haus28) },
      { name: "National park & treetop walk (Neuschönau)", distance: ca(m.nationalparkLusen.haus28) },
      { name: "elypso leisure pool, Deggendorf", distance: ca(m.elypso.haus28) },
      { name: "Arber (ski area)", distance: ca(m.arber.haus28) },
    ],
    excursions: {
      eyebrow: "Right from HAUS28",
      heading: "Hike to the Büchelstein & more day trips",
      text: "The Büchelstein circular hike starts right at the front door and leads up to the summit (831 m) and to the historic Rastbuche pilgrimage chapel (18th century). All our day-trip tips for the region at a glance.",
      cta: "All things to do",
      hikeLink: "Büchelstein hike: route & tips (in German)",
    },
    awards: {
      heading: "Awards",
      guestFavorite: "Guest favourite",
      top5: "Top 5% of listings on Airbnb",
    },
    hostProfile: {
      heading: "Meet your hosts",
      statReviews: "Reviews",
      statRating: "Star rating",
      statYears: (n: number): string => (n === 1 ? "Year hosting" : "Years hosting"),
      bio: "We're Vincent and Elena – we live surrounded by nature with our two children and love welcoming guests. We've shaped our holiday homes with plenty of heart and handiwork – one a modern A-frame in the woods, the other cosy and about 600 m from the Steinberg ski lift. We're happy to share our favourite tips for hikes, ski days and day trips, and we're always there for you whenever you need anything.",
      superhostTitle: "Superhost",
      superhostText:
        "Superhosts are experienced, exceptionally well-rated hosts who go out of their way to give guests a great stay.",
      responseRateLabel: "Response rate:",
      responseRateValue: " 100%",
      respondsWithin: "Responds within an hour",
      messageHost: "Message your hosts",
    },
    ruleCheckOut: "Check-out before 10 a.m.",
    ruleNoPets: "No pets",
    cancellationTitle: "Cancellation policy",
    cancellationText:
      "Free cancellation up to 30 days before arrival. After that, our cancellation policy applies.",
    cancellationCta: "View policy →",
    safetyTitle: "Safety & property",
    safetyItems: ["Smoke detector", "First-aid kit", "Fire extinguisher"],
    relatedTitle: "You might also like: Haus Schönblick",
  },
  // components/property/ApartmentPage.tsx
  apartment: {
    h1Suffix: "– Holiday apartment in Schöfweg, Bavarian Forest",
    newBadge: "New",
    typePre: "Apartment · ",
    typeMid: " m² · ",
    highlights: [
      {
        title: "The whole apartment to yourself",
        text: "You'll have the entire apartment all to yourself.",
      },
      {
        title: "A dream setting in the Bavarian Forest",
        text: "Hiking trails start right outside the front door. Surrounded by nature, about 600 m from the Steinberg ski lift.",
      },
      {
        title: "Book direct with Vincent and Elena",
        text: "Personal contact with us, your hosts. Pay by card, Apple Pay, Google Pay, PayPal or Klarna – or a 50% deposit now and the rest up to 14 days before arrival.",
      },
    ],
    aboutHeading: "About this place",
    amenitiesHeading: "What this place offers",
    locationDescription:
      `Haus Schönblick sits in Langfurth near Schöfweg in the Bavarian Forest, about 600 m from the Steinberg ski lift. Hiking trails start right outside the house, and two inns are just a few minutes away. Grafenau is about ${m.grafenau.schoenblick} minutes and the national park about ${m.nationalparkLusen.schoenblick} minutes by car.`,
    attractions: schoenblickAttractions,
    rulePets: `Dogs welcome, bookable directly (€${PET_FEE_PER_NIGHT} per dog per night, max. ${PET_MAX})`,
    ruleNoPets: "No pets",
    cancellationTitle: "Cancellation & access",
    cancellationTextPre: "Free cancellation up to 14 days before arrival. After that, our ",
    cancellationLink: "cancellation policy",
    cancellationTextPost: " applies.",
    accessibilityPre: "Accessibility: please ",
    accessibilityLink: "get in touch before booking",
    accessibilityPost: " – we'll gladly tell you more about access and facilities.",
    safetyTitle: "Safety",
    safetySmokeDetector: "Smoke detector",
    relatedTitle: "More apartments at Haus Schönblick",
  },
  // app/(de|en)/…/schoenblick/page.tsx (house overview page)
  schoenblickPage: {
    aboutHeading: "About Haus Schönblick",
    vorDerTuer: "Right on the doorstep (in German):",
    aboutLocation:
      `Haus Schönblick sits in Langfurth near Schöfweg, about 600 m from the Steinberg ski lift. The five holiday apartments are spread across house numbers 18 and 20: B5 and B6 on the ground floor with a terrace, B7 and B8 on the first floor with a panoramic balcony, plus the cabin-style apartment A2 in house no. 20. All guests share a large panoramic terrace with seating and a small garden; parking is free right in front of the building. The Pullman City Western town is about ${m.pullmanCity.schoenblick} minutes away by car.`,
    apartmentsEyebrow: "5 holiday apartments",
    apartmentsHeading: "Choose your apartment",
    apartmentsIntro:
      "All five apartments are in the same house – perfect for groups who'd like to book several apartments at once.",
    newBadge: "New",
    guestsPost: " guests",
    bedroomsAbbrPost: " BR",
    fromPre: "from ",
    perNight: " / night",
    details: "Details",
    book: "Book",
    groupStrong: "For groups:",
    groupText:
      " Book several apartments for up to 20 guests directly online – one date range, one payment. Ideal for family get-togethers, birthdays or company retreats.",
    groupCta: "Start a group booking →",
    compareHeading: "The apartments at a glance",
    compareCols: {
      apartment: "Apartment",
      size: "Size",
      location: "Location & outdoor",
      bedrooms: "Bedrooms",
      beds: "Beds",
      guests: "Guests",
      price: "From",
    },
    locationDescription:
      `Haus Schönblick is located in Langfurth near Schöfweg, in the heart of the Bavarian Forest. Hiking trails begin right outside the front door. The Pullman City western town is about ${m.pullmanCity.schoenblick} minutes away – ideal for families with kids. The region offers unspoilt nature, crisp air and true relaxation in every season.`,
    attractions: schoenblickAttractions,
    relatedTitle: "You might also like",
    relatedHaus28Subtitle: "A modern A-frame in the woods",
  },
};

export default property;
