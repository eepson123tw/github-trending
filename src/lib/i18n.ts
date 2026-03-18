export type Locale = "zh-TW" | "en";

export const translations = {
  "zh-TW": {
    // Hero
    heroSubtitle: "Open Source Universe",
    heroTitle: "GitHub Trending",
    heroDesc: "年度趨勢觀測站",
    heroBody: "{{days}} 天、{{repos}} 個開源專案的脈動，\n看見技術世界的潮起潮落",
    statDays: "天數",
    statRepos: "Repos 收錄",
    statCategories: "技術分類",
    scrollToExplore: "往下滾動探索",

    // Navbar
    navTrends: "趨勢圖",
    navTimeline: "時間軸",
    navCategories: "分類",
    navInsights: "洞察",
    navExplore: "探索",
    navLeaderboard: "排行榜",

    // Trend Chart
    trendTitle: "趨勢演變",
    trendDesc: "河流圖呈現各分類此消彼長的趨勢 — 點擊分類可聚焦查看",
    trendHintStream: "懸停查看數值 · 點擊分類名稱聚焦單一趨勢",
    trendHintIsolated: "查看單一分類的趨勢走勢 · 點擊「返回總覽」回到河流圖",
    trendBackToOverview: "返回總覽",
    trendBandwidthHint: "色帶寬度 ＝ 該分類每週上榜數量",

    // Timeline
    timelineTitle: "時間河流",
    timelineDesc: "滾動穿越一整年的開源趨勢 — 每月精選代表 Repo",
    spring2025: "2025 春",
    summer2025: "2025 夏",
    autumn2025: "2025 秋",
    winter2025: "2025 冬",
    spring2026: "2026 春",

    // Category Bubbles
    catTitle: "分類生態圈",
    catDesc: "{{uniqueRepos}} 個 Repo 的知識圖譜 — 每個點都是一個開源專案",
    catHint: "滾輪縮放 · 拖曳移動 · 懸停查看 · 點擊 Repo 開啟 GitHub",

    // Insights
    insightTitle: "趨勢洞察",
    insightDesc: "從 {{days}} 天的資料中提煉出的關鍵發現",
    insight1Title: "AI Agent 主宰一整年",
    insight1Desc: "從教學入門到生產級框架，Agent 相關 repo 在每個季度都佔據 trending 最大份額。",
    insight2Title: "MCP 半年征服世界",
    insight2Desc: "Model Context Protocol 從 2025 年 9 月首次出現到被 Docker、Chrome、Figma 採用，只花了 6 個月。",
    insight3Title: "AI 記憶系統四代演化",
    insight3Desc: "mem0 → graphiti → Memori → OpenViking，從簡單記憶到上下文資料庫的完整進化路線。",
    insight4Title: "RAG 從教學走向產品",
    insight4Desc: "年初是 all-rag-techniques 教學文，年底是 openrag 一站式平台，技術成熟度大幅提升。",
    insight5Title: "AI 金融持續熱門",
    insight5Desc: "ai-hedge-fund 跨越三個季度反覆上榜，顯示 AI + Finance 是持久性需求而非一時話題。",
    insight6Title: "中國開源生態活躍",
    insight6Desc: "alibaba、volcengine、datawhalechina 等組織貢獻大量 AI 工具，中國開發者參與度極高。",

    // Search
    searchTitle: "探索所有 Repo",
    searchDesc: "搜尋關鍵字或按分類篩選",
    searchPlaceholder: "搜尋 repo、作者、描述...",
    searchResults: "筆結果",
    searchFor: "搜尋",
    searchIn: "在",
    noResults: "找不到相關 Repo",
    noResultsHint: "試試其他關鍵字或清除篩選",

    // Leaderboard
    leaderTitle: "常青排行榜",
    leaderDesc: "重複上榜次數最多的 Repo — 真正的持久趨勢",

    // Footer
    footerData: "資料來源",
    footerBuilt: "使用 Next.js · D3.js · Framer Motion 打造",

    // Music Player
    nowPlaying: "正在播放",
  },
  en: {
    heroSubtitle: "Open Source Universe",
    heroTitle: "GitHub Trending",
    heroDesc: "Annual Trend Observatory",
    heroBody: "{{days}} days, {{repos}} open-source projects\u2019 pulse.\nWitness the rise and fall of the tech world.",
    statDays: "Days",
    statRepos: "Repos Tracked",
    statCategories: "Categories",
    scrollToExplore: "Scroll to explore",

    navTrends: "Trends",
    navTimeline: "Timeline",
    navCategories: "Categories",
    navInsights: "Insights",
    navExplore: "Explore",
    navLeaderboard: "Leaderboard",

    trendTitle: "Trend Evolution",
    trendDesc: "Stream graph showing the ebb and flow of each category — click to focus",
    trendHintStream: "Hover for values · click a category to see its solo trend",
    trendHintIsolated: "Viewing solo trend · click 'Back to Overview' to return",
    trendBackToOverview: "Back to Overview",
    trendBandwidthHint: "Band width = weekly trending count per category",

    timelineTitle: "Time River",
    timelineDesc: "Scroll through a full year of open-source trends — monthly highlights",
    spring2025: "2025 Spring",
    summer2025: "2025 Summer",
    autumn2025: "2025 Autumn",
    winter2025: "2025 Winter",
    spring2026: "2026 Spring",

    catTitle: "Category Ecosystem",
    catDesc: "Knowledge graph of {{uniqueRepos}} repos — every dot is an open-source project",
    catHint: "Scroll to zoom · drag to move · hover to explore · click repo to open GitHub",

    insightTitle: "Trend Insights",
    insightDesc: "Key findings distilled from {{days}} days of data",
    insight1Title: "AI Agents Dominated All Year",
    insight1Desc: "From beginner tutorials to production frameworks, Agent repos held the largest trending share every quarter.",
    insight2Title: "MCP Conquered in 6 Months",
    insight2Desc: "Model Context Protocol went from first appearance in Sep 2025 to adoption by Docker, Chrome, and Figma in just 6 months.",
    insight3Title: "AI Memory: 4 Generations",
    insight3Desc: "mem0 → graphiti → Memori → OpenViking — a complete evolution from simple memory to context databases.",
    insight4Title: "RAG: Tutorials to Products",
    insight4Desc: "Started with all-rag-techniques tutorials, ended with openrag as a full platform. Massive maturity leap.",
    insight5Title: "AI Finance Stayed Hot",
    insight5Desc: "ai-hedge-fund appeared across 3 quarters, proving AI + Finance is sustained demand, not a fad.",
    insight6Title: "China\u2019s OSS Ecosystem Thrived",
    insight6Desc: "alibaba, volcengine, datawhalechina and others contributed heavily to AI tools. Chinese developer participation was extremely high.",

    searchTitle: "Explore All Repos",
    searchDesc: "Search by keyword or filter by category",
    searchPlaceholder: "Search repos, authors, descriptions...",
    searchResults: "results",
    searchFor: "for",
    searchIn: "in",
    noResults: "No repos found",
    noResultsHint: "Try different keywords or clear filters",

    leaderTitle: "Evergreen Leaderboard",
    leaderDesc: "Most frequently trending repos — the truly persistent trends",

    footerData: "Data from",
    footerBuilt: "Built with Next.js · D3.js · Framer Motion",

    nowPlaying: "Now Playing",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];
