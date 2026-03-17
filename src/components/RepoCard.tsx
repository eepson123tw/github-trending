"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { Repo, CategoryDef } from "@/lib/categories";

interface Props {
  repo: Repo;
  category: CategoryDef;
  appearances?: number;
  index: number;
}

export default function RepoCard({ repo, category, appearances, index }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-card glow-border p-5 cursor-pointer transition-[transform] duration-200 ease-out group"
        style={{ willChange: "transform" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{
                background: `${category.color}20`,
                color: category.color,
              }}
            >
              {repo.title.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                {repo.title}
              </h3>
              <p className="text-xs text-slate-500">{repo.author}</p>
            </div>
          </div>

          {appearances && appearances > 1 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium pulse-glow"
              style={{
                background: `${category.color}20`,
                color: category.color,
              }}
            >
              {appearances}x
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-3">
          {repo.description || "No description"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: `${category.color}15`,
              color: category.color,
              border: `1px solid ${category.color}30`,
            }}
          >
            {category.name}
          </span>
          {repo.url && (
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
            >
              GitHub &rarr;
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
