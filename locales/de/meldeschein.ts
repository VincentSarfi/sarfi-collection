// Digitaler Meldeschein (§ 29 Abs. 5 BMG) — Zielseite des Links aus der
// Gästenachricht bzw. des QR-Codes in der Einheit. Nur Gäste ohne deutsche
// Staatsangehörigkeit müssen ihn ausfüllen; die Bestätigung ersetzt die
// Unterschrift per Apple Pay oder Kartenprüfung mit 3-D Secure (ohne Abbuchung).
const meldeschein = {
  eyebrow: "Sarfi Collection",
  titel: "Meldeschein – in zwei Minuten erledigt",
  sprachwechsel: "English version",
  laden: "Einen Moment …",

  fehler: {
    titel: "Das hat gerade nicht geklappt",
    standard: "Die Seite kann gerade nicht geladen werden. Bitte versuche es gleich noch einmal.",
    linkUngueltig: "Dieser Link ist nicht (mehr) gültig. Bitte nutze den Link aus deiner Nachricht oder scanne den QR-Code in deiner Unterkunft.",
    keinAufenthalt: "Für diesen Code liegt gerade kein Aufenthalt vor. Der QR-Code funktioniert am Anreisetag und während des Aufenthalts.",
    keinToken: "Diese Seite gehört zum Link aus deiner Buchungsnachricht – bitte öffne sie von dort.",
    vorlageUnvollstaendig: "Dieser Link ist unvollständig. Bitte scanne den QR-Code in deiner Unterkunft oder fülle dort das Papierformular aus.",
    vorlageUngueltig:
      "Dieser Link funktioniert vom Tag vor der Anreise bis zur Abreise. Klappt es trotzdem nicht, scanne bitte den QR-Code in deiner Unterkunft oder fülle dort das Papierformular aus.",
    bereitsEingereicht: "Die Angaben liegen schon vor – bitte nur noch bestätigen.",
    zuViele: "Zu viele Versuche. Bitte warte ein paar Minuten und versuche es dann noch einmal.",
    erneut: "Erneut versuchen",
  },

  aufenthalt: (einheit: string, von: string, bis: string) => `${einheit} · ${von} – ${bis}`,

  frage: {
    titel: "Habt ihr alle die deutsche Staatsangehörigkeit?",
    text:
      "In Deutschland müssen nur Gäste ohne deutsche Staatsangehörigkeit bei der Anreise einen Meldeschein ausfüllen (§ 29 Bundesmeldegesetz). " +
      "Deutsche Staatsangehörige sind seit 2025 davon befreit.",
    ja: "Wir haben alle die deutsche Staatsangehörigkeit",
    nein: "Nein – Meldeschein ausfüllen",
    hinweisPersonen: (n: number) => n > 1 ? `Gebucht sind ${n} Personen. Hat jemand keinen deutschen Pass, füllt diese Person den Meldeschein aus; Ehe- oder Lebenspartner:in und minderjährige Kinder stehen mit darauf.` : "",
  },

  scan: {
    titel: "Pass oder Ausweis fotografieren",
    text:
      "Fotografiere die Datenseite deines Reisepasses (die Seite mit Foto und den zwei Zeilen Code unten) oder die Rückseite deiner ID-Karte. " +
      "Wir lesen die Angaben automatisch aus – du prüfst sie danach nur noch.",
    tipp: "Gerade halten, gutes Licht, die Codezeilen vollständig im Bild.",
    knopf: "Foto aufnehmen oder auswählen",
    liest: "Wird gelesen …",
    erkannt: "Angaben erkannt – bitte prüfen.",
    unsicher: "Angaben erkannt, aber nicht alle Prüfziffern stimmen – bitte sorgfältig prüfen.",
    nichtErkannt: "Der Code konnte nicht gelesen werden. Du kannst das Formular auch von Hand ausfüllen.",
    manuell: "Ohne Foto-Erkennung weiter",
  },

  formular: {
    titel: "Meldeschein",
    intro:
      "Bitte fülle die Angaben so aus, wie sie in deinem Reisepass oder Ausweis stehen. Anschließend bestätigst du sie mit einer kurzen Kartenprüfung – " +
      "das ersetzt die Unterschrift, es wird nichts abgebucht.",
    familienname: "Familienname",
    vorname: "Vorname(n)",
    geburtsdatum: "Geburtsdatum",
    staatsangehoerigkeit: "Staatsangehörigkeit",
    anschrift: "Wohnanschrift (Straße, PLZ, Ort, Land)",
    ausweisArt: "Ausweisdokument",
    reisepass: "Reisepass",
    personalausweis: "Personalausweis / ID-Karte",
    passnummer: "Nummer des Dokuments",
    ausstellendesLand: "Ausstellendes Land",
    foto: "Foto des Ausweisdokuments",
    fotoHinweis: "Datenseite mit Foto und Nummer, gut lesbar. Das Foto wird verschlüsselt gespeichert und ein Jahr nach deiner Abreise gelöscht.",
    fotoWaehlen: "Foto aufnehmen oder auswählen",
    fotoOk: "Foto übernommen",
    fotoFehler: "Das Bild konnte nicht verarbeitet werden – bitte ein anderes Foto wählen.",
    mitreisende: "Mitreisende Angehörige",
    mitreisendeHinweis:
      "Ehe- oder Lebenspartner:in und minderjährige Kinder ohne deutsche Staatsangehörigkeit hier eintragen – je Person nur die Staatsangehörigkeit, Namen braucht es nicht. " +
      "Weitere Erwachsene ohne deutschen Pass füllen bitte das Papierformular in der Unterkunft aus.",
    mitStaat: (n: number) => `Staatsangehörigkeit Person ${n}`,
    mitHinzufuegen: "+ Person hinzufügen",
    entfernen: "Entfernen",
    landWaehlen: "Land wählen …",
    weiter: "Weiter zur Bestätigung",
    sendet: "Wird gespeichert …",
    pflicht: "Bitte fülle die markierten Felder aus.",
    feldFehler: {
      familienname: "Familienname fehlt", vorname: "Vorname fehlt", geburtsdatum: "Geburtsdatum prüfen",
      staatsangehoerigkeit: "Staatsangehörigkeit wählen (nicht Deutschland)", anschrift: "Anschrift vollständig angeben",
      passnummer: "Dokumentnummer prüfen", ausstellendesLand: "Ausstellendes Land prüfen", mitreisende: "Staatsangehörigkeit der Mitreisenden wählen (nicht Deutschland)",
      ausweisFoto: "Ausweisfoto fehlt oder ist zu groß",
    },
  },

  // Steht im Scan-Schritt VOR dem ersten Foto: schon das Auslesen speichert es.
  einwilligung: {
    text:
      "Ich möchte den Meldeschein online ausfüllen. Ich bin einverstanden, dass mein Ausweisfoto verschlüsselt gespeichert und automatisch ausgelesen wird und dass meine Unterschrift durch die Kartenbestätigung ersetzt wird (§ 29 Abs. 5 BMG). " +
      "Widerruf jederzeit per E-Mail, dann gilt das Papierformular. Die Datenschutzhinweise habe ich gelesen.",
    datenschutz: "Datenschutzhinweise",
    fehlt: "Bitte setze zuerst den Haken bei der Einwilligung.",
  },

  karte: {
    titel: "Angaben bestätigen – statt Unterschrift",
    text:
      "Das Gesetz erlaubt statt der Unterschrift eine Bestätigung über eine Kartenprüfung mit starker Kundenauthentifizierung (§ 29 Abs. 5 BMG). " +
      "Am einfachsten geht das mit Apple Pay: ein Tipp, Face ID oder Touch ID, fertig – ohne Kartendaten einzutippen. " +
      "Ohne Apple Pay nimmst du deine eigene Karte und gibst die Prüfung in deiner Banking-App frei. " +
      "Es wird nichts abgebucht, und Kartendaten speichern wir nicht.",
    zuFrueh: (datum: string) =>
      `Deine Angaben sind gespeichert. Die Bestätigung ist erst am Anreisetag (${datum}) möglich. Öffne die Seite dann einfach wieder über den Link aus deiner Nachricht oder den QR-Code in der Unterkunft – fehlt die Bestätigung noch, erinnern wir dich an diesem Tag einmal per Nachricht.`,
    name: "Name des Karteninhabers",
    knopf: "Kostenlos bestätigen",
    wartet: "Wird bestätigt …",
    fehlgeschlagen: "Die Bestätigung ist nicht durchgegangen. Bitte versuche es noch einmal oder nutze das Papierformular in deiner Unterkunft.",
    keineSca: "Deine Bank hat keine Identitätsprüfung durchgeführt. Bitte versuche es mit einer anderen Karte – oder fülle das Papierformular in deiner Unterkunft aus.",
    papierNoetig:
      "Diese Bestätigung reicht hier leider nicht aus. Bitte unterschreibe das Papierformular in deiner Unterkunft – es wurde nichts abgebucht. Alternativ kannst du es noch einmal mit Apple Pay oder einer anderen Karte versuchen.",
    ohneStripe: "Deine Angaben sind gespeichert. Bitte unterschreibe zusätzlich das Papierformular in deiner Unterkunft.",
    papier: "Keine Karte zur Hand? Dann unterschreibe bitte das Papierformular in deiner Unterkunft – deine Angaben hier bleiben gespeichert.",
  },

  fertig: {
    entfaelltTitel: "Alles klar – nichts weiter zu tun",
    entfaelltText: "Als deutsche:r Staatsangehörige:r brauchst du keinen Meldeschein. Wir wünschen dir einen schönen Aufenthalt!",
    erhaltenTitel: "Vielen Dank – Meldeschein erledigt",
    erhaltenText: "Deine Angaben sind bestätigt und sicher gespeichert. Ein Papierformular ist nicht mehr nötig. Schönen Aufenthalt!",
    eingereichtTitel: "Angaben gespeichert",
    eingereichtText: "Deine Angaben liegen vor, die Bestätigung fehlt noch.",
    nochmal: "Jetzt bestätigen",
    andereKarte: "Mit Apple Pay oder anderer Karte versuchen",
  },

  fuss: "Verantwortlich: Vincent Sarfi, SARFI Collection · Angaben nach §§ 29, 30 BMG · Speicherung ein Jahr ab Abreise, danach Löschung.",
  // Nur Englisch: dort gibt es keine eigene Datenschutzerklärung. Deutsch verlinkt die volle.
  datenschutzKurz: "",
};

export default meldeschein;
