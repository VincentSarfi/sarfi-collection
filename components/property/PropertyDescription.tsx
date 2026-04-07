"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface PropertyDescriptionProps {
  description: string;
  propertyName?: string;
}

export default function PropertyDescription({
  description,
  propertyName,
}: PropertyDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const isLong = description.length > 300;
  const displayText = !isLong || expanded ? description : description.slice(0, 300) + "…";

  return (
    <section
      ref={ref}
      className="section-pad-sm bg-cream-50"
      aria-labelledby="description-heading"
    >
      <div className="container-site max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="description-heading"
            className="font-display text-display-md text-forest-900 mb-5"
          >
            {propertyName ? `Über ${propertyName}` : "Über diese Unterkunft"}
          </h2>

          <p className="prose-property">{displayText}</p>

          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-4 inline-flex items-center font-body text-sm font-medium text-forest-700 hover:text-gold-600 transition-colors underline underline-offset-4 decoration-forest-300"
            >
              {expanded ? "Weniger anzeigen" : "Weiterlesen"}
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
}
