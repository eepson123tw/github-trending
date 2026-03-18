<p align="right">
  <a href="./README.md">繁體中文</a> | <a href="./README.zh-CN.md">简体中文</a> | <strong>English</strong>
</p>

<h1 align="center">GitHub Trending Observatory</h1>

<p align="center">
  <strong>One year of open-source trends. One site to see it all.</strong>
</p>

<p align="center">
  <a href="https://github-trending.zeabur.app">github-trending.zeabur.app</a>
</p>

<p align="center">
  <code>Data updates daily · Days / repos / categories computed dynamically from Google Sheets</code>
</p>

---

## What can this site do for you?

> **Want to know what's been hot in open source this past year? Here's your answer.**

- **Grasp trends instantly** — Stream graph shows exactly when AI Agent, MCP, RAG surged or faded
- **Discover projects worth watching** — All unique repos indexed with search, filters, and leaderboards
- **See how tech evolved** — Monthly timeline from AI memory systems' 4 generations to MCP's 6-month world takeover
- **Separate lasting trends from hype** — Leaderboard reveals which repos kept trending (true evergreens)
- **Inform your tech decisions** — Choosing an AI framework? See what the trending data says
- **Obsidian-style knowledge graph** — All repos visualized with cross-category connections

---

## Features

| | Feature | What you can do |
|---|---------|----------------|
| **River** | Trend Stream Graph | See categories ebb and flow; click to isolate a single trend |
| **Timeline** | Time River | Monthly highlights tracing how tech evolved over the year |
| **Graph** | Knowledge Graph | Drag, zoom, and explore all repos by category |
| **Insights** | Trend Insights | 6 key findings distilled from the data |
| **Search** | Explore All Repos | Real-time search + category filters + Load More pagination |
| **Leaderboard** | Evergreen Leaderboard | Most frequently trending repos — the truly persistent trends |
| **i18n** | Multi-language | 繁體中文 · 简体中文 · English with auto browser detection |
| **Navbar** | Navigation | Auto-highlights the current section on scroll |

---

## Data Architecture

```
Google Sheets (daily GitHub Trending scrape)
  ↓ Apps Script Web App API
Next.js Server (ISR, revalidates every 24 hours)
  ↓ fallback on failure
src/data/trending.json (static backup)
```

- **Source** — GitHub Trending daily page, continuously collected since March 2025
- **Dynamic stats** — Hero section stats (days, repos, categories) are computed at runtime via `getStats()`
- **Categorization** — Keyword matching + regex word-boundary checks, auto-classifying repos into 12+ tech categories
- **Refresh cycle** — ISR fetches latest data from Google Sheets every 24 hours, no redeployment needed

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

Next.js 16 · React 19 · TypeScript · D3.js · GSAP · Framer Motion · Tailwind CSS 4 · Canvas API

## License

MIT
