"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IconStar } from "@/components/ui/Icons";

export interface PlatformRating {
  platform: "airbnb" | "booking" | "fewo" | "google";
  label: string;
  rating: number;
  maxRating: number;
  reviewCount: number;
  displayRating: string;
  url?: string;
}

interface RatingsBarProps {
  platforms: PlatformRating[];
  totalReviews: number;
}

function PlatformBadge({ platform, label, displayRating, reviewCount, url, index }: PlatformRating & { index: number }) {
  const content = (
    <div className="flex flex-col items-center gap-1.5 px-6 py-4 min-w-[130px] group">
      <span className="font-body text-xs text-cream-50/50 uppercase tracking-widest">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl font-medium text-cream-50">{displayRating}</span>
        {platform !== "booking" && (
          <IconStar size={13} filled className="text-gold-300 mb-0.5" />
        )}
        {platform === "booking" && (
          <span className="font-body text-xs text-cream-50/50">/10</span>
        )}
      </div>
      <span className="font-body text-xs text-cream-50/40">
        {reviewCount} {reviewCount === 1 ? "Bewertung" : "Bewertungen"}
      </span>
    </div>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:bg-white/5 rounded-xl transition-colors"
        aria-label={`${label} – ${displayRating}`}
      >
        {content}
      </a>
    );
  }
  return <div>{content}</div>;
}

export default function RatingsBar({ platforms, totalReviews }: RatingsBarProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div
      ref={ref}
      className="bg-forest-900 border-b border-forest-800"
      role="region"
      aria-label="Bewertungen auf allen Plattformen"
    >
      <div className="container-site">
        <div className="flex flex-wrap items-center divide-x divide-forest-700 overflow-x-auto">
          {/* Lead text */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-0.5 px-6 py-4 min-w-[160px] shrink-0"
          >
            <span className="font-body text-xs text-cream-50/40 uppercase tracking-widest">
              Plattform-Bewertungen
            </span>
            <span className="font-display text-lg text-cream-50 leading-tight">
              {totalReviews} Bewertungen
            </span>
            <span className="font-body text-xs text-gold-400">
              Überall 5★ / 10/10
            </span>
          </motion.div>

          {/* Platform badges */}
          {platforms.map((p, i) => (
            <motion.div
              key={p.platform}
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              className="shrink-0"
            >
              <PlatformBadge {...p} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
