import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { quoteExists, quoteSources } from "@/lib/data/dropped";
import { cn } from "@/lib/utils";

export function QuoteCheck({ compact }: { compact?: boolean }) {
  const [sourceId, setSourceId] = useState(quoteSources[0]!.id);
  const source = quoteSources.find((s) => s.id === sourceId) ?? quoteSources[0]!;
  const [quote, setQuote] = useState(source.passSample);

  const pass = useMemo(() => quoteExists(source.excerpt, quote), [source.excerpt, quote]);
  const tooShort = quote.trim().length < 8;

  return (
    <div className={cn("rounded-xl border border-border bg-bg-elevated", compact ? "p-4" : "p-5")}>
      {compact ? null : (
        <>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
            Quote-existence check
          </p>
          <p className="mt-2 text-sm text-fg-muted">
            Verbatim string match against the fetched source. A paraphrase is a miss. A miss blocks
            the quote — not a hopeful prompt.
          </p>
        </>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {quoteSources.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setSourceId(s.id);
              setQuote(s.passSample);
            }}
            className={cn(
              "h-10 rounded-md px-3 font-mono text-[10px] uppercase tracking-[0.14em]",
              s.id === sourceId
                ? "bg-accent text-accent-fg"
                : "border border-border text-fg-muted hover:text-fg",
            )}
          >
            {s.label.split(" · ")[0]}
          </button>
        ))}
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        Fetched source
      </p>
      <p className="mt-2 font-serif text-sm leading-relaxed text-fg">{source.excerpt}</p>

      <label className="mt-4 block">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          Proposed quote
        </span>
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-md border border-border bg-bg px-3 py-2 text-sm leading-relaxed text-fg placeholder:text-fg-subtle focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setQuote(source.passSample)}>
          Verbatim line
        </Button>
        <Button size="sm" variant="outline" onClick={() => setQuote(source.failSample)}>
          Hallucinated line
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setQuote(
              source.passSample.replace(/ a /g, " the ").replace(/ you /g, " one ").replace(/\.$/, ""),
            )
          }
        >
          Near paraphrase
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p className="text-sm text-fg-muted">
          {tooShort
            ? "Quote too short to check."
            : pass
              ? "String is in the source."
              : "String is not in the source. Blocked."}
        </p>
        <Badge tone={tooShort ? "mute" : pass ? "confirmed" : "unverified"}>
          {tooShort ? "—" : pass ? "Pass" : "Block"}
        </Badge>
      </div>
    </div>
  );
}
