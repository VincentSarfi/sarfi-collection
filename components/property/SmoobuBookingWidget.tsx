"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface SmoobuBookingWidgetProps {
  /** Smoobu Property ID, e.g. "1163278" */
  propertyId: string;
  /** Direct booking URL shown as fallback */
  fallbackUrl?: string;
  /** Human-readable property name */
  propertyName?: string;
}

export default function SmoobuBookingWidget({
  propertyId,
  fallbackUrl,
  propertyName,
}: SmoobuBookingWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    if (!inView || !containerRef.current || propertyId === "TODO") {
      if (propertyId === "TODO") setError(true);
      return;
    }

    // Dynamically inject Smoobu booking script
    const scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.src = "https://login.smoobu.com/js/Settings/BookingToolIframe.js";
    scriptTag.onload = () => {
      try {
        // @ts-expect-error – Smoobu adds BookingToolIframe to window at runtime, no type declaration
        if (window.BookingToolIframe) {
          // @ts-expect-error – Smoobu BookingToolIframe has no TypeScript types
          window.BookingToolIframe.initialize({
            url: `https://login.smoobu.com/de/booking-tool/iframe/${propertyId}`,
            baseUrl: "https://login.smoobu.com",
            target: "#smoobu-booking-container",
          });
          setLoaded(true);
        }
      } catch {
        setError(true);
      }
    };
    scriptTag.onerror = () => setError(true);
    document.head.appendChild(scriptTag);

    return () => {
      document.head.removeChild(scriptTag);
    };
  }, [inView, propertyId]);

  const smoobuDirectUrl = fallbackUrl ?? `https://login.smoobu.com/de/booking-tool/iframe/${propertyId}`;

  return (
    <section
      ref={ref}
      className="section-pad bg-cream-100"
      id="buchen"
      aria-labelledby="booking-heading"
    >
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-2">
            Direkt buchen & sparen
          </p>
          <h2
            id="booking-heading"
            className="font-display text-display-md text-forest-900"
          >
            {propertyName ? `${propertyName} buchen` : "Jetzt buchen"}
          </h2>
        </motion.div>

        {error ? (
          /* Error / TODO state */
          <div className="rounded-2xl border-2 border-dashed border-forest-200 bg-cream-50 p-10 text-center">
            <p className="font-body text-forest-600 mb-2">
              {propertyId === "TODO"
                ? "⚠️ Smoobu Property-ID noch nicht konfiguriert."
                : "Buchungswidget konnte nicht geladen werden."}
            </p>
            <p className="font-body text-sm text-forest-400 mb-6">
              {propertyId === "TODO"
                ? 'Trage die Smoobu Property-ID in data/properties.ts ein (smoobuPropertyId: "...").'
                : "Bitte versuche es direkt auf Smoobu."}
            </p>
            <a
              href={smoobuDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gold-500 text-forest-900 font-body font-medium text-sm hover:bg-gold-400 transition-colors shadow-cta"
            >
              Direkt auf Smoobu buchen →
            </a>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-card-lg bg-white"
          >
            {/* Loading skeleton */}
            {!loaded && (
              <div className="p-8 flex flex-col gap-4">
                <div className="skeleton h-10 w-64 rounded-lg" />
                <div className="skeleton h-6 w-48 rounded-lg" />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="skeleton h-14 rounded-xl" />
                  <div className="skeleton h-14 rounded-xl" />
                </div>
                <div className="skeleton h-10 w-full rounded-xl mt-2" />
              </div>
            )}

            {/* Smoobu widget mount point */}
            <div id="smoobu-booking-container" ref={containerRef} />
          </motion.div>
        )}

        {/* Trust note */}
        <p className="mt-4 text-center font-body text-xs text-forest-400">
          Sichere Direktbuchung · Keine Plattformgebühren · Persönliche Betreuung
        </p>
      </div>
    </section>
  );
}
