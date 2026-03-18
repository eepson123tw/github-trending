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
  <code>資料每日動態更新 · 天數 / Repo 數 / 分類數皆由 Google Sheets 即時計算</code>
</p>

---

## 這個網站能幫你什麼？

> **如果你想知道過去一年開源圈到底在紅什麼，這裡有答案。**

- **快速掌握趨勢** — 河流圖一眼看出 AI Agent、MCP、RAG 各分類在哪個月爆發、哪個月退燒
- **發現值得關注的專案** — 所有不重複 Repo 全部收錄，搜尋 / 篩選 / 排行榜幫你快速挖寶
- **看見技術演化脈絡** — 時間軸按月展示代表專案，從 AI 記憶系統四代演化到 MCP 半年征服世界
- **找到持久趨勢 vs. 一時話題** — 排行榜揭示哪些 Repo 反覆上榜（真正的常青樹），而非曇花一現
- **作為技術決策參考** — 想選型 AI 框架？看看 trending 數據怎麼說
- **Obsidian 風格知識圖譜** — 所有 Repo 的關聯圖，看見分類之間的交叉與連結

---

## 功能一覽

| | 功能 | 你可以做什麼 |
|---|------|-------------|
| **River** | 趨勢河流圖 | 看各分類此消彼長，點擊聚焦單一分類的真實走勢 |
| **Timeline** | 時間軸 | 逐月回顧代表專案，理解技術演變脈絡 |
| **Graph** | 知識圖譜 | 拖曳、縮放探索所有 Repo 的分類關聯 |
| **Insights** | 趨勢洞察 | 6 個從數據中提煉的關鍵發現 |
| **Search** | 搜尋探索 | 即時搜尋 + 分類篩選 + Load More 漸進載入 |
| **Leaderboard** | 排行榜 | 上榜最多次的 Repo，看見真正的持久趨勢 |
| **i18n** | 多語系 | 繁體中文 · 简体中文 · English 三語切換，自動偵測瀏覽器語系 |
| **Navbar** | 導覽列 | 滾動時自動高亮當前區段 |

---

## 資料架構

```
Google Sheets (每日爬取 GitHub Trending)
  ↓ Apps Script Web App API
Next.js Server (ISR，每 24 小時 revalidate)
  ↓ 失敗時 fallback
src/data/trending.json (靜態備份)
```

- **資料來源** — GitHub Trending 每日頁面，自 2025-03 起持續收錄
- **動態統計** — 首頁的天數、Repo 數、分類數皆由 `getStats()` 從實際資料即時計算
- **分類系統** — 關鍵字匹配 + 正則邊界檢查，自動將 Repo 歸入 12+ 技術分類
- **更新頻率** — ISR 每 24 小時從 Google Sheets 拉取最新資料，無需重新部署

---

## 快速開始

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

Next.js 16 · React 19 · TypeScript · D3.js · GSAP · Framer Motion · Tailwind CSS 4 · Canvas API

## License

MIT
