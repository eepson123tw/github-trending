"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import type { DailyData } from "@/lib/categories";
import { CATEGORIES, categorize } from "@/lib/categories";
import { useI18n } from "@/lib/i18n-context";

interface Props {
  data: DailyData;
}

export default function CategoryBubbles({ data }: Props) {
  const { t } = useI18n();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const allRepos = Object.values(data).flat();
    const catCounts: Record<string, number> = {};
    allRepos.forEach((r) => {
      const cat = categorize(r);
      catCounts[cat.name] = (catCounts[cat.name] || 0) + 1;
    });

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = width < 640 ? 320 : 500;

    const nodes: {
      id: string;
      color: string;
      count: number;
      r: number;
      x: number;
      y: number;
      fx?: number | null;
      fy?: number | null;
    }[] = CATEGORIES.filter(
      (c) => c.name !== "Other" && catCounts[c.name] && catCounts[c.name] > 0
    ).map((c) => ({
      id: c.name,
      color: c.color,
      count: catCounts[c.name] || 0,
      r: Math.sqrt(catCounts[c.name] || 1) * (width < 640 ? 2.5 : 4) + (width < 640 ? 14 : 20),
      x: 0,
      y: 0,
    }));

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    svg.selectAll("*").remove();

    // Defs for glow filter
    const defs = svg.append("defs");
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "6")
      .attr("result", "blur");
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "blur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    const simulation = d3
      .forceSimulation(nodes)
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceManyBody().strength(5))
      .force(
        "collision",
        d3.forceCollide<(typeof nodes)[0]>().radius((d) => d.r + 4).strength(0.8)
      )
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05));

    const nodeGroup = svg
      .selectAll(".bubble")
      .data(nodes)
      .join("g")
      .attr("class", "bubble")
      .style("cursor", "pointer");

    // Outer glow circle
    nodeGroup
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => d.color)
      .attr("opacity", 0.15)
      .attr("filter", "url(#glow)");

    // Main circle
    nodeGroup
      .append("circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => `${d.color}25`)
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.6);

    // Label
    nodeGroup
      .append("text")
      .text((d) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", "-0.3em")
      .attr("fill", (d) => d.color)
      .attr("font-size", (d) => Math.max(10, d.r / 4) + "px")
      .attr("font-weight", "600");

    // Count
    nodeGroup
      .append("text")
      .text((d) => d.count.toString())
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .attr("fill", "rgba(255,255,255,0.5)")
      .attr("font-size", "11px");

    // Hover
    nodeGroup
      .on("mouseenter", function (_, d) {
        d3.select(this)
          .select("circle:nth-child(2)")
          .transition()
          .duration(200)
          .attr("r", d.r * 1.15)
          .attr("fill", `${d.color}40`);
      })
      .on("mouseleave", function (_, d) {
        d3.select(this)
          .select("circle:nth-child(2)")
          .transition()
          .duration(200)
          .attr("r", d.r)
          .attr("fill", `${d.color}25`);
      });

    // Drag
    const drag = d3
      .drag<SVGGElement, (typeof nodes)[0]>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeGroup.call(drag as any);

    simulation.on("tick", () => {
      nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data]);

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
          <span className="bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
            {t("catTitle")}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
          {t("catDesc")}
        </p>

        <div ref={containerRef} className="glass-card p-4 overflow-hidden">
          <svg ref={svgRef} className="w-full" />
        </div>
      </motion.div>
    </section>
  );
}
