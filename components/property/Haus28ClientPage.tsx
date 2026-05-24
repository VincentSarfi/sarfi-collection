"use client"

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
import { haus28, schoenblick } from "@/data/properties"
import { haus28Reviews } from "@/data/reviews"
import { PROPERTY_CONFIGS, resolveSmoobuId } from "@/config/properties.config"
import {
  IconStar,
  IconUsers,
  IconBed,
  IconBath,
  IconHome,
  IconMapPin,
  IconArrowRight,
  IconExpand,
  AmenityIcon,
} from "@/components/ui/Icons"

const config = PROPERTY_CONFIGS.haus28

const bedrooms = [
  { name: "Schlafzimmer 1", bed: "1 Kingsize-Doppelbett", img: "/images/haus28/gallery/haus_28_250523_604.webp" },
  { name: "Schlafzimmer 2", bed: "1 Kingsize-Doppelbett", img: "/images/haus28/gallery/haus_28_250523_647.webp" },
  { name: "Schlafzimmer 3", bed: "1 Kingsize-Doppelbett", img: "/images/haus28/gallery/haus_28_250523_380.webp" },
  { name: "Schlafzimmer 4", bed: "1 Queensize-Doppelbett", img: "/images/haus28/gallery/haus_28_250523_413.webp" },
]

const totalReviews =
  haus28.airbnbReviewCount +
  (haus28.bookingReviewCount ?? 0) +
  (haus28.fewoReviewCount ?? 0) +
  (haus28.googleReviewCount ?? 0)

