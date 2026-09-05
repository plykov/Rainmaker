import { useEffect, useState } from "react";
import { getDigest, getLatestDigest } from "@/lib/data/digests";
import type { Digest } from "@/lib/data/types";
import {
  fetchLiveDated,
  importLatestEdition,
  liveDatedMirrors,
  parseLiveEnvelope,
  type LiveEnvelope,
} from "@/lib/live-edition";
import { useReader } from "@/lib/store";

async function pullClient(urls: string[]): Promise<LiveEnvelope | null> {
  const found: LiveEnvelope[] = [];
  await Promise.all(
    urls.map(async (url) => {
      try {
        const href = url.startsWith("http") ? url : new URL(url, window.location.origin).href;
        const res = await fetch(`${href}${href.includes("?") ? "&" : "?"}t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) return;
        const env = parseLiveEnvelope(await res.json());
        if (env) found.push(env);
      } catch {
        /* next mirror */
      }
    }),
  );
  if (found.length === 0) return null;
  found.sort((a, b) => {
    const d = b.digest.date.localeCompare(a.digest.date);
    return d !== 0 ? d : b.publishedAt.localeCompare(a.publishedAt);
  });
  return found[0];
}

function newer(a: LiveEnvelope | null, b: LiveEnvelope | null): LiveEnvelope | null {
  if (!a) return b;
  if (!b) return a;
  const d = b.digest.date.localeCompare(a.digest.date);
  if (d !== 0) return d > 0 ? b : a;
  return b.publishedAt >= a.publishedAt ? b : a;
}

export function useLiveLatest(fallback: Digest = getLatestDigest()) {
  const imported = useReader((s) => s.imported);
  const [env, setEnv] = useState<LiveEnvelope | null>(null);
  useEffect(() => {
    let cancelled = false;
    void importLatestEdition().then((next) => {
      if (!cancelled) setEnv(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const stored: LiveEnvelope | null = imported
    ? { schema: "rainmaker.digest.v1", publishedAt: imported.publishedAt, digest: imported.digest }
    : null;
  const best = newer(env, stored);
  const digest = best && best.digest.date >= fallback.date ? best.digest : fallback;
  return {
    digest,
    live: Boolean(best && best.digest.date >= fallback.date),
    publishedAt: best?.publishedAt,
    latestDate: digest.date,
  };
}

export function useDatedDigest(date: string) {
  const baked = getDigest(date);
  const imported = useReader((s) => s.imported);
  const stored = imported?.date === date ? imported.digest : null;
  const [env, setEnv] = useState<LiveEnvelope | null>(null);
  const [ready, setReady] = useState(Boolean(baked || stored));
  useEffect(() => {
    if (baked || stored) {
      setReady(true);
      return;
    }
    let cancelled = false;
    setReady(false);
    void fetchLiveDated({ data: { date } })
      .then((next) => next ?? pullClient(liveDatedMirrors(date)))
      .then((next) => {
        if (!cancelled) {
          setEnv(next);
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          void pullClient(liveDatedMirrors(date)).then((next) => {
            if (!cancelled) {
              setEnv(next);
              setReady(true);
            }
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [date, baked, stored]);
  return { digest: env?.digest ?? stored ?? baked, ready };
}