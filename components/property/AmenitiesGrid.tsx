"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AmenityIcon } from "@/components/ui/Icons";
import type { Amenity } from "@/data/properties";

interface AmenitiesGridProps {
  amenities: Amenity[];
}

export default function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section
      ref={ref}
      className="section-pad-sm bg-cream-50"
      aria-labelledby="amenities-heading"
    >
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2
            id="amenities-heading"
            className="font-display text-display-md text-forest-900"
          >
            Ausstattung
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
        >
          {amenities.map((amenity, i) => (
            <motion.div
              key={amenity.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-cream-200 shadow-card hover:border-forest-200 hover:shadow-card-lg transition-all duration-200"
            >
              <span className="text-forest-600 shrink-0">
                <AmenityIcon name={amenity.icon} size={18} />
              </span>
              <span className="font-body text-sm text-forest-700">{amenity.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
