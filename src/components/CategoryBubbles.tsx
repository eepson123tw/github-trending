"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import type { DailyData, Repo } from "@/lib/categories";
import { CATEGORIES, categorize, getTopRepos } from "@/lib/categories";
import { useI18n } from "@/lib/i18n-context";

interface Props {
  data: DailyData;
}

interface GNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  color: string;
  r: number;
  type: "category" | "repo";
  count?: number;
  author?: string;
  catName?: string;
  appearances?: number;
}

interface GLink {
  source: string | GNode;
  target: string | GNode;
  color: string;
  width: number;
}

interface TooltipInfo {
  x: number;
  y: number;
  node: GNode;
}

export default function CategoryBubbles({ data }: Props) {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const stateRef = useRef<{
    nodes: GNode[];
    links: GLink[];
    simulation: d3.Simulation<GNode, never> | null;
    transform: d3.ZoomTransform;
    hovered: GNode | null;
    connectedIds: Set<string>;
    width: number;
    height: number;
    raf: number;
  }>({
    nodes: [],
    links: [],
    simulation: null,
    transform: d3.zoomIdentity,
    hovered: null,
    connectedIds: new Set(),
    width: 0,
    height: 0,
    raf: 0,
  });

  const buildGraph = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const isMobile = width < 640;
    const height = isMobile ? 480 : 650;
    const state = stateRef.current;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(dpr, dpr);

    state.width = width;
    state.height = height;

    // --- Build data ---
    const topRepos = getTopRepos(data);
    const catColorMap: Record<string, string> = {};
    CATEGORIES.forEach((c) => (catColorMap[c.name] = c.color));

    // Category hub nodes
    const catCounts: Record<string, number> = {};
    topRepos.forEach((r) => {
      const name = r.category.name;
      if (name === "Other") return;
      catCounts[name] = (catCounts[name] || 0) + r.appearances;
    });

    const catNodes: GNode[] = CATEGORIES.filter(
      (c) => c.name !== "Other" && catCounts[c.name]
    ).map((c) => ({
      id: `cat-${c.name}`,
      label: c.name,
      color: c.color,
      r: isMobile
        ? Math.sqrt(catCounts[c.name]) * 0.8 + 18
        : Math.sqrt(catCounts[c.name]) * 1.0 + 24,
      type: "category" as const,
      count: catCounts[c.name],
    }));

    // ALL unique repos as nodes (exclude Other)
    const repoNodes: GNode[] = topRepos
      .filter((r) => r.category.name !== "Other")
      .map((r) => ({
        id: `repo-${r.author}/${r.title}`,
        label: r.title,
        color: catColorMap[r.category.name] || "#94a3b8",
        r: isMobile
          ? Math.min(1.5 + r.appearances * 0.3, 6)
          : Math.min(2 + r.appearances * 0.4, 10),
        type: "repo" as const,
        author: r.author,
        catName: r.category.name,
        appearances: r.appearances,
      }));

    // Links: repo -> its category
    const links: GLink[] = repoNodes.map((r) => ({
      source: r.id,
      target: `cat-${r.catName}`,
      color: r.color,
      width: 0.3,
    }));

    // Cross-category links
    const catPairs = new Map<string, number>();
    Object.values(data).forEach((repos) => {
      const catsInDay = new Set(
        (repos as Repo[]).map((r) => categorize(r).name).filter((n) => n !== "Other")
      );
      const arr = Array.from(catsInDay);
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const key = [arr[i], arr[j]].sort().join("|");
          catPairs.set(key, (catPairs.get(key) || 0) + 1);
        }
      }
    });

    const maxPairCount = Math.max(...Array.from(catPairs.values()));
    Array.from(catPairs.entries())
      .filter(([, count]) => count > maxPairCount * 0.15)
      .forEach(([key, count]) => {
        const [a, b] = key.split("|");
        links.push({
          source: `cat-${a}`,
          target: `cat-${b}`,
          color: "rgba(255,255,255,0.08)",
          width: (count / maxPairCount) * 3 + 0.5,
        });
      });

    const nodes: GNode[] = [...catNodes, ...repoNodes];
    state.nodes = nodes;
    state.links = links;

    // --- Simulation ---
    if (state.simulation) state.simulation.stop();

    const simulation = d3
      .forceSimulation<GNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<GNode, d3.SimulationLinkDatum<GNode>>(links as unknown as d3.SimulationLinkDatum<GNode>[])
          .id((d) => d.id)
          .distance((d) => {
            const s = d.source as GNode;
            const t = d.target as GNode;
            if (s.type === "category" && t.type === "category") return isMobile ? 140 : 200;
            return isMobile ? 30 + Math.random() * 20 : 50 + Math.random() * 30;
          })
          .strength((d) => {
            const s = d.source as GNode;
            const t = d.target as GNode;
            if (s.type === "category" && t.type === "category") return 0.15;
            return 0.3;
          })
      )
      .force("charge", d3.forceManyBody().strength((d) => {
        const n = d as GNode;
        return n.type === "category" ? (isMobile ? -400 : -600) : -3;
      }))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(0.05))
      .force(
        "collision",
        d3.forceCollide<GNode>().radius((d) => d.r + 1).strength(0.4).iterations(2)
      )
      .alphaDecay(0.02)
      .velocityDecay(0.4);

    state.simulation = simulation;

    // --- Canvas rendering loop ---
    const draw = () => {
      const { transform, hovered, connectedIds } = state;

      ctx.save();
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = "rgba(10, 10, 15, 0)";
      ctx.fillRect(0, 0, width, height);

      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // Draw links
      for (const link of links) {
        const s = link.source as GNode;
        const t = link.target as GNode;
        if (s.x == null || t.x == null) continue;

        const isConnected = hovered
          ? connectedIds.has(s.id) && connectedIds.has(t.id)
          : true;

        ctx.beginPath();
        ctx.moveTo(s.x, s.y!);
        ctx.lineTo(t.x, t.y!);

        if (hovered) {
          ctx.strokeStyle = isConnected ? `${(s.type === "category" && t.type === "category") ? "rgba(255,255,255,0.15)" : (hovered.type === "category" ? hovered.color : link.color)}` : "rgba(255,255,255,0.01)";
          ctx.lineWidth = isConnected ? link.width + 0.5 : 0.1;
          ctx.globalAlpha = isConnected ? 0.6 : 0.05;
        } else {
          ctx.strokeStyle = link.color;
          ctx.lineWidth = link.width;
          ctx.globalAlpha = s.type === "category" && t.type === "category" ? 0.3 : 0.12;
        }

        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Draw nodes
      for (const node of nodes) {
        if (node.x == null) continue;

        const isHoveredNode = hovered?.id === node.id;
        const isConnected = hovered ? connectedIds.has(node.id) : true;
        const alpha = hovered ? (isConnected ? 1 : 0.08) : 1;

        ctx.globalAlpha = alpha;

        if (node.type === "category") {
          // Outer glow
          const gradient = ctx.createRadialGradient(
            node.x, node.y!, 0, node.x, node.y!, node.r * (isHoveredNode ? 2.5 : 1.8)
          );
          gradient.addColorStop(0, node.color + (isHoveredNode ? "30" : "15"));
          gradient.addColorStop(1, node.color + "00");
          ctx.beginPath();
          ctx.arc(node.x, node.y!, node.r * (isHoveredNode ? 2.5 : 1.8), 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Ring
          ctx.beginPath();
          ctx.arc(node.x, node.y!, node.r + 2, 0, Math.PI * 2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = alpha * 0.2;
          ctx.stroke();
          ctx.globalAlpha = alpha;

          // Main circle
          ctx.beginPath();
          ctx.arc(node.x, node.y!, node.r, 0, Math.PI * 2);
          ctx.fillStyle = node.color + (isHoveredNode ? "35" : "18");
          ctx.fill();
          ctx.strokeStyle = node.color;
          ctx.lineWidth = isHoveredNode ? 2 : 1.2;
          ctx.globalAlpha = alpha * 0.7;
          ctx.stroke();
          ctx.globalAlpha = alpha;

          // Label
          const fontSize = Math.max(isMobile ? 8 : 10, node.r / (isMobile ? 4.5 : 4));
          ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = node.color;
          ctx.fillText(node.label, node.x, node.y! - 4);

          // Count
          ctx.font = `${isMobile ? 8 : 10}px system-ui, sans-serif`;
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.fillText(`${node.count}`, node.x, node.y! + fontSize * 0.7);
        } else {
          // Repo node — glow on hover
          if (isHoveredNode) {
            const glow = ctx.createRadialGradient(node.x, node.y!, 0, node.x, node.y!, node.r * 4);
            glow.addColorStop(0, node.color + "40");
            glow.addColorStop(1, node.color + "00");
            ctx.beginPath();
            ctx.arc(node.x, node.y!, node.r * 4, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();
          }

          // Dot
          ctx.beginPath();
          ctx.arc(node.x, node.y!, node.r, 0, Math.PI * 2);
          ctx.fillStyle = node.color + (isHoveredNode ? "cc" : "60");
          ctx.fill();

          // Border for bigger repos
          if (node.appearances && node.appearances > 3) {
            ctx.strokeStyle = node.color;
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = alpha * 0.4;
            ctx.stroke();
            ctx.globalAlpha = alpha;
          }

          // Label on hover
          if (isHoveredNode) {
            ctx.font = "bold 11px system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillStyle = "#fff";
            ctx.fillText(node.label, node.x, node.y! - node.r - 4);
            ctx.font = "9px system-ui, sans-serif";
            ctx.fillStyle = "rgba(255,255,255,0.5)";
            ctx.fillText(node.author || "", node.x, node.y! - node.r - 16);
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.restore();

      state.raf = requestAnimationFrame(draw);
    };

    simulation.on("tick", () => {});
    state.raf = requestAnimationFrame(draw);

    // --- Zoom ---
    const svgSelection = d3.select(canvas);
    const zoom = d3.zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.2, 5])
      .on("zoom", (event) => {
        state.transform = event.transform;
      });
    svgSelection.call(zoom);

    // Initial zoom to fit
    const initialScale = isMobile ? 0.7 : 0.85;
    const initialTransform = d3.zoomIdentity
      .translate(width * (1 - initialScale) / 2, height * (1 - initialScale) / 2)
      .scale(initialScale);
    svgSelection.call(zoom.transform, initialTransform);

    // --- Mouse interactions ---
    const getNodeAtPoint = (mx: number, my: number): GNode | null => {
      const t = state.transform;
      const x = (mx - t.x) / t.k;
      const y = (my - t.y) / t.k;

      // Check category nodes first (larger hit area)
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i];
        if (n.x == null) continue;
        const dx = x - n.x;
        const dy = y - n.y!;
        const hitR = n.type === "category" ? n.r + 4 : n.r + 3;
        if (dx * dx + dy * dy < hitR * hitR) return n;
      }
      return null;
    };

    const updateConnected = (node: GNode | null) => {
      const ids = new Set<string>();
      if (node) {
        ids.add(node.id);
        for (const l of links) {
          const s = typeof l.source === "object" ? (l.source as GNode).id : l.source;
          const t = typeof l.target === "object" ? (l.target as GNode).id : l.target;
          if (s === node.id) ids.add(t as string);
          if (t === node.id) ids.add(s as string);
        }
      }
      state.connectedIds = ids;
    };

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const node = getNodeAtPoint(mx, my);

      if (node !== state.hovered) {
        state.hovered = node;
        updateConnected(node);
        canvas.style.cursor = node ? "pointer" : "grab";

        if (node) {
          setTooltip({ x: mx, y: my, node });
        } else {
          setTooltip(null);
        }
      } else if (node && tooltip) {
        setTooltip({ x: mx, y: my, node });
      }
    };

    const handleLeave = () => {
      state.hovered = null;
      state.connectedIds = new Set();
      setTooltip(null);
      canvas.style.cursor = "grab";
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const node = getNodeAtPoint(e.clientX - rect.left, e.clientY - rect.top);
      if (node?.type === "repo" && node.author) {
        const name = node.id.replace("repo-", "");
        window.open(`https://github.com/${name}`, "_blank");
      }
    };

    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("click", handleClick);

    // --- Drag ---
    let dragNode: GNode | null = null;

    const handleDragStart = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const node = getNodeAtPoint(e.clientX - rect.left, e.clientY - rect.top);
      if (node) {
        dragNode = node;
        simulation.alphaTarget(0.3).restart();
        node.fx = node.x;
        node.fy = node.y;
        e.stopPropagation();
      }
    };

    const handleDrag = (e: MouseEvent) => {
      if (!dragNode) return;
      const t = state.transform;
      const rect = canvas.getBoundingClientRect();
      dragNode.fx = (e.clientX - rect.left - t.x) / t.k;
      dragNode.fy = (e.clientY - rect.top - t.y) / t.k;
    };

    const handleDragEnd = () => {
      if (!dragNode) return;
      simulation.alphaTarget(0);
      dragNode.fx = null;
      dragNode.fy = null;
      dragNode = null;
    };

    canvas.addEventListener("mousedown", handleDragStart);
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleDragEnd);

    return () => {
      cancelAnimationFrame(state.raf);
      simulation.stop();
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("mousedown", handleDragStart);
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [data, tooltip]);

  useEffect(() => {
    const cleanup = buildGraph();

    let timeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cleanup?.();
        buildGraph();
      }, 300);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cleanup?.();
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
        <p className="text-sm sm:text-base text-slate-500 mb-1 sm:mb-2">
          {t("catDesc")}
        </p>
        <p className="text-[10px] sm:text-xs text-slate-600 mb-4 sm:mb-6">
          {t("catHint")}
        </p>

        <div ref={containerRef} className="glass-card p-1 sm:p-2 overflow-hidden relative">
          <canvas
            ref={canvasRef}
            className="w-full rounded-xl"
            style={{ cursor: "grab" }}
          />

          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute glass-card px-3 py-2 text-xs pointer-events-none z-10 max-w-[220px] border border-white/10"
              style={{
                left: Math.min(tooltip.x + 12, (stateRef.current.width || 400) - 230),
                top: tooltip.y - 60,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: tooltip.node.color }}
                />
                <span className="text-white font-semibold truncate">
                  {tooltip.node.type === "repo"
                    ? tooltip.node.id.replace("repo-", "")
                    : tooltip.node.label}
                </span>
              </div>
              {tooltip.node.type === "category" && (
                <div className="text-slate-400">
                  {tooltip.node.count} appearances
                </div>
              )}
              {tooltip.node.type === "repo" && (
                <>
                  {tooltip.node.appearances && (
                    <div className="text-slate-400">
                      trending {tooltip.node.appearances}x · {tooltip.node.catName}
                    </div>
                  )}
                  <div className="text-indigo-400 mt-0.5">click to open GitHub</div>
                </>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex flex-wrap gap-1.5 sm:gap-2">
            {CATEGORIES.filter((c) => c.name !== "Other").map((cat) => (
              <span
                key={cat.name}
                className="flex items-center gap-1 text-[9px] sm:text-[10px] opacity-60"
                style={{ color: cat.color }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ background: cat.color }}
                />
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
