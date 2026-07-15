import Image from "next/image";
import Link from "next/link";
import { schoenblick } from "@/data/properties";
import { localizeProperty } from "@/data/properties.i18n";
import { schoenblickReviews } from "@/data/reviews";
import PropertyHero from "@/components/property/PropertyHero";
import QuickFacts from "@/components/property/QuickFacts";
import AmenitiesGrid from "@/components/property/AmenitiesGrid";
import LocationMap from "@/components/property/LocationMap";
import PropertyReviews from "@/components/property/PropertyReviews";
import FaqAccordion from "@/components/property/FaqAccordion";
import RelatedProperties from "@/components/property/RelatedProperties";
import { IconStar, IconUsers, IconArrowRight } from "@/components/ui/Icons";
import { getDict, localizeHref, type Locale } from "@/lib/i18n";

/** Haus-Schönblick-Übersichtsseite (Inhalt) – von app/(de)/schoenblick und app/(en)/en/schoenblick gerendert. */
export default function SchoenblickPageContent({ locale }: { locale: Locale }) {
  const t = getDict(locale).property.schoenblickPage;
  const haus = localizeProperty(schoenblick, locale);
  const apartments = Object.values(haus.apartments ?? {});

  const relatedHaus28 = [
    {
      name: "HAUS28",
      subtitle: t.relatedHaus28Subtitle,
      href: localizeHref("/haus28", locale),
      bookHref: localizeHref("/haus28/buchen", locale),
      imageSrc: "/images/haus28/hero.webp",
      imageAlt: "HAUS28 A-Frame",
      priceFrom: 199,
      rating: 5.0,
      tag: "A-Frame",
    },
  ];

  return (
    <>
      {/* Hero */}
      <PropertyHero
        name={haus.name}
        subtitle={haus.subtitle}
        address={haus.address}
        priceFrom={haus.priceFrom}
        airbnbRating={haus.airbnbRating}
        airbnbReviewCount={haus.airbnbReviewCount}
        heroImage={haus.images.hero}
        bookHref={localizeHref("/schoenblick/buchen", locale)}
      />

      {/* Quick Facts – aggregate */}
      <QuickFacts
        maxGuests={20}
        airbnbRating={haus.airbnbRating}
        airbnbReviewCount={haus.airbnbReviewCount}
        address={haus.address}
      />

      {/* Apartments grid */}
      <section className="section-pad bg-cream-50" aria-labelledby="apartments-heading">
        <div className="container-site">
          <div className="mb-10">
            <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-2">
              {t.apartmentsEyebrow}
            </p>
            <h2
              id="apartments-heading"
              className="font-display text-display-md text-forest-900 mb-3"
            >
              {t.apartmentsHeading}
            </h2>
            <p className="font-body text-lg text-forest-600 max-w-2xl leading-relaxed">
              {t.apartmentsIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {apartments.map((apt) => (
              <article
                key={apt.id}
                className="group rounded-3xl overflow-hidden bg-white border border-cream-200 shadow-card hover:shadow-card-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={apt.images.hero}
                    alt={apt.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent" />
                  {/* NEU-Badge */}
                  {apt.isNew && (
                    <div className="absolute top-4 left-4 px-2.5 py-1 bg-gold-500 rounded-full">
                      <span className="font-body text-xs font-bold text-forest-900 tracking-widest uppercase">
                        {t.newBadge}
                      </span>
                    </div>
                  )}
                  {/* Rating badge */}
                  {apt.airbnbRating > 0 && apt.airbnbUrl !== "" && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-forest-900/70 backdrop-blur-sm rounded-full">
                      <IconStar size={11} className="text-gold-300 fill-gold-300" filled />
                      <span className="font-body text-xs font-semibold text-cream-50">
                        {apt.airbnbRating}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-display text-xl text-forest-900 mb-1">{apt.name}</h3>
                  <p className="font-body text-sm text-forest-500 mb-4">{apt.subtitle}</p>

                  <div className="flex items-center gap-4 text-forest-400 text-sm font-body mb-4">
                    <span className="flex items-center gap-1">
                      <IconUsers size={14} />
                      {apt.maxGuests}{t.guestsPost}
                    </span>
                    <span>·</span>
                    <span>{apt.bedrooms}{t.bedroomsAbbrPost}</span>
                    <span>·</span>
                    <span>{apt.sqm} m²</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-body text-xs text-forest-400">{t.fromPre}</span>
                      <span className="font-display text-2xl text-forest-800">{apt.priceFrom}€</span>
                      <span className="font-body text-xs text-forest-400">{t.perNight}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={localizeHref(`/schoenblick/${apt.id}`, locale)}
                        className="inline-flex items-center gap-1 px-4 py-2 text-sm font-body text-forest-600 hover:text-forest-900 border border-forest-200 rounded-full transition-colors"
                      >
                        {t.details}
                        <IconArrowRight size={13} />
                      </Link>
                      <Link
                        href={localizeHref("/schoenblick/buchen", locale)}
                        className="px-4 py-2 bg-gold-500 text-forest-900 text-sm font-body font-medium rounded-full hover:bg-gold-400 transition-colors"
                      >
                        {t.book}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Group booking hint */}
          <div className="mt-8 p-5 rounded-2xl bg-forest-900/5 border border-forest-200">
            <p className="font-body text-sm text-forest-700">
              <strong className="font-semibold">{t.groupStrong}</strong>{t.groupText}{" "}
              <Link href={localizeHref("/kontakt", locale)} className="text-gold-600 underline underline-offset-2 hover:text-gold-700">
                {t.groupCta}
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <AmenitiesGrid amenities={haus.amenities} />

      {/* Location */}
      <LocationMap
        address={haus.address}
        coordinates={haus.coordinates}
        description={t.locationDescription}
        nearbyAttractions={t.attractions}
      />

      {/* Reviews */}
      <PropertyReviews
        reviews={schoenblickReviews}
        averageRating={haus.airbnbRating}
        totalCount={haus.airbnbReviewCount}
      />

      {/* FAQ */}
      <FaqAccordion faqs={haus.faqs} />

      {/* Cross-sell HAUS28 */}
      <RelatedProperties
        currentId="schoenblick"
        title={t.relatedTitle}
        properties={relatedHaus28}
      />
    </>
  );
}
