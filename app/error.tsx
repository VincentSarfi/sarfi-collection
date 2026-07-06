"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-forest-900 flex items-center justify-center text-center px-4">
      <div>
        <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-300 mb-4">
          Fehler
        </p>
        <h1 className="font-display text-display-lg text-cream-50 mb-4">
          Da ist etwas schiefgelaufen
        </h1>
        <p className="font-body text-lg text-cream-50/60 mb-8 max-w-md mx-auto">
          Ein unerwarteter Fehler ist aufgetreten. Versuch es einfach noch einmal – oder melde dich bei uns, wenn das Problem bleibt.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gold-500 text-forest-900 rounded-full font-body font-medium text-sm hover:bg-gold-400 transition-colors"
          >
            Erneut versuchen
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-cream-50/30 text-cream-50/80 rounded-full font-body text-sm hover:text-cream-50 hover:border-cream-50/50 transition-colors"
          >
            Zur Startseite
          </Link>
          <Link
            href="/kontakt"
            className="px-6 py-3 border border-cream-50/30 text-cream-50/80 rounded-full font-body text-sm hover:text-cream-50 hover:border-cream-50/50 transition-colors"
          >
            Kontakt
          </Link>
        </div>
      </div>
    </div>
  );
}
