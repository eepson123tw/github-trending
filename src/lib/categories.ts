export interface Repo {
  title: string;
  author: string;
  description: string;
  url?: string;
  date?: string;
}

export interface CategoryDef {
  name: string;
  color: string;
  hue: number;
  keywords: string[];
  /** Keywords that require word-boundary matching (short/ambiguous terms) */
  wordKeywords?: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    name: "Claude Ecosystem",
    color: "#f59e0b",
    hue: 40,
    keywords: ["claude", "anthropic"],
  },
  {
    name: "MCP",
    color: "#a855f7",
    hue: 270,
    keywords: ["model context protocol", "context protocol"],
    wordKeywords: ["mcp"],
  },
  {
    name: "AI Agent",
    color: "#3b82f6",
    hue: 220,
    keywords: [
      "agentic",
      "multi-agent",
      "autonomous",
      "langchain",
      "autogen",
      "ai agent",
      "coding agent",
      "browser-use",
      "browser agent",
      "workflow automati",
      "automation platform",
      "ai assistant",
      "ai-powered",
      "chatbot",
      "copilot",
      "ai coding",
      "code assistant",
      "coding assistant",
      "ai app builder",
      "ai builder",
      "ai cowork",
      "ai personal",
      "ai wearable",
      "ai notepad",
      "ai friend",
      "smart assistant",
      "ai web browsing",
      "ai automat",
      "openhands",
      "code less, make more",
    ],
    wordKeywords: ["agent", "agents", "crew", "swarm", "n8n", "dify", "openai"],
  },
  {
    name: "RAG",
    color: "#10b981",
    hue: 160,
    keywords: [
      "retrieval augmented",
      "retrieval-augmented",
      "vector database",
      "vector store",
      "embedding",
      "search engine",
      "knowledge base",
      "knowledge graph",
      "context-aware",
      "context aware",
      "memory engine",
    ],
    wordKeywords: ["rag", "retrieval", "vector"],
  },
  {
    name: "LLM / Model",
    color: "#6366f1",
    hue: 240,
    keywords: [
      "language model",
      "fine-tun",
      "inference engine",
      "transformer",
      "tensorrt",
      "deep learning",
      "neural network",
      "machine learning",
      "generative ai",
      "text generation",
      "open-source model",
      "foundation model",
      "deepseek",
      "ollama",
      "vllm",
      "llamacpp",
      "llama.cpp",
      "gguf",
      "quantiz",
      "pytorch",
      "huggingface",
      "hugging face",
      "model training",
      "self-supervised",
      "reinforcement learning",
      "linear attention",
      "flash attention",
      "large-scale model",
      "llama model",
      "ai cluster",
      "prompt engineering",
      "genai",
      "gen ai",
    ],
    wordKeywords: ["llm", "llms", "gpt", "chatgpt", "mlx", "lora", "inference", "model serving", "torch", "rlhf", "nemo"],
  },
  {
    name: "AI Tools",
    color: "#ec4899",
    hue: 330,
    keywords: [
      "deepfake",
      "face swap",
      "text-to-speech",
      "text to speech",
      "speech synthesis",
      "speech recognition",
      "speech-to-text",
      "video generat",
      "image generat",
      "stable diffusion",
      "stable-diffusion",
      "diffusion model",
      "comfyui",
      "whisper",
      "voice clone",
      "voice cloning",
      "image process",
      "computer vision",
      "object detection",
      "audiobook",
      "audio book",
      "subtitle",
      "dubbing",
      "voice ai",
      "document translat",
      "ai translat",
      "film generat",
      "video subtitle",
      "multi-object track",
      "3d cad",
      "3d model",
      "biomolecular",
      "ai for robot",
      "embodied ai",
      "robotics",
    ],
    wordKeywords: ["tts", "ocr", "diffusion", "yolo", "mediapipe", "lerobot"],
  },
  {
    name: "Web / Frontend",
    color: "#06b6d4",
    hue: 190,
    keywords: [
      "react component",
      "vue component",
      "ui framework",
      "css framework",
      "frontend",
      "front-end",
      "tailwindcss",
      "tailwind css",
      "next.js",
      "nextjs",
      "nuxt",
      "svelte",
      "web framework",
      "web app",
      "webapp",
      "full-stack",
      "fullstack",
      "web server",
      "http framework",
      "rest api",
      "restful",
      "api framework",
      "web scraping",
      "web crawl",
      "dashboard",
      "admin panel",
      "html, css",
      "javascript framework",
      "php framework",
      "web browser",
      "headless browser",
      "browser autom",
      "swagger",
      "open api",
      "openapi",
      "web docs",
      "data format",
      "json visual",
      "project management",
      "document management",
      "爬虫",
    ],
    wordKeywords: ["react", "vue", "angular", "remix", "fastapi", "django", "flask", "express", "gin", "fiber", "grpc", "graphql", "bootstrap", "symfony", "crm"],
  },
  {
    name: "Developer Tools",
    color: "#14b8a6",
    hue: 175,
    keywords: [
      "neovim",
      "vscode",
      "vs code",
      "code editor",
      "ui component",
      "shadcn",
      "intellij",
      "webstorm",
      "terminal emulator",
      "developer tool",
      "dev tool",
      "cli tool",
      "command line",
      "command-line",
      "dotfiles",
      "package manager",
      "build tool",
      "code generat",
      "type checker",
      "static analysis",
      "debugg",
      "formatter",
      "version manager",
      "node version",
      "runtime",
      "testing framework",
      "test framework",
      "mocking framework",
      "developer portal",
      "typesetting",
      "markup-based",
      "readme stats",
      "git diagram",
      "remote desktop",
      "animation engine",
      "animation library",
      "profiler",
      "system utilities",
      "converting files",
      "protocol buffers",
      "data interchange",
      "powershell",
    ],
    wordKeywords: ["cursor", "codex", "lsp", "lint", "linter", "sdk", "nvm", "bun", "deno", "playwright", "cypress", "zed", "waveterm", "ffmpeg"],
  },
  {
    name: "DevOps / Infra",
    color: "#64748b",
    hue: 215,
    keywords: [
      "kubernetes",
      "devops",
      "terraform",
      "ansible",
      "ci/cd",
      "home-assistant",
      "traefik",
      "rancher",
      "minio",
      "infrastructure",
      "orchestrat",
      "monitoring",
      "observability",
      "load balancer",
      "reverse proxy",
      "self-hosted",
      "self hosted",
      "homelab",
      "home lab",
      "deployment",
      "cloud native",
      "cloud-native",
      "serverless",
      "microservice",
      "runner-images",
      "rtos",
      "gpu programming",
      "gpu kernel",
    ],
    wordKeywords: ["docker", "k8s", "helm", "nginx", "container", "containers", "heroku", "coolify", "cuda"],
  },
  {
    name: "Data / Database",
    color: "#0ea5e9",
    hue: 200,
    keywords: [
      "database",
      "data pipeline",
      "data engineer",
      "data process",
      "data visual",
      "data analytic",
      "etl",
      "olap",
      "time series",
      "data warehouse",
      "query engine",
      "sql database",
      "nosql",
      "data extraction",
      "data transform",
      "business intelligence",
      "dataset",
      "data enrichment",
    ],
    wordKeywords: ["postgres", "mysql", "redis", "sqlite", "mongodb", "kafka", "spark", "metabase", "spreadsheet"],
  },
  {
    name: "AI Finance",
    color: "#eab308",
    hue: 50,
    keywords: [
      "hedge fund",
      "freqtrade",
      "algorithmic trading",
      "quantitative finance",
      "ai-hedge-fund",
      "quant trading",
      "crypto trading",
      "trading platform",
      "payments switch",
      "payment gateway",
      "personal finance",
      "open source finance",
    ],
    wordKeywords: ["trading bot", "fintech", "hummingbot"],
  },
  {
    name: "Mobile",
    color: "#f97316",
    hue: 25,
    keywords: [
      "react native",
      "react-native",
      "flutter",
      "swiftui",
      "kotlin multiplatform",
      "mobile app",
      "ios app",
      "android app",
    ],
    wordKeywords: ["ios", "android"],
  },
  {
    name: "Media / Content",
    color: "#a78bfa",
    hue: 255,
    keywords: [
      "music player",
      "video player",
      "media player",
      "media server",
      "media center",
      "video download",
      "music download",
      "audio player",
      "streaming",
      "jellyfin",
      "youtube music",
      "spotify",
      "podcast",
      "e-book",
      "ebook",
      "reader app",
      "social media schedul",
      "content manage",
      "iptv",
      "news reading",
      "hottest news",
      "real-time news",
      "video editing",
      "whiteboard",
      "白板",
      "open source whiteboard",
    ],
    wordKeywords: ["plex", "emby", "mpv", "stremio", "jellyfin"],
  },
  {
    name: "Blockchain / Crypto",
    color: "#d97706",
    hue: 35,
    keywords: [
      "blockchain",
      "cryptocurrency",
      "smart contract",
      "decentralized",
      "web3",
      "defi",
    ],
    wordKeywords: ["bitcoin", "ethereum", "solana", "solidity", "hardhat", "coinbase"],
  },
  {
    name: "Education",
    color: "#8b5cf6",
    hue: 260,
    keywords: [
      "tutorial",
      "course",
      "interview question",
      "interview prep",
      "coding interview",
      "system design",
      "textbook",
      "roadmap",
      "cheat sheet",
      "cheatsheet",
      "awesome list",
      "awesome-",
      "curated list",
      "learning path",
      "learn to code",
      "from scratch",
      "step by step",
      "for beginners",
      "open source collection",
      "free programming",
      "coding challenge",
      "ai engineering",
      "ai for beginner",
      "supporting materials",
      "internship",
      "open source games",
      "hellogithub",
      "study plan",
      "self-taught",
      "computer science",
      "all algorithms",
      "free apis",
      "collective list",
      "system prompts",
      "做饭",
      "做菜",
      "resume matcher",
      "equity compensation",
    ],
    wordKeywords: ["beginner", "exercise", "exercises", "handbook", "cookbook", "lessons"],
  },
  {
    name: "Security",
    color: "#f43f5e",
    hue: 340,
    keywords: [
      "security",
      "penetration test",
      "pentest",
      "exploit",
      "censorship",
      "vulnerability",
      "malware",
      "remote access trojan",
      "hacking tool",
      "cybersecurity",
      "cyber security",
      "bug bounty",
      "firewall",
      "encryption",
      "privacy",
      "password manager",
      "threat intelligence",
      "cryptographic",
      "cell site simulator",
      "secrets management",
      "secrets detection",
      "find secrets",
      "wireguard",
    ],
    wordKeywords: ["trojan", "vpn", "ctf", "hashcat", "bloodhound", "openssl", "gitleaks", "infisical"],
  },
  {
    name: "Messaging / Social",
    color: "#22d3ee",
    hue: 185,
    keywords: [
      "chat app",
      "messaging",
      "whatsapp",
      "telegram",
      "wechat",
      "discord bot",
      "email app",
      "inbox zero",
      "social media tool",
      "chat record",
      "聊天记录",
    ],
    wordKeywords: ["signal", "slack"],
  },
  {
    name: "Other",
    color: "#94a3b8",
    hue: 210,
    keywords: [],
  },
];

