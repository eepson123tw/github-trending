"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";

export default function LanguageSwitcher() {
  const { locale, toggleLocale } = useI18n();
  const [starred, setStarred] = useState(false);

  return (
    <div className="fixed right-3 sm:right-4 bottom-3 sm:bottom-4 z-50 flex flex-col items-end gap-2">
      {/* GitHub star */}
      <motion.a
        href="https://github.com/eepson123tw/github-trending"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setStarred(true)}
        className="group relative overflow-hidden rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 text-[11px] sm:text-xs font-semibold"
        style={{
          background: "linear-gradient(135deg, rgba(234,179,8,0.15), rgba(251,191,36,0.08))",
          border: "1px solid rgba(234,179,8,0.3)",
          boxShadow: "0 4px 24px rgba(234,179,8,0.15), 0 0 0 1px rgba(234,179,8,0.05)",
          color: "#fbbf24",
        }}
      >
        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 40%, rgba(251,191,36,0.15) 50%, transparent 60%)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        />

        {/* Star icon */}
        <motion.svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          className="relative shrink-0"
          animate={starred ? {} : { rotate: [0, -12, 12, -8, 8, 0] }}
          transition={{ duration: 0.6, delay: 3, repeat: Infinity, repeatDelay: 5 }}
        >
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </motion.svg>

        <span className="relative">Star</span>

        {/* Hover glow ring */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: "inset 0 0 12px rgba(251,191,36,0.2), 0 0 20px rgba(234,179,8,0.25)",
          }}
        />

        {/* Sparkle particles on hover */}
        <AnimatePresence>
          {starred && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ background: "#fbbf24", left: "50%", top: "50%" }}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i / 6) * Math.PI * 2) * 28,
                    y: Math.sin((i / 6) * Math.PI * 2) * 28,
                    opacity: [1, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.a>

      {/* Subtle pulse ring behind star button */}
      <motion.div
        className="absolute right-3 sm:right-4 pointer-events-none"
        style={{ bottom: "calc(100% - 0.5rem)", width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        <motion.div
          className="rounded-xl"
          style={{
            width: "calc(100% - 1px)",
            height: "calc(100% - 1px)",
            border: "1px solid rgba(234,179,8,0.2)",
          }}
          animate={{ opacity: [0, 0.5, 0], scale: [1, 1.15, 1.15] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
        />
      </motion.div>

      {/* Language toggle */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={toggleLocale}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="glass-card px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium transition-colors hover:text-white text-slate-400"
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
    </div>
  );
}
