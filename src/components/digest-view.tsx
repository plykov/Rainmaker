import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import { CoverageFooter } from "@/components/coverage-footer";
import { DigestItemCard } from "@/components/digest-item";
import { EmailSend } from "@/components/email-send";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toBriefingMarkdown } from "@/lib/briefing-md";
import { SECTION_META, SECTION_ORDER } from "@/lib/data/catalog";
import { adjacentDates, digestWordCount } from "@/lib/data/digests";
import { pendingQueue } from "@/lib/data/desk";
import { mondayAudit } from "@/lib/data/pipeline";
import type { Digest, SectionId } from "@/lib/data/types";
import { formatBriefingDate, formatRadarDate, readTimeLabel } from "@/lib/format";
import { useReader } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DigestView({ digest, isToday }: { digest: Digest; isToday?: boolean }) {
  const { prev, next } = adjacentDates(digest.date);
  const words = digestWordCount(digest);
  const readTime = readTimeLabel(words);
  const fontScale = useReader((s) => s.fontScale);
  const markDigestRead = useReader((s) => s.markDigestRead);
  const isRead = useReader((s) => s.readDigests.includes(digest.date));
  const [copied, setCopied] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const isAuditIssue = Boolean(digest.weekdayNote?.toLowerCase().includes("audit"));
  const deskAdds = digest.items.filter((i) => pendingQueue.some((q) => q.id === i.id)).length;

  const copyBriefing = async () => {
    const md = toBriefingMarkdown(digest);
    try {
      await navigator.clipboard.writeText(md);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = md;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const bySection = SECTION_ORDER.map((id) => ({
    id,
    items: digest.items.filter((i) => i.section === id),
  })).filter((s) => s.items.length > 0 || s.id === "lede" || s.id === "china");

  const kicker = digest.specimen
    ? "Format specimen"
    : isToday
      ? "Today’s briefing"
      : "Archive";

  return (
    <div
      className={cn(
        "lg:grid lg:grid-cols-[minmax(0,48rem)_16.5rem] lg:items-start lg:justify-center lg:gap-10",
        fontScale === "sm" && "text-[0.95rem]",
        fontScale === "lg" && "text-[1.06rem]",
      )}
    >
      <div className="min-w-0">
        <header className="stagger-in">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
            {kicker}
            {digest.weekdayNote ? ` · ${digest.weekdayNote}` : ""}
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-[1.1] tracking-tight text-fg sm:text-5xl">
            {formatBriefingDate(digest.date)}
          </h1>
          <p className="mt-3 font-mono text-xs tabular-nums text-fg-muted">
            07:00 CET · {digest.scanned.toLocaleString()} scanned → {digest.admitted} admitted ·{" "}
            {words} words · read {readTime}
          </p>
          <WordBudget words={words} />
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {digest.specimen ? (
              <Button variant="outline" size="sm" asChild>
                <Link to="/archive">
                  <ArrowLeft className="size-3.5" />
                  Issues
                </Link>
              </Button>
            ) : (
              <>
                {prev ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/d/$date" params={{ date: prev }}>
                      <ArrowLeft className="size-3.5" />
                      Previous
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    <ArrowLeft className="size-3.5" />
                    Previous
                  </Button>
                )}
                {next ? (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/d/$date" params={{ date: next }}>
                      Next
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Next
                    <ArrowRight className="size-3.5" />
                  </Button>
                )}
              </>
            )}
            <Button
              variant={isRead ? "ghost" : "outline"}
              size="sm"
              onClick={() => markDigestRead(digest.date)}
            >
              <Check className="size-3.5" />
              {isRead ? "Read" : "Mark issue read"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => void copyBriefing()}>
              <Copy className="size-3.5" />
              {copied ? "Copied" : "Copy markdown"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEmailOpen(true)}>
              <Mail className="size-3.5" />
              07:00 send
            </Button>
          </div>
        </header>

        {deskAdds > 0 ? (
          <aside className="mt-8 rounded-xl border border-confirmed/30 bg-bg-elevated p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-confirmed">
              Desk override
            </p>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {deskAdds} item{deskAdds === 1 ? "" : "s"} released from this morning's queue after
              07:00. Operator override — not in the automated 06:40 snapshot.
            </p>
            <Link
              to="/desk"
              className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted hover:text-fg"
            >
              Back to the desk
            </Link>
          </aside>
        ) : null}

        {isAuditIssue ? <MondayAuditNote /> : null}

        <nav
          aria-label="Sections"
          className="mt-8 flex gap-2 overflow-x-auto pb-1 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {bySection.map((s) => (
            <a
              key={s.id}
              href={`#sec-${s.id}`}
              className="shrink-0 rounded-full border border-border bg-bg-elevated px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted hover:border-border-strong hover:text-fg"
            >
              {SECTION_META[s.id].label}
              <span className="ml-1.5 tabular-nums text-fg-subtle">{s.items.length}</span>
            </a>
          ))}
          <a
            href="#radar"
            className="shrink-0 rounded-full border border-border bg-bg-elevated px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted hover:border-border-strong hover:text-fg"
          >
            Radar
          </a>
          <a
            href="#coverage"
            className="shrink-0 rounded-full border border-border bg-bg-elevated px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted hover:border-border-strong hover:text-fg"
          >
            Coverage
          </a>
        </nav>

        <div className="mt-10 space-y-12">
          {bySection.map((s) => (
            <SectionBlock key={s.id} id={s.id} items={s.items} ledeAbsent={digest.ledeAbsent} />
          ))}

          <section id="radar" className="scroll-mt-24">
            <SectionKicker id="radar" count={digest.radar.length} />
            <ol className="mt-4 space-y-3">
              {digest.radar.map((r) => (
                <li
                  key={`${r.date}-${r.label}`}
                  className="flex flex-col gap-1 border-t border-border pt-3 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="w-28 shrink-0 font-mono text-xs tabular-nums text-fg">
                    {r.date}
                  </span>
                  <span className="text-sm text-fg-muted">{r.label}</span>
                  <Badge tone="mute" className="w-fit sm:ml-auto">
                    {r.kind}
                  </Badge>
                </li>
              ))}
            </ol>
          </section>

          <CoverageFooter digest={digest} />
        </div>
      </div>

      <aside className="mt-10 hidden lg:sticky lg:top-24 lg:mt-0 lg:block">
        <div className="rounded-xl border border-border bg-bg-elevated p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
            This issue
          </p>
          <dl className="mt-3 space-y-2 font-mono text-xs tabular-nums text-fg-muted">
            <div className="flex justify-between">
              <dt>Scanned</dt>
              <dd className="text-fg">{digest.scanned.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Admitted</dt>
              <dd className="text-fg">{digest.admitted}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Words</dt>
              <dd className={words > 700 ? "text-unverified" : "text-fg"}>{words}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Read</dt>
              <dd className="text-fg">{readTime}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Fetch fails</dt>
              <dd className={digest.fetchFailures.length ? "text-unverified" : "text-confirmed"}>
                {digest.fetchFailures.length}
              </dd>
            </div>
          </dl>
        </div>
        <nav className="mt-4 rounded-xl border border-border bg-bg-elevated p-4" aria-label="On this page">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
            Sections
          </p>
          <ul className="mt-3 space-y-1.5">
            {bySection.map((s) => (
              <li key={s.id}>
                <a
                  href={`#sec-${s.id}`}
                  className="flex items-baseline justify-between gap-2 text-sm text-fg-muted hover:text-fg"
                >
                  <span>{SECTION_META[s.id].label}</span>
                  <span className="font-mono text-[10px] tabular-nums text-fg-subtle">
                    {s.items.length}/{SECTION_META[s.id].cap}
                  </span>
                </a>
              </li>
            ))}
            <li>
              <a href="#radar" className="flex items-baseline justify-between gap-2 text-sm text-fg-muted hover:text-fg">
                <span>Radar</span>
                <span className="font-mono text-[10px] tabular-nums text-fg-subtle">
                  {digest.radar.length}/3
                </span>
              </a>
            </li>
            <li>
              <a href="#coverage" className="text-sm text-fg-muted hover:text-fg">
                Coverage
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-4 rounded-xl border border-border bg-bg-elevated p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">Radar</p>
          <ul className="mt-3 space-y-3">
            {digest.radar.map((r) => (
              <li key={`${r.date}-${r.label}`}>
                <p className="font-mono text-[10px] tabular-nums text-fg">{formatRadarDate(r.date)}</p>
                <p className="mt-0.5 text-xs leading-snug text-fg-muted">{r.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {emailOpen ? <EmailSend digest={digest} onClose={() => setEmailOpen(false)} /> : null}
    </div>
  );
}

function SectionKicker({ id, count }: { id: SectionId; count: number }) {
  const meta = SECTION_META[id];
  return (
    <div id={`sec-${id}`} className="scroll-mt-24">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-serif text-2xl tracking-tight text-fg">{meta.label}</h2>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
          {count} of {meta.cap}
        </p>
      </div>
      <p className="mt-1 text-sm text-fg-subtle">{meta.kicker}</p>
    </div>
  );
}

function SectionBlock({
  id,
  items,
  ledeAbsent,
}: {
  id: SectionId;
  items: Digest["items"];
  ledeAbsent?: boolean;
}) {
  return (
    <section>
      <SectionKicker id={id} count={items.length} />
      {id === "lede" && ledeAbsent ? (
        <p className="mt-5 font-serif text-xl italic leading-snug text-fg-muted">
          No single dominant story today.
        </p>
      ) : null}
      {id === "china" && items.length === 0 ? (
        <p className="mt-5 text-sm text-unverified">
          China desk is empty — treat as a broken feed, not a quiet day.
        </p>
      ) : null}
      <div className="mt-5 space-y-4">
        {items.map((item, i) => (
          <DigestItemCard key={item.id} item={item} index={i + 1} of={items.length} />
        ))}
      </div>
    </section>
  );
}

function MondayAuditNote() {
  const missed = mondayAudit.filter((r) => !r.inDigest && (r.inImportAI || r.inZvi));
  const caught = mondayAudit.filter((r) => r.inDigest);
  return (
    <aside className="mt-8 rounded-xl border border-border bg-bg-elevated p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
        Weekly recall audit
      </p>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">
        Diffed against Import AI and Don't Worry About the Vase. {caught.length} caught ·{" "}
        {missed.length} miss{missed.length === 1 ? "" : "es"} the weeklies had.
        {missed[0] ? ` Outstanding: ${missed[0].item}.` : ""}
      </p>
      <Link
        to="/pipeline"
        className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted hover:text-fg"
      >
        Full table on Pipeline
      </Link>
    </aside>
  );
}

function WordBudget({ words }: { words: number }) {
  const min = 400;
  const max = 650;
  const hard = 700;
  const scale = 800;
  const pct = Math.min(100, (words / scale) * 100);
  const over = words > hard;
  const low = words < min;
  const inBand = words >= min && words <= max;
  return (
    <div className="mt-4 max-w-md">
      <div className="h-1.5 overflow-hidden rounded-full bg-bg-subtle">
        <div
          className={cn(
            "h-full",
            over ? "bg-unverified" : inBand ? "bg-confirmed/80" : "bg-accent/70",
          )}
          style={{ width: `${Math.max(4, pct)}%` }}
        />
      </div>
      <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        Word budget 400–650
        {over ? " · above 700, threshold too low" : low ? " · under 400" : inBand ? " · in band" : " · high"}
      </p>
    </div>
  );
}