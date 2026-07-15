"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IconMail, IconMapPin, IconPhone, IconChevronDown } from "@/components/ui/Icons";
import { getDict, localizeHref, type Locale } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type Faq = ReturnType<typeof getDict>["kontakt"]["faq"]["items"][number];

function FaqAnswer({ a, locale }: { a: Faq["a"]; locale: Locale }) {
  if (typeof a === "string") return <>{a}</>;
  return (
    <>
      {a.beforeLink}{" "}
      <Link href={localizeHref("/stornierung", locale)} className="text-gold-600 underline underline-offset-2">
        {a.linkLabel}
      </Link>
      {a.afterLink}
    </>
  );
}

function FaqItem({ faq, index, locale }: { faq: Faq; index: number; locale: Locale }) {
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
            <p className="font-body text-sm text-forest-500 pb-4 leading-relaxed">
              <FaqAnswer a={faq.a} locale={locale} />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function KontaktPageContent() {
  const locale = useLocale();
  const t = getDict(locale).kontakt;
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnstileToken = useRef<string>("");

  useEffect(() => {
    const SITE_KEY = "0x4AAAAAADCAIuxW7h0ePfOM";
    const CONTAINER_ID = "turnstile-container";

    const renderWidget = () => {
      const el = document.getElementById(CONTAINER_ID);
      if (!el || el.childElementCount > 0) return; // already rendered
      (window as any).turnstile?.render(`#${CONTAINER_ID}`, {
        sitekey: SITE_KEY,
        theme: "light",
        language: locale,
        callback: (token: string) => { turnstileToken.current = token; },
      });
    };

    if ((window as any).turnstile) {
      // Script already loaded (e.g. back-navigation)
      renderWidget();
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.head.appendChild(script);
    }

    return () => {
      // Reset token on unmount so stale tokens aren't reused
      turnstileToken.current = "";
    };
  }, [locale]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = {
      name:           (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:          (form.elements.namedItem('email')   as HTMLInputElement).value,
      phone:          (form.elements.namedItem('phone')   as HTMLInputElement).value,
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
      // API-Meldungen sind deutsch – auf /en die Dictionary-Übersetzung zeigen.
      if (!res.ok) throw new Error(locale === "de" ? (json.error ?? t.form.errSend) : t.form.errSend);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.form.errFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Page header */}
      <div className="bg-forest-900">
        <div className="container-site py-14">
          <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-300 mb-2">{t.header.kicker}</p>
          <h1 className="font-display text-display-lg text-cream-50">
            {t.header.title}
          </h1>
          <p className="font-body text-sm text-cream-50/60 mt-3">
            {t.header.note}
          </p>
        </div>
      </div>

      <div className="container-site py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact form – col 3 */}
          <div className="lg:col-span-3">
            <h2 className="font-display text-2xl text-forest-900 mb-6">{t.form.heading}</h2>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-forest-700/10 border border-forest-200 text-center"
              >
                <p className="text-2xl mb-2">✓</p>
                <p className="font-body text-base font-medium text-forest-800 mb-1">
                  {t.form.successTitle}
                </p>
                <p className="font-body text-sm text-forest-500">
                  {t.form.successText}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-body text-sm font-medium text-forest-700 mb-1.5 block" htmlFor="name">
                      {t.form.nameLabel}
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-forest-800 placeholder:text-forest-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                      placeholder={t.form.namePlaceholder}
                    />
                  </div>
                  <div>
                    <label className="font-body text-sm font-medium text-forest-700 mb-1.5 block" htmlFor="email">
                      {t.form.emailLabel}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-forest-800 placeholder:text-forest-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                      placeholder={t.form.emailPlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-body text-sm font-medium text-forest-700 mb-1.5 block" htmlFor="phone">
                    {t.form.phoneLabel}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-forest-800 placeholder:text-forest-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                    placeholder={t.form.phonePlaceholder}
                  />
                </div>

                <div>
                  <label className="font-body text-sm font-medium text-forest-700 mb-1.5 block" htmlFor="subject">
                    {t.form.subjectLabel}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-forest-800 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition"
                  >
                    <option value="">{t.form.subjectPlaceholder}</option>
                    <option value="haus28">{t.form.subjectHaus28}</option>
                    <option value="schoenblick">{t.form.subjectSchoenblick}</option>
                    <option value="gruppe">{t.form.subjectGruppe}</option>
                    <option value="other">{t.form.subjectOther}</option>
                  </select>
                </div>

                <div>
                  <label className="font-body text-sm font-medium text-forest-700 mb-1.5 block" htmlFor="message">
                    {t.form.messageLabel}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white font-body text-sm text-forest-800 placeholder:text-forest-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition resize-none"
                    placeholder={t.form.messagePlaceholder}
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
                    {t.form.privacyPre}{" "}
                    <Link href={localizeHref("/datenschutz", locale)} className="text-gold-600 underline underline-offset-2">
                      {t.form.privacyLink}
                    </Link>{" "}
                    {t.form.privacyPost}
                  </label>
                </div>

                <div id="turnstile-container" />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-forest-700 text-cream-50 font-body font-medium text-sm rounded-full hover:bg-forest-800 transition-colors disabled:opacity-60 disabled:pointer-events-none"
                >
                  {loading ? t.form.submitting : t.form.submit}
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
              <h2 className="font-display text-2xl text-forest-900 mb-5">{t.info.heading}</h2>
              <div className="space-y-4">
                <a
                  href="mailto:hallo@sarfi-collection.de"
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-cream-200 shadow-card hover:border-gold-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-forest-900 flex items-center justify-center shrink-0">
                    <IconMail size={16} className="text-gold-300" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-forest-400 mb-0.5">{t.info.emailLabel}</p>
                    <p className="font-body text-sm font-medium text-forest-800 group-hover:text-gold-700 transition-colors">
                      hallo@sarfi-collection.de
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+4917656850146"
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-cream-200 shadow-card hover:border-gold-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-forest-900 flex items-center justify-center shrink-0">
                    <IconPhone size={16} className="text-gold-300" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-forest-400 mb-0.5">{t.info.phoneLabel}</p>
                    <p className="font-body text-sm font-medium text-forest-800 group-hover:text-gold-700 transition-colors">
                      +49 176 56850146
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/4917656850146"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-cream-200 shadow-card hover:border-gold-300 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-forest-900 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" className="text-gold-300" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-body text-xs text-forest-400 mb-0.5">{t.info.whatsappLabel}</p>
                    <p className="font-body text-sm font-medium text-forest-800 group-hover:text-gold-700 transition-colors">
                      {t.info.whatsappAction}
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-cream-200 shadow-card">
                  <div className="w-10 h-10 rounded-full bg-forest-900 flex items-center justify-center shrink-0">
                    <IconMapPin size={16} className="text-gold-300" />
                  </div>
                  <div>
                    <p className="font-body text-xs text-forest-400 mb-0.5">{t.info.locationsLabel}</p>
                    <p className="font-body text-sm text-forest-700">
                      {t.info.locations}
                    </p>
                    <p className="font-body text-xs text-forest-400">{t.info.region}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response time */}
            <div className="p-5 rounded-2xl bg-gold-300/15 border border-gold-300/30">
              <p className="font-body text-sm font-semibold text-forest-800 mb-1">
                {t.info.responseTitle}
              </p>
              <p className="font-body text-sm text-forest-600">
                {t.info.responseText}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="font-display text-2xl text-forest-900 mb-6" id="faq">
            {t.faq.heading}
          </h2>
          <div className="bg-white rounded-2xl border border-cream-200 shadow-card px-6 max-w-2xl">
            {t.faq.items.map((faq, i) => (
              <FaqItem key={faq.q} faq={faq} index={i} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
