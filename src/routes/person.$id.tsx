import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { DigestItemCard } from "@/components/digest-item";
import { PersonInitials } from "@/components/person-chip";
import { Badge } from "@/components/ui/badge";
import { itemsForPerson } from "@/lib/data/digests";
import { peopleById, TIER_LABEL } from "@/lib/data/people";
import { formatBriefingDate } from "@/lib/format";
import { useReleasedItems } from "@/lib/hydrate";

export const Route = createFileRoute("/person/$id")({
  component: PersonPage,
});

function PersonPage() {
  const { id } = Route.useParams();
  const extrasForAll = useReleasedItems();
  const person = peopleById[id];
  if (!person) throw notFound();
  const extras = extrasForAll.filter((i) => i.people.includes(id));
  const items = [...itemsForPerson(id), ...extras];

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
        <Link to="/roster" className="hover:text-fg">
          Roster
        </Link>
        <span className="mx-2">/</span>
        {person.org}
      </p>
      <div className="mt-4 flex items-start gap-4">
        <PersonInitials id={id} size="lg" />
        <div>
          <h1 className="font-serif text-4xl tracking-tight">
            {person.name}
            {person.nameNative ? (
              <span className="ml-3 font-serif text-2xl text-fg-muted">{person.nameNative}</span>
            ) : null}
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            {person.role} · {person.org}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge tone={person.tier === 1 ? "accent" : "mute"}>{TIER_LABEL[String(person.tier)]}</Badge>
            {person.added === "v2" ? <Badge tone="confirmed">Added v2</Badge> : null}
            {person.corrected ? <Badge tone="reported">Corrected</Badge> : null}
            {person.chinaDesk ? <Badge tone="mute">China desk</Badge> : null}
          </div>
        </div>
      </div>

      <p className="mt-6 text-[15px] leading-relaxed text-fg-muted">{person.bio}</p>

      <section className="mt-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Emits</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {person.emits.map((e) => (
            <li key={e}>
              <Badge tone="mute">{e}</Badge>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {person.site ? (
            <a
              href={person.site}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-fg-muted hover:text-fg"
            >
              Site <ExternalLink className="size-3" />
            </a>
          ) : null}
          {person.x ? (
            <a
              href={`https://x.com/${person.x}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-fg-muted hover:text-fg"
            >
              @{person.x} <ExternalLink className="size-3" />
            </a>
          ) : null}
        </div>
      </section>

      {person.pairWith && person.pairWith.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
            Tracked as a pair
          </h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {person.pairWith.map((pid) => (
              <li key={pid}>
                <Link
                  to="/person/$id"
                  params={{ id: pid }}
                  className="text-sm text-fg underline-offset-4 hover:underline"
                >
                  {peopleById[pid]?.name ?? pid}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-10">
        <h2 className="font-serif text-2xl tracking-tight">In the briefing</h2>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          {items.length} item{items.length === 1 ? "" : "s"} · cap 3 per person per day
        </p>
        {items.length === 0 ? (
          <p className="mt-5 text-sm text-fg-muted">
            No admitted items in the current archive. Watchlist names are sampled, not scored daily.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {items.map((item, i) => (
              <div key={item.id}>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                  <Link to="/d/$date" params={{ date: item.date }} className="hover:text-fg">
                    {formatBriefingDate(item.date)}
                  </Link>
                </p>
                <DigestItemCard item={item} index={i + 1} of={items.length} showIssue />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
