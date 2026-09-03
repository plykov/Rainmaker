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
  for (const url of urls) {
    try {
      const res = await fetch(`${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) continue;
      const env = parseLiveEnvelope(await res.json());
      if (env) return env;
    } catch {
      /* next mirror */
    }
  }
  return null;
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
