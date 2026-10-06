// Umgebung: Gasthäuser, Anreise, Haustier-Regel – genutzt von FAQs,
// Gruppenseite und llms.txt. Recherchiert am 06.10.2026 (Websites der
// Betriebe, DB, Wikipedia); Fahrzeiten sind gerundete Schätzungen.

/** Aufpreis pro Hund und Nacht im Haus Schönblick (HAUS28: keine Haustiere). */
export const PET_FEE_PER_NIGHT = 10;
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

export const restaurants: Restaurant[] = [
  {
    name: "Wirtshaus Stoaberghütt'n",
    place: "am Steinberglift, Schöfweg",
    placeEn: "at the Steinberglift, Schöfweg",
    url: "https://www.steinberglift.de/de/gastronomie/wirtshaus.html",
    de: "Bayerische Küche, frisch und hausgemacht, mit Blick bis zu den Alpen – inzwischen ganzjährig geöffnet.",
    en: "Bavarian food, fresh and homemade, with views as far as the Alps – now open all year round.",
    fromHaus28: "~5 min",
    fromSchoenblick: "~3 min",
  },
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
