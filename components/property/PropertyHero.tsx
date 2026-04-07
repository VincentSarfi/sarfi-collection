"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { IconStar, IconMapPin, IconArrowRight } from "@/components/ui/Icons";
import Button from "@/components/ui/Button";

interface PropertyHeroProps {
  name: string;
  subtitle: string;
  address: string;
  priceFrom: number;
  airbnbRating: number;
  airbnbReviewCount: number;
  heroImage: string;
  bookHref: string;
  galleryCount?: number;
  onGalleryOpen?: () => void;
  breadcrumb?: { label: string; href: string }[];
}

export default function PropertyHero({
  name,
  subtitle,
  address,
  priceFrom,
  airbnbRating,
  airbnbReviewCount,
  heroImage,
  bookHref,
  galleryCount,
  onGalleryOpen,
  breadcrumb,
}: PropertyHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section
      ref={ref}
      className="relative h-[75vh] md:h-[85vh] flex items-end overflow-hidden bg-forest-900"
      aria-label={`${name} Hero`}
    >
      {/* Parallax image */}
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        {/* TODO: Replace with actual property photo */}
        <Image
          src={heroImage}
          alt={`${name} – ${subtitle}`}
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/10 via-transparent to-forest-900/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/40 to-transparent" />
      </motion.div>

      {/* Breadcrumb */}
      {breadcrumb && (
        <nav
          className="absolute top-24 left-0 right-0 z-10 container-site"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center gap-2 font-body text-xs text-cream-50/50">
            <li>
              <Link href="/" className="hover:text-cream-50/80 transition-colors">
                Startseite
              </Link>
            </li>
            {breadcrumb.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-2">
                <IconArrowRight size={10} />
                <Link href={crumb.href} className="hover:text-cream-50/80 transition-colors">
                  {crumb.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <IconArrowRight size={10} />
              <span className="text-cream-50/70">{name}</span>
            </li>
          </ol>
        </nav>
      )}

      {/* Content */}
      <div className="relative z-10 container-site pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5 text-gold-300">
              {[1,2,3,4,5].map(i => <IconStar key={i} size={14} filled />)}
            </div>
            <span className="font-body text-sm text-cream-50/80">
              {airbnbRating} · {airbnbReviewCount} Bewertungen auf Airbnb
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-display-xl text-cream-50 mb-2 text-balance">
            {name}
          </h1>
          <p className="font-body text-xl text-cream-50/70 mb-4">{subtitle}</p>

          {/* Address */}
          <div className="flex items-center gap-1.5 text-cream-50/60 mb-6">
            <IconMapPin size={15} />
            <span className="font-body text-sm">{address}</span>
          </div>

          {/* Price + CTA row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-baseline gap-1">
              <span className="font-body text-sm text-cream-50/50">ab</span>
              <span className="font-display text-3xl text-cream-50 font-medium">{priceFrom}€</span>
              <span className="font-body text-sm text-cream-50/50">/ Nacht</span>
            </div>

            <div className="flex gap-3">
              <Button href={bookHref} variant="gold" size="lg">
                Jetzt buchen
              </Button>
              {galleryCount && onGalleryOpen && (
                <button
                  onClick={onGalleryOpen}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-cream-50/30 text-cream-50/80 hover:text-cream-50 hover:border-cream-50/50 transition-colors font-body text-sm"
                  aria-label="Alle Fotos anzeigen"
                >
                  Alle {galleryCount} Fotos
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
