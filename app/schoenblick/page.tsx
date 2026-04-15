import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { schoenblick } from "@/data/properties";
import { schoenblickReviews } from "@/data/reviews";
import PropertyHero from "@/components/property/PropertyHero";
import QuickFacts from "@/components/property/QuickFacts";
import AmenitiesGrid from "@/components/property/AmenitiesGrid";
import LocationMap from "@/components/property/LocationMap";
import PropertyReviews from "@/components/property/PropertyReviews";
import FaqAccordion from "@/components/property/FaqAccordion";
import RelatedProperties from "@/components/property/RelatedProperties";
import { IconStar, IconUsers, IconArrowRight } from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Haus Schönblick – Panorama-Ferienwohnungen in Schöfweg",
  description:
    "4 gemütliche Ferienwohnungen mit atemberaubendem Panoramablick im Bayerischen Wald. Ideal für Familien und Gruppen. Ab 85€ / Nacht. Jetzt direkt buchen!",
  openGraph: {
    title: "Haus Schönblick – Panorama-Apartments im Bayerischen Wald",
    description:
      "4 Ferienwohnungen mit Panoramablick in Schöfweg. Für Paare, Familien und Gruppen. Direkt buchen und sparen.",
    images: [{ url: schoenblick.images.hero, alt: "Haus Schönblick" }],
  },
  alternates: {
    canonical: "https://www.sarfi-collection.de/schoenblick",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Haus Schönblick",
  description: schoenblick.description,
  url: "https://www.sarfi-collection.de/schoenblick",
  image: schoenblick.images.gallery.map((g) => g.src),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Hochwaldstraße 18/20",
    addressLocality: "Schöfweg",
    postalCode: "94572",
    addressCountry: "DE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: schoenblick.coordinates.lat,
    longitude: schoenblick.coordinates.lng,
  },
  checkinTime: "T16:00",
  checkoutTime: "T10:00",
  sameAs: [
    "https://maps.app.goo.gl/y3CiwE29n7m17LJs9",
  ],
  priceRange: `ab ${schoenblick.priceFrom}€ / Nacht`,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: schoenblick.airbnbRating,
    reviewCount: schoenblick.airbnbReviewCount,
    bestRating: "5",
  },
};

