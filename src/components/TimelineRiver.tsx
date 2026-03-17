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
  { bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.2)", text: "#10b981" },
  { bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.2)", text: "#f59e0b" },
  { bg: "rgba(249,115,22,0.06)", border: "rgba(249,115,22,0.2)", text: "#f97316" },
  { bg: "rgba(99,102,241,0.06)", border: "rgba(99,102,241,0.2)", text: "#6366f1" },
  { bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.2)", text: "#10b981" },
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

  // Pick one representative date per month (15th or closest)
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

  // Group milestones by season for labels
  let lastSeason = -1;
  const milestonesWithSeasonLabel = milestones.map((m) => {
    const showSeasonLabel = m.season !== lastSeason;
    lastSeason = m.season;
    return { ...m, showSeasonLabel };
  });

  useEffect(() => {
    if (!sectionRef.current || !lineRef.current) return;

    // Animate the vertical river line growing
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

    // Animate each timeline item
    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      const isLeft = i % 2 === 0;
      gsap.fromTo(
        item,
        { opacity: 0, x: isLeft ? -60 : 60, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
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
    <section ref={sectionRef} className="relative py-24 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-linear-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            {t("timelineTitle")}
          </span>
        </h2>
        <p className="text-slate-500 mb-16">
          {t("timelineDesc")}
        </p>

        {/* Timeline container */}
        <div className="relative">
          {/* Central glowing river line */}
          <div
            ref={lineRef}
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2 origin-top"
            style={{
              background:
                "linear-gradient(180deg, #6366f1, #a855f7, #3b82f6, #10b981, #6366f1)",
              boxShadow: "0 0 20px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.1)",
            }}
          />

          {/* Timeline items */}
          <div className="relative">
            {milestonesWithSeasonLabel.map((m, i) => {
              const isLeft = i % 2 === 0;
              const seasonColor = SEASON_COLORS[m.season];

              return (
                <div key={m.date} className="relative">
                  {/* Season label */}
                  {m.showSeasonLabel && (
                    <div className="flex items-center justify-center mb-6 relative">
                      <div
                        className="hidden md:block absolute left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold z-10"
                        style={{
                          background: seasonColor.bg,
                          border: `1px solid ${seasonColor.border}`,
                          color: seasonColor.text,
                        }}
                      >
                        {t(SEASON_KEYS[m.season])}
                      </div>
                      <div
                        className="md:hidden absolute left-4 -translate-x-1/2 ml-8 px-3 py-1 rounded-full text-xs font-semibold z-10"
                        style={{
                          background: seasonColor.bg,
                          border: `1px solid ${seasonColor.border}`,
                          color: seasonColor.text,
                        }}
                      >
                        {t(SEASON_KEYS[m.season])}
                      </div>
                      <div className="w-full h-[1px]" style={{ background: seasonColor.border }} />
                    </div>
                  )}

                  {/* Timeline row */}
                  <div className="flex items-center mb-10 md:mb-14">
                    {/* Left card (desktop even items) */}
                    <div className={`hidden md:block w-[calc(50%-24px)] ${isLeft ? "" : "opacity-0 pointer-events-none"}`}>
                      {isLeft && (
                        <div
                          ref={(el) => { itemsRef.current[i] = el; }}
                          className="ml-auto mr-0 max-w-sm"
                        >
                          <TimelineCard m={m} align="right" />
                        </div>
                      )}
                    </div>

                    {/* Center dot */}
                    <div className="relative z-10 flex-shrink-0 w-12 flex justify-center md:mx-0">
                      <div className="relative">
                        <div
                          className="w-4 h-4 rounded-full border-2 border-[#0a0a0f]"
                          style={{
                            background: m.category.color,
                            boxShadow: `0 0 12px ${m.category.color}80, 0 0 24px ${m.category.color}30`,
                          }}
                        />
                        {/* Pulse ring */}
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

                    {/* Right card (desktop odd items) */}
                    <div className={`hidden md:block w-[calc(50%-24px)] ${!isLeft ? "" : "opacity-0 pointer-events-none"}`}>
                      {!isLeft && (
                        <div
                          ref={(el) => { itemsRef.current[i] = el; }}
                          className="mr-auto ml-0 max-w-sm"
                        >
                          <TimelineCard m={m} align="left" />
                        </div>
                      )}
                    </div>

                    {/* Mobile card (always right) */}
                    <div className="md:hidden flex-1 pl-2">
                      <div
                        ref={(el) => {
                          // Only set ref on mobile if not already set for desktop
                          if (typeof window !== "undefined" && window.innerWidth < 768) {
                            itemsRef.current[i] = el;
                          }
                        }}
                      >
                        <TimelineCard m={m} align="left" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- Timeline Card Sub-component ---------- */

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
    <div className={`relative ${align === "right" ? "text-right" : "text-left"}`}>
      {/* Connector line from dot to card */}
      <div
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[1px] w-6 ${
          align === "right" ? "right-0 -mr-6" : "left-0 -ml-6"
        }`}
        style={{
          background: `linear-gradient(${align === "right" ? "to right" : "to left"}, ${m.category.color}60, transparent)`,
        }}
      />

      {/* Date label */}
      <div className="text-xs text-slate-500 mb-1.5 font-mono">
        {formatMonth(m.date)}
      </div>

      {/* Card */}
      <div
        className="glass-card p-4 relative group hover:scale-[1.02] transition-all duration-300"
        style={{
          borderColor: `${m.category.color}15`,
        }}
      >
        {/* Season gradient overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-40"
          style={{ background: seasonColor.bg }}
        />

        <div className={`relative flex items-center gap-2.5 mb-2 ${align === "right" ? "flex-row-reverse" : ""}`}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{
              background: `${m.category.color}20`,
              color: m.category.color,
            }}
          >
            {m.repo.title.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">
              {m.repo.title}
            </h4>
            <p className="text-[11px] text-slate-500 truncate">
              {m.repo.author}
            </p>
          </div>
        </div>

        <p className={`relative text-xs text-slate-400 line-clamp-2 mb-3 ${align === "right" ? "text-right" : "text-left"}`}>
          {m.repo.description || "No description"}
        </p>

        <div className={`relative flex ${align === "right" ? "justify-end" : "justify-start"}`}>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{
              background: `${m.category.color}15`,
              color: m.category.color,
              border: `1px solid ${m.category.color}30`,
            }}
          >
            {m.category.name}
          </span>
        </div>

        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `0 0 30px ${m.category.color}15, inset 0 0 30px ${m.category.color}05`,
          }}
        />
      </div>
    </div>
  );
}
