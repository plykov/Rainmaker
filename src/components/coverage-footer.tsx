import { Link } from "@tanstack/react-router";
import { droppedToday } from "@/lib/data/dropped";
import { LATEST_DATE } from "@/lib/data/digests";
import type { Digest } from "@/lib/data/types";

export function CoverageFooter({ digest }: { digest: Digest }) {
  const isToday = digest.date === LATEST_DATE;
  return (
    <section
      id="coverage"
      className="scroll-mt-24 rounded-xl border border-border bg-bg-elevated p-5 font-mono text-[11px] leading-relaxed text-fg-muted sm:p-6"
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Coverage</p>
      <p className="mt-2 tabular-nums text-fg">
        {digest.scanned.toLocaleString()} scanned · {digest.passedRules} passed rules ·{" "}
        {digest.triaged} triaged ≥6.0 · {digest.admitted} admitted · {digest.merged} merged ·{" "}
        {digest.quoteBlocked} blocked by quote check
        {isToday ? ` · ${droppedToday.length} dropped` : ""}
      </p>
      {digest.fetchFailures.length > 0 ? (
        <div className="mt-3">
          <p className="text-[10px] uppercase tracking-[0.18em] text-unverified">Fetch failures</p>
          <ul className="mt-1 space-y-1">
            {digest.fetchFailures.map((f) => (
              <li key={f.source}>
                <span className="text-fg">{f.source}</span> — {f.detail}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-3">Fetch failures — none</p>
      )}
      <p className="mt-3">
        Gates — {digest.humanHeld.leak} held (leak) · {digest.humanHeld.regulation} held
        (regulation)
        {digest.humanHeld.releasedAt ? ` · released ${digest.humanHeld.releasedAt}` : ""}
      </p>
      <p className="mt-3 text-fg-subtle">
        Next audit — {digest.nextAudit}
        {digest.rumorScorecardDue ? ` · rumor scorecard due ${digest.rumorScorecardDue}` : ""}
        {isToday ? (
          <>
            {" · "}
            <Link to="/pipeline" className="underline-offset-4 hover:underline">
              dropped pile
            </Link>
          </>
        ) : null}
      </p>
    </section>
  );
}