import { getLatestDigest } from "./digests";
import { sources } from "./sources";

export const CET_TZ = "Europe/Berlin";

export function cetParts(d: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CET_TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    weekday: get("weekday"),
    day: get("day"),
    month: get("month"),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    second: Number(get("second")),
    time: `${get("hour")}:${get("minute")}:${get("second")}`,
    hm: `${get("hour")}:${get("minute")}`,
  };
}

export function nextHalfHour(d: Date): { label: string; seconds: number } {
  const { hour, minute, second } = cetParts(d);
  const elapsed = hour * 3600 + minute * 60 + second;
  const next = (Math.floor(elapsed / 1800) + 1) * 1800;
  const seconds = next - elapsed;
  const nh = Math.floor((next % 86400) / 3600);
  const nm = Math.floor((next % 3600) / 60);
  return {
    label: `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")} CET`,
    seconds,
  };
}

export function secondsLabel(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

/** One List, ~35 handles. Org accounts fill the roster people who do not post. */
export const xList = [
  { handle: "sama", personId: "sam-altman", hourPosts: 1 },
  { handle: "gdb", personId: "greg-brockman", hourPosts: 0 },
  { handle: "elonmusk", personId: "elon-musk", hourPosts: 11 },
  { handle: "demishassabis", personId: "demis-hassabis", hourPosts: 0 },
  { handle: "karpathy", personId: "andrej-karpathy", hourPosts: 0 },
  { handle: "ch402", personId: "chris-olah", hourPosts: 0 },
  { handle: "jackclarkSF", personId: "jack-clark", hourPosts: 0 },
  { handle: "polynoamial", personId: "noam-brown", hourPosts: 0 },
  { handle: "dylan522p", personId: "dylan-patel", hourPosts: 1 },
  { handle: "natolambert", personId: "nathan-lambert", hourPosts: 2 },
  { handle: "simonw", personId: "simon-willison", hourPosts: 1 },
  { handle: "dwarkesh_sp", personId: "dwarkesh-patel", hourPosts: 0 },
  { handle: "ylecun", personId: "yann-lecun", hourPosts: 4 },
  { handle: "emollick", personId: "ethan-mollick", hourPosts: 0 },
  { handle: "AnthropicAI", personId: "dario-amodei", hourPosts: 0 },
  { handle: "OpenAI", personId: "sam-altman", hourPosts: 0 },
  { handle: "GoogleDeepMind", personId: "demis-hassabis", hourPosts: 0 },
  { handle: "xai", personId: "elon-musk", hourPosts: 0 },
  { handle: "AIatMeta", personId: "alexandr-wang", hourPosts: 0 },
  { handle: "MistralAI", personId: "arthur-mensch", hourPosts: 0 },
  { handle: "nvidia", personId: "jensen-huang", hourPosts: 0 },
  { handle: "huggingface", personId: "nathan-lambert", hourPosts: 1 },
  { handle: "Alibaba_Qwen", personId: "junyang-lin", hourPosts: 0 },
  { handle: "Kimi_Moonshot", personId: "yang-zhilin", hourPosts: 0 },
  { handle: "z_ai_official", personId: "tang-jie", hourPosts: 0 },
  { handle: "deepseek_ai", personId: "liang-wenfeng", hourPosts: 0 },
  { handle: "thinkingmachines", personId: "mira-murati", hourPosts: 0 },
  { handle: "ssi", personId: "ilya-sutskever", hourPosts: 0 },
  { handle: "importai", personId: "jack-clark", hourPosts: 0 },
  { handle: "interconnects", personId: "nathan-lambert", hourPosts: 0 },
  { handle: "ChinaTalk_org", personId: "jordan-schneider", hourPosts: 0 },
  { handle: "techmeme", personId: null, hourPosts: 3 },
  { handle: "TheInformation", personId: null, hourPosts: 1 },
  { handle: "ArtificialAnlys", personId: null, hourPosts: 0 },
  { handle: "lmsysorg", personId: null, hourPosts: 0 },
] as const;

export const jobs = [
  {
    id: "ingest",
    time: "every :00 / :30",
    name: "Ingest",
    detail: "n8n — RSS, HF, GitHub, EDGAR, RECAP, HTML diff. Seen-store write.",
    state: "running" as const,
  },
  {
    id: "x",
    time: "hourly",
    name: "X List",
    detail: "One timeline call, ~35 handles. Pricing unverified against the rate card.",
    state: "idle" as const,
  },
  {
    id: "bsky",
    time: "streaming",
    name: "Bluesky Jetstream",
    detail: "Author and keyword filter. €0. Partial substitute for paid X.",
    state: "live" as const,
  },
  {
    id: "s2",
    time: "06:40 CET",
    name: "Stage 2 synthesis",
    detail: "One frontier call, two lanes. Consumes the prepared pool — does not fetch.",
    state: "done" as const,
  },
  {
    id: "gate",
    time: "~06:50 CET",
    name: "Human gate",
    detail: "Leak and regulation proposed, not published.",
    state: "done" as const,
  },
  {
    id: "send",
    time: "07:00 CET",
    name: "Delivery",
    detail: "Hosted page updated in place. Email is the same snapshot.",
    state: "done" as const,
  },
  {
    id: "audit",
    time: "Mondays",
    name: "Recall audit",
    detail: "Diff the week against Import AI and Don't Worry About the Vase.",
    state: "due" as const,
  },
  {
    id: "qa",
    time: "01 Oct",
    name: "Rumor scorecard",
    detail: "Decay source trust against what actually happened.",
    state: "due" as const,
  },
];

export const synthSteps = () => {
  const d = getLatestDigest();
  return [
    { id: "scan", label: "Scanned", n: d.scanned, note: "110 sources · 30 min poll overnight" },
    { id: "s0", label: "Stage 0", n: d.passedRules, note: "Rules + 梁文锋/唐杰/智谱 aliases + hash" },
    { id: "s1", label: "Stage 1", n: d.triaged, note: "Small model, JSON, BGE-M3, temperature 0" },
    { id: "held", label: "Held", n: d.humanHeld.leak + d.humanHeld.regulation, note: "Leak → desk, not the 07:00 snapshot" },
    { id: "in", label: "Admitted", n: d.admitted, note: "Stage 2, two lanes · 07:00 page" },
  ];
};

/** Midday 30-min poll: fills the seen-store. Does not publish. */
export const middaySteps = [
  { id: "scan", label: "Scanned", n: 96, note: "Same 110 endpoints, quiet afternoon" },
  { id: "s0", label: "Stage 0", n: 18, note: "Mostly near-duplicates of this morning" },
  { id: "s1", label: "Stage 1", n: 2, note: "Neither clears consequence. Seen-store updated." },
  { id: "held", label: "Held", n: 0, note: "No leak or regulation in this cycle" },
  { id: "in", label: "Admitted", n: 0, note: "Synthesis is once a day. This poll does not ship a page." },
];

export const fetchBoard = sources
  .filter((s) => s.health !== "ok")
  .map((s) => ({
    id: s.id,
    name: s.name,
    detail: s.healthNote ?? s.caveat ?? "degraded",
    fallback: s.id === "lab-newsrooms" ? "r.jina.ai reader — titles only, selector still 403" : s.id === "china-desk" ? "10-minute manual scan used at 06:12 CET" : "titles from RSS, body not fetched",
  }));

export const xListCost = {
  oneCall: "1 request / hour",
  perHandle: `${xList.length} requests / hour`,
  note: "List polling is the cost lever. €10–40/month is inferred, not a quoted rate.",
};

export const handleCount = xList.length;
