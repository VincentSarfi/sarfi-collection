// ESLint-Flat-Config (eslint-config-next 16 kennt kein .eslintrc mehr).
// Entspricht dem früheren "extends": ["next/core-web-vitals", "next/typescript"].
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "public/**"]),
]);
