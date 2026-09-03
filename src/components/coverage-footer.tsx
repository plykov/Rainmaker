import { Link } from "@tanstack/react-router";
import { todayCetDate } from "@/lib/cet";
import { droppedToday } from "@/lib/data/dropped";
import { AUDIT_DUE } from "@/lib/data/audit";
import { LATEST_DATE } from "@/lib/data/digests";
import type { Digest } from "@/lib/data/types";
import { useReader } from "@/lib/store";

export function CoverageFooter({ digest }: { digest: Digest }) {
  const isToday = digest.date === LATEST_DATE || digest.date === todayCetDate();
  const probe = useReader((s) => s.probe);
  const filing = useReader((s) => s.auditFilings[AUDIT_DUE]);
  const live = Boolean(isToday && probe && probe.date === digest.date);
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
          <p className="text-[10px] uppercase tracking-[0.18em] text-unverified">
            Fetch failures
            {live ? " · live probe" : isToday ? " · overnight seed" : ""}
          </p>
          <ul className="mt-1 space-y-1">
            {digest.fetchFailures.map((f) => (
              <li key={f.source}>
                <span className="text-fg">{f.source}</span> — {f.detail}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-3">
          Fetch failures — none
          {live ? " · live probe" : isToday ? " · overnight seed" : ""}
        </p>
      )}
      <p className="mt-3">
        Gates — {digest.humanHeld.leak} held (leak) · {digest.humanHeld.regulation} held
        (regulation)
        {digest.humanHeld.releasedAt ? ` · released ${digest.humanHeld.releasedAt}` : ""}
      </p>
      <p className="mt-3 text-fg-subtle">
        Next audit —{" "}
        {isToday && filing
          ? `filed ${filing.label} · next ${digest.nextAudit}`
          : digest.nextAudit}
        {" · Grok send 07:00 CET"}
        {digest.rumorScorecardDue ? ` · rumor scorecard due ${digest.rumorScorecardDue}` : ""}
        {isToday ? (
          <>
            {" · "}
            <Link to="/audit" className="underline-offset-4 hover:underline">
              audit
            </Link>
            {" · "}
            <Link to="/pipeline" className="underline-offset-4 hover:underline">
              dropped pile
            </Link>
            {" · "}
            <Link to="/delivery" className="underline-offset-4 hover:underline">
              delivery
            </Link>
          </>
        ) : null}
      </p>
    </section>
  );
}
