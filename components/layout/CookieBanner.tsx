"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const COOKIE_KEY = "sarfi_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
    // TODO: Initialize analytics / tracking here after consent
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          role="dialog"
          aria-modal="true"
          aria-label="Cookie-Einstellungen"
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:bottom-6 md:max-w-md"
        >
          <div className="bg-forest-900 rounded-2xl p-5 md:p-6 shadow-card-lg border border-cream-50/10">
            <p className="font-body text-sm text-cream-50/80 leading-relaxed mb-4">
              Wir verwenden Cookies, um dein Erlebnis zu verbessern und anonyme Nutzungsstatistiken zu erheben. Du kannst deine Einwilligung jederzeit widerrufen.{" "}
              <Link
                href="/datenschutz"
                className="text-gold-300 hover:text-gold-400 underline underline-offset-2"
              >
                Datenschutzerklärung
              </Link>
            </p>
            <div className="flex gap-3">
              <button
                onClick={accept}
                className="flex-1 px-4 py-2.5 bg-gold-500 text-forest-900 text-sm font-medium font-body rounded-full hover:bg-gold-400 transition-colors"
              >
                Alle akzeptieren
              </button>
              <button
                onClick={decline}
                className="flex-1 px-4 py-2.5 border border-cream-50/20 text-cream-50/80 text-sm font-body rounded-full hover:text-cream-50 hover:border-cream-50/40 transition-colors"
              >
                Ablehnen
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
