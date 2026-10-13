"use client";

import { useEffect } from "react";

/**
 * Öffnet ein <details> (oder dessen umschließendes), wenn die URL per #anker
 * darauf zeigt – etwa /ausflugsziele#buechelstein-wanderung von der
 * HAUS28-Seite oder der Chip „Essen gehen“. Ohne JS bleibt es einfach zu.
 *
 * Zwei Fälle, in denen ein Sprunglink sonst „nicht reagiert“ (Meldung Vincent
 * am iPhone, 13.10.2026):
 * - Ein aktiver Filter (.ausflug-filter) blendet das Ziel aus → zurück auf „Alle“.
 * - Derselbe Anker wird erneut angetippt → kein hashchange, also selbst scrollen.
 */
export default function DetailsHashOpener() {
  useEffect(() => {
    const oeffnen = (id: string) => {
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      if (el.offsetParent === null) {
        const alle = document.getElementById("af-alle");
        if (alle instanceof HTMLInputElement) alle.checked = true;
      }
      const details = el instanceof HTMLDetailsElement ? el : el.closest("details");
      if (details && !details.open) details.open = true;
      el.scrollIntoView({ block: "start" });
    };
    const ausUrl = () => oeffnen(decodeURIComponent(window.location.hash.slice(1)));

    // Klick auf einen Sprunglink dieser Seite: selbst öffnen und scrollen,
    // damit es auch bei aktivem Filter und bei wiederholtem Tippen klappt
    const beiKlick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!(a instanceof HTMLAnchorElement)) return;
      const id = decodeURIComponent(a.hash.slice(1));
      const ziel = id ? document.getElementById(id) : null;
      // nur Sprünge zu aufklappbaren Einträgen; andere Anker (z. B. „Zum Inhalt“) normal lassen
      if (!ziel || !(ziel instanceof HTMLDetailsElement || ziel.closest("details"))) return;
      e.preventDefault();
      if (window.location.hash !== a.hash) history.pushState(null, "", a.hash);
      oeffnen(id);
    };

    ausUrl();
    window.addEventListener("hashchange", ausUrl);
    document.addEventListener("click", beiKlick);
    return () => {
      window.removeEventListener("hashchange", ausUrl);
      document.removeEventListener("click", beiKlick);
    };
  }, []);
  return null;
}
