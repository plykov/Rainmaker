import type { Digest } from "./types";
import { digest20260902 } from "./digest-2026-09-02";

export const LATEST_DATE = "2026-09-02";

const radarShared = [
  { date: "2026-09-07", label: "Weekly recall audit vs Import AI and Don't Worry About the Vase", kind: "audit" },
  { date: "2026-09-15", label: "HKEX 2513 — expected interim window", kind: "filing" },
  { date: "2026-10-01", label: "Monthly rumor-vs-outcome scorecard", kind: "qa" },
];

export { radarShared };

export const digests: Digest[] = [digest20260902];

export const digestByDate: Record<string, Digest> = Object.fromEntries(
  digests.map((d) => [d.date, d]),
);

export const digestDates = [...digests.map((d) => d.date)].sort();

export function getDigest(date: string): Digest | undefined {
  return digestByDate[date];
}

export function getLatestDigest(): Digest {
  return digestByDate[LATEST_DATE]!;
}

export function adjacentDates(date: string): { prev?: string; next?: string } {
  const sorted = [...digestDates].sort();
  const i = sorted.indexOf(date);
  if (i < 0) return {};
  return {
    prev: i > 0 ? sorted[i - 1] : undefined,
    next: i < sorted.length - 1 ? sorted[i + 1] : undefined,
  };
}

export function allItems() {
  return digests.flatMap((d) => d.items);
}

export function itemsForPerson(personId: string) {
  return allItems().filter((i) => i.people.includes(personId));
}

export function digestWordCount(digest: Digest): number {
  let n = 0;
  for (const item of digest.items) {
    const text = [
      item.title,
      item.body,
      item.watchNext,
      item.quote?.text,
      item.confirmsIf,
      item.diesIf,
      item.originalHeadline,
    ]
      .filter(Boolean)
      .join(" ");
    n += text.split(/\s+/).filter(Boolean).length;
  }
  return n;
}
