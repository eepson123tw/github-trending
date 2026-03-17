"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import { useI18n } from "@/lib/i18n-context";

export default function HeroSection() {
  const { t } = useI18n();

  const STATS = [
    { label: t("statDays"), value: 354, suffix: " days" },
    { label: t("statRepos"), value: 4995, suffix: "" },
    { label: t("statCategories"), value: 15, suffix: "" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 text-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 0.6, letterSpacing: "0.3em" }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-xs uppercase tracking-widest text-indigo-400 mb-4"
        >
          {t("heroSubtitle")}
        </motion.p>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
          <span className="bg-linear-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            {t("heroTitle")}
          </span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-white/90 text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-light"
          >
            {t("heroDesc")}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto whitespace-pre-line"
        >
          {t("heroBody")}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative z-10 mt-10 sm:mt-16 flex gap-6 sm:gap-8 md:gap-16"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.4 + i * 0.15, type: "spring" }}
            className="text-center"
          >
            <div className="text-2xl sm:text-3xl md:text-5xl font-bold bg-linear-to-b from-white to-white/50 bg-clip-text text-transparent">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-xs md:text-sm text-slate-500 mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-500">{t("scrollToExplore")}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-indigo-400/60">
            <path d="M10 3 L10 17 M4 11 L10 17 L16 11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
