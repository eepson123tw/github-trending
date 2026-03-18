"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations, type Locale, type TranslationKey } from "./i18n";

function detectLocale(): Locale {
  if (typeof window === "undefined") return "zh-TW";
  const lang = navigator.language;
  if (lang.startsWith("zh")) {
    // zh-CN, zh-SG, zh-Hans → 简中；其餘 (zh-TW, zh-HK, zh-Hant) → 繁中
    return /CN|SG|Hans/i.test(lang) ? "zh-CN" : "zh-TW";
  }
  return "en";
}

interface I18nContextType {
  locale: Locale;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(detectLocale);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) => {
      let text: string = translations[locale][key] || key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          text = text.replaceAll(`{{${k}}}`, String(v));
        }
      }
      return text;
    },
    [locale]
  );

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const order: Locale[] = ["zh-TW", "zh-CN", "en"];
      return order[(order.indexOf(prev) + 1) % order.length];
    });
  }, []);

  return (
    <I18nContext.Provider value={{ locale, t, toggleLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
