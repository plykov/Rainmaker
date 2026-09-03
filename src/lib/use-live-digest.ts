import { useEffect, useState } from "react";
import { getDigest, getLatestDigest, LATEST_DATE } from "@/lib/data/digests";
import type { Digest } from "@/lib/data/types";
import {
  fetchLiveDated,
  fetchLiveLatest,
  LIVE_MIRRORS,
  liveDatedMirrors,
  parseLiveEnvelope,
  type LiveEnvelope,
} from "@/lib/live-edition";

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

async function loadLatest(): Promise<LiveEnvelope | null> {
  try {
    const env = await fetchLiveLatest();
    if (env) return env;
  } catch {
    /* client fallback */
  }
  return pullClient(LIVE_MIRRORS);
}

async function loadDated(date: string): Promise<LiveEnvelope | null> {
  try {
    const env = await fetchLiveDated({ data: { date } });
    if (env) return env;
  } catch {
    /* client fallback */
  }
  return pullClient(liveDatedMirrors(date));
}

export function useLiveLatest(fallback: Digest = getLatestDigest()) {
  const [env, setEnv] = useState<LiveEnvelope | null>(null);
  useEffect(() => {
    let cancelled = false;
    void loadLatest().then((next) => {
      if (!cancelled) setEnv(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const digest = env && env.digest.date >= fallback.date ? env.digest : fallback;
  return {
    digest,
    live: Boolean(env && env.digest.date >= fallback.date),
    publishedAt: env?.publishedAt,
    latestDate: digest.date,
  };
}

export function useDatedDigest(date: string) {
  const baked = getDigest(date);
  const [env, setEnv] = useState<LiveEnvelope | null>(null);
  const [ready, setReady] = useState(Boolean(baked));
  useEffect(() => {
    if (baked) {
      setReady(true);
      return;
    }
    let cancelled = false;
    setReady(false);
    void loadDated(date).then((next) => {
      if (!cancelled) {
        setEnv(next);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [date, baked]);
  return { digest: env?.digest ?? baked, ready };
}
