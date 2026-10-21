// Digitaler Meldeschein (§ 29 Abs. 5 BMG) — Zielseite des Links aus der
// Gästenachricht bzw. des QR-Codes in der Einheit. Nur Gäste ohne deutsche
// Staatsangehörigkeit müssen ihn ausfüllen, jede:r Erwachsene einen eigenen
// (§ 29 Abs. 2 BMG); die Bestätigung ersetzt die Unterschrift per Apple Pay oder
// Kartenprüfung mit 3-D Secure (ohne Abbuchung).
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
    zuVieleNeu: "Gerade wurden für diese Buchung viele Meldescheine angelegt. Bitte warte ein paar Minuten und versuche es dann noch einmal.",
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
    nurIch: "Ich bin deutsch, mitreisende Kolleg:innen nicht",
    hinweisPersonen: (n: number) => n > 1
      ? `Gebucht sind ${n} Personen. Jede:r Erwachsene ohne deutschen Pass füllt einen eigenen Meldeschein aus und bestätigt ihn mit der eigenen Karte – nacheinander auf diesem Handy oder über denselben Link auf dem eigenen. Ehe- oder Lebenspartner:in und minderjährige Kinder stehen mit auf deinem Schein.`
      : "",
  },

  // Für diese Buchung gibt es schon einen ersten Meldeschein (oder ein „deutsch“), auf diesem Gerät aber keinen eigenen.
  schonDa: {
    titel: "Bist du eine weitere Person ohne deutschen Pass?",
    begonnen: "Für diese Buchung füllt schon jemand den ersten Meldeschein aus.",
    vorhanden: "Für diese Buchung liegt schon ein Meldeschein vor.",
    entfaellt: "Für diese Buchung hat schon jemand angegeben, die deutsche Staatsangehörigkeit zu haben.",
    text:
      "Hast du keinen deutschen Pass und stehst nicht als Ehe- oder Lebenspartner:in oder minderjähriges Kind auf dem Schein einer anderen Person, " +
      "füllst du jetzt deinen eigenen Meldeschein aus.",
    eigenen: "Meinen Meldeschein ausfüllen",
    deutsch: "Ich habe die deutsche Staatsangehörigkeit",
    ersterBestaetigen: "Ich habe den ersten Meldeschein ausgefüllt – jetzt bestätigen",
    selbstBegonnen: "Ich habe den ersten Meldeschein selbst angefangen – hier neu beginnen",
    selbstEntfaellt: "Das habe ich angegeben – Angabe ändern",
    ueberQr: "Der erste Meldeschein kam über den QR-Code in der Wohnung. Kennt ihr diese Angaben nicht, fülle ihn hier neu aus",
    fertigTitel: "Alles klar – für dich ist nichts zu tun",
    fertigText: "Mit deutscher Staatsangehörigkeit brauchst du keinen Meldeschein. Schönen Aufenthalt!",
  },

  // Beim Speichern des ersten Meldescheins kam jemand anderes zuvor (409): nichts überschreiben, Angaben als eigenen Schein speichern.
  konflikt: {
    titel: "Jemand anderes war schneller",
    text:
      "Für diese Buchung hat gerade jemand anderes mit dem ersten Meldeschein angefangen. Deine Angaben sind noch hier – " +
      "speichere sie als deinen eigenen Meldeschein, du musst nichts neu eingeben.",
    speichern: "Als meinen eigenen Meldeschein speichern",
    selbst: "Ich habe den ersten Meldeschein selbst angefangen – hier fortsetzen",
  },

  // Ersten Meldeschein von einem Gerät bestätigen, auf dem er nicht ausgefüllt wurde.
  name: {
    titel: "Ersten Meldeschein bestätigen",
    text: "Damit niemand versehentlich den Meldeschein einer anderen Person bestätigt: Gib bitte den Familiennamen ein, der auf dem ersten Meldeschein steht.",
    feld: "Familienname auf dem ersten Meldeschein",
    weiter: "Weiter zur Bestätigung",
    falsch:
      "Der Name passt nicht zum ersten Meldeschein. Hast du einen eigenen Meldeschein ausgefüllt, öffne diesen Link bitte in dem Browser, in dem du ihn ausgefüllt hast.",
    zurueck: "Zurück",
  },

  // Block unter dem fertigen Schein: nächste Person, eigene Scheine auf diesem Handy, Zahl der übrigen (ohne Namen).
  weitere: {
    titel: "Noch jemand ohne deutschen Pass dabei?",
    text:
      "Jede:r weitere Erwachsene ohne deutschen Pass füllt einen eigenen Meldeschein aus – hier auf diesem Handy oder über denselben Link auf dem eigenen. " +
      "Bestätigen muss jede Person selbst, mit ihrer eigenen Karte oder ihrem eigenen Apple Pay. Ehe- oder Lebenspartner:in und minderjährige Kinder brauchen keinen eigenen.",
    knopf: "Weitere Person melden",
    stand: (n: number, x: number) => n === 1
      ? `Für diese Buchung gibt es einen weiteren Meldeschein${x ? ", er ist bestätigt." : ", die Bestätigung fehlt noch."}`
      : `Für diese Buchung gibt es ${n} weitere Meldescheine, davon ${x} bestätigt.`,
    voll: "Für diese Buchung sind schon alle Meldescheine angelegt. Fehlt noch jemand, schreibt uns bitte kurz über eure Buchungsnachricht.",
    abVortag: (datum: string) => `Weitere Meldescheine lassen sich ab dem Tag vor der Anreise anlegen (${datum}). Öffne dann einfach wieder diesen Link.`,
    diesesHandy: "Auf diesem Handy:",
    von: (vorname: string) => `Meldeschein von ${vorname}`,
    schein: (nr: number) => `Meldeschein ${nr}`,
    haupt: "Erster Meldeschein",
    staende: { offen: "angefangen", eingereicht: "Bestätigung fehlt", erhalten: "bestätigt", entfaellt: "nicht nötig", vernichtet: "abgeschlossen" },
    bestaetigen: "Bestätigen",
    fortsetzen: "Weiter ausfüllen",
  },

  // Eigener Schein einer weiteren Person: keine Erinnerung (kein Kanal zu ihr), das Token liegt nur auf diesem Gerät.
  person: {
    zuFrueh: (datum: string) =>
      `Deine Angaben sind gespeichert. Bestätigen kannst du sie erst am Anreisetag (${datum}). Öffne dann diesen Link wieder hier in diesem Browser – nur hier ist dein Meldeschein hinterlegt.`,
    ohneSpeicher: "Dein Browser speichert nichts. Bitte schließe die Seite erst, wenn dein Meldeschein bestätigt ist.",
    abgelaufen: "Dein Aufenthalt ist vorbei – dieser Meldeschein lässt sich nicht mehr ändern.",
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
    dochDeutsch: "Ich habe doch die deutsche Staatsangehörigkeit",
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
    staatsangehoerigkeit2: "Weitere Staatsangehörigkeit",
    keine: "keine",
    anschrift: "Wohnanschrift",
    strasse: "Straße",
    hausnummer: "Hausnr.",
    plz: "PLZ",
    ort: "Ort",
    land: "Land",
    passnummer: "Nummer des Passes oder Ausweises",
    foto: "Foto des Ausweisdokuments",
    fotoHinweis:
      "Datenseite mit Foto und Nummer, gut lesbar. Das Foto wird verschlüsselt gespeichert und gelöscht, sobald deine Angaben damit abgeglichen sind – spätestens bei deiner Abreise.",
    fotoWaehlen: "Foto aufnehmen oder auswählen",
    fotoOk: "Foto übernommen",
    fotoFehler: "Das Bild konnte nicht verarbeitet werden – bitte ein anderes Foto wählen.",
    mitreisende: "Mitreisende Angehörige ohne deutschen Pass",
    mitreisendeHinweis:
      "Wie viele Ehe- oder Lebenspartner:innen und minderjährige Kinder ohne deutsche Staatsangehörigkeit reisen mit dir? Sie stehen nur als Zahl auf deinem Schein, " +
      "Namen oder Ausweise braucht es nicht. Weitere Erwachsene ohne deutschen Pass füllen danach einen eigenen Meldeschein aus.",
    angehoerigeKeine: "keine",
    landWaehlen: "Land wählen …",
    weiter: "Weiter zur Bestätigung",
    sendet: "Wird gespeichert …",
    pflicht: "Bitte fülle die markierten Felder aus.",
    feldFehler: {
      familienname: "Familienname fehlt", vorname: "Vorname fehlt", geburtsdatum: "Geburtsdatum prüfen",
      staatsangehoerigkeit: "Staatsangehörigkeit wählen (nicht Deutschland)",
      anschrift: "Anschrift vollständig angeben", strasse: "Straße fehlt", ort: "Ort fehlt", land: "Land der Anschrift wählen",
      passnummer: "Dokumentnummer prüfen", anzahlAngehoerige: "Zahl der Angehörigen prüfen",
      ausweisFoto: "Ausweisfoto fehlt oder ist zu groß",
    },
  },

  // Steht im Scan-Schritt VOR dem ersten Foto: schon das Auslesen speichert es.
  einwilligung: {
    text:
      "Ich möchte den Meldeschein online ausfüllen. Ich bin einverstanden, dass mein Ausweisfoto verschlüsselt gespeichert und automatisch ausgelesen wird, bis meine Angaben damit abgeglichen sind, " +
      "und dass meine Unterschrift durch die Kartenbestätigung ersetzt wird (§ 29 Abs. 5 BMG). " +
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
      "Jede Person bestätigt mit ihrer eigenen Karte oder ihrem eigenen Apple Pay. Es wird nichts abgebucht, und Kartendaten speichern wir nicht.",
    ohneApplePay:
      "Das Apple Pay dieses Handys ist schon für eine andere Person verwendet. Bestätige mit deiner eigenen Karte und der Freigabe in deiner Banking-App – oder öffne denselben Link auf deinem eigenen Handy.",
    zuFrueh: (datum: string) =>
      `Deine Angaben sind gespeichert. Die Bestätigung ist erst am Anreisetag (${datum}) möglich. Öffne die Seite dann einfach wieder über den Link aus deiner Nachricht oder den QR-Code in der Unterkunft – fehlt die Bestätigung noch, erinnern wir dich an diesem Tag einmal per Nachricht.`,
    name: "Name des Karteninhabers",
    nameHinweis: "wie auf der Karte",
    nameFehlt: "Bitte trage den Namen des Karteninhabers ein.",
    knopf: "Kostenlos bestätigen",
    wartet: "Wird bestätigt …",
    fehlgeschlagen: "Die Bestätigung ist nicht durchgegangen. Bitte versuche es noch einmal oder nutze das Papierformular in deiner Unterkunft.",
    keineSca: "Deine Bank hat keine Identitätsprüfung durchgeführt. Bitte versuche es mit einer anderen Karte – oder fülle das Papierformular in deiner Unterkunft aus.",
    papierNoetig:
      "Diese Bestätigung reicht hier leider nicht aus. Bitte unterschreibe das Papierformular in deiner Unterkunft – es wurde nichts abgebucht. Alternativ kannst du es noch einmal mit Apple Pay oder einer anderen Karte versuchen.",
    eigeneKarte:
      "Diese Karte bzw. dieses Apple Pay wurde schon für eine andere Person bestätigt. Jede Person bestätigt mit ihrer eigenen Karte – auf dem eigenen Handy oder hier mit der eigenen Karte. Es wurde nichts abgebucht.",
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
    nurIchText:
      "Für dich ist nichts zu tun. Jetzt füllt jede:r Kolleg:in ohne deutschen Pass einen eigenen Meldeschein aus – hier nacheinander oder über denselben Link auf dem eigenen Handy.",
    nochmal: "Jetzt bestätigen",
    andereKarte: "Mit Apple Pay oder anderer Karte versuchen",
    eigeneKarte: "Mit meiner eigenen Karte bestätigen",
  },

  fuss: "Verantwortlich: Vincent Sarfi, SARFI Collection · Angaben nach §§ 29, 30 BMG · Speicherung ein Jahr ab Abreise, das Ausweisfoto nur bis zum Abgleich.",
  // Nur Englisch: dort gibt es keine eigene Datenschutzerklärung. Deutsch verlinkt die volle.
  datenschutzKurz: "",
};

export default meldeschein;
