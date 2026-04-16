/**
 * Reusable template for a single Schönblick apartment page.
 * Used by /schoenblick/b5, /b6, /b8, /a2
 */

import PropertyHero from "@/components/property/PropertyHero";
import QuickFacts from "@/components/property/QuickFacts";
import ImageGallery from "@/components/property/ImageGallery";
import PropertyDescription from "@/components/property/PropertyDescription";
import AmenitiesGrid from "@/components/property/AmenitiesGrid";
import LocationMap from "@/components/property/LocationMap";
import PropertyReviews from "@/components/property/PropertyReviews";
import BookingWidget from "@/components/booking/BookingWidget";
import FaqAccordion from "@/components/property/FaqAccordion";
import RelatedProperties from "@/components/property/RelatedProperties";
import { schoenblick } from "@/data/properties";
import { schoenblickReviews } from "@/data/reviews";
import type { ApartmentData } from "@/data/properties";
import { type PropertyBookingConfig, resolveSmoobuId } from "@/config/properties.config";

interface ApartmentPageProps {
  apartment: ApartmentData;
  config: PropertyBookingConfig;
}

export default function ApartmentPage({ apartment, config }: ApartmentPageProps) {
  const smoobuId = resolveSmoobuId(config);

  // Related = other apartments in Schönblick
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
    }));

  const aptReviews = schoenblickReviews.filter(
    (r) => !r.apartmentId || r.apartmentId === apartment.id,
  );

  return (
    <>
      {/* 1. Hero */}
      <PropertyHero
        name={apartment.name}
        subtitle={apartment.subtitle}
        address={schoenblick.address}
        priceFrom={apartment.priceFrom}
        airbnbRating={apartment.airbnbRating}
        airbnbReviewCount={apartment.airbnbReviewCount}
        heroImage={apartment.images.hero}
        bookHref={`#buchen`}
        galleryCount={apartment.images.gallery.length}
        breadcrumb={[{ label: "Haus Schönblick", href: "/schoenblick" }]}
      />

      {/* 2. Quick Facts */}
      <QuickFacts
        maxGuests={apartment.maxGuests}
        bedrooms={apartment.bedrooms}
        bathrooms={apartment.bathrooms}
        sqm={apartment.sqm}
        airbnbRating={apartment.airbnbRating}
        airbnbReviewCount={apartment.airbnbReviewCount}
        address={schoenblick.address}
      />

      {/* 3. Galerie */}
      <ImageGallery images={apartment.images.gallery} propertyName={apartment.name} />

      {/* 4. Beschreibung */}
      <PropertyDescription description={apartment.description} propertyName={apartment.name} />

      {/* 5. Ausstattung */}
      <AmenitiesGrid amenities={apartment.amenities} />

      {/* 6. Lage */}
      <LocationMap
        address={schoenblick.address}
        coordinates={schoenblick.coordinates}
        description="Schöfweg liegt mitten im Herzen des Bayerischen Waldes. Wanderwege starten direkt vor dem Haus. Einkaufsmöglichkeiten sind in wenigen Minuten erreichbar."
        nearbyAttractions={[
          { name: "Wanderweg zum Brotjacklriegel", distance: "Direkt ab Haustür" },
          { name: "Grafenau Zentrum", distance: "~15 min" },
          { name: "Nationalpark Bayerischer Wald", distance: "~20 km" },
          { name: "Thermalbad Regen", distance: "~30 min" },
          { name: "Skigebiet Arber", distance: "~45 min" },
        ]}
      />

      {/* 7. Bewertungen */}
      <PropertyReviews
        reviews={aptReviews.length > 0 ? aptReviews : schoenblickReviews}
        averageRating={apartment.airbnbRating}
        totalCount={apartment.airbnbReviewCount}
        airbnbUrl={apartment.airbnbUrl}
      />

      {/* 8. Buchung */}
      <div id="buchen">
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
        />
      </div>

      {/* 9. FAQ */}
      <FaqAccordion faqs={apartment.faqs} />

      {/* 10. Ähnliche */}
      <RelatedProperties
        currentId={apartment.id}
        title="Weitere Apartments im Haus Schönblick"
        properties={related}
      />
    </>
  );
}
