<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/D3.js-7-F9A03C?style=for-the-badge&logo=d3.js" />
  <img src="https://img.shields.io/badge/GSAP-3-88CE02?style=for-the-badge&logo=greensock" />
</p>

<h1 align="center">GitHub Trending Observatory</h1>

<p align="center">
  <strong>一整年的 GitHub Trending 資料視覺化觀測站</strong><br/>
  <strong>A year-long GitHub Trending data visualization observatory</strong>
</p>

<p align="center">
  <code>2025-03-27 ~ 2026-03-15 &middot; 354 days &middot; 4,995 repos &middot; 12 categories</code>
</p>

---

## zh-TW | 繁體中文

### 關於這個專案

這是一個以 **GitHub Trending** 每日上榜資料為基礎，打造的互動式資料視覺化網站。我們爬取了從 2025 年 3 月到 2026 年 3 月，整整一年的 GitHub Trending 數據，並透過精心設計的動畫與圖表，呈現開源世界的趨勢脈動。

### 功能亮點

| 區塊 | 說明 |
|------|------|
| **粒子星空** | Canvas 繪製的互動星空背景，滑鼠經過時粒子會閃避，依技術分類著色 |
| **趨勢面積圖** | D3.js 堆疊面積圖，7 天滾動平均平滑處理，hover 高亮各分類 |
| **時間河流** | 垂直時間軸，每月精選代表 Repo，GSAP ScrollTrigger 捲動動畫 |
| **分類氣泡** | D3 力導向模擬氣泡圖，可拖曳互動，12 大技術分類一目瞭然 |
| **洞察卡片** | 6 張精選洞察，揭示年度趨勢中的關鍵發現 |
| **搜尋探索** | 即時搜尋 + 分類篩選，AnimatePresence 流暢過場 |
| **排行榜** | 上榜次數最多的 Top 24 Repos，3D 傾斜卡片特效 |
| **音樂播放器** | 固定左下角，捲動自動播放，旋轉黑膠唱片動畫 |
| **雙語切換** | zh-TW / English 一鍵切換，所有 UI 文字皆支援 i18n |

### 技術架構

```
Next.js 16 (App Router)
├── React 19 + TypeScript 5.9
├── Tailwind CSS 4 — 暗色主題 + Glassmorphism
├── D3.js 7 — 堆疊面積圖 + 力導向氣泡
├── GSAP 3 + ScrollTrigger — 捲動驅動動畫
├── Framer Motion 12 — 元件進場/hover/layout 動畫
├── Lenis — 平滑捲動
└── Canvas API — 粒子星空背景
```

### 分類系統

所有 Repo 依據關鍵字自動分為 **12 個技術分類**：

`AI / ML` `Web Frontend` `Backend / Infra` `DevOps / Cloud` `Mobile` `Security` `Data / DB` `Language / Runtime` `CLI / Tool` `Game / Graphics` `Blockchain` `Other`

---

## EN | English

### About

An interactive data visualization website built on **GitHub Trending** daily data. We collected an entire year of GitHub Trending data (March 2025 – March 2026) and present the pulse of the open-source world through carefully crafted animations and charts.

### Features

| Section | Description |
|---------|-------------|
| **Particle Starfield** | Interactive Canvas background with mouse-repelling particles, colored by tech category |
| **Trend Area Chart** | D3.js stacked area chart with 7-day rolling average smoothing and hover highlights |
| **Timeline River** | Vertical timeline with monthly milestone repos, GSAP scroll-driven animations |
| **Category Bubbles** | D3 force-directed bubble chart, draggable, 12 tech categories at a glance |
| **Insight Cards** | 6 curated insights revealing key findings from the year's trends |
| **Search Explorer** | Real-time search + category filters with smooth AnimatePresence transitions |
| **Leaderboard** | Top 24 repos by appearance count, 3D tilt card effect on hover |
| **Music Player** | Fixed bottom-left, auto-plays on scroll, spinning vinyl animation |
| **Bilingual i18n** | zh-TW / English toggle, all UI text fully internationalized |

### Tech Stack

```
Next.js 16 (App Router)
├── React 19 + TypeScript 5.9
├── Tailwind CSS 4 — Dark theme + Glassmorphism
├── D3.js 7 — Stacked area chart + Force-directed bubbles
├── GSAP 3 + ScrollTrigger — Scroll-driven animations
├── Framer Motion 12 — Enter / hover / layout animations
├── Lenis — Smooth scrolling
└── Canvas API — Particle starfield background
```

### Category System

All repos are auto-categorized into **12 tech categories** via keyword matching:

`AI / ML` `Web Frontend` `Backend / Infra` `DevOps / Cloud` `Mobile` `Security` `Data / DB` `Language / Runtime` `CLI / Tool` `Game / Graphics` `Blockchain` `Other`

---

## Getting Started | 快速開始

```bash
# Install dependencies | 安裝依賴
npm install

# Start dev server | 啟動開發伺服器
npm run dev

# Build for production | 建置正式版
npm run build

# Start production server | 啟動正式伺服器
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Data Source | 資料來源

Data is scraped from [GitHub Trending](https://github.com/trending) daily pages across **354 days** (2025-03-27 ~ 2026-03-15), covering **4,995 repo entries** stored in `src/data/trending.json`.

## License

MIT

