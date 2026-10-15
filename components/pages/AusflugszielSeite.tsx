import Link from "next/link";
import Image from "next/image";
import { IconArrowRight, IconMapPin } from "@/components/ui/Icons";
import FaqAccordion from "@/components/property/FaqAccordion";
import SteinbergliftWebcam from "@/components/pages/SteinbergliftWebcam";
import { ausflugszieleMaterial, wanderungBilder, type BildFreigabe } from "@/data/ausflugsziele-bildmaterial";
import { STAND, type ZielSeite } from "@/data/ausflugsziel-seiten";
import { haus28, schoenblick } from "@/data/properties";
import { absoluteUrl, breadcrumbSchema, ORGANIZATION_ID } from "@/lib/seo";

/** Fotos einer Seite in der Reihenfolge der Quellen (eigene Wanderfotos oder Betreiberfotos) */
export function bilderVon(seite: ZielSeite): BildFreigabe[] {
  return seite.bildQuellen.flatMap((q) => (q === "wanderung" ? wanderungBilder : ausflugszieleMaterial[q]?.bilder ?? []));
}

/** Bildnachweis als ImageObject – Google zeigt ihn in der Bildersuche an (creditText/license) */
function bildSchema(b: BildFreigabe) {
  return {
    "@type": "ImageObject",
    contentUrl: absoluteUrl(b.src),
    caption: b.alt.de,
    ...(b.credit
      ? { creditText: b.credit.replace(/^©\s*/, ""), copyrightNotice: b.credit }
      : { creator: { "@type": "Person", name: "Vincent Sarfi" }, creditText: "Vincent Sarfi" }),
    ...(b.lizenz ? { license: b.lizenz.url } : {}),
  };
}

