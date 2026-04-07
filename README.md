# SARFI Collection Website

Multi-Property Ferienunterkunft-Website für **HAUS28** und **Haus Schönblick** im Bayerischen Wald.

**Tech Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion

---

## Setup

```bash
# 1. Dependencies installieren
npm install

# 2. Dev-Server starten
npm run dev
# → http://localhost:3000

# 3. Production Build
npm run build
npm start
```

---

## Seitenstruktur

| URL | Beschreibung |
|---|---|
| `/` | Homepage (SARFI Collection Übersicht) |
| `/haus28` | HAUS28 Detailseite |
| `/haus28/buchen` | Buchungsseite HAUS28 (Smoobu) |
| `/schoenblick` | Haus Schönblick Übersicht (alle 4 Apartments) |
| `/schoenblick/b5` | Apartment B5 Detail |
| `/schoenblick/b6` | Apartment B6 Detail |
| `/schoenblick/b8` | Apartment B8 Detail |
| `/schoenblick/a2` | Apartment A2 Detail |
| `/schoenblick/buchen` | Buchungsseite Schönblick (Smoobu) |
| `/ueber-uns` | Über SARFI Collection |
| `/kontakt` | Kontaktformular + FAQ |
| `/impressum` | Impressum |
| `/datenschutz` | Datenschutzerklärung |

---

## TODO-Checkliste

### Pflicht vor Go-Live

- [ ] **Smoobu Property-IDs eintragen** → `data/properties.ts` (Felder `smoobuPropertyId` bei allen Apartments auf `"TODO"` setzen)
- [ ] **Echte Fotos ersetzen** → alle `images.hero`, `images.gallery[].src` in `data/properties.ts` (siehe Abschnitt Fotos)
- [ ] **Eckdaten prüfen** → Gäste, Schlafzimmer, Badezimmer, Fläche, Ab-Preis für alle Unterkünfte in `data/properties.ts`
- [ ] **Bewertungen aktualisieren** → `airbnbRating`, `airbnbReviewCount` in `data/properties.ts`
- [ ] **Echte Reviews eintragen** → `data/reviews.ts` (aktuell Platzhalter)
- [ ] **Impressum ausfüllen** → `app/impressum/page.tsx` (Name, Adresse, ggf. USt-ID)
- [ ] **Datenschutzerklärung** → `app/datenschutz/page.tsx` – von Anwalt prüfen lassen!
- [ ] **E-Mail-Adresse eintragen** → `components/layout/Footer.tsx` + `app/kontakt/page.tsx`
- [ ] **Kontaktformular verbinden** → `app/kontakt/page.tsx` – Backend (Resend, Formspree, o.ä.) integrieren
- [ ] **GPS-Koordinaten** → `haus28.coordinates` und `schoenblick.coordinates` in `data/properties.ts`
- [ ] **Google Search Console** → Token in `app/layout.tsx` (`verification.google`) eintragen
- [ ] **OG-Image erstellen** → `/public/og-image.jpg` (1200×630px) für Social Sharing
- [ ] **Instagram-Link** → `components/layout/Footer.tsx`
- [ ] **Cookie-Banner** → Analytics-Integration nach Consent in `components/layout/CookieBanner.tsx`

### Optional / Nice to Have

- [ ] Google Analytics / Plausible nach Cookie-Consent initialisieren
- [ ] i18n aktivieren (DE/EN) → `next.config.ts` hat Kommentar
- [ ] Service Worker / PWA für Offline-Grundfunktion
- [ ] Lazy-Loading für Google Maps (nur nach Consent laden)

---

## Fotos einbinden

