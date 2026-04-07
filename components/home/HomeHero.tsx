"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Button from "@/components/ui/Button";
import { IconArrowRight, IconStar } from "@/components/ui/Icons";

export default function HomeHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      ref={ref}
      className="relative hero-full flex items-end overflow-hidden bg-forest-900"
      aria-label="Willkommen bei SARFI Collection"
    >
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/haus28/hero.webp"
          alt="SARFI Collection – Ferienunterkünfte im Bayerischen Wald"
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/20 via-transparent to-forest-900/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/40 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container-site pb-20 md:pb-28 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="flex items-center gap-0.5 text-gold-300">
              {[1,2,3,4,5].map(i => <IconStar key={i} size={14} filled />)}
            </div>
            <span className="font-body text-sm text-cream-50/70 tracking-wide">
              Superhost · Bayerischer Wald
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-display-xl text-cream-50 mb-6 text-balance"
          >
            Dein Rückzugsort im{" "}
            <em className="not-italic text-gold-300">Bayerischen Wald</em>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="font-body text-lg md:text-xl text-cream-50/75 mb-8 max-w-xl leading-relaxed"
          >
            Zwei einzigartige Ferienunterkünfte – das moderne A-Frame HAUS28 und die Panorama-Apartments Haus Schönblick. Mitten in der Natur. Direkt buchbar.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap gap-3"
          >
            <Button href="/haus28" variant="gold" size="lg" icon={<IconArrowRight size={18} />} iconPosition="right">
              HAUS28 entdecken
            </Button>
            <Button href="/schoenblick" variant="ghost" size="lg">
              Haus Schönblick
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-body text-xs tracking-[0.15em] uppercase text-cream-50/40">
          Entdecken
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-cream-50/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
