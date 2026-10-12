"use client";

import { useEffect } from "react";

/**
 * Öffnet ein <details> (oder dessen umschließendes), wenn die URL per #anker
 * darauf zeigt – etwa /ausflugsziele#buechelstein-wanderung von der
 * HAUS28-Seite oder der Chip „Essen gehen“. Ohne JS bleibt es einfach zu.
 */
export default function DetailsHashOpener() {
  useEffect(() => {
    const oeffnen = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      const details = el instanceof HTMLDetailsElement ? el : el?.closest("details");
      if (details && !details.open) {
        details.open = true;
        el?.scrollIntoView({ block: "start" });
      }
    };
    oeffnen();
    window.addEventListener("hashchange", oeffnen);
    return () => window.removeEventListener("hashchange", oeffnen);
  }, []);
  return null;
}
