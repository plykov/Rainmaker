import { useMemo } from "react";
import { LATEST_DATE } from "@/lib/data/digests";
import { pendingQueue, type QueueItem } from "@/lib/data/desk";
import type { Digest, DigestItem } from "@/lib/data/types";
import { useReader, type QueueDecision } from "@/lib/store";

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

/** Operator override: released queue items join the live 07:00 page, not the 06:40 snapshot. */
export function hydrateDigest(
  digest: Digest,
  decisions: Record<string, QueueDecision>,
): Digest {
  if (digest.date !== LATEST_DATE) return digest;
  const extra = releasedItems(decisions);
  if (extra.length === 0) return digest;
  return {
    ...digest,
    admitted: digest.admitted + extra.length,
    items: [...digest.items, ...extra],
  };
}

export function useHydratedDigest(digest: Digest): Digest {
  const decisions = useReader((s) => s.queueDecisions);
  return useMemo(() => hydrateDigest(digest, decisions), [digest, decisions]);
}

export function useReleasedItems(): DigestItem[] {
  const decisions = useReader((s) => s.queueDecisions);
  return useMemo(() => releasedItems(decisions), [decisions]);
}
