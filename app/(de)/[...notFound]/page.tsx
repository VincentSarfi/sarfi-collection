import { notFound } from "next/navigation";

/**
 * Catch-all für alle URLs, die keine echte Route treffen.
 * Nötig, weil es seit dem (de)/(en)-Split kein gemeinsames Root-Layout mehr
 * gibt – ohne diesen Catch-all würde Next.js für unbekannte Pfade seine
 * ungestylte Standard-404 rendern statt app/(de)/not-found.tsx.
 */
export default function CatchAllNotFound() {
  notFound();
}
