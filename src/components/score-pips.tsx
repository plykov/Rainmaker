import { cn } from "@/lib/utils";
import { formatScore, geometricMean } from "@/lib/format";
import type { Scores } from "@/lib/data/types";

export function ScorePips({ scores, className }: { scores: Scores; className?: string }) {
  const product = geometricMean(scores.novelty, scores.authority, scores.consequence);
  const axes = [
    { k: "N", v: scores.novelty },
    { k: "A", v: scores.authority },
    { k: "C", v: scores.consequence },
  ];
  return (
    <div className={cn("flex items-center gap-3 font-mono text-[10px] text-fg-muted", className)}>
      <span className="text-fg tabular-nums tracking-wide">{formatScore(product)}</span>
      <span className="hidden sm:flex items-center gap-2">
        {axes.map((a) => (
          <span key={a.k} className="flex items-center gap-1">
            <span className="text-fg-subtle">{a.k}</span>
            <span
              className="inline-block h-1 w-8 overflow-hidden rounded-full bg-bg-subtle"
              aria-label={`${a.k} ${a.v}`}
            >
              <span
                className="block h-full bg-accent/70"
                style={{ width: `${Math.min(100, a.v * 10)}%` }}
              />
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}
