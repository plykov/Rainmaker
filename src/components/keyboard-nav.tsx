import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { adjacentDates } from "@/lib/data/digests";
import { useReader } from "@/lib/store";

export function KeyboardNav({ date, itemIds }: { date: string; itemIds: string[] }) {
  const navigate = useNavigate();
  const toggleBookmark = useReader((s) => s.toggleBookmark);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      const { prev, next } = adjacentDates(date);
      if (e.key === "[" && prev) {
        e.preventDefault();
        void navigate({ to: "/d/$date", params: { date: prev } });
        return;
      }
      if (e.key === "]" && next) {
        e.preventDefault();
        void navigate({ to: "/d/$date", params: { date: next } });
        return;
      }
      if (e.key === "j" || e.key === "k") {
        e.preventDefault();
        const current = currentItemId();
        const i = current ? itemIds.indexOf(current) : -1;
        const nextI = e.key === "j" ? Math.min(itemIds.length - 1, i + 1) : Math.max(0, i <= 0 ? 0 : i - 1);
        const id = itemIds[nextI];
        if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (e.key === "b") {
        const current = currentItemId();
        if (current) toggleBookmark(current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [date, itemIds, navigate, toggleBookmark]);

  return null;
}

function currentItemId(): string | null {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-item-id]"));
  const probe = 120;
  let best: HTMLElement | null = null;
  let bestDist = Infinity;
  for (const n of nodes) {
    const top = n.getBoundingClientRect().top;
    const dist = Math.abs(top - probe);
    if (dist < bestDist) {
      bestDist = dist;
      best = n;
    }
  }
  return best?.dataset.itemId ?? null;
}
