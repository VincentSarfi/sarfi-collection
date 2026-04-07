/**
 * Central configuration for all bookable properties.
 * Add new properties here – BookingWidget picks up the config automatically.
 *
 * smoobuIdEnvKey: the env-var name that holds the Smoobu apartment ID.
 * The fallback is the public ID (already visible in embed codes, not secret).
 */

export type PropertyBookingConfig = {
  /** Unique slug – matches URL segment */
  id: string
  /** Display name */
  name: string
  /** Subtitle shown in booking header */
  subtitle: string
  /** Env-var name for the Smoobu apartment ID */
  smoobuIdEnvKey: string
  /** Public fallback (if env var not set) */
  smoobuIdFallback: string
  /** Maximum occupancy */
  maxGuests: number
  /** Minimum nights required */
  minStay: number
  /** Cleaning fee in EUR */
  cleaningFee: number
  /** Displayed "from" price per night (fallback if API unavailable) */
  priceFrom: number
  /** Base occupancy included in the nightly rate */
  baseOccupancy: number
  /** Extra charge per person per night above baseOccupancy (0 = no surcharge) */
  extraPersonFee: number
  /** Hero image path */
  heroImage: string
  /** Breadcrumb trail leading to this booking page */
  breadcrumb: Array<{ label: string; href: string }>
  /** Back-link to the property detail page */
  propertyHref: string
  /** Visual theme */
  theme: 'dark' | 'light'
}

export const PROPERTY_CONFIGS: Record<string, PropertyBookingConfig> = {
  haus28: {
    id: 'haus28',
    name: 'HAUS28',
    subtitle: 'Modernes A-Frame im Bayerischen Wald',
    smoobuIdEnvKey: 'SMOOBU_APARTMENT_ID_HAUS28',
    smoobuIdFallback: '2610828',
    maxGuests: 8,
    minStay: 2,
    cleaningFee: 120,
    priceFrom: 199,
    baseOccupancy: 4,
    extraPersonFee: 29,
    heroImage: '/images/haus28/hero.webp',
    breadcrumb: [{ label: 'HAUS28', href: '/haus28' }],
    propertyHref: '/haus28',
    theme: 'dark',
  },
  b5: {
    id: 'b5',
    name: 'Apartment B5',
    subtitle: 'Panorama-Apartment · Haus Schönblick',
    smoobuIdEnvKey: 'SMOOBU_APARTMENT_ID_B5',
    smoobuIdFallback: '3025621',
    maxGuests: 4,
    minStay: 2,
    cleaningFee: 65,
    priceFrom: 95,
    baseOccupancy: 2,
    extraPersonFee: 15,
    heroImage: '/images/schoenblick/b5/hero.webp',
    breadcrumb: [
      { label: 'Haus Schönblick', href: '/schoenblick' },
      { label: 'Apartment B5', href: '/schoenblick/b5' },
    ],
    propertyHref: '/schoenblick/b5',
    theme: 'light',
  },
  b6: {
    id: 'b6',
    name: 'Apartment B6',
    subtitle: 'Panorama-Apartment · Haus Schönblick',
    smoobuIdEnvKey: 'SMOOBU_APARTMENT_ID_B6',
    smoobuIdFallback: '2934141',
    maxGuests: 4,
    minStay: 2,
    cleaningFee: 65,
    priceFrom: 95,
    baseOccupancy: 2,
    extraPersonFee: 15,
    heroImage: '/images/schoenblick/b6/hero.webp',
    breadcrumb: [
      { label: 'Haus Schönblick', href: '/schoenblick' },
      { label: 'Apartment B6', href: '/schoenblick/b6' },
    ],
    propertyHref: '/schoenblick/b6',
    theme: 'light',
  },
  b8: {
    id: 'b8',
    name: 'Apartment B8',
    subtitle: 'Panorama-Apartment · Haus Schönblick',
    smoobuIdEnvKey: 'SMOOBU_APARTMENT_ID_B8',
    smoobuIdFallback: '3025606',
    maxGuests: 4,
    minStay: 2,
    cleaningFee: 65,
    priceFrom: 95,
    baseOccupancy: 2,
    extraPersonFee: 15,
    heroImage: '/images/schoenblick/b8/hero.webp',
    breadcrumb: [
      { label: 'Haus Schönblick', href: '/schoenblick' },
      { label: 'Apartment B8', href: '/schoenblick/b8' },
    ],
    propertyHref: '/schoenblick/b8',
    theme: 'light',
  },
  a2: {
    id: 'a2',
    name: 'Apartment A2',
    subtitle: 'Panorama-Apartment · Haus Schönblick',
    smoobuIdEnvKey: 'SMOOBU_APARTMENT_ID_A2',
    smoobuIdFallback: '2934161',
    maxGuests: 4,
    minStay: 2,
    cleaningFee: 65,
    priceFrom: 95,
    baseOccupancy: 2,
    extraPersonFee: 15,
    heroImage: '/images/schoenblick/a2/hero.webp',
    breadcrumb: [
      { label: 'Haus Schönblick', href: '/schoenblick' },
      { label: 'Apartment A2', href: '/schoenblick/a2' },
    ],
    propertyHref: '/schoenblick/a2',
    theme: 'light',
  },
}

/** Resolve Smoobu apartment ID: env var wins, then fallback */
export function resolveSmoobuId(config: PropertyBookingConfig): string {
  return process.env[config.smoobuIdEnvKey] ?? config.smoobuIdFallback
}
