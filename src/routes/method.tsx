import { createFileRoute, Link } from "@tanstack/react-router";
import { citations, ensembleNote, failures, rejected, reportScorecard, survivors, verificationNote } from "@/lib/data/method";

export const Route = createFileRoute("/method")({ component: MethodPage });

function MethodPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">§00</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">How this page was adjudicated</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">
        Four model reports plus v1, deduplicated to three. The digest format, the roster, and the
        gates are the survivors. Everything else was dropped on purpose.
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-unverified">{ensembleNote}</p>

      <section className="mt-12">
        <h2 className="font-serif text-2xl tracking-tight">Scorecard</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
              <tr className="border-b border-border">
                <th className="py-2 pr-3 font-medium">Report</th>
                <th className="py-2 pr-3 font-medium">Currency</th>
                <th className="py-2 pr-3 font-medium">Architecture</th>
                <th className="py-2 pr-3 font-medium">Epistemics</th>
                <th className="py-2 font-medium">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {reportScorecard.map((r) => (
                <tr key={r.report} className="border-b border-border align-top">
                  <td className="py-3 pr-3 text-fg">{r.report}</td>
                  <td className="py-3 pr-3 text-fg-muted">{r.currency}</td>
                  <td className="py-3 pr-3 text-fg-muted">{r.architecture}</td>
                  <td className="py-3 pr-3 text-fg-muted">{r.epistemics}</td>
                  <td className="py-3 text-fg">{r.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight">Failures found</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {failures.map((f) => (
            <li key={f.id} className="rounded-xl border border-border bg-bg-elevated p-4">
              <h3 className="font-serif text-lg tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{f.detail}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight">What survived</h2>
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {survivors.map((s) => (
            <li key={s.element} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr]">
              <div>
                <p className="text-sm text-fg">{s.element}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                  {s.origin}
                </p>
              </div>
              <p className="text-sm text-fg-muted">{s.why}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight">Rejected outright</h2>
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {rejected.map((r) => (
            <li key={r.name} className="py-4">
              <h3 className="font-serif text-lg tracking-tight">{r.name}</h3>
              <p className="mt-1 text-sm text-fg-muted">{r.why}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight">Verification note</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fg-muted">{verificationNote}</p>
        <p className="mt-4 text-sm text-fg-muted">
          The format itself is in the{" "}
          <Link to="/specimen" className="underline-offset-4 hover:underline">
            §05 specimen
          </Link>
          — placeholder content, real structure.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight">Sources for this design</h2>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">
          Checked this session. Outlet homepages, not invented article URLs. Handles and feed
          addresses drift — health-check at build time.
        </p>
        <ul className="mt-5 divide-y divide-border border-y border-border">
          {citations.map((c) => (
            <li key={`${c.outlet}-${c.title}`} className="py-3">
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle group-hover:text-fg">
                  {c.outlet}
                </p>
                <p className="mt-0.5 text-sm text-fg">{c.title}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-sm text-fg-muted">
        See{" "}
        <Link to="/pipeline" className="underline-offset-4 hover:underline">
          how the page is made
        </Link>{" "}
        for the scorer that additive ranking fails, and{" "}
        <Link to="/desk" className="underline-offset-4 hover:underline">
          the morning desk
        </Link>{" "}
        for the human gate.
      </p>
    </div>
  );
}