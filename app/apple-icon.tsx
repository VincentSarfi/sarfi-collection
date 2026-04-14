import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1C2E1C",
          borderRadius: 32,
          fontFamily: "Georgia, serif",
          color: "#F5F0E8",
          fontSize: 108,
          fontWeight: 400,
          letterSpacing: -10,
        }}
      >
        SC
      </div>
    ),
    { ...size },
  );
}
