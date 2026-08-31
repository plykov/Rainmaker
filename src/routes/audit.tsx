import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AUDIT_DUE,
  AUDIT_NEXT,
  SCORECARD_DUE,
  VERDICT_LABEL,
  auditStats,
  auditWeek,
  missNotes,
  mondayAudit,
  rumorScorecard,
  seedVerdicts,
  weeklyFeeds,
} from "@/lib/data/audit";
import { CET_TZ, cetParts, cetStamp, isMondayCet, nextMondayCet, secondsLabel } from "@/lib/cet";
import { formatBriefingDate } from "@/lib/format";
import { probeViaJina, probeWeeklies } from "@/lib/probe";
import type { ProbeResult } from "@/lib/data/probes";
import { useReader } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/audit")({ component: AuditPage });

function AuditPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
        §03 · recall
      </p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">
        What the pipeline missed
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
        A digest that misses the day's biggest story looks identical to a perfect one. Monday diffs
        this week against Import AI and Don't Worry About the Vase. The monthly scorecard checks
        whether confidence labels mean anything. Skip either and you have a digest you trust and
        cannot evaluate.{" "}
        <Link to="/pipeline" className="underline-offset-4 hover:underline">
          How admission works
        </Link>
        {" · "}
        <Link to="/delivery" className="underline-offset-4 hover:underline">
          Delivery
        </Link>
        .
      </p>
      <ClockStrip />
      <RecallBoard />
      <WeeklyProbe />
      <ScorecardBoard />
    </div>
  );
}

function ClockStrip() {
  const [now, setNow] = useState<Date | null>(null);
  const filing = useReader((s) => s.auditFilings[AUDIT_DUE]);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  const parts = now ? cetParts(now) : null;
  const next = now ? nextMondayCet(now) : null;
  const today = now ? isMondayCet(now) : false;

  return (
    <section className="mt-8 grid gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-border bg-bg-elevated p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">CET now</p>
        <p className="mt-2 font-serif text-3xl tabular-nums tracking-tight">
          {parts ? parts.hm : "—"}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          {parts ? `${parts.weekday} ${parts.day} ${parts.month} · ${CET_TZ}` : CET_TZ}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-bg-elevated p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
          This Monday
        </p>
        <p className="mt-2 font-serif text-3xl tracking-tight">
          {filing ? "Filed" : today ? "Due" : "Queued"}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          {filing
            ? `${auditWeek.label} · ${filing.label}`
            : `${auditWeek.label} · ${formatBriefingDate(AUDIT_DUE)}`}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-bg-elevated p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
          Next audit
        </p>
        <p className="mt-2 font-serif text-3xl tabular-nums tracking-tight">
          {next ? secondsLabel(next.seconds) : "—"}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          {formatBriefingDate(AUDIT_NEXT)} · {next?.label ?? "Mon 07:00 CET"}
        </p>
      </div>
    </section>
  );
}

function useMergedVerdicts() {
  const overrides = useReader((s) => s.auditVerdicts);
  const filing = useReader((s) => s.auditFilings[AUDIT_DUE]);
  return useMemo(() => {
    const seed = seedVerdicts();
    return { ...seed, ...(filing?.verdicts ?? {}), ...overrides };
  }, [overrides, filing]);
}

