"use client";

import { useEffect } from "react";

/**
 * Kleine Hilfe zum CSS-Filter der Ausflugsziele (Radios + :has in globals.css):
 * - Beim Filterwechsel weiter unten auf der Seite rückt der Anfang der Liste
 *   ins Bild, sonst landet man nach dem Filtern im Leeren.
 * - „Essen gehen“ zeigt nur die Gasthäuser – die klappen dann gleich auf.
 * Ohne JS funktioniert der Filter trotzdem, nur ohne diese zwei Extras.
 */
export default function AusflugFilterHelfer({ einkehrId }: { einkehrId: string }) {
  useEffect(() => {
    const beiWechsel = (e: Event) => {
      const input = e.target;
      if (!(input instanceof HTMLInputElement) || input.name !== "ausflug-filter" || !input.checked) return;
      if (input.id === "af-essen") {
        const details = document.getElementById(einkehrId);
        if (details instanceof HTMLDetailsElement) details.open = true;
      }
      const liste = input.closest(".ausflug-filter");
      if (liste) {
        const oben = liste.getBoundingClientRect().top + window.scrollY;
        if (window.scrollY > oben) window.scrollTo({ top: oben });
      }
    };
    document.addEventListener("change", beiWechsel);
    return () => document.removeEventListener("change", beiWechsel);
  }, [einkehrId]);
  return null;
}
