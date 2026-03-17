"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";
import type { TranslationKey } from "@/lib/i18n";

const INSIGHTS: {
  icon: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  gradient: string;
  border: string;
}[] = [
  {
    icon: "\u{1F916}",
    titleKey: "insight1Title",
    descKey: "insight1Desc",
    gradient: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/20",
  },
  {
    icon: "\u{1F50C}",
    titleKey: "insight2Title",
    descKey: "insight2Desc",
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/20",
  },
  {
    icon: "\u{1F9E0}",
    titleKey: "insight3Title",
    descKey: "insight3Desc",
    gradient: "from-green-500/20 to-teal-500/20",
    border: "border-green-500/20",
  },
  {
    icon: "\u{1F4CA}",
    titleKey: "insight4Title",
    descKey: "insight4Desc",
    gradient: "from-emerald-500/20 to-cyan-500/20",
    border: "border-emerald-500/20",
  },
  {
    icon: "\u{1F4B0}",
    titleKey: "insight5Title",
    descKey: "insight5Desc",
    gradient: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/20",
  },
  {
    icon: "\u{1F1E8}\u{1F1F3}",
    titleKey: "insight6Title",
    descKey: "insight6Desc",
    gradient: "from-rose-500/20 to-red-500/20",
    border: "border-rose-500/20",
  },
];

export default function InsightCards() {
  const { t } = useI18n();

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-linear-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
            {t("insightTitle")}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mb-8 sm:mb-10">{t("insightDesc")}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {INSIGHTS.map((insight, i) => (
            <motion.div
              key={insight.titleKey}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className={`relative overflow-hidden glass-card p-6 border ${insight.border} group`}
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-linear-to-br ${insight.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div className="relative z-10">
                <span className="text-3xl mb-3 block">{insight.icon}</span>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t(insight.titleKey)}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {t(insight.descKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