// Pre-compile word-boundary regexes for performance
const wordRegexCache = new Map<string, RegExp>();
for (const cat of CATEGORIES) {
  for (const kw of cat.wordKeywords ?? []) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    wordRegexCache.set(kw, new RegExp(`\\b${escaped}\\b`));
  }
}

export function categorize(repo: Repo): CategoryDef {
  const text =
    `${repo.title} ${repo.description} ${repo.author}`.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.name === "Other") continue;
    // Substring match for longer / unambiguous keywords
    if (cat.keywords.some((kw) => text.includes(kw))) {
      return cat;
    }
    // Word-boundary match for short / ambiguous keywords
    if (
      cat.wordKeywords?.some((kw) => wordRegexCache.get(kw)!.test(text))
    ) {
      return cat;
    }
  }
  return CATEGORIES[CATEGORIES.length - 1]; // Other
}

export interface DailyData {
  [date: string]: Repo[];
}

export interface TrendPoint {
  date: string;
  category: string;
  count: number;
}

export function buildTrendData(data: DailyData): TrendPoint[] {
  const points: TrendPoint[] = [];
  for (const [date, repos] of Object.entries(data)) {
    const counts: Record<string, number> = {};
    for (const repo of repos) {
      const cat = categorize(repo);
      counts[cat.name] = (counts[cat.name] || 0) + 1;
    }
    for (const [category, count] of Object.entries(counts)) {
      points.push({ date, category, count });
    }
  }
  return points.sort((a, b) => a.date.localeCompare(b.date));
}

