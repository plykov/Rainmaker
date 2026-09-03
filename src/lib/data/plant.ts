export type PlantKind = "live" | "not-running";

export interface PlantJob {
  id: string;
  name: string;
  cadence: string;
  time: string;
  tz: string;
  nextRun: string;
  nextLabel: string;
  kind: PlantKind;
  channel: string;
  note: string;
  taskId?: string;
}

/** Live Grok automations. n8n / X List / Jetstream are not in this preview. */
export const plantJobs: PlantJob[] = [
  {
    id: "daily",
    name: "Stage 2 + 07:00 send",
    cadence: "Daily",
    time: "07:00",
    tz: "Europe/Berlin",
    nextRun: "2026-09-04T05:00:00+00:00",
    nextLabel: "Fri 4 Sep · 07:00 CET",
    kind: "live",
    channel: "Grok email + app + rainmaker.grok.me",
    note: "One frontier call. Writes ingest/daily/latest.json so the hosted app updates without a rebuild.",
    taskId: "0bde989d-40f8-490e-8d1e-afc7ca3890ee",
  },
  {
    id: "audit",
    name: "Monday recall audit",
    cadence: "Weekly · Monday",
    time: "08:00",
    tz: "Europe/Berlin",
    nextRun: "2026-09-07T06:00:00+00:00",
    nextLabel: "Mon 7 Sep · 08:00 CET",
    kind: "live",
    channel: "Grok email + app",
    note: "Diff the week against Import AI and Don't Worry About the Vase. One call.",
    taskId: "914971c9-43f8-4a7a-89d2-89bdedd30836",
  },
  {
    id: "github",
    name: "Structural GitHub",
    cadence: "On release",
    time: "event",
    tz: "UTC",
    nextRun: "",
    nextLabel: "vLLM · llama.cpp · transformers · sglang · DeepSeek kernels",
    kind: "live",
    channel: "Grok app (not email)",
    note: "GitHub Action watches releases hourly. Grok Stage 1 only runs when a new tag is pushed to ingest/structural. Quiet hours cost nothing.",
    taskId: "c8d75431-a347-4482-94e2-2070fb16b81e",
  },
  {
    id: "ingest",
    name: "n8n ingest",
    cadence: "Every 30 min",
    time: ":00 / :30",
    tz: "Europe/Berlin",
    nextRun: "",
    nextLabel: "needs a VPS",
    kind: "not-running",
    channel: "—",
    note: "RSS, HF, GitHub, EDGAR, RECAP. Not a model job. This preview cannot host it.",
  },
  {
    id: "x",
    name: "X List timeline",
    cadence: "Hourly",
    time: ":00",
    tz: "Europe/Berlin",
    nextRun: "",
    nextLabel: "no X connector",
    kind: "not-running",
    channel: "—",
    note: "One List, ~35 handles. X is not a Grok connector; the daily task searches public posts instead.",
  },
];

export const dailyPlant = plantJobs[0];
export const auditPlant = plantJobs[1];
