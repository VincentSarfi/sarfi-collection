// Über-uns-Seite (components/pages/UeberUnsPageContent.tsx).
const about = {
  hero: {
    kicker: "Über uns",
    title: "Die Menschen hinter SARFI Collection",
    imageAlt: "Panorama-Drohnenaufnahme Bayerischer Wald",
  },
  profile: {
    imageAlt: "Vincent und Elena Sarfi",
    name: "Vincent & Elena Sarfi",
    role: "Gastgeber & Inhaber SARFI Collection",
  },
  story: {
    heading: "Unsere Geschichte",
    sections: [
      {
        heading: "Wie alles begann",
        paragraphs: [
          "Gastgeber zu werden, war nie unser Plan. Wir leben selbst hier im Bayerischen Wald, mit unseren zwei Kindern, direkt um die Ecke von HAUS28. Als das Nachbarhaus am Büchelstein zu kaufen war, haben wir die Chance ergriffen – und sind so ganz zufällig in die Gastgeberbranche hineingerutscht.",
          "Der Bayerische Wald ist unsere Heimat, und wir lieben ihn für seine Ruhe, seine Ursprünglichkeit und seine besondere Atmosphäre. Genau das wollen wir mit unseren Gästen teilen.",
        ],
      },
      {
        heading: "HAUS28: in Eigenregie kernsaniert",
        paragraphs: [
          "Das A-Frame-Haus am Büchelstein haben wir in Eigenregie kernsaniert. Vincent hat sich um alles Handwerkliche gekümmert, Elena um die komplette Einrichtung. Ende April 2025 haben wir die ersten Gäste begrüßt. Seitdem ist einiges dazugekommen – zuletzt ein holzbeheizter Premium-HotTub im Garten.",
        ],
      },
      {
        heading: "Haus Schönblick: fünf Apartments, fünf Charaktere",
        paragraphs: [
          "Im September 2025 kam Haus Schönblick in Schöfweg-Langfurth dazu, direkt am Skilift Steinberg. Jedes der fünf Apartments hat seinen eigenen Stil: von der modernen Wohnung mit Fischgrätparkett und Panoramabalkon bis zur gemütlichen Hüttenwohnung mit alten Bauernmöbeln. Für Gruppen gibt es eine große Panoramaterrasse und einen kleinen Garten, die alle Gäste gemeinsam nutzen.",
        ],
      },
      {
        heading: "Was uns als Gastgeber ausmacht",
        paragraphs: [
          "Wir bauen SARFI Collection aus Leidenschaft und mit Herz auf. Weil wir selbst hier wohnen, kennen wir die Region: die schönsten Wanderwege, die gemütlichsten Gasthäuser und die Ecken, die in keinem Reiseführer stehen. Diese Tipps geben wir gern weiter – und wenn einmal etwas fehlt, sind wir schnell vor Ort.",
        ],
      },
    ],
    ratingLine: (rating: string, count: number) =>
      `Unsere Gäste danken es uns: Wir sind Airbnb Superhost, HAUS28 gehört als „Gäste-Favorit“ zu den besten 5 % auf Airbnb und wurde mit dem Booking.com Traveller Review Award 2026 ausgezeichnet. Über alle Plattformen kommen wir auf ${rating} von 5 Sternen aus ${count} Bewertungen.`,
  },
  facts: {
    heading: "Auf einen Blick",
    items: [
      { label: "Gastgeber", value: "Vincent & Elena Sarfi" },
      { label: "Zuhause", value: "am Büchelstein in Grattersdorf, Bayerischer Wald" },
      { label: "HAUS28", value: "Gäste seit April 2025" },
      { label: "Haus Schönblick", value: "Gäste seit September 2025" },
      { label: "Auszeichnungen", value: "Airbnb Superhost · Gäste-Favorit · Booking.com Traveller Review Award 2026" },
    ],
  },
  values: {
    heading: "Unsere Werte",
    items: [
      {
        icon: "🌲",
        title: "Naturnähe",
        text: "Unsere Unterkünfte sind so gestaltet, dass die Natur immer präsent ist – nicht trotz ihr, sondern mit ihr.",
      },
      {
        icon: "✦",
        title: "Qualität",
        text: "Hochwertige Ausstattung, liebevolle Details und sorgfältige Pflege – das ist unser Standard.",
      },
      {
        icon: "💬",
        title: "Persönlichkeit",
        text: "Wir sind immer für unsere Gäste da. Direkte Kommunikation, schnelle Antworten, persönliche Tipps.",
      },
      {
        icon: "🌿",
        title: "Nachhaltigkeit",
        text: "Wir achten auf einen schonenden Umgang mit der Natur und der Region, die wir so lieben.",
      },
    ],
  },
  superhost: {
    title: "Superhost auf Airbnb",
    text: "Wir sind als Superhost ausgezeichnet – für außergewöhnliche Gastfreundschaft, schnelle Kommunikation und konsequent 5-Sterne-Bewertungen.",
  },
  cta: {
    text: "Lerne uns persönlich kennen – wir freuen uns auf deine Anfrage.",
    contactLabel: "Kontakt aufnehmen",
    homesLabel: "Unsere Unterkünfte",
  },
};

export default about;