export default function Haus28ClientPage() {
  const smoobuId = resolveSmoobuId(config)
  const [lightboxIndex, setLightboxIndex] = useState(-1)
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

  const slides = haus28.images.gallery.map((img) => ({ src: img.src, alt: img.alt }))
  const mainImg = haus28.images.gallery[0]
  const secondaryImgs = haus28.images.gallery.slice(1, 5)
  const remaining = haus28.images.gallery.length - 5

  const isLongDesc = haus28.description.length > 350
  const displayDesc =
    !isLongDesc || descExpanded
      ? haus28.description
      : haus28.description.slice(0, 350) + "…"

  const allAmenities = haus28.amenities
  const visibleAmenities = amenitiesExpanded ? allAmenities : allAmenities.slice(0, 10)

  const related = Object.values(schoenblick.apartments ?? {})
    .slice(0, 3)
    .map((apt) => ({
      name: apt.name,
      subtitle: apt.subtitle,
      href: `/schoenblick/${apt.id}`,
      bookHref: `/schoenblick/${apt.id}`,
      imageSrc: apt.images.hero,
      imageAlt: apt.name,
      priceFrom: apt.priceFrom,
      rating: apt.airbnbRating,
      tag: "Haus Schönblick",
    }))

  return (
    <>
      <article className="pt-16 md:pt-20 bg-cream-50">

        {/* ── 1. PHOTOS ─────────────────────────────────────────────── */}

        {/* Mobile: swipeable full-width carousel */}
        <div className="md:hidden relative mb-6">
          <div
            ref={mobileCarouselRef}
            onScroll={handleMobileScroll}
            className="flex overflow-x-auto snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {haus28.images.gallery.map((img, i) => (
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
          {/* Photo counter */}
          <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/60 rounded-full font-body text-xs text-white pointer-events-none">
            {mobilePhotoIndex + 1} / {haus28.images.gallery.length}
          </div>
        </div>

        {/* Desktop: 5-photo grid */}
        <div className="hidden md:block container-site pt-6 mb-8">
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
                className="relative aspect-square group cursor-zoom-in overflow-hidden"
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
                {i === secondaryImgs.length - 1 && remaining > 0 && (
                  <div className="absolute inset-0 bg-forest-900/50 flex flex-col items-center justify-center gap-1">
                    <span className="font-display text-2xl text-cream-50">+{remaining}</span>
                    <span className="font-body text-xs text-cream-50/70">weitere Fotos</span>
                  </div>
                )}
              </button>
            ))}
            <button
              onClick={() => setLightboxIndex(0)}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 bg-white border border-forest-200 rounded-lg font-body text-xs font-medium text-forest-800 hover:bg-cream-100 transition-colors shadow-sm"
            >
              <IconExpand size={13} />
              Alle {haus28.images.gallery.length} Fotos
            </button>
          </div>
        </div>

        {/* ── 2. TWO-COLUMN CONTENT ─────────────────────────────────── */}
        <div className="container-site pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-12 items-start">

            {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
            <div>

              {/* Title + stats + inline ratings */}
              <div className="pb-6 border-b border-cream-200">
                <h1 className="font-display text-display-md text-forest-900 leading-tight mb-2">
                  {haus28.name}
                </h1>
                <p className="font-body text-base text-forest-600 mb-1">
                  A-Frame Ferienhaus · {haus28.address}
                </p>
                <p className="font-body text-sm text-forest-500 mb-3">
                  {haus28.maxGuests} Gäste · {haus28.bedrooms} Schlafzimmer · {haus28.bedrooms} Betten · {haus28.bathrooms} Badezimmer
                </p>

                {/* Inline ratings row */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-body text-sm text-forest-700">
                  {haus28.airbnbRating > 0 && (
                    <>
                      <span className="flex items-center gap-1 font-semibold text-forest-900">
                        <IconStar size={14} filled className="text-forest-900 fill-forest-900" />
                        {haus28.airbnbRating}
                      </span>
                      <span className="text-forest-300">·</span>
                    </>
                  )}
                  {haus28.guestFavorite && (
                    <>
                      <span className="flex items-center gap-1.5">
                        <span className="text-base leading-none">🏆</span>
                        <span className="font-semibold">Gäste-Favorit</span>
                      </span>
                      <span className="text-forest-300">·</span>
                    </>
                  )}
                  <a
                    href="#bewertungen"
                    className="underline underline-offset-2 hover:text-forest-900 transition-colors"
                  >
                    {totalReviews} Bewertungen
                  </a>
                  <span className="text-forest-300">·</span>
                  <span className="flex items-center gap-1 text-forest-500">
                    <IconMapPin size={13} />
                    {haus28.address}
                  </span>
                </div>
              </div>

              {/* Host info */}
              <div className="py-6 border-b border-cream-200 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-cream-200">
                  <Image
                    src="/images/team/profilbild.jpg"
                    alt="Vincent & Elena"
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-body text-base font-semibold text-forest-900">
                    Gastgeber: Vincent &amp; Elena
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5 font-body text-sm text-forest-500">
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
              <div className="py-6 border-b border-cream-200 space-y-5">
                {[
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                      </svg>
                    ),
                    title: "Gäste-Favorit – oberste 5 % auf Airbnb",
                    text: "Aufgrund der Bewertungen und Zuverlässigkeit zählt HAUS28 zu den am besten bewerteten Unterkünften.",
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0z" />
                      </svg>
                    ),
                    title: "Schöne Lage – mitten im Bayerischen Wald",
                    text: "Wanderwege zum Büchelstein-Gipfel starten direkt vor der Haustür. Pullman City und Nationalpark in 20–25 Minuten.",
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                      </svg>
                    ),
                    title: "Eigenständiger Check-in per Schlüsselbox",
                    text: "Flexible Anreise – checke jederzeit ab 16:00 Uhr bequem per Schlüsselbox ein.",
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12z" />
                      </svg>
                    ),
                    title: "Direktbuchung – günstiger als Airbnb",
                    text: "Keine Plattformgebühren. Buche direkt und spare bis zu 20 % gegenüber Buchungsportalen.",
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
              <div className="py-6 border-b border-cream-200">
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

              {/* Wo du schlafen wirst */}
              <div className="py-6 border-b border-cream-200">
                <h2 className="font-display text-xl text-forest-900 mb-5">Wo du schlafen wirst</h2>
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none -mx-1 px-1">
                  {bedrooms.map((room) => (
                    <div
                      key={room.name}
                      className="snap-start shrink-0 w-60 rounded-xl border border-cream-200 overflow-hidden bg-white"
                    >
                      <div className="relative aspect-[4/3]">
                        <Image
                          src={room.img}
                          alt={room.name}
                          fill
                          className="object-cover"
                          sizes="240px"
                        />
                      </div>
                      <div className="p-4">
                        <p className="font-body text-sm font-semibold text-forest-900">{room.name}</p>
                        <p className="font-body text-sm text-forest-500 mt-0.5">{room.bed}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="py-6 border-b border-cream-200">
                <h2 className="font-display text-xl text-forest-900 mb-5">Das bietet dir diese Unterkunft</h2>
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
              <div className="py-6 border-b border-cream-200">
                <LocationMap
                  address={haus28.address}
                  coordinates={haus28.coordinates}
                  description="HAUS28 liegt am Büchelstein bei Grattersdorf, idyllisch am Rand des Bayerischen Waldes. Wanderwege zum Büchelstein-Gipfel starten direkt vor der Haustür. Die Westernstadt Pullman City ist in nur 20 Minuten erreichbar – perfekt für Familien. Deggendorf mit Einkaufsmöglichkeiten und Restaurants liegt ebenfalls ca. 20 Minuten entfernt."
                  nearbyAttractions={[
                    { name: "Büchelstein-Gipfel (Wanderung)", distance: "~15 min zu Fuß" },
                    { name: "Pullman City (Westernstadt)", distance: "~20 min" },
                    { name: "Nationalpark Bayerischer Wald", distance: "~25 km" },
                    { name: "Deggendorf Zentrum", distance: "~20 min" },
                    { name: "Thermalbad Regen", distance: "~35 min" },
                    { name: "Arber (Skigebiet)", distance: "~50 min" },
                  ]}
                />
              </div>

              {/* Ausflugsziele teaser */}
              <div className="py-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-body text-xs tracking-[0.12em] uppercase text-gold-600 mb-1">
                      Direkt ab HAUS28
                    </p>
                    <h2 className="font-display text-xl text-forest-900 mb-1">
                      Wanderung zum Büchelstein &amp; weitere Ausflüge
                    </h2>
                    <p className="font-body text-sm text-forest-600 max-w-lg">
                      Die Büchelstein-Rundwanderung startet direkt vor der Haustür – über die historische Wallfahrtskapelle Rastbuche (18. Jh.) auf 831 m Höhe. Alle Ausflugstipps für die Region auf einen Blick.
                    </p>
                  </div>
                  <Link
                    href="/ausflugsziele#buechelstein-wanderung"
                    className="flex-none inline-flex items-center gap-2 px-5 py-2.5 bg-forest-900 text-cream-50 text-sm font-body font-medium rounded-full hover:bg-forest-800 transition-colors whitespace-nowrap"
                  >
                    Alle Ausflugsziele
                    <IconArrowRight size={14} />
                  </Link>
                </div>
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

        {/* ── 3. AWARDS ─────────────────────────────────────────────── */}
        <div className="bg-forest-900">
          <div className="container-site py-12">
            <p className="font-body text-xs uppercase tracking-widest text-gold-300 text-center mb-10">
              Auszeichnungen
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-cream-50/10">
              {/* Airbnb Gäste-Favorit */}
              <div className="flex flex-col items-center gap-2 text-center px-10 pb-8 sm:pb-0">
                <div className="flex items-center gap-0 mb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/awards/laurel-left.svg" alt="" width={56} height={84} className="h-24 w-auto object-contain -mr-4" />
                  <span className="font-display text-7xl text-cream-50 tracking-tight -mt-8">5,0</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/awards/laurel-right.svg" alt="" width={56} height={84} className="h-24 w-auto object-contain -ml-4" />
                </div>
                <p className="font-body text-xs uppercase tracking-widest text-cream-50/40">Airbnb</p>
                <p className="font-display text-2xl text-cream-50">Gäste-Favorit</p>
                <div className="flex gap-0.5 text-gold-300 my-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <IconStar key={i} size={13} filled />
                  ))}
                </div>
                <p className="font-body text-sm text-cream-50/60">
                  5,0 · {haus28.airbnbReviewCount} Bewertungen
                </p>
                <p className="font-body text-xs text-cream-50/40 max-w-[180px] mt-1">
                  Oberste 5 % der Inserate auf Airbnb
                </p>
              </div>

              {/* Booking.com Award */}
              <div className="flex flex-col items-center gap-2 text-center px-10 pt-8 sm:pt-0">
                <Image
                  src="/images/awards/booking-award-2026.png"
                  alt="Booking.com Traveller Review Award 2026"
                  width={150}
                  height={150}
                  className="h-32 w-auto object-contain"
                />
                <p className="font-body text-sm text-cream-50/60">
                  9,9/10 · {haus28.bookingReviewCount} Bewertungen
                </p>
                <p className="font-body text-xs text-cream-50/40 max-w-[180px]">
                  Traveller Review Awards 2026
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. REVIEWS ────────────────────────────────────────────── */}
        <div id="bewertungen">
          <PropertyReviews
            reviews={haus28Reviews}
            averageRating={haus28.airbnbRating}
            totalCount={haus28.airbnbReviewCount}
            airbnbUrl={haus28.airbnbUrl}
          />
        </div>

        {/* ── 5. HOST PROFILE ───────────────────────────────────────── */}
        <div className="bg-white border-t border-cream-200">
          <div className="container-site py-16">
            <h2 className="font-display text-2xl text-forest-900 mb-8">
              Lerne deine:n Gastgeber:in kennen
            </h2>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Host card */}
              <div className="shrink-0 w-full sm:w-72 rounded-2xl border border-cream-200 p-6 bg-cream-50 shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cream-200 shrink-0">
                    <Image
                      src="/images/team/profilbild.jpg"
                      alt="Vincent & Elena"
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-display text-lg text-forest-900">Vincent &amp; Elena</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-gold-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />
                      </svg>
                      <span className="font-body text-xs text-forest-500">Superhost</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-cream-200 border-t border-cream-200 pt-4">
                  {[
                    { value: String(totalReviews), label: "Bewertungen" },
                    { value: "4,97 ★", label: "Sternebewertung" },
                    { value: "1", label: "Jahr Gastgeber" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center gap-0.5 px-2">
                      <span className="font-display text-lg text-forest-900">{stat.value}</span>
                      <span className="font-body text-[10px] text-forest-400 text-center leading-tight">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Host bio */}
              <div className="flex-1 space-y-5">
                <p className="font-body text-base text-forest-700 leading-relaxed">
                  Wir sind Vincent und Elena – mit unseren zwei Kindern leben wir mitten in der Natur und lieben es, Gäste willkommen zu heißen. Unsere Ferienhäuser haben wir mit viel Herz und Handarbeit gestaltet – mal modern im A-Frame, mal gemütlich direkt am Skilift. Wir teilen gern unsere liebsten Tipps für Wanderungen, Skitage oder Ausflüge und sind jederzeit für dich da, wenn du etwas brauchst.
                </p>
                <div className="rounded-xl border border-cream-200 bg-cream-50 p-5 space-y-3">
                  <div>
                    <p className="font-body text-sm font-semibold text-forest-900 mb-0.5">Superhost</p>
                    <p className="font-body text-sm text-forest-600">
                      Superhosts sind erfahrene, herausragend bewertete Gastgeber:innen, die ihren Gästen großartige Aufenthalte bieten.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-cream-200 space-y-1">
                    <p className="font-body text-sm text-forest-700">
                      <span className="font-semibold">Antwortrate:</span> 100 %
                    </p>
                    <p className="font-body text-sm text-forest-700">
                      Antwortet innerhalb einer Stunde
                    </p>
                  </div>
                </div>
                <Link
                  href={`mailto:info@sarfi-collection.de`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-forest-200 font-body text-sm font-semibold text-forest-800 hover:border-forest-400 hover:bg-cream-100 transition-colors"
                >
                  Nachricht an Gastgeber:in
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── 6. WAS DU WISSEN SOLLTEST ─────────────────────────────── */}
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
                  <li>Check-out vor 10:00 Uhr</li>
                  <li>Höchstens {haus28.maxGuests} Gäste</li>
                  <li>Keine Haustiere</li>
                  <li>Nicht rauchen</li>
                </ul>
              </div>

              {/* Stornierungsbedingungen */}
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <svg className="w-5 h-5 text-forest-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                  </svg>
                  <p className="font-body text-sm font-semibold text-forest-900">Stornierungsbedingungen</p>
                </div>
                <p className="font-body text-sm text-forest-600 mb-3">
                  Kostenlose Stornierung bis 30 Tage vor Anreise. Danach gelten unsere Stornobedingungen.
                </p>
                <Link
                  href="/stornierung"
                  className="font-body text-sm font-semibold text-forest-900 underline underline-offset-2 hover:text-gold-700 transition-colors"
                >
                  Bedingungen anzeigen →
                </Link>
              </div>

              {/* Sicherheit */}
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <svg className="w-5 h-5 text-forest-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <p className="font-body text-sm font-semibold text-forest-900">Sicherheit & Unterkunft</p>
                </div>
                <ul className="space-y-1.5 font-body text-sm text-forest-600">
                  <li>Rauchmelder vorhanden</li>
                  <li>Erste-Hilfe-Set vorhanden</li>
                  <li>Feuerlöscher vorhanden</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── 7. FAQ ────────────────────────────────────────────────── */}
        <FaqAccordion faqs={haus28.faqs} />

        {/* ── 8. RELATED ────────────────────────────────────────────── */}
        <RelatedProperties
          currentId="haus28"
          title="Auch interessant: Haus Schönblick"
          properties={related}
        />

        {/* Mobile sticky bottom bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-cream-200 px-4 py-3 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div>
            <p className="font-body text-sm font-medium text-forest-900 leading-tight">
              Zeitraum wählen, um Preise anzuzeigen
            </p>
            {haus28.airbnbRating > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <IconStar size={11} filled className="text-forest-700 fill-forest-700" />
                <span className="font-body text-xs font-semibold text-forest-700">{haus28.airbnbRating}</span>
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
                <p className="font-body text-sm font-semibold text-forest-900">{haus28.name}</p>
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
