import { createServerFn } from "@tanstack/react-start";
import type { Digest, DigestItem, RadarEvent } from "@/lib/data/types";

export const LIVE_BRANCH = "ingest/daily";
export const LIVE_LATEST_URL =
  "https://raw.githubusercontent.com/plykov/Rainmaker/ingest/daily/latest.json";

/** Same-origin /api/live first (grok.me CSP). GitHub wins if its date is newer. */
export const LIVE_MIRRORS = [
  "/api/live",
  "/briefing/latest.json",
  LIVE_LATEST_URL,
  "https://cdn.jsdelivr.net/gh/plykov/Rainmaker@ingest/daily/latest.json",
  "https://plykov.github.io/Rainmaker/briefing/latest.json",
];

export function liveDatedUrl(date: string) {
  return `https://raw.githubusercontent.com/plykov/Rainmaker/ingest/daily/${date}.json`;
}

export function liveDatedMirrors(date: string) {
  return [
    `/briefing/${date}.json`,
    liveDatedUrl(date),
    `https://cdn.jsdelivr.net/gh/plykov/Rainmaker@ingest/daily/${date}.json`,
  ];
}

export interface LiveEnvelope {
  schema: "rainmaker.digest.v1";
  publishedAt: string;
  digest: Digest;
}

const SECTIONS = new Set([
  "lede",
  "critical",
  "leaks",
  "words",
  "research",
  "china",
  "trend",
  "radar",
]);

function asString(v: unknown, fallback = "") {
  return typeof v === "string" ? v : fallback;
}

function asNumber(v: unknown, fallback = 0) {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function parseItem(raw: unknown, date: string, i: number): DigestItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const title = asString(r.title).trim();
  const body = asString(r.body).trim();
  const sourceUrl = asString(r.sourceUrl).trim();
  if (!title || !body || !sourceUrl) return null;
  const section = SECTIONS.has(asString(r.section)) ? (r.section as DigestItem["section"]) : "critical";
  const people = Array.isArray(r.people) ? r.people.filter((p): p is string => typeof p === "string") : [];
  return {
    id: asString(r.id) || `${date}-${section}-${i}`,
    date: asString(r.date) || date,
    section,
    title,
    body,
    watchNext: asString(r.watchNext) || undefined,
    originalHeadline: asString(r.originalHeadline) || undefined,
    confidence: r.confidence === "reported" || r.confidence === "unverified" ? r.confidence : "confirmed",
    lane: r.lane === "analysis" ? "analysis" : "fact",
    evidenceClass: (() => {
      const raw = asString(r.evidenceClass);
      if (raw === "named-outlet") return "named outlet";
      return (raw || "first-party") as DigestItem["evidenceClass"];
    })(),
    sourceLabel: asString(r.sourceLabel) || "live edition",
    sourceUrl,
    people,
    lab: asString(r.lab) || undefined,
    model: asString(r.model) || undefined,
    humanGated: Boolean(r.humanGated),
    confirmsIf: asString(r.confirmsIf) || undefined,
    diesIf: asString(r.diesIf) || undefined,
    quote:
      r.quote && typeof r.quote === "object"
        ? {
            text: asString((r.quote as Record<string, unknown>).text),
            attribution: asString((r.quote as Record<string, unknown>).attribution),
            timestamp: asString((r.quote as Record<string, unknown>).timestamp) || undefined,
            check: (r.quote as Record<string, unknown>).check === "fail" ? "fail" : "pass",
          }
        : undefined,
    scores:
      r.scores && typeof r.scores === "object"
        ? {
            novelty: asNumber((r.scores as Record<string, unknown>).novelty),
            authority: asNumber((r.scores as Record<string, unknown>).authority),
            consequence: asNumber((r.scores as Record<string, unknown>).consequence),
          }
        : undefined,
  };
}

