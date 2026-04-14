import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontFamily: "Georgia, serif",
          color: "#F5F0E8",
          fontSize: 19,
          fontWeight: 400,
          letterSpacing: -2,
        }}
      >
        SC
      </div>
    ),
    { ...size },
  );
}
