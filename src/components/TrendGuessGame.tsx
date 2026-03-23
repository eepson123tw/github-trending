"use client";

import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DailyData } from "@/lib/categories";
import { categorize, CATEGORIES, buildTrendData } from "@/lib/categories";
import { useI18n } from "@/lib/i18n-context";

interface Props {
  data: DailyData;
}

type Round = 1 | 2 | 3;

export default function TrendGuessGame({ data }: Props) {
  const { t } = useI18n();
  const svgRef = useRef<SVGSVGElement>(null);
  const [round, setRound] = useState<Round>(1);
  const [scores, setScores] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [userPath, setUserPath] = useState<[number, number][]>([]);
  const [drawing, setDrawing] = useState(false);
  const [finished, setFinished] = useState(false);
  // Round 2 state
  const [sliderValue, setSliderValue] = useState(5);
  const [r2Answered, setR2Answered] = useState(false);
  // Round 3 state
  const [r3Choice, setR3Choice] = useState<string | null>(null);
  const [r3Answered, setR3Answered] = useState(false);

  // Build actual AI Agent weekly trend
  const weeklyTrend = useMemo(() => {
    const trendPoints = buildTrendData(data);
    const aiPoints = trendPoints
      .filter((p) => p.category === "AI Agent")
      .sort((a, b) => a.date.localeCompare(b.date));

    // Group by week
    const weeks: { week: string; total: number }[] = [];
    let currentWeek = "";
    let weekTotal = 0;
    for (const p of aiPoints) {
      const d = new Date(p.date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay());
      const wk = weekStart.toISOString().slice(0, 10);
      if (wk !== currentWeek) {
        if (currentWeek) weeks.push({ week: currentWeek, total: weekTotal });
        currentWeek = wk;
        weekTotal = 0;
      }
      weekTotal += p.count;
    }
    if (currentWeek) weeks.push({ week: currentWeek, total: weekTotal });
    return weeks;
  }, [data]);

  // Compute average days a repo stays trending (for round 2)
  const avgDays = useMemo(() => {
    const map = new Map<string, number>();
    for (const repos of Object.values(data)) {
      for (const repo of repos) {
        const key = (repo.url || `${repo.author}/${repo.title}`).toLowerCase();
        map.set(key, (map.get(key) || 0) + 1);
      }
    }
    const vals = Array.from(map.values());
    return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10;
  }, [data]);

  // Compute fastest growing category (for round 3)
  const { fastestCat, categoryOptions } = useMemo(() => {
    const dates = Object.keys(data).sort();
    const mid = Math.floor(dates.length / 2);
    const firstHalf = new Set(dates.slice(0, mid));
    const secondHalf = new Set(dates.slice(mid));

    const firstCounts: Record<string, number> = {};
    const secondCounts: Record<string, number> = {};

    for (const [date, repos] of Object.entries(data)) {
      for (const repo of repos) {
        const cat = categorize(repo).name;
        if (cat === "Other") continue;
        if (firstHalf.has(date)) firstCounts[cat] = (firstCounts[cat] || 0) + 1;
        if (secondHalf.has(date)) secondCounts[cat] = (secondCounts[cat] || 0) + 1;
      }
    }

    let best = "";
    let bestGrowth = -Infinity;
    for (const cat of CATEGORIES) {
      if (cat.name === "Other") continue;
      const f = firstCounts[cat.name] || 1;
      const s = secondCounts[cat.name] || 0;
      const growth = (s - f) / f;
      if (growth > bestGrowth) {
        bestGrowth = growth;
        best = cat.name;
      }
    }

    // Pick 3 wrong answers + correct
    const others = CATEGORIES
      .filter((c) => c.name !== "Other" && c.name !== best)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.name);
    const opts = [...others, best].sort(() => Math.random() - 0.5);

    return { fastestCat: best, categoryOptions: opts };
  }, [data]);

  // SVG dimensions
  const W = 600;
  const H = 250;
  const PAD = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const maxVal = useMemo(
    () => Math.max(...weeklyTrend.map((w) => w.total), 1),
    [weeklyTrend]
  );

  const toSVG = useCallback(
    (i: number, val: number): [number, number] => {
      const x = PAD.left + (i / (weeklyTrend.length - 1)) * chartW;
      const y = PAD.top + chartH - (val / (maxVal * 1.1)) * chartH;
      return [x, y];
    },
    [weeklyTrend.length, maxVal, chartW, chartH]
  );

  const actualPath = useMemo(() => {
    return weeklyTrend
      .map((w, i) => {
        const [x, y] = toSVG(i, w.total);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  }, [weeklyTrend, toSVG]);

  // Drawing handlers
  const getPoint = (e: React.PointerEvent<SVGSVGElement>): [number, number] => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    return [
      Math.max(PAD.left, Math.min(W - PAD.right, x)),
      Math.max(PAD.top, Math.min(H - PAD.bottom, y)),
    ];
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (revealed || round !== 1) return;
    setDrawing(true);
    setUserPath([getPoint(e)]);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drawing || revealed || round !== 1) return;
    setUserPath((prev) => [...prev, getPoint(e)]);
  };

  const onPointerUp = () => {
    setDrawing(false);
  };

  // Calculate round 1 accuracy
  const calcAccuracy = (): number => {
    if (userPath.length < 2 || weeklyTrend.length < 2) return 0;

    // Sample user path at the same x positions as actual data
    let totalDiff = 0;
    let count = 0;

    for (let i = 0; i < weeklyTrend.length; i++) {
      const [ax, ay] = toSVG(i, weeklyTrend[i].total);
      // Find closest user point by x
      let closest = userPath[0];
      let minDist = Math.abs(userPath[0][0] - ax);
      for (const p of userPath) {
        const d = Math.abs(p[0] - ax);
        if (d < minDist) {
          minDist = d;
          closest = p;
        }
      }
      totalDiff += Math.abs(closest[1] - ay) / chartH;
      count++;
    }

    const avgDiff = totalDiff / count;
    return Math.max(0, Math.round((1 - avgDiff * 2) * 100));
  };

  const handleReveal = () => {
    if (round === 1) {
      const acc = calcAccuracy();
      setScores((s) => [...s, acc]);
      setRevealed(true);
    }
  };

  const handleR2Submit = () => {
    const diff = Math.abs(sliderValue - avgDays);
    const score = Math.max(0, Math.round((1 - diff / 10) * 100));
    setScores((s) => [...s, score]);
    setR2Answered(true);
  };

  const handleR3Submit = (choice: string) => {
    setR3Choice(choice);
    const score = choice === fastestCat ? 100 : 0;
    setScores((s) => [...s, score]);
    setR3Answered(true);
  };

  const nextRound = () => {
    if (round === 1) {
      setRound(2);
      setRevealed(false);
      setUserPath([]);
    } else if (round === 2) {
      setRound(3);
    } else {
      setFinished(true);
    }
  };

  const resetGame = () => {
    setRound(1);
    setScores([]);
    setRevealed(false);
    setUserPath([]);
    setDrawing(false);
    setFinished(false);
    setSliderValue(5);
    setR2Answered(false);
    setR3Choice(null);
    setR3Answered(false);
  };

  const totalScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  // SVG path for actual data with animation
  const pathRef = useRef<SVGPathElement>(null);
  useEffect(() => {
    if (revealed && pathRef.current) {
      const len = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${len}`;
      pathRef.current.style.strokeDashoffset = `${len}`;
      requestAnimationFrame(() => {
        if (pathRef.current) {
          pathRef.current.style.transition = "stroke-dashoffset 1.5s ease-out";
          pathRef.current.style.strokeDashoffset = "0";
        }
      });
    }
  }, [revealed]);

  return (
    <section className="relative py-16 sm:py-24 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {t("guessTitle")}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
          {t("guessDesc")}
        </p>

        <div className="glass-card p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {finished ? (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <div className="text-6xl font-bold mb-4 bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {totalScore}%
                </div>
                <p className="text-slate-400 mb-6">{t("guessScore")}</p>
                <button
                  onClick={resetGame}
                  className="px-6 py-2 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors text-sm"
                >
                  {t("guessReset")}
                </button>
              </motion.div>
            ) : round === 1 ? (
              <motion.div
                key="round1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-300">{t("guessPrompt")}</p>
                  <span className="text-xs text-slate-600">1/3</span>
                </div>

                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${W} ${H}`}
                  className="w-full cursor-crosshair touch-none select-none"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                >
                  {/* Grid */}
                  {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                    <line
                      key={f}
                      x1={PAD.left}
                      y1={PAD.top + chartH * (1 - f)}
                      x2={W - PAD.right}
                      y2={PAD.top + chartH * (1 - f)}
                      stroke="rgba(255,255,255,0.05)"
                    />
                  ))}

                  {/* X labels */}
                  {weeklyTrend.length > 0 && [0, Math.floor(weeklyTrend.length / 2), weeklyTrend.length - 1].map((i) => {
                    const [x] = toSVG(i, 0);
                    return (
                      <text
                        key={i}
                        x={x}
                        y={H - 5}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="10"
                      >
                        {weeklyTrend[i]?.week.slice(5)}
                      </text>
                    );
                  })}

                  {/* User drawn path */}
                  {userPath.length > 1 && (
                    <polyline
                      points={userPath.map(([x, y]) => `${x},${y}`).join(" ")}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={revealed ? 0.4 : 1}
                    />
                  )}

                  {/* Actual path (revealed) */}
                  {revealed && (
                    <path
                      ref={pathRef}
                      d={actualPath}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Draw hint */}
                  {userPath.length === 0 && !revealed && (
                    <text
                      x={W / 2}
                      y={H / 2}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="14"
                    >
                      {t("guessDraw")}
                    </text>
                  )}
                </svg>

                {/* Accuracy result */}
                {revealed && scores.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mt-4"
                  >
                    <div>
                      <span className="text-slate-400 text-sm mr-2">{t("guessAccuracy")}:</span>
                      <span className="text-2xl font-bold text-cyan-400">{scores[0]}%</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="inline-block w-3 h-0.5 bg-cyan-400 rounded" /> <span className="text-xs text-slate-500">You</span>
                      <span className="inline-block w-3 h-0.5 bg-blue-500 rounded ml-2" /> <span className="text-xs text-slate-500">Actual</span>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-end mt-4 gap-3">
                  {!revealed && userPath.length > 5 && (
                    <button
                      onClick={handleReveal}
                      className="px-5 py-2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-sm"
                    >
                      {t("guessReveal")}
                    </button>
                  )}
                  {revealed && (
                    <button
                      onClick={nextRound}
                      className="px-5 py-2 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors text-sm"
                    >
                      {t("guessNext")}
                    </button>
                  )}
                </div>
              </motion.div>
            ) : round === 2 ? (
              <motion.div
                key="round2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-slate-300">{t("guessQ2")}</p>
                  <span className="text-xs text-slate-600">2/3</span>
                </div>

                <div className="flex flex-col items-center gap-6 py-8">
                  <div className="text-5xl font-bold text-cyan-400">{sliderValue}</div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseFloat(e.target.value))}
                    disabled={r2Answered}
                    className="w-full max-w-sm accent-cyan-500"
                  />
                  {r2Answered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <p className="text-slate-400 text-sm">
                        {Math.abs(sliderValue - avgDays) < 1
                          ? t("guessCorrect")
                          : `${t("guessWrong")} ${avgDays}`}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        Score: {scores[scores.length - 1]}%
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  {!r2Answered ? (
                    <button
                      onClick={handleR2Submit}
                      className="px-5 py-2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-sm"
                    >
                      {t("guessReveal")}
                    </button>
                  ) : (
                    <button
                      onClick={nextRound}
                      className="px-5 py-2 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors text-sm"
                    >
                      {t("guessNext")}
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="round3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-slate-300">{t("guessQ3")}</p>
                  <span className="text-xs text-slate-600">3/3</span>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-md mx-auto py-6">
                  {categoryOptions.map((cat) => {
                    const catDef = CATEGORIES.find((c) => c.name === cat);
                    const isCorrect = cat === fastestCat;
                    const isChosen = r3Choice === cat;

                    return (
                      <button
                        key={cat}
                        onClick={() => !r3Answered && handleR3Submit(cat)}
                        disabled={r3Answered}
                        className="px-4 py-3 rounded-xl text-sm font-medium transition-all border"
                        style={{
                          borderColor: r3Answered
                            ? isCorrect
                              ? "#10b981"
                              : isChosen
                                ? "#ef4444"
                                : "rgba(255,255,255,0.1)"
                            : "rgba(255,255,255,0.1)",
                          background: r3Answered
                            ? isCorrect
                              ? "rgba(16,185,129,0.15)"
                              : isChosen
                                ? "rgba(239,68,68,0.15)"
                                : "rgba(255,255,255,0.02)"
                            : "rgba(255,255,255,0.05)",
                          color: catDef?.color || "#94a3b8",
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {r3Answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <p className="text-slate-400 text-sm">
                      {r3Choice === fastestCat
                        ? t("guessCorrect")
                        : `${t("guessWrong")} ${fastestCat}`}
                    </p>
                  </motion.div>
                )}

                <div className="flex justify-end mt-4">
                  {r3Answered && (
                    <button
                      onClick={nextRound}
                      className="px-5 py-2 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors text-sm"
                    >
                      {t("guessFinish")}
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
