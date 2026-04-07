"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IconStar } from "@/components/ui/Icons";

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
  title = "Weitere Unterkünfte",
}: RelatedPropertiesProps) {
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
            {title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {properties.map((property, i) => (
            <motion.article
              key={property.href}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-2xl overflow-hidden bg-white border border-cream-200 shadow-card hover:shadow-card-lg transition-shadow duration-300"
            >
              {/* Image */}
              <Link href={property.href} className="block relative aspect-[3/2] overflow-hidden">
                {/* TODO: Replace with actual property photo */}
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
              </Link>

              {/* Info */}
              <div className="p-4">
                <Link href={property.href} className="group/title">
                  <h3 className="font-display text-xl text-forest-900 group-hover/title:text-gold-600 transition-colors">
                    {property.name}
                  </h3>
                  <p className="font-body text-sm text-forest-500 mb-3">{property.subtitle}</p>
                </Link>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-body text-xs text-forest-400">ab </span>
                    <span className="font-display text-xl text-forest-800">{property.priceFrom}€</span>
                    <span className="font-body text-xs text-forest-400"> / Nacht</span>
                  </div>
                  <Link
                    href={property.bookHref}
                    className="px-4 py-2 bg-gold-500 text-forest-900 text-xs font-medium font-body rounded-full hover:bg-gold-400 transition-colors"
                  >
                    Buchen
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
