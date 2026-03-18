<p align="right">
  <strong>繁體中文</strong> | <a href="./README.zh-CN.md">简体中文</a> | <a href="./README.en.md">English</a>
</p>

<h1 align="center">GitHub Trending Observatory</h1>

<p align="center">
  <strong>一整年的開源趨勢，一個網站看完。</strong>
</p>

<p align="center">
  <a href="https://github-trending.zeabur.app">github-trending.zeabur.app</a>
</p>

<p align="center">
  <code>354 days · 4,995 repos · 12 categories · 2025-03 ~ 2026-03</code>
</p>

---

## 這個網站能幫你什麼？

> **如果你想知道過去一年開源圈到底在紅什麼，這裡有答案。**

- **快速掌握趨勢** — 河流圖一眼看出 AI Agent、MCP、RAG 各分類在哪個月爆發、哪個月退燒
- **發現值得關注的專案** — 1,442 個不重複 Repo 全部收錄，搜尋 / 篩選 / 排行榜幫你快速挖寶
- **看見技術演化脈絡** — 時間軸按月展示代表專案，從 AI 記憶系統四代演化到 MCP 半年征服世界
- **找到持久趨勢 vs. 一時話題** — 排行榜揭示哪些 Repo 反覆上榜（真正的常青樹），而非曇花一現
- **作為技術決策參考** — 想選型 AI 框架？看看 trending 數據怎麼說
- **Obsidian 風格知識圖譜** — 1,442 個 Repo 的關聯圖，看見分類之間的交叉與連結

---

## 功能一覽

| | 功能 | 你可以做什麼 |
|---|------|-------------|
| **River** | 趨勢河流圖 | 看各分類此消彼長，點擊聚焦單一分類的真實走勢 |
| **Timeline** | 時間軸 | 逐月回顧代表專案，理解技術演變脈絡 |
| **Graph** | 知識圖譜 | 拖曳、縮放探索 1,442 個 Repo 的分類關聯 |
| **Insights** | 趨勢洞察 | 6 個從數據中提煉的關鍵發現 |
| **Search** | 搜尋探索 | 即時搜尋 + 分類篩選 + Load More 漸進載入 |
| **Leaderboard** | 排行榜 | 上榜最多次的 Repo，看見真正的持久趨勢 |
| **i18n** | 多語系 | 繁體中文 · 简体中文 · English 三語切換，自動偵測瀏覽器語系 |
| **Navbar** | 導覽列 | 滾動時自動高亮當前區段 |

---

## 快速開始

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 資料來源

GitHub Trending 每日頁面，354 天（2025-03-27 ~ 2026-03-15），4,995 筆 Repo 紀錄，存於 `src/data/trending.json`。

## Tech Stack

Next.js 16 · React 19 · TypeScript · D3.js · GSAP · Framer Motion · Tailwind CSS 4 · Canvas API

## License

MIT
