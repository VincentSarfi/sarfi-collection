// Digital registration form (Sec. 29 (5) Federal Registration Act) — target
// of the link in the guest message / the QR code in the unit. Only guests
// without German citizenship have to complete it; Apple Pay or a card check with
// 3-D Secure (no charge) replaces the signature.
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
    vorlageUnvollstaendig: "This link is incomplete. Please scan the QR code in your accommodation or fill in the paper form there.",
    vorlageUngueltig:
      "This link works from the day before arrival until departure. If it still doesn't work, please scan the QR code in your accommodation or fill in the paper form there.",
    bereitsEingereicht: "The details have already been submitted – please just confirm them.",
    zuViele: "Too many attempts. Please wait a few minutes and then try again.",
    erneut: "Try again",
  },

  aufenthalt: (einheit: string, von: string, bis: string) => `${einheit} · ${von} – ${bis}`,

  frage: {
    titel: "Are you all German citizens?",
    text:
      "In Germany only guests who are not German citizens have to complete a registration form (Meldeschein) on arrival (Sec. 29 Federal Registration Act). " +
      "German citizens have been exempt since 2025.",
    ja: "We are all German citizens",
    nein: "No – complete the registration form",
    hinweisPersonen: (n: number) => n > 1 ? `${n} guests are booked. If anyone does not hold German citizenship, that person completes the form; a spouse or partner and minor children are listed on it too.` : "",
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
    mitreisende: "Accompanying family members",
    mitreisendeHinweis:
      "Add your spouse or partner and minor children who are not German citizens – only their nationality, no names needed. " +
      "Other adults without a German passport please fill in the paper form in the accommodation.",
    mitStaat: (n: number) => `Nationality of person ${n}`,
    mitHinzufuegen: "+ Add person",
    entfernen: "Remove",
    landWaehlen: "Choose country …",
    weiter: "Continue to confirmation",
    sendet: "Saving …",
    pflicht: "Please complete the highlighted fields.",
    feldFehler: {
      familienname: "Surname missing", vorname: "First name missing", geburtsdatum: "Check date of birth",
      staatsangehoerigkeit: "Choose nationality (not Germany)", anschrift: "Enter your full address",
      passnummer: "Check document number", ausstellendesLand: "Check issuing country", mitreisende: "Choose the nationality of each accompanying person (not Germany)",
      ausweisFoto: "ID photo missing or too large",
    },
  },

  // Shown in the scan step BEFORE the first photo: reading it already stores it.
  einwilligung: {
    text:
      "I would like to complete the registration form online. I agree that a photo of my ID document is stored encrypted and read automatically, and that my signature is replaced by the card confirmation (Sec. 29 (5) BMG). " +
      "I can withdraw this at any time by email; the paper form then applies. I have read the privacy notice.",
    datenschutz: "Privacy notice (German)",
    fehlt: "Please tick the consent box first.",
  },

  karte: {
    titel: "Confirm your details – instead of a signature",
    text:
      "German law allows a card check with strong customer authentication to replace the signature (Sec. 29 (5) BMG). " +
      "Easiest with Apple Pay: one tap, Face ID or Touch ID, done – no card details to type. " +
      "Without Apple Pay, use your own card and approve the check in your banking app. " +
      "Nothing is charged and we do not store your card details.",
    zuFrueh: (datum: string) =>
      `Your details are saved. The confirmation is only possible on your day of arrival (${datum}). Just reopen this page then via the link in your message or the QR code in your accommodation – if the confirmation is still missing, we will remind you once by message that day.`,
    name: "Cardholder name",
    knopf: "Confirm (free of charge)",
    wartet: "Confirming …",
    fehlgeschlagen: "The confirmation did not go through. Please try again or use the paper form in your accommodation.",
    keineSca: "Your bank did not perform an identity check. Please try another card – or fill in the paper form in your accommodation.",
    papierNoetig:
      "Unfortunately this confirmation is not sufficient here. Please sign the paper form in your accommodation – nothing has been charged. Alternatively, you can try again with Apple Pay or another card.",
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
    andereKarte: "Try Apple Pay or another card",
  },

  fuss: "Responsible: Vincent Sarfi, SARFI Collection · Details under Secs. 29, 30 BMG · stored for one year from departure, then deleted.",
  // Short privacy notice: there is no English privacy policy (Art. 12 GDPR).
  datenschutzKurz:
    "Privacy: Vincent Sarfi (hallo@sarfi-collection.de) processes your registration details under the German Federal Registration Act (Sec. 29, 30 BMG; Art. 6(1)(c) GDPR). " +
    "The ID photo and its automatic reading are based on your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time; the paper form is always available instead. " +
    "The booking number and PIN in the link from your check-in message are checked with our channel manager Smoobu (processor); we record when that link is first opened and may send one reminder on your day of arrival (Art. 6(1)(f) GDPR). " +
    "The confirmation runs via Stripe (Apple Pay or card); nothing is charged and we do not store card details. " +
    "Your details and ID photo are stored encrypted on our servers in Germany; encrypted backups without ID photos are kept with Backblaze (USA, processor, EU standard contractual clauses). " +
    "Everything is deleted automatically one year after departure. On request we must make registration forms available to the competent authorities (e.g. police). " +
    "You have the right to access, rectification, erasure, restriction and objection, and to lodge a complaint with a supervisory authority (Bavaria: BayLDA). " +
    "Full details (German): sarfi-collection.de/datenschutz",
};

export default meldeschein;
