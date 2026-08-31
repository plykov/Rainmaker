import { format, parseISO } from "date-fns";

export function formatBriefingDate(iso: string): string {
  return format(parseISO(iso), "EEE d MMM yyyy");
}

export function formatShortDate(iso: string): string {
  return format(parseISO(iso), "d MMM");
}

export function formatRadarDate(iso: string): string {
  return format(parseISO(iso), "EEE d MMM");
}

export function wordsOf(...parts: Array<string | undefined | null>): number {
  return parts
    .filter((p): p is string => Boolean(p && p.trim()))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readTimeLabel(wordCount: number): string {
  const minutes = Math.max(1, wordCount / 160);
  const totalSeconds = Math.round(minutes * 60);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m${String(s).padStart(2, "0")}s`;
}

export function geometricMean(a: number, b: number, c: number): number {
  if (a <= 0 || b <= 0 || c <= 0) return 0;
  return Math.cbrt(a * b * c);
}

/** Rejected 100-point additive ranker. Reach and a derived actionability term can carry a zero-novelty recap. */
export function additiveScore(novelty: number, authority: number, consequence: number, reach: number): number {
  const impact = consequence * 4;
  const nov = novelty * 2;
  const cred = authority * 2;
  const r = reach * 1;
  const action = ((consequence + novelty) / 2) * 1;
  return impact + nov + cred + r + action;
}

export function formatScore(n: number): string {
  return n.toFixed(1);
}
