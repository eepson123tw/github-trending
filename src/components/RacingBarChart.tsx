"use client";

import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { DailyData } from "@/lib/categories";
import { categorize, CATEGORIES } from "@/lib/categories";
import { useI18n } from "@/lib/i18n-context";

interface Props {
  data: DailyData;
}

interface CategoryFrame {
  name: string;
  color: string;
  value: number;
}

export default function RacingBarChart({ data }: Props) {
  const { t } = useI18n();
  const [playing, setPlaying] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Build frames: cumulative counts per category per day
  const { frames, dates } = useMemo(() => {
    const sortedDates = Object.keys(data).sort();
    const cumulative: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      if (cat.name !== "Other") cumulative[cat.name] = 0;
    }

    const allFrames: CategoryFrame[][] = [];
    // Use 7-day rolling window
    const window = 7;
    const recentCounts: Record<string, number[]> = {};
    for (const cat of CATEGORIES) {
      if (cat.name !== "Other") recentCounts[cat.name] = [];
    }

    for (let i = 0; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      const dayCounts: Record<string, number> = {};
      for (const repo of data[date]) {
        const cat = categorize(repo).name;
        if (cat !== "Other") dayCounts[cat] = (dayCounts[cat] || 0) + 1;
      }

      for (const cat of CATEGORIES) {
        if (cat.name === "Other") continue;
        const count = dayCounts[cat.name] || 0;
        cumulative[cat.name] += count;

        recentCounts[cat.name].push(count);
        if (recentCounts[cat.name].length > window) {
          recentCounts[cat.name].shift();
        }
      }

      const frame: CategoryFrame[] = CATEGORIES
        .filter((c) => c.name !== "Other")
        .map((c) => ({
          name: c.name,
          color: c.color,
          value: cumulative[c.name],
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      allFrames.push(frame);
    }

    return { frames: allFrames, dates: sortedDates };
  }, [data]);

  const totalFrames = frames.length;

  // Animation loop
  const tick = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;
      // Base speed: 1 frame per 100ms, adjustable by speed multiplier
      const interval = 100 / speed;

      if (elapsed >= interval) {
        lastTimeRef.current = timestamp;
        setFrameIndex((prev) => {
          if (prev >= totalFrames - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }
      animRef.current = requestAnimationFrame(tick);
    },
    [speed, totalFrames]
  );

  useEffect(() => {
    if (playing) {
      lastTimeRef.current = 0;
      animRef.current = requestAnimationFrame(tick);
    } else if (animRef.current) {
      cancelAnimationFrame(animRef.current);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [playing, tick]);

  const currentFrame = frames[frameIndex] || [];
  const currentDate = dates[frameIndex] || "";
  const maxValue = currentFrame.length > 0 ? currentFrame[0].value : 1;

  const togglePlay = () => {
    if (frameIndex >= totalFrames - 1) {
      setFrameIndex(0);
      setPlaying(true);
    } else {
      setPlaying(!playing);
    }
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
          <span className="bg-linear-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            {t("racingTitle")}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
          {t("racingDesc")}
        </p>

        <div className="glass-card p-4 sm:p-6">
          {/* Controls */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={togglePlay}
              className="px-5 py-2 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors text-sm font-medium"
            >
              {playing ? t("racingPause") : t("racingPlay")}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{t("racingSpeed")}:</span>
              {[1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                    speed === s
                      ? "bg-green-500/30 text-green-400 border border-green-500/40"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <div className="ml-auto text-right">
              <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                {currentDate}
              </div>
            </div>
          </div>

          {/* Timeline scrubber */}
          <div className="mb-6">
            <input
              type="range"
              min="0"
              max={totalFrames - 1}
              value={frameIndex}
              onChange={(e) => {
                setFrameIndex(parseInt(e.target.value));
                setPlaying(false);
              }}
              className="w-full accent-green-500 h-1"
            />
          </div>

          {/* Bars */}
          <div className="space-y-2">
            {currentFrame.map((item, rank) => {
              const widthPct = (item.value / maxValue) * 100;

              return (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-28 sm:w-36 text-right text-xs text-slate-400 truncate shrink-0">
                    {item.name}
                  </div>
                  <div className="flex-1 h-7 relative">
                    <div
                      className="h-full rounded-r-md transition-all duration-100 ease-linear flex items-center"
                      style={{
                        width: `${Math.max(widthPct, 1)}%`,
                        background: `linear-gradient(90deg, ${item.color}40, ${item.color}90)`,
                      }}
                    >
                      <span
                        className="absolute right-2 text-xs font-mono font-medium tabular-nums"
                        style={{ color: item.color }}
                      >
                        {item.value}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress indicator */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-600">
            <span>{dates[0]}</span>
            <span>{Math.round((frameIndex / Math.max(totalFrames - 1, 1)) * 100)}%</span>
            <span>{dates[dates.length - 1]}</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
