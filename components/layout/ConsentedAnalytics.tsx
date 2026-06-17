"use client";

import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

/**
 * Loads Vercel Analytics & Speed Insights ONLY after the visitor has actively
 * consented via the cookie banner. Required for DSGVO/TTDSG compliance: as long
 * as the banner offers an "Ablehnen" option, no tracking may run before/without
 * consent. Reacts live to the banner's choice via the `sarfi-consent-changed`
 * event, so no page reload is needed after accepting.
 */
export const COOKIE_CONSENT_KEY = "sarfi_cookie_consent";
export const CONSENT_EVENT = "sarfi-consent-changed";

export default function ConsentedAnalytics() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const read = () =>
      setAccepted(localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted");

    read();
    // React to consent given/revoked in this tab …
    window.addEventListener(CONSENT_EVENT, read);
    // … and in other tabs.
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(CONSENT_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  if (!accepted) return null;

  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
