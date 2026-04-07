"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const highlights = [
  {
    icon: "🌲",
    title: "Natur pur",
    description:
      "Mitten im Bayerischen Wald – Wanderwege, frische Luft und absolute Ruhe direkt vor der Haustür.",
  },
  {
    icon: "✦",
    title: "Außergewöhnliches Design",
    description:
      "Von der Architektur bis zum letzten Detail – unsere Unterkünfte sind sorgfältig gestaltet und hochwertig ausgestattet.",
  },
  {
    icon: "🌄",
    title: "Atemberaubende Aussicht",
    description:
      "Panoramablick über die sanften Hügel des Bayerischen Waldes – morgens beim Kaffee, abends beim Sonnenuntergang.",
  },
  {
    icon: "💫",
    title: "Direkt buchen & sparen",
    description:
      "Buche direkt bei uns und spare die Plattformgebühren. Einfacher Buchungsvorgang, persönliche Betreuung.",
  },
];

export default function Highlights() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section-pad bg-forest-900 overflow-hidden" aria-labelledby="highlights-heading">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-500 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-forest-400 blur-3xl" />
      </div>

      <div className="relative container-site">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-400 mb-3">
            Warum SARFI Collection
          </p>
          <h2
            id="highlights-heading"
            className="font-display text-display-lg text-cream-50 text-balance"
          >
            Was uns besonders macht
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-cream-50/10 bg-cream-50/5 hover:bg-cream-50/10 hover:border-gold-500/30 transition-all duration-300"
            >
              <span className="text-3xl" aria-hidden="true">{item.icon}</span>
              <h3 className="font-display text-xl font-semibold text-cream-50 group-hover:text-gold-300 transition-colors">
                {item.title}
              </h3>
              <p className="font-body text-sm text-cream-50/60 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
