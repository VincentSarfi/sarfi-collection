// Kontakt-Seite: Texte 1:1 aus app/(de)/kontakt/page.tsx übernommen –
// die deutsche Seite muss zeichengetreu identisch bleiben.
const kontakt = {
  header: {
    kicker: "Kontakt",
    title: "Wir freuen uns von dir zu hören",
    note: "We speak English – feel free to contact us in English anytime.",
  },
  form: {
    heading: "Nachricht schreiben",
    successTitle: "Vielen Dank für deine Nachricht!",
    successText: "Wir melden uns in der Regel innerhalb von 24 Stunden bei dir.",
    nameLabel: "Name *",
    namePlaceholder: "Max Mustermann",
    emailLabel: "E-Mail *",
    emailPlaceholder: "max@beispiel.de",
    phoneLabel: "Telefon",
    phonePlaceholder: "+49 123 456789",
    subjectLabel: "Betreff",
    subjectPlaceholder: "Bitte auswählen…",
    subjectHaus28: "HAUS28 – Anfrage",
    subjectSchoenblick: "Haus Schönblick – Anfrage",
    subjectGruppe: "Gruppenbuchung",
    subjectOther: "Sonstiges",
    messageLabel: "Nachricht *",
    messagePlaceholder: "Deine Frage oder Anfrage…",
    privacyPre: "Ich habe die",
    privacyLink: "Datenschutzerklärung",
    privacyPost: "gelesen und stimme der Verarbeitung meiner Daten zu. *",
    submit: "Nachricht senden",
    submitting: "Wird gesendet…",
    errSend: "Fehler beim Senden",
    errFallback:
      "Deine Nachricht konnte leider nicht gesendet werden. Bitte schreib uns direkt an hallo@sarfi-collection.de.",
  },
  info: {
    heading: "Kontaktdaten",
    emailLabel: "E-Mail",
    phoneLabel: "Telefon",
    whatsappLabel: "WhatsApp",
    whatsappAction: "Nachricht schreiben",
    locationsLabel: "Standorte",
    locations: "Grattersdorf · Schöfweg",
    region: "Bayerischer Wald, Deutschland",
    responseTitle: "⚡ Schnelle Antwortzeit",
    responseText:
      "Wir antworten in der Regel innerhalb von wenigen Stunden – spätestens innerhalb von 24 Stunden.",
  },
  faq: {
    heading: "Häufige Fragen",
    items: [
      {
        q: "Wie buche ich direkt?",
        a: "Wähle auf der jeweiligen Unterkunftsseite im Kalender deinen Reisezeitraum und buche direkt auf der Website. Bezahlt wird sicher über Stripe – per Karte, Apple Pay oder Google Pay, wahlweise mit 50 % Anzahlung oder Vollzahlung. Deine Buchungsbestätigung erhältst du sofort per E-Mail.",
      },
      {
        q: "Kann ich mehrere Apartments gleichzeitig buchen?",
        a: "Ja! Schreibe uns einfach eine Nachricht und wir helfen dir beim Buchen mehrerer Apartments im Haus Schönblick.",
      },
      {
        q: "Wie läuft der Check-in ab?",
        a: "Wir bieten Self-Check-in mit Schlüsselbox an. Du erhältst alle Infos ca. 24h vor Anreise per E-Mail/Nachricht.",
      },
      {
        q: "Was passiert bei Stornierung?",
        a: {
          beforeLink:
            "HAUS28: kostenlos bis 30 Tage vor Anreise, 50 % bis 14 Tage, danach keine Erstattung. Schönblick-Apartments: kostenlos bis 14 Tage vor Anreise, 50 % bis 7 Tage, danach keine Erstattung. Alle Details unter",
          linkLabel: "sarfi-collection.de/stornierung",
          afterLink: ".",
        },
      },
      {
        q: "Gibt es Rabatte für längere Aufenthalte?",
        a: "Ja, für Aufenthalte ab 7 Nächten gibt es Wochenrabatte. Kontaktiere uns für individuelle Angebote.",
      },
      {
        q: "Sind Haustiere willkommen?",
        a: "Auf Anfrage und je nach Unterkunft. Bitte kontaktiere uns vor der Buchung.",
      },
    ],
  },
};

export default kontakt;
