"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const highlights = [
  { emoji: "🥾", label: "Wandern", text: "Hunderte km markierter Wege direkt ab Haustür" },
  { emoji: "⛷️", label: "Winter", text: "Skifahren, Langlauf & Winterwandern" },
  { emoji: "🦌", label: "Wildtiere", text: "Hirsche, Rehe & einzigartige Natur" },
  { emoji: "🏘️", label: "Kultur", text: "Klöster, Museen & bayerische Lebensart" },
  { emoji: "🌊", label: "Seen", text: "Kristallklare Badeseen in der Umgebung" },
  { emoji: "🧖", label: "Wellness", text: "Thermalbäder & Saunen in der Region" },
];

export default function RegionSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [imgRef, imgInView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
              Die Region
            </motion.p>
            <motion.h2
              id="region-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-display-md text-forest-900 mb-5 text-balance"
            >
              Bayerischer Wald – Deutschlands ältester Nationalpark
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-body text-base text-forest-600 leading-relaxed mb-8"
            >
              Der Bayerische Wald ist eine der ursprünglichsten Landschaften Deutschlands. Dichte Wälder, klare Bäche, sanfte Hügel und eine entspannte, herzliche Atmosphäre machen die Region zum perfekten Urlaubsziel – zu jeder Jahreszeit.
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
                  <span className="text-xl" aria-hidden="true">{item.emoji}</span>
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
                alt="Bayerischer Wald – Sonnenaufgang über dem Nebelmeer"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Decorative card */}
            <div className="absolute -bottom-5 -left-5 md:-left-8 bg-forest-900 rounded-2xl p-4 shadow-card-lg">
              <p className="font-body text-xs text-cream-50/50 mb-0.5">Nationalpark seit</p>
              <p className="font-display text-2xl text-gold-300 font-medium">1970</p>
              <p className="font-body text-xs text-cream-50/70">Bayerischer Wald</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
