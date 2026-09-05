// Late-Checkout-Widget (Zielseite des QR-Codes in den Einheiten):
// Late Checkout buchen + Aufenthalt um Nächte verlängern.
const lateCheckout = {
  eyebrow: "Sarfi Collection",
  titel: "Noch nicht bereit für den Abschied?",
  sprachwechsel: "English version",

  laden: "Einen Moment — wir prüfen die Verfügbarkeit …",
  zahlungBestaetigen: "Zahlung wird bestätigt …",

  haengt: {
    titel: "Zahlung wird noch geprüft",
    text:
      "Deine Zahlung ist unterwegs. Das System prüft im Hintergrund weiter — in wenigen Minuten " +
      "ist deine Buchung eingetragen. Du kannst diese Seite über den QR-Code jederzeit neu öffnen.",
    knopf: "Jetzt erneut prüfen",
  },

  fehler: {
    titel: "Das hat gerade nicht geklappt",
    standard: "Die Verfügbarkeit kann gerade nicht geprüft werden. Bitte versuche es gleich noch einmal.",
    qrUngueltig: "Dieser QR-Code ist nicht (mehr) gültig. Bitte scanne den Code in deiner Unterkunft erneut.",
    keinToken: "Diese Seite gehört zum QR-Code in deiner Unterkunft — bitte scanne ihn dort.",
    bestellung: "Das hat gerade nicht geklappt. Bitte versuche es in einem Moment noch einmal.",
    erneut: "Erneut versuchen",
  },

  // Objektbewusstes Unterkunftswort: HAUS28 ist ein Haus, alles andere eine
  // Ferienwohnung — „Zimmer" gibt es bei uns nicht. Das Widget wählt die Form
  // und schreibt sie am Satzanfang groß.
  unterkunft: { haus: "das Haus", wohnung: "deine Wohnung" },

  lc: {
    gebuchtTitel: "Late Checkout bestätigt",
    gebuchtLabel: "Dein Checkout",
    bisUhr: (zeit: string) => `bis ${zeit} Uhr`,
    gebuchtText: "Alles erledigt — unser Team ist informiert. Lass dir Zeit und genieße den Morgen.",
    gebuchtHinweis: "Diese Seite gilt als deine Bestätigung — über den QR-Code jederzeit erneut aufrufbar.",

    angebotTitel: (unterkunft: string) =>
      `Gute Nachricht — ${unterkunft} wird am Abreisetag nicht direkt wieder gebraucht.`,
    angebotText: (datum: string) =>
      `Verlängere deinen Abreisetag${datum ? ` am ${datum}` : ""} ganz entspannt:`,
    label: "Late Checkout",
    einmalig: (preis: string) => `einmalig ${preis} · inkl. MwSt.`,
    knopf: "Late Checkout buchen",
    knopfWartet: "Einen Moment …",
    zahlungsHinweis:
      "Sichere Zahlung per Karte, Apple Pay oder Google Pay über Stripe. Direkt nach der Zahlung " +
      "ist dein Late Checkout fest eingetragen.",

    nichtTitel: "Late Checkout — heute nicht möglich",
    folgebelegung:
      "An deinem Abreisetag reist bereits der nächste Gast an — das Housekeeping braucht die " +
      "Zeit dazwischen. Wir bitten um Verständnis.",
    zuFrueh: (datum: string) =>
      `Ein Late Checkout lässt sich ab dem Vortag deiner Abreise buchen` +
      `${datum ? ` (deine Abreise: ${datum})` : ""}. Schau einfach dann noch einmal vorbei.`,
    zuSpaet: "Für heute ist die Buchungszeit leider vorbei.",
    nichtStandard: "Für diese Einheit ist aktuell kein Late Checkout verfügbar.",
    kontaktHinweis: "Fragen? Schreib uns gern — die Kontaktdaten findest du in deiner Buchungsbestätigung.",
  },

  vl: {
    gebuchtTitel: "Aufenthalt verlängert",
    gebuchtLabel: "Neue Abreise",
    zusatzNaechte: (n: number) => `${n} zusätzliche ${n === 1 ? "Nacht" : "Nächte"}`,
    gebuchtText: "Deine Verlängerung ist fest eingetragen — bleib einfach, alles Weitere übernehmen wir.",

    angebotTitel: "Oder gleich ein paar Nächte länger bleiben?",
    angebotText: (unterkunftGross: string, frei: number) =>
      `${unterkunftGross} ist nach der Abreise noch frei${frei > 1 ? ` — bis zu ${frei} Nächte` : ""}.`,
    label: "Verlängerung",
    minusAria: "Eine Nacht weniger",
    plusAria: "Eine Nacht mehr",
    naechte: (n: number) => `${n} ${n === 1 ? "Nacht" : "Nächte"}`,
    gesamt: "gesamt",
    proNacht: (preis: string) => `(Ø ${preis}/Nacht)`,
    neueAbreise: (datum: string) => `neue Abreise ${datum}`,
    knopf: "Verlängern & bezahlen",
    zahlungsHinweis:
      "Tagesaktuelle Nachtpreise, inkl. MwSt. · Sichere Zahlung per Karte, Apple Pay oder " +
      "Google Pay über Stripe. Direkt nach der Zahlung ist deine Verlängerung fest im Kalender eingetragen.",
  },

  zahlungBegonnen: (naechte: number | null) =>
    `Zahlung${naechte ? ` für ${naechte} ${naechte === 1 ? "Nacht" : "Nächte"}` : ""} bereits begonnen?`,
  zahlungFortsetzen: "Zahlung fortsetzen",
};

export default lateCheckout;
