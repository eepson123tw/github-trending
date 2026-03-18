<p align="right">
  <a href="./README.md">繁體中文</a> | <strong>简体中文</strong> | <a href="./README.en.md">English</a>
</p>

<h1 align="center">GitHub Trending Observatory</h1>

<p align="center">
  <strong>一整年的开源趋势，一个网站看完。</strong>
</p>

<p align="center">
  <a href="https://github-trending.zeabur.app">github-trending.zeabur.app</a>
</p>

<p align="center">
  <code>数据每日动态更新 · 天数 / Repo 数 / 分类数皆由 Google Sheets 实时计算</code>
</p>

---

## 这个网站能帮你什么？

> **如果你想知道过去一年开源圈到底在火什么，这里有答案。**

- **快速掌握趋势** — 河流图一眼看出 AI Agent、MCP、RAG 各分类在哪个月爆发、哪个月退烧
- **发现值得关注的项目** — 所有不重复 Repo 全部收录，搜索 / 筛选 / 排行榜帮你快速挖宝
- **看见技术演化脉络** — 时间轴按月展示代表项目，从 AI 记忆系统四代演化到 MCP 半年征服世界
- **找到持久趋势 vs. 一时话题** — 排行榜揭示哪些 Repo 反复上榜（真正的常青树），而非昙花一现
- **作为技术决策参考** — 想选型 AI 框架？看看 trending 数据怎么说
- **Obsidian 风格知识图谱** — 所有 Repo 的关联图，看见分类之间的交叉与连结

---

## 功能一览

| | 功能 | 你可以做什么 |
|---|------|-------------|
| **River** | 趋势河流图 | 看各分类此消彼长，点击聚焦单一分类的真实走势 |
| **Timeline** | 时间轴 | 逐月回顾代表项目，理解技术演变脉络 |
| **Graph** | 知识图谱 | 拖拽、缩放探索所有 Repo 的分类关联 |
| **Insights** | 趋势洞察 | 6 个从数据中提炼的关键发现 |
| **Search** | 搜索探索 | 即时搜索 + 分类筛选 + Load More 渐进加载 |
| **Leaderboard** | 排行榜 | 上榜最多次的 Repo，看见真正的持久趋势 |
| **i18n** | 多语系 | 繁体中文 · 简体中文 · English 三语切换，自动检测浏览器语系 |
| **Navbar** | 导航栏 | 滚动时自动高亮当前区段 |

---

## 数据架构

```
Google Sheets (每日爬取 GitHub Trending)
  ↓ Apps Script Web App API
Next.js Server (ISR，每 24 小时 revalidate)
  ↓ 失败时 fallback
src/data/trending.json (静态备份)
```

- **数据来源** — GitHub Trending 每日页面，自 2025-03 起持续收录
- **动态统计** — 首页的天数、Repo 数、分类数皆由 `getStats()` 从实际数据实时计算
- **分类系统** — 关键字匹配 + 正则边界检查，自动将 Repo 归入 12+ 技术分类
- **更新频率** — ISR 每 24 小时从 Google Sheets 拉取最新数据，无需重新部署

---

## 快速开始

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

Next.js 16 · React 19 · TypeScript · D3.js · GSAP · Framer Motion · Tailwind CSS 4 · Canvas API

## License

MIT
