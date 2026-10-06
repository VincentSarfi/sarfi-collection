"use client";

import { useEffect, useRef, useState } from "react";

/**
 * „Mehr anzeigen“ per CSS line-clamp statt per String-Kürzung: Der volle Text
 * steht immer im HTML (Suchmaschinen, KI-Crawler), gekürzt wird nur optisch.
 *
 * `likelyLong` steuert, ob der Umschalter schon im Server-HTML erscheint; nach
 * dem Rendern wird gemessen und der Umschalter ausgeblendet, falls der Text
 * doch in die Zeilen passt.
 */
export function useLineClamp<T extends HTMLElement>(likelyLong: boolean) {
  const ref = useRef<T>(null);
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(likelyLong);

  useEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [expanded]);

  return {
    ref,
    expanded,
    toggle: () => setExpanded((v) => !v),
    showToggle: clamped || expanded,
  };
}
