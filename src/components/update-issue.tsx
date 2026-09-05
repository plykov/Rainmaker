import { useNavigate } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatBriefingDate } from "@/lib/format";
import { importLatestEdition } from "@/lib/live-edition";
import { useReader } from "@/lib/store";
import { cn } from "@/lib/utils";

export function UpdateIssueButton({
  compact,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const navigate = useNavigate();
  const importLive = useReader((s) => s.importLive);
  const [phase, setPhase] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [okDate, setOkDate] = useState<string | null>(null);

  const run = async () => {
    setPhase("loading");
    const env = await importLatestEdition();
    if (!env) {
      setPhase("err");
      return;
    }
    importLive({
      date: env.digest.date,
      publishedAt: env.publishedAt,
      importedAt: new Date().toISOString(),
      digest: env.digest,
    });
    setOkDate(env.digest.date);
    setPhase("ok");
    if (window.location.pathname !== "/") {
      void navigate({ to: "/" });
    }
    window.setTimeout(() => setPhase("idle"), 2400);
  };

  const label =
    phase === "loading"
      ? "Updating…"
      : phase === "ok"
        ? okDate
          ? `Imported ${formatBriefingDate(okDate)}`
          : "Imported"
        : phase === "err"
          ? "No live edition"
          : compact
            ? "Update"
            : "Update issue";

  return (
    <Button
      variant={compact ? "ghost" : "default"}
      size={compact ? "icon-sm" : "sm"}
      className={cn(compact && "w-auto gap-1 px-2", className)}
      aria-label="Import the latest 07:00 briefing"
      disabled={phase === "loading"}
      onClick={() => void run()}
    >
      <RefreshCw className={cn("size-3.5", phase === "loading" && "animate-spin")} />
      {compact ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.12em]">{label}</span>
      ) : (
        label
      )}
    </Button>
  );
}
