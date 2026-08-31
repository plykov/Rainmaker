import { Badge } from "@/components/ui/badge";
import { plantJobs } from "@/lib/data/plant";

export function PlantBoard() {
  return (
    <section className="mt-8">
      <h2 className="font-serif text-2xl tracking-tight">Scheduled plant</h2>
      <p className="mt-2 max-w-2xl text-sm text-fg-muted">
        Two Grok tasks fire with the tab closed. The 07:00 send is email + app notification — one
        Stage 2 call a day. n8n and the X List are still a VPS you do not have here.
      </p>
      <ul className="mt-5 divide-y divide-border border-y border-border">
        {plantJobs.map((job) => (
          <li key={job.id} className="grid gap-2 py-4 sm:grid-cols-[7.5rem_1fr_auto]">
            <p className="font-mono text-xs tabular-nums text-fg-subtle">
              {job.time} {job.cadence === "Daily" || job.cadence.startsWith("Weekly") ? "CET" : ""}
            </p>
            <div>
              <h3 className="font-serif text-lg tracking-tight">{job.name}</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
                {job.cadence} · next {job.nextLabel}
                {job.kind === "live" ? ` · ${job.channel}` : ""}
              </p>
              <p className="mt-1 text-sm text-fg-muted">{job.note}</p>
            </div>
            <Badge tone={job.kind === "live" ? "confirmed" : "mute"} className="h-fit">
              {job.kind === "live" ? "live" : "not running"}
            </Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
