import { createFileRoute, Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { SECTION_META } from "@/lib/data/catalog";
import { digestWordCount, digests, LATEST_DATE } from "@/lib/data/digests";
import { formatBriefingDate, readTimeLabel } from "@/lib/format";
import { useReader } from "@/lib/store";

export const Route = createFileRoute("/archive")({ component: ArchivePage });

function ArchivePage() {
  const readDigests = useReader((s) => s.readDigests);
  const sorted = [...digests].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">Archive</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">The issues</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted">
        One page a day, 07:00 CET. A quiet day looks quiet. Issues are updated in place — this
        archive is the product, not an email dump.
      </p>

      <aside className="mt-8 rounded-xl border border-border bg-bg-elevated p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
          §05 · Not in the daily series
        </p>
        <h2 className="mt-2 font-serif text-xl tracking-tight">
          <Link to="/specimen" className="hover:underline">
            Format specimen — Thu 3 Sep
          </Link>
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          Placeholder content, real structure. Caps, labels, and the coverage footer are
          load-bearing. The facts are not.
        </p>
      </aside>

      <ol className="mt-10 divide-y divide-border border-y border-border">
        {sorted.map((d) => {
          const words = digestWordCount(d);
          const lede = d.items.find((i) => i.section === "lede");
          const read = readDigests.includes(d.date);
          return (
            <li key={d.date}>
              <Link
                to="/d/$date"
                params={{ date: d.date }}
                className="group flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:gap-8"
              >
                <div className="w-36 shrink-0">
                  <p className="font-mono text-xs tabular-nums text-fg">
                    {format(parseISO(d.date), "EEE")}
                  </p>
                  <p className="font-serif text-2xl leading-none tracking-tight">
                    {format(parseISO(d.date), "d MMM")}
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                    {d.date === LATEST_DATE ? "Latest" : formatBriefingDate(d.date).slice(-4)}
                    {read ? " · Read" : ""}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {d.weekdayNote ? <Badge tone="accent">{d.weekdayNote}</Badge> : null}
                    {d.ledeAbsent ? <Badge tone="mute">Quiet</Badge> : null}
                    <span className="font-mono text-[10px] tabular-nums text-fg-subtle">
                      {d.admitted} admitted · {readTimeLabel(words)}
                    </span>
                  </div>
                  <h2 className="mt-2 font-serif text-xl leading-snug tracking-tight text-fg group-hover:underline">
                    {d.ledeAbsent
                      ? "No single dominant story today."
                      : (lede?.title ?? formatBriefingDate(d.date))}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-fg-muted">
                    {d.ledeAbsent
                      ? "The issue still carries the China desk, radar, and coverage footer."
                      : lede?.body}
                  </p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
                    {Object.entries(
                      d.items.reduce<Record<string, number>>((acc, i) => {
                        acc[i.section] = (acc[i.section] ?? 0) + 1;
                        return acc;
                      }, {}),
                    )
                      .map(([k, n]) => `${SECTION_META[k as keyof typeof SECTION_META]?.label ?? k} ${n}`)
                      .join(" · ")}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
