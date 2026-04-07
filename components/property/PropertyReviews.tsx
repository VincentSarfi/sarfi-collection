"use client";

import { useState } from "react";
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

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-white border border-cream-200 shadow-card h-full">
      {/* Stars */}
      <div className="flex gap-0.5 text-gold-500">
        {[1,2,3,4,5].map((i) => (
          <IconStar key={i} size={13} filled={i <= review.rating} />
        ))}
      </div>

      <p className="font-body text-sm text-forest-700 leading-relaxed flex-1">
        &ldquo;{review.text}&rdquo;
      </p>

      <div className="flex items-center gap-3 pt-3 border-t border-cream-200">
        <div className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center shrink-0">
          <span className="font-body text-xs font-semibold text-cream-50">
            {review.avatarInitials}
          </span>
        </div>
        <div>
          <p className="font-body text-sm font-medium text-forest-900">{review.author}</p>
          <p className="font-body text-xs text-forest-500">
            {review.location} · {review.date}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PropertyReviews({
  reviews,
  averageRating,
  totalCount,
  airbnbUrl,
}: PropertyReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const visible = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section
      ref={ref}
      className="section-pad-sm bg-cream-50"
      aria-labelledby="reviews-heading"
    >
      <div className="container-site">
        {/* Header */}
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
                {[1,2,3,4,5].map((i) => (
                  <IconStar key={i} size={16} filled={i <= Math.round(averageRating)} />
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

          {airbnbUrl && (
            <a
              href={airbnbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-body text-sm text-forest-600 hover:text-forest-900 transition-colors"
            >
              Alle Bewertungen auf Airbnb
              <IconChevronRight size={14} />
            </a>
          )}
        </motion.div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {visible.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>

        {/* Show more */}
        {reviews.length > 3 && !showAll && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full border border-forest-200 font-body text-sm text-forest-600 hover:text-forest-900 hover:border-forest-400 transition-colors"
            >
              Alle {reviews.length} Bewertungen anzeigen
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
