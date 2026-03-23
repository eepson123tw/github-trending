"use client";

import { useRef } from "react";
import type { Repo, CategoryDef, Durability } from "@/lib/categories";
import { useI18n } from "@/lib/i18n-context";

interface Props {
  repo: Repo;
  category: CategoryDef;
  appearances?: number;
  longestStreak?: number;
  durability?: Durability;
  index?: number;
}

const DURABILITY_COLORS: Record<Durability, string> = {
  evergreen: "#10b981",
  steady: "#3b82f6",
  burst: "#f97316",
  flash: "#64748b",
};

const DURABILITY_KEYS: Record<Durability, "badgeEvergreen" | "badgeSteady" | "badgeBurst" | "badgeFlash"> = {
  evergreen: "badgeEvergreen",
  steady: "badgeSteady",
  burst: "badgeBurst",
  flash: "badgeFlash",
};

export default function RepoCard({ repo, category, appearances, longestStreak, durability }: Props) {
  const { t } = useI18n();
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <div className="h-full">
      <a
        href={`https://github.com/${repo.author}/${repo.title}`}
        target="_blank"
        rel="noopener noreferrer"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-card glow-border p-4 sm:p-5 cursor-pointer transition-[transform] duration-200 ease-out group flex flex-col h-full"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold shrink-0"
              style={{
                background: `${category.color}20`,
                color: category.color,
              }}
            >
              {repo.title.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                {repo.title}
              </h3>
              <p className="text-xs text-slate-500 truncate">{repo.author}</p>
            </div>
          </div>

          {appearances && appearances > 1 && (
            <span
              className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium pulse-glow shrink-0 ml-2"
              style={{
                background: `${category.color}20`,
                color: category.color,
              }}
            >
              {appearances}x
            </span>
          )}
        </div>

        {/* Description — fixed 2-line height */}
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2 mb-3 flex-1">
          {repo.description || "No description"}
        </p>

        {/* Footer — always at bottom */}
        <div className="flex items-center justify-between mt-auto gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full shrink-0"
              style={{
                background: `${category.color}15`,
                color: category.color,
                border: `1px solid ${category.color}30`,
              }}
            >
              {category.name}
            </span>
            {durability && durability !== "flash" && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                style={{
                  background: `${DURABILITY_COLORS[durability]}15`,
                  color: DURABILITY_COLORS[durability],
                }}
              >
                {t(DURABILITY_KEYS[durability])}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {longestStreak && longestStreak >= 5 && (
              <span className="text-[10px] text-amber-400/80">
                🔥{longestStreak}{t("streakLabel")}
              </span>
            )}
            <span className="text-[10px] sm:text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">
              GitHub &rarr;
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
