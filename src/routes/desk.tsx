import { createFileRoute, Link } from "@tanstack/react-router";
import { allItems, LATEST_DATE } from "@/lib/data/digests";
import { blockedQuotes, pendingQueue } from "@/lib/data/desk";
import { QuoteCheck } from "@/components/quote-check";
import { PersonChip } from "@/components/person-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReleasedItems } from "@/lib/hydrate";
import { useReader, type QueueDecision } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/desk")({ component: DeskPage });

function DeskPage() {
  const decisions = useReader((s) => s.queueDecisions);
  const setDecision = useReader((s) => s.setQueueDecision);
  const extras = useReleasedItems();
  const releasedToday = [
    ...allItems().filter((i) => i.date === LATEST_DATE && i.humanGated),
    ...extras,
  ];
  const pendingLeft = pendingQueue.filter((q) => !decisions[q.id] || decisions[q.id] === "held");

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
        Human gate · ~5 min
      </p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">Morning desk</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted">
        Automation proposes. It does not publish unreleased-model or national-security claims
        unreviewed. Anything tagged leak or regulation sits here until you release, hold, or kill
        it. Decisions stay on this machine.
      </p>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        {pendingLeft.length} awaiting · {releasedToday.length} released {LATEST_DATE} ·{" "}
        {blockedQuotes.length} blocked by quote check
      </p>

      <section className="mt-10">
        <h2 className="font-serif text-2xl tracking-tight">Awaiting review</h2>
        <p className="mt-1 text-sm text-fg-subtle">
          Proposed at 06:40 CET. Not in today’s briefing until released.
        </p>
        <ul className="mt-5 space-y-4">
          {pendingQueue.map((item) => {
            const decision = decisions[item.id];
            return (
              <li
                key={item.id}
                className={cn(
                  "rounded-xl border border-border bg-bg-elevated p-5",
                  decision === "killed" && "opacity-60",
                  decision === "released" && "border-confirmed/40",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={item.gate === "regulation" ? "reported" : "unverified"}>
                    {item.gate}
                  </Badge>
                  <Badge tone={item.confidence}>{item.confidence}</Badge>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                    {item.arrived}
                  </span>
                  {decision ? <Badge tone="accent">{decision}</Badge> : null}
                </div>
                <h3 className="mt-3 font-serif text-xl leading-snug tracking-tight">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{item.body}</p>
                {item.originalHeadline ? (
                  <p className="mt-3 font-serif text-sm text-fg">{item.originalHeadline}</p>
                ) : null}
                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <div className="rounded-md bg-bg-subtle/80 p-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-confirmed">
                      Confirms if
                    </dt>
                    <dd className="mt-1 text-fg-muted">{item.confirmsIf}</dd>
                  </div>
                  <div className="rounded-md bg-bg-subtle/80 p-3">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-unverified">
                      Dies if
                    </dt>
                    <dd className="mt-1 text-fg-muted">{item.diesIf}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.people.map((id) => (
                      <PersonChip key={id} id={id} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(["released", "held", "killed"] as QueueDecision[]).map((d) => (
                      <Button
                        key={d}
                        variant={decision === d ? "default" : "outline"}
                        onClick={() => setDecision(item.id, d)}
                      >
                        {d === "released" ? "Release" : d === "held" ? "Hold" : "Kill"}
                      </Button>
                    ))}
                    {decision === "released" ? (
                      <Button variant="ghost" asChild>
                        <Link to="/" hash={item.id}>
                          Open in briefing
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl tracking-tight">Released this morning</h2>
        <p className="mt-1 text-sm text-fg-subtle">In the 07:00 CET briefing. Human-gated, then sent.</p>
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {releasedToday.map((item) => (
            <li key={item.id} className="py-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="confirmed">released</Badge>
                <Badge tone={item.confidence}>{item.confidence}</Badge>
              </div>
              <h3 className="mt-2 font-serif text-lg leading-snug tracking-tight">
                <Link
                  to="/d/$date"
                  params={{ date: item.date }}
                  hash={item.id}
                  className="hover:underline"
                >
                  {item.title}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-fg-muted">{item.sourceLabel}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl tracking-tight">Blocked by quote check</h2>
        <p className="mt-1 text-sm text-fg-subtle">
          Automatic. A miss blocks the quote — not a hopeful prompt.
        </p>
        <ul className="mt-5 space-y-3">
          {blockedQuotes.map((b) => (
            <li key={b.id} className="rounded-xl border border-border bg-bg-elevated p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-unverified">
                {b.arrived} · {b.sourceLabel}
              </p>
              <h3 className="mt-2 font-serif text-lg tracking-tight">{b.title}</h3>
              <p className="mt-2 text-sm text-fg-muted">{b.detail}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <QuoteCheck />
        </div>
      </section>
    </div>
  );
}
