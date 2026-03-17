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
    <section className="relative py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-linear-to-r from-purple-400 to-rose-400 bg-clip-text text-transparent">
            {t("leaderTitle")}
          </span>
        </h2>
        <p className="text-slate-500 mb-10">
          {t("leaderDesc")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topRepos.map((repo, i) => (
            <RepoCard
              key={`${repo.author}-${repo.title}`}
              repo={repo}
              category={repo.category}
              appearances={repo.appearances}
              index={i}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
