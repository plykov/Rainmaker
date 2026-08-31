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
    id: "drop-musk-price",
    title: "Fourteen @elonmusk posts overnight, three restating Grok 4.5 token prices",
    reason: "novelty",
    personId: "elon-musk",
    note: "Already in market since July. Authority is high; novelty is not. The per-person cap is the backstop for a day he actually says something new three times — today novelty did the work first.",
    novelty: 1,
    authority: 9,
    consequence: 3,
    reach: 10,
    additiveWouldAdmit: true,
  },
  {
    id: "drop-musk-reply",
    title: "Reply-stack under a SpaceXAI serving-status rumour, no first-party confirm",
    reason: "person-cap",
    personId: "elon-musk",
    note: "Would have been a fourth Musk item if novelty had cleared. Cap 3 exists specifically for this volume.",
    novelty: 4,
    authority: 6,
    consequence: 5,
    reach: 8,
    additiveWouldAdmit: true,
  },
  {
    id: "drop-eu-recap",
    title: "EU AI Office process recap of 2 Aug enforcement — still circulating",
    reason: "novelty",
    note: "Correctly dropped. Recap would have cleared an additive ranker on reach and impact. Monday audit agrees this was a right miss.",
    novelty: 0,
    authority: 8,
    consequence: 7,
    reach: 9,
    additiveWouldAdmit: true,
  },
  {
    id: "drop-marcus",
    title: "Gary Marcus restates a stable critique of scaling",
    reason: "stage0",
    note: "Excluded from the daily filter. Position is known; sample quarterly.",
    novelty: 2,
    authority: 6,
    consequence: 2,
    reach: 5,
    additiveWouldAdmit: false,
  },
  {
    id: "drop-hn",
    title: "HN thread on a tokenizer oddity matching no watchlist commit",
    reason: "community",
    note: "Tip line only. Never a digest item without Tier 1 or 2 corroboration.",
    novelty: 5,
    authority: 2,
    consequence: 4,
    reach: 6,
    additiveWouldAdmit: false,
  },
  {
    id: "drop-patel",
    title: "SemiAnalysis note on H2 datacenter interconnection delays",
    reason: "paywall",
    note: "Titles-only path. Monday audit miss — Import AI and Zvi both carried it. Raise Stage 1 on Patel bylines.",
    novelty: 7,
    authority: 8,
    consequence: 8,
    reach: 4,
    additiveWouldAdmit: true,
  },
  {
    id: "drop-quote",
    title: "Import AI pull-quote that does not appear in the fetched source",
    reason: "quote-check",
    note: "Blocked automatically. The newsletter still admitted on other evidence; the quote did not.",
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
