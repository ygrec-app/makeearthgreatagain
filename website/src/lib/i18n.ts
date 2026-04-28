import { translations } from "./localization";

export type Locale = "en" | "fr";

export const locales: Locale[] = ["en", "fr"];

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "en" || value === "fr";
}

export function t(locale: Locale, key: keyof (typeof translations)["en"]): string {
  const dict = translations[locale] ?? translations.en;
  return (dict as Record<string, string>)[key] ?? "";
}

export function getStoredLocale(): Locale {
  if (typeof localStorage === "undefined") return "en";
  const v = localStorage.getItem("mega:lang");
  return isLocale(v) ? v : "en";
}

export function setStoredLocale(locale: Locale): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("mega:lang", locale);
  document.documentElement.lang = locale;
  document.dispatchEvent(new CustomEvent("mega:lang-change", { detail: { locale } }));
}
