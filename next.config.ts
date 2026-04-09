import type { NextConfig } from "next";

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
      // Scripts: own + Stripe + Google Pay
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://pay.google.com",
      // Styles: own + inline (Tailwind generates inline styles)
      "style-src 'self' 'unsafe-inline'",
      // Images: own + data URIs + Stripe
      "img-src 'self' data: https://*.stripe.com https://images.unsplash.com",
      // Fonts: own origin
      "font-src 'self'",
      // Connect: own API + Stripe + Smoobu + PriceLabs
      "connect-src 'self' https://api.stripe.com https://login.smoobu.com https://api.pricelabs.co",
      // Stripe payment UI runs in iframes
      "frame-src https://js.stripe.com https://hooks.stripe.com https://pay.google.com",
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
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
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
