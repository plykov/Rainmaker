import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Copy, Download, Mail, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  copyText,
  downloadMarkdown,
  toBriefingMarkdown,
  toEmailSubject,
  toMailtoBody,
} from "@/lib/briefing-md";
import { CET_TZ, cetParts, cetStamp, nextSevenCet, secondsLabel } from "@/lib/cet";
import { pendingQueue } from "@/lib/data/desk";
import { digestWordCount, getLatestDigest, LATEST_DATE } from "@/lib/data/digests";
import { dailyPlant } from "@/lib/data/plant";
import { probeTargets } from "@/lib/data/probes";
import { PlantBoard } from "@/components/plant-board";
import { formatBriefingDate, readTimeLabel } from "@/lib/format";
import { useHydratedDigest } from "@/lib/hydrate";
import { probeViaJina, probeWorkingSet } from "@/lib/probe";
import { useReader, type SendVia } from "@/lib/store";

export const Route = createFileRoute("/delivery")({ component: DeliveryPage });

function pageUrl() {
  if (typeof window === "undefined") return "/";
  return `${window.location.origin}/`;
}

function DeliveryPage() {
  const digest = useHydratedDigest(getLatestDigest());
  return (
    <div className="mx-auto max-w-4xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
        §04 · delivery
      </p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">The 07:00 send</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
        One snapshot, two channels: Grok email at 07:00 CET (tab closed), and this hosted page
        when you stamp it. Overnight fetch failures are a seed. Probe the working set to replace
        them with live HTTP.{" "}
        <Link to="/ops" className="underline-offset-4 hover:underline">
          Morning run
        </Link>
        {" · "}
        <Link to="/desk" className="underline-offset-4 hover:underline">
          Desk
        </Link>
        {" · "}
        <Link to="/audit" className="underline-offset-4 hover:underline">
          Monday audit
        </Link>
        .
      </p>
      <ClockStrip admitted={digest.admitted} />
      <PlantBoard />
      <PublishPanel digestAdmitted={digest.admitted} />
      <EmailPanel />
      <SendLog />
      <ProbeBoard />
    </div>
  );
}

function ClockStrip({ admitted }: { admitted: number }) {
  const [now, setNow] = useState<Date | null>(null);
  const edition = useReader((s) => s.editions[LATEST_DATE]);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  const parts = now ? cetParts(now) : null;
  const next = now ? nextSevenCet(now) : null;

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
          Next Grok send
        </p>
        <p className="mt-2 font-serif text-3xl tabular-nums tracking-tight">
          {next ? secondsLabel(next.seconds) : "—"}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          {dailyPlant.nextLabel} · email + app
        </p>
      </div>
      <div className="rounded-xl border border-border bg-bg-elevated p-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
          Hosted page
        </p>
        <p className="mt-2 font-serif text-3xl tracking-tight">
          {edition ? "Live" : "Unstamped"}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          {edition
            ? `published ${edition.label} · ${admitted} admitted`
            : `${admitted} admitted · awaiting stamp`}
        </p>
      </div>
    </section>
  );
}

