"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import BookingWidget from "./BookingWidget"
import type { ApartmentData } from "@/data/properties"
import type { PropertyBookingConfig } from "@/config/properties.config"
import { IconUsers, IconStar } from "@/components/ui/Icons"
import { getDict, localizeHref } from "@/lib/i18n"
import { useLocale } from "@/lib/i18n/LocaleProvider"

interface ApartmentOption {
  apt: ApartmentData
  config: PropertyBookingConfig
  smoobuId: string
}

interface ApartmentSelectorProps {
  apartments: ApartmentOption[]
}

export default function ApartmentSelector({ apartments }: ApartmentSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const widgetRef = useRef<HTMLDivElement>(null)
  const locale = useLocale()
  const t = getDict(locale).booking

  const selectedOption = apartments.find((a) => a.apt.id === selectedId)

  useEffect(() => {
    if (selectedId && widgetRef.current) {
      setTimeout(() => {
        widgetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 50)
    }
  }, [selectedId])

  return (
    <>
      {/* Apartment Cards */}
      <div className="container-site py-8">
        <h2 className="font-display text-xl text-forest-900 mb-2">
          {t.selector.chooseHeading}
        </h2>
        <p className="font-body text-sm text-forest-500 mb-6">
          {t.selector.chooseSub}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apartments.map(({ apt, config }) => {
            const isSelected = selectedId === apt.id
            return (
              <button
                key={apt.id}
                onClick={() => setSelectedId(isSelected ? null : apt.id)}
                className={[
                  "group text-left rounded-2xl overflow-hidden border-2 transition-all duration-200 shadow-card",
                  isSelected
                    ? "border-gold-500 ring-2 ring-gold-400/30 shadow-card-lg"
                    : "border-cream-200 hover:border-gold-400 hover:shadow-card-lg bg-white",
                ].join(" ")}
              >
                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={apt.images.hero}
                    alt={apt.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/50 to-transparent" />

                  {apt.isNew && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-gold-500 rounded-full">
                      <span className="font-body text-xs font-bold text-forest-900 tracking-widest uppercase">
                        {t.selector.newBadge}
                      </span>
                    </div>
                  )}

                  {apt.airbnbRating > 0 && apt.airbnbUrl && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-forest-900/70 backdrop-blur-sm rounded-full">
                      <IconStar size={10} className="text-gold-300 fill-gold-300" filled />
                      <span className="font-body text-xs font-semibold text-cream-50">
                        {apt.airbnbRating}
                      </span>
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute inset-0 bg-gold-500/10 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-forest-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className={["p-4", isSelected ? "bg-gold-50" : "bg-white"].join(" ")}>
                  <h3 className="font-display text-lg text-forest-900 mb-0.5">{apt.name}</h3>
                  <p className="font-body text-xs text-forest-500 mb-3 leading-snug">{apt.subtitle}</p>

                  <div className="flex items-center gap-3 text-forest-400 text-xs font-body mb-3">
                    <span className="flex items-center gap-1">
                      <IconUsers size={12} />
                      {t.selector.guestsN(apt.maxGuests)}
                    </span>
                    <span>·</span>
                    <span>{apt.bedrooms} {t.selector.bedroomsShort}</span>
                    <span>·</span>
                    <span>{apt.sqm} m²</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-body text-xs text-forest-400">{t.labels.from}</span>
                      <span className="font-display text-xl text-forest-800">{apt.priceFrom}€</span>
                      <span className="font-body text-xs text-forest-400"> {t.labels.perNight}</span>
                    </div>
                    <span
                      className={[
                        "font-body text-xs font-medium px-3 py-1.5 rounded-full transition-colors",
                        isSelected
                          ? "bg-gold-500 text-forest-900"
                          : "bg-forest-900 text-cream-50 group-hover:bg-forest-700",
                      ].join(" ")}
                    >
                      {isSelected ? t.selector.selected : t.selector.book}
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Details link */}
        {selectedOption && (
          <p className="mt-3 font-body text-xs text-forest-400">
            {t.selector.moreInfoPre}
            <Link
              href={localizeHref(selectedOption.config.propertyHref, locale)}
              className="text-gold-600 underline underline-offset-2 hover:text-gold-700"
            >
              {t.selector.moreInfoLink(selectedOption.apt.name)}
            </Link>
          </p>
        )}

        {!selectedId && (
          <p className="mt-4 font-body text-sm text-forest-500">
            {t.selector.groupPre}
            <Link href={localizeHref("/kontakt", locale)} className="text-gold-600 underline underline-offset-2">
              {t.selector.groupLink}
            </Link>
          </p>
        )}
      </div>

      {/* Booking Widget – only for selected apartment */}
      {selectedOption && (
        <div ref={widgetRef} className="scroll-mt-20">
          <div className="bg-forest-900">
            <div className="container-site py-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-body text-xs text-cream-50/40 mb-0.5 uppercase tracking-wider">
                  {t.selector.headerKicker(selectedOption.apt.id.toUpperCase())}
                </p>
                <h2 className="font-display text-xl text-cream-50">
                  {t.selector.bookTitle(selectedOption.apt.name).plain}
                  <span className="text-gold-300">{t.selector.bookTitle(selectedOption.apt.name).gold}</span>
                </h2>
                <p className="font-body text-sm text-cream-50/60 mt-0.5">
                  {t.selector.headerMeta(
                    selectedOption.config.subtitle,
                    selectedOption.config.maxGuests,
                    selectedOption.config.priceFrom,
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedId(null)}
                  className="font-body text-xs text-cream-50/50 hover:text-cream-50/80 transition-colors underline underline-offset-2"
                >
                  {t.selector.chooseOther}
                </button>
                <Link
                  href={localizeHref(selectedOption.config.propertyHref, locale)}
                  className="font-body text-xs text-cream-50/50 hover:text-cream-50/80 transition-colors underline underline-offset-2"
                >
                  {t.selector.viewApartment}
                </Link>
              </div>
            </div>
          </div>

          <BookingWidget
            key={selectedOption.apt.id}
            smoobuId={selectedOption.smoobuId}
            propertyName={selectedOption.config.name}
            propertySlug={selectedOption.config.id}
            maxGuests={selectedOption.config.maxGuests}
            minStay={selectedOption.config.minStay}
            cleaningFee={selectedOption.config.cleaningFee}
            priceFrom={selectedOption.config.priceFrom}
            baseOccupancy={selectedOption.config.baseOccupancy}
            extraPersonFee={selectedOption.config.extraPersonFee}
            breadcrumb={selectedOption.config.breadcrumb}
            propertyHref={selectedOption.config.propertyHref}
            hideMobileBar
          />
        </div>
      )}
    </>
  )
}
