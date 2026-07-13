import type { NextConfig } from "next";
import path from "node:path";

const securityHeaders = [
  // Force HTTPS for 1 year (including subdomains)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Prevent clickjacking – page may not be embedded in iframes
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Disable MIME type sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Only send referrer on same-origin requests
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Limit browser features (camera, mic, etc.)
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
  // Content Security Policy
  // Allows: own origin, Stripe.js, Google Pay, Apple Pay
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: own + Stripe + Google Pay + Vercel Analytics + Cloudflare Turnstile
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://pay.google.com https://va.vercel-scripts.com https://challenges.cloudflare.com",
      // Styles: own + inline (Tailwind generates inline styles)
      "style-src 'self' 'unsafe-inline'",
      // Images: own + data URIs + Stripe
      "img-src 'self' data: https://*.stripe.com https://images.unsplash.com",
      // Fonts: own origin
      "font-src 'self'",
      // Connect: own API + Stripe + Smoobu + PriceLabs + Vercel Analytics/Speed Insights
      "connect-src 'self' https://api.stripe.com https://login.smoobu.com https://api.pricelabs.co https://va.vercel-scripts.com https://vitals.vercel-insights.com",
      // Stripe payment UI + Cloudflare Turnstile run in iframes
      "frame-src https://js.stripe.com https://hooks.stripe.com https://pay.google.com https://www.openstreetmap.org https://challenges.cloudflare.com",
      // No object/embed elements allowed
      "object-src 'none'",
      // Base tag restricted to own origin
      "base-uri 'self'",
      // Forms may only submit to own origin
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Schlanker, selbst-hostbarer Server-Output (server.js + minimales node_modules)
  // für den Docker/Sliplane-Betrieb. Von Vercel ignoriert — dort unschädlich.
  output: "standalone",
  // Root für das File-Tracing FEST auf diesen App-Ordner. Sonst rät Next wegen
  // mehrerer package-lock.json in übergeordneten Verzeichnissen die Workspace-
  // Wurzel falsch und verschachtelt den standalone-Output (…/standalone/Desktop/…)
  // statt server.js direkt unter .next/standalone/ abzulegen.
  outputFileTracingRoot: path.resolve(),
  async redirects() {
    return [
      // Apex → www (kanonische Domain). Auf Vercel machte das die Plattform
      // automatisch; self-hosted muss die App selbst umleiten.
      {
        source: "/:path*",
        destination: "https://www.sarfi-collection.de/:path*",
        permanent: true,
        has: [{ type: "host", value: "sarfi-collection.de" }],
      },
      // haus28.com → /haus28
      {
        source: "/(.*)",
        destination: "https://www.sarfi-collection.de/haus28",
        permanent: true,
        has: [{ type: "host", value: "haus28.com" }],
      },
      {
        source: "/(.*)",
        destination: "https://www.sarfi-collection.de/haus28",
        permanent: true,
        has: [{ type: "host", value: "www.haus28.com" }],
      },
      // buechelstein.com → /haus28
      {
        source: "/(.*)",
        destination: "https://www.sarfi-collection.de/haus28",
        permanent: true,
        has: [{ type: "host", value: "buechelstein.com" }],
      },
      {
        source: "/(.*)",
        destination: "https://www.sarfi-collection.de/haus28",
        permanent: true,
        has: [{ type: "host", value: "www.buechelstein.com" }],
      },
      // ferienhaus-schoenblick.de → /schoenblick
      {
        source: "/(.*)",
        destination: "https://www.sarfi-collection.de/schoenblick",
        permanent: true,
        has: [{ type: "host", value: "ferienhaus-schoenblick.de" }],
      },
      {
        source: "/(.*)",
        destination: "https://www.sarfi-collection.de/schoenblick",
        permanent: true,
        has: [{ type: "host", value: "www.ferienhaus-schoenblick.de" }],
      },
      // /stornierung → /agb#stornierung (301)
      {
        source: "/stornierung",
        destination: "/agb#stornierung",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Vorberechnete Bild-Varianten (scripts/optimize-images): 1 Tag Cache +
        // 7 Tage stale-while-revalidate. Kein `immutable`, weil die Dateinamen
        // nicht content-gehasht sind (Bildtausch behält die URL).
        source: "/img-opt/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  images: {
    // Statt on-demand-Optimierung (/_next/image, sharp auf der 1-vCPU-Prod-VM):
    // beim Build vorberechnete statische Varianten (scripts/optimize-images.mjs
    // → public/img-opt), zugeordnet über den Custom-Loader. Breiten-Stufen
    // müssen mit WIDTHS im Skript und STEPS im Loader übereinstimmen.
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // i18n prepared – activate when ready
  // i18n: {
  //   locales: ['de', 'en'],
  //   defaultLocale: 'de',
  // },
};

export default nextConfig;
