# AI Rainmaker Watch

Who actually moves the AI field, where they speak first, and how to compress all of it into one daily page you can read in four minutes.

Daily briefing at 07:00 CET (Grok automation: email + app). Multiplicative admission (novelty × authority × consequence). Facts and analysis never merge. China desk is first-class. Automation proposes leak and regulation items; a human gate publishes them.

## Product

- **Today / Archive** — the four-minute issue, coverage footer, radar
- **Roster** — rainmakers, qualifying tests, watchlist, exclusions
- **Sources** — X List, Chinese aliases, working set
- **Pipeline** — cascade, scorer, dropped pile, quote check, Monday audit
- **Desk** — morning human gate; released items join today’s page when Delivery stamps it
- **Delivery** — 07:00 Grok send (email + app) and hosted-page stamp
- **Audit** — Monday 08:00 Grok recall vs Import AI / Zvi; rumor scorecard
- **Method** — how the design was adjudicated
- **Specimen** — §05 format sample (placeholder content, not reporting)

Design notes live in [`docs/design.md`](docs/design.md).

## Hosted page (GitHub Pages)

Public daily URL:

**https://plykov.github.io/Rainmaker/**

Loop: 07:00 job writes `public/briefing/YYYY-MM-DD.json` + `latest.json` → push to `main` → workflow `Pages` builds `site/` and deploys.

If that URL 404s, the digest is already in git; Pages itself was never given a publishing source. The Actions job now tries to create the Pages site with `build_type=workflow`. If GitHub still rejects `actions/deploy-pages` with “Ensure GitHub Pages has been enabled”, one repo-admin click remains:

GitHub → Settings → Pages → Source **GitHub Actions**.

Fallback already in the repo: built HTML for the current issue lives in `docs/` and on the `gh-pages` branch (`/` root). You can instead set Source to **Deploy from a branch** → `gh-pages` / root, or `main` / `/docs`. Commits from `GITHUB_TOKEN` do not trigger a branch Pages build; a user push or the Actions deploy path is required.

Local check: `node scripts/build-pages.mjs` writes `site/index.html`.

This GitHub Pages host is the automatic public page. `rainmaker.grok.me` is a separate Grok publish and does not rebuild when the digest changes.

## Run

```bash
npm install
npm run dev
```

```bash
npm run typecheck
npm run build
```

Auth and a shared database are off. Reader state (bookmarks, desk decisions, read marks) stays in the browser.

## Stack

TanStack Start · React 19 · Tailwind v4 · zustand
