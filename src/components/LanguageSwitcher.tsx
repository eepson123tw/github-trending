"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";

export default function LanguageSwitcher() {
  const { locale, toggleLocale } = useI18n();

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      onClick={toggleLocale}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-3 sm:right-4 bottom-3 sm:bottom-4 z-50 glass-card px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium transition-colors hover:text-white text-slate-400"
      style={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      {locale === "zh-TW" ? "EN" : "中文"}
    </motion.button>
  );
}
