/**
 * Same-origin live edition for rainmaker.grok.me.
 * Browser CSP on *.grok.me can block GitHub; this Nitro middleware fetches it
 * server-side and returns JSON at /api/live.
 */
const UPSTREAMS = [
  "https://raw.githubusercontent.com/plykov/Rainmaker/ingest/daily/latest.json",
  "https://cdn.jsdelivr.net/gh/plykov/Rainmaker@ingest/daily/latest.json",
  "https://plykov.github.io/Rainmaker/briefing/latest.json",
];

interface LiveEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

export default async function liveEditionMiddleware(
  event: LiveEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const path = event.url.pathname;
  if (path !== "/api/live" && path !== "/api/live.json") return next();
  if ((event.req.method ?? "GET").toUpperCase() !== "GET") return next();

  for (const url of UPSTREAMS) {
    try {
      const res = await fetch(`${url}?t=${Date.now()}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
        headers: { Accept: "application/json", "User-Agent": "AI-Rainmaker-Watch/1.0" },
      });
      if (!res.ok) continue;
      const body = await res.text();
      if (!body.includes("rainmaker.digest.v1") && !body.includes('"items"')) continue;
      return new Response(body, {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": "no-store, max-age=0",
        },
      });
    } catch {
      /* next upstream */
    }
  }
  return new Response(JSON.stringify({ error: "live edition unavailable" }), {
    status: 502,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
