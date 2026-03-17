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
}

export const CATEGORIES: CategoryDef[] = [
  {
    name: "AI Agent",
    color: "#3b82f6",
    hue: 220,
    keywords: [
      "agent",
      "agentic",
      "multi-agent",
      "autonomous",
      "crew",
      "swarm",
      "langchain",
      "autogen",
    ],
  },
  {
    name: "RAG",
    color: "#10b981",
    hue: 160,
    keywords: ["rag", "retrieval", "vector", "embedding", "knowledge", "search engine"],
  },
  {
    name: "MCP",
    color: "#a855f7",
    hue: 270,
    keywords: ["mcp", "model context protocol", "context protocol"],
  },
  {
    name: "LLM / Model",
    color: "#6366f1",
    hue: 240,
    keywords: [
      "llm",
      "language model",
      "fine-tun",
      "training",
      "inference",
      "transformer",
      "gpt",
      "tensorrt",
      "mlx",
      "lora",
    ],
  },
  {
    name: "Claude Ecosystem",
    color: "#f59e0b",
    hue: 40,
    keywords: ["claude", "anthropic"],
  },
  {
    name: "AI Tools",
    color: "#ec4899",
    hue: 330,
    keywords: [
      "deepfake",
      "face swap",
      "tts",
      "speech",
      "ocr",
      "video generat",
      "image generat",
      "diffusion",
      "comfyui",
      "stable",
    ],
  },
  {
    name: "Developer Tools",
    color: "#14b8a6",
    hue: 175,
    keywords: [
      "cursor",
      "codex",
      "ide",
      "lsp",
      "neovim",
      "vscode",
      "coding agent",
      "ui component",
      "shadcn",
    ],
  },
  {
    name: "DevOps / Infra",
    color: "#64748b",
    hue: 215,
    keywords: [
      "docker",
      "kubernetes",
      "devops",
      "terraform",
      "ansible",
      "ci/cd",
      "container",
      "home-assistant",
      "traefik",
      "rancher",
      "minio",
    ],
  },
  {
    name: "AI Finance",
    color: "#eab308",
    hue: 50,
    keywords: ["hedge fund", "trading", "quant", "freqtrade", "finance"],
  },
  {
    name: "Education",
    color: "#8b5cf6",
    hue: 260,
    keywords: [
      "tutorial",
      "course",
      "interview",
      "beginner",
      "exercise",
      "system design",
      "textbook",
      "learn",
    ],
  },
  {
    name: "Security",
    color: "#f43f5e",
    hue: 340,
    keywords: ["security", "hack", "rat", "trojan", "pentest", "exploit", "censorship", "vpn"],
  },
  {
    name: "Other",
    color: "#94a3b8",
    hue: 210,
    keywords: [],
  },
];

export function categorize(repo: Repo): CategoryDef {
  const text =
    `${repo.title} ${repo.description} ${repo.author}`.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.name === "Other") continue;
    if (cat.keywords.some((kw) => text.includes(kw))) {
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
      const key = `${repo.author}/${repo.title}`.toLowerCase();
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
