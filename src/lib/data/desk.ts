import type { Confidence, EvidenceClass } from "./types";

export type GateKind = "leak" | "regulation";
export type QueueStatus = "pending" | "released" | "killed";

export interface QueueItem {
  id: string;
  arrived: string;
  gate: GateKind;
  title: string;
  body: string;
  confirmsIf: string;
  diesIf: string;
  confidence: Confidence;
  evidenceClass: EvidenceClass;
  sourceLabel: string;
  sourceUrl: string;
  people: string[];
  lab?: string;
  originalHeadline?: string;
}

/** Proposed this morning — automation does not publish these unreviewed. */
export const pendingQueue: QueueItem[] = [
  {
    id: "q-partner-sdk",
    arrived: "04:18 CET",
    gate: "leak",
    title: "Partner SDK changelog lists a model string absent from every public models endpoint",
    body: "A third-party inference SDK tagged a model ID in a 03:18 CET commit. No lab newsroom, no first-party docs, no HF card. Single observation. Human-gated as an unreleased-model claim.",
    confirmsIf: "The ID appears on a first-party models list, or a lab newsroom names it.",
    diesIf: "The commit is reverted and the string is absent from tomorrow's diff.",
    confidence: "unverified",
    evidenceClass: "structural trace",
    sourceLabel: "GitHub atom · inference SDK",
    sourceUrl: "https://github.com/vllm-project/vllm",
    people: ["greg-brockman"],
    lab: "unattributed",
  },
  {
    id: "q-cac-unmatched",
    arrived: "05:02 CET",
    gate: "leak",
    title: "Two unmatched CAC 备案 records still have no English or Hugging Face twin",
    body: "Weekend scrape leftovers. The names are in the filing; they are withheld here until a first-party or HF trace exists. MT of the filing is spot-checked. Human-gated because a named unreleased Chinese model would otherwise ship in the digest.",
    confirmsIf: "An HF org commit, a lab blog, or a named English outlet maps the records.",
    diesIf: "The records are withdrawn, or they map to already-public models on a second look.",
    confidence: "unverified",
    evidenceClass: "regulatory filing",
    sourceLabel: "CAC 备案公示",
    sourceUrl: "https://www.cac.gov.cn",
    people: ["liang-wenfeng"],
    lab: "unmatched",
    originalHeadline: "生成式人工智能服务备案公示（未匹配条目）",
  },
  {
    id: "q-recap-exhibit",
    arrived: "05:41 CET",
    gate: "regulation",
    title: "RECAP docket in a lab-vs-lab copyright matter added an exhibit list overnight",
    body: "CourtListener picked up a new exhibit index. Filings of this class routinely surface internal facts the daily press ignores. Human-gated as regulation-adjacent; the digest will not summarise exhibit contents unreviewed.",
    confirmsIf: "The exhibit is public on RECAP and names a lab, model, or licence term.",
    diesIf: "The filing is a scheduling order with no substance, or is sealed.",
    confidence: "unverified",
    evidenceClass: "structural trace",
    sourceLabel: "CourtListener RECAP",
    sourceUrl: "https://www.courtlistener.com",
    people: ["dario-amodei"],
    lab: "litigation",
  },
];

export const blockedQuotes = [
  {
    id: "q-quote-block",
    arrived: "06:22 CET",
    title: "Quote-check blocked an Import AI pull-quote — string not in fetched source",
    detail:
      "Stage 2 proposed a verbatim line that does not appear in this week's Import AI. The item was blocked automatically. The newsletter itself still admitted on other evidence; the quote did not.",
    sourceLabel: "quote-existence check",
  },
];

export interface XListEntry {
  handle: string;
  label: string;
  kind: "principal" | "lab" | "adjacent";
  personId?: string;
}

