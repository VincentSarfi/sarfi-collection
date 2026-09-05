// Late checkout widget (target of the QR code inside the units):
// book a late checkout + extend the stay by whole nights.
const lateCheckout = {
  eyebrow: "Sarfi Collection",
  titel: "Not quite ready to say goodbye?",
  sprachwechsel: "Deutsche Version",

  laden: "One moment — we're checking availability …",
  zahlungBestaetigen: "Confirming your payment …",

  haengt: {
    titel: "Payment still being verified",
    text:
      "Your payment is on its way. The system keeps checking in the background — your booking " +
      "will be confirmed within a few minutes. You can reopen this page anytime via the QR code.",
    knopf: "Check again now",
  },

  fehler: {
    titel: "That didn't work just now",
    standard: "We can't check availability right now. Please try again in a moment.",
    qrUngueltig: "This QR code is no longer valid. Please scan the code in your accommodation again.",
    keinToken: "This page belongs to the QR code in your accommodation — please scan it there.",
    bestellung: "That didn't work just now. Please try again in a moment.",
    erneut: "Try again",
  },

  lc: {
    gebuchtTitel: "Late checkout confirmed",
    gebuchtLabel: "Your checkout",
    bisUhr: (zeit: string) => `until ${zeit}`,
    gebuchtText: "All set — our team has been notified. Take your time and enjoy the morning.",
    gebuchtHinweis: "This page serves as your confirmation — reopen it anytime via the QR code.",

    angebotTitel: "Good news — your room isn't needed right away on departure day.",
    angebotText: (datum: string) =>
      `Extend your departure${datum ? ` on ${datum}` : ""} and take it easy:`,
    label: "Late checkout",
    einmalig: (preis: string) => `one-time ${preis} · incl. VAT`,
    knopf: "Book late checkout",
    knopfWartet: "One moment …",
    zahlungsHinweis:
      "Secure payment by card, Apple Pay or Google Pay via Stripe. Your late checkout is " +
      "locked in right after payment.",

    nichtTitel: "Late checkout — not available today",
    folgebelegung:
      "The next guest arrives on your departure day — housekeeping needs the room on time. " +
      "Thank you for understanding.",
    zuFrueh: (datum: string) =>
      `Late checkout can be booked from the day before your departure` +
      `${datum ? ` (your departure: ${datum})` : ""}. Just check back then.`,
    zuSpaet: "Booking has closed for today.",
    nichtStandard: "Late checkout is currently not available for this unit.",
    kontaktHinweis: "Questions? Just write to us — you'll find our contact details in your booking confirmation.",
  },

  vl: {
    gebuchtTitel: "Stay extended",
    gebuchtLabel: "New departure",
    zusatzNaechte: (n: number) => `${n} additional ${n === 1 ? "night" : "nights"}`,
    gebuchtText: "Your extension is locked in — just stay put, we'll take care of the rest.",

    angebotTitel: "Or simply stay a few nights longer?",
    angebotText: (frei: number) =>
      `Your accommodation is still free after departure${frei > 1 ? ` — up to ${frei} nights` : ""}.`,
    label: "Extension",
    minusAria: "One night less",
    plusAria: "One night more",
    naechte: (n: number) => `${n} ${n === 1 ? "night" : "nights"}`,
    gesamt: "total",
    proNacht: (preis: string) => `(avg. ${preis}/night)`,
    neueAbreise: (datum: string) => `new departure ${datum}`,
    knopf: "Extend & pay",
    zahlungsHinweis:
      "Current nightly rates, incl. VAT · Secure payment via Stripe. Your extension is locked " +
      "into the calendar right after payment.",
  },

  zahlungBegonnen: (naechte: number | null) =>
    `Already started a payment${naechte ? ` for ${naechte} ${naechte === 1 ? "night" : "nights"}` : ""}?`,
  zahlungFortsetzen: "Continue payment",
};

export default lateCheckout;
