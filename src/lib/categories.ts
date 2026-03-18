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
    ],
    wordKeywords: ["agent", "agents", "crew", "swarm", "n8n", "dify"],
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
    ],
    wordKeywords: ["llm", "llms", "gpt", "mlx", "lora", "inference", "model serving"],
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
      "video generat",
      "image generat",
      "stable diffusion",
      "stable-diffusion",
      "diffusion model",
      "comfyui",
      "whisper",
      "voice clone",
      "image process",
      "computer vision",
      "object detection",
    ],
    wordKeywords: ["tts", "ocr", "diffusion", "yolo"],
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
    ],
    wordKeywords: ["react", "vue", "angular", "remix", "fastapi", "django", "flask", "express", "gin", "fiber"],
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
    ],
    wordKeywords: ["cursor", "codex", "lsp", "lint", "linter", "sdk", "nvm", "bun", "deno"],
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
    ],
    wordKeywords: ["docker", "k8s", "helm", "nginx", "container", "containers", "heroku", "coolify"],
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
    ],
    wordKeywords: ["postgres", "mysql", "redis", "sqlite", "mongodb", "kafka", "spark"],
  },
  {
    name: "AI Finance",
    color: "#eab308",
    hue: 50,
    keywords: ["hedge fund", "freqtrade", "algorithmic trading", "quantitative finance", "ai-hedge-fund", "quant trading"],
    wordKeywords: ["trading bot", "fintech"],
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
    ],
    wordKeywords: ["beginner", "exercise", "exercises", "handbook", "cookbook"],
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
    ],
    wordKeywords: ["trojan", "vpn", "ctf"],
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

export function getTopRepos(data: DailyData): (Repo & { appearances: number; dates: string[]; category: CategoryDef })[] {
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
    .map(({ repo, dates }) => ({
      ...repo,
      appearances: dates.length,
      dates: dates.sort(),
      category: categorize(repo),
    }))
    .sort((a, b) => b.appearances - a.appearances);
}