1. Fotos als WebP optimieren (empfohlen: [Squoosh](https://squoosh.app/) oder `cwebp`)
2. Ablegen in `public/images/`:
   ```
   public/images/
   ├── haus28/
   │   ├── hero.webp          ← Außenansicht (mind. 1920×1080)
   │   ├── thumbnail.webp     ← Vorschau (800×600)
   │   └── gallery/
   │       ├── 01.webp
   │       ├── 02.webp
   │       └── ...
   ├── schoenblick/
   │   ├── hero.webp
   │   ├── thumbnail.webp
   │   ├── b5/gallery/*.webp
   │   ├── b6/gallery/*.webp
   │   ├── b8/gallery/*.webp
   │   └── a2/gallery/*.webp
   └── shared/
       ├── region/*.webp
       └── logos/*.svg
   ```
3. Pfade in `data/properties.ts` anpassen:
   ```ts
   images: {
     hero: "/images/haus28/hero.webp",    // war: unsplash URL
     thumbnail: "/images/haus28/thumbnail.webp",
     gallery: [
       { src: "/images/haus28/gallery/01.webp", alt: "HAUS28 Außenansicht" },
       ...
     ]
   }
   ```
4. `{/* TODO: Replace with actual photo */}` Kommentare im Code entfernen

---

## Smoobu-Integration

### HAUS28

Die Smoobu Property-ID ist bereits eingetragen: `"1163278"`. Das Embed-Widget lädt automatisch.

Falls die Widget-Integration Probleme bereitet, kann der originale HTML-Code direkt in `components/property/SmoobuBookingWidget.tsx` eingebunden werden:

```html
<div id="apartmentIframeAll">
  <script type="text/javascript" src="https://login.smoobu.com/js/Settings/BookingToolIframe.js"></script>
  <script>
    BookingToolIframe.initialize({
      "url": "https://login.smoobu.com/de/booking-tool/iframe/1163278",
      "baseUrl": "https://login.smoobu.com",
      "target": "#apartmentIframeAll"
    })
  </script>
</div>
```

### Haus Schönblick

Property-IDs für die 4 Apartments in `data/properties.ts` eintragen:
```ts
schoenblick.apartments.b5.smoobuPropertyId = "..."
schoenblick.apartments.b6.smoobuPropertyId = "..."
schoenblick.apartments.b8.smoobuPropertyId = "..."
schoenblick.apartments.a2.smoobuPropertyId = "..."
```

---

## Deployment auf Vercel (empfohlen)

1. Repository auf GitHub pushen
2. [vercel.com](https://vercel.com) → "New Project" → GitHub-Repo auswählen
3. Framework: **Next.js** (wird automatisch erkannt)
4. **Umgebungsvariablen** (falls später benötigt): in Vercel Settings eintragen
5. Deploy → automatisch bei jedem Push auf `main`

### Domain-Konfiguration in Vercel

| Domain | Ziel |
|---|---|
| `www.sarfi-collection.de` | Hauptprojekt |
| `www.haus28.com` | Redirect → `sarfi-collection.de/haus28` |
| `www.ferienhaus-schoenblick.de` | Redirect → `sarfi-collection.de/schoenblick` |
| `www.sarfi.group` | Redirect → `sarfi-collection.de` |
| `www.buechelstein.com` | Redirect → `sarfi-collection.de/haus28` |

Redirects in Vercel unter "Domains" → "Redirect" konfigurieren.

---

## Projekt-Struktur

```
/
├── app/                      # Next.js App Router Pages
│   ├── layout.tsx            # Root Layout (Fonts, Header, Footer)
│   ├── page.tsx              # Homepage
│   ├── haus28/
│   │   ├── page.tsx          # HAUS28 Detailseite
│   │   └── buchen/page.tsx   # Buchungsseite
│   ├── schoenblick/
│   │   ├── page.tsx          # Übersicht
│   │   ├── b5/page.tsx       # Apartment Detail
│   │   ├── b6/page.tsx
│   │   ├── b8/page.tsx
│   │   ├── a2/page.tsx
│   │   └── buchen/page.tsx
│   ├── ueber-uns/page.tsx
│   ├── kontakt/page.tsx
│   ├── impressum/page.tsx
│   ├── datenschutz/page.tsx
│   ├── sitemap.ts            # Auto-Sitemap
│   ├── robots.ts             # robots.txt
│   └── not-found.tsx         # 404 Seite
├── components/
│   ├── layout/               # Header, Footer, CookieBanner
│   ├── home/                 # Homepage Sektionen
│   ├── property/             # Wiederverwendbare Unterkunft-Komponenten
│   └── ui/                   # Button, Icons
├── data/
│   ├── properties.ts         # ← ZENTRALE DATEI (hier alles editieren)
│   └── reviews.ts            # Gästebewertungen
├── public/
│   └── images/               # Fotos (TODO: echte Fotos ablegen)
├── tailwind.config.ts        # Design-System (Farben, Fonts)
└── next.config.ts            # Next.js Konfiguration
```

---

## Design-System

**Farben** (in `tailwind.config.ts`):
- `forest-*` – Dunkelgrüne Primärpalette (Wald)
- `cream-*` – Helles Off-White/Creme
- `gold-*` – Warmes Gold (Akzent/CTA)

**Fonts**:
- Headlines: **Cormorant Garamond** (Display, elegant)
- Body: **DM Sans** (Clean, modern)

**CTAs** immer in `gold-500` (`bg-gold-500 text-forest-900`)
