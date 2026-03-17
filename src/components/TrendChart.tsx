"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import type { DailyData } from "@/lib/categories";
import { CATEGORIES, categorize } from "@/lib/categories";
import { useI18n } from "@/lib/i18n-context";

interface Props {
  data: DailyData;
}

export default function TrendChart({ data }: Props) {
  const { t } = useI18n();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const dates = Object.keys(data).sort();
    if (dates.length === 0) return;

    const catNames = CATEGORIES.filter((c) => c.name !== "Other").map(
      (c) => c.name
    );
    const catColorMap = Object.fromEntries(
      CATEGORIES.map((c) => [c.name, c.color])
    );

    // Build weekly-averaged data for smoother chart
    const WINDOW = 7;
    const dailySeries = dates.map((date) => {
      const repos = data[date] || [];
      const counts: Record<string, number> = {};
      catNames.forEach((c) => (counts[c] = 0));
      repos.forEach((r) => {
        const cat = categorize(r);
        if (cat.name !== "Other") counts[cat.name] = (counts[cat.name] || 0) + 1;
      });
      return { date, ...counts };
    });

    // Rolling average + sample weekly
    const series: typeof dailySeries = [];
    for (let i = 0; i < dailySeries.length; i += WINDOW) {
      const chunk = dailySeries.slice(i, i + WINDOW);
      const avg: Record<string, number> = {};
      catNames.forEach((c) => {
        avg[c] = Math.round(
          chunk.reduce((sum, d) => sum + ((d as unknown as Record<string, number>)[c] || 0), 0) / chunk.length
        );
      });
      series.push({ date: chunk[Math.floor(chunk.length / 2)].date, ...avg } as typeof dailySeries[0]);
    }

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = width < 640 ? 260 : 400;
    const margin = { top: 20, right: width < 640 ? 15 : 30, bottom: 40, left: width < 640 ? 30 : 40 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    svg.selectAll("*").remove();

    const x = d3
      .scalePoint()
      .domain(dates)
      .range([margin.left, width - margin.right]);

    const stack = d3.stack<(typeof series)[0]>().keys(catNames).order(d3.stackOrderNone).offset(d3.stackOffsetNone);
    const stacked = stack(series);

    const yMax = d3.max(stacked, (layer) => d3.max(layer, (d) => d[1])) || 10;
    const y = d3
      .scaleLinear()
      .domain([0, yMax])
      .range([height - margin.bottom, margin.top]);

    const area = d3
      .area<d3.SeriesPoint<(typeof series)[0]>>()
      .x((d) => x(d.data.date)!)
      .y0((d) => y(d[0]))
      .y1((d) => y(d[1]))
      .curve(d3.curveBasis);

    // Gradient defs
    const defs = svg.append("defs");
    stacked.forEach((layer) => {
      const cat = layer.key;
      const color = catColorMap[cat] || "#94a3b8";
      const grad = defs
        .append("linearGradient")
        .attr("id", `grad-${cat.replace(/[\s\/]/g, "-")}`)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
      grad.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.7);
      grad.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0.05);
    });

    // Draw areas
    svg
      .selectAll(".area-layer")
      .data(stacked)
      .join("path")
      .attr("class", "area-layer")
      .attr("d", area)
      .attr("fill", (d) => `url(#grad-${d.key.replace(/[\s\/]/g, "-")})`)
      .attr("stroke", (d) => catColorMap[d.key] || "#94a3b8")
      .attr("stroke-width", 1)
      .attr("opacity", (d) =>
        hoveredCat === null || hoveredCat === d.key ? 1 : 0.15
      )
      .style("transition", "opacity 0.3s ease");

    // X axis (show a few labels)
    const tickDates = dates.filter(
      (_, i) => i % Math.max(1, Math.floor(dates.length / 8)) === 0
    );
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(tickDates)
          .tickFormat((d) => {
            const s = d as string;
            return s.slice(5); // MM-DD
          })
      )
      .call((g) => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.05)"))
      .call((g) => g.selectAll(".tick text").attr("fill", "#94a3b8").attr("font-size", "11px"));

    // Y axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.05)"))
      .call((g) => g.selectAll(".tick text").attr("fill", "#94a3b8").attr("font-size", "11px"));
  }, [data, hoveredCat]);

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
          <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {t("trendTitle")}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">{t("trendDesc")}</p>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
          {CATEGORIES.filter((c) => c.name !== "Other").map((cat) => (
            <button
              key={cat.name}
              onMouseEnter={() => setHoveredCat(cat.name)}
              onMouseLeave={() => setHoveredCat(null)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all"
              style={{
                background: `${cat.color}15`,
                border: `1px solid ${cat.color}40`,
                color: cat.color,
                opacity: hoveredCat === null || hoveredCat === cat.name ? 1 : 0.3,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: cat.color }}
              />
              {cat.name}
            </button>
          ))}
        </div>

        <div
          ref={containerRef}
          className="glass-card p-4 overflow-hidden"
        >
          <svg ref={svgRef} className="w-full" />
        </div>
      </motion.div>
    </section>
  );
}
