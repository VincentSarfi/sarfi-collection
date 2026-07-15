"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getDict } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";

// Smoobu Account-ID (gleich für alle Unterkünfte)
const SMOOBU_ACCOUNT_ID = "1163278";

interface SmoobuBookingWidgetProps {
  propertyId: string;
  propertyName?: string;
  fallbackUrl?: string;
}

export default function SmoobuBookingWidget({
  propertyId,
  propertyName,
  fallbackUrl,
}: SmoobuBookingWidgetProps) {
  const locale = useLocale();
  const t = getDict(locale).property.smoobu;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const initialized = useRef(false);

  const divId = `apartmentIframe${propertyId}`;
  const iframeUrl = `https://login.smoobu.com/${locale}/booking-tool/iframe/${SMOOBU_ACCOUNT_ID}/${propertyId}`;

  useEffect(() => {
    if (!inView || initialized.current || propertyId === "TODO") return;
    initialized.current = true;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://login.smoobu.com/js/Settings/BookingToolIframe.js";
    script.onload = () => {
      // @ts-expect-error – Smoobu adds BookingToolIframe to window at runtime
      if (window.BookingToolIframe) {
        // @ts-expect-error – no TypeScript types for Smoobu widget
        window.BookingToolIframe.initialize({
          url: iframeUrl,
          baseUrl: "https://login.smoobu.com",
          target: `#${divId}`,
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [inView, propertyId, iframeUrl, divId]);

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
            {t.eyebrow}
          </p>
          <h2
            id="booking-heading"
            className="font-display text-display-md text-forest-900"
          >
            {propertyName ? `${t.bookPre}${propertyName}${t.bookPost}` : t.bookNow}
          </h2>
        </motion.div>

        {isConfigured ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-card-lg bg-white min-h-[400px]"
          >
            <div id={divId} />
          </motion.div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-forest-200 bg-cream-50 p-10 text-center">
            <p className="font-body text-forest-600 mb-2">
              {t.notConfigured}
            </p>
            {fallbackUrl && (
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gold-500 text-forest-900 font-body font-medium text-sm hover:bg-gold-400 transition-colors"
              >
                {t.bookOnSmoobu}
              </a>
            )}
          </div>
        )}

        <p className="mt-4 text-center font-body text-xs text-forest-400">
          {t.trustLine}
        </p>
      </div>
    </section>
  );
}
