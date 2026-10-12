"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IconMapPin } from "@/components/ui/Icons";
import type { Coordinates } from "@/data/properties";
import type { HouseKey } from "@/data/map-places";
import { getDict } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";

// MapLibre erst laden, wenn die Karte ins Bild scrollt (siehe inView unten)
const PlaceMap = dynamic(() => import("@/components/property/PlaceMap"), { ssr: false });

interface LocationMapProps {
  /** Welche Fahrzeiten die Karte zeigt (data/map-places.ts) */
  house: HouseKey;
  /** Beschriftung des Haus-Schilds auf der Karte */
  houseName: string;
  address: string;
  coordinates: Coordinates;
  /** Google-Unternehmensprofil; ohne Angabe wird nach der Adresse gesucht */
  mapsUrl?: string;
  description?: string;
  nearbyAttractions?: { name: string; distance: string }[];
}

export default function LocationMap({
  house,
  houseName,
  address,
  coordinates,
  mapsUrl,
  description,
  nearbyAttractions,
}: LocationMapProps) {
  const locale = useLocale();
  const t = getDict(locale).property.location;
  const attractions = nearbyAttractions ?? t.defaultAttractions;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const mapsDirectUrl =
    mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

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
            {t.heading}
          </h2>
          <div className="flex items-start gap-2 text-forest-600">
            <IconMapPin size={16} className="mt-0.5 shrink-0" />
            <p className="font-body text-sm">{address}</p>
          </div>
        </motion.div>

        {/* Karte über die volle Breite – in der schmalen Spalte der Objektseiten
            wären sonst die Beschriftungen der Ausflugsziele zu gedrängt */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden shadow-card-lg aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/9] max-h-[640px] w-full bg-[#f5eedd]"
        >
          {inView && (
            <PlaceMap house={house} houseName={houseName} coordinates={coordinates} fallbackUrl={mapsDirectUrl} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="flex flex-col gap-5">
            {description && (
              <div>
                <h3 className="font-display text-lg text-forest-800 mb-2">{t.surroundings}</h3>
                <p className="font-body text-sm text-forest-600 leading-relaxed">{description}</p>
              </div>
            )}

            {/* GPS */}
            <div className="p-3 rounded-xl bg-cream-200 border border-cream-300">
              <p className="font-body text-xs text-forest-500 mb-1">{t.gps}</p>
              <p className="font-body text-xs text-forest-700 font-medium">
                {coordinates.lat.toFixed(4)}°N, {coordinates.lng.toFixed(4)}°E
              </p>
            </div>

            <a
              href={mapsDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-forest-900 underline underline-offset-2 hover:text-gold-700 transition-colors"
            >
              <IconMapPin size={14} />
              {t.openInGoogleMaps}
            </a>
          </div>

          <div>
            <h3 className="font-body text-sm font-semibold text-forest-800 mb-3 tracking-wide">
              {t.nearby}
            </h3>
            <ul className="flex flex-col gap-2">
              {attractions.map((attr) => (
                <li
                  key={attr.name}
                  className="flex items-center justify-between gap-3 py-2 border-b border-cream-200 last:border-0"
                >
                  <span className="font-body text-sm text-forest-700">{attr.name}</span>
                  <span className="flex-none font-body text-xs text-forest-400 bg-cream-200 px-2 py-0.5 rounded-full">
                    {attr.distance}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