export default function SchoenblickPage() {
  const apartments = Object.values(schoenblick.apartments ?? {});

  const relatedHaus28 = [
    {
      name: "HAUS28",
      subtitle: "Modernes A-Frame im Wald",
      href: "/haus28",
      bookHref: "/haus28/buchen",
      imageSrc: "/images/haus28/hero.webp",
      imageAlt: "HAUS28 A-Frame",
      priceFrom: 199,
      rating: 5.0,
      tag: "A-Frame",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <PropertyHero
        name={schoenblick.name}
        subtitle={schoenblick.subtitle}
        address={schoenblick.address}
        priceFrom={schoenblick.priceFrom}
        airbnbRating={schoenblick.airbnbRating}
        airbnbReviewCount={schoenblick.airbnbReviewCount}
        heroImage={schoenblick.images.hero}
        bookHref="/schoenblick/buchen"
      />

      {/* Quick Facts – aggregate */}
      <QuickFacts
        maxGuests={20}
        airbnbRating={schoenblick.airbnbRating}
        airbnbReviewCount={schoenblick.airbnbReviewCount}
        address={schoenblick.address}
      />

      {/* Apartments grid */}
      <section className="section-pad bg-cream-50" aria-labelledby="apartments-heading">
        <div className="container-site">
          <div className="mb-10">
            <p className="font-body text-sm tracking-[0.15em] uppercase text-gold-600 mb-2">
              4 Ferienwohnungen
            </p>
            <h2
              id="apartments-heading"
              className="font-display text-display-md text-forest-900 mb-3"
            >
              Wähle dein Apartment
            </h2>
            <p className="font-body text-lg text-forest-600 max-w-2xl leading-relaxed">
              Alle vier Apartments befinden sich im selben Haus – perfekt für Gruppen, die mehrere Wohnungen gleichzeitig buchen möchten.
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
                  {/* TODO: Replace with actual apartment photo */}
                  <Image
                    src={apt.images.hero}
                    alt={apt.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent" />
                  {/* Rating badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 bg-forest-900/70 backdrop-blur-sm rounded-full">
                    <IconStar size={11} className="text-gold-300 fill-gold-300" filled />
                    <span className="font-body text-xs font-semibold text-cream-50">
                      {apt.airbnbRating}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-display text-xl text-forest-900 mb-1">{apt.name}</h3>
                  <p className="font-body text-sm text-forest-500 mb-4">{apt.subtitle}</p>

                  <div className="flex items-center gap-4 text-forest-400 text-sm font-body mb-4">
                    <span className="flex items-center gap-1">
                      <IconUsers size={14} />
                      {apt.maxGuests} Gäste
                    </span>
                    <span>·</span>
                    <span>{apt.bedrooms} SZ</span>
                    <span>·</span>
                    <span>{apt.sqm} m²</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-body text-xs text-forest-400">ab </span>
                      <span className="font-display text-2xl text-forest-800">{apt.priceFrom}€</span>
                      <span className="font-body text-xs text-forest-400"> / Nacht</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/schoenblick/${apt.id}`}
                        className="inline-flex items-center gap-1 px-4 py-2 text-sm font-body text-forest-600 hover:text-forest-900 border border-forest-200 rounded-full transition-colors"
                      >
                        Details
                        <IconArrowRight size={13} />
                      </Link>
                      <Link
                        href="/schoenblick/buchen"
                        className="px-4 py-2 bg-gold-500 text-forest-900 text-sm font-body font-medium rounded-full hover:bg-gold-400 transition-colors"
                      >
                        Buchen
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
              <strong className="font-semibold">Für Gruppen:</strong> Mehrere Apartments gleichzeitig buchen und den ganzen Hausbereich genießen – ideal für Familienfeiern, Geburtstage oder Firmenausflüge.{" "}
              <Link href="/kontakt" className="text-gold-600 underline underline-offset-2 hover:text-gold-700">
                Anfrage stellen →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <AmenitiesGrid amenities={schoenblick.amenities} />

      {/* Location */}
      <LocationMap
        address={schoenblick.address}
        coordinates={schoenblick.coordinates}
        description="Haus Schönblick liegt im Ortsteil Langfurth bei Schöfweg, mitten im Bayerischen Wald. Wanderwege beginnen direkt vor der Haustür. Die beliebte Westernstadt Pullman City ist nur 15 Minuten entfernt – ideal für Familien mit Kindern. Die Region bietet Natur pur, klare Luft und echte Erholung zu jeder Jahreszeit."
        nearbyAttractions={[
          { name: "Wanderweg ab Haustür", distance: "0 m" },
          { name: "Pullman City (Westernstadt)", distance: "~15 min" },
          { name: "Grafenau Zentrum", distance: "~15 min" },
          { name: "Nationalpark Bayerischer Wald", distance: "~20 km" },
          { name: "Baumwipfelpfad Neuschönau", distance: "~25 min" },
          { name: "Thermalbad Regen", distance: "~30 min" },
          { name: "Skigebiet Arber", distance: "~45 min" },
        ]}
      />

      {/* Reviews */}
      <PropertyReviews
        reviews={schoenblickReviews}
        averageRating={schoenblick.airbnbRating}
        totalCount={schoenblick.airbnbReviewCount}
      />

      {/* FAQ */}
      <FaqAccordion faqs={schoenblick.faqs} />

      {/* Cross-sell HAUS28 */}
      <RelatedProperties
        currentId="schoenblick"
        title="Auch interessant"
        properties={relatedHaus28}
      />
    </>
  );
}
