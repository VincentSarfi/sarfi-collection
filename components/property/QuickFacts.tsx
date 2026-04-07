"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IconUsers, IconBed, IconBath, IconHome, IconStar, IconMapPin } from "@/components/ui/Icons";

interface QuickFactsProps {
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  sqm?: number;
  airbnbRating?: number;
  airbnbReviewCount?: number;
  address?: string;
}

export default function QuickFacts({
  maxGuests,
  bedrooms,
  bathrooms,
  sqm,
  airbnbRating,
  airbnbReviewCount,
  address,
}: QuickFactsProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const facts = [
    maxGuests   && { icon: <IconUsers size={20} />,   label: "Gäste",       value: `bis zu ${maxGuests}` },
    bedrooms    && { icon: <IconBed size={20} />,     label: "Schlafzimmer", value: bedrooms.toString() },
    bathrooms   && { icon: <IconBath size={20} />,    label: "Badezimmer",  value: bathrooms.toString() },
    sqm         && { icon: <IconHome size={20} />,    label: "Fläche",      value: `${sqm} m²` },
    (airbnbRating && airbnbReviewCount) && {
      icon: <IconStar size={20} />,
      label: "Bewertung",
      value: `${airbnbRating} (${airbnbReviewCount})`,
    },
    address && { icon: <IconMapPin size={20} />, label: "Adresse", value: address },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[];

  return (
    <div
      ref={ref}
      className="bg-cream-50 border-b border-cream-200"
      role="region"
      aria-label="Eckdaten"
    >
      <div className="container-site">
        <div className="flex flex-wrap divide-x divide-cream-200 overflow-x-auto">
          {facts.map((fact, i) => (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex items-center gap-3 px-6 py-4 min-w-[140px] shrink-0"
            >
              <span className="text-forest-500 shrink-0">{fact.icon}</span>
              <div>
                <p className="font-body text-xs text-forest-400 leading-none mb-0.5">
                  {fact.label}
                </p>
                <p className="font-body text-sm font-medium text-forest-800 leading-none">
                  {fact.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
