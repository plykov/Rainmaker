import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLatestDigest } from "@/lib/data/digests";
import {
  CET_TZ,
  cetParts,
  fetchBoard,
  handleCount,
  jobs,
  middaySteps,
  nextHalfHour,
  secondsLabel,
  synthSteps,
  xList,
  xListCost,
} from "@/lib/data/ops";
import { peopleById } from "@/lib/data/people";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ops")({ component: OpsPage });

function OpsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">§03 · ingest</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">The morning run</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
        n8n owns retries and the seen-items store. Stage 2 runs once, at 06:40 CET, after the
        Chinese business day has closed. This is the operator view of that cycle — a replay, not a
        live 110-source fetch.{" "}
        <Link to="/pipeline" className="underline-offset-4 hover:underline">
          How admission works
        </Link>
        .
      </p>

      <ClockStrip />
      <PollRunner />
      <FetchBoard />
      <XListPanel />
      <Schedule />
    </div>
  );
}

function ClockStrip() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  const parts = now ? cetParts(now) : null;
  const next = now ? nextHalfHour(now) : null;
  const digest = getLatestDigest();

  return (
    <section className="mt-8 grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-border bg-bg-elevated p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">CET now</p>
        <p className="mt-2 font-serif text-3xl tabular-nums tracking-tight">
          {parts ? parts.hm : "—"}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          {parts ? `${parts.weekday} ${parts.day} ${parts.month} · ${CET_TZ}` : "Europe/Berlin"}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-bg-elevated p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
          Next 30-min poll
        </p>
        <p className="mt-2 font-serif text-3xl tabular-nums tracking-tight">
          {next ? secondsLabel(next.seconds) : "—"}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          {next ? next.label : "aligns to :00 / :30"}
        </p>
      </div>
      <Link
        to="/delivery"
        className="rounded-xl border border-border bg-bg-elevated p-4 transition-colors hover:border-border-strong"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-confirmed">
          Today's send
        </p>
        <p className="mt-2 font-serif text-3xl tracking-tight">07:00</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          {digest.admitted} admitted · Delivery desk
        </p>
      </Link>
    </section>
  );
}

function PollRunner() {
  const [mode, setMode] = useState<"synth" | "midday">("synth");
  const [step, setStep] = useState(() => synthSteps().length - 1);
  const [running, setRunning] = useState(false);
  const steps = mode === "synth" ? synthSteps() : middaySteps;
  const max = steps[0]?.n ?? 1;

  useEffect(() => {
    if (!running) return;
    if (step >= steps.length - 1) {
      setRunning(false);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStep(steps.length - 1);
      setRunning(false);
      return;
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 420);
    return () => window.clearTimeout(t);
  }, [running, step, steps.length]);

  const run = (next: "synth" | "midday") => {
    setMode(next);
    setStep(0);
    setRunning(true);
  };

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl tracking-tight">Replay a cycle</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        Overnight polls fill the pool. The 06:40 call is the only one that ranks, merges, and
        writes a page. A midday poll should look quiet.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => run("synth")} disabled={running}>
          Replay 06:40 synthesis
        </Button>
        <Button size="sm" variant="outline" onClick={() => run("midday")} disabled={running}>
          Run a 30-min poll
        </Button>
      </div>
      <ol className="mt-6 space-y-3">
        {steps.map((s, i) => {
          const on = i <= step;
          return (
            <li key={s.id}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className={on ? "text-fg" : "text-fg-subtle"}>{s.label}</span>
                <span className="font-mono tabular-nums text-fg">{on ? s.n.toLocaleString() : "—"}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg-subtle">
                <div
                  className={cn("h-full bg-accent/80 transition-[width] duration-300", !on && "opacity-30")}
                  style={{ width: on ? `${Math.max(4, (s.n / max) * 100)}%` : "0%" }}
                />
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
                {s.note}
              </p>
            </li>
          );
        })}
      </ol>
      {mode === "midday" && step >= steps.length - 1 ? (
        <p className="mt-4 text-sm text-fg-muted">
          Zero admitted. That is correct — publishing from a 12:00 poll would make the 07:00 page a
          moving target.
        </p>
      ) : null}
    </section>
  );
}

function FetchBoard() {
  const [resolved, setResolved] = useState<Record<string, boolean>>({});
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl tracking-tight">Fetch failures</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        Feeds break silently. The coverage footer is mandatory because of this list. Jina is the
        reader for pages without RSS — it does not fix a 403 selector.
      </p>
      <ul className="mt-5 divide-y divide-border border-y border-border">
        {fetchBoard.map((f) => (
          <li key={f.id} className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-serif text-lg tracking-tight">{f.name}</p>
                <p className="mt-1 text-sm text-unverified">{f.detail}</p>
                {resolved[f.id] ? (
                  <p className="mt-2 text-sm text-fg-muted">{f.fallback}</p>
                ) : null}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setResolved((s) => ({ ...s, [f.id]: true }))}
              >
                {resolved[f.id] ? "Fallback used" : "Use fallback"}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function XListPanel() {
  const total = xList.reduce((n, h) => n + h.hourPosts, 0);
  const musk = xList.find((h) => h.handle === "elonmusk");
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl tracking-tight">X List · one call</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        {handleCount} handles in a single List timeline. {xListCost.oneCall} instead of{" "}
        {xListCost.perHandle}. {xListCost.note} Last hourly call: {total} posts, {musk?.hourPosts}{" "}
        of them from @elonmusk — the per-person cap exists for that row.
      </p>
      <ul className="mt-5 columns-1 gap-x-8 sm:columns-2 lg:columns-3">
        {xList.map((h) => {
          const p = h.personId ? peopleById[h.personId] : null;
          return (
            <li key={h.handle} className="mb-2 break-inside-avoid">
              <div className="flex items-baseline justify-between gap-3 border-b border-border py-1.5">
                <span className="min-w-0 truncate text-sm text-fg">
                  @{h.handle}
                  {p ? (
                    <span className="ml-2 text-fg-subtle">{p.name.split(" ")[0]}</span>
                  ) : null}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] tabular-nums",
                    h.hourPosts >= 8 ? "text-unverified" : "text-fg-subtle",
                  )}
                >
                  {h.hourPosts}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        Bluesky Jetstream is live in parallel · €0 · not shown as a second column of handles
      </p>
    </section>
  );
}

function Schedule() {
  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl tracking-tight">Day board</h2>
      <ol className="mt-5 divide-y divide-border border-y border-border">
        {jobs.map((j) => (
          <li key={j.id} className="grid gap-2 py-4 sm:grid-cols-[8.5rem_1fr_auto]">
            <p className="font-mono text-xs tabular-nums text-fg-subtle">{j.time}</p>
            <div>
              <h3 className="font-serif text-lg tracking-tight">{j.name}</h3>
              <p className="mt-1 text-sm text-fg-muted">{j.detail}</p>
            </div>
            <Badge
              tone={
                j.state === "live" || j.state === "done"
                  ? "confirmed"
                  : j.state === "running"
                    ? "reported"
                    : "mute"
              }
            >
              {j.state}
            </Badge>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm text-fg-muted">
        After 07:00 the hosted page is the product.{" "}
        <Link to="/delivery" className="underline-offset-4 hover:underline">
          Delivery
        </Link>
        {" · "}
        <Link to="/" className="underline-offset-4 hover:underline">
          Today's briefing
        </Link>
        {" · "}
        <Link to="/desk" className="underline-offset-4 hover:underline">
          Desk
        </Link>
        .
      </p>
    </section>
  );
}
