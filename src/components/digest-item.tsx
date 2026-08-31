import { Bookmark, BookmarkCheck, ExternalLink, Quote } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { PersonChip } from "@/components/person-chip";
import { ScorePips } from "@/components/score-pips";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DigestItem as Item } from "@/lib/data/types";
import { SECTION_META } from "@/lib/data/catalog";
import { formatShortDate } from "@/lib/format";
import { useReader } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DigestItemCard({
  item,
  index,
  of,
  showIssue,
}: {
  item: Item;
  index: number;
  of: number;
  showIssue?: boolean;
}) {
  const bookmarked = useReader((s) => s.bookmarks.includes(item.id));
  const read = useReader((s) => s.readItems.includes(item.id));
  const toggleBookmark = useReader((s) => s.toggleBookmark);
  const toggleRead = useReader((s) => s.toggleRead);
  const isAnalysis = item.lane === "analysis";

  return (
    <article
      id={item.id}
      data-item-id={item.id}
      className={cn(
        "item-anchor scroll-mt-24 rounded-xl p-5 sm:p-6",
        isAnalysis ? "analysis-lane" : "bg-bg-elevated shadow-[var(--shadow-border)]",
        read && "opacity-80",
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <ConfidenceBadge confidence={item.confidence} lane={item.lane} />
          <Badge tone="mute">{item.evidenceClass}</Badge>
          {item.humanGated ? <Badge tone="accent">Human-gated</Badge> : null}
          {item.paywalled ? <Badge tone="mute">Paywalled</Badge> : null}
          {item.quote?.check === "pass" ? <Badge tone="confirmed">Quote check</Badge> : null}
        </div>
        <div className="flex items-center gap-1">
          {item.scores ? <ScorePips scores={item.scores} /> : null}
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
            onClick={() => toggleBookmark(item.id)}
          >
            {bookmarked ? (
              <BookmarkCheck className="size-4 text-accent" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </Button>
        </div>
      </header>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
        {showIssue ? (
          <>
            <Link
              to="/d/$date"
              params={{ date: item.date }}
              hash={item.id}
              className="hover:text-fg"
            >
              {formatShortDate(item.date)}
            </Link>
            {" · "}
          </>
        ) : null}
        {SECTION_META[item.section].label} · {index} of {of}
      </p>

      <h3 className="mt-1.5 font-serif text-xl leading-snug tracking-tight text-fg sm:text-[1.35rem]">
        {item.title}
      </h3>

      <p
        className={cn(
          "mt-3 text-[15px] leading-relaxed text-fg-muted",
          isAnalysis && "italic",
        )}
      >
        {item.body}
      </p>

      {item.watchNext ? (
        <p className="mt-3 text-sm text-fg">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            Watch next
          </span>
          <span className="mt-1 block text-fg-muted">{item.watchNext}</span>
        </p>
      ) : null}

      {item.quote ? (
        <blockquote className="mt-4 border-l-2 border-accent/40 pl-4">
          <p className="font-serif text-base italic leading-relaxed text-fg">
            <Quote className="mr-1 inline size-3.5 -translate-y-0.5 text-fg-subtle" />
            {item.quote.text}
          </p>
          <footer className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
            {item.quote.attribution}
            {item.quote.timestamp ? ` · ${item.quote.timestamp}` : ""}
            {item.quote.check === "pass" ? " · verified" : " · blocked"}
          </footer>
        </blockquote>
      ) : null}

      {item.originalHeadline ? (
        <p className="mt-3 font-serif text-sm text-fg">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            Original
          </span>
          <span className="mt-1 block">{item.originalHeadline}</span>
        </p>
      ) : null}

      {(item.confirmsIf || item.diesIf) && (
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {item.confirmsIf ? (
            <div className="rounded-md bg-bg-subtle/80 p-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-confirmed">
                Confirms if
              </dt>
              <dd className="mt-1 text-fg-muted">{item.confirmsIf}</dd>
            </div>
          ) : null}
          {item.diesIf ? (
            <div className="rounded-md bg-bg-subtle/80 p-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-unverified">
                Dies if
              </dt>
              <dd className="mt-1 text-fg-muted">{item.diesIf}</dd>
            </div>
          ) : null}
        </dl>
      )}

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {item.people.map((id) => (
            <PersonChip key={id} id={id} />
          ))}
          {item.people.length === 0 && item.lab ? (
            <Badge tone="mute">{item.lab}</Badge>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => toggleRead(item.id)}
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle hover:text-fg"
          >
            {read ? "Mark unread" : "Mark read"}
          </button>
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted hover:text-fg"
          >
            {item.sourceLabel}
            <ExternalLink className="size-3" />
          </a>
        </div>
      </footer>
    </article>
  );
}
