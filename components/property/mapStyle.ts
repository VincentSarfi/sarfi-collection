// Kartenstil der Lagekarte in den Website-Farben (tailwind.config.ts: forest/cream/gold).
// Vektordaten + Schriften: OpenFreeMap (kostenlos, ohne Key, ohne Cookies; siehe
// Datenschutzerklärung Abschnitt 8). Relief: selbst gehostet unter /map/dem
// (scripts/build-dem-tiles.mjs – Ausschnitt und Zoom müssen dazu passen).
import type { ExpressionSpecification, StyleSpecification } from "maplibre-gl";

/** Ausschnitt der Relief-Kacheln; die Karte lässt sich nicht weiter wegschieben. */
export const DEM_BOUNDS: [number, number, number, number] = [12.6, 48.45, 13.9, 49.3];
const DEM_MAX_ZOOM = 11;

export const MAP_FONT = ["Noto Sans Regular"];
export const MAP_FONT_BOLD = ["Noto Sans Bold"];
const MAP_FONT_ITALIC = ["Noto Sans Italic"];

const C = {
  bg: "#f5eedd",
  farm: "#efe6cc",
  grass: "#e6e4c6",
  wood: "#cfd9c0",
  park: "#bccbae",
  water: "#b4cdcc",
  waterLine: "#9bbcbb",
  waterLabel: "#4f7f7d",
  resid: "#ece1c5",
  building: "#e0d0ad",
  roadMajor: "#fffdf8",
  roadMajorCase: "#dcc893",
  roadMinor: "#fbf6ea",
  roadMinorCase: "#e6d6ae",
  track: "#d9c79c",
  border: "#a8883c",
  label: "#1e3d27", // forest-700
  labelSoft: "#3a6e47", // forest-500
  halo: "#f9f3e6", // cream-100
};

const roadWidth = (base: number): ExpressionSpecification => [
  "interpolate", ["exponential", 1.5], ["zoom"], 8, base * 0.3, 12, base, 16, base * 5,
];

const cls = (classes: string[]): ExpressionSpecification => ["in", ["get", "class"], ["literal", classes]];

