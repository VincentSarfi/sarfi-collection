import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog – Tipps & Inspiration für den Bayerischen Wald",
  description:
    "Wanderrouten, Ausflugstipps und Reisetipps für deinen Urlaub im Bayerischen Wald – direkt von den Gastgebern der SARFI Collection.",
  alternates: { canonical: "https://www.sarfi-collection.de/blog" },
};

const CATEGORY_COLORS: Record<string, string> = {
  Ausflugstipps:    "bg-forest-100 text-forest-700",
  Reiseinspiration: "bg-gold-100 text-gold-700",
  "Tipps & Infos":  "bg-cream-200 text-forest-600",
  "SARFI Stories":  "bg-forest-900 text-cream-50",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div className="bg-forest-900 pt-20 pb-12">
        <div className="container-site">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-gold-400 mb-3">
            SARFI Collection
          </p>
          <h1 className="font-display text-display-lg text-cream-50 mb-4">
            Blog
          </h1>
          <p className="font-body text-lg text-cream-50/70 max-w-xl leading-relaxed">
            Wanderrouten, Ausflugstipps und Inspiration für deinen Urlaub im Bayerischen Wald – direkt von uns.
          </p>
        </div>
      </div>

      <div className="container-site py-12 md:py-16">
        {posts.length === 0 ? (
          <p className="font-body text-forest-500 text-center py-20">
            Noch keine Beiträge veröffentlicht.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-cream-200 hover:border-forest-300 hover:shadow-card-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-forest-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full font-body text-xs font-medium ${
                        CATEGORY_COLORS[post.category] ?? "bg-cream-100 text-forest-700"
                      }`}
                    >
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  <h2 className="font-display text-xl text-forest-900 mb-2 leading-snug group-hover:text-forest-700 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="font-body text-sm text-forest-500 leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-100">
                    <span className="font-body text-xs text-forest-400">
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="font-body text-xs text-forest-400">
                      {post.readingTime} Min. Lesezeit
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
