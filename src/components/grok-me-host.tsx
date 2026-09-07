import { type ReactNode, useEffect, useState } from "react";
import { todayCetDate } from "@/lib/cet";
import { LIVE_MIRRORS, parseLiveEnvelope } from "@/lib/live-edition";

const PAGES = "https://plykov.github.io/Rainmaker/";

function isPublishedGrokMe(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "rainmaker.grok.me") return true;
  if (!host.endsWith(".grok.me")) return false;
  if (host.includes("preview") || host.includes("sandbox")) return false;
  return true;
}

async function liveIsToday(): Promise<boolean> {
  const today = todayCetDate();
  const urls = ["/api/live", ...LIVE_MIRRORS.filter((u) => u.startsWith("http"))];
  const hits = await Promise.all(
    urls.map(async (url) => {
      try {
        const href = url.startsWith("http") ? url : new URL(url, window.location.origin).href;
        const res = await fetch(`${href}?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) return false;
        const env = parseLiveEnvelope(await res.json());
        return Boolean(env && env.digest.date >= today);
      } catch {
        return false;
      }
    }),
  );
  return hits.some(Boolean);
}

/**
 * rainmaker.grok.me is a frozen Vercel snapshot. After this publish, /api/live
 * hydrates from GitHub. If that snapshot cannot reach today's JSON, fall through
 * to GitHub Pages — the 07:00 job + daily Action rebuild that host.
 */
export function GrokMeHost({ children }: { children: ReactNode }) {
  const [frame, setFrame] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isPublishedGrokMe(window.location.hostname)) return;
    let cancelled = false;
    void liveIsToday().then((ok) => {
      if (!cancelled && !ok) setFrame(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!frame) return children;

  return (
    <iframe
      title="Rainmaker live edition"
      src={PAGES}
      className="fixed inset-0 z-40 size-full border-0 bg-bg"
    />
  );
}