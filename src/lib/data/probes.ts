import type { ProbeTarget } from "./types";

export type { ProbeTarget };

export interface ProbeResult {
  id: string;
  name: string;
  url: string;
  group: string;
  status: number | null;
  ok: boolean;
  ms: number;
  error?: string;
  fallback?: string;
  via?: "direct" | "jina";
}

export interface ProbeRun {
  at: string;
  date: string;
  results: ProbeResult[];
}

export const probeTargets: ProbeTarget[] = [
  {
    id: "anthropic-news",
    name: "anthropic.com/news",
    url: "https://www.anthropic.com/news",
    group: "lab-newsrooms",
    jina: true,
  },
  {
    id: "openai-news",
    name: "openai.com/news",
    url: "https://openai.com/news",
    group: "lab-newsrooms",
    fallback: "r.jina.ai reader — bot wall on the HTML",
    jina: true,
  },
  {
    id: "xai-news",
    name: "x.ai/news",
    url: "https://x.ai/news",
    group: "lab-newsrooms",
    fallback: "r.jina.ai reader — titles only if the selector 403s",
    jina: true,
  },
  {
    id: "simonw",
    name: "simonwillison.net atom",
    url: "https://simonwillison.net/atom/everything/",
    group: "personal-sites",
  },
  {
    id: "techmeme",
    name: "Techmeme RSS",
    url: "https://www.techmeme.com/feed.xml",
    group: "techmeme",
  },
  {
    id: "arxiv",
    name: "arXiv cs.AI RSS",
    url: "https://rss.arxiv.org/rss/cs.AI",
    group: "arxiv",
  },
  {
    id: "hf-deepseek",
    name: "HF deepseek-ai",
    url: "https://huggingface.co/api/models?author=deepseek-ai&limit=1",
    group: "hf-orgs",
  },
  {
    id: "vllm",
    name: "vLLM releases atom",
    url: "https://github.com/vllm-project/vllm/releases.atom",
    group: "github",
  },
  {
    id: "hn",
    name: "HN Algolia",
    url: "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=1",
    group: "community",
  },
  {
    id: "lmarena",
    name: "LMArena",
    url: "https://lmarena.ai",
    group: "benchmarks",
    jina: true,
  },
  {
    id: "rsshub-36kr",
    name: "RSSHub CN mirror",
    url: "https://rsshub.app/36kr/newsflashes",
    group: "china-desk",
    fallback: "10-minute manual scan — RSSHub mirrors are brittle",
    jina: true,
  },
  {
    id: "semianalysis",
    name: "semianalysis.com",
    url: "https://www.semianalysis.com",
    group: "semianalysis",
    fallback: "HTTP may be 200; body is paywalled — titles only",
    jina: true,
  },
];

export const probesById = Object.fromEntries(probeTargets.map((t) => [t.id, t]));
