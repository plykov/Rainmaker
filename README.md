# AI Rainmaker Watch

Who actually moves the AI field, where they speak first, and how to compress all of it into one daily page you can read in four minutes.

Daily briefing at 07:00 CET. Multiplicative admission (novelty × authority × consequence). Facts and analysis never merge. China desk is first-class. Automation proposes leak and regulation items; a human gate publishes them.

## Product

- **Today / Archive** — the four-minute issue, coverage footer, radar
- **Roster** — rainmakers, qualifying tests, watchlist, exclusions
- **Sources** — X List, Chinese aliases, working set
- **Pipeline** — cascade, scorer, dropped pile, quote check, Monday audit
- **Desk** — morning human gate; released items join today’s page when Delivery stamps it
- **Delivery** — 07:00 publish in place, mail client send, live fetch probe
- **Method** — how the design was adjudicated
- **Specimen** — §05 format sample (placeholder content, not reporting)

Design notes live in [`docs/design.md`](docs/design.md).

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
