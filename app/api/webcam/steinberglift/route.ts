import { NextResponse } from "next/server";
import { ausflugszieleMaterial } from "@/data/ausflugsziele-bildmaterial";

// Reicht das Live-Bild der Steinberglift-Webcam serverseitig durch, damit
// die IP der Besucher nicht an den Webcam-Host geht (DSGVO, siehe
// data/ausflugsziele-bildmaterial.ts). Upstream höchstens alle 5 Minuten.

const WEBCAM = ausflugszieleMaterial["skigebiet-sonnenwald"].webcam;

export async function GET() {
  if (!WEBCAM) return new NextResponse(null, { status: 404 });
  try {
    const res = await fetch(WEBCAM.bild, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webcam upstream ${res.status}`);
    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      },
    });
  } catch {
    // Platzhalter übernimmt der Client (SteinbergliftWebcam), hier nur Status.
    return new NextResponse(null, {
      status: 503,
      headers: { "Cache-Control": "public, max-age=60" },
    });
  }
}
