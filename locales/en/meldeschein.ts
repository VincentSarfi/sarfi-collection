// Digital registration form (Sec. 29 (5) Federal Registration Act) — target
// of the link in the guest message / the QR code in the unit. Only guests
// without German citizenship have to complete it; a card check with 3-D Secure
// (no charge) replaces the signature.
const meldeschein = {
  eyebrow: "Sarfi Collection",
  titel: "Registration form – done in two minutes",
  sprachwechsel: "Deutsche Version",
  laden: "One moment …",

  fehler: {
    titel: "That didn't work just now",
    standard: "The page can't be loaded right now. Please try again in a moment.",
    linkUngueltig: "This link is not (or no longer) valid. Please use the link from your message or scan the QR code in your accommodation.",
    keinAufenthalt: "There is no current stay for this code. The QR code works on the day of arrival and during your stay.",
    keinToken: "This page belongs to the link in your booking message – please open it from there.",
    erneut: "Try again",
  },

  aufenthalt: (einheit: string, von: string, bis: string) => `${einheit} · ${von} – ${bis}`,

  frage: {
    titel: "Are you a German citizen?",
    text:
      "In Germany only guests who are not German citizens have to complete a registration form (Meldeschein) on arrival (Sec. 29 Federal Registration Act). " +
      "German citizens have been exempt since 2025.",
    ja: "Yes, I am a German citizen",
    nein: "No – complete the registration form",
    hinweisPersonen: (n: number) => n > 1 ? `This applies to the person who booked. Accompanying persons are listed in the form (${n} guests booked).` : "",
  },

  scan: {
    titel: "Take a photo of your passport or ID",
    text:
      "Photograph the data page of your passport (the page with your photo and the two lines of code at the bottom) or the back of your ID card. " +
      "We read the details automatically – you only check them afterwards.",
    tipp: "Hold it straight, good light, the code lines fully visible.",
    knopf: "Take or choose a photo",
    liest: "Reading …",
    erkannt: "Details recognised – please check them.",
    unsicher: "Details recognised, but not all check digits match – please check carefully.",
    nichtErkannt: "The code could not be read. You can also fill in the form by hand.",
    manuell: "Continue without photo recognition",
  },

  formular: {
    titel: "Registration form",
    intro:
      "Please enter the details exactly as they appear in your passport or ID card. Afterwards you confirm them with a short card check – " +
      "this replaces the signature, nothing is charged.",
    familienname: "Surname",
    vorname: "First name(s)",
    geburtsdatum: "Date of birth",
    staatsangehoerigkeit: "Nationality",
    anschrift: "Home address (street, postcode, city, country)",
    ausweisArt: "ID document",
    reisepass: "Passport",
    personalausweis: "National ID card",
    passnummer: "Document number",
    ausstellendesLand: "Issuing country",
    foto: "Photo of your ID document",
    fotoHinweis: "Data page with photo and number, clearly legible. The photo is stored encrypted and deleted one year after your departure.",
    fotoWaehlen: "Take or choose a photo",
    fotoOk: "Photo added",
    fotoFehler: "The image could not be processed – please choose another photo.",
    mitreisende: "Accompanying persons",
    mitreisendeHinweis: "List your spouse/partner and minor children without German citizenship here; other adults please complete their own form (open the link again).",
    mitName: "Surname, first name",
    mitGeburtsdatum: "Date of birth",
    mitStaat: "Nationality",
    mitHinzufuegen: "+ Add person",
    entfernen: "Remove",
    landWaehlen: "Choose country …",
    einwilligung:
      "I agree that the registration form is recorded electronically and that my signature is replaced by the card confirmation (Sec. 29 (5) BMG). I have read the privacy notice.",
    datenschutz: "Privacy notice",
    weiter: "Continue to confirmation",
    sendet: "Saving …",
    pflicht: "Please complete the highlighted fields.",
    feldFehler: {
      familienname: "Surname missing", vorname: "First name missing", geburtsdatum: "Check date of birth",
      staatsangehoerigkeit: "Choose nationality (not Germany)", anschrift: "Enter your full address",
      passnummer: "Check document number", ausstellendesLand: "Check issuing country", mitreisende: "Check accompanying persons",
      ausweisFoto: "ID photo missing or too large",
    },
  },

  karte: {
    titel: "Confirm your details – instead of a signature",
    text:
      "German law allows a card check with strong customer authentication to replace the signature (Sec. 29 (5) BMG). " +
      "Easiest with Apple Pay or Google Pay: one tap, Face ID or fingerprint, done – no card details to type. " +
      "Nothing is charged and nothing is stored.",
    zuFrueh: (datum: string) => `Your details are saved. The confirmation is only possible on your day of arrival (${datum}) – we will remind you by message. You can reopen this page at any time.`,
    name: "Cardholder name",
    knopf: "Confirm (free of charge)",
    wartet: "Confirming …",
    fehlgeschlagen: "The confirmation did not go through. Please try again or use the paper form in your accommodation.",
    keineSca: "Your bank did not perform an identity check. Please try another card – or fill in the paper form in your accommodation.",
    ohneStripe: "Your details are saved. Please also sign the paper form in your accommodation.",
    papier: "No card at hand? Then please sign the paper form in your accommodation – your details here remain saved.",
  },

  fertig: {
    entfaelltTitel: "All set – nothing else to do",
    entfaelltText: "As a German citizen you don't need a registration form. Enjoy your stay!",
    erhaltenTitel: "Thank you – registration complete",
    erhaltenText: "Your details are confirmed and stored securely. No paper form is needed. Enjoy your stay!",
    eingereichtTitel: "Details saved",
    eingereichtText: "Your details are on file, but the confirmation is still missing.",
    nochmal: "Confirm now",
  },

  fuss: "Responsible: Vincent Sarfi, SARFI Collection · Details under Secs. 29, 30 BMG · stored for one year from departure, then deleted.",
};

export default meldeschein;
