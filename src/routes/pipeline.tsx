import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { QuoteCheck } from "@/components/quote-check";
import { Badge } from "@/components/ui/badge";
import { droppedToday, dropReasonLabel } from "@/lib/data/dropped";
import { mondayAudit, rumorScorecard, admissionAxes, gates, pipelineLayers, standingRules, unverifiedLedger, verifiedLedger, constraints, optionsAssessed, failureMode, extractionDemo, laneDemo, mergedToday } from "@/lib/data/pipeline";
import { getLatestDigest } from "@/lib/data/digests";
import { peopleById } from "@/lib/data/people";
import { additiveScore, formatScore, geometricMean } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pipeline")({ component: PipelinePage });

function PipelinePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">§03–04</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">How the page is made</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
        Filtering is cheap and summarisation is rare. Facts and analysis never merge. A digest that
        misses the day's biggest story looks identical to a perfect one — which is why Monday's
        recall audit and the rumor scorecard are first-class, not decoration.{" "}
        <Link to="/method" className="underline-offset-4 hover:underline">
          How the inputs were scored
        </Link>
        .
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {constraints.map((c) => (
          <li key={c.name} className="rounded-xl border border-border bg-bg-elevated p-4">
            <h2 className="font-serif text-lg tracking-tight">{c.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{c.detail}</p>
          </li>
        ))}
      </ul>

      <AdmissionFunnel />

      <aside className="mt-8 rounded-xl border border-unverified/30 bg-bg-elevated p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-unverified">
          Failure mode
        </p>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{failureMode}</p>
      </aside>

      <section className="mt-12">
        <h2 className="font-serif text-2xl tracking-tight">Options assessed</h2>
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {optionsAssessed.map((o) => (
            <li key={o.id} className="grid gap-2 py-4 sm:grid-cols-[6.5rem_1fr]">
              <p
                className={cn(
                  "font-mono text-[10px] uppercase tracking-[0.14em]",
                  o.stance === "Avoid"
                    ? "text-unverified"
                    : o.stance === "Partial"
                      ? "text-reported"
                      : "text-confirmed",
                )}
              >
                {o.stance}
              </p>
              <div>
                <h3 className="font-serif text-lg tracking-tight">{o.name}</h3>
                <p className="mt-1 text-sm text-fg-muted">{o.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl tracking-tight">Recommended build</h2>
        <ol className="mt-5 divide-y divide-border border-y border-border">
          {pipelineLayers.map((layer, i) => (
            <li key={layer.id} className="grid gap-2 py-4 sm:grid-cols-[2.5rem_1fr_auto]">
              <span className="font-mono text-xs tabular-nums text-fg-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-serif text-lg tracking-tight">{layer.name}</h3>
                <p className="mt-1 text-sm text-fg-muted">{layer.detail}</p>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle sm:text-right">
                <p>{layer.runs}</p>
                <p className="mt-1 text-fg">{layer.cost}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-fg-subtle">
          * X List polling estimate unverified against the vendor rate card. Total otherwise
          €35–95/month. Delivery is email plus the hosted page — open{" "}
          <Link to="/" className="underline-offset-4 hover:underline">
            this morning's send
          </Link>{" "}
          from any issue, or the{" "}
          <Link to="/specimen" className="underline-offset-4 hover:underline">
            format specimen
          </Link>
          .
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight">Two lanes, two hard gates</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {gates.map((g) => (
            <li key={g.name} className="rounded-xl border border-border bg-bg-elevated p-4">
              <h3 className="font-serif text-lg tracking-tight">{g.name}</h3>
              <p className="mt-2 text-sm text-fg-muted">{g.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <LaneSplit />
      <ExtractionDemo />

      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight">Multiplicative admission</h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Score 0–10 on three axes; admit on the product, so a zero on any axis is fatal. Displayed
          score is the geometric mean. Reach is a tiebreaker only — never an admission criterion. A
          high-reach recap cannot clear the bar on volume alone.
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {admissionAxes.map((a) => (
            <li key={a.id} className="rounded-xl border border-border bg-bg-elevated p-4">
              <h3 className="font-serif text-lg tracking-tight">{a.name}</h3>
              <p className="mt-1 text-sm text-fg">{a.question}</p>
              <p className="mt-3 text-xs text-confirmed">High — {a.high}</p>
              <p className="mt-1 text-xs text-unverified">Low — {a.low}</p>
            </li>
          ))}
        </ul>
        <Scorer />
      </section>

      <DroppedPile />
      <PersonCap />

      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight">Quote check</h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Every verbatim quote is string-matched against the fetched source. Try a paraphrase — it
          should fail.
        </p>
        <div className="mt-5">
          <QuoteCheck compact />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight">Standing rules</h2>
        <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-fg-muted">
          {standingRules.map((r) => (
            <li key={r} className="pl-1">
              {r}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight">Merged, not duplicated</h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Never two items on the same underlying event. Cite both sources on one card.
        </p>
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {mergedToday.map((m) => (
            <li key={m.event} className="py-4">
              <h3 className="font-serif text-lg tracking-tight">{m.event}</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                {m.sources.join(" · ")}
              </p>
              <p className="mt-2 text-sm text-fg-muted">{m.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight">Monday recall audit</h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Diff this week against Import AI and Don't Worry About the Vase. The only instrument that
          measures what the pipeline silently dropped. Skip it for a month and you have a digest you
          trust and cannot evaluate.
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
              <tr className="border-b border-border">
                <th className="py-2 pr-3 font-medium">Item</th>
                <th className="py-2 pr-3 font-medium">Here</th>
                <th className="py-2 pr-3 font-medium">Import AI</th>
                <th className="py-2 pr-3 font-medium">Zvi</th>
                <th className="py-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {mondayAudit.map((row) => (
                <tr key={row.id} className="border-b border-border align-top">
                  <td className="py-3 pr-3 text-fg">{row.item}</td>
                  <td className="py-3 pr-3">
                    <Flag on={row.inDigest} />
                  </td>
                  <td className="py-3 pr-3">
                    <Flag on={row.inImportAI} />
                  </td>
                  <td className="py-3 pr-3">
                    <Flag on={row.inZvi} />
                  </td>
                  <td className="py-3 text-fg-muted">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-fg-subtle">
          Next audit Mon 07 Sep.{" "}
          <Link to="/" className="underline-offset-4 hover:underline">
            Today's coverage footer
          </Link>
          .
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight">Rumor-vs-outcome scorecard</h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Tracks flagged rumors against what actually happened, decaying source trust. Due 01 Oct.
          Confidence labels mean nothing unless this is kept.
        </p>
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {rumorScorecard.map((r) => (
            <li key={r.id} className="grid gap-2 py-4 sm:grid-cols-[7rem_1fr_auto]">
              <p className="font-mono text-xs tabular-nums text-fg-subtle">{r.flagged}</p>
              <div>
                <p className="text-sm text-fg">{r.claim}</p>
                <p className="mt-1 text-sm text-fg-muted">{r.outcome}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                <Badge
                  tone={
                    r.status === "confirmed"
                      ? "confirmed"
                      : r.status === "killed"
                        ? "unverified"
                        : "reported"
                  }
                >
                  {r.status}
                </Badge>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                  lag {r.lag} · trust {r.trust}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight">Currency ledger</h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Handles, feed URLs and affiliations drift. Three of four input reports demonstrated how
          fast. Named firings from a sample digest are not reporting — they are excluded.
        </p>
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {verifiedLedger.map((row) => (
            <li key={row.claim} className="grid gap-1 py-4 sm:grid-cols-[7.5rem_1fr]">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-confirmed">
                {row.when}
              </p>
              <div>
                <p className="text-sm text-fg">{row.claim}</p>
                <p className="mt-1 text-sm text-fg-muted">{row.note}</p>
              </div>
            </li>
          ))}
        </ul>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {unverifiedLedger.map((row) => (
            <li key={row.claim} className="py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-unverified">
                Unverified · excluded from admission
              </p>
              <p className="mt-1 text-sm text-fg">{row.claim}</p>
              <p className="mt-1 text-sm text-fg-muted">{row.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function LaneSplit() {
  const [merged, setMerged] = useState(false);
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl tracking-tight">Lanes never merge</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        Facts and analysis are assembled by separate passes. If they mix, a rumour becomes a
        reported event. {laneDemo.rumor}
      </p>
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setMerged((v) => !v)}
          className={cn(
            "h-10 rounded-md px-3 font-mono text-[10px] uppercase tracking-[0.14em]",
            merged ? "bg-unverified text-bg" : "border border-border text-fg-muted hover:text-fg",
          )}
        >
          {merged ? "Merged — the bug" : "Show what a merge does"}
        </button>
      </div>
      {merged ? (
        <p className="analysis-lane mt-5 rounded-xl p-5 text-sm leading-relaxed text-fg">
          {laneDemo.merged}
        </p>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <article className="rounded-xl border border-border bg-bg-elevated p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-confirmed">Fact</p>
            <p className="mt-2 text-sm text-fg-muted">{laneDemo.fact.body}</p>
            <p className="mt-3 text-xs text-confirmed">Confirms if — {laneDemo.fact.confirmsIf}</p>
            <p className="mt-1 text-xs text-unverified">Dies if — {laneDemo.fact.diesIf}</p>
          </article>
          <article className="analysis-lane rounded-xl p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-analysis">
              Analysis
            </p>
            <p className="mt-2 text-sm italic text-fg-muted">{laneDemo.analysis.body}</p>
          </article>
        </div>
      )}
    </section>
  );
}

function ExtractionDemo() {
  const [showBlocked, setShowBlocked] = useState(false);
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl tracking-tight">Extraction prompt</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        Who, what, when, impact. Do not add outside knowledge. Mark anything unverified explicitly.
      </p>
      <p className="mt-4 rounded-xl border border-border bg-bg-elevated p-4 font-serif text-sm leading-relaxed text-fg">
        {extractionDemo.source}
      </p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {(
          [
            ["Who", extractionDemo.allowed.who],
            ["What", extractionDemo.allowed.what],
            ["When", extractionDemo.allowed.when],
            ["Impact", extractionDemo.allowed.impact],
          ] as const
        ).map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border bg-bg-elevated p-4">
            <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">{k}</dt>
            <dd className="mt-1 text-sm text-fg-muted">{v}</dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        onClick={() => setShowBlocked((v) => !v)}
        className="mt-4 h-10 rounded-md border border-border px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted hover:text-fg"
      >
        {showBlocked ? "Hide the violation" : "Show outside knowledge"}
      </button>
      {showBlocked ? (
        <div className="mt-4 rounded-xl border border-unverified/40 bg-bg-elevated p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-unverified">
            {extractionDemo.blocked.label}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{extractionDemo.blocked.text}</p>
        </div>
      ) : null}
    </section>
  );
}

function Flag({ on }: { on: boolean }) {
  return (
    <span className={cn("font-mono text-xs", on ? "text-confirmed" : "text-fg-subtle")}>
      {on ? "yes" : "no"}
    </span>
  );
}

function Scorer() {
  const [n, setN] = useState(8);
  const [a, setA] = useState(9);
  const [c, setC] = useState(7);
  const [r, setR] = useState(5);
  const mean = useMemo(() => geometricMean(n, a, c), [n, a, c]);
  const additive = useMemo(() => additiveScore(n, a, c, r), [n, a, c, r]);
  const admitted = mean >= 6;
  const additiveAdmitted = additive >= 50;
  const disagree = admitted !== additiveAdmitted;

  const apply = (nn: number, aa: number, cc: number, rr: number) => {
    setN(nn);
    setA(aa);
    setC(cc);
    setR(rr);
  };

  return (
    <div className="mt-6 rounded-xl border border-border bg-bg-elevated p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
        Try a score
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          type="button"
          className="h-10 rounded-md border border-border px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted hover:text-fg"
          onClick={() => apply(0, 8, 8, 10)}
        >
          High-reach recap
        </button>
        <button
          type="button"
          className="h-10 rounded-md border border-border px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted hover:text-fg"
          onClick={() => apply(8, 10, 8, 2)}
        >
          Quiet filing
        </button>
        <button
          type="button"
          className="h-10 rounded-md border border-border px-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted hover:text-fg"
          onClick={() => apply(8, 9, 7, 5)}
        >
          Default
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AxisSlider label="Novelty" value={n} onChange={setN} />
        <AxisSlider label="Authority" value={a} onChange={setA} />
        <AxisSlider label="Consequence" value={c} onChange={setC} />
        <AxisSlider label="Reach (tiebreak)" value={r} onChange={setR} />
      </div>
      <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
            This page · geometric mean
          </p>
          <p className="font-serif text-4xl tabular-nums tracking-tight">{formatScore(mean)}</p>
          <Badge tone={admitted ? "confirmed" : "unverified"} className="mt-2">
            {admitted ? "Admitted ≥ 6.0" : "Dropped — product fatal"}
          </Badge>
          <p className="mt-2 text-xs text-fg-subtle">Reach is ignored for admission.</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
            Rejected · additive /100
          </p>
          <p className="font-serif text-4xl tabular-nums tracking-tight">{additive.toFixed(0)}</p>
          <Badge tone={additiveAdmitted ? "reported" : "unverified"} className="mt-2">
            {additiveAdmitted ? "Would admit ≥ 50" : "Would drop"}
          </Badge>
          <p className="mt-2 text-xs text-fg-subtle">
            Impact 40 · novelty 20 · credibility 20 · reach 10 · action 10.
          </p>
        </div>
      </div>
      {disagree ? (
        <p className="mt-4 text-sm text-unverified">
          The rankers disagree. That is why additive scoring was rejected — a high-reach recap can
          clear on volume while novelty is zero.
        </p>
      ) : (
        <p className="mt-4 text-xs text-fg-subtle">
          Set novelty to 0. The product is fatal even if the other axes are 10; additive may still
          clear.
        </p>
      )}
    </div>
  );
}

function DroppedPile() {
  const additiveCaught = droppedToday.filter((d) => d.additiveWouldAdmit).length;
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl tracking-tight">Dropped this morning</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        {droppedToday.length} kills the briefing does not show. {additiveCaught} of them would have
        cleared the rejected additive ranker. Precision-only systems have no such list — a miss looks
        like a perfect page.
      </p>
      <ul className="mt-5 divide-y divide-border border-y border-border">
        {droppedToday.map((d) => (
          <li key={d.id} className="py-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={d.reason === "novelty" || d.reason === "quote-check" ? "unverified" : "mute"}>
                {dropReasonLabel[d.reason]}
              </Badge>
              {d.additiveWouldAdmit ? <Badge tone="reported">additive would admit</Badge> : null}
              {d.personId && peopleById[d.personId] ? (
                <Link
                  to="/person/$id"
                  params={{ id: d.personId }}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle hover:text-fg"
                >
                  {peopleById[d.personId]!.name}
                </Link>
              ) : null}
            </div>
            <h3 className="mt-2 font-serif text-lg leading-snug tracking-tight">{d.title}</h3>
            <p className="mt-1 text-sm text-fg-muted">{d.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PersonCap() {
  const d = getLatestDigest();
  const counts = new Map<string, number>();
  for (const item of d.items) {
    for (const id of item.people) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  const rows = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || (peopleById[a[0]]?.name ?? "").localeCompare(peopleById[b[0]]?.name ?? ""))
    .slice(0, 10);
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl tracking-tight">Per-person cap</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        Maximum 3 items per person per day, regardless of score. Without this, Musk's volume
        dominates any engagement-weighted ranker. Today's admitted counts:
      </p>
      <ul className="mt-5 divide-y divide-border border-y border-border">
        {rows.map(([id, n]) => {
          const p = peopleById[id];
          return (
            <li key={id} className="flex items-baseline justify-between gap-4 py-3">
              <Link
                to="/person/$id"
                params={{ id }}
                className="text-sm text-fg hover:underline"
              >
                {p?.name ?? id}
              </Link>
              <span
                className={cn(
                  "font-mono text-xs tabular-nums",
                  n >= 3 ? "text-unverified" : "text-fg-muted",
                )}
              >
                {n} / 3
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function AxisSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between text-sm">
        <span className="text-fg-muted">{label}</span>
        <span className="font-mono tabular-nums text-fg">{value.toFixed(0)}</span>
      </span>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-11 w-full accent-accent"
      />
    </label>
  );
}

function AdmissionFunnel() {
  const d = getLatestDigest();
  const stages = [
    { label: "Scanned", n: d.scanned, note: "110 sources, 30 min poll" },
    { label: "Stage 0", n: d.passedRules, note: "Rules + CN aliases + hash" },
    { label: "Stage 1", n: d.triaged, note: "JSON score ≥ 6.0" },
    { label: "Admitted", n: d.admitted, note: "Stage 2, two lanes" },
  ];
  const max = stages[0].n;
  return (
    <section className="mt-10 rounded-xl border border-border bg-bg-elevated p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
        Today’s cascade · {d.date}
      </p>
      <ol className="mt-4 space-y-3">
        {stages.map((s) => (
          <li key={s.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-fg">{s.label}</span>
              <span className="font-mono tabular-nums text-fg">{s.n.toLocaleString()}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg-subtle">
              <div
                className="h-full bg-accent/80"
                style={{ width: `${Math.max(4, (s.n / max) * 100)}%` }}
              />
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
              {s.note}
            </p>
          </li>
        ))}
      </ol>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        {d.merged} merged as duplicates · {d.quoteBlocked} blocked by quote check ·{" "}
        {d.humanHeld.leak + d.humanHeld.regulation} held for human review
      </p>
      <Link
        to="/desk"
        className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted hover:text-fg"
      >
        Open the morning desk
      </Link>
    </section>
  );
}
