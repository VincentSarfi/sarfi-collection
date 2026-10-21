// Digital registration form (Sec. 29 (5) Federal Registration Act) — target
// of the link in the guest message / the QR code in the unit. Only guests
// without German citizenship have to complete it, every adult their own
// (Sec. 29 (2) BMG); Apple Pay or a card check with 3-D Secure (no charge)
// replaces the signature.
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
    zuVieleNeu: "A lot of forms were just started for this booking. Please wait a few minutes and then try again.",
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
    nurIch: "I am German, my travelling colleagues are not",
    hinweisPersonen: (n: number) => n > 1
      ? `${n} guests are booked. Every adult without a German passport completes their own form and confirms it with their own card – one after another on this phone or using the same link on their own phone. A spouse or partner and minor children are listed on your form.`
      : "",
  },

  schonDa: {
    titel: "Are you another person without a German passport?",
    begonnen: "Someone is already filling in the first registration form for this booking.",
    vorhanden: "There is already a registration form for this booking.",
    entfaellt: "Someone has already stated for this booking that they are a German citizen.",
    text:
      "If you don't hold a German passport and aren't listed on another person's form as spouse, partner or minor child, " +
      "complete your own form now.",
    eigenen: "Complete my form",
    deutsch: "I am a German citizen",
    ersterBestaetigen: "I completed the first form – confirm it now",
    selbstBegonnen: "I started the first form myself – start again here",
    selbstEntfaellt: "That was me – change my answer",
    ueberQr: "The first form came in via the QR code in the accommodation. If you don't recognise it, fill it in again here",
    fertigTitel: "All set – nothing to do for you",
    fertigText: "As a German citizen you don't need a registration form. Enjoy your stay!",
  },

  konflikt: {
    titel: "Someone else was quicker",
    text:
      "Someone else has just started the first registration form for this booking. Your details are still here – " +
      "save them as your own form, no need to enter anything again.",
    speichern: "Save as my own form",
    selbst: "I started the first form myself – continue here",
  },

  name: {
    titel: "Confirm the first form",
    text: "So that nobody confirms another person's form by mistake: please enter the surname shown on the first registration form.",
    feld: "Surname on the first form",
    weiter: "Continue to confirmation",
    falsch:
      "The name doesn't match the first form. If you completed a form of your own, please open this link in the browser you used to fill it in.",
    zurueck: "Back",
  },

  weitere: {
    titel: "Anyone else without a German passport?",
    text:
      "Every other adult without a German passport completes their own form – here on this phone or using the same link on their own phone. " +
      "Every person confirms it themselves, with their own card or their own Apple Pay. Spouses, partners and minor children don't need their own.",
    knopf: "Register another person",
    stand: (n: number, x: number) => n === 1
      ? `There is one more form for this booking${x ? ", it is confirmed." : ", its confirmation is still missing."}`
      : `There are ${n} more forms for this booking, ${x} of them confirmed.`,
    voll: "All forms for this booking have already been started. If someone is missing, please send us a short message via your booking.",
    abVortag: (datum: string) => `More forms can be started from the day before arrival (${datum}). Just open this link again then.`,
    diesesHandy: "On this phone:",
    von: (vorname: string) => `Form for ${vorname}`,
    schein: (nr: number) => `Form ${nr}`,
    haupt: "First form",
    staende: { offen: "started", eingereicht: "confirmation missing", erhalten: "confirmed", entfaellt: "not needed", vernichtet: "closed" },
    bestaetigen: "Confirm",
    fortsetzen: "Continue",
  },

  person: {
    zuFrueh: (datum: string) =>
      `Your details are saved. You can confirm them on the day of arrival (${datum}). Then open this link again here in this browser – your form is linked to it.`,
    ohneSpeicher: "Your browser doesn't store anything. Please keep this page open until your form is confirmed.",
    abgelaufen: "Your stay is over – this form can no longer be changed.",
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
    dochDeutsch: "I am a German citizen after all",
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
    staatsangehoerigkeit2: "Second nationality",
    keine: "none",
    anschrift: "Home address",
    strasse: "Street",
    hausnummer: "No.",
    plz: "Postcode",
    ort: "City",
    land: "Country",
    passnummer: "Passport or ID card number",
    foto: "Photo of your ID document",
    fotoHinweis:
      "Data page with photo and number, clearly legible. The photo is stored encrypted and deleted as soon as your details have been checked against it – at the latest on your departure.",
    fotoWaehlen: "Take or choose a photo",
    fotoOk: "Photo added",
    fotoFehler: "The image could not be processed – please choose another photo.",
    mitreisende: "Accompanying family without a German passport",
    mitreisendeHinweis:
      "How many spouses, partners and minor children who are not German citizens are travelling with you? They are listed on your form only as a number, " +
      "no names or IDs needed. Other adults without a German passport complete their own form afterwards.",
    angehoerigeKeine: "none",
    landWaehlen: "Choose country …",
    weiter: "Continue to confirmation",
    sendet: "Saving …",
    pflicht: "Please complete the highlighted fields.",
    feldFehler: {
      familienname: "Surname missing", vorname: "First name missing", geburtsdatum: "Check date of birth",
      staatsangehoerigkeit: "Choose nationality (not Germany)",
      anschrift: "Enter your full address", strasse: "Street missing", ort: "City missing", land: "Choose the country of your address",
      passnummer: "Check document number", anzahlAngehoerige: "Check the number of family members",
      ausweisFoto: "ID photo missing or too large",
    },
  },

  // Shown in the scan step BEFORE the first photo: reading it already stores it.
  einwilligung: {
    text:
      "I would like to complete the registration form online. I agree that a photo of my ID document is stored encrypted and read automatically until my details have been checked against it, " +
      "and that my signature is replaced by the card confirmation (Sec. 29 (5) BMG). " +
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
      "Every person confirms with their own card or their own Apple Pay. Nothing is charged and we do not store your card details.",
    ohneApplePay:
      "The Apple Pay on this phone has already been used for another person. Confirm with your own card and the approval in your banking app – or open the same link on your own phone.",
    zuFrueh: (datum: string) =>
      `Your details are saved. The confirmation is only possible on your day of arrival (${datum}). Just reopen this page then via the link in your message or the QR code in your accommodation – if the confirmation is still missing, we will remind you once by message that day.`,
    name: "Cardholder name",
    nameHinweis: "as shown on the card",
    nameFehlt: "Please enter the cardholder name.",
    knopf: "Confirm (free of charge)",
    wartet: "Confirming …",
    fehlgeschlagen: "The confirmation did not go through. Please try again or use the paper form in your accommodation.",
    keineSca: "Your bank did not perform an identity check. Please try another card – or fill in the paper form in your accommodation.",
    papierNoetig:
      "Unfortunately this confirmation is not sufficient here. Please sign the paper form in your accommodation – nothing has been charged. Alternatively, you can try again with Apple Pay or another card.",
    eigeneKarte:
      "This card or Apple Pay has already been used to confirm another person. Every person confirms with their own card – on their own phone or here with their own card. Nothing has been charged.",
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
    nurIchText:
      "Nothing to do for you. Now every colleague without a German passport completes their own form – here one after another or using the same link on their own phone.",
    nochmal: "Confirm now",
    andereKarte: "Try Apple Pay or another card",
    eigeneKarte: "Confirm with my own card",
  },

  fuss: "Responsible: Vincent Sarfi, SARFI Collection · Details under Secs. 29, 30 BMG · stored for one year from departure, the ID photo only until it has been checked.",
  // Short privacy notice: there is no English privacy policy (Art. 12 GDPR).
  datenschutzKurz:
    "Privacy: Vincent Sarfi (hallo@sarfi-collection.de) processes your registration details under the German Federal Registration Act (Sec. 29, 30 BMG; Art. 6(1)(c) GDPR). " +
    "Every adult without German citizenship completes their own form; accompanying spouses, partners and minor children are recorded only as a number. " +
    "The ID photo and its automatic reading are based on your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time; the paper form is always available instead. " +
    "The photo is only used to check your details and is deleted once they have been checked, at the latest on departure; we keep only a note of the check. " +
    "Document type, issuing country and expiry date are used for this check only: they are kept encrypted with the photo and deleted with it. " +
    "The booking number and PIN in the link from your check-in message are checked with our channel manager Smoobu (processor); we record when that link is first opened and may send one reminder on your day of arrival (Art. 6(1)(f) GDPR). " +
    "To link this device to your own form, the page keeps a random code in your browser's local storage, filed under the accommodation and your travel dates; it is removed the next time you open the page after departure. We store only a hash of it and delete it after departure. " +
    "The confirmation runs via Stripe (Apple Pay or card); nothing is charged and we do not store card details. So that every person confirms with their own card, we keep a non-reversible check value of the card or Apple Pay token until departure and refuse a card that has already confirmed another person of the booking. " +
    "Your details and ID photo are stored encrypted on our servers in Germany; encrypted backups without ID photos are kept with Backblaze (USA, processor, EU standard contractual clauses). " +
    "Your details are deleted automatically one year after departure. On request we must make registration forms available to the competent authorities (e.g. police). " +
    "You have the right to access, rectification, erasure, restriction and objection, and to lodge a complaint with a supervisory authority (Bavaria: BayLDA). " +
    "Full details (German): sarfi-collection.de/datenschutz",
};

export default meldeschein;