function PublishPanel({ digestAdmitted }: { digestAdmitted: number }) {
  const decisions = useReader((s) => s.queueDecisions);
  const edition = useReader((s) => s.editions[LATEST_DATE]);
  const publishEdition = useReader((s) => s.publishEdition);
  const fired = useRef(false);
  const releasedIds = pendingQueue
    .filter((q) => decisions[q.id] === "released")
    .map((q) => q.id);
  const pendingLeft = pendingQueue.filter(
    (q) => !decisions[q.id] || decisions[q.id] === "held",
  ).length;
  const stale = Boolean(
    edition && releasedIds.some((id) => !edition.queueIds.includes(id)),
  );
  const unpublished = !edition;
  const releasedKey = releasedIds.join("|");

  const publish = () => {
    publishEdition({
      date: LATEST_DATE,
      at: new Date().toISOString(),
      label: cetStamp(new Date()),
      queueIds: releasedIds,
      admitted: digestAdmitted,
    });
  };

  useEffect(() => {
    const tick = () => {
      const p = cetParts(new Date());
      if (p.hour === 7 && p.minute === 0 && p.second < 8) {
        if (!fired.current && (unpublished || stale)) {
          fired.current = true;
          publishEdition({
            date: LATEST_DATE,
            at: new Date().toISOString(),
            label: cetStamp(new Date()),
            queueIds: releasedKey ? releasedKey.split("|") : [],
            admitted: digestAdmitted,
          });
        }
      } else if (p.hour !== 7) {
        fired.current = false;
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [unpublished, stale, digestAdmitted, releasedKey, publishEdition]);


  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl tracking-tight">Publish in place</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        Today is a stable URL. Publishing stamps this snapshot onto it. A later desk release does
        not ship until you update. The archive is those stamps, not an inbox dump.
      </p>
      <div className="mt-5 rounded-xl border border-border bg-bg-elevated p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
          {formatBriefingDate(LATEST_DATE)} · /
        </p>
        <p className="mt-2 font-serif text-xl tracking-tight">
          {unpublished
            ? "No stamp in this browser"
            : stale
              ? "Desk released items the live page has not picked up"
              : `Live since ${edition.label}`}
        </p>
        <p className="mt-2 text-sm text-fg-muted">
          {pendingLeft > 0
            ? `${pendingLeft} still on the desk. The 07:00 job will not wait for them.`
            : "Desk is clear."}{" "}
          {releasedIds.length > 0
            ? `${releasedIds.length} released item${releasedIds.length === 1 ? "" : "s"} in this snapshot.`
            : "No desk overrides in this snapshot."}{" "}
          If this page is open at 07:00 CET, the job stamps itself.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={publish} disabled={!unpublished && !stale}>
            {unpublished ? "Run 07:00 job" : stale ? "Update in place" : "Already live"}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Open hosted page</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function EmailPanel() {
  const digest = useHydratedDigest(getLatestDigest());
  const recordSend = useReader((s) => s.recordSend);
  const edition = useReader((s) => s.editions[LATEST_DATE]);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const words = digestWordCount(digest);
  const subject = toEmailSubject(digest);
  const markdown = toBriefingMarkdown(digest);
  const url = pageUrl();
  const mailtoBody = toMailtoBody(digest, url);
  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

  const stamp = (via: SendVia) => {
    recordSend({
      date: LATEST_DATE,
      at: new Date().toISOString(),
      label: cetStamp(new Date()),
      via,
      subject,
    });
  };

  const copy = async () => {
    await copyText(markdown);
    stamp("copy");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const download = () => {
    downloadMarkdown(`rainmaker-${LATEST_DATE}.md`, markdown);
  };

  const share = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: subject, text: mailtoBody, url });
        stamp("share");
        setShared(true);
        window.setTimeout(() => setShared(false), 1800);
        return;
      } catch {
        /* user cancelled */
      }
    }
    await copy();
  };

  return (
    <section className="mt-12">
      <h2 className="font-serif text-2xl tracking-tight">This morning's email</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        Same snapshot as the hosted page. The mail client is the send path — there is no SMTP in
        this preview. The body is the lede plus a link; copy the markdown for the full 400–650
        words.
      </p>
      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-bg-elevated">
        <Meta k="From" v="AI Rainmaker Watch" />
        <Meta k="To" v="the four-minute list" />
        <Meta k="Subject" v={subject} />
        <Meta
          k="Page"
          v={edition ? `Live · ${edition.label}` : "Unstamped — publish first if this is the send"}
        />
        <pre className="max-h-56 overflow-auto whitespace-pre-wrap border-t border-border px-5 py-4 font-sans text-sm leading-relaxed text-fg-muted">
          {mailtoBody}
        </pre>
        <p className="border-t border-border px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          {words} words · {readTimeLabel(words)} · {digest.admitted} admitted ·{" "}
          {digest.fetchFailures.length} fetch failures
        </p>
        <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
          <Button asChild>
            <a href={mailto} onClick={() => stamp("mailto")}>
              <Mail className="size-3.5" />
              Open in mail client
            </a>
          </Button>
          <Button variant="outline" onClick={() => void copy()}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy markdown"}
          </Button>
          <Button variant="outline" onClick={download}>
            <Download className="size-3.5" />
            Download .md
          </Button>
          <Button variant="outline" onClick={() => void share()}>
            <Share2 className="size-3.5" />
            {shared ? "Shared" : "Share"}
          </Button>
        </div>
      </div>
    </section>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-4 border-b border-border px-5 py-2.5 last:border-b-0">
      <p className="w-16 shrink-0 pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        {k}
      </p>
      <p className="min-w-0 text-sm leading-snug text-fg">{v}</p>
    </div>
  );
}

