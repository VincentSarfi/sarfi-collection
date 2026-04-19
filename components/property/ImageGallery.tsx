"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IconExpand } from "@/components/ui/Icons";
import type { GalleryImage } from "@/data/properties";

interface ImageGalleryProps {
  images: GalleryImage[];
  propertyName?: string;
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const slides = images.map((img) => ({ src: img.src, alt: img.alt }));

  // Grid layout: 1 large left + up to 4 right
  const main = images[0];
  const secondary = images.slice(1, 5);
  const remaining = images.length - 5;

  return (
    <section
      ref={ref}
      className="section-pad-sm bg-cream-50"
      aria-labelledby="gallery-heading"
    >
      <div className="container-site">
        <motion.h2
          id="gallery-heading"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-display text-display-md text-forest-900 mb-6"
        >
          Fotos
        </motion.h2>

        {/* Airbnb-style grid */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden"
        >
          {/* Main large image */}
          {main && (
            <button
              onClick={() => setLightboxIndex(0)}
              className="col-span-2 row-span-2 relative aspect-[4/3] md:aspect-auto group cursor-zoom-in"
              aria-label={`${main.alt} – Vergrößern`}
            >
              {/* TODO: Replace with actual photo */}
              <Image
                src={main.src}
                alt={main.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/10 transition-colors" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-forest-900/80 text-cream-50 text-xs font-body px-2 py-1 rounded-full flex items-center gap-1">
                  <IconExpand size={12} /> Vergrößern
                </span>
              </div>
            </button>
          )}

          {/* Secondary images */}
          {secondary.map((img, i) => (
            <button
              key={i}
              onClick={() => setLightboxIndex(i + 1)}
              className="relative aspect-square group cursor-zoom-in overflow-hidden"
              aria-label={`${img.alt} – Vergrößern`}
            >
              {/* TODO: Replace with actual photo */}
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/10 transition-colors" />

              {/* Show "X more" on last tile */}
              {i === secondary.length - 1 && remaining > 0 && (
                <div className="absolute inset-0 bg-forest-900/60 flex flex-col items-center justify-center gap-1">
                  <span className="font-display text-2xl text-cream-50">+{remaining}</span>
                  <span className="font-body text-xs text-cream-50/70">weitere Fotos</span>
                </div>
              )}
            </button>
          ))}
        </motion.div>

        {/* "All photos" button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setLightboxIndex(0)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-forest-200 font-body text-sm text-forest-600 hover:text-forest-900 hover:border-forest-400 transition-colors"
            aria-label="Alle Fotos anzeigen"
          >
            <IconExpand size={15} />
            Alle {images.length} Fotos anzeigen
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[Zoom]}
        controller={{ closeOnBackdropClick: true }}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.96)" } }}
        carousel={{ finite: false }}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      />
    </section>
  );
}
