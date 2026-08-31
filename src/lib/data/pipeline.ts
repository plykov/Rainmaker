import type { AuditRow, RumorRow } from "./types";

export const pipelineLayers = [
  {
    id: "ingest",
    name: "Ingestion",
    runs: "every 30 min",
    cost: "€5–15 VPS",
    detail:
      "Self-hosted n8n — RSS, HF, GitHub, EDGAR, RECAP, HTML diff, Jina fallback. Owns retries and the seen-items store. Feeds break silently, which is why the fetch-failure footer is mandatory.",
  },
  {
    id: "x",
    name: "X leg",
    runs: "hourly",
    cost: "€10–40*",
    detail:
      "One List timeline, ~35 handles. One request covers the whole roster. Pricing is unverified against X's own rate card; third-party guides contradict each other.",
  },
  {
    id: "bsky",
    name: "Bluesky leg",
    runs: "streaming",
    cost: "€0",
    detail: "Jetstream firehose, author and keyword filter. Free partial substitute for paid X reads.",
  },
  {
    id: "s0",
    name: "Stage 0 filter",
    runs: "inline",
    cost: "€0",
    detail:
      "Rules + Chinese-character aliases (梁文锋, 唐杰, 智谱 ↔ Zhipu ↔ Z.ai) + source allowlist + near-duplicate hashing. Kills 60–75% at zero cost.",
  },
  {
    id: "s1",
    name: "Stage 1 triage",
    runs: "inline",
    cost: "€3–8",
    detail:
      "Small fast model, JSON scoring at temperature 0, BGE-M3 multilingual dedup. This is where recall is lost — tune the threshold against a week of manual review before trusting it.",
  },
  {
    id: "s2",
    name: "Stage 2 synthesis",
    runs: "06:40 CET",
    cost: "€15–30",
    detail:
      "Frontier model, one call per day, two lanes. Facts and analysis are assembled by separate passes and never merged. Consumes a prepared pool — does not fetch 110 sources itself.",
  },
  {
    id: "gate",
    name: "Human gate",
    runs: "~5 min/day",
    cost: "your time",
    detail:
      "Anything tagged leak or regulation is proposed, not published. Automation does not ship unreleased-model or national-security claims unreviewed.",
  },
  {
    id: "deliver",
    name: "Delivery",
    runs: "07:00 CET",
    cost: "€0",
    detail:
      "This page, updated in place. Archive is browsable rather than trapped in email. After the Chinese business day has closed, so the China desk is never a day behind.",
  },
  {
    id: "audit",
    name: "Weekly recall audit",
    runs: "Mondays",
    cost: "€1",
    detail:
      "Diff the week against Import AI and Don't Worry About the Vase. The only instrument that measures what the pipeline silently dropped.",
  },
  {
    id: "qa",
    name: "Monthly rumor scorecard",
    runs: "monthly",
    cost: "€0",
    detail:
      "Track flagged rumors against outcomes and decay source trust. Skip it and confidence labels mean nothing.",
  },
];

export const admissionAxes = [
  {
    id: "novelty",
    name: "Novelty",
    question: "New information, or a restatement?",
    high: "First appearance; a number nobody had; a reversal of a stated position",
    low: "Recap; opinion on a week-old event; listicle",
  },
  {
    id: "authority",
    name: "Authority",
    question: "How strong is the evidence class?",
    high: "Filing, docket, first-party post, repo commit, named on-record source",
    low: "Anonymous forum claim; screenshot; aggregator rewrite",
  },
  {
    id: "consequence",
    name: "Consequence",
    question: "Does it change a decision, price, capability or rule?",
    high: "Pricing, licence, availability, regulation, org control, compute",
    low: "Personnel below VP; funding rumour without terms; benchmark noise",
  },
];

export const standingRules = [
  "400–650 words. Above 700, the threshold is too low.",
  "Maximum 12 items. Maximum 3 items per person per day, regardless of score.",
  "Never two items on the same underlying event; merge and cite both sources.",
  "No item without a named person, lab, or model — this is a people-monitoring system.",
  "No link, no item. Unverified claims ship labelled rather than suppressed.",
  "Anything from HN, Reddit or an anonymous account is corroborated and promoted, or carried as Unverified. Never stated flatly.",
  "Paywalled scoops: headline, outlet, one-line gist from the free lede, link. Never fabricate the body.",
  "A quiet day must look quiet. A system that manufactures twelve items daily trains you to stop reading it.",
  "Reach (Techmeme, HN, X velocity) is a tiebreaker only — never an admission criterion.",
  "China desk is present even on quiet days. Absence here usually means a broken feed.",
];

