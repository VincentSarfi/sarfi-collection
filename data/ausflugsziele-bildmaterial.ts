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
  /** Bildnachweis im Wortlaut der Freigabe; leer bei eigenen Fotos (kein Nachweis nötig) */
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
    bilder: [
      {
        src: "/images/ausflugsziele/baumwipfelpfad/baumei-luftaufnahme.webp",
        width: 1920,
        height: 1439,
        alt: {
          de: "Der Aussichtsturm „Baumei“ des Baumwipfelpfads Bayerischer Wald von oben, umgeben von Wald",
          en: "The “Baumei” observation tower of the Bavarian Forest Treetop Walk from above, surrounded by forest",
        },
        credit: "Erlebnis Akademie AG/Baumwipfelpfad Bayerischer Wald",
      },
      {
        src: "/images/ausflugsziele/baumwipfelpfad/aussicht-familie.webp",
        width: 1920,
        height: 1281,
        alt: {
          de: "Familie am Geländer des Baumwipfelpfads mit Blick über die Wälder des Bayerischen Waldes",
          en: "Family at the railing of the Treetop Walk looking out over the Bavarian Forest",
        },
        credit: "Erlebnis Akademie AG/Baumwipfelpfad Bayerischer Wald",
      },
      {
        src: "/images/ausflugsziele/baumwipfelpfad/pfad-baumkronen.webp",
        width: 1920,
        height: 1440,
        alt: {
          de: "Holzsteg des Baumwipfelpfads auf Höhe der Baumkronen im Sommer",
          en: "Wooden boardwalk of the Treetop Walk at treetop height in summer",
        },
        credit: "Erlebnis Akademie AG/Baumwipfelpfad Bayerischer Wald",
      },
    ],
    freigabe: {
      stand: "freigegeben",
      notiz:
        "Theresa Karl (Marketing, Erlebnis Akademie AG) per Mail am 12.10.2026: Bildmaterial aus dem Pressebereich eak-ag.de/eakag/presse/baumwipfelpfad-bayerischer-wald.php mit Bildnachweis „Erlebnis Akademie AG/Baumwipfelpfad Bayerischer Wald“. Fotos aus dem Pressepaket „Sommer“.",
    },
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
  // Neue Ziele aus Issue #6 – Links am 12.10.2026 geprüft (HTTP 200), Mails
  // am 12.10.2026 um 22:36 verschickt (Cockpit-Karte „Neue Ausflugsziele“).
  brotjacklriegel: {
    website: "https://region-sonnenwald.de/berge/brotjacklriegel",
    bilder: [],
    freigabe: {
      stand: "angefragt",
      notiz:
        "Mail an info@region-sonnenwald.de (Touristikverein Sonnenwald e.V.) am 12.10.2026, dazu gefragt: Aussichtsplattform wieder begehbar? Turmweg Langfurth 1,6 km/ca. 45 min richtig?",
    },
  },
  arber: {
    website: "https://www.arber.de/",
    bilder: [],
    freigabe: {
      stand: "angefragt",
      notiz: "Mail an arber@hohenzollern.com (z. Hd. Pressekontakt Andreas Stadler) am 12.10.2026; Bild- & Textdatenbank auf arber.de/presse",
    },
  },
  passau: {
    website: "https://tourismus.passau.de/",
    bilder: [],
    freigabe: {
      stand: "angefragt",
      notiz: "Mail an marketing@passau.de (Tourismus & Stadtmarketing, Andreas Seyller) am 12.10.2026, ausdrücklich für die Website einer Ferienunterkunft",
    },
  },
  museumsdorf: {
    website: "https://www.museumsdorf.com/",
    bilder: [],
    freigabe: { stand: "angefragt", notiz: "Mail an info@museumsdorf.com am 12.10.2026" },
  },
  "glasmuseum-frauenau": {
    website: "https://glasmuseum-frauenau.de/",
    links: [
      {
        label: { de: "Gläserne Gärten", en: "Glass gardens" },
        url: "https://glasmuseum-frauenau.de/besuch/glaeserne-gaerten/",
      },
    ],
    bilder: [],
    freigabe: { stand: "angefragt", notiz: "Mail an post@glasmuseum-frauenau.de am 12.10.2026" },
  },
};

/**
 * Fotos der Gasthäuser (Abschnitt „Gasthäuser in der Nähe“), Schlüssel ist
 * `name` aus restaurants in data/surroundings.ts. Gleiche Regel wie oben:
 * nur mit Freigabe, Bildnachweis im Wortlaut. Zum Sonnenwald und Lohner am
 * 12.10.2026 per Mail angefragt (Cockpit-Karte „Gasthäuser“).
 */
export const gasthausMaterial: Record<string, { bilder: BildFreigabe[]; freigabe: string }> = {
  "Panorama-Landgasthof Ranzinger": {
    bilder: [
      {
        src: "/images/ausflugsziele/einkehren/ranzinger-panorama-terrasse.webp",
        width: 1162,
        height: 774,
        alt: {
          de: "Panorama-Terrasse des Landgasthofs Ranzinger mit Blick über die Hügel des Bayerischen Waldes",
          en: "Panorama terrace of the Landgasthof Ranzinger overlooking the hills of the Bavarian Forest",
        },
        credit: "Panorama-Landgasthof Ranzinger",
      },
      {
        src: "/images/ausflugsziele/einkehren/ranzinger-brotzeit.webp",
        width: 900,
        height: 598,
        alt: {
          de: "Hausgemachte Brotzeit mit Geräuchertem, Brot und Rotwein im Landgasthof Ranzinger",
          en: "Homemade snack platter with smoked meat, bread and red wine at the Landgasthof Ranzinger",
        },
        credit: "Panorama-Landgasthof Ranzinger",
      },
      {
        src: "/images/ausflugsziele/einkehren/ranzinger-landgasthof.webp",
        width: 800,
        height: 600,
        alt: {
          de: "Der Panorama-Landgasthof Ranzinger in Langfurth von außen",
          en: "The Panorama-Landgasthof Ranzinger in Langfurth from outside",
        },
        credit: "Panorama-Landgasthof Ranzinger",
      },
    ],
    freigabe:
      "Luise Ranzinger per Mail am 12.10.2026: einverstanden mit der Empfehlung, auch mit Fotos von hotel-ranzinger.de. Nur Motive vom eigenen Haus genommen (keine Region-Bilder der Website).",
  },
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

/**
 * Büchelstein-Rundwanderung: eigene Fotos von Vincent (Drachenschanze am
 * Großen Büchelstein), 12.10.2026 für Website und Wanderung freigegeben.
 */
export const wanderungBilder: BildFreigabe[] = [
  {
    src: "/images/ausflugsziele/buechelstein/aussicht-felsen.webp",
    width: 2000,
    height: 1500,
    alt: {
      de: "Gipfelfelsen am Großen Büchelstein mit Blick über Felder, Wälder und Dörfer des Vorlands",
      en: "Summit rocks on the Großer Büchelstein looking out over fields, forests and villages",
    },
    credit: "",
  },
  {
    src: "/images/ausflugsziele/buechelstein/drachenschanze.webp",
    width: 1024,
    height: 768,
    alt: {
      de: "Holzrampe der Drachenschanze am Großen Büchelstein, dahinter weiter Blick ins Land unter Wolken",
      en: "Wooden hang-glider ramp on the Großer Büchelstein with a wide view across the countryside under clouds",
    },
    credit: "",
  },
];
