"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IconStar, IconUsers, IconArrowRight, IconMapPin } from "@/components/ui/Icons";
import { haus28, schoenblick } from "@/data/properties";

const properties = [
  {
    ...haus28,
    href: "/haus28",
    bookHref: "/haus28/buchen",
    tag: "A-Frame · Natur pur",
    mood: "dark" as const,
    gradient: "from-forest-900/60 via-transparent to-forest-900/80",
  },
  {
    ...schoenblick,
    href: "/schoenblick",
    bookHref: "/schoenblick/buchen",
    tag: "4 Apartments · Panoramablick",
    mood: "light" as const,
    gradient: "from-forest-900/40 via-transparent to-forest-900/70",
    maxGuests: 20, // combined across apartments
  },
];

function PropertyCard({
  name,
  subtitle,
  address,
  priceFrom,
  airbnbRating,
  airbnbReviewCount,
  maxGuests,
  images,
  href,
  bookHref,
  tag,
  gradient,
  index,
}: (typeof properties)[number] & { index: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-3xl bg-forest-900 shadow-card-lg hover:shadow-2xl transition-shadow duration-500"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden">
        <Image
          src={images.hero}
          alt={`${name} – ${subtitle}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${gradient}`} />

        {/* Tag */}
        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1 bg-cream-50/10 backdrop-blur-sm border border-cream-50/20 rounded-full font-body text-xs text-cream-50/90 tracking-wide">
            {tag}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-cream-50/10 backdrop-blur-sm border border-cream-50/20 rounded-full">
          <IconStar size={12} className="text-gold-300 fill-gold-300" filled />
          <span className="font-body text-xs font-semibold text-cream-50">
            {airbnbRating}
          </span>
          <span className="font-body text-xs text-cream-50/60">
            ({airbnbReviewCount})
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-display text-display-md text-cream-50 mb-1">{name}</h3>
          <p className="font-body text-sm text-cream-50/70">{subtitle}</p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 flex items-end justify-between gap-4 bg-forest-900">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-cream-50/50">
            <IconMapPin size={14} />
            <span className="font-body text-xs">{address}</span>
          </div>
          {maxGuests && (
            <div className="flex items-center gap-1.5 text-cream-50/50">
              <IconUsers size={14} />
              <span className="font-body text-xs">Bis zu {maxGuests} Gäste</span>
            </div>
          )}
          <div className="mt-2">
            <span className="font-body text-xs text-cream-50/50">ab </span>
            <span className="font-display text-2xl text-cream-50 font-medium">
              {priceFrom}€
            </span>
            <span className="font-body text-sm text-cream-50/50"> / Nacht</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <Link
            href={bookHref}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-gold-500 text-forest-900 text-sm font-medium font-body rounded-full hover:bg-gold-400 transition-colors shadow-cta whitespace-nowrap"
          >
            Jetzt buchen
          </Link>
          <Link
            href={href}
            className="inline-flex items-center justify-center gap-1 px-5 py-2 text-sm font-body text-cream-50/60 hover:text-cream-50 transition-colors group/link"
          >
            Mehr entdecken
            <IconArrowRight size={14} className="transition-transform group-hover/link:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function PropertyCards() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section-pad bg-cream-100" aria-labelledby="properties-heading">
      <div className="container-site">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-3">
            Unsere Unterkünfte
          </p>
          <h2
            id="properties-heading"
            className="font-display text-display-lg text-forest-900 mb-4 text-balance"
          >
            Zwei besondere Orte im Bayerischen Wald
          </h2>
          <p className="font-body text-lg text-forest-600 max-w-2xl mx-auto leading-relaxed">
            Ob architektonisch einzigartiges A-Frame im Wald oder Panorama-Apartments mit atemberaubendem Ausblick – finde dein perfektes Zuhause auf Zeit.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {properties.map((property, i) => (
            <PropertyCard key={property.id} {...property} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
