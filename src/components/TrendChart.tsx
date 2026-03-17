"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  const catNames = CATEGORIES.filter((c) => c.name !== "Other").map((c) => c.name);
  const catColorMap = Object.fromEntries(CATEGORIES.map((c) => [c.name, c.color]));

  const buildSeries = useCallback(() => {
    const dates = Object.keys(data).sort();
    if (dates.length === 0) return { series: [], dates: [] };

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
        avg[c] =
          chunk.reduce(
            (sum, d) => sum + ((d as unknown as Record<string, number>)[c] || 0),
            0
          ) / chunk.length;
      });
      series.push({
        date: chunk[Math.floor(chunk.length / 2)].date,
        ...avg,
      } as (typeof dailySeries)[0]);
    }

    return { series, dates: series.map((s) => s.date) };
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const { series, dates } = buildSeries();
    if (series.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = width < 640 ? 280 : 420;
    const margin = {
      top: 30,
      right: width < 640 ? 15 : 30,
      bottom: 40,
      left: width < 640 ? 35 : 45,
    };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    svg.selectAll("*").remove();

    const x = d3
      .scalePoint()
      .domain(dates)
      .range([margin.left, width - margin.right]);

    const isIsolated = selectedCat !== null;

    if (isIsolated) {
      // === ISOLATED SINGLE CATEGORY MODE ===
      const cat = selectedCat!;
      const color = catColorMap[cat] || "#94a3b8";
      const vals = series.map(
        (d) => (d as unknown as Record<string, number>)[cat] || 0
      );
      const yMax = d3.max(vals) || 5;

      const y = d3
        .scaleLinear()
        .domain([0, yMax * 1.2])
        .range([height - margin.bottom, margin.top]);

      // Gradient
      const defs = svg.append("defs");
      const grad = defs
        .append("linearGradient")
        .attr("id", "isolate-grad")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
      grad.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.6);
      grad.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0.02);

      // Area
      const area = d3
        .area<(typeof series)[0]>()
        .x((d) => x(d.date)!)
        .y0(y(0))
        .y1((d) => y((d as unknown as Record<string, number>)[cat] || 0))
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(series)
        .attr("d", area)
        .attr("fill", "url(#isolate-grad)");

      // Line
      const line = d3
        .line<(typeof series)[0]>()
        .x((d) => x(d.date)!)
        .y((d) => y((d as unknown as Record<string, number>)[cat] || 0))
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(series)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2.5);

      // Data dots
      svg
        .selectAll(".dot")
        .data(series)
        .join("circle")
        .attr("cx", (d) => x(d.date)!)
        .attr("cy", (d) => y((d as unknown as Record<string, number>)[cat] || 0))
        .attr("r", 3)
        .attr("fill", color)
        .attr("stroke", "#0a0a0f")
        .attr("stroke-width", 1.5);

      // Y axis
      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.05)")
            .clone().attr("x2", width - margin.left - margin.right).attr("stroke", "rgba(255,255,255,0.03)")
        )
        .call((g) =>
          g.selectAll(".tick text").attr("fill", "#94a3b8").attr("font-size", "11px")
        );
    } else {
      // === STREAM GRAPH MODE ===
      const stack = d3
        .stack<(typeof series)[0]>()
        .keys(catNames)
        .order(d3.stackOrderInsideOut)
        .offset(d3.stackOffsetWiggle);
      const stacked = stack(series);

      const yMin = d3.min(stacked, (layer) => d3.min(layer, (d) => d[0])) || 0;
      const yMax = d3.max(stacked, (layer) => d3.max(layer, (d) => d[1])) || 10;

      const y = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([height - margin.bottom, margin.top]);

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
        grad.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0.1);
      });

      const area = d3
        .area<d3.SeriesPoint<(typeof series)[0]>>()
        .x((d) => x(d.data.date)!)
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]))
        .curve(d3.curveBasis);

      // Draw areas
      svg
        .selectAll(".area-layer")
        .data(stacked)
        .join("path")
        .attr("class", "area-layer")
        .attr("d", area)
        .attr("fill", (d) => `url(#grad-${d.key.replace(/[\s\/]/g, "-")})`)
        .attr("stroke", (d) => catColorMap[d.key] || "#94a3b8")
        .attr("stroke-width", 0.5)
        .attr("opacity", (d) => {
          if (hoveredCat === null) return 1;
          return hoveredCat === d.key ? 1 : 0.12;
        })
        .style("transition", "opacity 0.3s ease")
        .style("cursor", "pointer")
        .on("click", (_, d) => setSelectedCat(d.key));

      // Hover labels on stream
      if (hoveredCat) {
        const layer = stacked.find((l) => l.key === hoveredCat);
        if (layer && layer.length > 0) {
          const midIdx = Math.floor(layer.length / 2);
          const midPoint = layer[midIdx];
          const midY = y((midPoint[0] + midPoint[1]) / 2);
          const midX = x(midPoint.data.date)!;

          svg
            .append("text")
            .attr("x", midX)
            .attr("y", midY)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("fill", "white")
            .attr("font-size", width < 640 ? "10px" : "12px")
            .attr("font-weight", "600")
            .attr("pointer-events", "none")
            .text(hoveredCat);
        }
      }
    }

    // X axis (month labels)
    const monthLabels: { date: string; label: string }[] = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let lastMonth = "";
    for (const d of dates) {
      const month = d.slice(0, 7); // YYYY-MM
      if (month !== lastMonth) {
        lastMonth = month;
        const m = parseInt(d.slice(5, 7), 10) - 1;
        monthLabels.push({ date: d, label: monthNames[m] });
      }
    }

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues(monthLabels.map((m) => m.date))
          .tickFormat((d) => {
            const found = monthLabels.find((m) => m.date === d);
            return found ? found.label : "";
          })
      )
      .call((g) => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.05)"))
      .call((g) =>
        g.selectAll(".tick text").attr("fill", "#94a3b8").attr("font-size", "11px")
      );

    // === CROSSHAIR TOOLTIP ===
    const tooltipLine = svg
      .append("line")
      .attr("stroke", "rgba(255,255,255,0.2)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4")
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .style("opacity", 0)
      .style("pointer-events", "none");

    const tooltipG = svg
      .append("g")
      .style("opacity", 0)
      .style("pointer-events", "none");

    const tooltipRect = tooltipG
      .append("rect")
      .attr("rx", 6)
      .attr("fill", "rgba(10,10,15,0.92)")
      .attr("stroke", "rgba(255,255,255,0.1)")
      .attr("stroke-width", 1);

    // Overlay for mouse events
    svg
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "transparent")
      .on("mousemove", (event) => {
        const [mx] = d3.pointer(event);
        // Find closest date
        let closestDate = dates[0];
        let minDist = Infinity;
        for (const d of dates) {
          const dist = Math.abs((x(d) || 0) - mx);
          if (dist < minDist) {
            minDist = dist;
            closestDate = d;
          }
        }

        const cx = x(closestDate)!;
        tooltipLine.attr("x1", cx).attr("x2", cx).style("opacity", 1);

        const dataPoint = series.find((s) => s.date === closestDate);
        if (!dataPoint) return;

        // Build tooltip content
        const values = catNames
          .map((c) => ({
            name: c,
            value: Math.round(((dataPoint as unknown as Record<string, number>)[c] || 0) * 10) / 10,
            color: catColorMap[c],
          }))
          .filter((v) => v.value > 0)
          .sort((a, b) => b.value - a.value);

        tooltipG.selectAll("text").remove();
        tooltipG.selectAll("circle").remove();

        // Date header
        const dateStr = closestDate.slice(5); // MM-DD
        tooltipG
          .append("text")
          .attr("x", 10)
          .attr("y", 18)
          .attr("fill", "#94a3b8")
          .attr("font-size", "10px")
          .text(dateStr);

        const lineH = 16;
        const maxItems = Math.min(values.length, 8);
        values.slice(0, maxItems).forEach((v, i) => {
          const yPos = 34 + i * lineH;
          tooltipG
            .append("circle")
            .attr("cx", 14)
            .attr("cy", yPos - 4)
            .attr("r", 4)
            .attr("fill", v.color);
          tooltipG
            .append("text")
            .attr("x", 24)
            .attr("y", yPos)
            .attr("fill", "white")
            .attr("font-size", "10px")
            .text(`${v.name}: ${v.value}`);
        });

        const tooltipH = 38 + maxItems * lineH;
        const tooltipW = 155;
        tooltipRect.attr("width", tooltipW).attr("height", tooltipH);

        // Position tooltip
        let tx = cx + 12;
        if (tx + tooltipW > width - margin.right) tx = cx - tooltipW - 12;
        tooltipG.attr("transform", `translate(${tx},${margin.top + 5})`).style("opacity", 1);
      })
      .on("mouseleave", () => {
        tooltipLine.style("opacity", 0);
        tooltipG.style("opacity", 0);
      });
  }, [data, selectedCat, hoveredCat, buildSeries]);

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
              onClick={() => setSelectedCat(selectedCat === cat.name ? null : cat.name)}
              onMouseEnter={() => setHoveredCat(cat.name)}
              onMouseLeave={() => setHoveredCat(null)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all"
              style={{
                background:
                  selectedCat === cat.name
                    ? `${cat.color}30`
                    : `${cat.color}15`,
                border: `1px solid ${selectedCat === cat.name ? cat.color : `${cat.color}40`}`,
                color: cat.color,
                opacity:
                  selectedCat === null
                    ? hoveredCat === null || hoveredCat === cat.name
                      ? 1
                      : 0.3
                    : selectedCat === cat.name
                      ? 1
                      : 0.3,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: cat.color }}
              />
              {cat.name}
            </button>
          ))}
          {selectedCat && (
            <button
              onClick={() => setSelectedCat(null)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all bg-white/5 border border-white/10 text-slate-400 hover:text-white"
            >
              ← {t("trendBackToOverview")}
            </button>
          )}
        </div>

        <div className="text-[10px] text-slate-600 mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>
            {selectedCat
              ? t("trendHintIsolated")
              : t("trendHintStream")}
          </span>
          {!selectedCat && (
            <span className="inline-flex items-center gap-1 text-slate-500">
              <svg width="12" height="8" viewBox="0 0 12 8" className="shrink-0">
                <rect y="1" width="12" height="6" rx="3" fill="currentColor" fillOpacity="0.3" />
              </svg>
              {t("trendBandwidthHint")}
            </span>
          )}
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
