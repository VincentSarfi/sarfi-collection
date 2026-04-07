import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette – "Luxury meets Nature"
        forest: {
          50:  "#f0f5f1",
          100: "#d8e8db",
          200: "#b2d1b8",
          300: "#84b38d",
          400: "#579165",
          500: "#3a6e47",
          600: "#2c5436",
          700: "#1e3d27",
          800: "#142a1b",
          900: "#0b1a10",
        },
        cream: {
          50:  "#fdfaf5",
          100: "#f9f3e6",
          200: "#f2e7cc",
          300: "#e8d5a8",
          400: "#dcc07f",
          500: "#cfa95a",
        },
        gold: {
          300: "#e5ca7a",
          400: "#d4b05a",
          500: "#c9a84c",
          600: "#a8883c",
          700: "#85692e",
        },
        // Per-property accent overrides applied via CSS vars
        property: {
          bg:   "var(--property-bg)",
          text: "var(--property-text)",
          accent:"var(--property-accent)",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body:    ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 3rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "gradient-overlay": "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 100%)",
        "gradient-hero":    "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
      },
      animation: {
        "fade-up":   "fadeUp 0.6s ease forwards",
        "fade-in":   "fadeIn 0.5s ease forwards",
        "shimmer":   "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      aspectRatio: {
        "4/3":    "4 / 3",
        "16/9":   "16 / 9",
        "3/2":    "3 / 2",
        "square": "1 / 1",
      },
      boxShadow: {
        "card":    "0 2px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        "card-lg": "0 8px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
        "cta":     "0 4px 24px rgba(201,168,76,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
