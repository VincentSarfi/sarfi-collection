// Booking flow: BookingWidget, BookingCalendar, PaymentStep,
// ApartmentSelector, BookingSidebarCard + booking pages.
// Must mirror the structure of locales/de/booking.ts exactly.

// English overlay for the German booking-header subtitles from
// config/properties.config.ts (data stays untouched, German is the fallback).
const configSubtitleEn: Record<string, string> = {
  "Panorama-Apartment · Haus Schönblick": "Panorama apartment · Haus Schönblick",
  "Premium-Apartment · Haus Schönblick": "Premium apartment · Haus Schönblick",
  "Modernes A-Frame im Bayerischen Wald": "Modern A-frame in the Bavarian Forest",
};

const booking = {
  // ── Form validation (BookingWidget) ───────────────────────────────────────
  validation: {
    firstNameRequired: "First name required",
    firstNameTooShort: "First name too short",
    lastNameRequired: "Last name required",
    lastNameTooShort: "Last name too short",
    lettersOnly: "Please use letters only",
    emailRequired: "Email address required",
    emailInvalid: "Invalid email address",
    phoneRequired: "Phone number required",
    phoneInvalid: "Please enter a valid phone number",
  },

  // ── Error messages (BookingWidget) ────────────────────────────────────────
  errors: {
    securityCheckPending:
      "The security check is still running. Please wait a moment and tap “Continue to payment” again.",
    paymentGeneric: "Something went wrong while preparing the payment. Please try again.",
    connectionCheck: "Connection error. Please check your internet connection.",
    redirectFailed:
      "The payment was not completed or was cancelled. Nothing has been charged – feel free to start the booking again.",
    redirectUnknown:
      "We couldn't verify the payment status. If you've received a confirmation email, your booking was successful – otherwise please get in touch with us.",
  },

  // ── Recurring labels ──────────────────────────────────────────────────────
  labels: {
    property: "Accommodation",
    arrival: "Check-in",
    departure: "Check-out",
    guests: "Guests",
    total: "Total",
    totalPrice: "Total price",
    cleaningFee: "Cleaning fee",
    cleaningShort: "Cleaning",
    extraPersonFee: "Extra guest fee",
    from: "from ",
    perNight: "/ night",
    reset: "Reset",
    close: "Close",
    chooseDate: "Select date",
    select: "Select",
    notCharged: "You won't be charged yet",
    nightsPlural: "nights",
    nightWord: (n: number) => (n === 1 ? "night" : "nights"),
    personWord: (n: number) => (n === 1 ? "person" : "people"),
    guestCount: (n: number) => `${n} ${n === 1 ? "guest" : "guests"}`,
    maxPersons: (n: number) => `max. ${n} guests`,
    ariaFewerGuests: "Fewer guests",
    ariaMoreGuests: "More guests",
  },

  // ── Trust badges ──────────────────────────────────────────────────────────
  trustBadges: [
    { title: "Secure booking", text: "SSL-encrypted" },
    { title: "Personal service", text: "Directly from your host" },
    { title: "Up to 20% cheaper", text: "Than on booking platforms" },
  ],
  sidebarTrust: [
    { title: "Secure payment", text: "SSL-encrypted" },
    { title: "Up to 20% cheaper", text: "Than on booking platforms" },
  ],

  // ── Confirmation screen ───────────────────────────────────────────────────
  confirmed: {
    title: "Booking received!",
    sidebarThanksPre: "Thank you, ",
    sidebarThanksPost: "! A confirmation is on its way by email.",
    thanksPre: "Thank you, ",
    thanksAfterName: "! Your booking request for ",
    thanksAfterProperty:
      " has been submitted. You'll shortly receive a confirmation by email at ",
    thanksAfterEmail: ".",
    deliveryNote:
      "Your confirmation is usually delivered by email within a few minutes. If you haven't received an email within 10 minutes (please also check your spam folder), get in touch with us directly.",
    detailsHeading: "Booking details",
    backToProperty: "← Back to the property",
    redirectThanks:
      "Thank you! Your payment was successful and your booking has been received. You'll get all the details by email shortly.",
  },

  // ── Error screen ──────────────────────────────────────────────────────────
  errorScreen: {
    title: "Something went wrong",
    retry: "Try again",
    contact: "Contact us",
  },

  // ── Sidebar mode (overlay + compact card) ─────────────────────────────────
  sidebar: {
    overlayTitle: "Select dates",
    checkInField: "Check-in",
    checkOutField: "Check-out",
    dateFormatHint: "DD/MM/YYYY",
    addDate: "Add date",
    loadingAvailability: "Loading availability…",
    resetDates: "Reset dates",
    totalPriceSpaced: "Total price ",
    ariaChooseRange: "Select your dates in the calendar",
    bookNow: "Book now",
    checkAvailability: "Check availability",
  },

  // ── Form step ─────────────────────────────────────────────────────────────
  form: {
    back: "Back",
    backToCalendar: "Back to the calendar",
    yourDetails: "Your details",
    firstName: "First name",
    lastName: "Last name",
    emailShort: "Email",
    emailFull: "Email address",
    phoneShort: "Phone",
    phoneFull: "Phone number",
    phFirstName: "John",
    phLastName: "Smith",
    phEmail: "john@example.com",
    phPhone: "+44 123 456789",
    businessToggle: "Business booking / invoice needed",
    billingHeading: "Billing details",
    company: "Company name",
    phCompany: "Example Ltd",
    vatId: "VAT ID",
    phVatId: "DE123456789",
    street: "Street & house number",
    phStreet: "1 Example Street",
    zip: "Postcode",
    phZip: "12345",
    city: "City",
    phCity: "Munich",
    country: "Country",
    phCountry: "Germany",
    messageShort: "Message",
    messageFull: "Message to your host",
    optional: "(optional)",
    phMessageShort: "Special requests…",
    phMessageFull: "Special requests, arrival time, …",
    paymentHeading: "Payment",
    paymentOptionHeading: "Payment option",
    deposit50Label: "50% deposit",
    full100Label: "100% full payment",
    subNow: (amount: string) => `${amount} € now`,
    subDeposit: (amount: string) => `${amount} € now · balance due 14 days before arrival`,
    subFull: (amount: string) => `${amount} € now · no further payments`,
    legalSidebar: {
      pre: "By booking you accept our ",
      terms: "terms & conditions",
      mid: " incl. ",
      cancellation: "cancellation policy",
      post: " (German). How we handle your data: ",
      privacy: "privacy policy",
      end: " (German).",
    },
    legalFull: {
      pre: "By clicking the pay button you place a binding booking with an obligation to pay and accept our ",
      terms: "terms & conditions",
      mid: " incl. ",
      cancellation: "cancellation policy",
      post: " (German). How we handle your data is explained in our ",
      privacy: "privacy policy",
      end: " (German). Your data is used solely to process your booking.",
    },
    preparing: "Preparing…",
    securityRunning: "Security check in progress…",
    continueToPayment: "Continue to payment",
    continueToPaymentArrow: "Continue to payment →",
  },

  // ── Main widget (calendar step, sticky panel, mobile bar) ─────────────────
  widget: {
    loadingAvailabilityLong: "Loading availability…",
    continueToBooking: "Continue to booking →",
    continueShort: "Continue →",
    bookShort: "Book",
    chooseDateInCalendar: "Select dates in the calendar",
    fromPrice: (price: number) => `from ${price} €`,
    fromPerNightBar: (price: number) => `From ${price} € / night`,
    chooseDeparture: "Select check-out date",
    totalWord: "total",
    extraPersShort: (n: number) => `+${n} guest${n === 1 ? "" : "s"}`,
    paymentHint: "Complete the payment on the left to submit your booking.",
    formHint: "Fill in the form on the left and confirm your booking.",
    ariaResetCheckin: "Reset and reselect check-in date",
  },

  // ── BookingCalendar ───────────────────────────────────────────────────────
  calendar: {
    weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    hintCheckin: "Select your check-in date",
    hintCheckout: (minStay: number) =>
      `Select your check-out date${minStay > 1 ? ` — minimum stay: ${minStay} nights` : ""}`,
    prevMonth: "Previous month",
    nextMonth: "Next month",
    legendSelected: "Selected",
    legendRange: "Your stay",
    legendBooked: "Booked",
    ariaBooked: " (booked)",
    ariaUnavailable: " (unavailable)",
    bookableUntil: (date: string) => `Bookable until ${date}`,
  },

  // ── PaymentStep (Stripe) ──────────────────────────────────────────────────
  payment: {
    headingFull: "Full payment",
    headingDeposit: "Deposit",
    fullPayPre: "You're paying the ",
    fullPayStrong: (amount: string) => `full amount (${amount} €)`,
    fullPayPost:
      " now. Once the payment is complete, your booking is fully settled – no further payments needed.",
    depositPre: "You're paying the ",
    depositStrong: (amount: string) => `50% deposit (${amount} €)`,
    depositMid: " now. The remaining balance of ",
    depositPost: " is due 14 days before arrival, or as arranged with your host.",
    paymentDetails: "Payment details",
    // Add PayPal here once it is activated in the Stripe dashboard
    acceptedMethods: "Apple Pay · Google Pay · Klarna · credit card & more",
    errCard: "Payment failed. Please check your card details.",
    errUnexpectedStatus: "Unexpected payment status. Please try again.",
    errConnection: "Connection error. Please try again.",
    processing: "Processing payment…",
    payButton: (amount: string, fullPay: boolean) =>
      fullPay ? `Pay ${amount} € now` : `Pay ${amount} € deposit now`,
    backToDetails: "← Back to my details",
    sslNote: "SSL-encrypted · Secured by Stripe",
    todayFull: "Full payment today (100%)",
    todayDeposit: "Deposit today (50%)",
  },

  // ── ApartmentSelector (Schönblick booking page) ───────────────────────────
  selector: {
    chooseHeading: "Choose your apartment:",
    chooseSub: "Click an apartment to open the booking calendar.",
    newBadge: "New",
    guestsN: (n: number) => `${n} guests`,
    bedroomsShort: "BR",
    selected: "Selected ✓",
    book: "Book",
    moreInfoPre: "More info: ",
    moreInfoLink: (name: string) => `view ${name} →`,
    groupPre: "More than 4 of you? Book several apartments for up to 20 guests: ",
    groupLink: "Go to group booking →",
    headerKicker: (id: string) => `Haus Schönblick · Apartment ${id}`,
    bookTitle: (name: string) => ({ plain: "Book ", gold: name }),
    headerMeta: (subtitle: string, maxGuests: number, priceFrom: number) =>
      `${configSubtitleEn[subtitle] ?? subtitle} · up to ${maxGuests} guests · from ${priceFrom}€ / night`,
    chooseOther: "← Choose a different apartment",
    viewApartment: "View apartment →",
  },

  // ── BookingSidebarCard ────────────────────────────────────────────────────
  sidebarCard: {
    reviews: (n: number) => `${n} reviews`,
    selectDate: "Select date",
    upToGuests: (n: number) => `up to ${n} guests`,
    bookNow: "Book now",
    fromTimesNights: (price: number) => `from ${price}€ × number of nights`,
    byAvailability: "depends on availability",
    minStay: (n: number) => `Minimum stay: ${n} nights`,
    trust: [
      "Secure, SSL-encrypted payment",
      "Personal service directly from your host",
      "Up to 20% cheaper than on the usual booking platforms",
    ],
  },

  // ── Booking pages ─────────────────────────────────────────────────────────
  pages: {
    home: "Home",
    book: "Book",
    reviewsWord: "reviews",
    bookH1: (name: string) => ({ plain: "Book ", gold: name }),
    groupHint: {
      strong: "For groups:",
      text: " Book several apartments for up to 20 guests in a single booking – ideal for family celebrations or company retreats. ",
      link: "Go to group booking →",
    },
    overview: {
      crumb: "Choose accommodation",
      h1: { plain: "Choose your ", gold: "stay" },
      sub: "Book direct · up to 20% cheaper than on booking platforms",
      haus28SectionTitle: "HAUS28 · A-frame holiday home",
      haus28Alt: "HAUS28 A-frame holiday home",
      haus28Sub: "A-frame holiday home · Büchelstein 28, Grattersdorf · Bavarian Forest",
      guestsN: (n: number) => `${n} guests`,
      bedroomsN: (n: number) => `${n} bedrooms`,
      bedroomsShort: "BR",
      features: ["Panoramic window", "Sauna", "Fireplace", "Self check-in"],
      viewAndBook: "View & book →",
      schoenblickSectionTitle: "Haus Schönblick · Panorama apartments",
      newBadge: "New",
      bookNow: "Book now",
      trust: [
        { title: "Secure payment", text: "SSL-encrypted" },
        { title: "Up to 20% cheaper", text: "Than on booking platforms" },
        { title: "Personal service", text: "Directly from your host" },
      ],
    },
    schoenblick: {
      trust: [
        { title: "Secure payment", text: "SSL-encrypted" },
        { title: "Group-friendly", text: "Combine several apartments" },
        { title: "No fees", text: "Cheaper than platforms" },
      ],
    },
  },

  // ── Group booking Haus Schönblick ───────────────────────────────────────────
  group: {
    kicker: "Haus Schönblick · Group booking",
    heading: "Several apartments, one booking",
    sub: "Up to 20 guests across 5 apartments under one roof – one date range, one payment, everything confirmed.",
    guestsLabel: "Guests",
    guestsHint: (cap: number) => `up to ${cap} guests`,
    datesHeading: "1. Choose your dates",
    datesHint: "Only days with enough free apartments for your group size are shown as available.",
    aptsHeading: "2. Choose apartments",
    aptsAvailable: (n: number) => `${n} apartment${n === 1 ? "" : "s"} free for these dates`,
    aptsNoneAvailable: "Not enough apartments are free for the selected dates. Please choose different dates.",
    recommended: "Recommended combination",
    recommendedApplied: "Cheapest suitable combination pre-selected – adjust as you like.",
    capacity: (used: number, cap: number) => `Room for ${cap} – ${used} guests selected`,
    capacityShort: (n: number) => `up to ${n} guests`,
    tooFewCapacity: (missing: number) => `Still missing room for ${missing} guest${missing === 1 ? "" : "s"} – add another apartment.`,
    occupancyLine: (guests: number) => `${guests} guest${guests === 1 ? "" : "s"}`,
    perApartment: "Price per apartment",
    inclCleaning: "incl. cleaning",
    nightsSummary: (nights: number) => `${nights} night${nights === 1 ? "" : "s"}`,
    totalLabel: "Total for the group",
    continueButton: "Continue to booking",
    formHeading: "3. Your details",
    payHeading: "4. Payment",
    summaryApartments: "Apartments",
    benefit1: "One host, one invoice",
    benefit2: "No platform fees – book direct",
    benefit3: "All apartments in the same house",
    confirmedHeading: "Group booking confirmed!",
    confirmedText: "All apartments are reserved for you. A confirmation email is on its way.",
    errorBlockedApt: "One of the selected apartments was just booked by someone else. Please pick a different combination.",
  },

  // ── Group landing page (/schoenblick/gruppen) ──────────────────────────────
  groupPage: {
    home: "Home",
    breadcrumb: "Group booking",
    h1: "Room for the whole group – under one roof",
    intro: (cap: number) =>
      `Up to ${cap} guests across five holiday apartments at Haus Schönblick, in the heart of the Bavarian Forest. Pick your dates and apartments, pay once – done. Ideal for family celebrations, club trips and company retreats.`,
    heroAlt: "Haus Schönblick – group accommodation in the Bavarian Forest",
    combosHeading: "Popular combinations",
    combosSub:
      "For orientation – in the booking calendar you build your own combination and see the live total for your dates.",
    combos: [
      { ids: ["b5", "b6"], label: "2 families", desc: "Two apartments side by side – travel together, stay separately." },
      { ids: ["b5", "b6", "b7"], label: "Friends up to 12", desc: "Three apartments with plenty of shared space outside." },
      { ids: ["b5", "b6", "b7", "b8", "a2"], label: "The whole house", desc: "All five apartments exclusively – maximum privacy for your event." },
    ],
    apartmentsWord: "apartments",
    fromPre: "from ",
    perNight: " / night",
    allApartmentsHeading: "The five apartments at a glance",
  },
};

export default booking;
