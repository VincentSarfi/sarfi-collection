// About page (English). Structure mirrors locales/de/about.ts.
const about = {
  hero: {
    kicker: "About us",
    title: "The people behind SARFI Collection",
    imageAlt: "Panoramic drone shot of the Bavarian Forest",
  },
  profile: {
    imageAlt: "Vincent and Elena Sarfi",
    name: "Vincent & Elena Sarfi",
    role: "Hosts & owners of SARFI Collection",
  },
  story: {
    heading: "Our story",
    sections: [
      {
        heading: "How it all began",
        paragraphs: [
          "Becoming hosts was never the plan. We live here in the Bavarian Forest ourselves, with our two children, just around the corner from HAUS28. When the house next door at the Büchelstein came up for sale, we seized the chance – and that's how we ended up in hospitality, more or less by accident.",
          "The Bavarian Forest is our home, and we love it for its calm, its unspoiled nature and its very special atmosphere. That's exactly what we want to share with our guests.",
        ],
      },
      {
        heading: "HAUS28: fully renovated by ourselves",
        paragraphs: [
          "We renovated the A-frame house at the Büchelstein from the ground up ourselves. Vincent took care of all the building work, Elena of the entire interior. We welcomed our first guests at the end of April 2025, and plenty has been added since – most recently a wood-fired premium hot tub in the garden.",
        ],
      },
      {
        heading: "Haus Schönblick: five apartments, five characters",
        paragraphs: [
          "In September 2025, Haus Schönblick in Schöfweg-Langfurth followed, right by the Steinberg ski lift. Each of the five apartments has its own style: from a modern apartment with herringbone parquet and a panoramic balcony to a cosy cabin-style apartment with old farmhouse furniture. Groups can share a large panoramic terrace and a small garden.",
        ],
      },
      {
        heading: "What makes us hosts",
        paragraphs: [
          "We're building SARFI Collection with passion and heart. Because we live here ourselves, we know the region: the most beautiful hiking trails, the cosiest inns and the spots you won't find in any guidebook. We love passing these tips on – and if anything is ever missing, we're there quickly.",
        ],
      },
    ],
    ratingLine: (rating: string, count: number) =>
      `Our guests have rewarded us for it: we're Airbnb Superhosts, HAUS28 is a "Guest Favourite" in the top 5% on Airbnb and has won the Booking.com Traveller Review Award 2026. Across all platforms we're rated ${rating} out of 5 stars from ${count} reviews.`,
  },
  facts: {
    heading: "At a glance",
    items: [
      { label: "Hosts", value: "Vincent & Elena Sarfi" },
      { label: "Home", value: "at the Büchelstein in Grattersdorf, Bavarian Forest" },
      { label: "HAUS28", value: "welcoming guests since April 2025" },
      { label: "Haus Schönblick", value: "welcoming guests since September 2025" },
      { label: "Awards", value: "Airbnb Superhost · Guest Favourite · Booking.com Traveller Review Award 2026" },
    ],
  },
  values: {
    heading: "Our values",
    items: [
      {
        icon: "🌲",
        title: "Close to nature",
        text: "Our homes are designed so that nature is always present – not in spite of it, but in harmony with it.",
      },
      {
        icon: "✦",
        title: "Quality",
        text: "High-quality furnishings, loving details and meticulous care – that's our standard.",
      },
      {
        icon: "💬",
        title: "A personal touch",
        text: "We're always there for our guests: direct communication, quick replies and personal tips.",
      },
      {
        icon: "🌿",
        title: "Sustainability",
        text: "We take great care to be gentle on the nature and the region we love so much.",
      },
    ],
  },
  superhost: {
    title: "Airbnb Superhost",
    text: "We're recognized as Superhosts – for exceptional hospitality, fast communication and consistently outstanding reviews.",
  },
  cta: {
    text: "Get to know us in person – we'd love to hear from you.",
    contactLabel: "Get in touch",
    homesLabel: "Our holiday homes",
  },
};

export default about;
