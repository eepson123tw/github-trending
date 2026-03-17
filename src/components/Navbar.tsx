"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_ITEMS = [
    { label: t("navTrends"), href: "#trends" },
    { label: t("navTimeline"), href: "#timeline" },
    { label: t("navCategories"), href: "#categories" },
    { label: t("navInsights"), href: "#insights" },
    { label: t("navExplore"), href: "#explore" },
    { label: t("navLeaderboard"), href: "#leaderboard" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {scrolled && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-3 sm:top-4 left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50"
        >
          <div
            className="glass-card px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 flex items-center justify-between sm:justify-start gap-2 sm:gap-3 md:gap-6"
            style={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            <span className="text-xs sm:text-sm font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent sm:mr-2 whitespace-nowrap">
              GH Trending
            </span>

            {/* Desktop links */}
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs text-slate-400 hover:text-white transition-colors whitespace-nowrap hidden md:block"
              >
                {item.label}
              </a>
            ))}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-slate-400 hover:text-white transition-colors p-1"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <path d="M4 8h16" />
                    <path d="M4 16h16" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {/* Mobile dropdown */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="md:hidden glass-card mt-2 px-3 py-2 flex flex-col gap-1"
                style={{
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
                }}
              >
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-xs text-slate-400 hover:text-white transition-colors py-1.5 px-2 rounded-lg hover:bg-white/5"
                  >
                    {item.label}
                  </a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