export function parseLiveEnvelope(raw: unknown): LiveEnvelope | null {
  if (!raw || typeof raw !== "object") return null;
  const root = raw as Record<string, unknown>;
  const digestRaw = (root.digest && typeof root.digest === "object" ? root.digest : root) as Record<
    string,
    unknown
  >;
  const date = asString(digestRaw.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const itemsIn = Array.isArray(digestRaw.items) ? digestRaw.items : [];
  const items = itemsIn.map((it, i) => parseItem(it, date, i)).filter((x): x is DigestItem => Boolean(x));
  if (items.length === 0) return null;
  const radar: RadarEvent[] = Array.isArray(digestRaw.radar)
    ? digestRaw.radar
        .filter((x): x is RadarEvent => Boolean(x && typeof x === "object" && "date" in x && "label" in x))
        .map((x) => ({
          date: asString((x as RadarEvent).date),
          label: asString((x as RadarEvent).label),
          kind: asString((x as RadarEvent).kind) || "note",
        }))
    : [];
  const human = (digestRaw.humanHeld && typeof digestRaw.humanHeld === "object"
    ? digestRaw.humanHeld
    : {}) as Record<string, unknown>;
  const digest: Digest = {
    date,
    weekdayNote: asString(digestRaw.weekdayNote) || undefined,
    scanned: asNumber(digestRaw.scanned),
    passedRules: asNumber(digestRaw.passedRules),
    triaged: asNumber(digestRaw.triaged),
    admitted: asNumber(digestRaw.admitted) || items.length,
    merged: asNumber(digestRaw.merged),
    quoteBlocked: asNumber(digestRaw.quoteBlocked),
    ledeAbsent: Boolean(digestRaw.ledeAbsent),
    humanHeld: {
      leak: asNumber(human.leak),
      regulation: asNumber(human.regulation),
      releasedAt: asString(human.releasedAt) || undefined,
    },
    fetchFailures: Array.isArray(digestRaw.fetchFailures)
      ? digestRaw.fetchFailures
          .filter((x): x is { source: string; detail: string } => Boolean(x && typeof x === "object"))
          .map((x) => ({
            source: asString((x as { source: string }).source),
            detail: asString((x as { detail: string }).detail),
          }))
      : [],
    nextAudit: asString(digestRaw.nextAudit) || "Mon 07 Sep",
    rumorScorecardDue: asString(digestRaw.rumorScorecardDue) || undefined,
    items,
    radar,
  };
  return {
    schema: "rainmaker.digest.v1",
    publishedAt: asString(root.publishedAt) || new Date().toISOString(),
    digest,
  };
}

async function pull(url: string): Promise<LiveEnvelope | null> {
  try {
    const res = await fetch(`${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
      headers: { Accept: "application/json", "User-Agent": "AI-Rainmaker-Watch/1.0" },
    });
    if (!res.ok) return null;
    return parseLiveEnvelope(await res.json());
  } catch {
    return null;
  }
}

async function pullBest(urls: string[]): Promise<LiveEnvelope | null> {
  const found = (
    await Promise.all(
      urls.map(async (url) => {
        const abs =
          url.startsWith("http") || typeof window === "undefined" ? url : new URL(url, window.location.origin).href;
        if (!abs.startsWith("http")) return pull(url);
        return pull(abs);
      }),
    )
  ).filter((x): x is LiveEnvelope => Boolean(x));
  if (found.length === 0) return null;
  found.sort((a, b) => {
    const d = b.digest.date.localeCompare(a.digest.date);
    return d !== 0 ? d : b.publishedAt.localeCompare(a.publishedAt);
  });
  return found[0];
}

export const fetchLiveLatest = createServerFn({ method: "GET" }).handler(async () => {
  return pullBest(LIVE_MIRRORS.filter((u) => u.startsWith("http")));
});

export const fetchLiveDated = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const date =
      typeof d === "object" && d && "date" in d ? String((d as { date: unknown }).date) : "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("bad date");
    return { date };
  })
  .handler(async ({ data }) => {
    return pullBest(liveDatedMirrors(data.date).filter((u) => u.startsWith("http")));
  });
