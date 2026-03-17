"use client";

import { useI18n } from "@/lib/i18n-context";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="relative py-8 sm:py-12 px-4 sm:px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-slate-500">
          {t("footerData")}{" "}
          <a
            href="https://github.com/trending"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            GitHub Trending
          </a>{" "}
          &middot; 2025-03-27 ~ 2026-03-15
        </p>
        <p className="text-xs text-slate-600 mt-2">
          {t("footerBuilt")}
        </p>
      </div>
    </footer>
  );
}
