"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DailyData } from "@/lib/categories";
import { categorize, CATEGORIES } from "@/lib/categories";
import { useI18n } from "@/lib/i18n-context";

interface Props {
  data: DailyData;
}

export default function OnThisDay({ data }: Props) {
  const { t, locale } = useI18n();
  const dates = useMemo(() => Object.keys(data).sort(), [data]);
  const [selectedDate, setSelectedDate] = useState(
    () => {
      // Try today's date first, fallback to the latest date
      const today = new Date().toISOString().slice(0, 10);
      if (data[today]) return today;
      return dates[dates.length - 1] || today;
    }
  );

  const repos = useMemo(() => {
    const dayRepos = data[selectedDate] || [];
    return dayRepos.map((repo) => ({
      ...repo,
      category: categorize(repo),
    }));
  }, [data, selectedDate]);

  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const repo of repos) {
      counts[repo.category.name] = (counts[repo.category.name] || 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        count,
        color: CATEGORIES.find((c) => c.name === name)?.color || "#94a3b8",
      }));
  }, [repos]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    if (locale === "en") {
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return d.toLocaleDateString(locale === "zh-TW" ? "zh-TW" : "zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const goToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    if (data[today]) {
      setSelectedDate(today);
    } else {
      // Find closest date
      const closest = dates.reduce((prev, curr) =>
        Math.abs(new Date(curr).getTime() - new Date(today).getTime()) <
        Math.abs(new Date(prev).getTime() - new Date(today).getTime())
          ? curr
          : prev
      );
      setSelectedDate(closest);
    }
  };

  const goRandom = () => {
    const idx = Math.floor(Math.random() * dates.length);
    setSelectedDate(dates[idx]);
  };

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-linear-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
            {t("otdTitle")}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
          {t("otdDesc")}
        </p>

        <div className="glass-card p-4 sm:p-6">
          {/* Date picker and controls */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <input
              type="date"
              value={selectedDate}
              min={dates[0]}
              max={dates[dates.length - 1]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-pink-400/50 transition-colors"
            />
            <button
              onClick={goToday}
              className="px-4 py-2 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 hover:bg-pink-500/30 transition-colors text-sm"
            >
              {t("otdToday")}
            </button>
            <button
              onClick={goRandom}
              className="px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/30 transition-colors text-sm"
            >
              {t("otdRandom")}
            </button>

            <div className="ml-auto text-right">
              <div className="text-lg font-medium text-white">
                {formatDate(selectedDate)}
              </div>
              <div className="text-xs text-slate-500">
                {repos.length} {t("otdReposCount")}
              </div>
            </div>
          </div>

          {/* Category distribution */}
          {categoryBreakdown.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {categoryBreakdown.map((cat) => (
                <span
                  key={cat.name}
                  className="px-2.5 py-1 rounded-full text-xs"
                  style={{
                    background: `${cat.color}15`,
                    color: cat.color,
                    border: `1px solid ${cat.color}30`,
                  }}
                >
                  {cat.name} ({cat.count})
                </span>
              ))}
            </div>
          )}

          {/* Repos list */}
          <AnimatePresence mode="wait">
            {repos.length === 0 ? (
              <motion.div
                key="no-data"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-slate-500"
              >
                {t("otdNoData")}
              </motion.div>
            ) : (
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-2"
              >
                {repos.map((repo, i) => (
                  <motion.a
                    key={`${repo.author}/${repo.title}`}
                    href={repo.url || `https://github.com/${repo.author}/${repo.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <span
                      className="mt-1 w-2 h-2 rounded-full shrink-0"
                      style={{ background: repo.category.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors truncate">
                          {repo.author}/{repo.title}
                        </span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                          style={{
                            background: `${repo.category.color}15`,
                            color: repo.category.color,
                          }}
                        >
                          {repo.category.name}
                        </span>
                      </div>
                      {repo.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {repo.description}
                        </p>
                      )}
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
