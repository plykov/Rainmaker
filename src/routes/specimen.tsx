import { createFileRoute, Link } from "@tanstack/react-router";
import { DigestView } from "@/components/digest-view";
import { KeyboardNav } from "@/components/keyboard-nav";
import { ReadingProgress } from "@/components/reading-progress";
import { specimenDigest } from "@/lib/data/specimen";

export const Route = createFileRoute("/specimen")({ component: SpecimenPage });

function SpecimenPage() {
  const digest = specimenDigest;
  return (
    <>
      <ReadingProgress />
      <KeyboardNav date={digest.date} itemIds={digest.items.map((i) => i.id)} />
      <aside className="mx-auto mb-8 max-w-3xl rounded-xl border border-unverified/30 bg-bg-elevated p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-unverified">
          §05 · Illustrative
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
          Placeholder content, real structure. Every item describes no actual event — the failure
          mode found when a sample digest published named individuals as though reported. Caps,
          labels, lanes, and the coverage footer are load-bearing; the facts are not.
        </p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          <Link to="/" className="hover:text-fg">
            Today's briefing
          </Link>
          {" · "}
          <Link to="/method" className="hover:text-fg">
            Method
          </Link>
          {" · "}
          <Link to="/pipeline" className="hover:text-fg">
            Pipeline
          </Link>
        </p>
      </aside>
      <DigestView digest={digest} />
    </>
  );
}