export const rumorScorecard: RumorRow[] = [
  {
    id: "ox-alpha",
    flagged: "2026-08-23",
    claim: "Anonymous LMArena entry 'Ox Alpha' is a Chinese frontier model on domestic silicon.",
    outcome: "Z.ai claimed it as GLM-5.3-Flash, late August.",
    status: "confirmed",
    lag: "4 days",
    trust: "up",
  },
  {
    id: "liang-briefing",
    flagged: "2026-07-22",
    claim: "Liang Wenfeng closed-door investor remarks would freeze a multi-billion DeepSeek round.",
    outcome: "Fundraise paused, then resumed at a reported ~$8B.",
    status: "confirmed",
    lag: "6 days",
    trust: "up",
  },
  {
    id: "supervote",
    flagged: "2026-06-18",
    claim: "Anthropic preparing supervoting founder shares ahead of listing.",
    outcome: "Still reported (The Information / Yahoo). No first-party filing yet.",
    status: "open",
    lag: "open",
    trust: "flat",
  },
  {
    id: "ssi-nvidia",
    flagged: "2026-07-08",
    claim: "Nvidia taking a ~$5B position in Safe Superintelligence; SSI moving off TPU.",
    outcome: "Vendor/partner press corroborated the investment. TPU-to-GPU shift treated as reported.",
    status: "confirmed",
    lag: "3 days",
    trust: "up",
  },
  {
    id: "mythos-weights",
    flagged: "2026-04-12",
    claim: "Restricted Anthropic model (Mythos) would ship publicly inside the quarter.",
    outcome: "Did not ship. Remains restricted. Source trust decayed.",
    status: "killed",
    lag: "killed",
    trust: "down",
  },
];

export const mondayAudit: AuditRow[] = [
  {
    id: "a1",
    item: "Z.ai unmasks Ox Alpha as GLM-5.3-Flash on Chinese GPUs",
    inDigest: true,
    inImportAI: true,
    inZvi: true,
    note: "Caught. Structural trace led the English press by more than a day.",
  },
  {
    id: "a2",
    item: "Qwen silent instruct checkpoint (no blog post)",
    inDigest: true,
    inImportAI: false,
    inZvi: true,
    note: "Caught via HF org. Import AI skipped; Zvi carried it in the weekly.",
  },
  {
    id: "a3",
    item: "HKEX 2513 training-spend disclosure",
    inDigest: true,
    inImportAI: false,
    inZvi: false,
    note: "Caught. Both weeklies missed the filing. China desk earning its slot.",
  },
  {
    id: "a4",
    item: "SemiAnalysis note on H2 datacenter interconnection delays",
    inDigest: false,
    inImportAI: true,
    inZvi: true,
    note: "Miss. Paywall titles-only path dropped the body. Raise Stage 1 on Patel bylines.",
  },
  {
    id: "a5",
    item: "EU AI Office process story (recap of 2 Aug enforcement)",
    inDigest: false,
    inImportAI: true,
    inZvi: false,
    note: "Correctly dropped — novelty near zero. Recap would have cleared an additive ranker.",
  },
];

export const gates = [
  {
    name: "Lane split",
    detail:
      "Facts and analysis are assembled by separate passes and never merged, so the model cannot promote a rumour into a reported event.",
  },
  {
    name: "Quote-existence check",
    detail:
      "Every verbatim quote is string-matched against the fetched source. A miss blocks the item automatically.",
  },
  {
    name: "Human gate",
    detail:
      "Leak and regulation tags are proposed, not published. Automation does not ship unreleased-model or national-security claims unreviewed.",
  },
  {
    name: "Extraction prompt",
    detail:
      "Who, what, when, impact. Do not add outside knowledge. Mark anything unverified explicitly.",
  },
];

export const verifiedLedger = [
  {
    claim: "Andrej Karpathy joined Anthropic pre-training",
    when: "19 May 2026",
    note: "TechCrunch. The most important roster correction in v2.",
  },
  {
    claim: "Z.ai confirmed Ox Alpha as GLM-5.3-Flash on Chinese GPUs",
    when: "late Aug 2026",
    note: "Worked example of the stealth-benchmark channel.",
  },
  {
    claim: "DeepSeek paused, then resumed, a reported ~$8B fundraise after Liang's briefing leaked",
    when: "Jul 2026",
    note: "Chinese outlets led English coverage by a day or more.",
  },
  {
    claim: "Anthropic preparing supervoting founder shares ahead of listing",
    when: "Jun 2026",
    note: "Still Reported — The Information / Yahoo. No first-party filing yet.",
  },
  {
    claim: "Hassabis to Alphabet chief scientist; Jeff Dean left the same week",
    when: "5 Aug 2026",
    note: "Google's AI org is the most volatile chart on the roster.",
  },
  {
    claim: "SpaceX–xAI merger (~$1.25T) and Grok 4.5 at $2/$6 per million tokens",
    when: "early–Jul 2026",
    note: "Musk announced pricing himself. Highest volume, worst SNR.",
  },
];

export const unverifiedLedger = [
  {
    claim: "X API List-polling cost of €10–40/month",
    note: "Third-party guides contradict each other. Check X's own rate card before committing.",
  },
  {
    claim: "Named individual appointments and departures from one input report",
    note: "Not verified. Excluded entirely — an illustrative artifact is not reporting.",
  },
  {
    claim: "SemiAnalysis crossing $100M annual revenue",
    note: "Single secondary report. Not used as an admission fact.",
  },
];

