import { useEffect } from "react";
import { toBriefingMarkdown } from "@/lib/briefing-md";
import { digestWordCount } from "@/lib/data/digests";
import type { Digest } from "@/lib/data/types";
import { formatBriefingDate, readTimeLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function EmailSend({ digest, onClose }: { digest: Digest; onClose: () => void }) {
  const words = digestWordCount(digest);
  const body = toBriefingMarkdown(digest);
  const subject = `AI Rainmaker Watch — ${formatBriefingDate(digest.date)} · ${digest.admitted} admitted · ${readTimeLabel(words)}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-3 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-labelledby="email-send-title"
        className="max-h-[90dvh] w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-[var(--shadow-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-border px-5 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
            Delivery · 07:00 CET
          </p>
          <h2 id="email-send-title" className="mt-1 font-serif text-2xl tracking-tight">
            This morning's send
          </h2>
          <p className="mt-1 text-sm text-fg-muted">
            Email plus the hosted page, updated in place. The archive is the product, not an inbox
            dump.
          </p>
        </div>
        <div className="divide-y divide-border border-b border-border">
          <Meta k="From" v="AI Rainmaker Watch" />
          <Meta k="To" v="the four-minute list" />
          <Meta k="Sent" v="07:00 CET" />
          <Meta k="Subject" v={subject} />
        </div>
        <pre className="max-h-[48dvh] overflow-auto whitespace-pre-wrap px-5 py-4 font-sans text-sm leading-relaxed text-fg-muted">
          {body}
        </pre>
        <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-4 px-5 py-2.5">
      <p className="w-16 shrink-0 pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        {k}
      </p>
      <p className="min-w-0 text-sm leading-snug text-fg">{v}</p>
    </div>
  );
}
