#!/usr/bin/env node
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const briefingDir = join(root, "public", "briefing");
const outDir = join(root, "site");
const SECTIONS = [
  ["lede", "The Lede"],
  ["critical", "Critical events"],
  ["leaks", "Leaks and unconfirmed"],
  ["words", "In their own words"],
  ["research", "Research and capability"],
  ["china", "China desk"],
  ["trend", "Trend line"],
];

function loadDigests() {
  const files = readdirSync(briefingDir).filter((f) => f.endsWith(".json"));
  const byDate = new Map();
  for (const file of files) {
    const raw = JSON.parse(readFileSync(join(briefingDir, file), "utf8"));
    if (!raw || !raw.date || !Array.isArray(raw.items)) continue;
    byDate.set(raw.date, raw);
  }
  const dates = [...byDate.keys()].sort();
  return { byDate, dates, latest: dates.at(-1) };
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/\"/g, "\u0026quot;");
}

function fmtDate(iso) {
  const parts = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
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
    const text = [item.title, item.body, item.watchNext, item.quote && item.quote.text, item.confirmsIf, item.diesIf, item.originalHeadline].filter(Boolean).join(" ");
    n += text.split(/\s+/).filter(Boolean).length;
  }
  return n;
}

function itemCard(item, idx, total) {
  const quote = item.quote
    ? "<blockquote><p>" + esc(item.quote.text) + "</p><cite>" + esc(item.quote.attribution) + "</cite></blockquote>"
    : "";
  const orig = item.originalHeadline ? "<p class=\"orig\">" + esc(item.originalHeadline) + "</p>" : "";
  const watch = item.watchNext ? "<p class=\"watch\">Watch next: " + esc(item.watchNext) + "</p>" : "";
  const analysis = item.lane === "analysis" ? "<span class=\"pill analysis\">analysis</span>" : "";
  return "<article class=\"card\" id=\"" + esc(item.id) + "\"><div class=\"meta\"><span class=\"pill " + esc(item.confidence) + "\">" + esc(item.confidence) + "</span><span class=\"pill muted\">" + esc(item.evidenceClass) + "</span>" + analysis + "<span class=\"count\">" + (idx + 1) + " of " + total + "</span></div><h3>" + esc(item.title) + "</h3>" + orig + "<p>" + esc(item.body) + "</p>" + quote + watch + "<p class=\"src\"><a href=\"" + esc(item.sourceUrl) + "\">" + esc(item.sourceLabel) + "</a></p></article>";
}

function page(digest, dates, isToday) {
  const words = wordCount(digest);
  const mins = Math.max(1, Math.round(words / 160));
  const i = dates.indexOf(digest.date);
  const prev = i > 0 ? dates[i - 1] : null;
  const next = i < dates.length - 1 ? dates[i + 1] : null;
  let sections = "";
  for (const pair of SECTIONS) {
    const items = digest.items.filter((it) => it.section === pair[0]);
    if (!items.length) continue;
    sections += "<section><h2>" + esc(pair[1]) + " <span>" + items.length + "</span></h2>";
    items.forEach((it, n) => { sections += itemCard(it, n, items.length); });
    sections += "</section>";
  }
  const radar = (digest.radar ?? []).map((r) => "<li>" + esc(r.date) + " " + esc(r.label) + "</li>").join("");
  const fails = (digest.fetchFailures ?? []).map((f) => "<li>" + esc(f.source) + " — " + esc(f.detail) + "</li>").join("");
  const prevA = prev ? "<a href=\"" + (isToday ? "d/" + prev + ".html" : prev + ".html") + "\">Previous</a>" : "<span>Previous</span>";
  const nextA = next ? "<a href=\"" + (isToday ? "d/" + next + ".html" : next + ".html") + "\">Next</a>" : "<span>Next</span>";
  const todayA = isToday ? "" : "<a href=\"../index.html\">Today</a>";
  const jsonA = "<a href=\"" + (isToday ? "briefing/latest.json" : "../briefing/latest.json") + "\">JSON</a>";
  return "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/><title>Rainmaker Watch</title><style>html,body{margin:0;background:#0b0c0a;color:#e8e2d4;font:16px/1.5 Georgia,serif}header,main,footer{max-width:42rem;margin:0 auto;padding:1.25rem 1.1rem}h1{font-size:2.4rem;font-weight:500}.stats,.kicker,footer{color:#8a8578}.card{background:#141510;border:1px solid #2a2c26;padding:1rem;margin:0 0 .9rem}nav a,nav span{border:1px solid #2a2c26;padding:.4rem .7rem;margin-right:.4rem;color:#e8e2d4;text-decoration:none}.confirmed{background:#9ec27a;color:#0b0c0a;padding:.1rem .35rem}.reported{background:#d4b56a;color:#0b0c0a;padding:.1rem .35rem}a{color:#c5d4a4}</style></head><body><header><div class=\"kicker\">RAINMAKER WATCH</div><h1>" + esc(fmtDate(digest.date)) + "</h1><p class=\"stats\">07:00 CET · " + (digest.scanned ?? "-") + " scanned to " + digest.admitted + " admitted · " + words + " words · ~" + mins + " min</p><nav>" + prevA + nextA + todayA + jsonA + "</nav></header><main>" + (sections || "<p>No items admitted.</p>") + (radar ? "<section><h2>Radar</h2><ul>" + radar + "</ul></section>" : "") + (fails ? "<section><h2>Coverage</h2><ul>" + fails + "</ul></section>" : "") + "</main><footer>https://github.com/plykov/Rainmaker</footer></body></html>";
}

const loaded = loadDigests();
if (!loaded.latest) {
  console.error("No digest JSON with items found in public/briefing");
  process.exit(1);
}
mkdirSync(join(outDir, "d"), { recursive: true });
mkdirSync(join(outDir, "briefing"), { recursive: true });
const latestDigest = loaded.byDate.get(loaded.latest);
writeFileSync(join(outDir, "index.html"), page(latestDigest, loaded.dates, true));
writeFileSync(join(outDir, "404.html"), page(latestDigest, loaded.dates, true));
for (const date of loaded.dates) {
  writeFileSync(join(outDir, "d", date + ".html"), page(loaded.byDate.get(date), loaded.dates, false));
  writeFileSync(join(outDir, "briefing", date + ".json"), JSON.stringify(loaded.byDate.get(date), null, 2));
}
writeFileSync(join(outDir, "briefing", "latest.json"), JSON.stringify(latestDigest, null, 2));
writeFileSync(join(outDir, ".nojekyll"), "");
console.log("built " + loaded.dates.length + " edition(s); latest=" + loaded.latest);
