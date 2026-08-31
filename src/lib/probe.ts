import { createServerFn } from "@tanstack/react-start";
import { weeklyFeeds, weeklyFeedsById } from "@/lib/data/audit";
import { probeTargets, probesById, type ProbeResult, type ProbeTarget } from "@/lib/data/probes";

const UA = "AI-Rainmaker-Watch/1.0 (source-health-check)";
const TIMEOUT_MS = 5000;

async function hit(url: string): Promise<{ status: number | null; ok: boolean; ms: number; error?: string }> {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        "User-Agent": UA,
        Accept:
          "application/rss+xml, application/atom+xml, application/json, text/html;q=0.8, */*;q=0.5",
      },
    });
    return { status: res.status, ok: res.ok, ms: Date.now() - started };
  } catch (e) {
    const aborted = e instanceof Error && (e.name === "AbortError" || e.name === "TimeoutError");
    return {
      status: null,
      ok: false,
      ms: Date.now() - started,
      error: aborted ? "timeout" : "network",
    };
  }
}

function toResult(target: ProbeTarget, hitRes: Awaited<ReturnType<typeof hit>>, via: ProbeResult["via"]): ProbeResult {
  return {
    id: target.id,
    name: target.name,
    url: target.url,
    group: target.group,
    status: hitRes.status,
    ok: hitRes.ok,
    ms: hitRes.ms,
    error: hitRes.error,
    fallback: target.fallback,
    via,
  };
}

export const probeWorkingSet = createServerFn({ method: "POST" }).handler(async () => {
  const results = await Promise.all(
    probeTargets.map(async (t) => toResult(t, await hit(t.url), "direct")),
  );
  return { at: new Date().toISOString(), results };
});

export const probeWeeklies = createServerFn({ method: "POST" }).handler(async () => {
  const results = await Promise.all(
    weeklyFeeds.map(async (t) => toResult(t, await hit(t.url), "direct")),
  );
  return { at: new Date().toISOString(), results };
});



export const probeViaJina = createServerFn({ method: "POST" })
  .validator((d: unknown) => {
    const id = typeof d === "object" && d && "id" in d ? String((d as { id: unknown }).id) : "";
    if (!probesById[id]?.jina && !weeklyFeedsById[id]?.jina) throw new Error("unknown probe");
    return { id };
  })
  .handler(async ({ data }) => {
    const target = probesById[data.id] ?? weeklyFeedsById[data.id];
    if (!target || !target.jina) {
      throw new Error("unknown probe");
    }
    const jina = `https://r.jina.ai/${target.url}`;
    return toResult(target, await hit(jina), "jina");


  });
