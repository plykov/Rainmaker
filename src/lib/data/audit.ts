import type { AuditVerdict, ProbeTarget } from "./types";
import { mondayAudit, rumorScorecard } from "./pipeline";

export const AUDIT_DUE = "2026-08-31";
export const AUDIT_NEXT = "2026-09-07";
export const SCORECARD_DUE = "2026-10-01";

export const auditWeek = {
  id: AUDIT_DUE,
  label: "Week of 24–30 Aug",
  due: AUDIT_DUE,
  next: AUDIT_NEXT,
  against: ["Import AI", "Don't Worry About the Vase"] as const,
};

export const weeklyFeeds: ProbeTarget[] = [
  {
    id: "import-ai",
    name: "Import AI",
    url: "https://importai.substack.com/feed",
    group: "weeklies",
    fallback: "Open the site if the feed 403s — Jack Clark's Sunday letter is the audit prior",
    jina: true,
  },
  {
    id: "zvi",
    name: "Don't Worry About the Vase",
    url: "https://thezvi.substack.com/feed",
    group: "weeklies",
    fallback: "Very long. Titles are enough to diff; body is the recall net, not the daily filter",
    jina: true,
  },
];

export const weeklyFeedsById = Object.fromEntries(weeklyFeeds.map((t) => [t.id, t]));

export const VERDICT_LABEL: Record<AuditVerdict, string> = {
  caught: "Caught",
  miss: "Miss",
  "correct-drop": "Correct drop",
};

export function seedVerdicts(): Record<string, AuditVerdict> {
  return Object.fromEntries(mondayAudit.map((r) => [r.id, r.verdict]));
}

export function auditStats(verdicts: Record<string, AuditVerdict>) {
  let caught = 0;
  let miss = 0;
  let correctDrop = 0;
  for (const row of mondayAudit) {
    const v = verdicts[row.id] ?? row.verdict;
    if (v === "caught") caught += 1;
    else if (v === "miss") miss += 1;
    else correctDrop += 1;
  }
  const denom = caught + miss;
  const recall = denom === 0 ? 1 : caught / denom;
  return { caught, miss, correctDrop, recall, rows: mondayAudit.length };
}

export function missNotes(verdicts: Record<string, AuditVerdict>) {
  return mondayAudit.filter((r) => (verdicts[r.id] ?? r.verdict) === "miss");
}

export { mondayAudit, rumorScorecard };
