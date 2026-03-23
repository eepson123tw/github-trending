/**
 * Sync trending data from Google Apps Script → src/data/trending.json
 *
 * Usage:
 *   npx tsx scripts/sync-data.ts
 *   — or —
 *   pnpm sync
 *
 * Requires APPS_SCRIPT_URL in .env.local (or pass as argument):
 *   npx tsx scripts/sync-data.ts https://script.google.com/macros/s/xxx/exec
 */

import { writeFileSync, readFileSync, existsSync } from "fs";
import { resolve } from "path";

const OUTPUT = resolve(__dirname, "../src/data/trending.json");

async function main() {
  // Resolve URL: CLI arg > .env.local > env var
  let url = process.argv[2] || "";

  if (!url) {
    const envPath = resolve(__dirname, "../.env.local");
    if (existsSync(envPath)) {
      const envContent = readFileSync(envPath, "utf-8");
      const match = envContent.match(/APPS_SCRIPT_URL\s*=\s*(.+)/);
      if (match) url = match[1].trim().replace(/^["']|["']$/g, "");
    }
  }

  if (!url) {
    url = process.env.APPS_SCRIPT_URL || "";
  }

  if (!url) {
    console.error(
      "❌ No APPS_SCRIPT_URL found.\n" +
        "   Set it in .env.local or pass as argument:\n" +
        "   npx tsx scripts/sync-data.ts https://script.google.com/macros/s/xxx/exec"
    );
    process.exit(1);
  }

  console.log(`📡 Fetching from: ${url.slice(0, 60)}...`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 180_000); // 3 min

  const res = await fetch(url, {
    signal: controller.signal,
    headers: { Accept: "application/json" },
    redirect: "follow",
  });
  clearTimeout(timeout);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const data = await res.json();
  const dates = Object.keys(data).sort();

  if (dates.length === 0) {
    throw new Error("Empty response — no dates found");
  }

  // Load existing data to show diff
  let oldDates = 0;
  if (existsSync(OUTPUT)) {
    try {
      const old = JSON.parse(readFileSync(OUTPUT, "utf-8"));
      oldDates = Object.keys(old).length;
    } catch {}
  }

  // Write sorted by date for clean diffs
  const sorted: Record<string, unknown> = {};
  for (const d of dates) {
    sorted[d] = data[d];
  }

  writeFileSync(OUTPUT, JSON.stringify(sorted, null, 0));

  const totalRepos = dates.reduce(
    (sum: number, d: string) => sum + (data[d] as unknown[]).length,
    0
  );

  console.log(`✅ Saved ${dates.length} days (${dates[0]} ~ ${dates[dates.length - 1]})`);
  console.log(`   ${totalRepos} total repo entries`);
  if (oldDates > 0) {
    console.log(`   ${dates.length - oldDates > 0 ? "+" : ""}${dates.length - oldDates} days vs previous`);
  }
  console.log(`   → ${OUTPUT}`);
}

main().catch((err) => {
  console.error("❌ Sync failed:", err.message || err);
  process.exit(1);
});