export interface DataStats {
  days: number;
  totalEntries: number;
  uniqueRepos: number;
  categories: number;
  dateRange: { start: string; end: string };
}

export function computeStats(data: DailyData): DataStats {
  const dates = Object.keys(data).sort();
  let totalEntries = 0;
  const urls = new Set<string>();

  for (const repos of Object.values(data)) {
    totalEntries += repos.length;
    for (const repo of repos) {
      urls.add((repo.url || `${repo.author}/${repo.title}`).toLowerCase());
    }
  }

  return {
    days: dates.length,
    totalEntries,
    uniqueRepos: urls.size,
    categories: CATEGORIES.length - 1, // exclude "Other"
    dateRange: {
      start: dates[0] || "",
      end: dates[dates.length - 1] || "",
    },
  };
}

export type Durability = "evergreen" | "steady" | "burst" | "flash";

function getDurability(appearances: number): Durability {
  if (appearances >= 16) return "evergreen";
  if (appearances >= 6) return "steady";
  if (appearances >= 2) return "burst";
  return "flash";
}

function computeLongestStreak(sortedDates: string[]): number {
  if (sortedDates.length <= 1) return sortedDates.length;
  let max = 1;
  let cur = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]).getTime();
    const curr = new Date(sortedDates[i]).getTime();
    const diffDays = (curr - prev) / 86_400_000;
    if (diffDays === 1) {
      cur++;
      if (cur > max) max = cur;
    } else {
      cur = 1;
    }
  }
  return max;
}

