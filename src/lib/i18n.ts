export type Locale = "zh-TW" | "zh-CN" | "en";

export const translations = {
  "zh-TW": {
    // Hero
    heroSubtitle: "Open Source Universe",
    heroTitle: "GitHub Trending",
    heroDesc: "年度趨勢觀測站",
    heroBody: "{{days}} 天、{{repos}} 個開源專案的脈動，\n看見技術世界的潮起潮落",
    statDays: "天數",
    statRepos: "獨立 Repo",
    statAppearances: "上榜次數",
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
    insight5Title: "Claude 生態系爆發成長",
    insight5Desc: "Claude Ecosystem 後半年成長 +110%，2026 Q1 佔比 13.8% 躍升第三大分類，claude-code 與 superpowers 帶動整個生態。",
    insight6Title: "中國開源生態活躍",
    insight6Desc: "alibaba、volcengine、datawhalechina 等組織貢獻大量 AI 工具，中國開發者參與度極高。",
    insight7Title: "85% 都是浮雲",
    insight7Desc: "只有 2.6% 的 repo 能持續上榜超過 16 天，近 85% 在 5 天內就消失 — Trending 的「噪音」極高。",
    insight8Title: "Microsoft 是隱藏冠軍",
    insight8Desc: "37 個 repo、236 次上榜，Microsoft 是 GitHub Trending 上最活躍的組織，主力集中在 AI Agent 領域。",

    // AI Battle
    battleTitle: "AI 生態系對決",
    battleDesc: "五大 AI 巨頭的開源趨勢季度比較 — Claude 是唯一仍在加速的生態",
    battleNote: "統計方式：依據 repo 的作者組織名稱及標題 / 描述中的關鍵字匹配，涵蓋官方與第三方生態項目",
    navBattle: "對決",

    // Durability
    streakLabel: "天連勝",
    badgeEvergreen: "常青",
    badgeSteady: "穩定",
    badgeBurst: "短爆",
    badgeFlash: "閃現",
    filterAll: "全部",
    filterEvergreen: "常青 16+",
    filterSteady: "穩定 6-15",
    filterBurst: "短爆 2-5",

    // Search
    searchTitle: "探索所有 Repo",
    searchDesc: "搜尋關鍵字或按分類篩選",
    searchPlaceholder: "搜尋 repo、作者、描述...",
    searchResults: "筆結果",
    searchFor: "搜尋",
    searchIn: "在",
    loadMore: "載入更多",
    remaining: "筆尚未顯示",
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
    statRepos: "Unique Repos",
    statAppearances: "Appearances",
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
    insight5Title: "Claude Ecosystem Exploded",
    insight5Desc: "Claude Ecosystem grew +110% in the second half, reaching 13.8% share in Q1 2026 as the 3rd largest category — driven by claude-code and superpowers.",
    insight6Title: "China\u2019s OSS Ecosystem Thrived",
    insight6Desc: "alibaba, volcengine, datawhalechina and others contributed heavily to AI tools. Chinese developer participation was extremely high.",
    insight7Title: "85% Are Just Noise",
    insight7Desc: "Only 2.6% of repos stay on trending for 16+ days. Nearly 85% vanish within 5 days — the signal-to-noise ratio is extremely low.",
    insight8Title: "Microsoft Is the Hidden Champion",
    insight8Desc: "37 repos, 236 appearances — Microsoft is the most active organization on GitHub Trending, with a heavy focus on AI Agents.",

    battleTitle: "AI Ecosystem Battle",
    battleDesc: "Quarterly comparison of the Big Five AI ecosystems — Claude is the only one still accelerating",
    battleNote: "Methodology: repos matched by org author name and keyword mentions in title/description, covering both official and community ecosystem projects",
    navBattle: "Battle",

    streakLabel: "-day streak",
    badgeEvergreen: "Evergreen",
    badgeSteady: "Steady",
    badgeBurst: "Burst",
    badgeFlash: "Flash",
    filterAll: "All",
    filterEvergreen: "Evergreen 16+",
    filterSteady: "Steady 6-15",
    filterBurst: "Burst 2-5",

    searchTitle: "Explore All Repos",
    searchDesc: "Search by keyword or filter by category",
    searchPlaceholder: "Search repos, authors, descriptions...",
    searchResults: "results",
    searchFor: "for",
    searchIn: "in",
    loadMore: "Load More",
    remaining: "more to explore",
    noResults: "No repos found",
    noResultsHint: "Try different keywords or clear filters",

    leaderTitle: "Evergreen Leaderboard",
    leaderDesc: "Most frequently trending repos — the truly persistent trends",

    footerData: "Data from",
    footerBuilt: "Built with Next.js · D3.js · Framer Motion",

    nowPlaying: "Now Playing",
  },
  "zh-CN": {
    // Hero
    heroSubtitle: "Open Source Universe",
    heroTitle: "GitHub Trending",
    heroDesc: "年度趋势观测站",
    heroBody: "{{days}} 天、{{repos}} 个开源项目的脉动，\n看见技术世界的潮起潮落",
    statDays: "天数",
    statRepos: "独立 Repo",
    statAppearances: "上榜次数",
    statCategories: "技术分类",
    scrollToExplore: "往下滚动探索",

    // Navbar
    navTrends: "趋势图",
    navTimeline: "时间轴",
    navCategories: "分类",
    navInsights: "洞察",
    navExplore: "探索",
    navLeaderboard: "排行榜",

    // Trend Chart
    trendTitle: "趋势演变",
    trendDesc: "河流图呈现各分类此消彼长的趋势 — 点击分类可聚焦查看",
    trendHintStream: "悬停查看数值 · 点击分类名称聚焦单一趋势",
    trendHintIsolated: "查看单一分类的趋势走势 · 点击「返回总览」回到河流图",
    trendBackToOverview: "返回总览",
    trendBandwidthHint: "色带宽度 ＝ 该分类每周上榜数量",

    // Timeline
    timelineTitle: "时间河流",
    timelineDesc: "滚动穿越一整年的开源趋势 — 每月精选代表 Repo",
    spring2025: "2025 春",
    summer2025: "2025 夏",
    autumn2025: "2025 秋",
    winter2025: "2025 冬",
    spring2026: "2026 春",

    // Category Bubbles
    catTitle: "分类生态圈",
    catDesc: "{{uniqueRepos}} 个 Repo 的知识图谱 — 每个点都是一个开源项目",
    catHint: "滚轮缩放 · 拖拽移动 · 悬停查看 · 点击 Repo 打开 GitHub",

    // Insights
    insightTitle: "趋势洞察",
    insightDesc: "从 {{days}} 天的数据中提炼出的关键发现",
    insight1Title: "AI Agent 主宰一整年",
    insight1Desc: "从教学入门到生产级框架，Agent 相关 repo 在每个季度都占据 trending 最大份额。",
    insight2Title: "MCP 半年征服世界",
    insight2Desc: "Model Context Protocol 从 2025 年 9 月首次出现到被 Docker、Chrome、Figma 采用，只花了 6 个月。",
    insight3Title: "AI 记忆系统四代演化",
    insight3Desc: "mem0 → graphiti → Memori → OpenViking，从简单记忆到上下文数据库的完整进化路线。",
    insight4Title: "RAG 从教学走向产品",
    insight4Desc: "年初是 all-rag-techniques 教学文，年底是 openrag 一站式平台，技术成熟度大幅提升。",
    insight5Title: "Claude 生态系爆发成长",
    insight5Desc: "Claude Ecosystem 后半年成长 +110%，2026 Q1 占比 13.8% 跃升第三大分类，claude-code 与 superpowers 带动整个生态。",
    insight6Title: "中国开源生态活跃",
    insight6Desc: "alibaba、volcengine、datawhalechina 等组织贡献大量 AI 工具，中国开发者参与度极高。",
    insight7Title: "85% 都是浮云",
    insight7Desc: "只有 2.6% 的 repo 能持续上榜超过 16 天，近 85% 在 5 天内就消失 — Trending 的「噪音」极高。",
    insight8Title: "Microsoft 是隐藏冠军",
    insight8Desc: "37 个 repo、236 次上榜，Microsoft 是 GitHub Trending 上最活跃的组织，主力集中在 AI Agent 领域。",

    battleTitle: "AI 生态系对决",
    battleDesc: "五大 AI 巨头的开源趋势季度比较 — Claude 是唯一仍在加速的生态",
    battleNote: "统计方式：依据 repo 的作者组织名称及标题 / 描述中的关键字匹配，涵盖官方与第三方生态项目",
    navBattle: "对决",

    streakLabel: "天连胜",
    badgeEvergreen: "常青",
    badgeSteady: "稳定",
    badgeBurst: "短爆",
    badgeFlash: "闪现",
    filterAll: "全部",
    filterEvergreen: "常青 16+",
    filterSteady: "稳定 6-15",
    filterBurst: "短爆 2-5",

    // Search
    searchTitle: "探索所有 Repo",
    searchDesc: "搜索关键字或按分类筛选",
    searchPlaceholder: "搜索 repo、作者、描述...",
    searchResults: "条结果",
    searchFor: "搜索",
    searchIn: "在",
    loadMore: "加载更多",
    remaining: "条尚未显示",
    noResults: "找不到相关 Repo",
    noResultsHint: "试试其他关键字或清除筛选",

    // Leaderboard
    leaderTitle: "常青排行榜",
    leaderDesc: "重复上榜次数最多的 Repo — 真正的持久趋势",

    // Footer
    footerData: "数据来源",
    footerBuilt: "使用 Next.js · D3.js · Framer Motion 打造",

    // Music Player
    nowPlaying: "正在播放",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];
