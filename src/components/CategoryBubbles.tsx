"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import type { DailyData, Repo } from "@/lib/categories";
import { CATEGORIES, categorize, getTopRepos } from "@/lib/categories";
import { useI18n } from "@/lib/i18n-context";

interface Props {
  data: DailyData;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  color: string;
  r: number;
  type: "category" | "repo";
  count?: number;
  author?: string;
  category?: string;
  appearances?: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  color: string;
  strength: number;
}

export default function CategoryBubbles({ data }: Props) {
  const { t } = useI18n();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  const buildGraph = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const isMobile = width < 640;
    const height = isMobile ? 420 : 600;

    // --- Build nodes & links ---
    const allRepos = Object.values(data).flat();
    const catCounts: Record<string, number> = {};
    allRepos.forEach((r) => {
      const cat = categorize(r);
      catCounts[cat.name] = (catCounts[cat.name] || 0) + 1;
    });

    const topRepos = getTopRepos(data);

    // Category hub nodes
    const catNodes: GraphNode[] = CATEGORIES.filter(
      (c) => c.name !== "Other" && catCounts[c.name] && catCounts[c.name] > 0
    ).map((c) => ({
      id: `cat-${c.name}`,
      label: c.name,
      color: c.color,
      r: isMobile
        ? Math.sqrt(catCounts[c.name] || 1) * 1.8 + 16
        : Math.sqrt(catCounts[c.name] || 1) * 2.5 + 22,
      type: "category" as const,
      count: catCounts[c.name] || 0,
    }));

    // Top repos per category as satellite nodes
    const repoNodesPerCat = isMobile ? 3 : 5;
    const repoNodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const usedRepos = new Set<string>();

    CATEGORIES.filter((c) => c.name !== "Other").forEach((cat) => {
      const catRepos = topRepos
        .filter((r) => r.category.name === cat.name)
        .slice(0, repoNodesPerCat);

      catRepos.forEach((repo) => {
        const repoId = `repo-${repo.author}/${repo.title}`;
        if (usedRepos.has(repoId)) return;
        usedRepos.add(repoId);

        repoNodes.push({
          id: repoId,
          label: repo.title.length > 12 ? repo.title.slice(0, 12) + "…" : repo.title,
          color: cat.color,
          r: isMobile ? 4 : 6,
          type: "repo",
          author: repo.author,
          category: cat.name,
          appearances: repo.appearances,
        });

        links.push({
          source: `cat-${cat.name}`,
          target: repoId,
          color: cat.color,
          strength: 0.6,
        });
      });
    });

    // Cross-category links between categories that share co-appearing repos
    const catPairs = new Map<string, number>();
    const dateEntries = Object.entries(data);
    dateEntries.forEach(([, repos]) => {
      const catsInDay = new Set(repos.map((r: Repo) => categorize(r).name).filter((n: string) => n !== "Other"));
      const arr = Array.from(catsInDay);
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const key = [arr[i], arr[j]].sort().join("|");
          catPairs.set(key, (catPairs.get(key) || 0) + 1);
        }
      }
    });

    // Top cross-links
    const crossLinks = Array.from(catPairs.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, isMobile ? 8 : 15)
      .map(([key, count]) => {
        const [a, b] = key.split("|");
        const maxCount = Math.max(...Array.from(catPairs.values()));
        return {
          source: `cat-${a}`,
          target: `cat-${b}`,
          color: "rgba(255,255,255,0.06)",
          strength: (count / maxCount) * 0.3,
        };
      });

    const nodes: GraphNode[] = [...catNodes, ...repoNodes];
    const allLinks: GraphLink[] = [...links, ...crossLinks];

    // --- D3 rendering ---
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    // Defs
    const defs = svg.append("defs");

    // Glow filter
    const glow = defs.append("filter").attr("id", "glow-graph").attr("x", "-100%").attr("y", "-100%").attr("width", "300%").attr("height", "300%");
    glow.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "blur");
    const glowMerge = glow.append("feMerge");
    glowMerge.append("feMergeNode").attr("in", "blur");
    glowMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Strong glow for hovered
    const glowStrong = defs.append("filter").attr("id", "glow-strong").attr("x", "-100%").attr("y", "-100%").attr("width", "300%").attr("height", "300%");
    glowStrong.append("feGaussianBlur").attr("stdDeviation", "10").attr("result", "blur");
    const strongMerge = glowStrong.append("feMerge");
    strongMerge.append("feMergeNode").attr("in", "blur");
    strongMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Container group for zoom/pan
    const g = svg.append("g");

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Links
    const linkGroup = g.append("g").attr("class", "links");
    const linkElements = linkGroup
      .selectAll("line")
      .data(allLinks)
      .join("line")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", (d) => d.strength * 2 + 0.5)
      .attr("stroke-opacity", 0.4);

    // Node groups
    const nodeGroup = g
      .selectAll<SVGGElement, GraphNode>(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer");

    // Category nodes — outer glow ring
    nodeGroup
      .filter((d) => d.type === "category")
      .append("circle")
      .attr("r", (d) => d.r + 4)
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.15)
      .attr("filter", "url(#glow-graph)");

    // Category nodes — outer pulse ring
    nodeGroup
      .filter((d) => d.type === "category")
      .append("circle")
      .attr("class", "pulse-ring")
      .attr("r", (d) => d.r)
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 0.5)
      .attr("stroke-opacity", 0.2);

    // Main circle for all nodes
    nodeGroup
      .append("circle")
      .attr("class", "main-circle")
      .attr("r", (d) => d.r)
      .attr("fill", (d) => d.type === "category" ? `${d.color}18` : `${d.color}40`)
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", (d) => (d.type === "category" ? 1.5 : 1))
      .attr("stroke-opacity", (d) => (d.type === "category" ? 0.6 : 0.4));

    // Inner dot for repo nodes
    nodeGroup
      .filter((d) => d.type === "repo")
      .append("circle")
      .attr("r", (d) => d.r * 0.4)
      .attr("fill", (d) => d.color)
      .attr("opacity", 0.8);

    // Labels for category nodes
    nodeGroup
      .filter((d) => d.type === "category")
      .append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", "-0.4em")
      .attr("fill", (d) => d.color)
      .attr("font-size", (d) => Math.max(isMobile ? 8 : 10, d.r / (isMobile ? 4.5 : 4)) + "px")
      .attr("font-weight", "700")
      .style("pointer-events", "none");

    // Count for category nodes
    nodeGroup
      .filter((d) => d.type === "category")
      .append("text")
      .text((d) => `${d.count}`)
      .attr("text-anchor", "middle")
      .attr("dy", "1.1em")
      .attr("fill", "rgba(255,255,255,0.4)")
      .attr("font-size", isMobile ? "9px" : "11px")
      .style("pointer-events", "none");

    // Labels for repo nodes (only on desktop, on hover via CSS)
    if (!isMobile) {
      nodeGroup
        .filter((d) => d.type === "repo")
        .append("text")
        .text((d) => d.label)
        .attr("text-anchor", "middle")
        .attr("dy", (d) => d.r + 12)
        .attr("fill", "rgba(255,255,255,0.5)")
        .attr("font-size", "9px")
        .style("pointer-events", "none")
        .attr("opacity", 0)
        .attr("class", "repo-label");
    }

    // Hover interactions
    nodeGroup
      .on("mouseenter", function (_, d) {
        setHovered(d.id);

        const el = d3.select(this);
        el.select(".main-circle")
          .transition()
          .duration(200)
          .attr("r", d.r * 1.2)
          .attr("fill", d.type === "category" ? `${d.color}30` : `${d.color}60`)
          .attr("filter", "url(#glow-strong)");

        el.select(".repo-label")
          .transition()
          .duration(200)
          .attr("opacity", 1);

        // Highlight connected links
        linkElements
          .transition()
          .duration(200)
          .attr("stroke-opacity", (l) => {
            const s = typeof l.source === "object" ? (l.source as GraphNode).id : l.source;
            const t = typeof l.target === "object" ? (l.target as GraphNode).id : l.target;
            return s === d.id || t === d.id ? 0.8 : 0.08;
          })
          .attr("stroke-width", (l) => {
            const s = typeof l.source === "object" ? (l.source as GraphNode).id : l.source;
            const t = typeof l.target === "object" ? (l.target as GraphNode).id : l.target;
            return s === d.id || t === d.id ? 2 : l.strength * 2 + 0.5;
          })
          .attr("stroke", (l) => {
            const s = typeof l.source === "object" ? (l.source as GraphNode).id : l.source;
            const t = typeof l.target === "object" ? (l.target as GraphNode).id : l.target;
            return s === d.id || t === d.id ? d.color : l.color;
          });

        // Dim unconnected nodes
        const connectedIds = new Set<string>();
        connectedIds.add(d.id);
        allLinks.forEach((l) => {
          const s = typeof l.source === "object" ? (l.source as GraphNode).id : l.source as string;
          const tt = typeof l.target === "object" ? (l.target as GraphNode).id : l.target as string;
          if (s === d.id) connectedIds.add(tt);
          if (tt === d.id) connectedIds.add(s);
        });

        nodeGroup
          .transition()
          .duration(200)
          .attr("opacity", (n) => connectedIds.has(n.id) ? 1 : 0.15);
      })
      .on("mouseleave", function () {
        setHovered(null);

        nodeGroup.each(function (d) {
          d3.select(this)
            .select(".main-circle")
            .transition()
            .duration(300)
            .attr("r", d.r)
            .attr("fill", d.type === "category" ? `${d.color}18` : `${d.color}40`)
            .attr("filter", null);

          d3.select(this)
            .select(".repo-label")
            .transition()
            .duration(300)
            .attr("opacity", 0);
        });

        linkElements
          .transition()
          .duration(300)
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", (l) => l.strength * 2 + 0.5)
          .attr("stroke", (l) => l.color);

        nodeGroup.transition().duration(300).attr("opacity", 1);
      })
      .on("click", (_, d) => {
        if (d.type === "repo" && d.author) {
          const repoName = d.id.replace("repo-", "");
          window.open(`https://github.com/${repoName}`, "_blank");
        } else {
          setSelectedNode(selectedNode?.id === d.id ? null : d);
        }
      });

    // Drag
    const drag = d3
      .drag<SVGGElement, GraphNode>()
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

    nodeGroup.call(drag);

    // Simulation
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<GraphNode, GraphLink>(allLinks)
          .id((d) => d.id)
          .distance((d) => {
            const s = d.source as GraphNode;
            const t = d.target as GraphNode;
            if (s.type === "category" && t.type === "category") return isMobile ? 120 : 180;
            return isMobile ? 45 : 65;
          })
          .strength((d) => d.strength)
      )
      .force("charge", d3.forceManyBody().strength((d) => (d as GraphNode).type === "category" ? -300 : -30))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<GraphNode>().radius((d) => d.r + 3).strength(0.8)
      )
      .force("x", d3.forceX(width / 2).strength(0.04))
      .force("y", d3.forceY(height / 2).strength(0.04));

    simulationRef.current = simulation;

    // Pulse animation for category rings
    function pulseRings() {
      nodeGroup
        .selectAll(".pulse-ring")
        .transition()
        .duration(2000)
        .attr("r", (d) => (d as GraphNode).r + 8)
        .attr("stroke-opacity", 0)
        .transition()
        .duration(0)
        .attr("r", (d) => (d as GraphNode).r)
        .attr("stroke-opacity", 0.2)
        .on("end", pulseRings);
    }
    pulseRings();

    simulation.on("tick", () => {
      linkElements
        .attr("x1", (d) => (d.source as GraphNode).x!)
        .attr("y1", (d) => (d.source as GraphNode).y!)
        .attr("x2", (d) => (d.target as GraphNode).x!)
        .attr("y2", (d) => (d.target as GraphNode).y!);

      nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [data, selectedNode]);

  useEffect(() => {
    const cleanup = buildGraph();
    return () => cleanup?.();
  }, [buildGraph]);

  // Resize handler
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (simulationRef.current) simulationRef.current.stop();
        buildGraph();
      }, 300);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [buildGraph]);

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
        <p className="text-sm sm:text-base text-slate-500 mb-2 sm:mb-4">
          {t("catDesc")}
        </p>
        <p className="text-[10px] sm:text-xs text-slate-600 mb-4 sm:mb-6">
          scroll to zoom · drag to move · hover to explore · click repo to open GitHub
        </p>

        <div ref={containerRef} className="glass-card p-2 sm:p-4 overflow-hidden relative">
          <svg ref={svgRef} className="w-full" />

          {/* Hovered node tooltip */}
          {hovered && (
            <div className="absolute top-3 right-3 glass-card px-3 py-2 text-xs pointer-events-none z-10 max-w-[200px]">
              <div className="text-white font-semibold truncate">
                {hovered.startsWith("repo-") ? hovered.replace("repo-", "") : hovered.replace("cat-", "")}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
