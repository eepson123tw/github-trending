"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);

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
    window.addEventListener("scroll", onScroll);
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
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className="glass-card px-4 md:px-6 py-2.5 flex items-center gap-3 md:gap-6"
            style={{
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            <span className="text-sm font-bold bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mr-2">
              GH Trending
            </span>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs text-slate-400 hover:text-white transition-colors whitespace-nowrap hidden md:block"
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
