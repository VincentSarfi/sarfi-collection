import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Lädt Cormorant Garamond als TTF (gleiches Muster wie app/opengraph-image.tsx),
// damit das Monogramm der Display-Schrift der Website entspricht.
async function fetchFont(family: string, weight: number): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
  const css = await fetch(cssUrl, {
    headers: { "User-Agent": "Mozilla/5.0" },
  }).then((r) => r.text());
  const url =
    css.match(/src:\s*url\(([^)]+)\)\s*format\('truetype'\)/)?.[1] ??
    css.match(/src:\s*url\(([^)]+)\)/)?.[1];
  if (!url) throw new Error(`Font URL not found for ${family}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function Icon() {
  const cormorant = await fetchFont("Cormorant Garamond", 400);

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1C2E1C",
          borderRadius: 6,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: "#F5F0E8",
          fontSize: 19,
          fontWeight: 400,
          letterSpacing: -2,
        }}
      >
        SC
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Cormorant Garamond",
          data: cormorant,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
