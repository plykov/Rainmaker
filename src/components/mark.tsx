import { cn } from "@/lib/utils";

export function RainmakerMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("text-accent", className)}
    >
      <path d="M4 8.5h16" stroke="currentColor" strokeWidth="1.6" />
      <path d="M6.5 12.5h11" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 16.5h6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
