"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";

const YOUTUBE_ID = "jdzReQKq3_s";
const SONG_TITLE = "Turn The Lights Off";
const SONG_ARTIST = "Kato Feat. Jon (Nightwhisper Remix)";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function MusicPlayer() {
  const { t } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const containerDivRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const hasPrompted = useRef(false);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    window.onYouTubeIframeAPIReady = () => initPlayer();

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);

    return () => {
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, []);

  const initPlayer = useCallback(() => {
    if (playerRef.current || !containerDivRef.current) return;

    // Create a div for the player
    const el = document.createElement("div");
    el.id = "yt-music-player";
    containerDivRef.current.appendChild(el);

    playerRef.current = new window.YT.Player("yt-music-player", {
      height: "0",
      width: "0",
      videoId: YOUTUBE_ID,
      playerVars: {
        autoplay: 0,
        loop: 1,
        playlist: YOUTUBE_ID,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
      },
      events: {
        onReady: () => setReady(true),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onStateChange: (e: any) => {
          // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
          if (e.data === 1) setIsPlaying(true);
          else if (e.data === 2 || e.data === 0) setIsPlaying(false);
        },
      },
    });
  }, []);

  // Show prompt on first scroll
  useEffect(() => {
    const handleScroll = () => {
      if (hasPrompted.current) return;
      if (window.scrollY > 80) {
        hasPrompted.current = true;
        setExpanded(true);
        setShowPrompt(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Progress tracking
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (!playerRef.current?.getDuration) return;
        const dur = playerRef.current.getDuration();
        const cur = playerRef.current.getCurrentTime();
        if (dur > 0) setProgress((cur / dur) * 100);
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const play = () => {
    if (!playerRef.current) return;
    playerRef.current.playVideo();
    setShowPrompt(false);
    setExpanded(true);
    setTimeout(() => setExpanded(false), 3000);
  };

  const pause = () => {
    if (!playerRef.current) return;
    playerRef.current.pauseVideo();
  };

  const togglePlay = () => {
    if (isPlaying) pause();
    else play();
  };

  return (
    <>
      {/* Hidden YouTube player container */}
      <div
        ref={containerDivRef}
        className="fixed"
        style={{ width: 0, height: 0, overflow: "hidden", bottom: 0, left: 0, zIndex: -1 }}
      />

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.6, ease: "easeOut" }}
        className="fixed left-3 sm:left-4 bottom-3 sm:bottom-4 z-50 flex flex-col items-start gap-2"
      >
        {/* Expanded panel */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-3 w-56 sm:w-64 mb-2"
              style={{
                boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-widest text-indigo-400/60">
                  {t("nowPlaying")}
                </span>
                <button
                  onClick={() => { setExpanded(false); setShowPrompt(false); }}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Song info */}
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={isPlaying ? { repeat: Infinity, duration: 3, ease: "linear" } : { duration: 0.3 }}
                  className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
                  style={{ background: "conic-gradient(from 0deg, #6366f1, #a855f7, #3b82f6, #6366f1)" }}
                >
                  <div className="w-3 h-3 rounded-full bg-[#0a0a0f]" />
                </motion.div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{SONG_TITLE}</p>
                  <p className="text-xs text-slate-400 truncate">{SONG_ARTIST}</p>
                </div>
              </div>

              {/* Tap to play prompt */}
              {showPrompt && !isPlaying && (
                <button
                  onClick={play}
                  className="w-full py-2 mb-2 rounded-lg text-xs font-medium text-white transition-all hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
                  }}
                >
                  {ready ? "▶ Tap to Play" : "Loading..."}
                </button>
              )}

              {/* Equalizer wave bars */}
              {isPlaying && (
                <div className="flex items-end justify-center gap-[3px] h-6 mb-3">
                  <div className="eq-bar" />
                  <div className="eq-bar" />
                  <div className="eq-bar" />
                  <div className="eq-bar" />
                  <div className="eq-bar" />
                </div>
              )}

              {/* Progress bar */}
              {isPlaying && (
                <>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{
                        width: `${progress}%`,
                        background: "linear-gradient(90deg, #6366f1, #a855f7)",
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <button onClick={togglePlay} className="text-slate-400 hover:text-white transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating play button */}
        <motion.button
          onClick={() => {
            if (!expanded) {
              setExpanded(true);
              if (!isPlaying) {
                setShowPrompt(true);
              }
            } else if (!isPlaying) {
              play();
            } else {
              togglePlay();
            }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center relative"
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
          {isPlaying && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-0 rounded-full"
              style={{ border: "2px solid transparent", borderTopColor: "rgba(255,255,255,0.3)" }}
            />
          )}
          {isPlaying ? (
            <div className="flex items-end justify-center gap-[2px] h-4">
              <div className="eq-bar" style={{ width: 2 }} />
              <div className="eq-bar" style={{ width: 2 }} />
              <div className="eq-bar" style={{ width: 2 }} />
              <div className="eq-bar" style={{ width: 2 }} />
            </div>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>
      </motion.div>
    </>
  );
}
