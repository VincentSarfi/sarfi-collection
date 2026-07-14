import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "HAUS28 – A-Frame Ferienhaus im Bayerischen Wald";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

export default async function Image() {
  const [cormorant, dmSans] = await Promise.all([
    fetchFont("Cormorant Garamond", 600),
    fetchFont("DM Sans", 300),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b1a10",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", fontFamily: "DM Sans", fontSize: 26, letterSpacing: 12, color: "#e0b352" }}>
          SARFI COLLECTION
        </div>
        <div style={{ display: "flex", fontFamily: "Cormorant Garamond", fontSize: 104, color: "#fdfaf5", marginTop: 20 }}>
          HAUS28
        </div>
        <div style={{ display: "flex", fontFamily: "DM Sans", fontSize: 34, color: "#fdfaf5", opacity: 0.82, marginTop: 8, textAlign: "center" }}>
          A-Frame Ferienhaus im Bayerischen Wald
        </div>
        <div style={{ width: "80px", height: "3px", backgroundColor: "#e0b352", marginTop: 36 }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant Garamond", data: cormorant, weight: 600, style: "normal" },
        { name: "DM Sans", data: dmSans, weight: 300, style: "normal" },
      ],
    }
  );
}
