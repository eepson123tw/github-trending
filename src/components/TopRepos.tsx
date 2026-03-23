"use client";

import { motion } from "framer-motion";
import type { DailyData } from "@/lib/categories";
import { getTopRepos } from "@/lib/categories";
import RepoCard from "./RepoCard";
import { useI18n } from "@/lib/i18n-context";

interface Props {
  data: DailyData;
}

export default function TopRepos({ data }: Props) {
  const { t } = useI18n();
  const topRepos = getTopRepos(data).slice(0, 24);

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
          <span className="bg-linear-to-r from-purple-400 to-rose-400 bg-clip-text text-transparent">
            {t("leaderTitle")}
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-500 mb-8 sm:mb-10">
          {t("leaderDesc")}
        </p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } },
          }}
        >
          {topRepos.map((repo, i) => (
            <motion.div
              key={`${repo.author}-${repo.title}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
              }}
            >
              <RepoCard
                repo={repo}
                category={repo.category}
                appearances={repo.appearances}
                longestStreak={repo.longestStreak}
                durability={repo.durability}
                index={i}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