export const constraints = [
  {
    name: "X pricing is no longer the swing factor",
    detail:
      "One List timeline covers ~35 handles. Bluesky Jetstream absorbs part of the rest. The budget's dominant term is now filter precision, not the rate card.",
  },
  {
    name: "Filtering cheap, summarisation rare",
    detail:
      "~95–110 sources produce 800–1,500 items a day. Rules and embeddings cost fractions of a cent; frontier synthesis does not. The ratio is the remaining cost lever.",
  },
  {
    name: "Recall failures are invisible",
    detail:
      "A digest that misses the day's biggest story looks perfect. Precision failures get noticed; recall failures do not. Monday's audit is the only counter.",
  },
];

export const optionsAssessed = [
  {
    id: "readers",
    stance: "Partial",
    name: "Managed readers — Feedly, Inoreader, F5Bot",
    detail:
      "Fastest start: paste ~35 feeds, topic filter in an hour, tens of euros a month. F5Bot is free for HN/Reddit alerts. No X, no Hugging Face, no filings, no cross-source dedup, no 'only if it involves someone on my watchlist.' A fallback reader, not the system.",
  },
  {
    id: "n8n",
    stance: "Core",
    name: "Self-hosted n8n as ingestion and state",
    detail:
      "Scheduled polling, RSS/Atom, HF/GitHub/EDGAR/RECAP, HTML diff, retries, seen-items store. r.jina.ai for pages without RSS. You own the maintenance — feeds break silently, which is why the fetch-failure footer is mandatory.",
  },
  {
    id: "cascade",
    stance: "Core",
    name: "Two-stage cascade, multilingual dedup",
    detail:
      "Stage 0 (free) kills 60–75%. Stage 1 cheap JSON scores at temperature 0; BGE-M3 handles Chinese. Stage 2 is one frontier call on the top 15–25 so it can merge across sources. Stage 1 is where recall is lost.",
  },
  {
    id: "gates",
    stance: "Core",
    name: "Two lanes, two hard gates",
    detail:
      "Facts and analysis never merge. Quotes are string-matched. Leak and regulation are proposed, not published. Extraction is fixed: who, what, when, impact — do not add outside knowledge.",
  },
  {
    id: "synth",
    stance: "Core",
    name: "Scheduled synthesis at 06:40 CET",
    detail:
      "One recurring task reads the prepared pool, verifies borderline claims, renders this page. After the Chinese business day has closed. It must not fetch 110 sources itself.",
  },
  {
    id: "agent",
    stance: "Avoid",
    name: "A fully agentic 'go read the internet' morning",
    detail:
      "Non-deterministic coverage, no seen-state, no audit trail of what it skipped, high burn. Browsing is for verifying one claim in Stage 2 — never the ingestion strategy.",
  },
];

export const failureMode =
  "Every digest of this kind degrades the same way: the filter is tuned toward precision, the output gets cleaner, and it silently stops catching anything you did not already expect. Skip the Monday audit or the rumor scorecard for a month and you have a digest you trust and cannot evaluate — which is worse than no digest at all.";

export const extractionDemo = {
  source:
    "A third-party inference SDK tagged a model ID in a 03:18 CET commit. No lab newsroom, no first-party docs, no Hugging Face card. Single observation.",
  allowed: {
    who: "Unattributed partner SDK",
    what: "A model string appeared in a changelog",
    when: "03:18 CET",
    impact: "Possible unreleased-model tell — human-gated, not stated as a launch",
  },
  blocked: {
    label: "Outside knowledge — blocked",
    text: "Stage 2 named a specific infrastructure departure and treated it as reported. That sentence is not in the source. The extraction prompt forbids it. This is the failure mode found in a sample digest that laundered unverified specifics into working memory.",
  },
};

export const laneDemo = {
  rumor: "An unreleased model ID appeared in an API docs changelog, then vanished.",
  fact: {
    body: "The exact string was observed at 04:12 CET and later absent. Unverified. Single structural trace.",
    confirmsIf: "The ID returns non-404 on the models endpoint, or appears in a model card.",
    diesIf: "Absent from tomorrow's diff and unreferenced by partners.",
  },
  analysis: {
    body: "Pre-announcement hygiene is getting sloppier as serving surfaces multiply. Interpretation over a 7-day window — not a reported event.",
  },
  merged:
    "Labs are slipping unreleased model IDs into production docs, which means a launch is imminent. That sentence is the bug: analysis promoted into fact. The lanes never merge.",
};

export const mergedToday = [
  {
    event: "Qwen instruct checkpoint with no blog post",
    sources: ["HF org Qwen", "interconnects.ai", "simonwillison.net"],
    note: "Never two items on the same underlying event. Structural trace led; Lambert and Willison cited as the English read.",
  },
  {
    event: "HKEX 2513 compute-commit supplemental",
    sources: ["HKEX filing", "English wires"],
    note: "Filing is the item. Wires are the confirmation, not a second lede.",
  },
];

