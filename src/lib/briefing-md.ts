import { SECTION_META, SECTION_ORDER, itemScore } from "@/lib/data/catalog";
import { digestWordCount } from "@/lib/data/digests";
import type { Digest } from "@/lib/data/types";
import { formatBriefingDate, formatScore, readTimeLabel } from "@/lib/format";

export function toBriefingMarkdown(digest: Digest): string {
  const words = digestWordCount(digest);
  const lines: string[] = [
    `# AI Rainmaker Watch — ${formatBriefingDate(digest.date)}`,
    `07:00 CET · ${digest.scanned.toLocaleString()} scanned → ${digest.admitted} admitted · ${words} words · ${readTimeLabel(words)}`,
    "",
  ];

  if (digest.ledeAbsent) {
    lines.push("## The Lede", "", "No single dominant story today.", "");
  }

  for (const id of SECTION_ORDER) {
    const items = digest.items.filter((i) => i.section === id);
    if (items.length === 0) continue;
    if (id === "lede" && digest.ledeAbsent) continue;
    lines.push(`## ${SECTION_META[id].label}`, "");
    for (const item of items) {
      const score = itemScore(item);
      lines.push(`### ${item.title}`, "");
      lines.push(item.body);
      if (item.watchNext) lines.push(`Watch next: ${item.watchNext}`);
      if (item.quote) lines.push(`> ${item.quote.text} — ${item.quote.attribution}`);
      if (item.originalHeadline) lines.push(`Original: ${item.originalHeadline}`);
      if (item.confirmsIf) lines.push(`Confirms if: ${item.confirmsIf}`);
      if (item.diesIf) lines.push(`Dies if: ${item.diesIf}`);
      const bits = [
        item.confidence,
        item.evidenceClass,
        score != null ? `score ${formatScore(score)}` : null,
        item.sourceLabel,
      ].filter(Boolean);
      lines.push(`_${bits.join(" · ")}_`, "");
    }
  }

  if (digest.radar.length) {
    lines.push("## Radar", "");
    for (const r of digest.radar) {
      lines.push(`- ${r.date} — ${r.label} (${r.kind})`);
    }
    lines.push("");
  }

  lines.push(
    "---",
    `Coverage — ${digest.scanned.toLocaleString()} scanned · ${digest.passedRules} passed rules · ${digest.triaged} triaged ≥6.0 · ${digest.admitted} admitted · ${digest.merged} merged · ${digest.quoteBlocked} blocked by quote check`,
  );
  return lines.join("\n");
}
