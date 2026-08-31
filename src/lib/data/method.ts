export const ensembleNote =
  "Two of the four inputs were byte-identical (Z.ai and Gemini). The ensemble is n=3, not n=4. Every point where 'two independent models agreed' involving that pair is fake corroboration.";

export const reportScorecard = [
  {
    report: "DeepSeek",
    currency: "Poor — 2024/25 vintage",
    architecture: "Thin",
    epistemics: "Good instincts, no mechanism",
    verdict: "Weakest. Two ideas kept; roster discarded.",
  },
  {
    report: "Z.ai / Gemini",
    currency: "Poor — self-dated early 2025",
    architecture: "Best of the four",
    epistemics: "Strong — quote-check, rumor scorecard",
    verdict: "Identical documents. Stale roster; mine the architecture.",
  },
  {
    report: "Grok",
    currency: "Best — genuinely Aug 2026",
    architecture: "Good, unpriced",
    epistemics: "Mixed — sample digest breaks spec",
    verdict: "Most accurate on facts. Four unique claims, all verified.",
  },
  {
    report: "Claude v1",
    currency: "Good, two misses",
    architecture: "Good, priced",
    epistemics: "Strong — only recall audit",
    verdict: "Missed Karpathy→Anthropic and the X List cost lever.",
  },
];

export const failures = [
  {
    id: "stale",
    title: "Stale world",
    detail:
      "Three of four reports describe a world that no longer exists: Babuschkin still at xAI, LeCun still at Meta, Hassabis still DeepMind CEO, Jeff Dean still Google chief scientist, Machines of Loving Grace as Amodei's flagship essay. A currency pass would have caught all of it. None ran one.",
  },
  {
    id: "spec-break-future",
    title: "Sample digest behind reality",
    detail:
      "DeepSeek offered GPT-5.5 and Claude 4.5 as illustrative future events. GPT-5.6 shipped in July 2026 and Opus 4.7 in April. Its $10B-at-$80B raise understates the $1.25T merger by more than an order of magnitude.",
  },
  {
    id: "spec-break-launder",
    title: "Illustrative artifact as reporting",
    detail:
      "Grok published named individuals and specific claims as though reported inside a 'sample'. That is the most dangerous failure mode — unverified specifics laundered into working memory. Named firings from that report are excluded here entirely.",
  },
  {
    id: "broken-math",
    title: "Broken math",
    detail:
      "Eleven sections × 3–6 items cannot fit a 600–900 word cap. Additive scoring (Impact 40 / Novelty 20 / Credibility 20 / Reach 10 / Actionability 10) lets a high-reach, zero-novelty recap clear on reach and impact alone — exactly the item class a digest exists to exclude.",
  },
  {
    id: "recall",
    title: "Recall is invisible",
    detail:
      "Every report optimises precision. None except v1 proposes a mechanism for detecting what the pipeline silently dropped. A digest that misses the day's biggest story looks identical to a perfect one. Monday's audit is the instrument.",
  },
];

export const survivors = [
  {
    element: "X List timeline polling",
    origin: "Z.ai/Gemini",
    why: "One call covers the roster. Largest cost lever; dissolves the X-pricing problem as the budget's swing factor.",
  },
  {
    element: "Bluesky Jetstream",
    origin: "Z.ai/Gemini",
    why: "Free streaming firehose. Genuine partial substitute for paid X reads.",
  },
  {
    element: "Techmeme as importance prior",
    origin: "Z.ai/Gemini",
    why: "Free human-edited ranking. Tiebreaker only — never admission.",
  },
  {
    element: "CAC 生成式AI备案",
    origin: "Z.ai/Gemini",
    why: "Chinese model registrations pre-announce launches. Structural leak channel.",
  },
  {
    element: "Chinese-character aliases",
    origin: "Z.ai/Gemini",
    why: "梁文锋 / 唐杰 / 智谱 ↔ Zhipu ↔ Z.ai. Without this the China desk is silent.",
  },
  {
    element: "Verbatim-quote existence check",
    origin: "Z.ai/Gemini",
    why: "String-match against the fetched source. Falsifiable, not a hopeful prompt.",
  },
  {
    element: "Rumor-vs-outcome scorecard",
    origin: "Z.ai/Gemini",
    why: "Decays source trust against what actually happened.",
  },
  {
    element: "Facts / analysis lane split",
    origin: "Grok",
    why: "Lanes never merge, so a rumour cannot be promoted into a reported event.",
  },
  {
    element: "Human gate on leak + regulation",
    origin: "Grok",
    why: "Automation proposes. It does not publish unreleased-model or national-security claims unreviewed.",
  },
  {
    element: "Per-person daily cap",
    origin: "Grok",
    why: "Stops Musk's volume dominating any engagement-weighted ranker. Cap 3.",
  },
  {
    element: "Strict extraction prompt",
    origin: "DeepSeek",
    why: "Do not add outside knowledge; mark anything unverified explicitly.",
  },
  {
    element: "Weekly recall audit",
    origin: "Claude v1",
    why: "The only instrument that measures what the pipeline missed.",
  },
  {
    element: "Structural-trace leak layer",
    origin: "Claude v1",
    why: "API diffs, model-ID strings, job reqs, HF commits. Ox Alpha is the textbook case.",
  },
];

