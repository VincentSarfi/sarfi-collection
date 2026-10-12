"use client";

import { useState } from "react";

/**
 * Live-Bild der Steinberglift-Webcam über /api/webcam/steinberglift
 * (serverseitig gecacht, Besucher-IP bleibt bei uns – DSGVO).
 * Lädt das Bild nicht, geht es direkt zum Platzhalter mit Link.
 */
export default function SteinbergliftWebcam({
  page,
  labels,
}: {
  page: string;
  labels: { caption: string; linkLabel: string; fallback: string; newTab: string };
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="m-0 max-w-md">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-forest-900/10 bg-forest-900/5">
        {failed ? (
          <a
            href={page}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center p-4 text-center font-body text-sm text-forest-600 underline underline-offset-2 hover:text-forest-900"
          >
            {labels.fallback}
            <span className="sr-only"> {labels.newTab}</span>
          </a>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- Live-Bild über eigene API-Route, vorberechnete Varianten gibt es dafür nicht
          <img
            src="/api/webcam/steinberglift"
            alt={labels.caption}
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
      <figcaption className="mt-1 font-body text-[11px] text-forest-500">
        <a
          href={page}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-forest-700"
        >
          {labels.linkLabel}
          <span className="sr-only"> {labels.newTab}</span>
        </a>
      </figcaption>
    </figure>
  );
}
