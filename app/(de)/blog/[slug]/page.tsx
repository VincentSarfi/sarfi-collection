import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllSlugs, formatDate } from "@/lib/blog";
import { IconArrowRight } from "@/components/ui/Icons";

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
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image, alt: post.title }],
    },
    alternates: { canonical: `https://www.sarfi-collection.de/blog/${post.slug}` },
  };
}

function renderContent(content: string) {
  const blocks = content.split(/\n\n+/).filter(Boolean);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="font-display text-2xl md:text-3xl text-forest-900 mt-10 mb-4">
          {block.slice(3)}
        </h2>
      );
    }
    if (block.startsWith("### ")) {
      return (
        <h3 key={i} className="font-display text-xl text-forest-900 mt-8 mb-3">
          {block.slice(4)}
        </h3>
      );
    }
    if (block.startsWith("- ")) {
      const items = block.split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2));
      return (
        <ul key={i} className="my-4 space-y-1.5 pl-5">
          {items.map((item, j) => (
            <li
              key={j}
              className="font-body text-base text-forest-700 leading-relaxed list-disc"
              dangerouslySetInnerHTML={{
                __html: item.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          ))}
        </ul>
      );
    }
    return (
      <p
        key={i}
        className="font-body text-base text-forest-700 leading-relaxed my-4"
        dangerouslySetInnerHTML={{
          __html: block.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
        }}
      />
    );
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `https://www.sarfi-collection.de${post.image}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.sarfi-collection.de/blog/${post.slug}`,
    },
    author: { "@type": "Organization", name: "SARFI Collection" },
    publisher: {
      "@type": "Organization",
      name: "SARFI Collection",
      url: "https://www.sarfi-collection.de",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            <span className="font-body text-xs text-forest-400">{formatDate(post.publishedAt)}</span>
            <span className="font-body text-xs text-forest-400">{post.readingTime} Min. Lesezeit</span>
          </div>

          <h1 className="font-display text-display-md text-forest-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="font-body text-lg text-forest-500 leading-relaxed mb-8 pb-8 border-b border-cream-200">
            {post.excerpt}
          </p>

          {/* Content */}
          <div>{renderContent(post.content)}</div>

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
