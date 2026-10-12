// Punkte auf der Lagekarte (components/property/PlaceMap.tsx).
// Koordinaten aus OpenStreetMap (Nominatim/Overpass, geprüft 12.10.2026),
// Fahrzeiten aus data/surroundings.ts. Namen der Ausflugsziele stehen in
// locales/*/property.ts (location.map.places), die der Gasthäuser hier.

import { driveMinutes, restaurants } from "@/data/surroundings";

export type HouseKey = "haus28" | "schoenblick";

export type MapPlace = {
  id: string;
  /** "ausflug" = Übersicht, "nah" und "einkehr" erst ab Zoom rund ums Haus */
  kind: "ausflug" | "nah" | "einkehr";
  /** Anker auf /ausflugsziele (öffnet dort das passende Detail) */
  anchor: string;
  emoji: string;
  lng: number;
  lat: number;
  /** Fahrzeit mit dem Auto in Minuten; 0 = zu Fuß, null = keine Angabe */
  minutes: Record<HouseKey, number | null>;
  /** Eigenname, sonst Text aus location.map.places[id] */
  name?: string;
  /** Weit weg: zählt für den Startausschnitt nur, wenn alles ins Bild passt (PlaceMap) */
  fern?: boolean;
};

const drive = (key: keyof typeof driveMinutes) => ({
  haus28: driveMinutes[key].haus28,
  schoenblick: driveMinutes[key].schoenblick,
});

const ausflug: MapPlace[] = [
  { id: "pullman-city", kind: "ausflug", anchor: "pullman-city", emoji: "🤠", lng: 13.2661, lat: 48.6962, minutes: drive("pullmanCity") },
  // Baumwipfelpfad und Hans-Eisenmann-Haus liegen 300 m auseinander → ein Punkt
  { id: "lusen", kind: "ausflug", anchor: "baumwipfelpfad", emoji: "🌲", lng: 13.485, lat: 48.891, minutes: drive("nationalparkLusen") },
  { id: "indoor-golf", kind: "ausflug", anchor: "indoor-golf", emoji: "⛳", lng: 13.0844, lat: 48.8794, minutes: drive("ruselArena") },
  { id: "elypso", kind: "ausflug", anchor: "elypso", emoji: "🏊", lng: 12.9094, lat: 48.8196, minutes: drive("elypso") },
  { id: "joska", kind: "ausflug", anchor: "joska", emoji: "💎", lng: 13.0848, lat: 49.0673, minutes: drive("joska") },
  // Museumsdorf Bayerischer Wald am Dreiburgensee (Tittling)
  { id: "museumsdorf", kind: "ausflug", anchor: "museumsdorf", emoji: "🏡", lng: 13.35, lat: 48.7402, minutes: drive("museumsdorf") },
  // Am Museumspark 1
  { id: "glasmuseum-frauenau", kind: "ausflug", anchor: "glasmuseum-frauenau", emoji: "🏛️", lng: 13.2984, lat: 48.9883, minutes: drive("glasmuseumFrauenau") },
  // Rathausplatz (Altstadt)
  { id: "passau", kind: "ausflug", anchor: "passau", emoji: "⛪", lng: 13.4679, lat: 48.5754, minutes: drive("passau"), fern: true },
  // Talstation Arber-Bergbahn
  { id: "arber", kind: "ausflug", anchor: "arber", emoji: "🏔️", lng: 13.142, lat: 49.1214, minutes: drive("arber"), fern: true },
];

const nah: MapPlace[] = [
  // Talstation; die Stoaberg Alm liegt direkt daneben
  { id: "skigebiet-sonnenwald", kind: "nah", anchor: "skigebiet-sonnenwald", emoji: "⛷️", lng: 13.1983, lat: 48.8197, minutes: drive("steinberglift") },
  // Gipfel Großer Büchelstein; die Runde startet an der Haustür von HAUS28
  { id: "buechelstein-wanderung", kind: "nah", anchor: "buechelstein-wanderung", emoji: "🥾", lng: 13.1755, lat: 48.8083, minutes: { haus28: 0, schoenblick: null } },
  // Gipfel; ab Haus Schönblick zu Fuß (400 m bis Langfurth, dann Turmweg),
  // ab HAUS28 mit dem Auto bis zum Parkplatz Langfurth
  { id: "brotjacklriegel", kind: "nah", anchor: "brotjacklriegel", emoji: "⛰️", lng: 13.2167, lat: 48.817, minutes: drive("brotjacklriegel") },
];

// Stoaberg Alm fehlt bewusst: steht beim Steinberglift mit im Namen
const GASTHAUS_POS: Record<string, [number, number]> = {
  "Panorama-Landgasthof Ranzinger": [13.2022, 48.826],
  "Gasthof Zum Sonnenwald (Aulinger)": [13.2296, 48.8401],
  "Gasthaus Lohner": [13.1523, 48.8041],
};

const minutenAus = (s: string) => parseInt(s.replace(/\D/g, ""), 10);

const einkehr: MapPlace[] = restaurants
  .filter((r) => GASTHAUS_POS[r.name])
  .map((r) => ({
    id: `einkehr-${r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")}`,
    kind: "einkehr",
    anchor: "einkehren",
    emoji: "🍽️",
    lng: GASTHAUS_POS[r.name][0],
    lat: GASTHAUS_POS[r.name][1],
    minutes: { haus28: minutenAus(r.fromHaus28), schoenblick: minutenAus(r.fromSchoenblick) },
    name: r.name.replace(/\s*\(.*\)$/, ""),
  }));

export const mapPlaces: MapPlace[] = [...ausflug, ...nah, ...einkehr];
