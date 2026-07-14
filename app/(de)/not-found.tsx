import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-forest-900 flex items-center justify-center text-center px-4">
      <div>
        <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-300 mb-4">
          404 – Seite nicht gefunden
        </p>
        <h1 className="font-display text-display-lg text-cream-50 mb-4">
          Hier gibt es nichts zu sehen
        </h1>
        <p className="font-body text-lg text-cream-50/60 mb-8 max-w-md mx-auto">
          Die gesuchte Seite existiert nicht oder wurde verschoben. Kein Problem – finde deinen Weg zurück.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gold-500 text-forest-900 rounded-full font-body font-medium text-sm hover:bg-gold-400 transition-colors"
          >
            Zur Startseite
          </Link>
          <Link
            href="/haus28"
            className="px-6 py-3 border border-cream-50/30 text-cream-50/80 rounded-full font-body text-sm hover:text-cream-50 hover:border-cream-50/50 transition-colors"
          >
            HAUS28 entdecken
          </Link>
        </div>
      </div>
    </div>
  );
}
