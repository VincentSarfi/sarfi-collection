"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IconChevronDown } from "@/components/ui/Icons";
import { getDict } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/LocaleProvider";

interface FaqAccordionProps {
  faqs: { question: string; answer: string }[];
}

// Native <details>/<summary>: Die Antworten stehen immer im ausgelieferten HTML
// (Suchmaschinen, KI-Crawler, Strg+F), nur das Auf-/Zuklappen ist Darstellung.
function FaqItem({
  faq,
  defaultOpen,
}: {
  faq: { question: string; answer: string };
  defaultOpen: boolean;
}) {
  return (
    <details className="group border-b border-cream-200 last:border-0" open={defaultOpen}>
      <summary className="flex items-center justify-between w-full py-5 text-left gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <h3 className="font-body text-base font-medium text-forest-800">
          {faq.question}
        </h3>
        <span className="text-forest-500 shrink-0 transition-transform duration-200 group-open:rotate-180">
          <IconChevronDown size={20} />
        </span>
      </summary>
      <p className="font-body text-sm text-forest-600 leading-relaxed pb-5">
        {faq.answer}
      </p>
    </details>
  );
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const locale = useLocale();
  const t = getDict(locale).property.faq;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="section-pad-sm bg-cream-50"
      aria-labelledby="faq-heading"
    >
      <div className="container-site max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2
            id="faq-heading"
            className="font-display text-display-md text-forest-900"
          >
            {t.heading}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl border border-cream-200 shadow-card px-6"
        >
          {faqs.map((faq, i) => (
            <FaqItem key={faq.question} faq={faq} defaultOpen={i === 0} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