export const rejected = [
  {
    name: "Eleven-section digest",
    why: "Cannot fit its own word budget. Caps that contradict length are decoration.",
  },
  {
    name: "Purely additive scoring",
    why: "A high-reach recap clears on volume. Admission is the product of three axes.",
  },
  {
    name: "~100-handle watchlists",
    why: "With List polling, API cost is no longer the constraint — filter precision is.",
  },
  {
    name: "Emoji section markers",
    why: "Chrome, not signal. This page is a four-minute read, not a feed.",
  },
  {
    name: "The DeepSeek roster",
    why: "Currency failure. Entire people list discarded.",
  },
];

export const verificationNote =
  "Verified this session from the Grok report: Karpathy joined Anthropic pre-training (19 May 2026); Z.ai confirmed Ox Alpha as GLM-5.3-Flash on Chinese GPUs (late Aug 2026); DeepSeek paused then resumed a reported ~$8B round after Liang's investor remarks leaked; Anthropic is reported to be preparing supervoting founder shares. All four checked out. Named firings from that same report were not verified and are excluded entirely. All X API pricing remains unverified.";

export const citations = [
  { outlet: "TechCrunch", title: "Andrej Karpathy joins Anthropic's pre-training team", url: "https://techcrunch.com" },
  { outlet: "Wccftech", title: "Z.ai unmasks Ox Alpha as GLM-5.3-Flash", url: "https://wccftech.com" },
  { outlet: "Wccftech", title: "Z.ai confirmed as the lab behind Ox Alpha", url: "https://wccftech.com" },
  { outlet: "TNW", title: "DeepSeek pauses fundraising after Liang Wenfeng's leaked comments", url: "https://thenextweb.com" },
  { outlet: "PYMNTS", title: "DeepSeek resumes funding round to raise $8 billion", url: "https://www.pymnts.com" },
  { outlet: "Yahoo Finance / The Information", title: "Anthropic prepares supervoting power for founders", url: "https://finance.yahoo.com" },
  { outlet: "Axios", title: "Google's AI leadership shuffle", url: "https://www.axios.com" },
  { outlet: "9to5Google", title: "Hassabis steps aside; Jeff Dean departs", url: "https://9to5google.com" },
  { outlet: "TechCrunch", title: "SpaceXAI releases Grok 4.5", url: "https://techcrunch.com" },
  { outlet: "CNBC", title: "xAI/SpaceX merger valued at $1.25 trillion", url: "https://www.cnbc.com" },
  { outlet: "Wikipedia", title: "Anthropic — leadership, Mythos, valuation, IPO filing", url: "https://en.wikipedia.org/wiki/Anthropic" },
  { outlet: "Axios", title: "Claude Opus 4.7 and the unreleased Mythos", url: "https://www.axios.com" },
  { outlet: "Dario Amodei", title: "The Adolescence of Technology", url: "https://darioamodei.com" },
  { outlet: "CNBC", title: "OpenAI publicly releases GPT-5.6", url: "https://www.cnbc.com" },
  { outlet: "Bloomberg", title: "Altman briefs US lawmakers", url: "https://www.bloomberg.com" },
  { outlet: "MIT Technology Review", title: "OpenAI's automated-researcher push", url: "https://www.technologyreview.com" },
  { outlet: "Wikipedia", title: "DeepSeek", url: "https://en.wikipedia.org/wiki/DeepSeek" },
  { outlet: "Wikipedia", title: "Z.ai — founders, GLM cadence, HKEX IPO", url: "https://en.wikipedia.org/wiki/Zhipu_AI" },
  { outlet: "CNBC", title: "Yann LeCun leaves Meta", url: "https://www.cnbc.com" },
  { outlet: "CNBC", title: "LeCun's AMI Labs and the world-models thesis", url: "https://www.cnbc.com" },
  { outlet: "Tech Startups", title: "Nvidia invests in Safe Superintelligence", url: "https://techstartups.com" },
  { outlet: "Fortune", title: "Departures from Thinking Machines Lab", url: "https://fortune.com" },
  { outlet: "BigGo Finance", title: "SemiAnalysis passes $100M annual revenue (unverified)", url: "https://www.biggo.com" },
  { outlet: "European Commission", title: "AI Act enforcement from 2 August", url: "https://digital-strategy.ec.europa.eu" },
  { outlet: "Xpoz / OpenTweet", title: "X API pricing tiers, 2026 (unverified)", url: "https://x.com" },
];