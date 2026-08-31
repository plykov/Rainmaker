import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">404</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">No briefing on this path</h1>
      <p className="mt-3 text-sm text-fg-muted">
        The roster moves. Handles drift. If a date or person is missing, it was never admitted.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Button asChild>
          <Link to="/">Today</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/archive">Archive</Link>
        </Button>
      </div>
    </div>
  );
}