function RecallBoard() {
  const verdicts = useMergedVerdicts();
  const setAuditVerdict = useReader((s) => s.setAuditVerdict);
  const fileAudit = useReader((s) => s.fileAudit);
  const filing = useReader((s) => s.auditFilings[AUDIT_DUE]);
  const stats = auditStats(verdicts);
  const misses = missNotes(verdicts);
  const recallPct = Math.round(stats.recall * 100);
  const dirty =
    !filing ||
    mondayAudit.some((r) => (filing.verdicts[r.id] ?? r.verdict) !== verdicts[r.id]);

  const file = () => {
    fileAudit({
      weekId: AUDIT_DUE,
      at: new Date().toISOString(),
      label: cetStamp(new Date()),
      verdicts,
    });
  };

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl tracking-tight">Monday recall audit</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        Diff {auditWeek.label} against {auditWeek.against.join(" and ")}. Caught and miss set
        recall. A correct drop is a precision win — it does not count against the rate.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-bg-elevated p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
            Recall
          </p>
          <p className="mt-2 font-serif text-3xl tabular-nums tracking-tight">{recallPct}%</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            {stats.caught} caught / {stats.caught + stats.miss} that should have admitted
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-elevated p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
            Correct drops
          </p>
          <p className="mt-2 font-serif text-3xl tabular-nums tracking-tight">
            {stats.correctDrop}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            recaps the additive ranker would have taken
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-elevated p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
            Misses
          </p>
          <p
            className={cn(
              "mt-2 font-serif text-3xl tabular-nums tracking-tight",
              stats.miss > 0 ? "text-unverified" : "text-confirmed",
            )}
          >
            {stats.miss}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            {stats.miss === 0 ? "nothing silently dropped" : "tune Stage 1 before next week"}
          </p>
        </div>
      </div>

      <ul className="mt-6 divide-y divide-border border-y border-border">
        {mondayAudit.map((row) => {
          const verdict = verdicts[row.id] ?? row.verdict;
          return (
            <li key={row.id} className="py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 max-w-xl">
                  <h3 className="font-serif text-lg tracking-tight">{row.item}</h3>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                    here {row.inDigest ? "yes" : "no"} · import ai {row.inImportAI ? "yes" : "no"} ·
                    zvi {row.inZvi ? "yes" : "no"}
                  </p>
                  <p className="mt-2 text-sm text-fg-muted">{row.note}</p>
                </div>
                <Badge
                  tone={
                    verdict === "caught"
                      ? "confirmed"
                      : verdict === "miss"
                        ? "unverified"
                        : "reported"
                  }
                >
                  {VERDICT_LABEL[verdict]}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["caught", "miss", "correct-drop"] as const).map((v) => (
                  <Button
                    key={v}
                    size="sm"
                    variant={verdict === v ? "default" : "outline"}
                    onClick={() => setAuditVerdict(row.id, v)}
                  >
                    {VERDICT_LABEL[v]}
                  </Button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      {misses.length > 0 ? (
        <aside className="mt-6 rounded-xl border border-unverified/30 bg-bg-elevated p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-unverified">
            Stage 1 tune
          </p>
          <ul className="mt-2 space-y-1 text-sm text-fg-muted">
            {misses.map((m) => (
              <li key={m.id}>{m.note}</li>
            ))}
          </ul>
        </aside>
      ) : null}

      <div className="mt-6 rounded-xl border border-border bg-bg-elevated p-5">
        <p className="font-serif text-xl tracking-tight">
          {filing
            ? dirty
              ? `Filed ${filing.label} — verdicts have moved`
              : `Filed ${filing.label}`
            : "Not filed in this browser"}
        </p>
        <p className="mt-2 text-sm text-fg-muted">
          Filing stamps this week's recall onto the coverage footer. It does not rewrite past
          issues. Next window {formatBriefingDate(AUDIT_NEXT)}.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={file} disabled={Boolean(filing) && !dirty}>
            {filing ? (dirty ? "Re-file this week" : "Already filed") : "File Monday audit"}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/" hash="coverage">
              Coverage footer
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function WeeklyProbe() {
  const weeklyProbe = useReader((s) => s.weeklyProbe);
  const setWeeklyProbe = useReader((s) => s.setWeeklyProbe);
  const patchWeeklyProbe = useReader((s) => s.patchWeeklyProbe);
  const [busy, setBusy] = useState(false);
  const [jinaId, setJinaId] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    try {
      const res = await probeWeeklies();
      setWeeklyProbe({ at: res.at, date: AUDIT_DUE, results: res.results });
    } finally {
      setBusy(false);
    }
  };

  const viaJina = async (id: string) => {
    setJinaId(id);
    try {
      const row = await probeViaJina({ data: { id } });
      patchWeeklyProbe(row);
    } finally {
      setJinaId(null);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl tracking-tight">The two weeklies</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        The audit is a diff, not a fetch of 110 sources. Probe the two independent roundups. If the
        feed 403s, fall back to r.jina.ai for titles.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={() => void run()} disabled={busy}>
          {busy ? "Probing…" : "Probe Import AI and Zvi"}
        </Button>
      </div>
      <ul className="mt-5 divide-y divide-border border-y border-border">
        {(weeklyProbe?.results ??
          weeklyFeeds.map(
            (t): ProbeResult => ({
              id: t.id,
              name: t.name,
              url: t.url,
              group: t.group,
              status: null,
              ok: false,
              ms: 0,
              fallback: t.fallback,
            }),
          )
        ).map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="text-sm text-fg">{r.name}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                {weeklyProbe
                  ? r.ok
                    ? `${r.status} · ${r.ms}ms${r.via === "jina" ? " · jina" : ""}`
                    : `${r.status ?? r.error ?? "unrun"} · ${r.fallback ?? "no fallback"}`
                  : "not probed this session"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={weeklyProbe ? (r.ok ? "confirmed" : "unverified") : "mute"}>
                {weeklyProbe ? (r.ok ? "up" : "down") : "idle"}
              </Badge>
              {!r.ok && weeklyFeeds.find((f) => f.id === r.id)?.jina ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={jinaId === r.id}
                  onClick={() => void viaJina(r.id)}
                >
                  {jinaId === r.id ? "Jina…" : "Via Jina"}
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ScorecardBoard() {
  const resolutions = useReader((s) => s.rumorResolutions);
  const resolveRumor = useReader((s) => s.resolveRumor);
  const rows = rumorScorecard.map((r) => {
    const over = resolutions[r.id];
    return over ? { ...r, status: over.status, trust: over.trust, resolvedAt: over.label } : r;
  });
  const open = rows.filter((r) => r.status === "open").length;
  const confirmed = rows.filter((r) => r.status === "confirmed").length;
  const killed = rows.filter((r) => r.status === "killed").length;
  const down = rows.filter((r) => r.trust === "down").length;

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl tracking-tight">Rumor-vs-outcome</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        Monthly instrument, due {formatBriefingDate(SCORECARD_DUE)}. Confirm only against a
        first-party or filing-grade outcome. An open item is not a failure — a labelled rumor that
        never resolves is.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-bg-elevated p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">Open</p>
          <p className="mt-2 font-serif text-3xl tabular-nums tracking-tight">{open}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            waiting on a filing or a kill
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-elevated p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
            Resolved
          </p>
          <p className="mt-2 font-serif text-3xl tabular-nums tracking-tight">
            {confirmed} / {killed}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            confirmed · killed
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-elevated p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
            Trust down
          </p>
          <p className="mt-2 font-serif text-3xl tabular-nums tracking-tight">{down}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            source weight decays on a kill
          </p>
        </div>
      </div>
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {rows.map((r) => (
          <li key={r.id} className="py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 max-w-xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                  flagged {r.flagged} · lag {r.lag}
                </p>
                <h3 className="mt-1 font-serif text-lg tracking-tight">{r.claim}</h3>
                <p className="mt-1 text-sm text-fg-muted">{r.outcome}</p>
                {"resolvedAt" in r && r.resolvedAt ? (
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                    operator {r.resolvedAt}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col items-end gap-2">
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
                  trust {r.trust}
                </span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={r.status === "confirmed" ? "default" : "outline"}
                onClick={() =>
                  resolveRumor(r.id, {
                    status: "confirmed",
                    trust: "up",
                    at: new Date().toISOString(),
                    label: cetStamp(new Date()),
                  })
                }
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant={r.status === "killed" ? "default" : "outline"}
                onClick={() =>
                  resolveRumor(r.id, {
                    status: "killed",
                    trust: "down",
                    at: new Date().toISOString(),
                    label: cetStamp(new Date()),
                  })
                }
              >
                Kill
              </Button>
              <Button
                size="sm"
                variant={r.status === "open" ? "default" : "outline"}
                onClick={() =>
                  resolveRumor(r.id, {
                    status: "open",
                    trust: "flat",
                    at: new Date().toISOString(),
                    label: cetStamp(new Date()),
                  })
                }
              >
                Leave open
              </Button>
            </div>
            {r.id === "supervote" && r.status === "open" ? (
              <p className="mt-3 text-xs text-fg-subtle">
                Still Reported. Confirm only if a first-party filing appears — The Information
                headline is not that.
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
