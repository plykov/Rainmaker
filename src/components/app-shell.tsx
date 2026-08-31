import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bookmark, Menu, Search, Type, X } from "lucide-react";
import { useEffect, useState } from "react";
import { RainmakerMark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { pendingQueue } from "@/lib/data/desk";
import { LATEST_DATE } from "@/lib/data/digests";
import { useReader } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Today" },
  { to: "/archive", label: "Archive" },
  { to: "/roster", label: "Roster" },
  { to: "/sources", label: "Sources" },
  { to: "/pipeline", label: "Pipeline" },
  { to: "/desk", label: "Desk" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const fontScale = useReader((s) => s.fontScale);
  const setFontScale = useReader((s) => s.setFontScale);
  const setHelpOpen = useReader((s) => s.setHelpOpen);
  const queueDecisions = useReader((s) => s.queueDecisions);
  const bookmarks = useReader((s) => s.bookmarks);
  const pendingCount = pendingQueue.filter(
    (q) => !queueDecisions[q.id] || queueDecisions[q.id] === "held",
  ).length;

  useEffect(() => {
    void useReader.persist.rehydrate();
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing) return;
      if (e.key === "?") {
        e.preventDefault();
        setHelpOpen(true);
      }
      if (e.key === "/") {
        e.preventDefault();
        void navigate({ to: "/search" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setHelpOpen, navigate]);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
      >
        Skip to briefing
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 pr-2">
            <RainmakerMark className="size-6" />
            <span className="flex flex-col leading-none">
              <span className="font-serif text-[15px] tracking-tight text-fg">Rainmaker</span>
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-fg-subtle">
                Watch
              </span>
            </span>
          </Link>

          <nav className="ml-3 hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/" || pathname.startsWith("/d/")
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-label={
                    item.to === "/desk" && pendingCount > 0
                      ? `Desk, ${pendingCount} awaiting review`
                      : item.label
                  }
                  className={cn(
                    "rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    active ? "bg-bg-subtle text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {item.label}
                  {item.to === "/desk" && pendingCount > 0 ? (
                    <span className="ml-1.5 font-mono text-[10px] tabular-nums text-unverified">
                      {pendingCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <p className="mr-2 hidden font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle lg:block">
              {LATEST_DATE} · 07:00 CET
            </p>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Cycle type size"
              onClick={() =>
                setFontScale(fontScale === "sm" ? "md" : fontScale === "md" ? "lg" : "sm")
              }
            >
              <Type className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" asChild>
              <Link to="/search" aria-label="Search">
                <Search className="size-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className={bookmarks.length > 0 ? "w-auto gap-1 px-2" : undefined}
              asChild
            >
              <Link
                to="/search"
                search={{ saved: true }}
                aria-label={
                  bookmarks.length > 0 ? `Bookmarks, ${bookmarks.length}` : "Bookmarks"
                }
              >
                <Bookmark className="size-4" />
                {bookmarks.length > 0 ? (
                  <span className="font-mono text-[10px] tabular-nums text-fg-subtle">
                    {bookmarks.length}
                  </span>
                ) : null}
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>
        {open ? (
          <nav className="border-t border-border px-4 py-3 lg:hidden">
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-label={
                      item.to === "/desk" && pendingCount > 0
                        ? `Desk, ${pendingCount} awaiting review`
                        : item.label
                    }
                    className="flex h-11 items-center rounded-md px-3 text-sm text-fg hover:bg-bg-subtle"
                  >
                    {item.label}
                    {item.to === "/desk" && pendingCount > 0 ? (
                      <span className="ml-2 font-mono text-[10px] tabular-nums text-unverified">
                        {pendingCount}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/search"
                  className="flex h-11 items-center rounded-md px-3 text-sm text-fg hover:bg-bg-subtle"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  search={{ saved: true }}
                  className="flex h-11 items-center rounded-md px-3 text-sm text-fg hover:bg-bg-subtle"
                >
                  Bookmarks
                  {bookmarks.length > 0 ? (
                    <span className="ml-2 font-mono text-[10px] tabular-nums text-unverified">
                      {bookmarks.length}
                    </span>
                  ) : null}
                </Link>
              </li>
            </ul>
          </nav>
        ) : null}
      </header>
      <div className="paper-grid">
        <main id="main" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          {children}
        </main>
      </div>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
            AI Rainmaker Watch · Daily · 07:00 CET
          </p>
          <p className="text-xs text-fg-subtle">
            <Link to="/method" className="hover:text-fg">
              Method
            </Link>
            {" · "}
            <Link to="/specimen" className="hover:text-fg">
              Specimen
            </Link>
            {" · "}
            Press <kbd className="rounded border border-border px-1 font-mono text-[10px]">?</kbd>{" "}
            for keys · multiplicative admission · two lanes
          </p>
        </div>
      </footer>
      <HelpOverlay />
    </div>
  );
}

function HelpOverlay() {
  const open = useReader((s) => s.helpOpen);
  const setHelpOpen = useReader((s) => s.setHelpOpen);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHelpOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setHelpOpen]);
  if (!open) return null;
  const rows = [
    ["j / k", "Next / previous item"],
    ["[ / ]", "Previous / next issue"],
    ["/", "Search"],
    ["b", "Bookmark focused item"],
    ["?", "This panel"],
    ["Esc", "Close"],
  ];
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 p-4"
      onClick={() => setHelpOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-bg-elevated p-6 shadow-[var(--shadow-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
          Keyboard
        </p>
        <h2 className="mt-1 font-serif text-2xl">Four-minute keys</h2>
        <dl className="mt-4 space-y-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 text-sm">
              <dt className="font-mono text-xs text-fg">{k}</dt>
              <dd className="text-fg-muted">{v}</dd>
            </div>
          ))}
        </dl>
        <Button className="mt-6 w-full" onClick={() => setHelpOpen(false)}>
          Close
        </Button>
      </div>
    </div>
  );
}
