"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { DailyData } from "@/lib/categories";
import { categorize } from "@/lib/categories";
import { useI18n } from "@/lib/i18n-context";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  data: DailyData;
}

const SEASON_KEYS = ["spring2025", "summer2025", "autumn2025", "winter2025", "spring2026"] as const;
const SEASON_COLORS = [
  { bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.25)", text: "#10b981" },
  { bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.25)", text: "#f59e0b" },
  { bg: "rgba(249,115,22,0.06)", border: "rgba(249,115,22,0.25)", text: "#f97316" },
  { bg: "rgba(99,102,241,0.06)", border: "rgba(99,102,241,0.25)", text: "#6366f1" },
  { bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.25)", text: "#10b981" },
];

function getSeason(date: string): number {
  const m = parseInt(date.slice(5, 7));
  const y = parseInt(date.slice(0, 4));
  if (y >= 2026) return 4;
  if (m >= 3 && m <= 5) return 0;
  if (m >= 6 && m <= 8) return 1;
  if (m >= 9 && m <= 11) return 2;
  return 3;
}

function formatMonth(date: string): string {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const m = parseInt(date.slice(5, 7));
  const y = date.slice(0, 4);
  return `${months[m - 1]} ${y}`;
}

export default function TimelineRiver({ data }: Props) {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const dates = Object.keys(data).sort();
  const monthMap = new Map<string, string>();
  dates.forEach((d) => {
    const key = d.slice(0, 7);
    const day = parseInt(d.slice(8, 10));
    const existing = monthMap.get(key);
    if (!existing || Math.abs(day - 15) < Math.abs(parseInt(existing.slice(8, 10)) - 15)) {
      monthMap.set(key, d);
    }
  });

  const milestones = Array.from(monthMap.values())
    .sort()
    .map((date) => {
      const repos = data[date];
      const topRepo = repos[0];
      const cat = categorize(topRepo);
      return { date, repo: topRepo, category: cat, season: getSeason(date) };
    });

  let lastSeason = -1;
  const milestonesWithSeasonLabel = milestones.map((m) => {
    const showSeasonLabel = m.season !== lastSeason;
    lastSeason = m.season;
    return { ...m, showSeasonLabel };
  });

  useEffect(() => {
    if (!sectionRef.current || !lineRef.current) return;

    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 40%",
          scrub: 1,
        },
      }
    );

    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      const isMobile = window.innerWidth < 768;
      const isLeft = !isMobile && i % 2 === 0;
      gsap.fromTo(
        item,
        { opacity: 0, x: isMobile ? 40 : isLeft ? -60 : 60, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-linear-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            {t("timelineTitle")}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mb-10 sm:mb-16">
          {t("timelineDesc")}
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Glowing river line — left on mobile, center on desktop */}
          <div
            ref={lineRef}
            className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-1/2 origin-top"
            style={{
              background: "linear-gradient(180deg, #6366f1, #a855f7, #3b82f6, #10b981, #6366f1)",
              boxShadow: "0 0 20px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.1)",
            }}
          />

          {milestonesWithSeasonLabel.map((m, i) => {
            const isLeft = i % 2 === 0;
            const seasonColor = SEASON_COLORS[m.season];

            return (
              <div key={m.date}>
                {/* Season divider */}
                {m.showSeasonLabel && (
                  <div className="relative flex items-center mb-6 sm:mb-8">
                    <div className="hidden md:block absolute inset-x-0 h-px" style={{ background: seasonColor.border }} />
                    <div className="md:hidden absolute left-0 right-0 h-px" style={{ background: seasonColor.border }} />
                    <div
                      className="relative z-10 ml-10 md:ml-0 md:mx-auto px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold"
                      style={{
                        background: "#0a0a0f",
                        border: `1px solid ${seasonColor.border}`,
                        color: seasonColor.text,
                      }}
                    >
                      {t(SEASON_KEYS[m.season])}
                    </div>
                  </div>
                )}

                {/* Timeline item */}
                <div className="relative flex items-start mb-8 sm:mb-12 md:mb-14">
                  {/* === MOBILE layout (< md): dot left, card right === */}
                  <div className="md:hidden flex items-start w-full">
                    {/* Dot */}
                    <div className="relative z-10 shrink-0 w-[38px] flex justify-center pt-2">
                      <div className="relative">
                        <div
                          className="w-3 h-3 rounded-full border-2 border-[#0a0a0f]"
                          style={{
                            background: m.category.color,
                            boxShadow: `0 0 10px ${m.category.color}80`,
                          }}
                        />
                      </div>
                    </div>
                    {/* Card */}
                    <div
                      ref={(el) => { itemsRef.current[i] = el; }}
                      className="flex-1 min-w-0"
                    >
                      <TimelineCard m={m} align="left" />
                    </div>
                  </div>

                  {/* === DESKTOP layout (>= md): alternating left/right === */}
                  <div className="hidden md:flex items-start w-full">
                    {/* Left side */}
                    <div className="w-[calc(50%-20px)] flex justify-end">
                      {isLeft && (
                        <div
                          ref={(el) => { itemsRef.current[i] = el; }}
                          className="max-w-sm w-full"
                        >
                          <TimelineCard m={m} align="right" />
                        </div>
                      )}
                    </div>

                    {/* Center dot */}
                    <div className="relative z-10 shrink-0 w-10 flex justify-center pt-2">
                      <div className="relative">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-[#0a0a0f]"
                          style={{
                            background: m.category.color,
                            boxShadow: `0 0 12px ${m.category.color}80, 0 0 24px ${m.category.color}30`,
                          }}
                        />
                        <div
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{
                            background: m.category.color,
                            opacity: 0.2,
                            animationDuration: "3s",
                          }}
                        />
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="w-[calc(50%-20px)]">
                      {!isLeft && (
                        <div
                          ref={(el) => { itemsRef.current[i] = el; }}
                          className="max-w-sm w-full"
                        >
                          <TimelineCard m={m} align="left" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- Timeline Card ---------- */

interface CardProps {
  m: {
    date: string;
    repo: { title: string; description: string; author: string };
    category: { name: string; color: string };
    season: number;
  };
  align: "left" | "right";
}

function TimelineCard({ m, align }: CardProps) {
  const seasonColor = SEASON_COLORS[m.season];

  return (
    <a
      href={`https://github.com/${m.repo.author}/${m.repo.title}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`block relative ${align === "right" ? "text-right" : "text-left"}`}
    >
      {/* Connector line */}
      <div
        className={`hidden md:block absolute top-4 h-px w-5 ${
          align === "right" ? "right-0 -mr-5" : "left-0 -ml-5"
        }`}
        style={{
          background: `linear-gradient(${align === "right" ? "to right" : "to left"}, ${m.category.color}60, transparent)`,
        }}
      />

      {/* Date */}
      <div className="text-[10px] sm:text-xs text-slate-500 mb-1 font-mono">
        {formatMonth(m.date)}
      </div>

      {/* Card body */}
      <div
        className="glass-card p-3 sm:p-4 relative group hover:scale-[1.02] transition-all duration-300"
        style={{ borderColor: `${m.category.color}15` }}
      >
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-40"
          style={{ background: seasonColor.bg }}
        />

        <div className={`relative flex items-center gap-2 sm:gap-2.5 mb-2 ${align === "right" ? "flex-row-reverse" : ""}`}>
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold shrink-0"
            style={{
              background: `${m.category.color}20`,
              color: m.category.color,
            }}
          >
            {m.repo.title.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
              {m.repo.title}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
              {m.repo.author}
            </p>
          </div>
        </div>

        <p className={`relative text-[11px] sm:text-xs text-slate-400 line-clamp-2 mb-2 sm:mb-3 ${align === "right" ? "text-right" : "text-left"}`}>
          {m.repo.description || "No description"}
        </p>

        <div className={`relative flex ${align === "right" ? "justify-end" : "justify-start"}`}>
          <span
            className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full"
            style={{
              background: `${m.category.color}15`,
              color: m.category.color,
              border: `1px solid ${m.category.color}30`,
            }}
          >
            {m.category.name}
          </span>
        </div>

        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: `0 0 30px ${m.category.color}15, inset 0 0 30px ${m.category.color}05` }}
        />
      </div>
    </a>
  );
}
