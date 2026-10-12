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
  /**
   * Live-Bild mit Erlaubnis zum Einbinden. Nicht direkt im Browser laden,
   * denn dann ginge die IP jedes Besuchers an den Webcam-Host (DSGVO).
   * Entweder serverseitig durchreichen (mit Cache) oder erst auf Klick laden.
   */
  webcam?: { bild: string; seite: string };
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
    // Live-Bild, alle paar Minuten neu (Host e-ventis)
    webcam: {
      bild: "https://evfile01.de/00011187/webcam/current2.jpg",
      seite: "https://www.steinberglift.de/de/ski-lift/webcam.html",
    },
    bilder: [
      {
        src: "/images/ausflugsziele/skigebiet-sonnenwald/piste-und-stoaberghuette.webp",
        width: 1920,
        height: 1436,
        alt: {
          de: "Skigebiet Sonnenwald am Steinberglift von oben: Piste, Schlepplift und Stoaberghütte",
          en: "Sonnenwald ski area at the Steinberglift from above: slope, T-bar lift and Stoaberghütte",
        },
        credit: "Steinberglift Schöfweg",
      },
      {
        src: "/images/ausflugsziele/skigebiet-sonnenwald/kinderland-skischule.webp",
        width: 1920,
        height: 1440,
        alt: {
          de: "Skikurs im Kinderland am Steinberglift: Skilehrerin mit einer Reihe Kinder auf dem Förderband",
          en: "Ski lessons in the Steinberglift children's area: instructor with a line of children on the magic carpet",
        },
        credit: "Steinberglift Schöfweg",
      },
      {
        src: "/images/ausflugsziele/skigebiet-sonnenwald/schlepplift.webp",
        width: 1280,
        height: 851,
        alt: {
          de: "Schlepplift am Steinberg vor verschneitem Wald, unten das Kinderland",
          en: "T-bar lift at the Steinberg in front of snowy forest, children's area below",
        },
        credit: "Steinberglift Schöfweg",
      },
      {
        src: "/images/ausflugsziele/skigebiet-sonnenwald/rodeln.webp",
        width: 1920,
        height: 1273,
        alt: {
          de: "Zwei Kinder mit Schlitten im Schnee am Steinberglift",
          en: "Two children with sledges in the snow at the Steinberglift",
        },
        credit: "Steinberglift Schöfweg",
      },
    ],
    freigabe: {
      stand: "freigegeben",
      notiz:
        "Josef Altmann (Inhaber) per WhatsApp am 12.10.2026: „ja könnt ihr gerne machen“. Gemeint sind die Fotos von steinberglift.de und das Einbinden der Webcam (Klarstellung durch Vincent). Urheberrecht laut Impressum beim Steinberglift.",
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

/**
 * Fotos der Gasthäuser (Abschnitt „Gasthäuser in der Nähe“), Schlüssel ist
 * `name` aus restaurants in data/surroundings.ts. Gleiche Regel wie oben:
 * nur mit Freigabe, Bildnachweis im Wortlaut. Ranzinger, Zum Sonnenwald und
 * Lohner am 12.10.2026 per Mail angefragt (Cockpit-Karte „Gasthäuser“).
 */
export const gasthausMaterial: Record<string, { bilder: BildFreigabe[]; freigabe: string }> = {
  "Stoaberg Alm": {
    bilder: [
      {
        src: "/images/ausflugsziele/einkehren/stoaberg-alm-stube.webp",
        width: 1920,
        height: 1280,
        alt: {
          de: "Gaststube der Stoaberg Alm am Steinberglift mit Holztischen, Wagenrad-Leuchter und Kachelofen",
          en: "Dining room of the Stoaberg Alm at the Steinberglift with wooden tables, wagon-wheel chandelier and tiled stove",
        },
        credit: "Steinberglift Schöfweg",
      },
      {
        src: "/images/ausflugsziele/einkehren/stoaberg-alm-gaststube.webp",
        width: 1920,
        height: 1280,
        alt: {
          de: "Holzvertäfelte Gaststube der Stoaberg Alm mit Ofen und karierten Vorhängen",
          en: "Wood-panelled dining room of the Stoaberg Alm with stove and checked curtains",
        },
        credit: "Steinberglift Schöfweg",
      },
    ],
    freigabe:
      "Josef Altmann (Inhaber Steinberglift) per WhatsApp am 12.10.2026: Fotos von steinberglift.de dürfen genutzt werden. Quelle: Gastronomie-Seite steinberglift.de.",
  },
};
