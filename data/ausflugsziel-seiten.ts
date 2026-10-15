// Eigene Seiten für einzelne Ausflugsziele (/ausflugsziele/[slug], nur Deutsch).
//
// Warum eigene Seiten: Google zeigt ganze Seiten, keine Abschnitte. Die
// Übersicht /ausflugsziele erscheint für Suchen nach einzelnen Zielen gar
// nicht (Search Console, Juli–Oktober 2026). Deshalb bekommen die Ziele mit
// Bezug zu unseren Häusern eine eigene Seite – bewusst nur wenige und mit
// mehr Inhalt als in der Übersicht (Google wertet viele gleich gebaute
// Seiten als Spam). Pullman City und Passau haben stattdessen Blogbeiträge.
//
// Fakten nur mit Quelle, geprüft am 15.10.2026:
// - Büchelstein: Tourenportal Landkreis Deggendorf (module.tourinfra.com,
//   Tour 396573); Variante ab Kerschbaum laut Outdooractive-Tour; Start an der
//   Haustür von HAUS28 laut Vincent.
// - Brotjacklriegel: Touristikverein Sonnenwald (region-sonnenwald.de, Mail
//   vom 13.10.2026), dieselben Angaben wie in locales/de/ausflugsziele.ts.
// - Steinberglift: steinberglift.de (Startseite, /de/infos.html,
//   /de/ski-lift/kinderland.html); Stoaberg Alm laut Flyer und steinberglift.de.
// - Nationalparkzentrum Lusen: nationalpark-bayerischer-wald.bayern.de
//   (Einrichtungen › NPZ Lusen) und treetop-walks.com (Besucherinformationen,
//   Preise 2026).
// Fahrzeiten aus data/surroundings.ts, Fotos aus data/ausflugsziele-bildmaterial.ts.

import { driveMinutes as m, restaurants } from "@/data/surroundings";

/** Fahrzeit zum Gasthaus Lohner (Ortskern Grattersdorf) aus data/surroundings.ts, z. B. 5 */
const lohner = (haus: "fromHaus28" | "fromSchoenblick") =>
  parseInt(restaurants.find((r) => r.name === "Gasthaus Lohner")?.[haus].replace(/\D/g, "") ?? "", 10);

/** Unsere übrigen Gasthaus-Tipps mit Fahrzeit ab HAUS28, z. B. „Stoaberg Alm (am Steinberglift, Schöfweg, ~4 min), …“ */
const weitereGasthaeuserAbHaus28 = () => {
  const namen = restaurants
    .filter((r) => r.name !== "Gasthaus Lohner")
    .map((r) => `${r.name.replace(/ \(.*\)$/, "")} (${r.place}, ${r.fromHaus28})`);
  return namen.length > 1 ? `${namen.slice(0, -1).join(", ")} und ${namen.at(-1)}` : namen.join("");
};

export type ZielSeite = {
  slug: string;
  /** Einträge auf /ausflugsziele, die hierher verlinken (Anker-IDs) */
  hubIds: string[];
  /** Fotos: Schlüssel in ausflugszieleMaterial oder "wanderung" (eigene Fotos) */
  bildQuellen: string[];
  /** Live-Webcam aus ausflugszieleMaterial (nur Steinberglift) */
  webcamVon?: string;
  /** Offizielle Websites: Schlüssel in ausflugszieleMaterial */
  websiteVon: string[];
  title: string;
  description: string;
  h1: string;
  untertitel: string;
  /** Antwort in 2–4 Sätzen ganz oben – für Leser, Google-Snippets und KI-Suchen */
  kurzantwort: string;
  /** Hinweis, der aktuell wichtig ist (z. B. Sperrung) */
  hinweis?: string;
  fakten: { label: string; wert: string }[];
  /** link: interner Verweis unter dem Abschnitt, z. B. auf unsere Gasthaus-Tipps */
  abschnitte: { h2: string; absaetze: string[]; liste?: string[]; link?: { href: string; text: string } }[];
  faq: { frage: string; antwort: string }[];
  /** Übernachten in der Nähe: zuerst das Haus, das am nächsten liegt */
  unterkunft: { zuerst: "haus28" | "schoenblick"; haus28: string; schoenblick: string };
  schema: {
    typ: "TouristAttraction" | "SkiResort";
    name: string;
    geo: { lat: number; lng: number };
    adresse: { strasse?: string; plz?: string; ort: string };
  };
  /** Weitere Seiten und Blogbeiträge, auf die die Seite verlinkt */
  verwandt: { href: string; text: string }[];
};

/** Stand der Fakten – sichtbar auf jeder Seite und als dateModified im Schema */
export const STAND = { iso: "2026-10-15", text: "15. Oktober 2026" };

