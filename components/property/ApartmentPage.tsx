"use client"

/**
 * Airbnb-style apartment page template.
 * Used by /schoenblick/b5, /b6, /b7, /b8, /a2
 */

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import LocationMap from "@/components/property/LocationMap"
import PropertyReviews from "@/components/property/PropertyReviews"
import BookingWidget from "@/components/booking/BookingWidget"
import FaqAccordion from "@/components/property/FaqAccordion"
import RelatedProperties from "@/components/property/RelatedProperties"
import { schoenblick } from "@/data/properties"
import { schoenblickReviews } from "@/data/reviews"
import type { ApartmentData } from "@/data/properties"
import { type PropertyBookingConfig, resolveSmoobuId } from "@/config/properties.config"
import { IconStar, IconUsers, IconBed, IconBath, IconHome, IconMapPin, IconArrowRight, IconExpand, AmenityIcon } from "@/components/ui/Icons"

interface ApartmentPageProps {
  apartment: ApartmentData
  config: PropertyBookingConfig
}

export default function ApartmentPage({ apartment, config }: ApartmentPageProps) {
  const smoobuId = resolveSmoobuId(config)
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [descExpanded, setDescExpanded] = useState(false)
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false)
  const [showMobileBooking, setShowMobileBooking] = useState(false)

  const slides = apartment.images.gallery.map((img) => ({ src: img.src, alt: img.alt }))
  const mainImg = apartment.images.gallery[0]
  const secondaryImgs = apartment.images.gallery.slice(1, 5)
  const remaining = apartment.images.gallery.length - 5

  const isLongDesc = apartment.description.length > 350
  const displayDesc = !isLongDesc || descExpanded
    ? apartment.description
    : apartment.description.slice(0, 350) + "…"

  const allAmenities = apartment.amenities
  const visibleAmenities = amenitiesExpanded ? allAmenities : allAmenities.slice(0, 10)

  const related = Object.values(schoenblick.apartments ?? {})
    .filter((apt) => apt.id !== apartment.id)
    .slice(0, 3)
    .map((apt) => ({
      name: apt.name,
      subtitle: apt.subtitle,
      href: `/schoenblick/${apt.id}`,
      bookHref: `/schoenblick/${apt.id}/buchen`,
      imageSrc: apt.images.hero,
      imageAlt: apt.name,
      priceFrom: apt.priceFrom,
      rating: apt.airbnbRating,
      tag: "Haus Schönblick",
    }))

  const aptReviews = schoenblickReviews.filter(
    (r) => !r.apartmentId || r.apartmentId === apartment.id,
  )

  return (
    <>
      <article className="pt-20 bg-cream-50">

        {/* ── 1. COMPACT HEADER ─────────────────────────────────────── */}
        <div className="container-site pt-6 pb-4">
          {/* Title row */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {apartment.isNew && (
                  <span className="px-2 py-0.5 bg-gold-500 rounded-full font-body text-xs font-bold text-forest-900 uppercase tracking-widest">
                    Neu
                  </span>
                )}
              </div>
              <h1 className="font-display text-display-md text-forest-900 leading-tight">
                {apartment.name}
              </h1>
              <p className="font-body text-base text-forest-500 mt-1">{apartment.subtitle}</p>
            </div>

            {/* Share / Save – decorative */}
            <div className="flex items-center gap-2 mt-1 shrink-0">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-sm text-forest-600 hover:bg-cream-200 transition-colors underline">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185z" />
                </svg>
                Teilen
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-sm text-forest-600 hover:bg-cream-200 transition-colors underline">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Merken
              </button>
            </div>
          </div>

          {/* Rating + Address row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 font-body text-sm text-forest-600">
            {apartment.airbnbRating > 0 && (
              <>
                <span className="flex items-center gap-1 font-semibold text-forest-900">
                  <IconStar size={14} filled className="text-forest-900 fill-forest-900" />
                  {apartment.airbnbRating}
                </span>
                <span className="text-forest-300">·</span>
                <a href="#bewertungen" className="underline underline-offset-2 hover:text-forest-900 transition-colors">
                  {apartment.airbnbReviewCount} Bewertungen
                </a>
                <span className="text-forest-300">·</span>
              </>
            )}
            <span className="flex items-center gap-1">
              <IconMapPin size={13} />
              {schoenblick.address}
            </span>
          </div>
        </div>

        {/* ── 2. IMAGE GRID ─────────────────────────────────────────── */}
        <div className="container-site mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden relative">
            {/* Main large image */}
            {mainImg && (
              <button
                onClick={() => setLightboxIndex(0)}
                className="col-span-2 row-span-2 relative aspect-[4/3] md:aspect-auto group cursor-zoom-in"
                aria-label="Foto vergrößern"
              >
                <Image
                  src={mainImg.src}
                  alt={mainImg.alt}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/10 transition-colors" />
              </button>
            )}

            {/* Secondary images */}
            {secondaryImgs.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i + 1)}
                className="relative aspect-square group cursor-zoom-in overflow-hidden"
                aria-label="Foto vergrößern"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/10 transition-colors" />
                {i === secondaryImgs.length - 1 && remaining > 0 && (
                  <div className="absolute inset-0 bg-forest-900/50 flex flex-col items-center justify-center gap-1">
                    <span className="font-display text-2xl text-cream-50">+{remaining}</span>
                    <span className="font-body text-xs text-cream-50/70">weitere Fotos</span>
                  </div>
                )}
              </button>
            ))}

            {/* All photos button */}
            <button
              onClick={() => setLightboxIndex(0)}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 bg-white border border-forest-200 rounded-lg font-body text-xs font-medium text-forest-800 hover:bg-cream-100 transition-colors shadow-sm"
            >
              <IconExpand size={13} />
              Alle {apartment.images.gallery.length} Fotos
            </button>
          </div>
        </div>

        {/* ── 3. TWO-COLUMN CONTENT ─────────────────────────────────── */}
        <div className="container-site pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-12 items-start">

            {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
            <div>

              {/* Key Facts */}
              <div className="pb-7 border-b border-cream-200">
                <h2 className="font-display text-xl text-forest-900 mb-4">
                  Apartment · {apartment.sqm} m² · bis {apartment.maxGuests} Gäste
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: <IconUsers size={22} />, value: `${apartment.maxGuests}`, label: "Gäste" },
                    { icon: <IconBed size={22} />, value: `${apartment.bedrooms}`, label: "Schlafzimmer" },
                    { icon: <IconBath size={22} />, value: `${apartment.bathrooms}`, label: "Badezimmer" },
                    { icon: <IconHome size={22} />, value: `${apartment.sqm} m²`, label: "Wohnfläche" },
                  ].map((fact) => (
                    <div key={fact.label} className="flex items-center gap-3">
                      <span className="text-forest-400 shrink-0">{fact.icon}</span>
                      <div>
                        <p className="font-body text-sm font-semibold text-forest-900">{fact.value}</p>
                        <p className="font-body text-xs text-forest-400">{fact.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Host Info */}
              <div className="py-7 border-b border-cream-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-forest-900 flex items-center justify-center shrink-0">
                  <span className="font-display text-sm text-gold-300 leading-none">V&E</span>
                </div>
                <div>
                  <p className="font-body text-base font-semibold text-forest-900">
                    Gastgeber: Vincent &amp; Elena
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 font-body text-sm text-forest-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-gold-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />
                      </svg>
                      Superhost
                    </span>
                    <span>·</span>
                    <span>Check-in: ab 16:00 Uhr</span>
                    <span>·</span>
                    <span>Check-out: bis 10:00 Uhr</span>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="py-7 border-b border-cream-200 space-y-4">
                {[
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    ),
                    title: "Ganzes Apartment für dich",
                    text: "Du hast das gesamte Apartment für dich allein.",
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
                      </svg>
                    ),
                    title: "Traumhafte Lage im Bayerischen Wald",
                    text: "Wanderwege beginnen direkt vor der Haustür. Mitten in der Natur, nah an Grafenau.",
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12z" />
                      </svg>
                    ),
                    title: "Direktbuchung – günstiger als Airbnb",
                    text: "Keine Plattformgebühren. Buche direkt und spare bis zu 20% gegenüber Buchungsportalen.",
                  },
                ].map((h) => (
                  <div key={h.title} className="flex items-start gap-4">
                    <span className="text-forest-700 shrink-0 mt-0.5">{h.icon}</span>
                    <div>
                      <p className="font-body text-sm font-semibold text-forest-900">{h.title}</p>
                      <p className="font-body text-sm text-forest-500 mt-0.5">{h.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="py-7 border-b border-cream-200">
                <h2 className="font-display text-xl text-forest-900 mb-4">Über diese Unterkunft</h2>
                <p className="font-body text-base text-forest-700 leading-relaxed whitespace-pre-line">
                  {displayDesc}
                </p>
                {isLongDesc && (
                  <button
                    onClick={() => setDescExpanded(!descExpanded)}
                    className="mt-4 flex items-center gap-1.5 font-body text-sm font-semibold text-forest-900 underline underline-offset-2 hover:text-gold-700 transition-colors"
                  >
                    {descExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
                    <IconArrowRight size={13} className={descExpanded ? "rotate-90" : ""} />
                  </button>
                )}
              </div>

              {/* Amenities */}
              <div className="py-7 border-b border-cream-200">
                <h2 className="font-display text-xl text-forest-900 mb-5">Was diese Unterkunft bietet</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {visibleAmenities.map((amenity) => (
                    <div key={amenity.label} className="flex items-center gap-3 py-1.5">
                      <span className="text-forest-600 shrink-0">
                        <AmenityIcon name={amenity.icon} size={20} />
                      </span>
                      <span className="font-body text-sm text-forest-700">{amenity.label}</span>
                    </div>
                  ))}
                </div>
                {allAmenities.length > 10 && (
                  <button
                    onClick={() => setAmenitiesExpanded(!amenitiesExpanded)}
                    className="mt-5 px-5 py-2.5 rounded-xl border-2 border-forest-200 font-body text-sm font-semibold text-forest-800 hover:border-forest-400 hover:bg-cream-100 transition-colors"
                  >
                    {amenitiesExpanded
                      ? "Weniger anzeigen"
                      : `Alle ${allAmenities.length} Ausstattungsmerkmale anzeigen`}
                  </button>
                )}
              </div>

              {/* Location */}
              <div className="py-7">
                <LocationMap
                  address={schoenblick.address}
                  coordinates={schoenblick.coordinates}
                  description="Schöfweg liegt im Herzen des Bayerischen Waldes. Wanderwege starten direkt vor dem Haus. Einkaufsmöglichkeiten und Sehenswürdigkeiten sind in wenigen Minuten erreichbar."
                  nearbyAttractions={[
                    { name: "Wanderweg ab Haustür", distance: "0 m" },
                    { name: "Grafenau Zentrum", distance: "~15 min" },
                    { name: "Pullman City", distance: "~15 min" },
                    { name: "Nationalpark Bayerischer Wald", distance: "~20 km" },
                    { name: "Baumwipfelpfad Neuschönau", distance: "~25 min" },
                    { name: "Thermalbad Regen", distance: "~30 min" },
                    { name: "Skigebiet Arber", distance: "~45 min" },
                  ]}
                />
              </div>
            </div>

            {/* ── RIGHT SIDEBAR ─────────────────────────────────────────── */}
            <div className="hidden lg:block lg:sticky lg:top-28">
              <BookingWidget
                smoobuId={smoobuId}
                propertyName={config.name}
                propertySlug={config.id}
                maxGuests={config.maxGuests}
                minStay={config.minStay}
                cleaningFee={config.cleaningFee}
                priceFrom={config.priceFrom}
                baseOccupancy={config.baseOccupancy}
                extraPersonFee={config.extraPersonFee}
                breadcrumb={config.breadcrumb}
                propertyHref={config.propertyHref}
                sidebarMode={true}
                hideMobileBar={true}
              />
            </div>
          </div>
        </div>

        {/* ── 4. REVIEWS ────────────────────────────────────────────── */}
        <div id="bewertungen">
          <PropertyReviews
            reviews={aptReviews.length > 0 ? aptReviews : schoenblickReviews}
            averageRating={apartment.airbnbRating}
            totalCount={apartment.airbnbReviewCount}
            airbnbUrl={apartment.airbnbUrl}
          />
        </div>

        {/* ── 5. FAQ ────────────────────────────────────────────────── */}
        <FaqAccordion faqs={apartment.faqs} />

        {/* ── 6. RELATED ────────────────────────────────────────────── */}
        <RelatedProperties
          currentId={apartment.id}
          title="Weitere Apartments im Haus Schönblick"
          properties={related}
        />

        {/* Mobile sticky bottom bar – Airbnb style */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-cream-200 px-4 py-3 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div>
            <p className="font-body text-sm font-medium text-forest-900 leading-tight">
              Zeitraum wählen, um Preise anzuzeigen
            </p>
            {apartment.airbnbRating > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <IconStar size={11} filled className="text-forest-700 fill-forest-700" />
                <span className="font-body text-xs font-semibold text-forest-700">{apartment.airbnbRating}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowMobileBooking(true)}
            className="px-5 py-3 bg-gold-500 text-forest-900 font-body font-semibold text-sm rounded-full hover:bg-gold-400 transition-colors active:scale-95 shrink-0 ml-4"
          >
            Verfügbarkeit prüfen
          </button>
        </div>

        {/* Mobile full-screen booking sheet */}
        <AnimatePresence>
          {showMobileBooking && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="lg:hidden fixed inset-0 z-50 bg-cream-50 overflow-y-auto"
            >
              {/* Sheet header */}
              <div className="sticky top-0 z-10 bg-white border-b border-cream-200 px-4 py-3 flex items-center justify-between">
                <button
                  onClick={() => setShowMobileBooking(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-100 transition-colors"
                  aria-label="Schließen"
                >
                  <svg className="w-5 h-5 text-forest-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <p className="font-body text-sm font-semibold text-forest-900">{apartment.name}</p>
                <div className="w-9" />
              </div>
              <BookingWidget
                smoobuId={smoobuId}
                propertyName={config.name}
                propertySlug={config.id}
                maxGuests={config.maxGuests}
                minStay={config.minStay}
                cleaningFee={config.cleaningFee}
                priceFrom={config.priceFrom}
                baseOccupancy={config.baseOccupancy}
                extraPersonFee={config.extraPersonFee}
                breadcrumb={config.breadcrumb}
                propertyHref={config.propertyHref}
                hideMobileBar={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </article>

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
    </>
  )
}