/** One List, one hourly call. ~35 handles. Filter precision is the constraint, not API cost. */
export const xList: XListEntry[] = [
  { handle: "sama", label: "Sam Altman", kind: "principal", personId: "sam-altman" },
  { handle: "gdb", label: "Greg Brockman", kind: "principal", personId: "greg-brockman" },
  { handle: "elonmusk", label: "Elon Musk", kind: "principal", personId: "elon-musk" },
  { handle: "demishassabis", label: "Demis Hassabis", kind: "principal", personId: "demis-hassabis" },
  { handle: "karpathy", label: "Andrej Karpathy", kind: "principal", personId: "andrej-karpathy" },
  { handle: "ch402", label: "Chris Olah", kind: "principal", personId: "chris-olah" },
  { handle: "jackclarkSF", label: "Jack Clark", kind: "principal", personId: "jack-clark" },
  { handle: "polynoamial", label: "Noam Brown", kind: "principal", personId: "noam-brown" },
  { handle: "dylan522p", label: "Dylan Patel", kind: "principal", personId: "dylan-patel" },
  { handle: "natolambert", label: "Nathan Lambert", kind: "principal", personId: "nathan-lambert" },
  { handle: "simonw", label: "Simon Willison", kind: "principal", personId: "simon-willison" },
  { handle: "dwarkesh_sp", label: "Dwarkesh Patel", kind: "principal", personId: "dwarkesh-patel" },
  { handle: "ylecun", label: "Yann LeCun", kind: "principal", personId: "yann-lecun" },
  { handle: "emollick", label: "Ethan Mollick", kind: "principal", personId: "ethan-mollick" },
  { handle: "AnthropicAI", label: "Anthropic", kind: "lab" },
  { handle: "OpenAI", label: "OpenAI", kind: "lab" },
  { handle: "GoogleDeepMind", label: "Google DeepMind", kind: "lab" },
  { handle: "xai", label: "xAI / SpaceXAI", kind: "lab" },
  { handle: "AIatMeta", label: "Meta AI", kind: "lab" },
  { handle: "mistralai", label: "Mistral", kind: "lab" },
  { handle: "Alibaba_Qwen", label: "Qwen", kind: "lab" },
  { handle: "Kimi_Moonshot", label: "Moonshot / Kimi", kind: "lab" },
  { handle: "deepseek_ai", label: "DeepSeek (when live)", kind: "lab" },
  { handle: "zhipuai", label: "Z.ai / 智谱", kind: "lab" },
  { handle: "SemiAnalysis_", label: "SemiAnalysis", kind: "adjacent" },
  { handle: "swyx", label: "Latent Space", kind: "adjacent" },
  { handle: "lmarena_ai", label: "LMArena", kind: "adjacent" },
  { handle: "ArtificialAnlys", label: "Artificial Analysis", kind: "adjacent" },
  { handle: "clementdelangue", label: "Hugging Face", kind: "adjacent" },
  { handle: "jeremyphoward", label: "Jeremy Howard", kind: "adjacent" },
  { handle: "_akhaliq", label: "AK", kind: "adjacent" },
  { handle: "DrJimFan", label: "Jim Fan", kind: "adjacent" },
  { handle: "ChinaTalkMedia", label: "ChinaTalk", kind: "adjacent" },
  { handle: "thezvi", label: "Zvi Mowshowitz", kind: "adjacent", personId: "zvi-mowshowitz" },
  { handle: "JensenHuang", label: "Jensen Huang", kind: "adjacent", personId: "jensen-huang" },
];

export interface AliasRule {
  needle: string;
  mapsTo: string;
  note: string;
}

export const aliasRules: AliasRule[] = [
  { needle: "梁文锋", mapsTo: "liang-wenfeng", note: "Liang Wenfeng" },
  { needle: "张鹏", mapsTo: "zhang-peng", note: "Zhang Peng" },
  { needle: "唐杰", mapsTo: "tang-jie", note: "Tang Jie" },
  { needle: "智谱", mapsTo: "zhang-peng", note: "Z.ai lab name in Chinese" },
  { needle: "Zhipu", mapsTo: "zhang-peng", note: "Latinised lab name" },
  { needle: "Z.ai", mapsTo: "zhang-peng", note: "Listed English name, HKEX 2513" },
  { needle: "杨植麟", mapsTo: "yang-zhilin", note: "Yang Zhilin" },
  { needle: "林俊旸", mapsTo: "junyang-lin", note: "Junyang Lin" },
  { needle: "月之暗面", mapsTo: "yang-zhilin", note: "Moonshot" },
];

export const exclusions = [
  {
    name: "Gary Marcus",
    why: "The position is stable and known. Daily monitoring adds no information — sample quarterly.",
  },
  {
    name: "Andrew Ng, Fei-Fei Li, Geoffrey Hinton, Timnit Gebru",
    why: "Genuinely important, but on a weekly-to-quarterly cadence. Putting them in a daily filter costs precision and buys nothing.",
  },
  {
    name: "~100-handle X lists",
    why: "With list polling the API cost is no longer the constraint — filter precision is. Every added name dilutes it.",
  },
  {
    name: "Most VC commentators and LinkedIn AI influencers",
    why: "Zero lead time. Downstream of names already on the roster.",
  },
];
