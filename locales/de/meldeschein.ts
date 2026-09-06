// Digitaler Meldeschein (§ 29 Abs. 5 BMG) — Zielseite des Links aus der
// Gästenachricht bzw. des QR-Codes in der Einheit. Nur Gäste ohne deutsche
// Staatsangehörigkeit müssen ihn ausfüllen; die Bestätigung ersetzt die
// Unterschrift per Kartenprüfung mit 3-D Secure (ohne Abbuchung).
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
    erneut: "Erneut versuchen",
  },

  aufenthalt: (einheit: string, von: string, bis: string) => `${einheit} · ${von} – ${bis}`,

  frage: {
    titel: "Hast du die deutsche Staatsangehörigkeit?",
    text:
      "In Deutschland müssen nur Gäste ohne deutsche Staatsangehörigkeit bei der Anreise einen Meldeschein ausfüllen (§ 29 Bundesmeldegesetz). " +
      "Deutsche Staatsangehörige sind seit 2025 davon befreit.",
    ja: "Ja, ich bin deutsche:r Staatsangehörige:r",
    nein: "Nein – Meldeschein ausfüllen",
    hinweisPersonen: (n: number) => n > 1 ? `Die Angabe gilt für die buchende Person. Mitreisende trägst du im Formular ein (${n} Personen gebucht).` : "",
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
    mitreisende: "Mitreisende Personen",
    mitreisendeHinweis: "Ehe-/Lebenspartner:in und minderjährige Kinder ohne deutsche Staatsangehörigkeit hier eintragen; weitere Erwachsene füllen bitte einen eigenen Meldeschein aus (Link erneut öffnen).",
    mitName: "Name, Vorname",
    mitGeburtsdatum: "Geburtsdatum",
    mitStaat: "Staatsangehörigkeit",
    mitHinzufuegen: "+ Person hinzufügen",
    entfernen: "Entfernen",
    landWaehlen: "Land wählen …",
    einwilligung:
      "Ich stimme zu, dass der Meldeschein elektronisch erfasst wird und meine Unterschrift durch die Kartenbestätigung ersetzt wird (§ 29 Abs. 5 BMG). Die Datenschutzhinweise habe ich gelesen.",
    datenschutz: "Datenschutzhinweise",
    weiter: "Weiter zur Bestätigung",
    sendet: "Wird gespeichert …",
    pflicht: "Bitte fülle die markierten Felder aus.",
    feldFehler: {
      familienname: "Familienname fehlt", vorname: "Vorname fehlt", geburtsdatum: "Geburtsdatum prüfen",
      staatsangehoerigkeit: "Staatsangehörigkeit wählen (nicht Deutschland)", anschrift: "Anschrift vollständig angeben",
      passnummer: "Dokumentnummer prüfen", ausstellendesLand: "Ausstellendes Land prüfen", mitreisende: "Angaben der Mitreisenden prüfen",
      ausweisFoto: "Ausweisfoto fehlt oder ist zu groß",
    },
  },

  karte: {
    titel: "Angaben bestätigen – statt Unterschrift",
    text:
      "Das Gesetz erlaubt statt der Unterschrift eine Bestätigung über eine Kartenprüfung mit starker Kundenauthentifizierung (§ 29 Abs. 5 BMG). " +
      "Am einfachsten geht das mit Apple Pay oder Google Pay: ein Tipp, Face ID oder Fingerabdruck, fertig – ohne Kartendaten einzutippen. " +
      "Es wird nichts abgebucht und nichts gespeichert.",
    zuFrueh: (datum: string) => `Deine Angaben sind gespeichert. Die Bestätigung ist erst am Anreisetag (${datum}) möglich – wir erinnern dich dann per Nachricht. Diese Seite kannst du jederzeit wieder öffnen.`,
    name: "Name des Karteninhabers",
    knopf: "Kostenlos bestätigen",
    wartet: "Wird bestätigt …",
    fehlgeschlagen: "Die Bestätigung ist nicht durchgegangen. Bitte versuche es noch einmal oder nutze das Papierformular in deiner Unterkunft.",
    keineSca: "Deine Bank hat keine Identitätsprüfung durchgeführt. Bitte versuche es mit einer anderen Karte – oder fülle das Papierformular in deiner Unterkunft aus.",
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
  },

  fuss: "Verantwortlich: Vincent Sarfi, SARFI Collection · Angaben nach §§ 29, 30 BMG · Speicherung ein Jahr ab Abreise, danach Löschung.",
};

export default meldeschein;
