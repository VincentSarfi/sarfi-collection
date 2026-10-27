"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IconStar } from "@/components/ui/Icons";
import { reviews } from "@/data/reviews";
import { getAggregateReviewStats, haus28, reviewPlatforms, schoenblick } from "@/data/properties";
import ReviewSourceNote from "@/components/property/ReviewSourceNote";
import { getDict } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";

// Show best 6 reviews on homepage
const featuredReviews = reviews.slice(0, 6);

// Bewertung je Haus (wie auf den Unterkunftskarten), keine gemeinsame Note beider Häuser
const houseStats = [haus28, schoenblick].map((p) => ({ name: p.name, ...getAggregateReviewStats([p]) }));
const platforms = reviewPlatforms(haus28, schoenblick);

function ReviewCard({ review, index }: { review: (typeof reviews)[number]; index: number }) {
  const locale = useLocale();
  const t = getDict(locale).home.reviews;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-4 p-6 rounded-2xl bg-white border border-cream-200 shadow-card hover:shadow-card-lg transition-shadow duration-300"
    >
      {/* Stars */}
      <div className="flex gap-0.5 text-gold-500">
        {[1, 2, 3, 4, 5].map((i) => (
          <IconStar key={i} size={14} filled={i <= Math.round(review.rating)} />
        ))}
      </div>

      {/* Text */}
      <p className="font-body text-sm text-forest-700 leading-relaxed flex-1">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-cream-200">
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
        <div className="ml-auto shrink-0">
          <span className="font-body text-xs text-gold-600 bg-gold-300/20 px-2 py-0.5 rounded-full">
            {review.propertyId === "haus28" ? t.badgeHaus28 : t.badgeSchoenblick}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReviewsSection() {
  const locale = useLocale();
  const t = getDict(locale).home.reviews;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section-pad bg-cream-50" aria-labelledby="reviews-heading">
      <div className="container-site">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-3">
            {t.eyebrow}
          </p>
          <h2
            id="reviews-heading"
            className="font-display text-display-lg text-forest-900 mb-4 text-balance"
          >
            {t.heading}
          </h2>
          {/* Bewertung je Haus */}
          <div className="flex flex-wrap justify-center gap-2">
            {houseStats.map((h) => (
              <div key={h.name} className="inline-flex items-center gap-2 px-4 py-2 bg-gold-300/20 rounded-full">
                <IconStar size={14} filled className="text-gold-500" />
                <span className="font-body text-sm font-semibold text-forest-800">
                  {h.name} {h.ratingValue.toLocaleString(locale === "de" ? "de-DE" : "en-GB", { minimumFractionDigits: 2 })}
                </span>
                <span className="font-body text-sm text-forest-600">· {h.reviewCount} {t.reviewsSuffix}</span>
              </div>
            ))}
          </div>
          <ReviewSourceNote platforms={platforms} className="mt-4 max-w-2xl mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {featuredReviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
