#!/usr/bin/env node
/**
 * Cheap poller for GitHub *releases* on the structural watchlist.
 * Writes ingest/latest.json only when a new stable tag appears.
 * Grok then runs via the plykov/Rainmaker push_to_branch automation.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const WATCH = [
  { repo: "vllm-project/vllm", cls: "serving" },
  { repo: "ggml-org/llama.cpp", cls: "serving" },
  { repo: "huggingface/transformers", cls: "framework" },
  { repo: "sgl-project/sglang", cls: "serving" },
  { repo: "deepseek-ai/FlashMLA", cls: "kernel" },
  { repo: "deepseek-ai/DeepEP", cls: "kernel" },
  { repo: "deepseek-ai/DeepGEMM", cls: "kernel" },
];

const UA = "plykov-rainmaker-structural (github.com/plykov/Rainmaker)";

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const seenPath = resolve(arg("--seen", "ingest/seen.json"));
const outPath = resolve(arg("--out", "ingest/latest.json"));

function loadSeen() {
  if (!existsSync(seenPath)) return { bootstrapped: false, ids: [] };
  try {
    return JSON.parse(readFileSync(seenPath, "utf8"));
  } catch {
    return { bootstrapped: false, ids: [] };
  }
}

async function releases(repo) {
  const url = `https://api.github.com/repos/${repo}/releases?per_page=5`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": UA,
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
    },
  });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`${repo} ${res.status} ${await res.text()}`);
  const rows = await res.json();
  if (!Array.isArray(rows)) return [];
  return rows.filter((r) => r && !r.draft);
}

function idOf(repo, rel) {
  return `${repo}@${rel.tag_name}`;
}

function item(repo, cls, rel) {
  const body = String(rel.body ?? "").replace(/\r\n/g, "\n").trim();
  return {
    repo,
    class: cls,
    tag: rel.tag_name,
    name: rel.name || rel.tag_name,
    prerelease: Boolean(rel.prerelease),
    published: rel.published_at,
    url: rel.html_url,
    body: body.slice(0, 1800),
  };
}

const seen = loadSeen();
const known = new Set(seen.ids);
const fresh = [];

for (const { repo, cls } of WATCH) {
  const rels = await releases(repo);
  for (const rel of rels) {
    const id = idOf(repo, rel);
    if (known.has(id)) continue;
    known.add(id);
    fresh.push(item(repo, cls, rel));
  }
}

const bootstrapping = !seen.bootstrapped;
if (!bootstrapping && fresh.length === 0) {
  console.log("quiet · no new releases");
  process.exit(0);
}

const payload = {
  at: new Date().toISOString(),
  bootstrapped: true,
  items: bootstrapping ? [] : fresh,
};

mkdirSync(dirname(outPath), { recursive: true });
mkdirSync(dirname(seenPath), { recursive: true });
writeFileSync(
  seenPath,
  JSON.stringify({ bootstrapped: true, ids: [...known].sort() }, null, 2) + "\n",
);
writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n");

if (bootstrapping) {
  console.log(`bootstrap ${known.size} ids · no Grok payload`);
  process.exit(0);
}
console.log(`new ${fresh.length}: ${fresh.map((i) => `${i.repo}@${i.tag}`).join(", ")}`);
