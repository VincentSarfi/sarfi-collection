// Contact page (English). Structure mirrors locales/de/kontakt.ts.
const kontakt = {
  header: {
    kicker: "Contact",
    title: "We'd love to hear from you",
    note: "We speak English and German – feel free to write in whichever you prefer.",
  },
  form: {
    heading: "Send us a message",
    successTitle: "Thank you for your message!",
    successText: "We'll get back to you within 24 hours – usually much sooner.",
    nameLabel: "Name *",
    namePlaceholder: "John Smith",
    emailLabel: "Email *",
    emailPlaceholder: "john@example.com",
    phoneLabel: "Phone",
    phonePlaceholder: "+49 123 456789",
    subjectLabel: "Subject",
    subjectPlaceholder: "Please select…",
    subjectHaus28: "HAUS28 – enquiry",
    subjectSchoenblick: "Haus Schönblick – enquiry",
    subjectGruppe: "Group booking",
    subjectOther: "Other",
    messageLabel: "Message *",
    messagePlaceholder: "Your question or request…",
    privacyPre: "I have read the",
    privacyLink: "privacy policy",
    privacyPost: "and agree to the processing of my data. *",
    submit: "Send message",
    submitting: "Sending…",
    errSend: "Something went wrong while sending your message. Please try again.",
    errFallback:
      "Unfortunately your message could not be sent. Please email us directly at hallo@sarfi-collection.de.",
  },
  info: {
    heading: "Contact details",
    emailLabel: "Email",
    phoneLabel: "Phone",
    whatsappLabel: "WhatsApp",
    whatsappAction: "Send a message",
    locationsLabel: "Locations",
    locations: "Grattersdorf · Schöfweg",
    region: "Bavarian Forest, Germany",
    responseTitle: "⚡ Fast response times",
    responseText:
      "We usually reply within a few hours – and always within 24 hours.",
  },
  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        q: "How do I book direct?",
        a: "Pick your travel dates in the calendar on the property page and book right here on the website. Payment is handled securely via Stripe – by card, Apple Pay or Google Pay, with either a 50% deposit or payment in full. Your booking confirmation arrives by email straight away.",
      },
      {
        q: "Can I book several apartments at once?",
        a: "Yes! Just send us a message and we'll be happy to help you book multiple apartments at Haus Schönblick.",
      },
      {
        q: "How does check-in work?",
        a: "We offer self-check-in with a key box. You'll receive all the details by email or message about 24 hours before arrival.",
      },
      {
        q: "What happens if I need to cancel?",
        a: {
          beforeLink:
            "HAUS28: free cancellation up to 30 days before arrival, 50% refund up to 14 days, no refund after that. Schönblick apartments: free up to 14 days before arrival, 50% up to 7 days, no refund after that. Full details at",
          linkLabel: "sarfi-collection.de/stornierung",
          afterLink: ".",
        },
      },
      {
        q: "Are there discounts for longer stays?",
        a: "Yes – stays of 7 nights or more qualify for weekly discounts. Get in touch for a personal offer.",
      },
      {
        q: "Are pets welcome?",
        a: "On request and depending on the property. Please contact us before booking.",
      },
    ],
  },
};

export default kontakt;
