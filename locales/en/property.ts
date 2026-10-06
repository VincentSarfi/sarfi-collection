// Property pages (HAUS28, Haus Schönblick, apartments): UI copy for the property components.
// Data copy (descriptions, FAQs, amenities, alt texts) comes from data/properties.i18n.ts.

import { PET_FEE_PER_NIGHT, ca, driveMinutes as m } from "@/data/surroundings";

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
    guestFavoriteBadge: "🏅 Guest favourite",
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
    mapTitlePre: "Map: ",
    mapAriaPre: "OpenStreetMap map of ",
    defaultAttractions: [
      { name: "Lusen National Park Centre", distance: "~40–45 min" },
      { name: "Deggendorf (shopping)", distance: ca(m.deggendorf.haus28) },
      { name: "elypso leisure pool, Deggendorf", distance: ca(m.elypso.haus28) },
      { name: "Frauenau Glass Museum", distance: "~35–40 min" },
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
    prevAria: "Previous reviews",
    nextAria: "Next reviews",
    allOnAirbnb: "All on Airbnb",
    swipeHint: "Swipe for more reviews →",
    showMore: "Show more",
    showLess: "Show less",
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
    eyebrow: "Book direct & save",
    bookPre: "Book ",
    bookPost: "",
    bookNow: "Book now",
    notConfigured: "Smoobu property ID not configured yet.",
    bookOnSmoobu: "Book directly on Smoobu →",
    trustLine: "Secure direct booking · No platform fees · Personal service",
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
        title: "Book direct – up to 20% cheaper",
        text: "Book directly with us and save compared to the usual booking platforms.",
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
      bio: "We're Vincent and Elena – we live surrounded by nature with our two children and love welcoming guests. We've shaped our holiday homes with plenty of heart and handiwork – one a modern A-frame in the woods, the other cosy and right by the ski lift. We're happy to share our favourite tips for hikes, ski days and day trips, and we're always there for you whenever you need anything.",
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
        text: "Hiking trails start right outside the front door. Surrounded by nature, right by the Steinberg ski lift.",
      },
      {
        title: "Book direct – up to 20% cheaper",
        text: "Book directly with us and save compared to the usual booking platforms.",
      },
    ],
    aboutHeading: "About this place",
    amenitiesHeading: "What this place offers",
    locationDescription:
      `Haus Schönblick sits in Langfurth near Schöfweg, right by the Steinberg ski lift in the Bavarian Forest. Hiking trails start right outside the house, and two inns are just a few minutes away. Grafenau is about ${m.grafenau.schoenblick} minutes and the national park about ${m.nationalparkLusen.schoenblick} minutes by car.`,
    attractions: schoenblickAttractions,
    rulePets: `Dogs on request (€${PET_FEE_PER_NIGHT} per night)`,
    cancellationTitle: "Cancellation & access",
    cancellationTextPre: "Free cancellation up to 30 days before arrival. After that, our ",
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
    aboutLocation:
      `Haus Schönblick sits in Langfurth near Schöfweg, right by the Steinberg ski lift. The five holiday apartments are spread across house numbers 18 and 20: B5 and B6 on the ground floor with a terrace, B7 and B8 on the first floor with a panoramic balcony, plus the cabin-style apartment A2 in house no. 20. All guests share a large panoramic terrace with seating and a small garden; parking is free right in front of the building. The Pullman City Western town is about ${m.pullmanCity.schoenblick} minutes away by car.`,
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
