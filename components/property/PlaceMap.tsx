"use client";

// Lagekarte mit Ausflugszielen (MapLibre). Wird von LocationMap per next/dynamic
// erst geladen, wenn der Abschnitt ins Bild scrollt – MapLibre (~210 KB gzip)
// landet so nicht im Seiten-Bundle.

import { useEffect, useRef, useState } from "react";
import maplibregl, {
  type ExpressionSpecification,
  type LngLatBounds,
  type Map as MapLibreMap,
  type PaddingOptions,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { mapPlaces, type HouseKey, type MapPlace } from "@/data/map-places";
import { zeichenSvg, type ZeichenName } from "@/components/ui/zeichen-daten";
import { buildMapStyle, DEM_BOUNDS, MAP_FONT, MAP_FONT_BOLD } from "@/components/property/mapStyle";
import { getDict, localizeHref } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";

interface PlaceMapProps {
  house: HouseKey;
  houseName: string;
  coordinates: { lat: number; lng: number };
  /** Ziel des Hinweises, falls die Karte nicht starten kann (kein WebGL) */
  fallbackUrl: string;
}

type View = "region" | "nearby";

/** Ab diesem Zoom erscheinen Wanderung, Skilift und Gasthäuser */
const NEARBY_ZOOM = 11.5;

// Seite der Beschriftung, wo „rechts vom Symbol“ aus der Karte laufen oder
// unter dem Haus-Schild verschwinden würde
const LABEL_SIDE: Record<string, "left" | "above" | "below"> = {
  lusen: "left",
  "buechelstein-wanderung": "left",
  elypso: "below",
  "indoor-golf": "above",
  "einkehr-gasthaus-lohner": "left",
};
// Ranzinger liegt 200 m unter Haus Schönblick – rechts davon stößt die Schrift ans Haus-Schild
const LABEL_SIDE_SCHOENBLICK: typeof LABEL_SIDE = {
  "einkehr-panorama-landgasthof-ranzinger": "below",
};

const ICON_SIZE: Record<MapPlace["kind"], number> = { ausflug: 30, nah: 28, einkehr: 24 };

/** Rundes Symbol mit eigenem Zeichen (SVG → Canvas → MapLibre-Bild), doppelt aufgelöst für Retina */
async function zeichenIcon(name: ZeichenName, size: number): Promise<ImageData> {
  const ratio = 2;
  const px = (size + 6) * ratio;
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx) return new ImageData(1, 1);
  ctx.canvas.width = ctx.canvas.height = px;
  ctx.shadowColor = "rgba(11, 26, 16, 0.25)";
  ctx.shadowBlur = 4 * ratio;
  ctx.shadowOffsetY = ratio;
  ctx.beginPath();
  ctx.arc(px / 2, px / 2, (size / 2 - 1) * ratio, 0, Math.PI * 2);
  ctx.fillStyle = "#fdfaf5";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.lineWidth = 1.5 * ratio;
  ctx.strokeStyle = "#c9a84c";
  ctx.stroke();
  const inner = Math.round(size * 0.62);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(zeichenSvg(name, inner, "#1e3d27", "#a8883c"))}`;
  await img.decode();
  ctx.drawImage(img, (px - inner * ratio) / 2, (px - inner * ratio) / 2, inner * ratio, inner * ratio);
  return ctx.getImageData(0, 0, px, px);
}

/** Abstand zum Kartenrand: oben Platz für die Umschalter, rechts für Beschriftungen */
function fitPadding(width: number): PaddingOptions {
  return width < 500
    ? { top: 64, bottom: 64, left: 28, right: 28 }
    : { top: 72, bottom: 84, left: 64, right: 72 };
}

export default function PlaceMap({ house, houseName, coordinates, fallbackUrl }: PlaceMapProps) {
  const locale = useLocale();
  const t = getDict(locale).property.location.map;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const boundsRef = useRef<Record<View, LngLatBounds> | null>(null);
  const [view, setView] = useState<View>("region");
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const center: [number, number] = [coordinates.lng, coordinates.lat];

    const boundsOf = (places: MapPlace[]) =>
      places.reduce((b, p) => b.extend([p.lng, p.lat]), new maplibregl.LngLatBounds(center, center));
    const ausflug = mapPlaces.filter((p) => p.kind === "ausflug");
    const bounds = { region: boundsOf(ausflug), nearby: boundsOf(mapPlaces.filter((p) => p.kind !== "ausflug")) };
    boundsRef.current = bounds;
    // Symbole schon vor dem Kartenstil rendern; dauert nur Millisekunden
    const icons = Promise.all(mapPlaces.map((p) => zeichenIcon(p.icon, ICON_SIZE[p.kind])));

    let map: MapLibreMap;
    try {
      map = new maplibregl.Map({
        container,
        style: buildMapStyle(window.location.origin),
        bounds: bounds.region,
        fitBoundsOptions: { padding: fitPadding(container.clientWidth) },
        maxBounds: DEM_BOUNDS,
        // 7.5 statt 8: auf dem Handy passen so auch Passau und der Arber ins Bild
        minZoom: 7.5,
        maxZoom: 16,
        cooperativeGestures: true,
        dragRotate: false,
        pitchWithRotate: false,
        touchPitch: false,
        attributionControl: { compact: true },
        locale: t.ui,
      });
    } catch {
      setFailed(true);
      return;
    }
    mapRef.current = map;
    // Breite Karten dürfen wegen maxBounds (= Relief) nicht weit genug herauszoomen:
    // Passau und Arber passen nicht mit ins Bild, JOSKA würde oben angeschnitten.
    // Dann startet die Übersicht ohne die fernen Ziele – die liegen knapp außerhalb
    // und sind per Verschieben erreichbar.
    const padding = fitPadding(container.clientWidth);
    const fitZoom = map.cameraForBounds(bounds.region, { padding })?.zoom;
    if (fitZoom !== undefined && map.getZoom() > fitZoom + 0.01) {
      bounds.region = boundsOf(ausflug.filter((p) => !p.fern));
      map.fitBounds(bounds.region, { padding, animate: false });
    }
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    // Haus als HTML-Marker (Schild mit Namen), Punkt genau auf der Adresse
    const pin = document.createElement("div");
    pin.className = "flex flex-col items-center pointer-events-none";
    const tag = document.createElement("div");
    tag.className =
      "rounded-full bg-forest-900 px-3 py-1.5 font-body text-[13px] font-semibold tracking-wide text-cream-50 shadow-card-lg whitespace-nowrap";
    tag.textContent = houseName;
    const stem = document.createElement("div");
    stem.className = "h-3.5 w-0.5 bg-forest-900";
    const dot = document.createElement("div");
    dot.className = "h-3.5 w-3.5 rounded-full border-[3px] border-cream-50 bg-gold-500 ring-[6px] ring-gold-500/30";
    pin.append(tag, stem, dot);
    new maplibregl.Marker({ element: pin, anchor: "bottom", offset: [0, 7] }).setLngLat(center).addTo(map);

    map.on("load", async () => {
      const iconData = await icons.catch(() => null);
      // Karte inzwischen abgebaut (Haus/Sprache gewechselt)?
      if (mapRef.current !== map) return;
      const features = mapPlaces.map((p) => {
        const min = p.minutes[house];
        return {
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: [p.lng, p.lat] },
          properties: {
            id: p.id,
            kind: p.kind,
            anchor: p.anchor,
            icon: `place-${p.id}`,
            name: p.name ?? t.places[p.id] ?? p.id,
            time: min === null ? "" : min === 0 ? t.labelWalk : `${min} min`,
            minutes: min ?? -1,
            side: (house === "schoenblick" && LABEL_SIDE_SCHOENBLICK[p.id]) || LABEL_SIDE[p.id] || "right",
          },
        };
      });
      mapPlaces.forEach((p, i) => iconData && map.addImage(`place-${p.id}`, iconData[i], { pixelRatio: 2 }));

      // Unsichtbare Fläche unter dem Haus-Schild: hält Beschriftungen davon fern
      const w = Math.ceil(pin.offsetWidth) + 8;
      const h = Math.ceil(pin.offsetHeight) + 4;
      map.addImage("house-blocker", { width: w, height: h, data: new Uint8Array(w * h * 4) });
      map.addSource("house", {
        type: "geojson",
        data: { type: "Feature", geometry: { type: "Point", coordinates: center }, properties: {} },
      });
      map.addSource("places", { type: "geojson", data: { type: "FeatureCollection", features } });

      const label: ExpressionSpecification = [
        "format",
        ["get", "name"], { "text-font": ["literal", MAP_FONT_BOLD] },
        ["case", ["==", ["get", "time"], ""], "", "\n"], {},
        ["get", "time"], { "text-font": ["literal", MAP_FONT], "font-scale": 0.88, "text-color": "#85692e" },
      ];
      const layout = {
        "icon-image": ["get", "icon"] as ExpressionSpecification,
        "text-field": label,
        // Grundschrift auch für den Zeilenumbruch – sonst fragt MapLibre „Open Sans“ an (404)
        "text-font": MAP_FONT,
        "text-size": 12.5,
        "text-line-height": 1.25,
        "text-max-width": 11,
        "text-anchor": ["match", ["get", "side"], "left", "right", "above", "bottom", "below", "top", "left"] as ExpressionSpecification,
        "text-justify": ["match", ["get", "side"], "left", "right", "right", "left", "center"] as ExpressionSpecification,
        "text-offset": [
          "match", ["get", "side"],
          "left", ["literal", [-1.5, 0]],
          "above", ["literal", [0, -1.4]],
          "below", ["literal", [0, 1.4]],
          ["literal", [1.5, 0]],
        ] as ExpressionSpecification,
        // Symbole immer zeigen, Beschriftungen nur, wo Platz ist (Klick zeigt den Namen)
        "icon-allow-overlap": true,
        "text-optional": true,
      };
      const paint = { "text-color": "#0b1a10", "text-halo-color": "#fdfaf5", "text-halo-width": 1.6 };
      map.addLayer({ id: "places-region", type: "symbol", source: "places", filter: ["==", ["get", "kind"], "ausflug"], layout, paint });
      map.addLayer({
        id: "places-nearby",
        type: "symbol",
        source: "places",
        minzoom: NEARBY_ZOOM,
        filter: ["!=", ["get", "kind"], "ausflug"],
        layout,
        paint,
      });
      // zuoberst = wird zuerst platziert
      map.addLayer({
        id: "house-blocker",
        type: "symbol",
        source: "house",
        layout: { "icon-image": "house-blocker", "icon-anchor": "bottom", "icon-offset": [0, 7], "icon-allow-overlap": true },
      });
      setReady(true);
    });

    // Klick auf ein Ziel: Name, Fahrzeit ab dem Haus, Link zur Ausflugsziele-Seite
    const layers = ["places-region", "places-nearby"];
    map.on("click", layers, (e) => {
      const f = e.features?.[0];
      if (!f || f.geometry.type !== "Point") return;
      const { name, anchor, minutes } = f.properties as { name: string; anchor: string; minutes: number };
      const box = document.createElement("div");
      box.className = "font-body pr-4";
      const title = document.createElement("p");
      title.className = "font-semibold text-sm text-forest-900";
      title.textContent = name;
      box.append(title);
      if (minutes >= 0) {
        const line = document.createElement("p");
        line.className = "mt-0.5 text-xs text-forest-600";
        line.textContent = (minutes === 0 ? t.onFoot : t.byCar)
          .replace("{min}", String(minutes))
          .replace("{house}", houseName);
        box.append(line);
      }
      const link = document.createElement("a");
      link.className =
        "mt-2 inline-block text-xs font-semibold text-forest-900 underline underline-offset-2 hover:text-gold-700";
      link.href = `${localizeHref("/ausflugsziele", locale)}#${anchor}`;
      link.textContent = `${t.more} →`;
      box.append(link);
      new maplibregl.Popup({ className: "placemap", offset: 16, maxWidth: "260px" })
        .setLngLat(f.geometry.coordinates as [number, number])
        .setDOMContent(box)
        .addTo(map);
    });
    map.on("mouseenter", layers, () => (map.getCanvas().style.cursor = "pointer"));
    map.on("mouseleave", layers, () => (map.getCanvas().style.cursor = ""));
    // Umschalter folgt dem Zoom, auch beim Zoomen von Hand
    map.on("moveend", () => setView(map.getZoom() >= NEARBY_ZOOM ? "nearby" : "region"));

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Karte nur einmal pro Haus/Sprache aufbauen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [house, locale]);

  const showView = (next: View) => {
    const map = mapRef.current;
    const bounds = boundsRef.current;
    if (!map || !bounds) return;
    setView(next);
    const camera = map.cameraForBounds(bounds[next], { padding: fitPadding(map.getContainer().clientWidth) });
    if (!camera) return;
    // „Rund ums Haus“ mindestens so nah, dass Wanderung, Lift und Gasthäuser erscheinen
    const zoom = next === "nearby" ? Math.max(camera.zoom ?? 0, NEARBY_ZOOM + 0.5) : camera.zoom;
    map.easeTo({ ...camera, zoom, duration: 900 });
  };

  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="font-body text-sm text-forest-600">{t.failed}</p>
        <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="font-body text-sm font-semibold text-forest-900 underline underline-offset-2">
          Google Maps →
        </a>
      </div>
    );
  }

  return (
    <>
      {/* !absolute: MapLibre gibt dem Container .maplibregl-map { position: relative } –
          ohne !important wäre er beim Erzeugen 0 px hoch und der Startausschnitt falsch */}
      <div
        ref={containerRef}
        className={`placemap !absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        role="region"
        aria-label={`${t.ariaPre}${houseName}`}
      />
      <div className="absolute left-3 top-3 z-10 flex rounded-full bg-cream-50/95 p-1 shadow-card backdrop-blur">
        {(["region", "nearby"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => showView(v)}
            aria-pressed={view === v}
            className={`rounded-full px-3 py-1.5 font-body text-xs font-semibold transition-colors sm:px-3.5 sm:text-[13px] ${
              view === v ? "bg-forest-900 text-cream-50" : "text-forest-700 hover:text-forest-900"
            }`}
          >
            {v === "region" ? t.viewRegion : t.viewNearby}
          </button>
        ))}
      </div>
    </>
  );
}
