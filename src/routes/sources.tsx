import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { aliasRules, xList } from "@/lib/data/desk";
import { workingSet } from "@/lib/data/dropped";
import { CLASS_BLURB, CLASS_LABEL, CLASS_ORDER, sources } from "@/lib/data/sources";
import type { MonitorSource } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sources")({ component: SourcesPage });

function SourcesPage() {
  const ok = sources.filter((s) => s.health === "ok").length;
  const degraded = sources.filter((s) => s.health !== "ok").length;
  const principals = xList.filter((x) => x.kind === "principal");
  const labs = xList.filter((x) => x.kind === "lab");
  const adjacent = xList.filter((x) => x.kind === "adjacent");

  return (
    <div className="mx-auto max-w-4xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">§02</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">Monitoring sources</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
        Grouped by evidence class, not by platform. A platform change should not break the pipeline;
        a claim class determines how much verification an item needs downstream. Working set ~110
        sources — near the ceiling for a one-page daily output.
      </p>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        {ok} healthy · {degraded} degraded · {xList.length} handles on the X List · health from this
        morning’s coverage footer
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {workingSet.map((w) => (
          <li key={w.label} className="rounded-xl border border-border bg-bg-elevated p-4">
            <p className="font-serif text-2xl tabular-nums tracking-tight">{w.n}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
              {w.label}
            </p>
          </li>
        ))}
      </ul>

      <section className="mt-12">
        <h2 className="font-serif text-2xl tracking-tight">X — one curated List</h2>
        <p className="mt-1 max-w-2xl text-sm text-fg-muted">
          One hourly call returns the whole List. This is the cost fix: it turns dozens of
          per-account polls into a single request. Filter precision is now the constraint, not the
          rate card. {xList.length} handles — principals, lab accounts, and a short adjacent set.
        </p>
        <HandleGroup title="Principals" entries={principals} />
        <HandleGroup title="Labs" entries={labs} />
        <HandleGroup title="Adjacent" entries={adjacent} />
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl tracking-tight">Chinese-character aliases</h2>
        <p className="mt-1 max-w-2xl text-sm text-fg-muted">
          Stage 0 matches 梁文锋 / 唐杰 / 智谱 ↔ Zhipu ↔ Z.ai. A pipeline without this silently drops
          the entire China desk.
        </p>
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {aliasRules.map((a) => (
            <li key={a.needle} className="flex flex-wrap items-baseline justify-between gap-3 py-3">
              <span className="font-serif text-lg tracking-tight">{a.needle}</span>
              <span className="text-sm text-fg-muted">
                {a.note}
                {" · "}
                <Link
                  to="/person/$id"
                  params={{ id: a.mapsTo }}
                  className="underline-offset-4 hover:underline"
                >
                  roster
                </Link>
              </span>
            </li>
          ))}
        </ul>
        <AliasMatcher />
      </section>

      {CLASS_ORDER.map((klass) => {
        const list = sources.filter((s) => s.klass === klass);
        if (list.length === 0) return null;
        return (
          <section key={klass} className="mt-12">
            <h2 className="font-serif text-2xl tracking-tight">{CLASS_LABEL[klass]}</h2>
            <p className="mt-1 text-sm text-fg-muted">{CLASS_BLURB[klass]}</p>
            <ul className="mt-5 divide-y divide-border border-y border-border">
              {list.map((s) => (
                <SourceRow key={s.id} source={s} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function HandleGroup({
  title,
  entries,
}: {
  title: string;
  entries: typeof xList;
}) {
  return (
    <div className="mt-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        {title} · {entries.length}
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {entries.map((e) => (
          <li key={e.handle}>
            {e.personId ? (
              <Link
                to="/person/$id"
                params={{ id: e.personId }}
                className="inline-flex h-9 items-center rounded-full border border-border bg-bg-elevated px-3 font-mono text-xs text-fg hover:border-border-strong"
              >
                @{e.handle}
              </Link>
            ) : (
              <a
                href={`https://x.com/${e.handle}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center rounded-full border border-border bg-bg-elevated px-3 font-mono text-xs text-fg-muted hover:border-border-strong hover:text-fg"
              >
                @{e.handle}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SourceRow({ source }: { source: MonitorSource }) {
  return (
    <li className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-start">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-serif text-lg tracking-tight">{source.name}</h3>
          <span
            className={cn(
              "size-1.5 rounded-full",
              source.health === "ok" && "bg-confirmed",
              source.health === "degraded" && "bg-unverified",
              source.health === "down" && "bg-danger",
            )}
            aria-label={source.health}
          />
          {source.health !== "ok" ? (
            <Badge tone="unverified">{source.health}</Badge>
          ) : (
            <Badge tone="confirmed">ok</Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-fg-muted">{source.covers}</p>
        <p className="mt-2 text-sm text-fg-subtle">{source.why}</p>
        {source.caveat ? <p className="mt-2 text-sm text-unverified">{source.caveat}</p> : null}
        {source.healthNote ? (
          <p className="mt-2 font-mono text-[11px] text-unverified">{source.healthNote}</p>
        ) : null}
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle sm:text-right">
        {source.feed}
      </p>
    </li>
  );
}

const SAMPLE_HEADLINES = [
  "梁文锋内部吹风会被多家媒体转载",
  "智谱 GLM 新版本完成备案公示",
  "Zhipu files a HKEX supplement on training spend",
  "Gary Marcus restates the same critique of scaling",
];

function AliasMatcher() {
  const [text, setText] = useState(SAMPLE_HEADLINES[0]);
  const hits = useMemo(() => {
    const lower = text.toLowerCase();
    return aliasRules.filter(
      (a) => text.includes(a.needle) || lower.includes(a.needle.toLowerCase()),
    );
  }, [text]);

  return (
    <div className="mt-8 rounded-xl border border-border bg-bg-elevated p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
        Stage 0 · try a headline
      </p>
      <p className="mt-2 text-sm text-fg-muted">
        Rules fire on Chinese-character aliases and Latinised lab names before any model is called.
        A miss here never reaches Stage 1.
      </p>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Headline to match"
        className="mt-4"
      />
      <ul className="mt-3 flex flex-wrap gap-2">
        {SAMPLE_HEADLINES.map((s) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => setText(s)}
              className="h-10 rounded-full border border-border px-3 text-xs text-fg-muted hover:border-border-strong hover:text-fg"
            >
              {s.length > 36 ? `${s.slice(0, 34)}…` : s}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 border-t border-border pt-4">
        {hits.length === 0 ? (
          <p className="text-sm text-unverified">No watchlist match — dropped at Stage 0.</p>
        ) : (
          <ul className="space-y-2">
            {hits.map((h) => (
              <li key={h.needle} className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm text-fg">
                  Matched <span className="font-serif">{h.needle}</span>
                </span>
                <Link
                  to="/person/$id"
                  params={{ id: h.mapsTo }}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-confirmed hover:text-fg"
                >
                  {h.note}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}