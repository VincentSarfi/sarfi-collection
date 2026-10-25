"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getDict } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import Zeichen from "@/components/ui/Zeichen";

// Zeichen pro Regions-Highlight; Label & Text kommen aus dem Dictionary.
const regionIcons = {
  hiking: "wegweiser",
  winter: "schneeflocke",
  wildlife: "hirsch",
  culture: "kirche",
  lakes: "see",
  wellness: "hottub",
} as const;

export default function RegionSection() {
  const locale = useLocale();
  const t = getDict(locale).home.region;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [imgRef, imgInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const highlights = (
    ["hiking", "winter", "wildlife", "culture", "lakes", "wellness"] as const
  ).map((key) => ({ icon: regionIcons[key], ...t.items[key] }));

  return (
    <section className="section-pad bg-cream-100 overflow-hidden" aria-labelledby="region-heading">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div ref={ref}>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-3"
            >
              {t.eyebrow}
            </motion.p>
            <motion.h2
              id="region-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-display-md text-forest-900 mb-5 text-balance"
            >
              {t.heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-base text-forest-600 leading-relaxed mb-8"
            >
              {t.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-white border border-cream-200 shadow-card"
                >
                  <Zeichen name={item.icon} size={32} className="text-forest-700" />
                  <p className="font-body text-sm font-medium text-forest-800">{item.label}</p>
                  <p className="font-body text-xs text-forest-500 leading-snug">{item.text}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            ref={imgRef}
            initial={{ opacity: 0, x: 40 }}
            animate={imgInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card-lg">
              <Image
                src="/images/shared/region-bayerischer-wald.jpg"
                alt={t.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Decorative card */}
            <div className="absolute -bottom-5 -left-5 md:-left-8 bg-forest-900 rounded-2xl p-4 shadow-card-lg">
              <p className="font-body text-xs text-cream-50/50 mb-0.5">{t.parkSince}</p>
              <p className="font-display text-2xl text-gold-300 font-medium">1970</p>
              <p className="font-body text-xs text-cream-50/70">{t.parkName}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
