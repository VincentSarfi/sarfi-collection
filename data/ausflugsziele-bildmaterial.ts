// Bildmaterial, Links und Freigaben je Ausflugsziel (/ausflugsziele).
//
// Regel: Ein Bild kommt nur auf die Seite, wenn der Betreiber es schriftlich
// freigegeben hat, und der Bildnachweis steht genau so daneben, wie er ihn
// verlangt. Ohne Bild bleibt die Kachel im bisherigen Stil (Emoji, Farbe).
// Angefragt am 11.10.2026 per Mail an alle Betreiber, Skigebiet am 12.10.
// per WhatsApp. Stand der Antworten: Cockpit, Karte „Werbematerial“.
//
// Links geprüft am 12.10.2026 (HTTP 200). baumwipfelpfad.bayern ist nur eine
// Mail-Domain ohne Website, deshalb bleibt treetop-walks.com.

export type BildFreigabe = {
  /** Pfad unter public/ */
  src: string;
  width: number;
  height: number;
  alt: { de: string; en: string };
  /** Bildnachweis im Wortlaut der Freigabe */
  credit: string;
};

export type AusflugszielMaterial = {
  website: string;
  /** weitere Links mit Erlaubnis des Betreibers, z. B. Webcam */
  links?: { label: { de: string; en: string }; url: string }[];
  bilder: BildFreigabe[];
  freigabe: {
    stand: "freigegeben" | "angefragt";
    /** wer, wann, wie */
    notiz: string;
  };
};

export const ausflugszieleMaterial: Record<string, AusflugszielMaterial> = {
  "pullman-city": {
    website: "https://www.pullmancity.de",
    bilder: [],
    freigabe: { stand: "angefragt", notiz: "Mail an info@pullmancity.de am 11.10.2026" },
  },
  baumwipfelpfad: {
    website: "https://treetop-walks.com/bayerischer-wald/",
    bilder: [],
    freigabe: { stand: "angefragt", notiz: "Mail an info@baumwipfelpfad.bayern am 11.10.2026" },
  },
  nationalpark: {
    website: "https://www.nationalpark-bayerischer-wald.bayern.de/",
    bilder: [
      {
        src: "/images/ausflugsziele/nationalpark/tierfreigelaende-braunbaer.webp",
        width: 1500,
        height: 1000,
        alt: {
          de: "Braunbär im Tier-Freigelände des Nationalparks Bayerischer Wald, Besucher schauen vom Weg aus zu",
          en: "Brown bear in the Bavarian Forest National Park animal enclosure, visitors watching from the path",
        },
        credit: "Elke Ohland / Nationalpark Bayerischer Wald",
      },
      {
        src: "/images/ausflugsziele/nationalpark/haus-zur-wildnis.webp",
        width: 1500,
        height: 780,
        alt: {
          de: "Besucherzentrum Haus zur Wildnis im Nationalpark Bayerischer Wald",
          en: "Haus zur Wildnis visitor centre in the Bavarian Forest National Park",
        },
        credit: "Johannes Haslinger / Nationalpark Bayerischer Wald",
      },
      {
        src: "/images/ausflugsziele/nationalpark/waldwildnis-totholz.webp",
        width: 1500,
        height: 1000,
        alt: {
          de: "Waldwildnis im Frühling: Totholz und junge Fichten im Nationalpark Bayerischer Wald",
          en: "Forest wilderness in spring: deadwood and young spruces in the Bavarian Forest National Park",
        },
        credit: "Gregor Wolf / Nationalpark Bayerischer Wald",
      },
    ],
    freigabe: {
      stand: "freigegeben",
      notiz:
        "Annette Nigl, Leiterin Presse, Nationalparkverwaltung, Mail vom 12.10.2026: Bilder dürfen auf die Homepage, Fotovermerk „Name des Fotografen / Nationalpark Bayerischer Wald“.",
    },
  },
  "skigebiet-sonnenwald": {
    website: "https://www.steinberglift.de",
    links: [
      {
        label: { de: "Webcam: Schnee live checken", en: "Webcam: check the snow live" },
        url: "https://www.steinberglift.de/de/ski-lift/webcam.html",
      },
    ],
    bilder: [],
    freigabe: {
      stand: "freigegeben",
      notiz:
        "Josef Altmann per WhatsApp am 12.10.2026: „ja könnt ihr gerne machen“ (Fotos/Logo, Webcam-Link). Bilddateien liegen noch nicht vor.",
    },
  },
  "indoor-golf": {
    website: "https://arena.deggendorfer-golfclub.de",
    bilder: [],
    freigabe: { stand: "angefragt", notiz: "Mail an info@deggendorfer-golfclub.de am 11.10.2026" },
  },
  elypso: {
    website: "https://www.elypso.de",
    bilder: [],
    freigabe: { stand: "angefragt", notiz: "Mail an info@elypso.de am 11.10.2026" },
  },
  joska: {
    website: "https://www.joska.com",
    bilder: [],
    freigabe: { stand: "angefragt", notiz: "Mail an info@joska.com am 11.10.2026" },
  },
};
