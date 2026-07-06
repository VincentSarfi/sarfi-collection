import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Newsletter-Anmeldung",
  robots: { index: false, follow: false },
};

export default async function NewsletterConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const ok = error !== "1";

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-20 bg-cream-50">
      <div className="max-w-md w-full text-center">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
            ok ? "bg-forest-100" : "bg-red-50"
          }`}
        >
          {ok ? (
            <svg className="w-8 h-8 text-forest-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <h1 className="font-display text-3xl text-forest-900 mb-3">
          {ok ? "Anmeldung bestätigt" : "Link ungültig"}
        </h1>
        <p className="font-body text-forest-600 mb-8">
          {ok
            ? "Danke! Deine Newsletter-Anmeldung ist bestätigt. Wir melden uns mit Angeboten und Neuigkeiten aus dem Bayerischen Wald."
            : "Der Bestätigungslink ist ungültig oder abgelaufen. Bitte melde dich einfach erneut an."}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-800 text-cream-50 font-body text-sm font-medium hover:bg-forest-700 transition-colors"
        >
          ← Zur Startseite
        </Link>
      </div>
    </div>
  );
}
