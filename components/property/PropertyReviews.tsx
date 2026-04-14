"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IconStar, IconChevronRight } from "@/components/ui/Icons";
import type { Review } from "@/data/reviews";

interface PropertyReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalCount: number;
  airbnbUrl?: string;
}

/* ── Single review card ─────────────────────────────────────────────────── */
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-cream-200 shadow-card h-full">
      {/* Header: avatar + name + date */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center shrink-0">
          <span className="font-body text-xs font-semibold text-cream-50">
            {review.avatarInitials}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-body text-sm font-medium text-forest-900 truncate">
            {review.author}
          </p>
          <p className="font-body text-xs text-forest-500">
            {review.date}
          </p>
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 text-gold-500">
        {[1, 2, 3, 4, 5].map((i) => (
          <IconStar key={i} size={14} filled={i <= review.rating} />
        ))}
      </div>

      {/* Text */}
      <p className="font-body text-sm text-forest-700 leading-relaxed flex-1">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Source badge */}
      <div className="pt-2 border-t border-cream-100">
        <span className="font-body text-[11px] tracking-wide uppercase text-forest-400">
          {review.location}
        </span>
      </div>
    </div>
  );
}

/* ── Chevron left icon (mirrored ChevronRight) ──────────────────────── */
function IconChevronLeft({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

/* ── Main component ─────────────────────────────────────────────────── */
export default function PropertyReviews({
  reviews,
  averageRating,
  totalCount,
  airbnbUrl,
}: PropertyReviewsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [sectionRef, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    // re-check after fonts load (can change widths)
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => ro.disconnect();
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card]");
    const step = card ? card.offsetWidth + 16 : 340;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="section-pad-sm bg-cream-50"
      aria-labelledby="reviews-heading"
    >
      <div className="container-site">
        {/* ── Header ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-end justify-between gap-4 mb-8"
        >
          <div>
            <h2
              id="reviews-heading"
              className="font-display text-display-md text-forest-900 mb-2"
            >
              Gästebewertungen
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 text-gold-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <IconStar
                    key={i}
                    size={16}
                    filled={i <= Math.round(averageRating)}
                  />
                ))}
              </div>
              <span className="font-body text-lg font-semibold text-forest-800">
                {averageRating}
              </span>
              <span className="font-body text-sm text-forest-500">
                · {totalCount} Bewertungen
              </span>
            </div>
          </div>

          {/* Desktop navigation arrows + Airbnb link */}
          <div className="flex items-center gap-3">
            {/* Carousel arrows – hidden if not scrollable */}
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Vorherige Bewertungen"
                className="w-9 h-9 rounded-full border border-forest-200 flex items-center justify-center text-forest-600 hover:text-forest-900 hover:border-forest-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <IconChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Nächste Bewertungen"
                className="w-9 h-9 rounded-full border border-forest-200 flex items-center justify-center text-forest-600 hover:text-forest-900 hover:border-forest-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <IconChevronRight size={18} />
              </button>
            </div>

            {airbnbUrl && (
              <a
                href={airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-body text-sm text-forest-600 hover:text-forest-900 transition-colors"
              >
                Alle auf Airbnb
                <IconChevronRight size={14} />
              </a>
            )}
          </div>
        </motion.div>

        {/* ── Carousel ──────────────────────────────────────────── */}
        <div className="relative">
          {/* Fade edges */}
          {canScrollLeft && (
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-cream-50 to-transparent z-10 pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-cream-50 to-transparent z-10 pointer-events-none" />
          )}

          {/* Scrollable track */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-0 lg:px-0"
          >
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                data-review-card
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: Math.min(i, 4) * 0.08 }}
                className="flex-none w-[300px] sm:w-[340px] lg:w-[calc(33.333%-11px)] snap-start"
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Mobile hint ───────────────────────────────────────── */}
        <p className="md:hidden text-center font-body text-xs text-forest-400 mt-3">
          Wische für mehr Bewertungen →
        </p>
      </div>
    </section>
  );
}
