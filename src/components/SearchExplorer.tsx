"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DailyData } from "@/lib/categories";
import { CATEGORIES, getTopRepos } from "@/lib/categories";
import RepoCard from "./RepoCard";
import { useI18n } from "@/lib/i18n-context";

const PAGE_SIZE = 30;

interface Props {
  data: DailyData;
}

export default function SearchExplorer({ data }: Props) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [durabilityFilter, setDurabilityFilter] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const allRepos = useMemo(() => getTopRepos(data), [data]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, activeCategory, durabilityFilter]);

  const allFiltered = useMemo(() => {
    let repos = allRepos;
    if (activeCategory) {
      repos = repos.filter((r) => r.category.name === activeCategory);
    }
    if (durabilityFilter) {
      repos = repos.filter((r) => {
        if (durabilityFilter === "evergreen") return r.appearances >= 16;
        if (durabilityFilter === "steady") return r.appearances >= 6 && r.appearances <= 15;
        if (durabilityFilter === "burst") return r.appearances >= 2 && r.appearances <= 5;
        return true;
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      repos = repos.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q)
      );
    }
    return repos;
  }, [allRepos, activeCategory, durabilityFilter, search]);

  const filtered = useMemo(
    () => allFiltered.slice(0, visibleCount),
    [allFiltered, visibleCount]
  );

  const hasMore = visibleCount < allFiltered.length;

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
          <span className="bg-linear-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
            {t("searchTitle")}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">{t("searchDesc")}</p>

        {/* Search input */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-slate-500"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16 16L21 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full glass-card pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
            style={{ borderRadius: 16 }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === null
                ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/40"
                : "glass-card text-slate-400 hover:text-white"
            }`}
          >
            All ({allRepos.length})
          </button>
          {CATEGORIES.filter((c) => c.name !== "Other").map((cat) => {
            const count = allRepos.filter(
              (r) => r.category.name === cat.name
            ).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.name}
                onClick={() =>
                  setActiveCategory(
                    activeCategory === cat.name ? null : cat.name
                  )
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat.name
                    ? "ring-1"
                    : "glass-card hover:text-white"
                }`}
                style={
                  activeCategory === cat.name
                    ? {
                        background: `${cat.color}20`,
                        color: cat.color,
                        boxShadow: `0 0 0 1px ${cat.color}40`,
                      }
                    : { color: "#94a3b8" }
                }
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                  style={{ background: cat.color }}
                />
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Durability filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {([
            { key: null, label: t("filterAll"), color: "#6366f1" },
            { key: "evergreen", label: t("filterEvergreen"), color: "#10b981" },
            { key: "steady", label: t("filterSteady"), color: "#3b82f6" },
            { key: "burst", label: t("filterBurst"), color: "#f97316" },
          ] as const).map((f) => (
            <button
              key={f.label}
              onClick={() => setDurabilityFilter(durabilityFilter === f.key ? null : f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                durabilityFilter === f.key
                  ? "ring-1"
                  : "glass-card text-slate-400 hover:text-white"
              }`}
              style={
                durabilityFilter === f.key
                  ? { background: `${f.color}20`, color: f.color, boxShadow: `0 0 0 1px ${f.color}40` }
                  : undefined
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-slate-600 mb-4">
          {filtered.length} / {allFiltered.length} {t("searchResults")}
          {search && ` ${t("searchFor")} "${search}"`}
          {activeCategory && ` ${t("searchIn")} ${activeCategory}`}
        </p>

        {/* Repo grid with animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((repo, i) => (
              <motion.div
                key={`${repo.author}-${repo.title}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: Math.max(0, i - (visibleCount - PAGE_SIZE)) * 0.02 }}
              >
                <RepoCard
                  repo={repo}
                  category={repo.category}
                  appearances={repo.appearances}
                  longestStreak={repo.longestStreak}
                  durability={repo.durability}
                  index={0}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="flex flex-col items-center mt-8 gap-2">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="group relative px-8 py-3 rounded-full text-sm font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))",
                border: "1px solid rgba(99,102,241,0.3)",
                boxShadow: "0 0 20px rgba(99,102,241,0.1)",
              }}
            >
              <span className="relative z-10">
                {t("loadMore")} ({Math.min(PAGE_SIZE, allFiltered.length - visibleCount)})
              </span>
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))",
                }}
              />
            </button>
            <p className="text-[11px] text-slate-600">
              {allFiltered.length - visibleCount} {t("remaining")}
            </p>
          </div>
        )}

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-slate-500 text-lg">{t("noResults")}</p>
            <p className="text-slate-600 text-sm mt-2">
              {t("noResultsHint")}
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
