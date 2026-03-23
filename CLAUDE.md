# CLAUDE.md — GitHub Trending Observatory

## Project Overview

A single-page interactive data visualization site that presents 354+ days of GitHub Trending data. Built as an observatory — visitors explore trends, play games, and discover insights about the open-source ecosystem.

**Live site**: Deployed via Zeabur (ISR every 24 hours)

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5.9
- **Styling**: Tailwind CSS 4.2 with glass-morphism design system (`glass-card` class)
- **Visualization**: D3.js 7 (stream graphs, force simulation, grouped bar charts)
- **Animation**: Framer Motion (scroll-reveal, transitions), GSAP + ScrollTrigger (timeline), Lenis (smooth scroll)
- **Package manager**: pnpm
- **Build**: `pnpm build` (Turbopack)

## Architecture

### Data Flow
1. **Data source**: [Google Sheets](REDACTED) — the primary database storing daily GitHub Trending scrape results
2. `src/lib/sheets.ts` — fetches data via Google Apps Script (`APPS_SCRIPT_URL` env var), falls back to `public/trending_data.json` (1.1MB, ~5000 records) when unavailable
3. `src/lib/categories.ts` — core data layer: 18 categories with keyword-based classification, streak/durability/momentum computation, AI ecosystem grouping
4. `src/app/page.tsx` — server component, calls `fetchTrendingData()` + `computeStats()`, passes data to all client components
5. ISR: `revalidate = 86400` (24h)

### i18n System
- `src/lib/i18n.ts` — 3 locales: `zh-TW` (default), `zh-CN`, `en`
- `src/lib/i18n-context.tsx` — React context providing `t()` and `locale`
- **Critical**: `TranslationKey` type is derived from `en` locale keys. All 3 locales MUST have identical keys or TypeScript will error. When adding a key, add to ALL 3 locales simultaneously.

### Page Sections (top to bottom)
| Order | Section | Component | Type |
|-------|---------|-----------|------|
| 1 | Hero | `HeroSection` | Passive |
| 2 | Quiz | `TrendGuessGame` | Interactive — 3-round game (draw, slider, multiple choice) |
| 3 | Trends | `TrendChart` | D3 stream graph with momentum arrows |
| 4 | Timeline | `TimelineRiver` | GSAP scroll-linked horizontal timeline |
| 5 | Categories | `CategoryBubbles` | D3 force simulation bubble chart |
| 6 | Insights | `InsightCards` | 8 curated insight cards |
| 7 | AI Battle | `AIEcosystemBattle` | D3 grouped bar chart — 5 AI ecosystems by quarter |
| 8 | Racing | `RacingBarChart` | Animated cumulative bar race with play/pause/speed |
| 9 | On This Day | `OnThisDay` | Date picker showing repos trending on any day |
| 10 | Search | `SearchExplorer` | Full-text search with category + durability filters |
| 11 | Leaderboard | `TopRepos` | Top repos by appearances with streak badges |

### Shared Components
- `Navbar` — sticky nav, appears after scrolling 100px, IntersectionObserver-based active section tracking
- `StarField` — canvas particle background
- `SmoothScroll` — Lenis smooth scrolling wrapper
- `MusicPlayer` — ambient background music
- `LanguageSwitcher` — floating locale picker
- `RepoCard` — reusable repo display with durability badge + streak label
- `AnimatedCounter` — number counting animation

## Key Patterns

### Category System (`categories.ts`)
- 18 categories (Claude Ecosystem, MCP, AI Agent, RAG, LLM/Model, AI Tools, Web/Frontend, Developer Tools, DevOps/Infra, Data/Database, AI Finance, Mobile, Media/Content, Blockchain/Crypto, Education, Security, Messaging/Social, Other)
- Two match modes: substring match for unambiguous keywords, word-boundary regex for short/ambiguous ones
- Pre-compiled regex cache for performance

### Durability Model
- **Evergreen** (16+ days): 2.6% of repos
- **Steady** (6-15 days): ~12%
- **Burst** (2-5 days): ~40%
- **Flash** (1 day): ~45%

### AI Ecosystem Matching
- Matches repos by org author name + title/description keywords
- Covers: Claude/Anthropic, OpenAI, Google, Microsoft, Meta
- Includes both official and community ecosystem projects


## Commands

```bash
pnpm dev          # Development server (Turbopack)
pnpm build        # Production build
pnpm start        # Serve production build
pnpm lint         # ESLint
pnpm sync         # Sync latest data from Google Sheets → src/data/trending.json
```

## Data Update Workflow

1. **Sync static JSON**: `pnpm sync` (requires `APPS_SCRIPT_URL` in `.env.local` or as CLI arg)
2. **Production ISR**: Set `APPS_SCRIPT_URL` env var on Zeabur → auto-refreshes every 24h
3. **Manual sync**: `npx tsx scripts/sync-data.ts https://script.google.com/macros/s/xxx/exec`

To set up:
```bash
# .env.local
APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## Important Constraints

- All components under `src/components/` are client components (`"use client"`)
- `page.tsx` is the only server component — it fetches data and passes it down as props
- D3 operations must run inside `useEffect` with refs (no SSR)
- Color values for categories are defined in `CATEGORIES` array — avoid collisions when adding new ones
- The `glass-card` CSS class is defined in `src/app/globals.css`
- Framer Motion's `whileInView` with `viewport={{ once: true }}` is the standard scroll-reveal pattern
- Gradient text uses `bg-linear-to-r from-X to-Y bg-clip-text text-transparent`
