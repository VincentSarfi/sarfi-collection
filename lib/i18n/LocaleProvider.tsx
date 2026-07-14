"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>("de");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** Aktuelle Locale in Client-Komponenten (Default: de). */
export function useLocale(): Locale {
  return useContext(LocaleContext);
}
