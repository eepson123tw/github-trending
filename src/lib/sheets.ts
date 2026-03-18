import type { DailyData } from "./categories";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "";

export async function fetchTrendingData(): Promise<DailyData> {
  if (!APPS_SCRIPT_URL) {
    console.warn("[sheets] APPS_SCRIPT_URL not set, falling back to static JSON");
    const json = await import("@/data/trending.json");
    return json.default as DailyData;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120_000); // 2 min timeout

    const res = await fetch(APPS_SCRIPT_URL, {
      next: { revalidate: 86400 }, // ISR: re-fetch every 24 hours
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Google Apps Script responded ${res.status}`);
    }

    const data: DailyData = await res.json();

    // Sanity check: must have at least one date key
    const dates = Object.keys(data);
    if (dates.length === 0) {
      throw new Error("Empty response from Google Apps Script");
    }

    console.log(`[sheets] Fetched ${dates.length} days of trending data`);
    return data;
  } catch (err) {
    console.error("[sheets] Fetch failed, falling back to static JSON:", err);
    const json = await import("@/data/trending.json");
    return json.default as DailyData;
  }
}
