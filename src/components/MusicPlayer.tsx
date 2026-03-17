"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";

const YOUTUBE_ID = "jdzReQKq3_s";
const SONG_TITLE = "Turn The Lights Off";
const SONG_ARTIST = "Kato Feat. Jon (Nightwhisper Remix)";

export default function MusicPlayer() {
  const { t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  const hasAutoPlayed = useRef(false);

  // Auto-play on first scroll
  useEffect(() => {
    const handleScroll = () => {
      if (hasAutoPlayed.current) return;
      if (window.scrollY > 50) {
        hasAutoPlayed.current = true;
        setIsPlaying(true);
        setExpanded(true);
        // Auto-collapse panel after 3 seconds
        setTimeout(() => setExpanded(false), 3000);
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fake progress bar (YouTube iframe API doesn't easily expose progress)
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.15));
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) setExpanded(true);
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 2, duration: 0.6, ease: "easeOut" }}
      className="fixed left-4 bottom-4 z-50 flex flex-col items-start gap-2"
    >
      {/* Expanded panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-3 w-64 mb-2"
            style={{
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest text-indigo-400/60">
                {t("nowPlaying")}
              </span>
              <button
                onClick={() => setExpanded(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Song info */}
            <div className="flex items-center gap-3 mb-3">
              {/* Album art / vinyl */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={
                  isPlaying
                    ? { repeat: Infinity, duration: 3, ease: "linear" }
                    : { duration: 0.3 }
                }
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                  background:
                    "conic-gradient(from 0deg, #6366f1, #a855f7, #3b82f6, #6366f1)",
                }}
              >
                <div className="w-3 h-3 rounded-full bg-[#0a0a0f]" />
              </motion.div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {SONG_TITLE}
                </p>
                <p className="text-xs text-slate-400 truncate">{SONG_ARTIST}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #6366f1, #a855f7)",
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setProgress(0)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
                }}
              >
                {isPlaying ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => setProgress(0)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>

            {/* Hidden YouTube iframe for actual audio */}
            {isPlaying && (
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_ID}`}
                allow="autoplay"
                className="w-0 h-0 absolute"
                style={{ visibility: "hidden" }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating play button (always visible) */}
      <motion.button
        onClick={() => {
          if (!expanded) {
            setExpanded(true);
            if (!isPlaying) togglePlay();
          } else {
            togglePlay();
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full flex items-center justify-center relative"
        style={{
          background: isPlaying
            ? "linear-gradient(135deg, #6366f1, #a855f7)"
            : "rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: isPlaying
            ? "0 4px 20px rgba(99,102,241,0.5)"
            : "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Spinning ring when playing */}
        {isPlaying && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-0 rounded-full"
            style={{
              border: "2px solid transparent",
              borderTopColor: "rgba(255,255,255,0.3)",
            }}
          />
        )}

        {isPlaying ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </motion.button>
    </motion.div>
  );
}