export const zielSeiten: ZielSeite[] = [
  // ── Büchelstein ────────────────────────────────────────────────────────────
  {
    slug: "buechelstein-wanderung",
    hubIds: ["buechelstein-wanderung"],
    bildQuellen: ["wanderung"],
    websiteVon: [],
    title: "Büchelstein-Wanderung: Rundweg 54 bei Grattersdorf",
    description:
      "Büchelsteiner-Runde Nr. 54: 7,6 km auf den Großen Büchelstein (831 m) und zur Kapelle Rastbuche – mit Start, Parken, Einkehr und Tipps vom Gastgeber.",
    h1: "Büchelstein-Wanderung: die Büchelsteiner-Runde Nr. 54",
    untertitel: "Rundweg bei Grattersdorf auf den Großen Büchelstein (831 m) – für Gäste von HAUS28 direkt ab der Haustür",
    kurzantwort:
      "Die Büchelsteiner-Runde (Wanderweg Nr. 54) führt von Grattersdorf über den Kleinen Büchelstein auf den Großen Büchelstein (831 m) und über die Wallfahrtskapelle Rastbuche aus dem 18. Jahrhundert zurück. Laut Tourenportal des Landkreises Deggendorf ist sie 7,6 km lang, dauert rund 3 Stunden 20 Minuten und hat 440 Höhenmeter. Eingestuft ist sie als mittel – wegen moosiger Felsplatten sind feste Wanderschuhe ratsam.",
    fakten: [
      { label: "Strecke", wert: "7,6 km Rundweg ab Dorfmitte Grattersdorf" },
      { label: "Gehzeit", wert: "ca. 3 Std. 20 Min." },
      { label: "Höhenmeter", wert: "440 m" },
      { label: "Gipfel", wert: "Großer Büchelstein, 831 m" },
      { label: "Markierung", wert: "Nr. 54 „Büchelsteiner-Runde“" },
      { label: "Schwierigkeit", wert: "mittel" },
      { label: "Start", wert: "Dorfmitte Grattersdorf oder Wanderparkplatz Kerschbaum" },
      { label: "Ab HAUS28", wert: "direkt ab der Haustür: ca. 7 km · 2–2,5 Std. · ca. 300 Hm" },
    ],
    abschnitte: [
      {
        h2: "Der Weg im Überblick",
        absaetze: [
          "Die offizielle Runde beginnt am Dorfplatz von Grattersdorf. Über die Büchelsteiner Straße geht es bergauf, nach etwa einem Kilometer links ab zum Kleinen Büchelstein. Weiter führt der Weg durch den Büchelsteiner Wald hinauf zum Großen Büchelstein.",
          "Am Gipfel steht die hölzerne Startrampe der Drachenflieger, die Drachenschanze. Von hier reicht der Blick bei klarer Sicht über den Bayerischen Wald bis ins Donautal, bei Föhn sogar bis zu den Alpen. Danach geht es zur Wallfahrtskapelle Rastbuche aus dem 18. Jahrhundert, die unter Denkmalschutz steht, und über die Stationen eines Kreuzwegs zurück nach Grattersdorf.",
        ],
        liste: [
          "Dorfplatz Grattersdorf",
          "Büchelsteiner Straße bergauf, nach ca. 1 km links",
          "Kleiner Büchelstein",
          "Großer Büchelstein (831 m) mit Drachenschanze",
          "Wallfahrtskapelle Rastbuche (18. Jh.)",
          "über den Kreuzweg zurück nach Grattersdorf",
        ],
      },
      {
        h2: "Start direkt am HAUS28",
        absaetze: [
          "HAUS28 liegt am Büchelstein. Unsere Gäste laufen an der Haustür los, in den Wald und hinauf zum Gipfel, und steigen in Kerschbaum in die Runde ein. Diese Variante ist mit rund 7 km, 2 bis 2,5 Stunden und etwa 300 Höhenmetern etwas kürzer als die offizielle Runde ab Dorfmitte. Unterwegs zeigt die Markierung Nr. 54 den Weg.",
        ],
      },
      {
        h2: "Parken für Tagesgäste",
        absaetze: [
          "Wer nicht bei uns wohnt, parkt laut Tourenportal in der Dorfmitte von Grattersdorf oder am Wanderparkplatz Kerschbaum (Ortsteil Kerschbaum, 94541 Grattersdorf).",
        ],
      },
      {
        h2: "Gut zu wissen",
        absaetze: [
          "Unterwegs, etwa am Kleinen Büchelstein, führt der Weg über moosbewachsene Felsplatten – feste Wanderschuhe sind deshalb ratsam. Vorher das Wetter prüfen. Einzelne Privat-, Forst- und Feldwege können gesperrt sein – dann den Schildern folgen.",
          `Zum Einkehren nach der Runde haben wir unsere Lieblingsgasthäuser zusammengestellt. Am nächsten liegt das Gasthaus Lohner im Ortskern von Grattersdorf, vom HAUS28 rund ${lohner("fromHaus28")} Minuten mit dem Auto.`,
        ],
        link: { href: "/ausflugsziele#einkehren", text: "Unsere Gasthaus-Tipps mit Fotos und Fahrzeiten" },
      },
    ],
    faq: [
      {
        frage: "Wie lang ist die Büchelstein-Wanderung?",
        antwort:
          "Die offizielle Büchelsteiner-Runde Nr. 54 ab der Dorfmitte von Grattersdorf ist 7,6 km lang, dauert rund 3 Stunden 20 Minuten und hat 440 Höhenmeter. Ab Kerschbaum bzw. ab HAUS28 sind es etwa 7 km in 2 bis 2,5 Stunden mit rund 300 Höhenmetern.",
      },
      {
        frage: "Wo startet die Büchelsteiner-Runde und wo kann man parken?",
        antwort:
          "Start ist die Dorfmitte von Grattersdorf, ein zweiter Einstieg liegt in Kerschbaum. Parken kannst du in der Dorfmitte oder am Wanderparkplatz Kerschbaum. Gäste von HAUS28 laufen direkt an der Haustür los.",
      },
      {
        frage: "Wie schwer ist die Wanderung auf den Büchelstein?",
        antwort:
          "Das Tourenportal stuft die Runde als mittel ein. Wer längere Wanderungen gewohnt ist, schafft sie gut. Weil der Weg über moosbewachsene Felsplatten führt, sind feste Wanderschuhe ratsam.",
      },
      {
        frage: "Wo kann man nach der Wanderung einkehren?",
        antwort:
          `Im Ortskern von Grattersdorf, wo die offizielle Runde beginnt, liegt das Gasthaus Lohner – vom HAUS28 rund ${lohner("fromHaus28")} Minuten mit dem Auto. Unsere weiteren Tipps, mit Fahrzeit ab HAUS28: ${weitereGasthaeuserAbHaus28()}. Fotos und Links stehen auf unserer Ausflugsziele-Seite unter „Gasthäuser in der Nähe“. Bitte vorher die Ruhetage prüfen.`,
      },
    ],
    unterkunft: {
      zuerst: "haus28",
      haus28:
        "Du startest an der Haustür und kommst nach der Runde zurück zum privaten Whirlpool im Garten – HAUS28 liegt direkt am Büchelstein.",
      schoenblick: `Rund ${lohner("fromSchoenblick")} Minuten mit dem Auto bis Grattersdorf – und vor der eigenen Tür wartet der Brotjacklriegel.`,
    },
    schema: {
      typ: "TouristAttraction",
      name: "Büchelstein-Wanderung (Büchelsteiner-Runde Nr. 54)",
      geo: { lat: 48.8083, lng: 13.1755 },
      adresse: { plz: "94541", ort: "Grattersdorf" },
    },
    verwandt: [
      { href: "/ausflugsziele/brotjacklriegel", text: "Brotjacklriegel – Wanderung ab Haus Schönblick" },
      { href: "/haus28", text: "HAUS28 – A-Frame mit Whirlpool am Büchelstein" },
    ],
  },

  // ── Brotjacklriegel ────────────────────────────────────────────────────────
  {
    slug: "brotjacklriegel",
    hubIds: ["brotjacklriegel"],
    bildQuellen: ["brotjacklriegel"],
    websiteVon: ["brotjacklriegel"],
    title: "Brotjacklriegel: Wanderung zum Aussichtsturm (1.011 m)",
    description:
      "Turmweg ab Langfurth: 1,6 km, ca. 45 Minuten, leicht – mit Erlebnispfad für Kinder, Aussichtsturm und Turmstüberl. Start 400 m vom Haus Schönblick.",
    h1: "Brotjacklriegel: Wanderung auf den Hausberg der Region Sonnenwald",
    untertitel: "1.011 m, Aussichtsturm und Erlebnispfad – zu Fuß ab Haus Schönblick",
    kurzantwort:
      "Der Brotjacklriegel (1.011 m) ist der Hausberg der Region Sonnenwald. Am schnellsten bist du über den Turmweg ab Langfurth oben: 1,6 km, leicht, rund 45 Minuten. Für Familien gibt es zusätzlich den Sonnenwald-Erlebnispfad mit zehn Stationen. Oben stehen der Aussichtsturm des Bayerischen Waldvereins und das Turmstüberl.",
    hinweis:
      "Laut Touristikverein Sonnenwald ist die Aussichtsplattform des Turms derzeit aus Brandschutzgründen gesperrt; an der Wiederöffnung wird gearbeitet (Stand Oktober 2026).",
    fakten: [
      { label: "Gipfel", wert: "1.011 m" },
      { label: "Turmweg Langfurth", wert: "1,6 km · ca. 45 Min. · leicht" },
      { label: "Start", wert: "Langfurth, ca. 400 m zu Fuß ab Haus Schönblick" },
      { label: "Große Runde", wert: "Brotjacklriegel-Rundweg, ca. 12 km · ca. 4,5 Std. · leicht" },
      { label: "Erlebnispfad", wert: "Sonnenwald-Erlebnispfad mit zehn Stationen, ca. 2 km ab Parkplatz Sturmriegel (Jacklparkplatz)" },
      { label: "Parken", wert: "Langfurth 55 (beim Feuerwehrhaus) oder Wanderparkplatz Daxstein" },
      { label: "Ab HAUS28", wert: `ca. ${m.brotjacklriegel.haus28} Min. mit dem Auto bis Langfurth` },
    ],
    abschnitte: [
      {
        h2: "Die Wege auf den Gipfel",
        absaetze: [
          "Der kürzeste und leichteste Aufstieg ist der Turmweg ab Langfurth: 1,6 km und etwa 45 Minuten. Wer mehr Strecke möchte, nimmt einen der anderen Turmwege oder den großen Brotjacklriegel-Rundweg mit rund 12 km.",
        ],
        liste: [
          "Ab Langfurth: 1,6 km · ca. 45 Min. · leicht",
          "Ab Ölberg: 1,6 km · ca. 1 Std. 10 Min.",
          "Ab Daxstein: 1,8 km · ca. 55 Min. · schwierig",
          "Ab Mitterdorf/Schöfweg: 4,4 km · ca. 1 Std. 30 Min. · leicht",
          "Brotjacklriegel-Rundweg: ca. 12 km · ca. 4,5 Std. · leicht",
        ],
      },
      {
        h2: "Erlebnispfad für Kinder",
        absaetze: [
          "Der Sonnenwald-Erlebnispfad hat zehn Stationen und ist laut Touristikverein besonders für Kinder und Familien gedacht. Er führt vom Parkplatz Sturmriegel (Jacklparkplatz) rund 2 km hinauf zum Turm; für die Wanderung nennt der Touristikverein 2,5 bis 3 Stunden – mit Pausen an den Stationen ein Ausflug mit Programm.",
        ],
      },
      {
        h2: "Aussichtsturm und Turmstüberl",
        absaetze: [
          "Auf dem Gipfel stehen der Aussichtsturm des Bayerischen Waldvereins und das Turmstüberl. Die Aussichtsplattform ist derzeit aus Brandschutzgründen gesperrt (Stand Oktober 2026).",
          "Das Turmstüberl hat bei Wanderwetter bis 8. November 2026 täglich geöffnet (donnerstags Ruhetag), vom 24. Dezember 2026 bis 10. Januar 2027 täglich von 10 bis 17 Uhr und ab 16. Januar 2027 samstags und sonntags.",
        ],
      },
    ],
    faq: [
      {
        frage: "Wie lange dauert der Aufstieg auf den Brotjacklriegel?",
        antwort:
          "Über den Turmweg ab Langfurth sind es 1,6 km und rund 45 Minuten, der Weg gilt als leicht. Die anderen Turmwege dauern zwischen etwa 55 Minuten und 1,5 Stunden.",
      },
      {
        frage: "Ist der Aussichtsturm auf dem Brotjacklriegel geöffnet?",
        antwort:
          "Laut Touristikverein Sonnenwald ist die Aussichtsplattform derzeit aus Brandschutzgründen gesperrt; an der Wiederöffnung wird gearbeitet (Stand Oktober 2026). Das Turmstüberl auf dem Gipfel ist davon nicht betroffen: bis 8. November 2026 täglich außer donnerstags, vom 24. Dezember bis 10. Januar täglich, ab 16. Januar am Wochenende.",
      },
      {
        frage: "Ist die Wanderung für Kinder geeignet?",
        antwort:
          "Ja. Der Turmweg ab Langfurth ist leicht und in rund 45 Minuten geschafft. Für Familien gibt es außerdem den Sonnenwald-Erlebnispfad mit zehn Stationen vom Parkplatz Sturmriegel (Jacklparkplatz) zum Turm.",
      },
      {
        frage: "Wo parkt man für den Brotjacklriegel?",
        antwort:
          "In Langfurth 55 beim Feuerwehrhaus oder am Wanderparkplatz Daxstein. Gäste von Haus Schönblick gehen zu Fuß: Bis zum Einstieg in Langfurth sind es rund 400 m.",
      },
    ],
    unterkunft: {
      zuerst: "schoenblick",
      schoenblick: "Nach rund 400 m zu Fuß bist du am Einstieg in Langfurth – das Auto bleibt stehen.",
      haus28: `Rund ${m.brotjacklriegel.haus28} Minuten mit dem Auto bis Langfurth, Parken beim Feuerwehrhaus.`,
    },
    schema: {
      typ: "TouristAttraction",
      name: "Brotjacklriegel (1.011 m) mit Aussichtsturm",
      geo: { lat: 48.817, lng: 13.2167 },
      adresse: { ort: "Schöfweg" },
    },
    verwandt: [
      { href: "/ausflugsziele/steinberglift", text: "Steinberglift – Skifahren und Rodeln in Langfurth" },
      { href: "/ausflugsziele/buechelstein-wanderung", text: "Büchelstein-Wanderung ab HAUS28" },
      { href: "/schoenblick", text: "Haus Schönblick – Ferienwohnungen in Langfurth" },
    ],
  },

  // ── Steinberglift ──────────────────────────────────────────────────────────
  {
    slug: "steinberglift",
    hubIds: ["skigebiet-sonnenwald"],
    bildQuellen: ["skigebiet-sonnenwald"],
    webcamVon: "skigebiet-sonnenwald",
    websiteVon: ["skigebiet-sonnenwald"],
    title: "Steinberglift Schöfweg: Skifahren & Rodeln für Familien",
    description:
      "Familien-Skilift in Langfurth: 400 m Hauptpiste, Kinderland mit Förderband, Rodelpiste, Skischule, Verleih und Live-Webcam – 600 m vom Haus Schönblick.",
    h1: "Steinberglift in Schöfweg-Langfurth: Skifahren und Rodeln für Familien",
    untertitel: "Familien-Skilift mit Kinderland, Skischule und Rodelpiste – rund 600 m vom Haus Schönblick",
    kurzantwort:
      "Der Steinberglift in Langfurth bei Schöfweg ist ein Skigebiet für Familien und Anfänger: eine 400 m lange Hauptpiste, ein Kinderland mit Förderband und 110 m langer Übungspiste, ein eigener Rodelhang sowie Skischule und Skiverleih vor Ort. Beschneit wird mit einer modernen Anlage; ob Schnee liegt, zeigt die Live-Webcam. Vom Haus Schönblick sind es rund 600 m.",
    fakten: [
      { label: "Adresse", wert: "Steinberg 7, 94572 Schöfweg" },
      { label: "Hauptpiste", wert: "400 m" },
      { label: "Kinderland", wert: "Förderband, Karussell und 110 m Übungspiste – ideal im Kindergartenalter" },
      { label: "Lifte", wert: "Steinberg-Skilift und Anfänger-Schlepplift" },
      { label: "Rodeln", wert: "eigener Rodelhang für größere Kinder und Erwachsene" },
      { label: "Skischule", wert: "Ski- und Snowboardkurse für Anfänger, Familien und Fortgeschrittene" },
      { label: "Verleih", wert: "Skiverleih vor Ort, DSV-geprüfte Skiwerkstatt" },
      { label: "Schnee", wert: "moderne Beschneiungsanlage, Live-Webcam" },
      { label: "Preise & Zeiten", wert: "aktuell auf steinberglift.de" },
      { label: "Ab Haus Schönblick", wert: "ca. 600 m zu Fuß" },
      { label: "Ab HAUS28", wert: `ca. ${m.steinberglift.haus28} Min. mit dem Auto` },
    ],
    abschnitte: [
      {
        h2: "Für wen der Steinberglift passt",
        absaetze: [
          "Der Steinberglift ist kein großes Skigebiet, sondern ein Familien-Skilift: Die Hauptpiste ist 400 m lang, das Kinderland mit Förderband und Übungspiste ist laut Betreiber ideal für Kinder im Kindergartenalter. In der Skischule gibt es Ski- und Snowboardkurse für Anfänger, Familien und Fortgeschrittene, im Verleih die Ausrüstung für Groß und Klein.",
          "Wer lieber rodelt: Für größere Kinder und Erwachsene gibt es einen eigenen Rodelhang.",
        ],
      },
      {
        h2: "Einkehr: die Stoaberg Alm",
        absaetze: [
          "Direkt am Lift liegt die Stoaberg Alm mit bayerischer Küche und durchgehend warmer Küche – donnerstags Kesselfleisch, freitags Spareribs, sonntags Schweinebraten und Ente. Sie hat ganzjährig geöffnet: laut Flyer von Dezember bis März täglich, außerhalb der Skisaison laut steinberglift.de donnerstags bis sonntags von 10 bis 22 Uhr. Auf steinberglift.de heißt das Wirtshaus noch „Stoaberghütt’n“.",
        ],
      },
      {
        h2: "Mehr Wintersport rund um Schöfweg",
        absaetze: [
          "In Schöfweg gibt es insgesamt sieben Liftanlagen, darunter den Brotjacklriegellift beim Feuerwehrhaus in Langfurth. Langläufer finden rund 23 km gespurte Loipen in Schöfweg und Umgebung. Für einen großen Skitag fährst du rund eine Stunde zum Großen Arber.",
        ],
      },
      {
        h2: "Wenn kein Schnee liegt",
        absaetze: [
          "Ob die Lifte laufen, hängt vom Schnee ab – ein Blick auf die Webcam spart die Fahrt. Gute Alternativen sind das Erlebnisbad elypso in Deggendorf mit Saunawelt und die Eishalle in Grafenau.",
        ],
      },
    ],
    faq: [
      {
        frage: "Wie weit ist der Steinberglift vom Haus Schönblick entfernt?",
        antwort: `Rund 600 m – du gehst zu Fuß hinüber. Vom HAUS28 in Grattersdorf sind es etwa ${m.steinberglift.haus28} Minuten mit dem Auto.`,
      },
      {
        frage: "Ist der Steinberglift für Anfänger und Kinder geeignet?",
        antwort:
          "Ja. Es gibt einen Anfänger-Schlepplift, ein Kinderland mit Förderband und 110 m langer Übungspiste – laut Betreiber ideal für Kinder im Kindergartenalter – und eine Skischule mit Kursen für Anfänger und Familien.",
      },
      {
        frage: "Kann man am Steinberglift Ski ausleihen?",
        antwort: "Ja, es gibt einen Skiverleih vor Ort für Erwachsene und Kinder sowie eine DSV-geprüfte Skiwerkstatt.",
      },
      {
        frage: "Wie sehe ich, ob am Steinberglift Schnee liegt?",
        antwort:
          "Auf der Live-Webcam des Steinberglifts – sie ist auf dieser Seite eingebunden. Die Pisten werden zusätzlich mit einer modernen Beschneiungsanlage beschneit.",
      },
      {
        frage: "Gibt es am Steinberglift etwas zu essen?",
        antwort:
          "Ja, die Stoaberg Alm direkt am Lift. Sie hat ganzjährig geöffnet, laut Flyer von Dezember bis März täglich.",
      },
    ],
    unterkunft: {
      zuerst: "schoenblick",
      schoenblick:
        "Rund 600 m bis zum Lift: Skischuhe an und zu Fuß hinüber. Mit fünf Ferienwohnungen auch für Familien und Gruppen bis 20 Personen.",
      haus28: `Etwa ${m.steinberglift.haus28} Minuten mit dem Auto – und nach dem Skitag in den Whirlpool.`,
    },
    schema: {
      typ: "SkiResort",
      name: "Steinberglift Langfurth (Schöfweg)",
      geo: { lat: 48.8197, lng: 13.1983 },
      adresse: { strasse: "Steinberg 7", plz: "94572", ort: "Schöfweg" },
    },
    verwandt: [
      { href: "/ausflugsziele/brotjacklriegel", text: "Brotjacklriegel – Wanderung zum Aussichtsturm" },
      { href: "/schoenblick/gruppen", text: "Gruppenunterkunft bis 20 Personen im Haus Schönblick" },
      { href: "/schoenblick", text: "Haus Schönblick – Ferienwohnungen am Steinberglift" },
    ],
  },

  // ── Nationalparkzentrum Lusen ──────────────────────────────────────────────
  {
    slug: "nationalparkzentrum-lusen",
    hubIds: ["baumwipfelpfad", "nationalpark"],
    bildQuellen: ["baumwipfelpfad", "nationalpark"],
    websiteVon: ["baumwipfelpfad", "nationalpark"],
    title: "Baumwipfelpfad & Tier-Freigelände Neuschönau: Infos",
    description:
      "Baumwipfelpfad, Tier-Freigelände und Hans-Eisenmann-Haus an einem Tag: Preise 2026, Öffnungszeiten, Parken, Hunde, barrierearm – 40 min ab Schönblick.",
    h1: "Nationalparkzentrum Lusen: Baumwipfelpfad, Tier-Freigelände und Hans-Eisenmann-Haus",
    untertitel: "Drei Ziele nebeneinander in Neuschönau – ein ganzer Tag im Nationalpark Bayerischer Wald",
    kurzantwort:
      "Im Nationalparkzentrum Lusen bei Neuschönau liegen drei Ziele nebeneinander: der Baumwipfelpfad mit 1.300 m Holzsteg in 8 bis 25 m Höhe und dem 44 m hohen Aussichtsturm, das kostenlose Tier-Freigelände mit Luchs, Wolf, Bär und Wisent und das Besucherzentrum Hans-Eisenmann-Haus. Zusammen füllen sie einen ganzen Tag und sind weitgehend barrierearm.",
    hinweis:
      "Laut Nationalpark sind die Greifvogel-Voliere und das Wildkatzen-Gehege im Tier-Freigelände derzeit gesperrt (Stand Oktober 2026).",
    fakten: [
      { label: "Baumwipfelpfad", wert: "1.300 m Holzsteg in 8–25 m Höhe, Aussichtsturm „Baumei“ 44 m, Besuch ca. 1,5–2 Std." },
      { label: "Eintritt Baumwipfelpfad", wert: "Erwachsene 13 €, ermäßigt 12 €, Kinder 6–14 J. 11 €, unter 6 frei, Familie 31 € (Stand 2026)" },
      { label: "Tier-Freigelände", wert: "ganzjährig frei zugänglich, kostenlos, im Winter geräumt; Rundweg 7 km, 3–4 Std., Abkürzungen möglich" },
      { label: "Hans-Eisenmann-Haus", wert: "1. Mai–9. Nov. täglich 9–18 Uhr, 26. Dez.–30. April täglich 9–17 Uhr, 11. Nov.–25. Dez. geschlossen" },
      { label: "Parken", wert: "Tageskarte 5 €, ermäßigt 3 € (Sommer ab 16 Uhr, Winter ab 15 Uhr), erste 30 Min. frei; Ausweichparkplatz Graupsäge gebührenfrei" },
      { label: "Hunde", wert: "Tier-Freigelände ja (außer begehbare Gehege), Baumwipfelpfad nein – kostenlose Hundeboxen vor Ort" },
      { label: "Barrierefreiheit", wert: "von „Reisen für Alle“ geprüft; Baumwipfelpfad barrierearm, Tier-Freigelände mit Kinderwagen und Rollstuhl" },
      { label: "Adresse", wert: "Böhmstraße 43 (Baumwipfelpfad) bzw. 39 (Nationalparkzentrum), 94556 Neuschönau" },
      { label: "Ab Haus Schönblick", wert: `ca. ${m.nationalparkLusen.schoenblick} Min. mit dem Auto` },
      { label: "Ab HAUS28", wert: `ca. ${m.nationalparkLusen.haus28} Min. mit dem Auto` },
    ],
    abschnitte: [
      {
        h2: "So planst du den Tag",
        absaetze: [
          "Für den Baumwipfelpfad rechnet der Betreiber mit eineinhalb bis zwei Stunden. Der Holzsteg führt mit höchstens 6 % Steigung in 8 bis 25 m Höhe durch die Baumkronen bis zum Aussichtsturm, dem „Baumei“, mit Rundumblick über den Nationalpark. Letzter Einlass ist eine Stunde vor Schließung; im Winter ist nicht täglich geöffnet – die aktuellen Zeiten stehen auf treetop-walks.com.",
          "Direkt daneben beginnt das Tier-Freigelände. Der ganze Rundweg ist 7 km lang und dauert drei bis vier Stunden, Abkürzungen sind möglich. Auf über 200 Hektar leben rund 40 Säugetier- und Vogelarten, darunter Luchse, Wölfe, Bären, Wisente, Fischotter, Habichtskäuze und Auerhühner. Im Hans-Eisenmann-Haus gibt es Ausstellungen zum Nationalpark – ein guter Plan B bei Regen.",
        ],
      },
      {
        h2: "Mit Kindern",
        absaetze: [
          "Am Baumwipfelpfad gibt es Erlebnisstationen entlang des Weges, Kinder unter 6 Jahren haben freien Eintritt. Im Tier-Freigelände entscheidet ihr selbst, wie weit ihr lauft – die Abkürzungen machen den Rundweg auch mit kleineren Kindern machbar.",
        ],
      },
      {
        h2: "Barrierearm: mit Rollstuhl, Rollator oder Kinderwagen",
        absaetze: [
          "Hans-Eisenmann-Haus, Tier-Freigelände, Baumwipfelpfad sowie das Pflanzen- und Gesteins-Freigelände wurden nach „Reisen für Alle“ geprüft. Der Baumwipfelpfad ist barrierearm und mit Rollstuhl oder Kinderwagen befahrbar, das Tier-Freigelände ist für Kinderwagen und Rollstühle geeignet. Damit ist das Nationalparkzentrum auch ein guter Ausflug für Senioren.",
        ],
      },
      {
        h2: "Mit Hund",
        absaetze: [
          "Ins Tier-Freigelände dürfen Hunde mit, nur nicht in die begehbaren Gehege wie das Wildschwein- oder Rotwildgehege – dafür gibt es ausgeschilderte Umwege. Auf den Baumwipfelpfad dürfen keine Tiere, auch nicht an der Leine oder in der Tasche (Ausnahme: Assistenzhunde). Vor Ort stehen kostenlose Hundeboxen mit Wasser.",
        ],
      },
      {
        h2: "Parken, Bus und Essen",
        absaetze: [
          "Die Parkplätze P1 und P2 liegen direkt am Baumwipfelpfad; die Tageskarte kostet 5 €, die ersten 30 Minuten sind frei. Kostenlos parkst du am Ausweichparkplatz Graupsäge, von dort fährt der Igelbus zur Haltestelle Nationalparkzentrum Lusen. Wer mit dem Zug anreist, bekommt an der Kasse des Baumwipfelpfads 1 € Nachlass.",
          "Direkt am Pfad liegen die Waldwirtschaft mit Biergarten und Spielplatz und das Café Eisenmann mit Sonnenterrasse; ein eigenes Picknick ist erlaubt.",
        ],
      },
    ],
    faq: [
      {
        frage: "Was kostet der Baumwipfelpfad in Neuschönau?",
        antwort:
          "Erwachsene zahlen 13 €, ermäßigt 12 €, Kinder von 6 bis 14 Jahren 11 €, Kinder unter 6 sind frei, die Familienkarte kostet 31 € (Stand 2026). Dazu kommt das Parken: 5 € pro Tag, die ersten 30 Minuten frei.",
      },
      {
        frage: "Ist das Tier-Freigelände im Nationalpark kostenlos?",
        antwort:
          "Ja. Das Tier-Freigelände am Nationalparkzentrum Lusen ist ganzjährig frei zugänglich und im Winter geräumt. Kosten fallen nur fürs Parken an.",
      },
      {
        frage: "Darf mein Hund mit?",
        antwort:
          "Ins Tier-Freigelände ja, außer in die begehbaren Gehege. Auf den Baumwipfelpfad nicht – dafür gibt es kostenlose Hundeboxen mit Wasser.",
      },
      {
        frage: "Ist der Baumwipfelpfad barrierefrei?",
        antwort:
          "Er ist barrierearm: Der Holzsteg hat höchstens 6 % Steigung und ist mit Rollstuhl und Kinderwagen befahrbar. Geprüft wurde er wie das Tier-Freigelände nach „Reisen für Alle“.",
      },
      {
        frage: "Wie lange braucht man für Baumwipfelpfad und Tier-Freigelände?",
        antwort:
          "Für den Baumwipfelpfad etwa 1,5 bis 2 Stunden, für den ganzen Rundweg durchs Tier-Freigelände 3 bis 4 Stunden. Zusammen ist das ein Tagesausflug; mit Abkürzungen geht es auch kürzer.",
      },
    ],
    unterkunft: {
      zuerst: "schoenblick",
      schoenblick: `Rund ${m.nationalparkLusen.schoenblick} Minuten mit dem Auto. Die Wohnungen B5 und B6 liegen im Erdgeschoss mit Terrasse.`,
      haus28: `Rund ${m.nationalparkLusen.haus28} Minuten mit dem Auto – Platz für bis zu 8 Personen und ein Whirlpool für den Abend.`,
    },
    schema: {
      typ: "TouristAttraction",
      name: "Nationalparkzentrum Lusen mit Baumwipfelpfad und Tier-Freigelände",
      geo: { lat: 48.891, lng: 13.485 },
      adresse: { strasse: "Böhmstraße 39", plz: "94556", ort: "Neuschönau" },
    },
    verwandt: [
      { href: "/ausflugsziele#nationalpark", text: "Alle Ausflugsziele im Bayerischen Wald" },
      { href: "/schoenblick", text: "Haus Schönblick – Ferienwohnungen in Schöfweg" },
    ],
  },
];

/** Seite zu einem Eintrag auf /ausflugsziele (für die Links in der Übersicht) */
export function zielSeiteFuer(hubId: string): ZielSeite | undefined {
  return zielSeiten.find((s) => s.hubIds.includes(hubId));
}

export function zielSeite(slug: string): ZielSeite | undefined {
  return zielSeiten.find((s) => s.slug === slug);
}
