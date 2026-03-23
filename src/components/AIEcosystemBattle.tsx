"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import type { DailyData } from "@/lib/categories";
import { buildAIEcosystemData } from "@/lib/categories";
import { useI18n } from "@/lib/i18n-context";

interface Props {
  data: DailyData;
}

export default function AIEcosystemBattle({ data }: Props) {
  const { t } = useI18n();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);

  const ecosystemData = useMemo(() => buildAIEcosystemData(data), [data]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || ecosystemData.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const isMobile = width < 640;
    const height = isMobile ? 300 : 400;
    const margin = {
      top: 30,
      right: isMobile ? 15 : 30,
      bottom: 50,
      left: isMobile ? 40 : 50,
    };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    svg.selectAll("*").remove();

    const quarters = ecosystemData[0].quarters.map((q) => q.quarter);
    const companies = ecosystemData.map((d) => d.company);

    // Scales
    const x0 = d3
      .scaleBand()
      .domain(quarters)
      .range([margin.left, width - margin.right])
      .paddingInner(0.2);

    const x1 = d3
      .scaleBand()
      .domain(companies)
      .range([0, x0.bandwidth()])
      .padding(0.08);

    const yMax = d3.max(ecosystemData, (d) =>
      d3.max(d.quarters, (q) => q.appearances)
    ) || 100;

    const y = d3
      .scaleLinear()
      .domain([0, yMax * 1.1])
      .range([height - margin.bottom, margin.top]);

    const colorMap = Object.fromEntries(
      ecosystemData.map((d) => [d.company, d.color])
    );

    // Grid lines
    svg
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(-(width - margin.left - margin.right))
      )
      .attr("transform", `translate(${margin.left},0)`)
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .attr("stroke", "rgba(255,255,255,0.05)")
      )
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "#94a3b8")
          .attr("font-size", "11px")
      );

    // Bars
    for (const company of ecosystemData) {
      svg
        .selectAll(`.bar-${company.company.replace(/[\s\/]/g, "-")}`)
        .data(company.quarters)
        .join("rect")
        .attr("x", (d) => (x0(d.quarter) || 0) + (x1(company.company) || 0))
        .attr("y", (d) => y(d.appearances))
        .attr("width", x1.bandwidth())
        .attr("height", (d) => y(0) - y(d.appearances))
        .attr("rx", 3)
        .attr("fill", company.color)
        .attr("opacity", () => {
          if (hoveredCompany === null) return 0.85;
          return hoveredCompany === company.company ? 1 : 0.15;
        })
        .style("transition", "opacity 0.3s ease");

      // Value labels on bars
      svg
        .selectAll(`.label-${company.company.replace(/[\s\/]/g, "-")}`)
        .data(company.quarters)
        .join("text")
        .attr(
          "x",
          (d) =>
            (x0(d.quarter) || 0) +
            (x1(company.company) || 0) +
            x1.bandwidth() / 2
        )
        .attr("y", (d) => y(d.appearances) - 4)
        .attr("text-anchor", "middle")
        .attr("fill", () => {
          if (hoveredCompany === null) return "rgba(255,255,255,0.5)";
          return hoveredCompany === company.company
            ? "white"
            : "rgba(255,255,255,0.1)";
        })
        .attr("font-size", isMobile ? "8px" : "10px")
        .style("transition", "fill 0.3s ease")
        .text((d) => (d.appearances > 0 ? d.appearances : ""));
    }

    // X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x0).tickSize(0))
      .call((g) => g.select(".domain").attr("stroke", "rgba(255,255,255,0.1)"))
      .call((g) =>
        g
          .selectAll(".tick text")
          .attr("fill", "#94a3b8")
          .attr("font-size", isMobile ? "10px" : "12px")
      );
  }, [ecosystemData, hoveredCompany]);

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
          <span className="bg-linear-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">
            {t("battleTitle")}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
          {t("battleDesc")}
        </p>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
          {ecosystemData.map((d) => (
            <button
              key={d.company}
              onMouseEnter={() => setHoveredCompany(d.company)}
              onMouseLeave={() => setHoveredCompany(null)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all"
              style={{
                background: `${d.color}15`,
                border: `1px solid ${d.color}40`,
                color: d.color,
                opacity:
                  hoveredCompany === null || hoveredCompany === d.company
                    ? 1
                    : 0.3,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: d.color }}
              />
              {d.company}
            </button>
          ))}
        </div>

        <div ref={containerRef} className="glass-card p-4 overflow-hidden">
          <svg ref={svgRef} className="w-full" />
        </div>
      </motion.div>
    </section>
  );
}
