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
  const cardRef = useRef<HTMLAnchorElement>(null);

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
      className="h-full"
    >
      <a
        href={`https://github.com/${repo.author}/${repo.title}`}
        target="_blank"
        rel="noopener noreferrer"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-card glow-border p-4 sm:p-5 cursor-pointer transition-[transform] duration-200 ease-out group flex flex-col h-full"
        style={{ willChange: "transform" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold shrink-0"
              style={{
                background: `${category.color}20`,
                color: category.color,
              }}
            >
              {repo.title.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                {repo.title}
              </h3>
              <p className="text-xs text-slate-500 truncate">{repo.author}</p>
            </div>
          </div>

          {appearances && appearances > 1 && (
            <span
              className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium pulse-glow shrink-0 ml-2"
              style={{
                background: `${category.color}20`,
                color: category.color,
              }}
            >
              {appearances}x
            </span>
          )}
        </div>

        {/* Description — fixed 2-line height */}
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2 mb-3 flex-1">
          {repo.description || "No description"}
        </p>

        {/* Footer — always at bottom */}
        <div className="flex items-center justify-between mt-auto">
          <span
            className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full"
            style={{
              background: `${category.color}15`,
              color: category.color,
              border: `1px solid ${category.color}30`,
            }}
          >
            {category.name}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">
            GitHub &rarr;
          </span>
        </div>
      </a>
    </motion.div>
  );
}
