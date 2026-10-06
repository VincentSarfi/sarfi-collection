import { Cormorant_Garamond, DM_Sans } from "next/font/google";

// Von beiden Root-Layouts – (de) und (en) – gemeinsam genutzt.
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  // Nur normal: Die Kursive wird nirgends genutzt, wurde aber auf jeder Seite
  // vorgeladen (~37 KB im kritischen Pfad).
  style: ["normal"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
  preload: true,
});
