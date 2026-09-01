export type DropReason =
  | "novelty"
  | "person-cap"
  | "stage0"
  | "community"
  | "paywall"
  | "quote-check";

export interface DroppedItem {
  id: string;
  title: string;
  reason: DropReason;
  note: string;
  personId?: string;
  novelty?: number;
  authority?: number;
  consequence?: number;
  reach?: number;
  additiveWouldAdmit?: boolean;
}

/** This morning's silent kills — the instrument precision-only systems lack. */
export const droppedToday: DroppedItem[] = [
  {
    id: "drop-musk-xmoney",
    title: "Musk: '𝕏 Money is awesome' on the Premium US rollout",
    reason: "novelty",
    personId: "elon-musk",
    note: "Not an AI item. Reach is enormous; novelty for this briefing is zero.",
    novelty: 0,
    authority: 9,
    consequence: 2,
    reach: 10,
    additiveWouldAdmit: true,
  },
  {
    id: "drop-musk-orbital",
    title: "Musk arguing with physicists about orbital-compute cooling",
    reason: "novelty",
    personId: "elon-musk",
    note: "Opinion, no product. Person-cap would have caught a third AI Musk item anyway.",
    novelty: 3,
    authority: 8,
    consequence: 4,
    reach: 9,
    additiveWouldAdmit: true,
  },
  {
    id: "drop-openai-bodies",
    title: "OpenAI newsroom listed a CA youth-safety bill post and an 'access milestone' — bodies 404",
    reason: "paywall",
    note: "Index-only. Not admitted without a paragraph we can quote-check. Titles are a seed for tomorrow if the pages load.",
    novelty: 6,
    authority: 8,
    consequence: 6,
    reach: 5,
    additiveWouldAdmit: true,
  },
  {
    id: "drop-docs-id",
    title: "Unreleased OpenAI model ID from the 31 Aug 04:12 CET docs diff",
    reason: "novelty",
    personId: "greg-brockman",
    note: "Dies-if was: absent from tomorrow's diff and unreferenced. Not re-observed overnight. Left on the 31 Aug desk; not re-admitted.",
    novelty: 2,
    authority: 6,
    consequence: 7,
    reach: 3,
    additiveWouldAdmit: false,
  },
  {
    id: "drop-zhipu-price",
    title: "36氪 still circulating Z.ai / 智谱 half-price until 9 Sep",
    reason: "novelty",
    note: "Four-day-old pricing recap. China desk used the DeepSeek HF dump instead.",
    novelty: 1,
    authority: 6,
    consequence: 5,
    reach: 6,
    additiveWouldAdmit: true,
  },
];

export const dropReasonLabel: Record<DropReason, string> = {
  novelty: "Novelty fatal",
  "person-cap": "Person cap",
  stage0: "Stage 0",
  community: "Tip line",
  paywall: "Paywall / no body",
  "quote-check": "Quote check",
};

export interface QuoteSource {
  id: string;
  label: string;
  excerpt: string;
  passSample: string;
  failSample: string;
}

export const quoteSources: QuoteSource[] = [
  {
    id: "import-ai",
    label: "Import AI · 30 Aug (fetched)",
    excerpt:
      "The Sunday issue argues that third-party eval access should be treated as a deployment control, not a research courtesy. If you cannot evaluate a model you should not be expected to trust a deployment of it. That is a harder line than Anthropic's last public comment on external red-teaming.",
    passSample:
      "If you cannot evaluate a model you should not be expected to trust a deployment of it.",
    failSample: "We will open-weight Mythos before any IPO filing.",
  },
  {
    id: "kaplan-talk",
    label: "Kaplan university talk (transcript)",
    excerpt:
      "Scaling is a planning variable. If your forecast does not name the FLOPs, it is a slogan. I am not interested in a slide that says we will be surprised.",
    passSample: "Scaling is a planning variable.",
    failSample: "We train the next Claude on a 50e26 run starting in September.",
  },
];

export function quoteExists(excerpt: string, quote: string): boolean {
  const hay = normalizeQuote(excerpt);
  const needle = normalizeQuote(quote);
  if (needle.length < 8) return false;
  return hay.includes(needle);
}

export function normalizeQuote(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u201c\u201d\u2018\u2019"']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const workingSet = [
  { n: "~35", label: "RSS / Atom feeds" },
  { n: "1", label: "X List · ~35 handles" },
  { n: "1", label: "Bluesky Jetstream filter" },
  { n: "8", label: "Hugging Face orgs" },
  { n: "12", label: "GitHub repos" },
  { n: "6", label: "Benchmark boards" },
  { n: "5", label: "Filing / docket endpoints" },
  { n: "6", label: "Careers pages" },
  { n: "6", label: "China desk sources" },
];
