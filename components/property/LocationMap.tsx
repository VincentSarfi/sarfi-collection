"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IconMapPin } from "@/components/ui/Icons";
import type { Coordinates } from "@/data/properties";

interface LocationMapProps {
  address: string;
  coordinates: Coordinates;
  description?: string;
  nearbyAttractions?: { name: string; distance: string }[];
}

const defaultAttractions = [
  { name: "Nationalpark Bayerischer Wald", distance: "~20 km" },
  { name: "Deggendorf (Einkaufen)", distance: "~20 min" },
  { name: "Thermalbad Regen", distance: "~30 min" },
  { name: "Glasmuseum Frauenau", distance: "~25 min" },
];

export default function LocationMap({
  address,
  coordinates,
  description,
  nearbyAttractions = defaultAttractions,
}: LocationMapProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // OpenStreetMap embed – zuverlässig ohne API-Key
  const bbox = 0.02; // ~2 km Sichtbereich
  const mapsEmbedUrl =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${coordinates.lng - bbox},${coordinates.lat - bbox},${coordinates.lng + bbox},${coordinates.lat + bbox}` +
    `&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`;
  const mapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section
      ref={ref}
      className="section-pad-sm bg-cream-100"
      aria-labelledby="location-heading"
    >
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2
            id="location-heading"
            className="font-display text-display-md text-forest-900 mb-2"
          >
            Lage & Umgebung
          </h2>
          <div className="flex items-start gap-2 text-forest-600">
            <IconMapPin size={16} className="mt-0.5 shrink-0" />
            <p className="font-body text-sm">{address}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-card-lg aspect-[4/3] bg-cream-200">
              {inView && (
                <iframe
                  src={mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, position: "absolute", inset: 0 }}
                  loading="lazy"
                  allowFullScreen
                  title={`Karte: ${address}`}
                  aria-label={`OpenStreetMap Karte für ${address}`}
                />
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col gap-5"
          >
            {description && (
              <div>
                <h3 className="font-display text-lg text-forest-800 mb-2">Die Umgebung</h3>
                <p className="font-body text-sm text-forest-600 leading-relaxed">{description}</p>
              </div>
            )}

            <div>
              <h3 className="font-body text-sm font-semibold text-forest-800 mb-3 tracking-wide">
                In der Nähe
              </h3>
              <ul className="flex flex-col gap-2">
                {nearbyAttractions.map((attr) => (
                  <li
                    key={attr.name}
                    className="flex items-center justify-between py-2 border-b border-cream-200 last:border-0"
                  >
                    <span className="font-body text-sm text-forest-700">{attr.name}</span>
                    <span className="font-body text-xs text-forest-400 bg-cream-200 px-2 py-0.5 rounded-full">
                      {attr.distance}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* GPS */}
            <div className="p-3 rounded-xl bg-cream-200 border border-cream-300">
              <p className="font-body text-xs text-forest-500 mb-1">GPS-Koordinaten</p>
              <p className="font-body text-xs text-forest-700 font-medium">
                {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
