"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IconMail, IconMapPin, IconChevronDown } from "@/components/ui/Icons";

const faqs = [
  {
    q: "Wie buche ich direkt?",
    a: "Nutze den Buchungsbutton auf der jeweiligen Unterkunftsseite. Du wirst zum sicheren Smoobu-Buchungsformular weitergeleitet.",
  },
  {
    q: "Kann ich mehrere Apartments gleichzeitig buchen?",
    a: "Ja! Schreibe uns einfach eine Nachricht und wir helfen dir beim Buchen mehrerer Apartments im Haus Schönblick.",
  },
  {
    q: "Wie läuft der Check-in ab?",
    a: "Wir bieten Self-Check-in mit Schlüsselbox an. Du erhältst alle Infos ca. 24h vor Anreise per E-Mail/Nachricht.",
  },
  {
    q: "Was passiert bei Stornierung?",
    a: "HAUS28: kostenlos bis 30 Tage vor Anreise, 50 % bis 14 Tage, danach keine Erstattung. Schönblick-Apartments: kostenlos bis 14 Tage vor Anreise, 50 % bis 7 Tage, danach keine Erstattung. Alle Details auf sarfi-collection.de/stornierung.",
  },
  {
    q: "Gibt es Rabatte für längere Aufenthalte?",
    a: "Ja, für Aufenthalte ab 7 Nächten gibt es Wochenrabatte. Kontaktiere uns für individuelle Angebote.",
  },
  {
    q: "Sind Haustiere willkommen?",
    a: "Auf Anfrage und je nach Unterkunft. Bitte kontaktiere uns vor der Buchung.",
  },
];

function FaqItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-cream-200 last:border-0" id={index === 0 ? "faq" : undefined}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 text-left gap-4"
        aria-expanded={open}
      >
        <span className="font-body text-sm font-medium text-forest-800">{faq.q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-forest-400 shrink-0"
        >
          <IconChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <p className="font-body text-sm text-forest-500 pb-4 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function KontaktPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnstileToken = useRef<string>("");
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (turnstileRef.current && (window as any).turnstile) {
        (window as any).turnstile.render(turnstileRef.current, {
          sitekey: "0x4AAAAAADCAIuxW7h0ePfOM",
          callback: (token: string) => { turnstileToken.current = token; },
          theme: "light",
          language: "de",
        });
      }
    };

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      name:           (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:          (form.elements.namedItem('email')   as HTMLInputElement).value,
      subject:        (form.elements.namedItem('subject') as HTMLSelectElement).value,
      message:        (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      turnstileToken: turnstileToken.current,
    };

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Fehler beim Senden');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deine Nachricht konnte leider nicht gesendet werden. Bitte schreib uns direkt an hallo@sarfi-collection.de.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Page header */}
      <div className="bg-forest-900">
        <div className="container-site py-14">
          <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-300 mb-2">Kontakt</p>
          <h1 className="font-display text-display-lg text-cream-50">
            Wir freuen uns von dir zu hören
          </h1>
        </div>
      </div>

      <div className="container-site py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact form – col 3 */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-2xl text-forest-900 mb-6">Nachricht schreiben</h2>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-forest-700/10 border border-forest-200 text-center"
              >
                <p className="text-2xl mb-2">✓</p>
                <p className="font-body text-base font-medium text-forest-800 mb-1">
                  Vielen Dank für deine Nachricht!
                </p>
                <p className="font-body text-sm text-forest-500">
                  Wir melden uns in der Regel innerhalb von 24 Stunden bei dir.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm font-medium text-forest-700 mb-1.5 block" htmlFor="name">
                      Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-forest-800 placeholder:text-forest-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                      placeholder="Max Mustermann"
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-forest-700 mb-1.5 block" htmlFor="email">
                      E-Mail *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-forest-800 placeholder:text-forest-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                      placeholder="max@beispiel.de"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-body text-sm font-medium text-forest-700 mb-1.5 block" htmlFor="subject">
                    Betreff
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-forest-800 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                  >
                    <option value="">Bitte auswählen…</option>
                    <option value="haus28">HAUS28 – Anfrage</option>
                    <option value="schoenblick">Haus Schönblick – Anfrage</option>
                    <option value="gruppe">Gruppenbuchung</option>
                    <option value="other">Sonstiges</option>
                  </select>
                </div>

                <div>
                  <label className="font-body text-sm font-medium text-forest-700 mb-1.5 block" htmlFor="message">
                    Nachricht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-forest-800 placeholder:text-forest-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition resize-none"
                    placeholder="Deine Frage oder Anfrage…"
                  />
                </div>

                {/* DSGVO */}
                <div className="flex items-start gap-3">
                  <input
                    id="dsgvo"
                    type="checkbox"
                    required
                    className="mt-0.5 h-4 w-4 rounded border-cream-300 text-gold-500 focus:ring-gold-400"
                  />
                  <label htmlFor="dsgvo" className="font-body text-xs text-forest-500 leading-relaxed">
                    Ich habe die{" "}
                    <Link href="/datenschutz" className="text-gold-600 underline underline-offset-2">
                      Datenschutzerklärung
                    </Link>{" "}
                    gelesen und stimme der Verarbeitung meiner Daten zu. *
                  </label>
                </div>

                <div ref={turnstileRef} />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-forest-700 text-cream-50 font-body font-medium text-sm rounded-full hover:bg-forest-800 transition-colors disabled:opacity-60 disabled:pointer-events-none"
                >
                  {loading ? "Wird gesendet…" : "Nachricht senden"}
                </button>

                {error && (
                  <p className="font-body text-xs text-red-600 text-center leading-relaxed">
                    {error}
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Contact info – col 2 */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl text-forest-900 mb-5">Kontaktdaten</h2>
              <div className="space-y-4">
                <a
                  href="mailto:hallo@sarfi-collection.de"
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-cream-200 shadow-card hover:border-gold-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-forest-900 flex items-center justify-center shrink-0">
                    <IconMail size={16} className="text-gold-300" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-forest-400 mb-0.5">E-Mail</p>
                    <p className="font-body text-sm font-medium text-forest-800 group-hover:text-gold-700 transition-colors">
                      hallo@sarfi-collection.de
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-cream-200 shadow-card">
                  <div className="w-10 h-10 rounded-full bg-forest-900 flex items-center justify-center shrink-0">
                    <IconMapPin size={16} className="text-gold-300" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-forest-400 mb-0.5">Standorte</p>
                    <p className="font-body text-sm text-forest-700">
                      Grattersdorf · Schöfweg
                    </p>
                    <p className="font-body text-xs text-forest-400">Bayerischer Wald, Deutschland</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response time */}
            <div className="p-5 rounded-2xl bg-gold-300/15 border border-gold-300/30">
              <p className="font-body text-sm font-semibold text-forest-800 mb-1">
                ⚡ Schnelle Antwortzeit
              </p>
              <p className="font-body text-sm text-forest-600">
                Wir antworten in der Regel innerhalb von wenigen Stunden – spätestens innerhalb von 24 Stunden.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="font-display text-2xl text-forest-900 mb-6" id="faq">
            Häufige Fragen
          </h2>
          <div className="bg-white rounded-2xl border border-cream-200 shadow-card px-6 max-w-2xl">
            {faqs.map((faq, i) => (
              <FaqItem key={faq.q} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
