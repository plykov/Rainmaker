import { type ReactNode, useEffect, useState } from "react";
import { LIVE_MIRRORS } from "@/lib/live-edition";

const PAGES = "https://plykov.github.io/Rainmaker/";

function isPublishedGrokMe(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "rainmaker.grok.me") return true;
  if (!host.endsWith(".grok.me")) return false;
  if (host.includes("preview") || host.includes("sandbox")) return false;
  return true;
}

async function anyLive(): Promise<boolean> {
  const urls = ["/api/live", ...LIVE_MIRRORS.filter((u) => u.startsWith("http"))];
  const hits = await Promise.all(
    urls.map(async (url) => {
      try {
        const href = url.startsWith("http") ? url : new URL(url, window.location.origin).href;
        const res = await fetch(`${href}?t=${Date.now()}`, { cache: "no-store" });
        return res.ok;
      } catch {
        return false;
      }
    }),
  );
  return hits.some(Boolean);
}

/**
 * rainmaker.grok.me is a frozen Vercel snapshot. After this publish, /api/live
 * proxies GitHub (CSP-safe). If that snapshot still cannot reach a live JSON,
 * show the GitHub Pages issue the 07:00 job does rebuild.
 */
export function GrokMeHost({ children }: { children: ReactNode }) {
  const [frame, setFrame] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isPublishedGrokMe(window.location.hostname)) return;
    let cancelled = false;
    void anyLive().then((ok) => {
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
