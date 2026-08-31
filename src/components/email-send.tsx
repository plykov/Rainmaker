import { Link } from "@tanstack/react-router";
import { Check, Copy, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { copyText, toBriefingMarkdown, toEmailSubject, toMailtoBody } from "@/lib/briefing-md";
import { cetStamp } from "@/lib/cet";
import { digestWordCount, LATEST_DATE } from "@/lib/data/digests";
import type { Digest } from "@/lib/data/types";
import { formatBriefingDate, readTimeLabel } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useReader } from "@/lib/store";

export function EmailSend({ digest, onClose }: { digest: Digest; onClose: () => void }) {
  const words = digestWordCount(digest);
  const body = toBriefingMarkdown(digest);
  const subject = toEmailSubject(digest);
  const recordSend = useReader((s) => s.recordSend);
  const edition = useReader((s) => s.editions[digest.date]);
  const [copied, setCopied] = useState(false);
  const page = typeof window === "undefined" ? "/" : `${window.location.origin}/`;
  const mailtoBody = toMailtoBody(digest, page);
  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copy = async () => {
    await copyText(body);
    recordSend({
      date: digest.date,
      at: new Date().toISOString(),
      label: cetStamp(new Date()),
      via: "copy",
      subject,
    });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

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
            Email plus the hosted page, updated in place. The mail client is the send path; copy
            carries the full markdown.
            {digest.date === LATEST_DATE ? (
              <>
                {" "}
                <Link to="/delivery" className="underline-offset-4 hover:underline" onClick={onClose}>
                  Delivery desk
                </Link>
              </>
            ) : null}
          </p>
        </div>
        <div className="divide-y divide-border border-b border-border">
          <Meta k="From" v="AI Rainmaker Watch" />
          <Meta k="To" v="the four-minute list" />
          <Meta
            k="Page"
            v={
              edition
                ? `Live · ${edition.label}`
                : digest.date === LATEST_DATE
                  ? "Unstamped"
                  : formatBriefingDate(digest.date)
            }
          />
          <Meta k="Subject" v={subject} />
        </div>
        <pre className="max-h-[40dvh] overflow-auto whitespace-pre-wrap px-5 py-4 font-sans text-sm leading-relaxed text-fg-muted">
          {mailtoBody}
        </pre>
        <p className="border-t border-border px-5 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
          {words} words · {readTimeLabel(words)} · full markdown on copy
        </p>
        <div className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={() => void copy()}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy markdown"}
          </Button>
          <Button asChild>
            <a
              href={mailto}
              onClick={() =>
                recordSend({
                  date: digest.date,
                  at: new Date().toISOString(),
                  label: cetStamp(new Date()),
                  via: "mailto",
                  subject,
                })
              }
            >
              <Mail className="size-3.5" />
              Open in mail client
            </a>
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
