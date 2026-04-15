import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "SARFI Collection – Ferienunterkünfte im Bayerischen Wald";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function fetchFontBase64(family: string, weight: number): Promise<string> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
  const css = await fetch(cssUrl, {
    headers: { "User-Agent": "Mozilla/5.0" },
  }).then((r) => r.text());
  const url =
    css.match(/src:\s*url\(([^)]+)\)\s*format\('truetype'\)/)?.[1] ??
    css.match(/src:\s*url\(([^)]+)\)/)?.[1];
  if (!url) throw new Error(`Font URL not found for ${family}`);
  const buf = await fetch(url).then((r) => r.arrayBuffer());
  return Buffer.from(buf).toString("base64");
}

export default async function Image() {
  const [imgData, cormorantB64, dmSansB64] = await Promise.all([
    readFile(join(process.cwd(), "public/images/haus28/og-bg.jpg")),
    fetchFontBase64("Cormorant Garamond", 400),
    fetchFontBase64("DM Sans", 300),
  ]);

  const imgBase64 = `data:image/jpeg;base64,${imgData.toString("base64")}`;

  // Build self-contained SVG with embedded fonts matching SarfiLogo.tsx exactly
  // ViewBox: -30 0 460 290 (width=460, height=290)
  const svgContent = `<svg viewBox="-30 0 460 290" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Cormorant Garamond';
        font-weight: 400;
        src: url('data:font/truetype;base64,${cormorantB64}') format('truetype');
      }
      @font-face {
        font-family: 'DM Sans';
        font-weight: 300;
        src: url('data:font/truetype;base64,${dmSansB64}') format('truetype');
      }
    </style>
    <clipPath id="top" clipPathUnits="userSpaceOnUse">
      <rect x="-30" y="0" width="460" height="162"/>
    </clipPath>
    <clipPath id="bot" clipPathUnits="userSpaceOnUse">
      <rect x="-30" y="195" width="460" height="95"/>
    </clipPath>
  </defs>
  <text clip-path="url(#top)" x="0" y="272"
    font-family="'Cormorant Garamond', Georgia, serif"
    font-weight="400" font-size="320"
    textLength="200" lengthAdjust="spacingAndGlyphs"
    fill="#F5F0E8">S</text>
  <text clip-path="url(#top)" x="175" y="272"
    font-family="'Cormorant Garamond', Georgia, serif"
    font-weight="400" font-size="320"
    textLength="200" lengthAdjust="spacingAndGlyphs"
    fill="#F5F0E8">C</text>
  <text x="200" y="188" text-anchor="middle"
    font-family="'DM Sans', system-ui, sans-serif"
    font-weight="300" font-size="30" letter-spacing="11"
    fill="#F5F0E8">SARFI COLLECTION</text>
  <text clip-path="url(#bot)" x="0" y="272"
    font-family="'Cormorant Garamond', Georgia, serif"
    font-weight="400" font-size="320"
    textLength="200" lengthAdjust="spacingAndGlyphs"
    fill="#F5F0E8">S</text>
  <text clip-path="url(#bot)" x="175" y="272"
    font-family="'Cormorant Garamond', Georgia, serif"
    font-weight="400" font-size="320"
    textLength="200" lengthAdjust="spacingAndGlyphs"
    fill="#F5F0E8">C</text>
</svg>`;

  const svgDataUri = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString("base64")}`;

  // Logo display size in the OG image
  const logoH = 380;
  const logoW = Math.round((460 / 290) * logoH); // ≈ 601

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          backgroundColor: "#1a2416",
        }}
      >
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgBase64}
          alt=""
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            objectFit: "cover",
          }}
        />
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            background:
              "linear-gradient(to bottom, rgba(15,25,12,0.55) 0%, rgba(15,25,12,0.70) 100%)",
            display: "flex",
          }}
        />
        {/* Logo as self-contained SVG img */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "630px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={svgDataUri}
            alt="SARFI Collection"
            width={logoW}
            height={logoH}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