export function getTopRepos(data: DailyData): (Repo & {
  appearances: number;
  dates: string[];
  category: CategoryDef;
  longestStreak: number;
  durability: Durability;
})[] {
  const map = new Map<string, { repo: Repo; dates: string[] }>();
  for (const [date, repos] of Object.entries(data)) {
    for (const repo of repos) {
      const key = (repo.url || `${repo.author}/${repo.title}`).toLowerCase();
      if (!map.has(key)) {
        map.set(key, { repo, dates: [date] });
      } else {
        map.get(key)!.dates.push(date);
      }
    }
  }
  return Array.from(map.values())
    .map(({ repo, dates }) => {
      const sorted = dates.sort();
      return {
        ...repo,
        appearances: sorted.length,
        dates: sorted,
        category: categorize(repo),
        longestStreak: computeLongestStreak(sorted),
        durability: getDurability(sorted.length),
      };
    })
    .sort((a, b) => b.appearances - a.appearances);
}

export type Momentum = "up2" | "up1" | "flat" | "down1" | "down2";

export function computeCategoryMomentum(data: DailyData): Record<string, Momentum> {
  const dates = Object.keys(data).sort();
  if (dates.length < 60) return {};

  const recent = new Set(dates.slice(-90));
  const prev = new Set(dates.slice(-180, -90));

  const recentCounts: Record<string, number> = {};
  const prevCounts: Record<string, number> = {};

  for (const [date, repos] of Object.entries(data)) {
    for (const repo of repos) {
      const cat = categorize(repo).name;
      if (cat === "Other") continue;
      if (recent.has(date)) recentCounts[cat] = (recentCounts[cat] || 0) + 1;
      else if (prev.has(date)) prevCounts[cat] = (prevCounts[cat] || 0) + 1;
    }
  }

  const result: Record<string, Momentum> = {};
  for (const cat of CATEGORIES) {
    if (cat.name === "Other") continue;
    const r = recentCounts[cat.name] || 0;
    const p = prevCounts[cat.name] || 1;
    const change = (r - p) / p;
    if (change > 0.5) result[cat.name] = "up2";
    else if (change > 0.15) result[cat.name] = "up1";
    else if (change > -0.15) result[cat.name] = "flat";
    else if (change > -0.5) result[cat.name] = "down1";
    else result[cat.name] = "down2";
  }
  return result;
}