function SendLog() {
  const sends = useReader((s) => s.sends);
  if (sends.length === 0) {
    return (
      <p className="mt-6 text-sm text-fg-subtle">No send recorded in this browser yet.</p>
    );
  }
  return (
    <section className="mt-10">
      <h2 className="font-serif text-2xl tracking-tight">Send log</h2>
      <ul className="mt-5 divide-y divide-border border-y border-border">
        {sends.map((row) => (
          <li key={`${row.at}-${row.via}`} className="grid gap-1 py-3 sm:grid-cols-[7rem_5rem_1fr]">
            <p className="font-mono text-xs tabular-nums text-fg">{row.label}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
              {row.via}
            </p>
            <p className="truncate text-sm text-fg-muted">{row.subject}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProbeBoard() {
  const probe = useReader((s) => s.probe);
  const setProbe = useReader((s) => s.setProbe);
  const patchProbeResult = useReader((s) => s.patchProbeResult);
  const [running, setRunning] = useState(false);
  const [jinaId, setJinaId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setRunning(true);
    setError(null);
    try {
      const res = await probeWorkingSet();
      setProbe({ at: res.at, date: LATEST_DATE, results: res.results });
    } catch (e) {
      setError(e instanceof Error ? e.message : "probe failed");
    } finally {
      setRunning(false);
    }
  };

  const jina = async (id: string) => {
    setJinaId(id);
    setError(null);
    try {
      const row = await probeViaJina({ data: { id } });
      patchProbeResult(row);
    } catch (e) {
      setError(e instanceof Error ? e.message : "jina failed");
    } finally {
      setJinaId(null);
    }
  };

  const fails = probe?.results.filter((r) => !r.ok).length ?? 0;
  const ok = probe?.results.filter((r) => r.ok).length ?? 0;

  return (
    <section className="mt-14">
      <h2 className="font-serif text-2xl tracking-tight">Live fetch check</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        {probeTargets.length} endpoints, GET, 5s timeout. Failures replace the seeded coverage
        footer on today's page. Paywalls that return 200 are not fetch failures.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button onClick={() => void run()} disabled={running}>
          {running ? "Probing…" : probe ? "Probe again" : "Probe working set"}
        </Button>
        {probe ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            {ok} up · {fails} failed · {new Date(probe.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: CET_TZ })} CET
          </p>
        ) : (
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            Overnight seed still on the footer until you probe
          </p>
        )}
      </div>
      {error ? <p className="mt-3 text-sm text-unverified">{error}</p> : null}
      <ul className="mt-5 divide-y divide-border border-y border-border">
        {(probe?.results ?? probeTargets.map((t) => ({
          id: t.id,
          name: t.name,
          url: t.url,
          group: t.group,
          status: null as number | null,
          ok: false,
          ms: 0,
          error: undefined as string | undefined,
          fallback: t.fallback,
          via: undefined as "direct" | "jina" | undefined,
        }))).map((r) => {
          const pending = !probe;
          return (
            <li key={r.id} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-sm text-fg">{r.name}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
                  {r.group}
                  {r.via === "jina" ? " · via r.jina.ai" : ""}
                  {r.fallback && !r.ok && !pending ? ` · ${r.fallback}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {pending ? (
                  <Badge tone="mute">unprobed</Badge>
                ) : (
                  <Badge tone={r.ok ? "confirmed" : "unverified"}>
                    {r.status ?? r.error ?? "fail"} · {r.ms}ms
                  </Badge>
                )}
                {!pending && !r.ok && probeTargets.find((t) => t.id === r.id)?.jina ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={jinaId === r.id}
                    onClick={() => void jina(r.id)}
                  >
                    {jinaId === r.id ? "Jina…" : r.via === "jina" ? "Retried" : "Via Jina"}
                  </Button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

