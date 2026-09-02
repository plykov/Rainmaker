#!/usr/bin/env node
/**
 * Static briefing site for GitHub Pages.
 * Reads public/briefing/*.json (skip latest.json if it is only a stub),
 * writes site/index.html + site/d/YYYY-MM-DD.html + site/briefing/*.json
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const briefingDir = join(root, "public", "briefing");
const outDir = join(root, "site");

const SECTIONS = [
  ["lede", "The Lede"],
  ["critical", "Critical events"],
  ["leaks", "Leaks & unconfirmed"],
  ["words", "In their own words"],
  ["research", "Research & capability"],
  ["china", "China desk"],
  ["trend", "Trend line"],
];

function loadDigests() {
  const files = readdirSync(briefingDir).filter((f) => f.endsWith(".json"));
  const byDate = new Map();
  for (const file of files) {
    const raw = JSON.parse(readFileSync(join(briefingDir, file), "utf8"));
    if (!raw?.date || !Array.isArray(raw.items)) continue;
    byDate.set(raw.date, raw);
  }
  const dates = [...byDate.keys()].sort();
  return { byDate, dates, latest: dates.at(-1) };
}

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&")
    .replaceAll("<", "<")
    .replaceAll(">", ">")
    .replaceAll('"', """);
}

function fmtDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function wordCount(digest) {
  let n = 0;
  for (const item of digest.items ?? []) {
    const text = [
      item.title,
      item.body,
      item.watchNext,
      item.quote?.text,
      item.confirmsIf,
      item.diesIf,
      item.originalHeadline,
    ]
      .filter(Boolean)
      .join(" ");
    n += text.split(/\s+/).filter(Boolean).length;
  }
  return n;
}

function itemCard(item, idx, total) {
  const score = item.scores
    ? Math.round(
        Math.cbrt(item.scores.novelty * item.scores.authority * item.scores.consequence) * 10,
      ) / 10
    : null;
  return `<article class="card" id="${esc(item.id)}">
  <div class="meta">
    <span class="pill ${esc(item.confidence)}">${esc(item.confidence)}</span>
    <span class="pill muted">${esc(item.evidenceClass)}</span>
    ${item.lane === "analysis" ? `<span class="pill analysis">analysis</span>` : ""}
    ${item.humanGated ? `<span class="pill gate">human gate</span>` : ""}
    ${score != null ? `<span class="score">${score}</span>` : ""}
    <span class="count">${idx + 1} of ${total}</span>
  </div>
  <h3>${esc(item.title)}</h3>
  ${item.originalHeadline ? `<p class="orig">${esc(item.originalHeadline)}</p>` : ""}
  <p>${esc(item.body)}</p>
  ${item.quote ? `<blockquote><p>“${esc(item.quote.text)}”</p><cite>${esc(item.quote.attribution)}${item.quote.timestamp ? ` · ${esc(item.quote.timestamp)}` : ""}</cite></blockquote>` : ""}
  ${item.confirmsIf ? `<p class="gate-line"><strong>Confirms if</strong> ${esc(item.confirmsIf)}</p>` : ""}
  ${item.diesIf ? `<p class="gate-line"><strong>Dies if</strong> ${esc(item.diesIf)}</p>` : ""}
  ${item.watchNext ? `<p class="watch">Watch next: ${esc(item.watchNext)}</p>` : ""}
  <p class="src"><a href="${esc(item.sourceUrl)}">${esc(item.sourceLabel)}</a>${item.lab ? ` · ${esc(item.lab)}` : ""}${item.people?.length ? ` · ${esc(item.people.join(", "))}` : ""}</p>
</article>`;
}

function page({ digest, dates, latest, isToday }) {
  const words = wordCount(digest);
  const mins = Math.max(1, Math.round(words / 160));
  const secs = Math.round(((words / 160) * 60) % 60)
    .toString()
    .padStart(2, "0");
  const i = dates.indexOf(digest.date);
  const prev = i > 0 ? dates[i - 1] : null;
  const next = i < dates.length - 1 ? dates[i + 1] : null;
  const sections = SECTIONS.map(([id, label]) => {
    const items = digest.items.filter((it) => it.section === id);
    if (!items.length) return "";
    return `<section>
      <h2>${esc(label)} <span>${items.length}</span></h2>
      ${items.map((it, n) => itemCard(it, n, items.length)).join("\n")}
    </section>`;
  }).join("\n");
  const radar = (digest.radar ?? [])
    .map((r) => `<li><time>${esc(r.date)}</time> ${esc(r.label)} <em>${esc(r.kind)}</em></li>`)
    .join("");
  const fails = (digest.fetchFailures ?? [])
    .map((f) => `<li><strong>${esc(f.source)}</strong> — ${esc(f.detail)}</li>`)
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Rainmaker Watch · ${esc(fmtDate(digest.date))}</title>
  <meta name="description" content="AI Rainmaker Watch — four-minute daily on who actually moves AI."/>
  <style>
    :root { --bg:#0b0c0a; --ink:#e8e2d4; --mute:#8a8578; --line:#2a2c26; --card:#141510; --good:#9ec27a; --warn:#d4b56a; --bad:#c9896a; --anal:#8aa4c8; }
    * { box-sizing: border-box; }
    html, body { margin:0; background:var(--bg); color:var(--ink); font:16px/1.5 Georgia, serif; }
    header, main, footer { max-width: 42rem; margin: 0 auto; padding: 1.25rem 1.1rem; }
    header { padding-top: 2rem; }
    .kicker { letter-spacing:.18em; text-transform:uppercase; font-size:.68rem; color:var(--mute); font-family: ui-sans-serif, system-ui, sans-serif; }
    h1 { font-weight:500; font-size:2.4rem; margin:.35rem 0 .4rem; }
    .stats { color:var(--mute); font-size:.92rem; }
    nav { display:flex; gap:.5rem; flex-wrap:wrap; margin:1rem 0 1.4rem; }
    nav a, nav span { border:1px solid var(--line); padding:.4rem .7rem; text-decoration:none; color:var(--ink); font-family: ui-sans-serif, system-ui, sans-serif; font-size:.85rem; }
    nav span { color:var(--mute); }
    h2 { font-size:1.35rem; font-weight:500; margin:2rem 0 .8rem; }
    h2 span { color:var(--mute); font-size:.8rem; }
    .card { background:var(--card); border:1px solid var(--line); padding:1rem; margin:0 0 .9rem; }
    .pill { border:1px solid var(--line); padding:.12rem .4rem; text-transform:uppercase; letter-spacing:.06em; font-family: ui-sans-serif, system-ui, sans-serif; font-size:.7rem; }
    .confirmed { color:#0b0c0a; background:var(--good); }
    .reported { color:#0b0c0a; background:var(--warn); }
    .unverified { color:#0b0c0a; background:var(--bad); }
    .analysis { color:#0b0c0a; background:var(--anal); }
    .src a { color:#c5d4a4; }
    footer { color:var(--mute); font-size:.82rem; padding-bottom:3rem; }
    footer a { color:#c5d4a4; }
  </style>
</head>
<body>
  <header>
    <div class="kicker">Rainmaker Watch · ${isToday ? "Today’s briefing" : "Archive"} · 07:00 CET</div>
    <h1>${esc(fmtDate(digest.date))}</h1>
    <p class="stats">07:00 CET · ${digest.scanned ?? "—"} scanned → ${digest.admitted} admitted · ${words} words · read ${mins}m${secs}s</p>
    ${digest.weekdayNote ? `<p class="stats">${esc(digest.weekdayNote)}</p>` : ""}
    <nav>
      ${prev ? `<a href="${isToday ? `d/${prev}.html` : `${prev}.html`}">← Previous</a>` : `<span>← Previous</span>`}
      ${next ? `<a href="${isToday ? `d/${next}.html` : `${next}.html`}">Next →</a>` : `<span>Next →</span>`}
      ${isToday ? "" : `<a href="../index.html">Today</a>`}
      <a href="${isToday ? "briefing/latest.json" : "../briefing/latest.json"}">JSON</a>
    </nav>
  </header>
  <main>
    ${sections || "<p>No items admitted.</p>"}
    ${radar ? `<section><h2>Radar</h2><ul>${radar}</ul></section>` : ""}
    ${fails ? `<section><h2>Coverage</h2><ul>${fails}</ul></section>` : ""}
  </main>
  <footer>
    Source of truth: <a href="https://github.com/plykov/Rainmaker">plykov/Rainmaker</a>.
    Pages rebuilds on every digest commit. rainmaker.grok.me is a frozen Grok publish.
  </footer>
</body>
</html>`;
}

const { byDate, dates, latest } = loadDigests();
if (!latest) {
  console.error("No digest JSON with items found in public/briefing");
  process.exit(1);
}

mkdirSync(join(outDir, "d"), { recursive: true });
mkdirSync(join(outDir, "briefing"), { recursive: true });

const latestDigest = byDate.get(latest);
writeFileSync(join(outDir, "index.html"), page({ digest: latestDigest, dates, latest, isToday: true }));
writeFileSync(join(outDir, "404.html"), page({ digest: latestDigest, dates, latest, isToday: true }));

for (const date of dates) {
  writeFileSync(
    join(outDir, "d", `${date}.html`),
    page({ digest: byDate.get(date), dates, latest, isToday: false }),
  );
  const src = join(briefingDir, `${date}.json`);
  try {
    copyFileSync(src, join(outDir, "briefing", `${date}.json`));
  } catch {
    writeFileSync(join(outDir, "briefing", `${date}.json`), JSON.stringify(byDate.get(date), null, 2));
  }
}
writeFileSync(join(outDir, "briefing", "latest.json"), JSON.stringify(latestDigest, null, 2));
writeFileSync(join(outDir, ".nojekyll"), "");

console.log(`built ${dates.length} edition(s); latest=${latest} → ${outDir}`);
