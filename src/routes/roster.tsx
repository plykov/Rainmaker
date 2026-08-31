import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PersonInitials } from "@/components/person-chip";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { itemsForPerson } from "@/lib/data/digests";
import { exclusions } from "@/lib/data/desk";
import { GROUP_LABEL, people, TIER_LABEL } from "@/lib/data/people";
import type { Person, PersonGroup, PersonTier } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roster")({ component: RosterPage });

const GROUPS: PersonGroup[] = ["executive", "technical", "analyst"];

const QUALIFYING_TESTS = [
  {
    name: "Causal power",
    detail: "Can this person's decision change what ships, what is funded, or what is legal?",
  },
  {
    name: "Signal frequency",
    detail: "Do they emit anything monitorable at all?",
  },
  {
    name: "Lead time",
    detail: "Do they say things before the press reports them? The only justification for watching people rather than TechCrunch.",
  },
  {
    name: "Non-redundancy",
    detail: "If removing them changes nothing about what you learn, they are noise.",
  },
];

function RosterPage() {
  const [q, setQ] = useState("");
  const [tier, setTier] = useState<"all" | PersonTier>("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return people.filter((p) => {
      if (tier !== "all" && p.tier !== tier) return false;
      if (!needle) return true;
      return [p.name, p.nameNative, p.org, p.role, p.bio, ...(p.aliases ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [q, tier]);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">§01</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">Key rainmakers</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
        Four tests, at least three to qualify: causal power, signal frequency, lead time, and
        non-redundancy. Executives give intent, technical principals give capability, analysts give
        interpretation. China desk is a first-class function, not two names inside a Western list.
      </p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUALIFYING_TESTS.map((t) => (
          <li key={t.name} className="rounded-xl border border-border bg-bg-elevated p-4">
            <h2 className="font-serif text-lg tracking-tight">{t.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{t.detail}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by name, lab, role"
          aria-label="Filter roster"
          className="sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-1.5">
          {(["all", 1, 2, "watch"] as const).map((t) => (
            <button
              key={String(t)}
              type="button"
              onClick={() => setTier(t)}
              className={cn(
                "h-10 rounded-md px-3 font-mono text-[10px] uppercase tracking-[0.14em]",
                tier === t ? "bg-accent text-accent-fg" : "border border-border text-fg-muted hover:text-fg",
              )}
            >
              {t === "all" ? "All" : TIER_LABEL[String(t)]}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 font-mono text-[10px] tabular-nums uppercase tracking-[0.14em] text-fg-subtle">
        {filtered.length} of {people.length}
      </p>

      {GROUPS.map((g) => {
        const list = filtered.filter((p) => p.group === g);
        if (list.length === 0) return null;
        return (
          <section key={g} className="mt-12">
            <h2 className="font-serif text-2xl tracking-tight">{GROUP_LABEL[g]}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {list.map((p) => (
                <PersonRow key={p.id} person={p} />
              ))}
            </ul>
          </section>
        );
      })}

      <section className="mt-16">
        <h2 className="font-serif text-2xl tracking-tight">Deliberately excluded</h2>
        <p className="mt-1 max-w-2xl text-sm text-fg-muted">
          If removing them changes nothing about what you learn, they are noise. Daily monitoring
          is expensive in precision, not in API calls.
        </p>
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {exclusions.map((e) => (
            <li key={e.name} className="py-4">
              <h3 className="font-serif text-lg tracking-tight">{e.name}</h3>
              <p className="mt-1 text-sm text-fg-muted">{e.why}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function PersonRow({ person }: { person: Person }) {
  const n = itemsForPerson(person.id).length;
  return (
    <li>
      <Link
        to="/person/$id"
        params={{ id: person.id }}
        className="flex h-full gap-4 rounded-xl border border-border bg-bg-elevated p-4 transition-[box-shadow,border-color] hover:border-border-strong hover:shadow-[var(--shadow-border-hover)]"
      >
        <PersonInitials id={person.id} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-lg leading-tight tracking-tight">
              {person.name}
              {person.nameNative ? (
                <span className="ml-2 font-sans text-sm text-fg-muted">{person.nameNative}</span>
              ) : null}
            </h3>
            <Badge tone={person.tier === 1 ? "accent" : "mute"}>{TIER_LABEL[String(person.tier)]}</Badge>
            {person.added === "v2" ? <Badge tone="confirmed">Added v2</Badge> : null}
            {person.corrected ? <Badge tone="reported">Corrected</Badge> : null}
            {person.chinaDesk ? <Badge tone="mute">China desk</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-fg-muted">
            {person.role} · {person.org}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-fg-subtle">{person.bio}</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            {n} item{n === 1 ? "" : "s"} in archive
          </p>
        </div>
      </Link>
    </li>
  );
}