export interface InsightStats {
  noisePercent: number;       // % of repos with ≤5 days
  evergreenPercent: number;   // % of repos with 16+ days
  msRepos: number;            // Microsoft unique repo count
  msAppearances: number;      // Microsoft total appearances
}

export function computeInsightStats(data: DailyData): InsightStats {
  // Count appearances per unique repo
  const map = new Map<string, { repo: Repo; count: number }>();
  for (const repos of Object.values(data)) {
    for (const repo of repos) {
      const key = (repo.url || `${repo.author}/${repo.title}`).toLowerCase();
      if (!map.has(key)) {
        map.set(key, { repo, count: 1 });
      } else {
        map.get(key)!.count++;
      }
    }
  }

  const total = map.size;
  let flash = 0;
  let evergreen = 0;
  for (const { count } of map.values()) {
    if (count <= 5) flash++;
    if (count >= 16) evergreen++;
  }

  // Microsoft stats
  const msKeys = new Set<string>();
  let msAppearances = 0;
  for (const repos of Object.values(data)) {
    for (const repo of repos) {
      const author = repo.author.toLowerCase();
      if (author.includes("microsoft") || author.includes("azure") || author.includes("dotnet")) {
        const key = (repo.url || `${repo.author}/${repo.title}`).toLowerCase();
        msKeys.add(key);
        msAppearances++;
      }
    }
  }

  return {
    noisePercent: Math.round((flash / total) * 100),
    evergreenPercent: Math.round((evergreen / total) * 10) / 10,
    msRepos: msKeys.size,
    msAppearances,
  };
}

export interface CompanyQuarterData {
  company: string;
  color: string;
  quarters: { quarter: string; appearances: number }[];
}

export function buildAIEcosystemData(data: DailyData): CompanyQuarterData[] {
  const companies: { name: string; color: string; match: (author: string, text: string) => boolean }[] = [
    { name: "Claude / Anthropic", color: "#f59e0b", match: (a, t) => a.includes("anthropic") || t.includes("claude") },
    { name: "OpenAI", color: "#10b981", match: (a, t) => a.includes("openai") || t.includes("openai") || t.includes("chatgpt") },
    { name: "Google", color: "#3b82f6", match: (a, t) => a.includes("google") || t.includes("gemini") || t.includes("tensorflow") },
    { name: "Microsoft", color: "#ef4444", match: (a, _t) => a.includes("microsoft") || a.includes("azure") || a.includes("dotnet") },
    { name: "Meta", color: "#8b5cf6", match: (a, t) => a.includes("meta-llama") || a.includes("facebookresearch") || t.includes("pytorch") || t.includes("llama") },
  ];

  function getQuarter(date: string): string {
    const m = parseInt(date.slice(5, 7), 10);
    const y = date.slice(0, 4);
    if (m <= 3) return `${y} Q1`;
    if (m <= 6) return `${y} Q2`;
    if (m <= 9) return `${y} Q3`;
    return `${y} Q4`;
  }

  const allQuarters = new Set<string>();
  const counts: Record<string, Record<string, number>> = {};
  for (const c of companies) counts[c.name] = {};

  for (const [date, repos] of Object.entries(data)) {
    const q = getQuarter(date);
    allQuarters.add(q);
    for (const repo of repos) {
      const author = repo.author.toLowerCase();
      const text = `${repo.title} ${repo.description}`.toLowerCase();
      for (const c of companies) {
        if (c.match(author, text)) {
          counts[c.name][q] = (counts[c.name][q] || 0) + 1;
        }
      }
    }
  }

  const quarters = Array.from(allQuarters).sort();
  return companies.map((c) => ({
    company: c.name,
    color: c.color,
    quarters: quarters.map((q) => ({ quarter: q, appearances: counts[c.name][q] || 0 })),
  }));
}
