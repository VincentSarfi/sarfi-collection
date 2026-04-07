"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface SmoobuBookingWidgetProps {
  propertyId: string;
  fallbackUrl?: string;
  propertyName?: string;
}

export default function SmoobuBookingWidget({
  propertyId,
  fallbackUrl,
  propertyName,
}: SmoobuBookingWidgetProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const iframeSrc =
    fallbackUrl ??
    `https://login.smoobu.com/de/booking-tool/iframe/${propertyId}`;

  const isConfigured = propertyId && propertyId !== "TODO";

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

        {isConfigured ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-card-lg bg-white"
          >
            <iframe
              src={iframeSrc}
              width="100%"
              height="700"
              style={{ border: "none", display: "block" }}
              title={`${propertyName ?? "Unterkunft"} – Buchungskalender`}
              loading="lazy"
              allowFullScreen
            />
          </motion.div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-forest-200 bg-cream-50 p-10 text-center">
            <p className="font-body text-forest-600 mb-2">
              Smoobu Property-ID noch nicht konfiguriert.
            </p>
            <p className="font-body text-sm text-forest-400">
              Trage die ID in data/properties.ts ein (smoobuPropertyId).
            </p>
          </div>
        )}

        <p className="mt-4 text-center font-body text-xs text-forest-400">
          Sichere Direktbuchung · Keine Plattformgebühren · Persönliche Betreuung
        </p>
      </div>
    </section>
  );
}
