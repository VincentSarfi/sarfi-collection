"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IconArrowRight } from "@/components/ui/Icons";
import { haus28, schoenblick } from "@/data/properties";

export default function CtaSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section className="section-pad bg-forest-900 overflow-hidden" ref={ref} aria-labelledby="cta-heading">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-400 mb-3">
            Jetzt buchen
          </p>
          <h2
            id="cta-heading"
            className="font-display text-display-lg text-cream-50 mb-4 text-balance"
          >
            Finde deine perfekte Unterkunft
          </h2>
          <p className="font-body text-lg text-cream-50/60 max-w-xl mx-auto">
            Direkt buchen und bis zu 15% gegenüber Buchungsplattformen sparen.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 max-w-4xl mx-auto">
          {/* HAUS28 CTA */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/haus28"
              className="group relative flex flex-col overflow-hidden rounded-2xl h-64 md:h-72 bg-forest-800"
            >
              {/* TODO: Replace with actual HAUS28 photo */}
              <Image
                src={haus28.images.hero}
                alt={haus28.name}
                fill
                className="object-cover opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/30 to-transparent" />
              <div className="relative z-10 mt-auto p-6">
                <p className="font-body text-xs tracking-[0.12em] uppercase text-gold-300/80 mb-1">
                  A-Frame · Grattersdorf
                </p>
                <h3 className="font-display text-2xl text-cream-50 mb-3">{haus28.name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-body text-sm text-cream-50/50">ab </span>
                    <span className="font-display text-xl text-cream-50">{haus28.priceFrom}€</span>
                    <span className="font-body text-sm text-cream-50/50"> / Nacht</span>
                  </div>
                  <div className="flex items-center gap-1 text-cream-50/60 group-hover:text-gold-300 group-hover:gap-2 transition-all">
                    <span className="font-body text-sm">Entdecken</span>
                    <IconArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
            <Link
              href="/haus28/buchen"
              className="mt-3 flex items-center justify-center w-full py-3.5 bg-gold-500 text-forest-900 text-sm font-medium font-body rounded-xl hover:bg-gold-400 transition-colors shadow-cta"
            >
              HAUS28 jetzt buchen
            </Link>
          </motion.div>

          {/* Schönblick CTA */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/schoenblick"
              className="group relative flex flex-col overflow-hidden rounded-2xl h-64 md:h-72 bg-forest-800"
            >
              {/* TODO: Replace with actual Schönblick photo */}
              <Image
                src={schoenblick.images.hero}
                alt={schoenblick.name}
                fill
                className="object-cover opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/30 to-transparent" />
              <div className="relative z-10 mt-auto p-6">
                <p className="font-body text-xs tracking-[0.12em] uppercase text-gold-300/80 mb-1">
                  4 Apartments · Schöfweg
                </p>
                <h3 className="font-display text-2xl text-cream-50 mb-3">{schoenblick.name}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-body text-sm text-cream-50/50">ab </span>
                    <span className="font-display text-xl text-cream-50">{schoenblick.priceFrom}€</span>
                    <span className="font-body text-sm text-cream-50/50"> / Nacht</span>
                  </div>
                  <div className="flex items-center gap-1 text-cream-50/60 group-hover:text-gold-300 group-hover:gap-2 transition-all">
                    <span className="font-body text-sm">Entdecken</span>
                    <IconArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
            <Link
              href="/schoenblick/buchen"
              className="mt-3 flex items-center justify-center w-full py-3.5 border border-cream-50/20 text-cream-50/80 text-sm font-body rounded-xl hover:text-cream-50 hover:border-cream-50/40 hover:bg-cream-50/5 transition-all"
            >
              Schönblick buchen
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
