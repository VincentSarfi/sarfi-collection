"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type Status = "idle" | "loading" | "success" | "error";

// Öffentlicher Cloudflare-Turnstile-Site-Key (client-seitig unbedenklich).
const TURNSTILE_SITE_KEY = "0x4AAAAAADCAIuxW7h0ePfOM";
const TURNSTILE_CONTAINER_ID = "newsletter-turnstile";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const locale = useLocale();
  const t = getDict(locale).common.newsletter;

  // Turnstile wird erst bei erster Interaktion geladen (spart Script-Last auf
  // jeder Seite, da das Formular im Footer global gerendert wird).
  const turnstileToken = useRef<string>("");
  const turnstileLoaded = useRef(false);

  const ensureTurnstile = useCallback(() => {
    if (turnstileLoaded.current) return;
    turnstileLoaded.current = true;

    const render = () => {
      const el = document.getElementById(TURNSTILE_CONTAINER_ID);
      if (!el || el.childElementCount > 0) return; // schon gerendert
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).turnstile?.render(`#${TURNSTILE_CONTAINER_ID}`, {
        sitekey: TURNSTILE_SITE_KEY,
        appearance: "interaction-only", // unsichtbar, bis eine Challenge nötig ist
        language: locale,
        callback: (token: string) => { turnstileToken.current = token; },
        "expired-callback": () => { turnstileToken.current = ""; },
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).turnstile) {
      render();
    } else {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = render;
      document.head.appendChild(script);
    }
  }, [locale]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    if (!consent) {
      setStatus("error");
      setMessage(t.errConsent);
      return;
    }
    // Bot-Schutz: ohne Token nicht absenden (Server lehnt sonst mit 400 ab).
    if (!turnstileToken.current) {
      ensureTurnstile();
      setStatus("error");
      setMessage(t.errSecurity);
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent, turnstileToken: turnstileToken.current }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        // API-Meldungen sind deutsch – auf /en die Dictionary-Übersetzung zeigen.
        setMessage(locale === "de" ? (data.message ?? t.success) : t.success);
        setEmail("");
        setConsent(false);
      } else {
        setStatus("error");
        setMessage(locale === "de" ? (data.error ?? t.errFallback) : t.errFallback);
      }
    } catch {
      setStatus("error");
      setMessage(t.errNetwork);
    }
  }

  if (status === "success") {
    return (
      <p className="font-body text-sm text-cream-50/80 leading-relaxed">
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5" noValidate>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={ensureTurnstile}
          placeholder={t.placeholder}
          autoComplete="email"
          aria-label={t.emailAria}
          className="min-w-0 flex-1 rounded-lg bg-cream-50/10 border border-cream-50/20 px-3 py-2 font-body text-sm text-cream-50 placeholder:text-cream-50/40 focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 rounded-lg bg-gold-500 px-4 py-2 font-body text-sm font-semibold text-forest-900 hover:bg-gold-400 disabled:opacity-60 transition-colors"
        >
          {status === "loading" ? "…" : t.submit}
        </button>
      </div>
      <label className="flex items-start gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-3.5 h-3.5 rounded border-cream-50/30 accent-gold-500 cursor-pointer"
        />
        <span className="font-body text-xs text-cream-50/60 leading-snug">
          {t.consentPre}{" "}
          <Link href="/datenschutz" className="underline hover:text-cream-50/90">
            {t.consentLink}
          </Link>
          .
        </span>
      </label>
      {/* Turnstile-Container (unsichtbar bei interaction-only); leer bis erste Interaktion */}
      <div id={TURNSTILE_CONTAINER_ID} />
      {status === "error" && (
        <p className="font-body text-xs text-red-300">{message}</p>
      )}
    </form>
  );
}
