import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AusflugszielSeite, { bilderVon, zielSeiteJsonLd } from "@/components/pages/AusflugszielSeite";
import { zielSeite, zielSeiten } from "@/data/ausflugsziel-seiten";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Nur die Seiten aus data/ausflugsziel-seiten.ts – unbekannte Slugs => 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return zielSeiten.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const seite = zielSeite(slug);
  if (!seite) return {};
  const bild = bilderVon(seite)[0];
  return pageMetadata({
    path: `/ausflugsziele/${seite.slug}`,
    locale: "de",
    title: { absolute: seite.title },
    description: seite.description,
    ...(bild ? { image: { url: bild.src, alt: bild.alt.de } } : {}),
  });
}

export default async function AusflugszielPage({ params }: Props) {
  const { slug } = await params;
  const seite = zielSeite(slug);
  if (!seite) notFound();
  return (
    <>
      {zielSeiteJsonLd(seite).map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <AusflugszielSeite seite={seite} />
    </>
  );
}