export function buildMapStyle(origin: string): StyleSpecification {
  return {
    version: 8,
    glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
    sources: {
      omt: { type: "vector", url: "https://tiles.openfreemap.org/planet" },
      dem: {
        type: "raster-dem",
        tiles: [`${origin}/map/dem/{z}/{x}/{y}.webp`],
        encoding: "terrarium",
        tileSize: 256,
        minzoom: 6,
        maxzoom: DEM_MAX_ZOOM,
        bounds: DEM_BOUNDS,
        attribution: "Relief: Copernicus EU-DEM",
      },
    },
    layers: [
      { id: "bg", type: "background", paint: { "background-color": C.bg } },
      { id: "farm", type: "fill", source: "omt", "source-layer": "landcover", filter: cls(["farmland"]), paint: { "fill-color": C.farm } },
      { id: "grass", type: "fill", source: "omt", "source-layer": "landcover", filter: cls(["grass", "meadow"]), paint: { "fill-color": C.grass, "fill-opacity": 0.6 } },
      { id: "resid", type: "fill", source: "omt", "source-layer": "landuse", filter: cls(["residential", "suburb", "neighbourhood", "village"]), paint: { "fill-color": C.resid } },
      { id: "wood", type: "fill", source: "omt", "source-layer": "landcover", filter: ["==", ["get", "class"], "wood"], paint: { "fill-color": C.wood } },
      { id: "park", type: "fill", source: "omt", "source-layer": "park", paint: { "fill-color": C.park, "fill-opacity": 0.25 } },
      { id: "park-line", type: "line", source: "omt", "source-layer": "park", paint: { "line-color": "#579165", "line-width": 1, "line-dasharray": [3, 2], "line-opacity": 0.5 } },
      {
        id: "hillshade",
        type: "hillshade",
        source: "dem",
        paint: {
          "hillshade-shadow-color": "#2c5436",
          "hillshade-highlight-color": "#fdfaf5",
          "hillshade-accent-color": "#3a6e47",
          // nah ran weicher: die Höhendaten reichen nur bis Zoom 11
          "hillshade-exaggeration": ["interpolate", ["linear"], ["zoom"], 10, 0.35, 14, 0.2],
          "hillshade-illumination-direction": 315,
        },
      },
      { id: "water", type: "fill", source: "omt", "source-layer": "water", paint: { "fill-color": C.water } },
      { id: "waterway", type: "line", source: "omt", "source-layer": "waterway", paint: { "line-color": C.waterLine, "line-width": ["interpolate", ["linear"], ["zoom"], 9, 0.5, 14, 2] } },
      { id: "building", type: "fill", source: "omt", "source-layer": "building", minzoom: 13, paint: { "fill-color": C.building, "fill-opacity": 0.8 } },
      { id: "track", type: "line", source: "omt", "source-layer": "transportation", minzoom: 13, filter: cls(["track", "path"]), paint: { "line-color": C.track, "line-width": 1, "line-dasharray": [2, 2] } },
      { id: "minor-case", type: "line", source: "omt", "source-layer": "transportation", minzoom: 11, filter: cls(["minor", "service", "tertiary"]), layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": C.roadMinorCase, "line-width": roadWidth(2.2) } },
      { id: "minor", type: "line", source: "omt", "source-layer": "transportation", minzoom: 11, filter: cls(["minor", "service", "tertiary"]), layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": C.roadMinor, "line-width": roadWidth(1.4) } },
      { id: "major-case", type: "line", source: "omt", "source-layer": "transportation", filter: cls(["motorway", "trunk", "primary", "secondary"]), layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": C.roadMajorCase, "line-width": roadWidth(3.4) } },
      { id: "major", type: "line", source: "omt", "source-layer": "transportation", filter: cls(["motorway", "trunk", "primary", "secondary"]), layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": C.roadMajor, "line-width": roadWidth(2.4) } },
      { id: "border", type: "line", source: "omt", "source-layer": "boundary", filter: ["==", ["get", "admin_level"], 2], paint: { "line-color": C.border, "line-width": 1.2, "line-dasharray": [4, 3] } },
      { id: "water-name", type: "symbol", source: "omt", "source-layer": "water_name", layout: { "text-field": ["get", "name"], "text-font": MAP_FONT_ITALIC, "text-size": 11 }, paint: { "text-color": C.waterLabel, "text-halo-color": C.halo, "text-halo-width": 1.2 } },
      {
        id: "peak",
        type: "symbol",
        source: "omt",
        "source-layer": "mountain_peak",
        minzoom: 10,
        filter: ["has", "ele"],
        layout: {
          "text-field": ["concat", "▲ ", ["get", "name"], "\n", ["to-string", ["get", "ele"]], " m"],
          "text-font": MAP_FONT_ITALIC,
          "text-size": 10.5,
          "text-line-height": 1.25,
        },
        paint: { "text-color": "#2c5436", "text-halo-color": C.halo, "text-halo-width": 1.4 },
      },
      {
        id: "place-small",
        type: "symbol",
        source: "omt",
        "source-layer": "place",
        minzoom: 11,
        filter: cls(["village", "hamlet"]),
        layout: { "text-field": ["get", "name"], "text-font": MAP_FONT, "text-size": ["match", ["get", "class"], "village", 12, 10.5] },
        paint: { "text-color": C.labelSoft, "text-halo-color": C.halo, "text-halo-width": 1.5 },
      },
      {
        id: "place-town",
        type: "symbol",
        source: "omt",
        "source-layer": "place",
        filter: cls(["town", "city"]),
        layout: {
          "text-field": ["get", "name"],
          "text-font": MAP_FONT_BOLD,
          "text-size": ["match", ["get", "class"], "city", 16, 13.5],
          "text-letter-spacing": 0.03,
        },
        paint: { "text-color": C.label, "text-halo-color": C.halo, "text-halo-width": 1.8 },
      },
    ],
  };
}
