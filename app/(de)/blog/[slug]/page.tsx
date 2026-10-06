import type { Metadata } from "next";
import path from "node:path";
import sharp from "sharp";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllSlugs, formatDate } from "@/lib/blog";
import { IconArrowRight } from "@/components/ui/Icons";
import { escapeHtml } from "@/lib/escape";
import { absoluteUrl, breadcrumbSchema, ORGANIZATION_ID, pageMetadata, SITE_URL } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Alle Posts kommen aus generateStaticParams – unbekannte Slugs => 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return pageMetadata({
    path: `/blog/${post.slug}`,
    locale: "de",
    title: post.title,
    description: post.excerpt,
    image: { url: post.image, alt: post.title },
    type: "article",
  });
}

// Alle Beiträge stammen von den Gastgebern.
const AUTHORS = ["Vincent Sarfi", "Elena Sarfi"];
const BYLINE = "Vincent & Elena Sarfi";

const LINK_CLASS = "text-forest-900 underline underline-offset-2 hover:text-gold-700";

/** Inline-Markdown: **fett**, *kursiv*, [Text](url). Text wird vorher escaped. */
function renderInline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, `<a href="$2" class="${LINK_CLASS}">$1</a>`);
}

type Block =
  | { type: "h2" | "h3" | "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "img"; alt: string; src: string; width?: number; height?: number };

/**
 * Zeilenbasiertes Markdown (## / ###, Listen mit "- ", Bilder, Absätze).
 * Zeilenbasiert statt absatzbasiert, damit z. B. eine Überschrift direkt
 * über einer Liste nicht samt Liste in der Überschrift landet.
 */
function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushPara = () => {
    if (para.length) blocks.push({ type: "p", text: para.join("\n") });
    para = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ type: "ul", items: list });
    list = [];
  };

  for (const raw of content.split("\n")) {
    const line = raw.trim();
    let m: RegExpMatchArray | null;
    if (!line) {
      flushPara();
      flushList();
    } else if ((m = line.match(/^(#{2,3})\s+(.*)$/))) {
      flushPara();
      flushList();
      blocks.push({ type: m[1].length === 2 ? "h2" : "h3", text: m[2] });
    } else if ((m = line.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/))) {
      flushPara();
      flushList();
      blocks.push({ type: "img", alt: m[1], src: m[2] });
    } else if ((m = line.match(/^- (.*)$/))) {
      flushPara();
      list.push(m[1]);
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return blocks;
}

/**
 * Echte Bildmaße aus /public (läuft nur beim statischen Build), damit Hoch-
 * und Querformat unbeschnitten und ohne Layout-Sprung erscheinen.
 */
async function withImageSizes(blocks: Block[]): Promise<Block[]> {
  return Promise.all(
    blocks.map(async (block) => {
      if (block.type !== "img") return block;
      try {
        const { width, height } = await sharp(path.join(process.cwd(), "public", block.src)).metadata();
        return { ...block, width, height };
      } catch {
        return block;
      }
    }),
  );
}

function renderContent(blocks: Block[]) {
  return blocks.map((block, i) => {
    switch (block.type) {
      case "h2":
        return (
          <h2
            key={i}
            className="font-display text-2xl md:text-3xl text-forest-900 mt-10 mb-4"
            dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
          />
        );
      case "h3":
        return (
          <h3
            key={i}
            className="font-display text-xl text-forest-900 mt-8 mb-3"
            dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
          />
        );
      case "ul":
        return (
          <ul key={i} className="my-4 space-y-1.5 pl-5">
            {block.items.map((item, j) => (
              <li
                key={j}
                className="font-body text-base text-forest-700 leading-relaxed list-disc"
                dangerouslySetInnerHTML={{ __html: renderInline(item) }}
              />
            ))}
          </ul>
        );
      case "img": {
        const width = block.width ?? 1200;
        const height = block.height ?? 900;
        const portrait = height > width;
        return (
          <figure key={i} className={`my-8 mx-auto ${portrait ? "max-w-md" : ""}`}>
            <Image
              src={block.src}
              alt={block.alt}
              width={width}
              height={height}
              sizes={portrait ? "(max-width: 768px) 100vw, 448px" : "(max-width: 768px) 100vw, 672px"}
              className="w-full h-auto rounded-2xl bg-cream-100"
            />
            {block.alt && (
              <figcaption className="font-body text-xs text-forest-400 mt-2">{block.alt}</figcaption>
            )}
          </figure>
        );
      }
      default:
        return (
          <p
            key={i}
            className="font-body text-base text-forest-700 leading-relaxed my-4 whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: renderInline(block.text) }}
          />
        );
    }
  });
}

const PROPERTY_CTA: Record<string, { label: string; href: string; bg: string }> = {
  haus28: {
    label: "HAUS28 – A-Frame am Büchelstein entdecken",
    href: "/haus28",
    bg: "bg-forest-900",
  },
  schoenblick: {
    label: "Haus Schönblick – Panorama-Apartments entdecken",
    href: "/schoenblick",
    bg: "bg-forest-800",
  },
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const cta = post.property ? PROPERTY_CTA[post.property] : null;
  const blocks = await withImageSizes(parseBlocks(post.content));

  const postUrl = absoluteUrl(`/blog/${post.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.image),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: "de-DE",
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    author: AUTHORS.map((name) => ({ "@type": "Person", name, url: absoluteUrl("/ueber-uns") })),
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "SARFI Collection",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: absoluteUrl("/images/logo.svg") },
    },
  };
  const breadcrumbJsonLd = breadcrumbSchema([
    ["Startseite", "/"],
    ["Blog", "/blog"],
    [post.title, `/blog/${post.slug}`],
  ]);


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-cream-50">
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 bg-forest-900">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-900/30 to-forest-900/70" />
        </div>

        {/* Article */}
        <div className="container-site max-w-2xl py-10 md:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs font-body text-forest-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-forest-600 transition-colors">Startseite</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-forest-600 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-forest-600 truncate">{post.title}</span>
          </nav>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-block px-3 py-1 bg-forest-100 text-forest-700 rounded-full font-body text-xs font-medium">
              {post.category}
            </span>
            {post.draft && (
              <span className="inline-block px-3 py-1 bg-gold-100 text-gold-700 rounded-full font-body text-xs font-semibold">
                Entwurf – nicht öffentlich
              </span>
            )}
            <span className="font-body text-xs text-forest-400">
              {formatDate(post.publishedAt)}
              {post.updatedAt && post.updatedAt !== post.publishedAt && (
                <> · aktualisiert am {formatDate(post.updatedAt)}</>
              )}
            </span>
            <span className="font-body text-xs text-forest-400">{post.readingTime} Min. Lesezeit</span>
            <span className="font-body text-xs text-forest-400">
              von{" "}
              <Link href="/ueber-uns" className="underline underline-offset-2 hover:text-forest-700">
                {BYLINE}
              </Link>
            </span>
          </div>

          <h1 className="font-display text-display-md text-forest-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="font-body text-lg text-forest-500 leading-relaxed mb-8 pb-8 border-b border-cream-200">
            {post.excerpt}
          </p>

          {/* Content */}
          <div>{renderContent(blocks)}</div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-cream-200">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-cream-100 text-forest-500 rounded-full font-body text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Property CTA */}
          {cta && (
            <div className={`mt-10 rounded-2xl ${cta.bg} p-6 flex items-center justify-between gap-4`}>
              <p className="font-body text-sm text-cream-50/90">{cta.label}</p>
              <Link
                href={cta.href}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-gold-500 text-forest-900 text-sm font-medium font-body rounded-full hover:bg-gold-400 transition-colors"
              >
                Entdecken
                <IconArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 font-body text-sm text-forest-400 hover:text-forest-700 transition-colors"
            >
              ← Zurück zum Blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
