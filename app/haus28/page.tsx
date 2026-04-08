import type { Metadata } from "next";
import { haus28 } from "@/data/properties";
import { haus28Reviews } from "@/data/reviews";
import PropertyHero from "@/components/property/PropertyHero";
import QuickFacts from "@/components/property/QuickFacts";
import RatingsBar from "@/components/property/RatingsBar";
import ImageGallery from "@/components/property/ImageGallery";
import PropertyDescription from "@/components/property/PropertyDescription";
import AmenitiesGrid from "@/components/property/AmenitiesGrid";
import LocationMap from "@/components/property/LocationMap";
import PropertyReviews from "@/components/property/PropertyReviews";
import BookingWidget from "@/components/booking/BookingWidget";
import { PROPERTY_CONFIGS, resolveSmoobuId } from "@/config/properties.config";
import FaqAccordion from "@/components/property/FaqAccordion";
import RelatedProperties from "@/components/property/RelatedProperties";
import { schoenblick } from "@/data/properties";

export const metadata: Metadata = {
  title: "HAUS28 – Modernes A-Frame Ferienhaus im Bayerischen Wald",
  description:
    "HAUS28 in Grattersdorf: 157 m² A-Frame Ferienhaus im Bayerischen Wald – 48 Bewertungen, überall 5★. Architektonisch besonders, hochwertig ausgestattet. Ab 199€ / Nacht. Jetzt direkt buchen!",
  openGraph: {
    title: "HAUS28 – Modernes A-Frame im Bayerischen Wald",
    description:
      "Architektonisch einzigartiges A-Frame Ferienhaus. Natur pur, Instagram-worthy, hochwertig. Jetzt direkt buchen.",
    images: [{ url: haus28.images.hero, alt: "HAUS28 – A-Frame Ferienhaus" }],
  },
  alternates: {
    canonical: "https://www.sarfi-collection.de/haus28",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VacationRental",
  name: "HAUS28",
  description: haus28.description,
  url: "https://www.sarfi-collection.de/haus28",
  image: haus28.images.gallery.map((g) => g.src),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Büchelstein 28",
    addressLocality: "Grattersdorf",
    postalCode: "94541",
    addressCountry: "DE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: haus28.coordinates.lat,
    longitude: haus28.coordinates.lng,
  },
  numberOfRooms: haus28.bedrooms,
  floorSize: {
    "@type": "QuantitativeValue",
    value: haus28.sqm,
    unitCode: "MTK",
  },
  occupancy: {
    "@type": "QuantitativeValue",
    maxValue: haus28.maxGuests,
    unitCode: "C62",
  },
  priceRange: `ab ${haus28.priceFrom}€ / Nacht`,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount:
      (haus28.airbnbReviewCount ?? 0) +
      (haus28.bookingReviewCount ?? 0) +
      (haus28.fewoReviewCount ?? 0) +
      (haus28.googleReviewCount ?? 0),
    bestRating: "5",
    worstRating: "1",
  },
};

const haus28Ratings = [
  {
    platform: "airbnb" as const,
    label: "Airbnb",
    rating: haus28.airbnbRating,
    maxRating: 5,
    reviewCount: haus28.airbnbReviewCount,
    displayRating: "5,0",
    url: haus28.airbnbUrl,
  },
  {
    platform: "booking" as const,
    label: "Booking.com",
    rating: haus28.bookingRating ?? 10,
    maxRating: 10,
    reviewCount: haus28.bookingReviewCount ?? 0,
    displayRating: "10",
  },
  {
    platform: "fewo" as const,
    label: "FeWo-direkt",
    rating: haus28.fewoRating ?? 5,
    maxRating: 5,
    reviewCount: haus28.fewoReviewCount ?? 0,
    displayRating: "5,0",
  },
  {
    platform: "google" as const,
    label: "Google",
    rating: haus28.googleRating ?? 5,
    maxRating: 5,
    reviewCount: haus28.googleReviewCount ?? 0,
    displayRating: "5,0",
  },
];

const totalReviews =
  haus28.airbnbReviewCount +
  (haus28.bookingReviewCount ?? 0) +
  (haus28.fewoReviewCount ?? 0) +
  (haus28.googleReviewCount ?? 0);

export default function Haus28Page() {
  const config = PROPERTY_CONFIGS.haus28;
  const smoobuId = resolveSmoobuId(config);
  const relatedSchoenblick = Object.values(schoenblick.apartments ?? {}).slice(0, 3).map((apt) => ({
    name: apt.name,
    subtitle: apt.subtitle,
    href: `/schoenblick/${apt.id}`,
    bookHref: `/schoenblick/buchen`,
    imageSrc: apt.images.hero,
    imageAlt: apt.name,
    priceFrom: apt.priceFrom,
    rating: apt.airbnbRating,
    tag: "Haus Schönblick",
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero */}
      <PropertyHero
        name={haus28.name}
        subtitle={haus28.subtitle}
        address={haus28.address}
        priceFrom={haus28.priceFrom}
        airbnbRating={haus28.airbnbRating}
        airbnbReviewCount={haus28.airbnbReviewCount}
        heroImage={haus28.images.hero}
        bookHref="#buchen"
        galleryCount={haus28.images.gallery.length}
        breadcrumb={[]}
      />

      {/* 2. Quick Facts */}
      <QuickFacts
        maxGuests={haus28.maxGuests}
        bedrooms={haus28.bedrooms}
        bathrooms={haus28.bathrooms}
        sqm={haus28.sqm}
        airbnbRating={haus28.airbnbRating}
        airbnbReviewCount={haus28.airbnbReviewCount}
        address={haus28.address}
      />

      {/* 2b. Multi-Plattform Bewertungsleiste */}
      <RatingsBar platforms={haus28Ratings} totalReviews={totalReviews} />

      {/* 3. Bildergalerie */}
      <ImageGallery images={haus28.images.gallery} propertyName={haus28.name} />

      {/* 4. Beschreibung */}
      <PropertyDescription description={haus28.description} propertyName={haus28.name} />

      {/* 5. Ausstattung */}
      <AmenitiesGrid amenities={haus28.amenities} />

      {/* 6. Lage */}
      <LocationMap
        address={haus28.address}
        coordinates={haus28.coordinates}
        description="Grattersdorf liegt idyllisch am Rand des Bayerischen Waldes. Von hier aus bist du in Minuten mitten in der Natur – Wanderwege starten direkt vor der Haustür. Die nächste Stadt Deggendorf ist in ca. 20 Minuten erreichbar."
        nearbyAttractions={[
          { name: "Nationalpark Bayerischer Wald", distance: "~25 km" },
          { name: "Deggendorf Zentrum", distance: "~20 min" },
          { name: "Dreisessel (Wanderziel)", distance: "~40 min" },
          { name: "Thermalbad Regen", distance: "~35 min" },
          { name: "Arber (Skigebiet)", distance: "~50 min" },
        ]}
      />

      {/* 7. Bewertungen */}
      <PropertyReviews
        reviews={haus28Reviews}
        averageRating={haus28.airbnbRating}
        totalCount={haus28.airbnbReviewCount}
        airbnbUrl={haus28.airbnbUrl}
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
      <FaqAccordion faqs={haus28.faqs} />

      {/* 10. Cross-Selling */}
      <RelatedProperties
        currentId="haus28"
        title="Auch interessant: Haus Schönblick"
        properties={relatedSchoenblick}
      />
    </>
  );
}
