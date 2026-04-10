"use client";
import { useId } from "react";

interface SarfiLogoProps {
  /** "light" = cremeweiß für dunklen Hintergrund, "dark" = dunkel für hellen Hintergrund */
  variant?: "light" | "dark";
  /** Nur das SC-Monogramm ohne "SARFI COLLECTION"-Text (z.B. für den Header) */
  markOnly?: boolean;
  className?: string;
}

export default function SarfiLogo({
  variant = "light",
  markOnly = false,
  className = "",
}: SarfiLogoProps) {
  const uid = useId().replace(/[^a-z0-9]/gi, "x");
  const fill = variant === "light" ? "#F5F0E8" : "#1C2E1C";

  // Layout-Konstanten
  const fs = 320;       // font-size für S und C
  const bl = 272;       // Baseline der Buchstaben
  const sX = 0;         // S x-Position
  const cX = 175;       // C x-Position
  const textY = 188;    // Baseline des Mitteltexts
  const topCut = 162;   // Obere Clip-Grenze (knapp über dem Text)
  const botCut = 195;   // Untere Clip-Grenze (knapp unter dem Text)

  // ViewBox 30px seitlich erweitert → Text ragt über S und C hinaus
  const vbX = -30;
  const vbW = 460;

  const topId = `st${uid}`;
  const botId = `sb${uid}`;

  // markOnly: ViewBox zeigt nur den Buchstabenbereich (ohne Rand oben/unten)
  const viewBox = markOnly ? `${vbX} 38 ${vbW} 252` : `${vbX} 0 ${vbW} 290`;

  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={markOnly ? "SC Monogramm" : "SARFI Collection"}
      role="img"
    >
      <defs>
        <clipPath id={topId} clipPathUnits="userSpaceOnUse">
          <rect x={vbX} y="0" width={vbW} height={topCut} />
        </clipPath>
        <clipPath id={botId} clipPathUnits="userSpaceOnUse">
          <rect x={vbX} y={botCut} width={vbW} height={290 - botCut} />
        </clipPath>
      </defs>

      {/* S — obere Hälfte */}
      <text
        clipPath={`url(#${topId})`}
        x={sX}
        y={bl}
        fontFamily="var(--font-cormorant), 'Cormorant Garamond', Georgia, serif"
        fontWeight="400"
        fontSize={fs}
        textLength="200"
        lengthAdjust="spacingAndGlyphs"
        fill={fill}
      >
        S
      </text>

      {/* C — obere Hälfte */}
      <text
        clipPath={`url(#${topId})`}
        x={cX}
        y={bl}
        fontFamily="var(--font-cormorant), 'Cormorant Garamond', Georgia, serif"
        fontWeight="400"
        fontSize={fs}
        textLength="200"
        lengthAdjust="spacingAndGlyphs"
        fill={fill}
      >
        C
      </text>

      {/* Mitteltext: SARFI COLLECTION */}
      {!markOnly && (
        <text
          x="200"
          y={textY}
          textAnchor="middle"
          fontFamily="var(--font-dm-sans), 'DM Sans', system-ui, sans-serif"
          fontWeight="300"
          fontSize="30"
          letterSpacing="11"
          fill={fill}
        >
          SARFI COLLECTION
        </text>
      )}

      {/* S — untere Hälfte */}
      <text
        clipPath={`url(#${botId})`}
        x={sX}
        y={bl}
        fontFamily="var(--font-cormorant), 'Cormorant Garamond', Georgia, serif"
        fontWeight="400"
        fontSize={fs}
        textLength="200"
        lengthAdjust="spacingAndGlyphs"
        fill={fill}
      >
        S
      </text>

      {/* C — untere Hälfte */}
      <text
        clipPath={`url(#${botId})`}
        x={cX}
        y={bl}
        fontFamily="var(--font-cormorant), 'Cormorant Garamond', Georgia, serif"
        fontWeight="400"
        fontSize={fs}
        textLength="200"
        lengthAdjust="spacingAndGlyphs"
        fill={fill}
      >
        C
      </text>
    </svg>
  );
}
