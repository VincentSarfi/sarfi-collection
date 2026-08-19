// Buchungsstrecke: BookingWidget, BookingCalendar, PaymentStep,
// ApartmentSelector, BookingSidebarCard + buchen-Seiten.
// Alle Strings zeichengetreu aus den Komponenten übernommen –
// die deutschen Seiten müssen exakt denselben Text zeigen wie zuvor.
const booking = {
  // ── Formular-Validierung (BookingWidget) ──────────────────────────────────
  validation: {
    firstNameRequired: "Vorname erforderlich",
    firstNameTooShort: "Vorname zu kurz",
    lastNameRequired: "Nachname erforderlich",
    lastNameTooShort: "Nachname zu kurz",
    lettersOnly: "Bitte nur Buchstaben eingeben",
    emailRequired: "E-Mail erforderlich",
    emailInvalid: "Ungültige E-Mail-Adresse",
    phoneRequired: "Telefonnummer erforderlich",
    phoneInvalid: "Bitte eine gültige Telefonnummer eingeben",
  },

  // ── Fehlermeldungen (BookingWidget) ───────────────────────────────────────
  errors: {
    securityCheckPending:
      "Die Sicherheitsprüfung läuft noch. Bitte warte einen Moment und tippe erneut auf „Weiter zur Zahlung“.",
    paymentGeneric: "Fehler beim Zahlungsvorgang. Bitte versuche es erneut.",
    connectionCheck: "Verbindungsfehler. Bitte überprüfe deine Internetverbindung.",
    redirectFailed:
      "Die Zahlung wurde nicht abgeschlossen oder abgebrochen. Es wurde nichts abgebucht – du kannst die Buchung gerne erneut starten.",
    redirectUnknown:
      "Der Zahlungsstatus konnte nicht geprüft werden. Falls du eine Bestätigungs-E-Mail erhalten hast, war deine Buchung erfolgreich – ansonsten melde dich bitte bei uns.",
  },

  // ── Wiederkehrende Labels ─────────────────────────────────────────────────
  labels: {
    property: "Unterkunft",
    arrival: "Anreise",
    departure: "Abreise",
    guests: "Gäste",
    total: "Gesamt",
    totalPrice: "Gesamtpreis",
    cleaningFee: "Reinigungsgebühr",
    cleaningShort: "Reinigung",
    extraPersonFee: "Personenaufschlag",
    from: "ab ",
    perNight: "/ Nacht",
    reset: "Zurücksetzen",
    close: "Schließen",
    chooseDate: "Datum wählen",
    select: "Wählen",
    notCharged: "Du wirst noch nicht belastet",
    nightsPlural: "Nächte",
    nightWord: (n: number): string => (n === 1 ? "Nacht" : "Nächte"),
    personWord: (n: number): string => (n === 1 ? "Person" : "Personen"),
    guestCount: (n: number) => `${n} ${n === 1 ? "Gast" : "Gäste"}`,
    maxPersons: (n: number) => `max. ${n} Personen`,
    ariaFewerGuests: "Weniger Gäste",
    ariaMoreGuests: "Mehr Gäste",
  },

  // ── Trust-Badges ──────────────────────────────────────────────────────────
  trustBadges: [
    { title: "Sichere Buchung", text: "SSL-verschlüsselt" },
    { title: "Persönliche Betreuung", text: "Direkt vom Gastgeber" },
    { title: "Bis zu 20 % günstiger", text: "Als auf Buchungsportalen" },
  ],
  sidebarTrust: [
    { title: "Sichere Zahlung", text: "SSL-verschlüsselt" },
    { title: "Bis zu 20 % günstiger", text: "Als auf Buchungsportalen" },
  ],

  // ── Bestätigungs-Screen ───────────────────────────────────────────────────
  confirmed: {
    title: "Buchung eingegangen!",
    sidebarThanksPre: "Vielen Dank, ",
    sidebarThanksPost: "! Bestätigung kommt per E-Mail.",
    thanksPre: "Vielen Dank, ",
    thanksAfterName: "! Deine Buchungsanfrage für ",
    thanksAfterProperty:
      " wurde übermittelt. Du erhältst in Kürze eine Bestätigung per E-Mail an ",
    thanksAfterEmail: ".",
    deliveryNote:
      "Deine Bestätigung wird in der Regel innerhalb weniger Minuten per E-Mail zugestellt. Falls du innerhalb von 10 Minuten keine E-Mail (auch im Spam-Ordner) erhältst, melde dich bitte direkt bei uns.",
    detailsHeading: "Buchungsdetails",
    backToProperty: "← Zurück zur Unterkunft",
    redirectThanks:
      "Vielen Dank! Deine Zahlung war erfolgreich und deine Buchung ist bei uns eingegangen. Alle Details erhältst du in Kürze per E-Mail.",
  },

  // ── Fehler-Screen ─────────────────────────────────────────────────────────
  errorScreen: {
    title: "Fehler bei der Buchung",
    retry: "Erneut versuchen",
    contact: "Kontakt aufnehmen",
  },

  // ── Sidebar-Modus (Overlay + kompakte Karte) ──────────────────────────────
  sidebar: {
    overlayTitle: "Zeitraum wählen",
    checkInField: "Check-in",
    checkOutField: "Check-out",
    dateFormatHint: "TT.MM.JJJJ",
    addDate: "Datum hinzufügen",
    loadingAvailability: "Verfügbarkeiten laden…",
    resetDates: "Zeitraum zurücksetzen",
    totalPriceSpaced: "Gesamtpreis ",
    ariaChooseRange: "Reisezeitraum im Kalender wählen",
    bookNow: "Jetzt buchen",
    checkAvailability: "Verfügbarkeit prüfen",
  },

  // ── Formular-Schritt ──────────────────────────────────────────────────────
  form: {
    back: "Zurück",
    backToCalendar: "Zurück zum Kalender",
    yourDetails: "Deine Angaben",
    firstName: "Vorname",
    lastName: "Nachname",
    emailShort: "E-Mail",
    emailFull: "E-Mail-Adresse",
    phoneShort: "Telefon",
    phoneFull: "Telefonnummer",
    phFirstName: "Max",
    phLastName: "Mustermann",
    phEmail: "max@beispiel.de",
    phPhone: "+49 123 456789",
    businessToggle: "Firmenbuchung / Rechnung gewünscht",
    billingHeading: "Rechnungsdaten",
    company: "Firmenname",
    phCompany: "Musterfirma GmbH",
    vatId: "USt-IdNr.",
    phVatId: "DE123456789",
    street: "Straße & Hausnummer",
    phStreet: "Musterstraße 1",
    zip: "PLZ",
    phZip: "12345",
    city: "Ort",
    phCity: "München",
    country: "Land",
    phCountry: "Deutschland",
    messageShort: "Nachricht",
    messageFull: "Nachricht an den Gastgeber",
    optional: "(optional)",
    phMessageShort: "Besondere Wünsche…",
    phMessageFull: "Besondere Wünsche, Anreisezeit, …",
    paymentHeading: "Zahlung",
    paymentOptionHeading: "Zahlungsoption",
    deposit50Label: "50% Anzahlung",
    full100Label: "100% Vollzahlung",
    subNow: (amount: string) => `${amount} € jetzt`,
    subDeposit: (amount: string) => `${amount} € jetzt · Rest 14 Tage vor Anreise`,
    subFull: (amount: string) => `${amount} € jetzt · Keine weiteren Zahlungen`,
    legalSidebar: {
      pre: "Mit deiner Buchung stimmst du unseren ",
      privacy: "Datenschutzhinweisen",
      mid: " und ",
      cancellation: "Stornierungsbedingungen",
      post: " zu.",
    },
    legalFull: {
      pre: "Mit deiner Buchung stimmst du unseren ",
      privacy: "Datenschutzhinweisen",
      mid: " und den ",
      cancellation: "Stornierungsbedingungen",
      post: " zu. Deine Daten werden ausschließlich zur Buchungsabwicklung verwendet.",
    },
    preparing: "Wird vorbereitet…",
    securityRunning: "Sicherheitsprüfung läuft…",
    continueToPayment: "Weiter zur Zahlung",
    continueToPaymentArrow: "Weiter zur Zahlung →",
  },

  // ── Haupt-Widget (Kalender-Schritt, Sticky-Panel, Mobile-Bar) ─────────────
  widget: {
    loadingAvailabilityLong: "Verfügbarkeiten werden geladen…",
    continueToBooking: "Weiter zur Buchung →",
    continueShort: "Weiter →",
    bookShort: "Buchen",
    chooseDateInCalendar: "Datum im Kalender wählen",
    fromPrice: (price: number) => `ab ${price} €`,
    fromPerNightBar: (price: number) => `Ab ${price} € / Nacht`,
    chooseDeparture: "Abreise wählen",
    totalWord: "gesamt",
    extraPersShort: (n: number) => `+${n} Pers.`,
    paymentHint: "Schließe die Zahlung links ab, um deine Buchung abzusenden.",
    formHint: "Fülle das Formular links aus und bestätige die Buchung.",
    ariaResetCheckin: "Anreisedatum zurücksetzen und neu wählen",
  },

  // ── BookingCalendar ───────────────────────────────────────────────────────
  calendar: {
    weekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    hintCheckin: "Anreisedatum wählen",
    hintCheckout: (minStay: number) =>
      `Abreisedatum wählen${minStay > 1 ? ` — Mindestaufenthalt: ${minStay} Nächte` : ""}`,
    prevMonth: "Vorheriger Monat",
    nextMonth: "Nächster Monat",
    legendSelected: "Gewählt",
    legendRange: "Zeitraum",
    legendBooked: "Belegt",
    ariaBooked: " (belegt)",
    ariaUnavailable: " (nicht verfügbar)",
    bookableUntil: (date: string) => `Buchbar bis ${date}`,
  },

  // ── PaymentStep (Stripe) ──────────────────────────────────────────────────
  payment: {
    headingFull: "Vollzahlung",
    headingDeposit: "Anzahlung",
    fullPayPre: "Du zahlst jetzt den ",
    fullPayStrong: (amount: string) => `vollen Betrag (${amount} €)`,
    fullPayPost:
      ". Nach der Zahlung ist die Buchung vollständig beglichen – keine weiteren Zahlungen nötig.",
    depositPre: "Du zahlst jetzt die ",
    depositStrong: (amount: string) => `50% Anzahlung (${amount} €)`,
    depositMid: ". Den Restbetrag von ",
    depositPost: " begleichst du 14 Tage vor Anreise oder nach Absprache mit dem Gastgeber.",
    paymentDetails: "Zahlungsdaten",
    // PayPal hier ergänzen, sobald es im Stripe-Dashboard aktiviert ist
    acceptedMethods: "Apple Pay · Google Pay · Klarna · Kreditkarte u. v. m.",
    errCard: "Zahlung fehlgeschlagen. Bitte prüfe deine Kartendaten.",
    errUnexpectedStatus: "Unerwarteter Zahlungsstatus. Bitte versuche es erneut.",
    errConnection: "Verbindungsfehler. Bitte versuche es erneut.",
    processing: "Zahlung wird verarbeitet…",
    payButton: (amount: string, fullPay: boolean) =>
      `${amount} € ${fullPay ? "jetzt bezahlen" : "jetzt anzahlen"}`,
    backToDetails: "← Zurück zu meinen Angaben",
    sslNote: "SSL-verschlüsselt · Gesichert durch Stripe",
    todayFull: "Vollzahlung heute (100%)",
    todayDeposit: "Anzahlung heute (50%)",
  },

  // ── ApartmentSelector (Schönblick-Buchungsseite) ──────────────────────────
  selector: {
    chooseHeading: "Wähle dein Apartment:",
    chooseSub: "Klicke auf ein Apartment, um den Buchungskalender zu öffnen.",
    newBadge: "Neu",
    guestsN: (n: number) => `${n} Gäste`,
    bedroomsShort: "SZ",
    selected: "Ausgewählt ✓",
    book: "Buchen",
    moreInfoPre: "Mehr Infos zu ",
    moreInfoLink: (name: string) => `${name} ansehen →`,
    groupPre: "Ihr seid mehr als 4? Mehrere Apartments für bis zu 20 Personen: ",
    groupLink: "Zur Gruppenbuchung →",
    headerKicker: (id: string) => `Haus Schönblick · Apartment ${id}`,
    bookTitle: (name: string) => ({ plain: `${name} `, gold: "buchen" }),
    headerMeta: (subtitle: string, maxGuests: number, priceFrom: number) =>
      `${subtitle} · bis ${maxGuests} Personen · ab ${priceFrom}€ / Nacht`,
    chooseOther: "← Anderes Apartment wählen",
    viewApartment: "Apartment ansehen →",
  },

  // ── BookingSidebarCard ────────────────────────────────────────────────────
  sidebarCard: {
    reviews: (n: number) => `${n} Bewertungen`,
    selectDate: "Datum wählen",
    upToGuests: (n: number) => `bis ${n} Gäste`,
    bookNow: "Jetzt buchen",
    fromTimesNights: (price: number) => `ab ${price}€ × Anzahl Nächte`,
    byAvailability: "je nach Verfügbarkeit",
    minStay: (n: number) => `Mindestaufenthalt: ${n} Nächte`,
    trust: [
      "Sichere, SSL-verschlüsselte Zahlung",
      "Persönliche Betreuung direkt vom Gastgeber",
      "Bis zu 20 % günstiger als auf gängigen Buchungsportalen",
    ],
  },

  // ── buchen-Seiten ─────────────────────────────────────────────────────────
  pages: {
    home: "Startseite",
    book: "Buchen",
    reviewsWord: "Bewertungen",
    bookH1: (name: string) => ({ plain: `${name} `, gold: "buchen" }),
    groupHint: {
      strong: "Für Gruppen:",
      text: " Mehrere Apartments für bis zu 20 Personen in einer Buchung – ideal für Familienfeiern oder Firmenausflüge. ",
      link: "Zur Gruppenbuchung →",
    },
    overview: {
      crumb: "Unterkunft wählen",
      h1: { plain: "Unterkunft ", gold: "wählen" },
      sub: "Direkt buchen · bis zu 20 % günstiger als auf Buchungsportalen",
      haus28SectionTitle: "HAUS28 · A-Frame Ferienhaus",
      haus28Alt: "HAUS28 A-Frame Ferienhaus",
      haus28Sub: "A-Frame Ferienhaus · Büchelstein 28, Grattersdorf · Bayerischer Wald",
      guestsN: (n: number) => `${n} Gäste`,
      bedroomsN: (n: number) => `${n} Schlafzimmer`,
      bedroomsShort: "SZ",
      features: ["Panoramafenster", "Sauna", "Kamin", "Self-Check-in"],
      viewAndBook: "Ansehen & Buchen →",
      schoenblickSectionTitle: "Haus Schönblick · Panorama-Apartments",
      newBadge: "Neu",
      bookNow: "Jetzt buchen",
      trust: [
        { title: "Sichere Zahlung", text: "SSL-verschlüsselt" },
        { title: "Bis zu 20 % günstiger", text: "Als auf Buchungsportalen" },
        { title: "Persönliche Betreuung", text: "Direkt vom Gastgeber" },
      ],
    },
    schoenblick: {
      trust: [
        { title: "Sichere Zahlung", text: "SSL-verschlüsselt" },
        { title: "Gruppenfreundlich", text: "Mehrere Apartments kombinierbar" },
        { title: "Keine Gebühren", text: "Günstiger als Plattformen" },
      ],
    },
  },

  // ── Gruppenbuchung Haus Schönblick ──────────────────────────────────────────
  group: {
    kicker: "Haus Schönblick · Gruppenbuchung",
    heading: "Mehrere Apartments, eine Buchung",
    sub: "Bis zu 20 Personen in 5 Apartments unter einem Dach – ein Zeitraum, eine Zahlung, alles bestätigt.",
    guestsLabel: "Personen",
    guestsHint: (cap: number) => `bis zu ${cap} Personen`,
    datesHeading: "1. Zeitraum wählen",
    datesHint: "Angezeigt werden nur Tage, an denen genug Apartments für deine Gruppengröße frei sind.",
    aptsHeading: "2. Apartments wählen",
    aptsAvailable: (n: number) => `${n} Apartment${n === 1 ? "" : "s"} im Zeitraum frei`,
    aptsNoneAvailable: "Im gewählten Zeitraum sind nicht genug Apartments frei. Bitte wähle andere Daten.",
    recommended: "Empfohlene Kombination",
    recommendedApplied: "Günstigste passende Kombination vorausgewählt – du kannst sie anpassen.",
    capacity: (used: number, cap: number) => `Platz für ${cap} – ${used} Personen gewählt`,
    capacityShort: (n: number) => `bis ${n} Pers.`,
    tooFewCapacity: (missing: number) => `Es fehlen noch Plätze für ${missing} Person${missing === 1 ? "" : "en"} – wähle ein weiteres Apartment.`,
    occupancyLine: (guests: number) => `${guests} ${guests === 1 ? "Gast" : "Gäste"}`,
    perApartment: "Preis je Apartment",
    inclCleaning: "inkl. Reinigung",
    nightsSummary: (nights: number) => `${nights} ${nights === 1 ? "Nacht" : "Nächte"}`,
    totalLabel: "Gesamtpreis für die Gruppe",
    continueButton: "Weiter zur Buchung",
    formHeading: "3. Deine Daten",
    payHeading: "4. Zahlung",
    summaryApartments: "Apartments",
    benefit1: "Ein Ansprechpartner, eine Rechnung",
    benefit2: "Keine Portalgebühren – direkt beim Gastgeber",
    benefit3: "Alle Apartments im selben Haus",
    confirmedHeading: "Gruppenbuchung bestätigt!",
    confirmedText: "Alle Apartments sind für euch reserviert. Du erhältst in Kürze eine Bestätigung per E-Mail.",
    errorBlockedApt: "Eines der gewählten Apartments wurde soeben anderweitig gebucht. Bitte wähle eine andere Kombination.",
  },

  // ── Gruppen-Landingpage (/schoenblick/gruppen) ─────────────────────────────
  groupPage: {
    home: "Startseite",
    breadcrumb: "Gruppenbuchung",
    h1: "Platz für die ganze Gruppe – unter einem Dach",
    intro: (cap: number) =>
      `Bis zu ${cap} Personen in fünf Ferienwohnungen im Haus Schönblick, mitten im Bayerischen Wald. Wähle Zeitraum und Apartments, zahle einmal – fertig. Ideal für Familienfeiern, Vereinsausflüge und Firmen-Retreats.`,
    heroAlt: "Haus Schönblick – Gruppenunterkunft im Bayerischen Wald",
    combosHeading: "Beliebte Kombinationen",
    combosSub:
      "Zur Orientierung – im Buchungskalender stellst du dir deine Kombination frei zusammen und siehst den tagesaktuellen Gesamtpreis.",
    combos: [
      { ids: ["b5", "b6"], label: "2 Familien", desc: "Zwei Apartments nebeneinander – gemeinsam anreisen, getrennt wohnen." },
      { ids: ["b5", "b6", "b7"], label: "Freundesgruppe bis 12", desc: "Drei Apartments mit viel Gemeinschaftsfläche vor dem Haus." },
      { ids: ["b5", "b6", "b7", "b8", "a2"], label: "Das ganze Haus", desc: "Alle fünf Apartments exklusiv – maximale Privatsphäre für dein Event." },
    ],
    apartmentsWord: "Apartments",
    fromPre: "ab ",
    perNight: " / Nacht",
    allApartmentsHeading: "Die fünf Apartments im Überblick",
  },
};

export default booking;
