import type { Digest } from "./types";

export const digest20260904: Digest = {
  "date": "2026-09-04",
  "weekdayNote": "Friday",
  "scanned": 48,
  "passedRules": 9,
  "triaged": 6,
  "admitted": 4,
  "merged": 1,
  "quoteBlocked": 0,
  "humanHeld": {
    "leak": 0,
    "regulation": 0
  },
  "fetchFailures": [],
  "nextAudit": "Mon 07 Sep",
  "radar": [],
  "items": [
    {
      "id": "2026-09-04-lede",
      "date": "2026-09-04",
      "section": "lede",
      "title": "OpenAI launches GPT-6 Astra",
      "body": "OpenAI released GPT-6 Astra on 3 Sep, calling it the world's most intelligent and aligned model. It saturates FrontierMath Tier 4 (98%), ARC-AGI-3 (99.9%), and sets SOTA on computer-use, science, and professional benchmarks. Limited rollout to trusted orgs today; broader ChatGPT Plus/Pro/Business/Enterprise and API access in coming days. Watch next: broad availability timing and real-world agent performance vs Claude Fable 5.1.",
      "confidence": "confirmed",
      "lane": "fact",
      "evidenceClass": "first-party",
      "sourceLabel": "OpenAI",
      "sourceUrl": "https://openai.com/index/gpt-6-astra/",
      "people": [
        "sam-altman",
        "greg-brockman"
      ],
      "lab": "OpenAI",
      "model": "GPT-6 Astra"
    },
    {
      "id": "2026-09-04-critical-1",
      "date": "2026-09-04",
      "section": "critical",
      "title": "GPT-6 Astra computer-use and alignment claims",
      "body": "Astra achieves 72.6% on OSWorld 2.0 in ~40 min (vs prior 65.7% in 75 min) and 0% unauthorized scope expansion on a new eval informed by the Hugging Face incident (prior model 48%). Codex harness update yields 1.9x faster task completion on Mind2Web. Microsoft Azure already showing early customer use.",
      "confidence": "confirmed",
      "lane": "fact",
      "evidenceClass": "first-party",
      "sourceLabel": "OpenAI / Azure",
      "sourceUrl": "https://openai.com/index/gpt-6-astra/",
      "people": [
        "sam-altman",
        "greg-brockman"
      ],
      "lab": "OpenAI",
      "model": "GPT-6 Astra"
    },
    {
      "id": "2026-09-04-research-1",
      "date": "2026-09-04",
      "section": "research",
      "title": "WeatherNext 3 powers Google products",
      "body": "Google DeepMind and Research released WeatherNext 3, their most advanced global weather AI. It ingests live geostationary satellite data for hourly 5 km resolution forecasts, cutting precipitation error up to 50% in underserved regions. Now live in Search, Gemini, Maps and available via BigQuery/Earth Engine.",
      "confidence": "confirmed",
      "lane": "fact",
      "evidenceClass": "first-party",
      "sourceLabel": "Google DeepMind",
      "sourceUrl": "https://blog.google/innovation-and-ai/models-and-research/google-deepmind/introducing-weathernext-3/",
      "people": [
        "demis-hassabis"
      ],
      "lab": "Google DeepMind",
      "model": "WeatherNext 3"
    },
    {
      "id": "2026-09-04-china-1",
      "date": "2026-09-04",
      "section": "china",
      "title": "中国 AI 产业版图：千亿 AI 公司与互联网大厂的实力坐标",
      "body": "36氪 maps 2026 China AI eight strong: DeepSeek (Liang Wenfeng) at ~$520-710 bn valuation after first external round; Z.ai/Zhipu market cap ~HK$550 bn with rising ARR. Landscape piece notes profitability still unproven across the cohort.",
      "confidence": "reported",
      "lane": "fact",
      "evidenceClass": "named outlet",
      "sourceLabel": "36氪",
      "sourceUrl": "https://36kr.com/p/3967070502706691",
      "people": [
        "liang-wenfeng",
        "zhang-peng",
        "tang-jie"
      ],
      "lab": "DeepSeek / Z.ai",
      "model": ""
    }
  ]
};
