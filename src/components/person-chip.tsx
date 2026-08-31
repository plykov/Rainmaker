import { Link } from "@tanstack/react-router";
import { peopleById } from "@/lib/data/people";
import { cn } from "@/lib/utils";

export function PersonChip({ id, className }: { id: string; className?: string }) {
  const p = peopleById[id];
  if (!p) return null;
  const initials = p.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <Link
      to="/person/$id"
      params={{ id }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-elevated pr-2.5 pl-0.5 py-0.5 text-xs text-fg hover:border-border-strong hover:bg-bg-subtle transition-colors",
        className,
      )}
    >
      <span className="flex size-5 items-center justify-center rounded-full bg-bg-subtle font-mono text-[9px] text-fg-muted">
        {initials}
      </span>
      <span>{p.name}</span>
    </Link>
  );
}

export function PersonInitials({
  id,
  size = "md",
}: {
  id: string;
  size?: "sm" | "md" | "lg";
}) {
  const p = peopleById[id];
  const initials = (p?.name ?? id)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  const dim = size === "lg" ? "size-14 text-lg" : size === "sm" ? "size-8 text-[10px]" : "size-10 text-xs";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-border bg-bg-subtle font-serif text-fg",
        dim,
      )}
    >
      {initials}
    </span>
  );
}
