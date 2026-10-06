"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IconStar } from "@/components/ui/Icons";
import { getDict } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";

interface RelatedProperty {
  name: string;
  subtitle: string;
  href: string;
  bookHref: string;
  imageSrc: string;
  imageAlt: string;
  priceFrom: number;
  rating: number;
  tag: string;
}

interface RelatedPropertiesProps {
  currentId: string;
  properties: RelatedProperty[];
  title?: string;
}

export default function RelatedProperties({
  properties,
  title,
}: RelatedPropertiesProps) {
  const locale = useLocale();
  const t = getDict(locale).property.related;
  const heading = title ?? t.defaultTitle;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  if (properties.length === 0) return null;

  return (
    <section
      ref={ref}
      className="section-pad bg-cream-100"
      aria-labelledby="related-heading"
    >
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2
            id="related-heading"
            className="font-display text-display-md text-forest-900"
          >
            {heading}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {properties.map((property, i) => (
            <motion.article
              key={property.href}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl overflow-hidden bg-white border border-cream-200 shadow-card hover:shadow-card-lg focus-within:ring-2 focus-within:ring-gold-500 transition-shadow duration-300"
            >
              {/* Image – klickbar über den Titel-Link, der die ganze Karte abdeckt */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={property.imageSrc}
                  alt={property.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-forest-900/70 backdrop-blur-sm text-cream-50 text-xs font-body rounded-full">
                    {property.tag}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-forest-900/70 backdrop-blur-sm rounded-full">
                  <IconStar size={11} className="text-gold-300 fill-gold-300" filled />
                  <span className="font-body text-xs font-semibold text-cream-50">
                    {property.rating}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-display text-xl text-forest-900 group-hover:text-gold-600 transition-colors">
                  <Link href={property.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                    {property.name}
                  </Link>
                </h3>
                <p className="font-body text-sm text-forest-500 mb-3">{property.subtitle}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-body text-xs text-forest-400">{t.fromPre}</span>
                    <span className="font-display text-xl text-forest-800">{property.priceFrom}€</span>
                    <span className="font-body text-xs text-forest-400">{t.perNight}</span>
                  </div>
                  <Link
                    href={property.bookHref}
                    className="relative z-10 px-4 py-2 bg-gold-500 text-forest-900 text-xs font-medium font-body rounded-full hover:bg-gold-400 transition-colors"
                  >
                    {t.book}
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
