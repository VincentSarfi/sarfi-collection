import de from "./de";
import en from "./en";

/** Deutsch ist die Referenz: en muss strukturell dieselben Schlüssel liefern. */
export type Dictionary = typeof de;

export const dictionaries: Record<"de" | "en", Dictionary> = { de, en };
