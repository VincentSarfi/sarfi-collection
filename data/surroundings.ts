// Umgebung: Gasthäuser, Anreise, Haustier-Regel – genutzt von FAQs,
// Gruppenseite und llms.txt. Recherchiert am 06.10.2026 (Websites der
// Betriebe, DB, Wikipedia); Fahrzeiten sind gerundete Schätzungen.

/**
 * Fahrzeiten mit dem Auto in Minuten – einzige Quelle für alle Seiten.
 * OSRM-Routing ab Hausadresse plus 15 % Puffer, auf 5 min gerundet
 * (geprüft 06.10.2026). Früher standen hier geschätzte Werte, die bis zu
 * 15 min zu knapp waren (z. B. Pullman City „15 min“ ab Schönblick).
 */
export const driveMinutes = {
  pullmanCity: { name: "Westernstadt Pullman City (Eging am See)", haus28: 30, schoenblick: 30 },
  /** Baumwipfelpfad, Tier-Freigelände und Hans-Eisenmann-Haus liegen zusammen in Neuschönau. */
  nationalparkLusen: { name: "Nationalparkzentrum Lusen mit Baumwipfelpfad und Tier-Freigelände (Neuschönau)", haus28: 45, schoenblick: 40 },
  /** 0 = zu Fuß erreichbar (ca. 600 m vom Haus Schönblick). */
  steinberglift: { name: "Skilift Steinberg (Langfurth)", haus28: 10, schoenblick: 0 },
  ruselArena: { name: "Rusel-Arena Indoor-Golf (Deggendorf-Rusel)", haus28: 25, schoenblick: 25 },
  grafenau: { name: "Grafenau Zentrum", haus28: 30, schoenblick: 25 },
  deggendorf: { name: "Deggendorf Zentrum", haus28: 30, schoenblick: 30 },
  hengersberg: { name: "Hengersberg (Einkaufen, A3)", haus28: 20, schoenblick: 20 },
  elypso: { name: "Erlebnisbad elypso mit Saunawelt (Deggendorf)", haus28: 35, schoenblick: 35 },
  glasmuseumFrauenau: { name: "Glasmuseum Frauenau", haus28: 40, schoenblick: 35 },
  arber: { name: "Großer Arber, Talstation Bergbahn", haus28: 60, schoenblick: 60 },
} as const;

/** „~30 min“ – Schreibweise für Tabellen und Listen (DE und EN gleich). */
export const ca = (minutes: number) => `~${minutes} min`;

/** Aufpreis pro Hund und Nacht im Haus Schönblick (HAUS28: keine Haustiere). */
export const PET_FEE_PER_NIGHT = 15;
export const PET_MAX = 2;

export type Restaurant = {
  name: string;
  place: string;
  placeEn: string;
  url: string;
  /** Kurzbeschreibung DE / EN */
  de: string;
  en: string;
  /** Fahrzeit mit dem Auto, gerundet */
  fromHaus28: string;
  fromSchoenblick: string;
};

/** Neue Gaststätte am Skilift – auch Raum für Feiern (Gruppenseite). */
export const stoabergAlm: Restaurant = {
  // Flyer der Betreiber: Eröffnung 24.09.2026, Steinberg 7, Tel. 09908/234
  name: "Stoaberg Alm",
  place: "am Steinberglift, Schöfweg",
  placeEn: "at the Steinberglift, Schöfweg",
  url: "https://www.steinberglift.de/de/ski-schule/gastronomie/wirtshaus-stoaberghuettn.html",
  de: "Neu seit September 2026: bayerische Küche, durchgehend warm – donnerstags Kesselfleisch, freitags Spareribs, sonntags Schweinebraten und Ente. April–November Do–So ab 10 Uhr, Dezember–März täglich.",
  en: "New since September 2026: Bavarian food served all day – Kesselfleisch on Thursdays, spare ribs on Fridays, roast pork and duck on Sundays. April–November Thu–Sun from 10 a.m., December–March daily.",
  fromHaus28: "~5 min",
  fromSchoenblick: "~3 min",
};

export const restaurants: Restaurant[] = [
  stoabergAlm,
  {
    name: "Panorama-Landgasthof Ranzinger",
    place: "Langfurth, Schöfweg",
    placeEn: "Langfurth, Schöfweg",
    url: "https://hotel-ranzinger.de/",
    de: "Regionale Küche, frisch und hausgemacht, auch vegane Gerichte – rund 600 m vom Haus Schönblick.",
    en: "Regional food, fresh and homemade, vegan dishes too – about 600 m from Haus Schönblick.",
    fromHaus28: "~6 min",
    fromSchoenblick: "~2 min",
  },
  {
    name: "Gasthof Zum Sonnenwald (Aulinger)",
    place: "Schöfweg",
    placeEn: "Schöfweg",
    url: "https://www.zum-sonnenwald.de/",
    de: "Bayerische Schmankerl mit Zutaten aus der Region, seit über 100 Jahren in Familienhand.",
    en: "Bavarian specialities made with regional produce, family-run for more than 100 years.",
    fromHaus28: "~10 min",
    fromSchoenblick: "~7 min",
  },
  {
    name: "Gasthaus Lohner",
    place: "Grattersdorf",
    placeEn: "Grattersdorf",
    url: "https://www.gasthaus-lohner.de/",
    de: "Bayerische Schmankerl im Ortskern von Grattersdorf, auch zum Mitnehmen.",
    en: "Bavarian specialities in the centre of Grattersdorf, takeaway available too.",
    fromHaus28: "~6 min",
    fromSchoenblick: "~10 min",
  },
];

/** Anreise – gleiche Fakten für beide Häuser. */
export const arrival = {
  de: "Mit dem Auto: A3 bis zur Ausfahrt Hengersberg, dann über die B 533 Richtung Schöfweg/Grafenau – von dort sind es rund 20 Minuten. Mit der Bahn: Nächster Fernbahnhof ist Plattling (ICE), von dort fährt die Waldbahn stündlich nach Deggendorf; ab Deggendorf sind es etwa 30 Minuten mit Taxi oder Mietwagen. Eine Abholung bieten wir nicht an – vor Ort ist ein Auto sehr zu empfehlen.",
  en: "By car: take the A3 to the Hengersberg exit, then the B 533 towards Schöfweg/Grafenau – about 20 minutes from there. By train: the nearest long-distance station is Plattling (ICE); from there the Waldbahn runs hourly to Deggendorf, which is about 30 minutes away by taxi or hire car. We don't offer a pick-up service – a car is highly recommended in the area.",
};

export function restaurantsAnswer(from: "haus28" | "schoenblick", locale: "de" | "en"): string {
  const list = restaurants
    .map((r) => `${r.name} (${locale === "en" ? r.placeEn : r.place}, ${from === "haus28" ? r.fromHaus28 : r.fromSchoenblick})`)
    .join("; ");
  return locale === "en"
    ? `Our favourite inns nearby (driving time): ${list}. Please check opening days on their websites before you go.`
    : `Unsere Lieblingsgasthäuser in der Nähe (Fahrzeit mit dem Auto): ${list}. Bitte vorher die Ruhetage auf den Websites prüfen.`;
}
