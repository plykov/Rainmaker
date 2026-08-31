import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DigestItemCard } from "@/components/digest-item";
import { Input } from "@/components/ui/input";
import { searchItems } from "@/lib/data/catalog";
import { allItems } from "@/lib/data/digests";
import { people } from "@/lib/data/people";
import { useReleasedItems } from "@/lib/hydrate";
import { useReader } from "@/lib/store";
import type { Confidence } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): { saved?: boolean } => {
    const saved =
      search.saved === true || search.saved === "true" || search.saved === "1";
    return saved ? { saved: true } : {};
  },
  component: SearchPage,
});

function SearchPage() {
  const { saved } = Route.useSearch();
  const [q, setQ] = useState("");
  const [conf, setConf] = useState<"all" | Confidence>("all");
  const bookmarks = useReader((s) => s.bookmarks);
  const [onlyBookmarks, setOnlyBookmarks] = useState(Boolean(saved));
  const extras = useReleasedItems();

  useEffect(() => {
    setOnlyBookmarks(Boolean(saved));
  }, [saved]);

  const items = useMemo(() => {
    let list = searchItems([...allItems(), ...extras], q);
    if (conf !== "all") list = list.filter((i) => i.confidence === conf);
    if (onlyBookmarks) list = list.filter((i) => bookmarks.includes(i.id));
    return list;
  }, [q, conf, onlyBookmarks, bookmarks, extras]);

  const peopleHits = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return people
      .filter((p) =>
        [p.name, p.nameNative, p.org, p.role, ...(p.aliases ?? [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(needle),
      )
      .slice(0, 6);
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">Search</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">
        {onlyBookmarks ? "Bookmarks" : "Across the archive"}
      </h1>
      <div className="mt-6">
        <Input
          autoFocus={!onlyBookmarks}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="People, labs, models, quotes"
          aria-label="Search briefings"
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(["all", "confirmed", "reported", "unverified"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setConf(c)}
            className={cn(
              "h-10 rounded-md px-3 font-mono text-[10px] uppercase tracking-[0.14em]",
              conf === c ? "bg-accent text-accent-fg" : "border border-border text-fg-muted hover:text-fg",
            )}
          >
            {c}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setOnlyBookmarks((v) => !v)}
          className={cn(
            "h-10 rounded-md px-3 font-mono text-[10px] uppercase tracking-[0.14em]",
            onlyBookmarks ? "bg-accent text-accent-fg" : "border border-border text-fg-muted hover:text-fg",
          )}
        >
          Bookmarks
        </button>
      </div>

      {peopleHits.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {peopleHits.map((p) => (
            <li key={p.id}>
              <Link
                to="/person/$id"
                params={{ id: p.id }}
                className="inline-flex h-10 items-center rounded-full border border-border px-3 text-sm text-fg hover:bg-bg-subtle"
              >
                {p.name}
                <span className="ml-2 text-fg-subtle">{p.org}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        {items.length} item{items.length === 1 ? "" : "s"}
      </p>
      <div className="mt-4 space-y-4">
        {items.map((item, i) => (
          <DigestItemCard key={item.id} item={item} index={i + 1} of={items.length} showIssue />
        ))}
        {items.length === 0 ? (
          <p className="text-sm text-fg-muted">
            {onlyBookmarks
              ? "Nothing bookmarked. On a briefing, press b on a focused item."
              : "Nothing admitted matches. Try a lab, a person, or a model name."}
          </p>
        ) : null}
      </div>
    </div>
  );
}
