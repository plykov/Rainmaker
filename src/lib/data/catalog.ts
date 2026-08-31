import type { Confidence, DigestItem, SectionId } from "./types";
import { geometricMean } from "../format";
import { peopleById } from "./people";

export const SECTION_META: Record<
  SectionId,
  { label: string; cap: number; kicker: string }
> = {
  lede: { label: "The Lede", cap: 1, kicker: "One item, or none." },
  critical: { label: "Critical events", cap: 4, kicker: "Confirmed, first-party or filing-grade." },
  leaks: { label: "Leaks & unconfirmed", cap: 3, kicker: "Reported or Unverified. Human-gated." },
  words: { label: "In their own words", cap: 3, kicker: "Quote string-verified against source." },
  research: { label: "Research & capability", cap: 3, kicker: "The result, not the abstract." },
  china: { label: "China desk", cap: 2, kicker: "Present even on quiet days." },
  trend: { label: "Trend line", cap: 1, kicker: "Analysis lane. Never mixed into facts." },
  radar: { label: "Radar", cap: 3, kicker: "Dated upcoming events." },
};

export const SECTION_ORDER: SectionId[] = [
  "lede",
  "critical",
  "leaks",
  "words",
  "research",
  "china",
  "trend",
];

export function itemScore(item: DigestItem): number | null {
  if (!item.scores) return null;
  return geometricMean(
    item.scores.novelty,
    item.scores.authority,
    item.scores.consequence,
  );
}

export function confidenceTone(c: Confidence): "confirmed" | "reported" | "unverified" {
  return c;
}

export function searchItems(items: DigestItem[], q: string): DigestItem[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return items;
  return items.filter((item) => {
    const people = item.people
      .map((id) => {
        const p = peopleById[id];
        return p ? `${p.name} ${p.nameNative ?? ""} ${p.org} ${(p.aliases ?? []).join(" ")}` : id;
      })
      .join(" ");
    const hay = [
      item.title,
      item.body,
      item.watchNext,
      item.sourceLabel,
      item.lab,
      item.model,
      item.originalHeadline,
      item.quote?.text,
      people,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(needle);
  });
}
