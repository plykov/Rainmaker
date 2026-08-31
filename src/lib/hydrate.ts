import { useMemo } from "react";
import { LATEST_DATE } from "@/lib/data/digests";
import type { ProbeRun } from "@/lib/data/probes";
import { pendingQueue, type QueueItem } from "@/lib/data/desk";
import type { Digest, DigestItem, FetchFailure } from "@/lib/data/types";
import { useReader, type Edition, type QueueDecision } from "@/lib/store";

export function queueToDigestItem(q: QueueItem): DigestItem {
  return {
    id: q.id,
    date: LATEST_DATE,
    section: q.originalHeadline ? "china" : "leaks",
    title: q.title,
    body: q.body,
    originalHeadline: q.originalHeadline,
    confirmsIf: q.confirmsIf,
    diesIf: q.diesIf,
    confidence: q.confidence,
    lane: "fact",
    evidenceClass: q.evidenceClass,
    sourceLabel: q.sourceLabel,
    sourceUrl: q.sourceUrl,
    people: q.people,
    lab: q.lab,
    humanGated: true,
    scores: { novelty: 7.4, authority: 6.6, consequence: 7.2 },
  };
}

export function releasedItems(decisions: Record<string, QueueDecision>): DigestItem[] {
  return pendingQueue.filter((q) => decisions[q.id] === "released").map(queueToDigestItem);
}

export function liveFetchFailures(probe: ProbeRun | null, date: string): FetchFailure[] | null {
  if (!probe || probe.date !== date) return null;
  const fails = probe.results.filter((r) => !r.ok);
  return fails.map((r) => {
    const status = r.status != null ? String(r.status) : r.error ?? "fail";
    const via = r.via === "jina" ? " via r.jina.ai" : "";
    const fallback = r.fallback ? ` — ${r.fallback}` : "";
    return {
      source: r.name,
      detail: `${status}${via}, ${r.ms}ms${fallback}`,
    };
  });
}

/** Desk-released items join Today only after Delivery stamps the edition. */
export function hydrateDigest(
  digest: Digest,
  decisions: Record<string, QueueDecision>,
  probe: ProbeRun | null = null,
  edition: Edition | null = null,
): Digest {
  if (digest.date !== LATEST_DATE) return digest;
  const extra = releasedItems(decisions).filter((i) => edition?.queueIds.includes(i.id));
  const live = liveFetchFailures(probe, digest.date);
  if (extra.length === 0 && live == null) return digest;
  return {
    ...digest,
    admitted: digest.admitted + extra.length,
    items: extra.length ? [...digest.items, ...extra] : digest.items,
    fetchFailures: live ?? digest.fetchFailures,
  };
}

export function useHydratedDigest(digest: Digest): Digest {
  const decisions = useReader((s) => s.queueDecisions);
  const probe = useReader((s) => s.probe);
  const edition = useReader((s) => s.editions[digest.date] ?? null);
  return useMemo(
    () => hydrateDigest(digest, decisions, probe, edition),
    [digest, decisions, probe, edition],
  );
}

export function useReleasedItems(): DigestItem[] {
  const decisions = useReader((s) => s.queueDecisions);
  return useMemo(() => releasedItems(decisions), [decisions]);
}