/** JSON-LD einer Ausflugsziel-Seite: das Ziel selbst, Brotkrumen und die sichtbaren FAQ */
export function zielSeiteJsonLd(seite: ZielSeite) {
  const url = absoluteUrl(`/ausflugsziele/${seite.slug}`);
  const websites = seite.websiteVon.map((id) => ausflugszieleMaterial[id]?.website).filter(Boolean);
  return [
    {
      "@context": "https://schema.org",
      "@type": seite.schema.typ,
      "@id": `${url}#ziel`,
      name: seite.schema.name,
      description: seite.kurzantwort,
      url,
      ...(websites.length ? { sameAs: websites } : {}),
      image: bilderVon(seite).map(bildSchema),
      geo: { "@type": "GeoCoordinates", latitude: seite.schema.geo.lat, longitude: seite.schema.geo.lng },
      address: {
        "@type": "PostalAddress",
        ...(seite.schema.adresse.strasse ? { streetAddress: seite.schema.adresse.strasse } : {}),
        ...(seite.schema.adresse.plz ? { postalCode: seite.schema.adresse.plz } : {}),
        addressLocality: seite.schema.adresse.ort,
        addressRegion: "Bayern",
        addressCountry: "DE",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url,
      url,
      name: seite.title,
      description: seite.description,
      inLanguage: "de",
      dateModified: STAND.iso,
      about: { "@id": `${url}#ziel` },
      publisher: { "@id": ORGANIZATION_ID },
    },
    breadcrumbSchema([
      ["Startseite", "/"],
      ["Ausflugsziele", "/ausflugsziele"],
      [seite.h1.split(":")[0], `/ausflugsziele/${seite.slug}`],
    ]),
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seite.faq.map((f) => ({
        "@type": "Question",
        name: f.frage,
        acceptedAnswer: { "@type": "Answer", text: f.antwort },
      })),
    },
  ];
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/** Bildnachweis unter einem Foto; eigene Fotos brauchen keinen */
function Nachweis({ b, hell }: { b: BildFreigabe; hell?: boolean }) {
  if (!b.credit) return null;
  return (
    <figcaption className={`mt-1 font-body text-[11px] leading-snug ${hell ? "text-cream-50/60" : "text-forest-500"}`}>
      Foto: {b.credit}
      {b.lizenz && (
        <>
          {" · "}
          <a href={b.lizenz.url} target="_blank" rel="noopener noreferrer license" className="underline underline-offset-2">
            {b.lizenz.name}
          </a>
        </>
      )}
    </figcaption>
  );
}

const HAEUSER = {
  haus28: { name: "HAUS28", ort: "Grattersdorf", href: "/haus28", buchen: "/haus28/buchen", bild: haus28.images.hero },
  schoenblick: { name: "Haus Schönblick", ort: "Schöfweg-Langfurth", href: "/schoenblick", buchen: "/schoenblick/buchen", bild: schoenblick.images.hero },
} as const;

/** Eigene Seite für ein Ausflugsziel (Inhalt aus data/ausflugsziel-seiten.ts) */
export default function AusflugszielSeite({ seite }: { seite: ZielSeite }) {
  const bilder = bilderVon(seite);
  const [titelbild, ...weitere] = bilder;
  const webcam = seite.webcamVon ? ausflugszieleMaterial[seite.webcamVon]?.webcam : undefined;
  const websites = seite.websiteVon.map((id) => ausflugszieleMaterial[id]).filter((w): w is NonNullable<typeof w> => Boolean(w));
  const haeuser = seite.unterkunft.zuerst === "haus28" ? (["haus28", "schoenblick"] as const) : (["schoenblick", "haus28"] as const);

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* ── Kopf ── */}
      <div className="bg-forest-900">
        <div className="container-site py-10 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <nav aria-label="Breadcrumb" className="mb-3">
              <ol className="flex flex-wrap items-center gap-2 font-body text-xs text-cream-50/60">
                <li>
                  <Link href="/" className="hover:text-cream-50/80 transition-colors">Startseite</Link>
                </li>
                <li className="flex items-center gap-2">
                  <IconArrowRight size={10} />
                  <Link href="/ausflugsziele" className="hover:text-cream-50/80 transition-colors">Ausflugsziele</Link>
                </li>
                <li className="flex items-center gap-2">
                  <IconArrowRight size={10} />
                  <span>{seite.h1.split(":")[0]}</span>
                </li>
              </ol>
            </nav>
            <h1 className="font-display text-display-md text-cream-50 leading-tight mb-3">{seite.h1}</h1>
            <p className="font-body text-base text-cream-50/70 max-w-lg">{seite.untertitel}</p>
          </div>
          {titelbild && (
            <figure className="m-0">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-forest-800">
                <Image
                  src={titelbild.src}
                  alt={titelbild.alt.de}
                  fill
                  priority
                  fetchPriority="high"
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <Nachweis b={titelbild} hell />
            </figure>
          )}
        </div>
      </div>

      <div className="container-site py-10 md:py-14">
        <div className="max-w-3xl">
          {/* Kurzantwort – steht bewusst ganz oben */}
          <p className="font-body text-lg text-forest-800 leading-relaxed">{seite.kurzantwort}</p>

          {seite.hinweis && (
            <p role="note" className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-body text-sm text-amber-900 leading-snug">
              {seite.hinweis}
            </p>
          )}

          {/* Fakten als Tabelle – Google und KI-Suchen übernehmen Tabellen gern als Antwort */}
          <h2 className="font-display text-2xl text-forest-900 mt-10 mb-3">Das Wichtigste auf einen Blick</h2>
          <div className="overflow-x-auto rounded-2xl border border-cream-200 bg-white">
            <table className="w-full font-body text-sm text-left">
              <tbody className="divide-y divide-cream-200">
                {seite.fakten.map((f) => (
                  <tr key={f.label}>
                    <th scope="row" className="px-4 py-3 align-top font-semibold text-forest-900 w-[38%] sm:w-[30%]">{f.label}</th>
                    <td className="px-4 py-3 text-forest-700">{f.wert}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 font-body text-xs text-forest-500">
            Stand: <time dateTime={STAND.iso}>{STAND.text}</time> · Angaben laut Betreiber, Preise und Zeiten können sich ändern.
          </p>

          {/* Abschnitte */}
          {seite.abschnitte.map((a) => (
            <section key={a.h2} className="mt-10">
              <h2 className="font-display text-2xl text-forest-900 mb-3">{a.h2}</h2>
              {a.absaetze.map((p) => (
                <p key={p.slice(0, 40)} className="font-body text-[15px] text-forest-700 leading-relaxed mb-3">{p}</p>
              ))}
              {a.liste && (
                <ul className="mt-2 space-y-1.5">
                  {a.liste.map((l) => (
                    <li key={l} className="flex items-start gap-2 font-body text-[15px] text-forest-700 leading-snug">
                      <span className="mt-[0.5rem] w-1.5 h-1.5 rounded-full bg-gold-500 flex-none" aria-hidden="true" />
                      {l}
                    </li>
                  ))}
                </ul>
              )}
              {a.link && (
                <Link href={a.link.href} className="inline-flex items-center gap-1.5 font-body text-[15px] text-forest-700 hover:text-forest-900 underline underline-offset-2 decoration-forest-300">
                  {a.link.text} <IconArrowRight size={14} />
                </Link>
              )}
            </section>
          ))}

          {/* Live-Webcam (nur mit Freigabe, Bild läuft über die eigene API-Route) */}
          {webcam && (
            <section className="mt-10">
              <h2 className="font-display text-2xl text-forest-900 mb-3">Live-Webcam</h2>
              <SteinbergliftWebcam
                page={webcam.seite}
                labels={{
                  caption: "Live-Webcam am Steinberglift",
                  linkLabel: "Webcam: Steinberglift – zur Webcam-Seite",
                  fallback: "Webcam gerade nicht erreichbar – Live-Bild auf steinberglift.de ansehen",
                  newTab: "(öffnet in neuem Tab)",
                }}
              />
            </section>
          )}

          {/* Weitere Fotos */}
          {weitere.length > 0 && (
            <section className="mt-10">
              <h2 className="font-display text-2xl text-forest-900 mb-3">Fotos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {weitere.map((b) => (
                  <figure key={b.src} className="m-0">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-cream-100">
                      <Image src={b.src} alt={b.alt.de} fill className="object-cover" sizes="(max-width: 640px) 100vw, 380px" />
                    </div>
                    <Nachweis b={b} />
                  </figure>
                ))}
              </div>
            </section>
          )}

          {/* Offizielle Websites */}
          {websites.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
              {websites.map((w) => (
                <a
                  key={w.website}
                  href={w.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-body text-sm text-forest-700 hover:text-forest-900 underline underline-offset-2 decoration-forest-300"
                >
                  Offizielle Website ({new URL(w.website).hostname.replace(/^www\./, "")})
                  <ExternalIcon />
                  <span className="sr-only"> (öffnet in neuem Tab)</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ── Übernachten in der Nähe ── */}
        <section className="mt-14" aria-labelledby="uebernachten-heading">
          <h2 id="uebernachten-heading" className="font-display text-2xl text-forest-900 mb-1">Übernachten in der Nähe</h2>
          <p className="font-body text-sm text-forest-600 mb-5">Direkt bei uns buchen – ohne Plattformgebühren.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {haeuser.map((key) => {
              const h = HAEUSER[key];
              return (
                <div key={key} className="rounded-2xl bg-white border border-cream-200 overflow-hidden flex flex-col">
                  <div className="relative aspect-[16/9] bg-cream-100">
                    <Image src={h.bild} alt={`${h.name} in ${h.ort}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="flex items-center gap-1.5 font-body text-xs text-forest-500 mb-1">
                      <IconMapPin size={12} />
                      {h.ort}
                    </p>
                    <h3 className="font-display text-xl text-forest-900 mb-2">{h.name}</h3>
                    <p className="font-body text-sm text-forest-700 leading-relaxed flex-1">{seite.unterkunft[key]}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={h.buchen}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gold-500 text-forest-900 font-body text-sm font-semibold hover:bg-gold-400 transition-colors"
                      >
                        Verfügbarkeit prüfen
                      </Link>
                      <Link
                        href={h.href}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-forest-200 text-forest-800 font-body text-sm hover:bg-forest-50 transition-colors"
                      >
                        {h.name} ansehen <IconArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* ── Häufige Fragen (eigene Sektion mit Überschrift, wie auf den Unterkunftsseiten) ── */}
      <FaqAccordion faqs={seite.faq.map((f) => ({ question: f.frage, answer: f.antwort }))} />

      <div className="container-site pb-14">
        {/* ── Weiter ── */}
        <nav className="max-w-3xl" aria-label="Weitere Ausflugsziele">
          <h2 className="font-display text-xl text-forest-900 mb-3">Auch interessant</h2>
          <ul className="space-y-2">
            {seite.verwandt.map((v) => (
              <li key={v.href}>
                <Link href={v.href} className="inline-flex items-center gap-1.5 font-body text-[15px] text-forest-700 hover:text-forest-900 underline underline-offset-2 decoration-forest-300">
                  {v.text} <IconArrowRight size={14} />
                </Link>
              </li>
            ))}
            <li>
              <Link href="/ausflugsziele" className="inline-flex items-center gap-1.5 font-body text-[15px] text-forest-700 hover:text-forest-900 underline underline-offset-2 decoration-forest-300">
                Alle Ausflugsziele nach Fahrzeit <IconArrowRight size={14} />
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
