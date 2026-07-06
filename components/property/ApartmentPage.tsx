"use client"

/**
 * Airbnb-style apartment page template.
 * Used by /schoenblick/b5, /b6, /b7, /b8, /a2
 */

import { useState, useRef } from "react"
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
import { IconStar, IconMapPin, IconArrowRight, IconExpand, IconX, AmenityIcon } from "@/components/ui/Icons"

interface ApartmentPageProps {
  apartment: ApartmentData
  config: PropertyBookingConfig
}

export default function ApartmentPage({ apartment, config }: ApartmentPageProps) {
  const smoobuId = resolveSmoobuId(config)
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false)
  const [showMobileBooking, setShowMobileBooking] = useState(false)
  const [mobilePhotoIndex, setMobilePhotoIndex] = useState(0)
  const mobileCarouselRef = useRef<HTMLDivElement>(null)

  const handleMobileScroll = () => {
    if (!mobileCarouselRef.current) return
    const { scrollLeft, clientWidth } = mobileCarouselRef.current
    setMobilePhotoIndex(Math.round(scrollLeft / clientWidth))
  }

  const slides = apartment.images.gallery.map((img) => ({ src: img.src, alt: img.alt }))
  const mainImg = apartment.images.gallery[0]
  const secondaryImgs = apartment.images.gallery.slice(1, 5)

  // Open the zoomable lightbox at a given index, closing the grid overview first.
  const openLightbox = (i: number) => {
    setGalleryOpen(false)
    setLightboxIndex(i)
  }

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
      <article className="pt-16 md:pt-20 bg-cream-50">

        {/* ── 1. MOBILE CAROUSEL ────────────────────────────────────── */}
        <div className="md:hidden relative mb-4">
          <div
            ref={mobileCarouselRef}
            onScroll={handleMobileScroll}
            className="flex overflow-x-auto snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {apartment.images.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="snap-start shrink-0 w-full relative"
                style={{ aspectRatio: "4/3" }}
                aria-label="Foto vergrößern"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  className="object-cover"
                  sizes="100vw"
                />
              </button>
            ))}
          </div>
          <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/60 rounded-full font-body text-xs text-white pointer-events-none">
            {mobilePhotoIndex + 1} / {apartment.images.gallery.length}
          </div>
          {/* Alle Fotos (mobil) */}
          <button
            onClick={() => setGalleryOpen(true)}
            className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 rounded-full font-body text-xs font-medium text-forest-800 shadow-sm"
          >
            <IconExpand size={12} />
            Alle {apartment.images.gallery.length} Fotos
          </button>
        </div>

        {/* ── 2. DESKTOP PHOTO GRID ─────────────────────────────────── */}
        <div className="hidden md:block container-site pt-4 mb-8">
          <div className="grid grid-cols-4 gap-2 rounded-2xl overflow-hidden relative">
            {mainImg && (
              <button
                onClick={() => setLightboxIndex(0)}
                className="col-span-2 row-span-2 relative aspect-[4/3] group cursor-zoom-in"
                aria-label="Foto vergrößern"
              >
                <Image
                  src={mainImg.src}
                  alt={mainImg.alt}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/10 transition-colors" />
              </button>
            )}
            {secondaryImgs.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIndex(i + 1)}
                className="relative aspect-[4/3] group cursor-zoom-in overflow-hidden"
                aria-label="Foto vergrößern"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/10 transition-colors" />
              </button>
            ))}
            <button
              onClick={() => setGalleryOpen(true)}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 bg-white border border-forest-200 rounded-lg font-body text-xs font-medium text-forest-800 hover:bg-cream-100 transition-colors shadow-sm"
            >
              <IconExpand size={13} />
              Alle {apartment.images.gallery.length} Fotos
            </button>
          </div>
        </div>

        {/* ── 3. TWO-COLUMN CONTENT ─────────────────────────────────── */}
        <div className="container-site pb-12">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_340px] gap-8 items-start">

            {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
            <div className="min-w-0">

              {/* Title + stats + inline ratings */}
              <div className="pb-6 border-b border-cream-200">
                {apartment.isNew && (
                  <span className="inline-block mb-2 px-2 py-0.5 bg-gold-500 rounded-full font-body text-xs font-bold text-forest-900 uppercase tracking-widest">
                    Neu
                  </span>
                )}
                <h1 className="font-display text-display-md text-forest-900 leading-tight mb-2">
                  {apartment.name}
                </h1>
                <p className="font-body text-base text-forest-600 mb-1">
                  Apartment · {apartment.sqm} m² · {schoenblick.address}
                </p>
                <p className="font-body text-sm text-forest-500 mb-3">
                  {apartment.maxGuests} Gäste · {apartment.bedrooms} Schlafzimmer · {apartment.beds} Betten · {apartment.bathrooms} Badezimmer
                </p>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-body text-sm text-forest-700">
                  {apartment.airbnbRating > 0 && apartment.airbnbUrl !== "" && (
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

              {/* Host Info */}
              <div className="pb-6 border-b border-cream-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-cream-200">
                  <Image src="/images/team/profilbild.jpg" alt="Vincent & Elena" width={48} height={48} className="object-cover w-full h-full" />
                </div>
                <div>
                  <p className="font-body text-base font-semibold text-forest-900">
                    Gastgeber: Vincent &amp; Elena
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 font-body text-sm text-forest-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-gold-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />
                      </svg>
                      Superhost
                    </span>
                    <span>·</span>
                    <span>Check-in ab 16:00</span>
                    <span>·</span>
                    <span>Check-out bis 10:00</span>
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
                    title: "Direktbuchung – bis zu 20 % günstiger",
                    text: "Buche direkt bei uns und spare gegenüber den gängigen Buchungsportalen.",
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

              {/* Bedrooms */}
              {apartment.bedroomImages && apartment.bedroomImages.length > 0 && (
                <div className="py-7 border-b border-cream-200">
                  <h2 className="font-display text-xl text-forest-900 mb-5">Wo du schlafen wirst</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {apartment.bedroomImages.map((room) => (
                      <div key={room.name} className="rounded-2xl border border-cream-200 overflow-hidden bg-white">
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={room.img}
                            alt={room.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 45vw, 200px"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-body text-sm font-semibold text-forest-900">{room.name}</p>
                          <p className="font-body text-xs text-forest-500 mt-0.5">{room.bed}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
            <div className="hidden md:block md:sticky md:top-24 lg:top-28">
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

        {/* ── WAS DU WISSEN SOLLTEST ────────────────────────────────── */}
        <div className="bg-cream-50 border-t border-cream-200">
          <div className="container-site py-12">
            <h2 className="font-display text-2xl text-forest-900 mb-7">Was du wissen solltest</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Hausregeln */}
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <svg className="w-5 h-5 text-forest-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                  <p className="font-body text-sm font-semibold text-forest-900">Hausregeln</p>
                </div>
                <ul className="space-y-1.5 font-body text-sm text-forest-600">
                  <li>Check-in ab 16:00 Uhr</li>
                  <li>Höchstens {apartment.maxGuests} Gäste</li>
                  <li>Haustiere nach Absprache</li>
                  <li>Nicht rauchen</li>
                </ul>
              </div>

              {/* Stornierung & Barrierefreiheit */}
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <svg className="w-5 h-5 text-forest-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  <p className="font-body text-sm font-semibold text-forest-900">Stornierung & Zugang</p>
                </div>
                <p className="font-body text-sm text-forest-600 mb-2">
                  Kostenlose Stornierung bis 30 Tage vor Anreise. Danach gelten unsere{" "}
                  <Link href="/stornierung" className="font-semibold text-forest-900 underline underline-offset-2 hover:text-gold-700 transition-colors">
                    Stornobedingungen
                  </Link>.
                </p>
                <p className="font-body text-sm text-forest-600">
                  Barrierefreiheit: Bitte{" "}
                  <Link href="/kontakt" className="font-semibold text-forest-900 underline underline-offset-2 hover:text-gold-700 transition-colors">
                    sprich uns vor der Buchung an
                  </Link>{" "}
                  – wir informieren dich gern zu Zugang und Ausstattung.
                </p>
              </div>

              {/* Sicherheit */}
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <svg className="w-5 h-5 text-forest-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <p className="font-body text-sm font-semibold text-forest-900">Sicherheit</p>
                </div>
                <ul className="space-y-1.5 font-body text-sm text-forest-600">
                  <li>Rauchmelder vorhanden</li>
                </ul>
              </div>
            </div>
          </div>
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
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-cream-200 px-4 py-3 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div>
            <p className="font-body text-sm font-medium text-forest-900 leading-tight">
              Zeitraum wählen, um Preise anzuzeigen
            </p>
            {apartment.airbnbRating > 0 && apartment.airbnbUrl !== "" && (
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
              className="md:hidden fixed inset-0 z-50 bg-cream-50 overflow-y-auto"
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

      {/* Galerie-Übersicht: alle Fotos auf einen Blick */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-cream-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={`Alle ${apartment.images.gallery.length} Fotos`}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 py-4 bg-cream-50/90 backdrop-blur-sm border-b border-cream-200">
              <button
                onClick={() => setGalleryOpen(false)}
                className="flex items-center gap-2 font-body text-sm font-medium text-forest-800 hover:text-forest-600 transition-colors"
                aria-label="Galerie schließen"
              >
                <IconX size={20} />
                Schließen
              </button>
              <span className="font-body text-sm text-forest-500">
                {apartment.images.gallery.length} Fotos
              </span>
            </div>

            {/* Foto-Raster */}
            <div className="container-site py-6 md:py-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {apartment.images.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => openLightbox(i)}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-zoom-in bg-cream-200"
                    aria-label={`${img.alt} – vergrößern`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/10 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
