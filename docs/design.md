Monitoring system design · v2, adjudicated across five inputs

AI Rainmaker Watch
Who actually moves the AI field, where they speak first, and how to compress all of it into one daily page you can read in four minutes.

Revised 29 Aug 2026
Inputs 4 model reports + v1, deduplicated to 3
Cadence Daily, 07:00 CET
Status Design, not yet built
00
Review of the source reports
Two of the four inputs are the same document
The reports labelled Z.ai and Gemini are byte-identical — same heading, same scope note, same "early 2025" self-dating, same typos. This is the finding with the largest downstream consequence: the ensemble is n=3, not n=4, and every point where "two independent models agreed" involves that pair is fake corroboration. Worth establishing whether it was a paste error or an upstream routing collapse before the next adversarial run.

Scorecard
Report	Currency	Architecture	Epistemics	Net verdict
DeepSeek	Poor — 2024/25 vintage	Thin	Good instincts, no mechanism	Weakest. Two ideas worth keeping; roster discarded entirely.
Z.ai / Gemini (identical)	Poor — self-dated early 2025	Best of the four	Strong — quote-check, rumor scorecard	Stale roster, outstanding pipeline. Mine the architecture, drop the people.
Grok	Best — genuinely Aug 2026	Good, unpriced	Mixed — sample digest breaks spec	Most accurate on facts. Four unique claims, all four verified.
Claude v1	Good, two misses	Good, priced	Strong — only report with a recall audit	Missed Karpathy→Anthropic and the X List cost lever.
Specific failures found
Stale
Three of four reports describe a world that no longer exists

DeepSeek's report has Igor Babuschkin as xAI technical lead (he left in 2025), Yann LeCun as Meta's Chief AI Scientist (he left in November 2025 to found AMI Labs), and no awareness of the SpaceX–xAI merger. The Z.ai/Gemini document has Hassabis as DeepMind CEO (he moved to Alphabet chief scientist on 5 Aug 2026) and Jeff Dean as Google chief scientist (he left the same week). Both frame Machines of Loving Grace (Oct 2024) as Amodei's flagship essay, superseded twice over in 2026. All of this would have been caught by a currency pass; none of them ran one.

Spec break
DeepSeek's sample digest is behind reality, not ahead of it

It offers "GPT-5.5" and "Claude 4.5" as illustrative future events. GPT-5.6 shipped in July 2026 and Opus 4.7 in April. Its "xAI raises $10B at $80B valuation" understates the actual $1.25T merger by more than an order of magnitude. A sample digest that reads as stale on the day it is written signals the whole roster is untrustworthy.

Spec break
Grok's sample digest isn't placeholder content

The brief asked for realistic placeholders. Grok instead published named individuals and specific claims (an OpenAI infrastructure departure, an Anthropic general-counsel appointment) as though reported. That is the most dangerous failure mode in this whole exercise — an illustrative artifact that launders unverified specifics into your working memory. Its own confidence tags are applied inconsistently, which makes it worse rather than better.

Broken math
The Z.ai/Gemini digest format cannot fit inside its own word budget

Eleven fixed sections × 3–6 items = up to 60 items, against a stated 600–900 word cap. That is ten words per item. Its scoring is also purely additive (Impact 40 / Novelty 20 / Credibility 20 / Reach 10 / Actionability 10), so a high-reach, zero-novelty recap can clear the threshold on reach and impact alone — precisely the item class a digest exists to exclude.

Shared gap
Only one of the five inputs measures recall

Every report optimises precision — scoring, filtering, dedup, thresholds. None except v1 proposes any mechanism for detecting what the pipeline silently dropped. A digest that misses the day's biggest story looks identical to a perfect one. This is the shared blind spot across all four external models and it is retained as a first-class component below.

What each report contributed that survived
Element	Origin	Why it won
X List timeline polling	Z.ai/Gemini	One API call covers ~100 handles instead of ~100 calls. Single largest cost lever anyone found; it substantially dissolves the X-pricing problem v1 flagged as the budget's swing factor.
Bluesky Jetstream firehose	Z.ai/Gemini	Free, streaming, and now hosts a real share of the research community. Genuine partial substitute for paid X reads.
Techmeme as an importance filter	Z.ai/Gemini	Outsources ranking to human editors at zero cost. Elegant — it is a free prior on what matters.
CAC 生成式AI备案 filing lists	Z.ai/Gemini	Chinese model registrations pre-announce launches. A structural leak channel v1 missed completely.
Chinese-character entity matching	Z.ai/Gemini	梁文锋 / 唐杰 / 智谱 ↔ Zhipu ↔ Z.ai. Obvious in hindsight; a pipeline without it silently drops the entire China desk.
Verbatim-quote existence check	Z.ai/Gemini	Automated verification that a quoted string actually appears in the source. Falsifiable anti-hallucination gate, not a hopeful prompt.
Rumor-vs-outcome scorecard	Z.ai/Gemini	Tracks flagged rumors against what actually happened, decaying source trust. Makes the system improve rather than drift.
Facts lane / analysis lane split	Grok	Structurally prevents the model turning a rumor into a reported event. Stronger than a labelling convention because the lanes never merge.
Human gate on leak + regulation	Grok	Automation proposes; it does not publish unreviewed national-security or unreleased-model claims. Correct on both risk and liability.
Per-person daily item cap	Grok	Stops Musk's volume dominating any engagement-weighted ranker. Concrete and immediately implementable.
Strict extraction prompt	DeepSeek	"Do not add outside knowledge; mark anything unverified explicitly." Terse, and the single best line in that report.
Weekly recall audit	Claude v1	The only proposed instrument that measures what the pipeline missed.
Structural-trace leak layer	Claude v1	API docs diffs, model-ID strings, job reqs, HF commits. Grok's verified Ox Alpha episode is a textbook instance of exactly this channel.
Rejected outright: the 11-section digest, purely additive scoring, ~100-handle watchlists, emoji section markers, and every roster entry in the DeepSeek report.

01
Key rainmakers in AI
Reasoning — four tests, at least three to qualify
Causal power. Can this person's decision change what ships, what is funded, or what is legal?
Signal frequency. Do they emit anything monitorable at all?
Lead time. Do they say things before the press reports them? This is the only justification for monitoring individuals rather than reading TechCrunch.
Non-redundancy. If removing them changes nothing about what you learn, they are noise.
Split into three functions, because they fail differently: executives give intent, technical principals give capability, analysts give interpretation. Two structural changes from v1, both adopted from the review above: the roster now separates operating from research authority where a lab has split them (Grok's argument for Daniela Amodei and for Brockman/Chen alongside Altman), and it carries a China desk as a first-class function rather than as two names inside a Western list.

A. Lab principals and executives
Dario Amodei
CEO, Anthropic
Tier 1
Writes long-form policy essays that set the terms of the safety-versus-acceleration debate; Anthropic's product and government posture follows them. 2026 output — "The Adolescence of Technology" and June's "Policy on the AI Exponential" — drove weeks of coverage. The June IPO filing plus reported supervoting-share plans make his disclosures newly material.

Emits: darioamodei.com · Anthropic newsroom · testimony · long-form podcasts

Daniela Amodei
President, Anthropic
Added v2
Runs the operating company; the executive stack reports to her, not to Dario. Grok's report is right that tracking only the CEO misses hiring, commercial deals, legal, and IPO execution at a lab now reportedly structuring dual-class shares ahead of listing. The split is the org design, not a formality.

Emits: Anthropic newsroom · press interviews · IPO filings when public

Sam Altman
CEO, OpenAI
Tier 1
Highest-frequency executive signal and the one most likely to pre-leak a launch in a one-line post. In July 2026 he briefed US lawmakers on the next model and pushed public release of GPT-5.6 after government-requested limits ended — visible on X days before formal coverage.

Emits: @sama · OpenAI blog · Washington appearances · TIME/CNBC interviews

Greg Brockman · Mark Chen
President · Chief Research Officer, OpenAI
Added v2
Carried as a pair on Grok's argument: after the 2026 reorg, Brockman owns large parts of product and infrastructure while Chen owns the research stack. Launch-day technical threads from Brockman routinely contain detail the blog post omits. Monitoring Altman alone misses where OpenAI actually ships.

Emits: @gdb launch threads · OpenAI research posts · a16z/MIT TR podcasts

Elon Musk
SpaceXAI (xAI + SpaceX)
Tier 1
Since the ~$1.25T merger completed in early 2026 he controls a listed entity whose model announcements he makes personally, usually with pricing attached — Grok 4.5's July release at $2/$6 per million tokens was announced by him directly. Highest volume, worst signal-to-noise of anyone on this list; the per-person daily cap in §4 exists specifically for him.

Emits: @elonmusk (filtered) · SpaceXAI releases · earnings calls (new, post-IPO)

Liang Wenfeng 梁文锋
Founder & CEO, DeepSeek
Tier 1
The most consequential person in AI who almost never speaks on the record — and, as of mid-2026, the clearest proof that the leak layer matters. His closed-door investor briefing leaked in late July and the reaction paused an ~$8B fundraise before it resumed. DeepSeek otherwise communicates through artifacts: V4-Pro (1.6T) and V4-Flash (284B) shipped to Hugging Face in April 2026 with no press tour.

Emits: HF org commits · arXiv · leaked transcripts via Chinese outlets · no social account

Zhang Peng 张鹏 · Tang Jie 唐杰
CEO · Co-founder/scientific lead, Z.ai
Tier 1
Tracked as a pair. Zhang runs the first pure LLM company to list (HKEX 2513, Jan 2026), producing filings and analyst calls — a rare structured window into a Chinese frontier lab. Tang sets the research thesis and publishes in the open. Z.ai's August reveal that the anonymous "Ox Alpha" arena model was GLM-5.3-Flash, served on Chinese silicon, is the single best worked example of the stealth-benchmark channel in §2.

Emits: HKEX filings · z.ai blog · HF/GitHub (THUDM) · WeChat 公众号 · arXiv

Demis Hassabis
Chief Scientist, Alphabet · Chairman, Google DeepMind
Tier 1
Stepped aside as DeepMind CEO on 5 Aug 2026 for an Alphabet-wide AGI role, with Koray Kavukcuoglu taking operational control and Jeff Dean leaving the same week to found a startup. That makes Google's AI org the most volatile chart in the field and Hassabis the person whose statements reveal where Alphabet is actually pointing.

Emits: @demishassabis · DeepMind blog · Nature/Science · keynotes

Ilya Sutskever
Co-founder & CEO, Safe Superintelligence
Tier 2
Near-zero output, every emission high-value. The readable signal is infrastructure: a reported ~$5B Nvidia investment in July 2026 and a shift off Google TPUs onto GPUs. Track the company's supply-chain footprint, not his silent accounts.

Emits: rare interviews · SSI announcements · vendor/partner press

Mira Murati
CEO, Thinking Machines Lab
Tier 2
Included for talent-flow signal rather than model signal. The January 2026 senior-departure wave and the subsequent Nvidia compute deal make the lab a leading indicator of where OpenAI-lineage researchers will go and what compute is priced at. Its careers page reveals research direction before papers do.

Emits: company blog · careers page · press · researcher accounts

Watchlist without daily coverage: Koray Kavukcuoglu (now runs DeepMind), Jeff Dean (new venture), Jakub Pachocki (OpenAI chief scientist), Alexandr Wang & Shengjia Zhao (Meta MSL), Yang Zhilin 杨植麟 (Moonshot/Kimi), Junyang Lin 林俊旸 (Alibaba Qwen), Arthur Mensch (Mistral), Jensen Huang (compute supply).

B. Technical principals — capability signal
Andrej Karpathy
Pre-training, Anthropic (since May 2026)
Added v2
The most important correction to v1, and Grok was the only report to catch it. Until May 2026 he was an unaffiliated educator; he now works on Claude pre-training, which converts a four-million-follower explainer account into an insider one. He is simultaneously the field's best teacher and, by position, leak-adjacent — a combination nobody else on this list has.

Emits: @karpathy · YouTube deep dives · karpathy.ai · Anthropic research

Jakub Pachocki
Chief Scientist, OpenAI
Tier 1
Owns OpenAI's research roadmap, framed publicly around an "automated scientist" rather than consumer features. To know what OpenAI optimises for in 2027, his framing is the primary source; the product blog is downstream of it.

Emits: OpenAI research posts · a16z and MIT TR podcasts

Jared Kaplan
Chief Science Officer, Anthropic
Tier 1
Co-author of the original scaling-laws work; his public reasoning predicts Anthropic's next capability step more reliably than any launch post. Technical talks consistently carry more information than the corresponding announcement.

Emits: Anthropic research · arXiv · university and conference talks

Chris Olah
Co-founder, interpretability lead, Anthropic
Tier 1
Interpretability is where "we can see inside the model" claims translate into regulatory and deployment consequences. His team publishes the work that policy arguments then cite, including results attached to the restricted Mythos model.

Emits: transformer-circuits.pub · @ch402 · Anthropic research

Jack Clark
Co-founder & Head of Policy, Anthropic · Import AI
Tier 1
The rare dual-hatted figure all three surviving reports independently flagged: a lab principal who also writes the weekly that lab researchers actually finish. He signals policy positions in the newsletter before they appear in formal submissions, which is real lead time from an insider.

Emits: Import AI (weekly) · @jackclarkSF · testimony

Noam Brown
OpenAI — reasoning & self-play
Tier 2
The test-time-compute agenda he champions is the mechanism behind most 2025–26 capability jumps. Explains results in detail and is unusually willing to correct overclaims, including other labs' — which makes him a calibration source, not just a signal source.

Emits: @polynoamial · NeurIPS/ICML talks · OpenAI research

C. Analysts and opinion leaders
Dylan Patel
SemiAnalysis
Tier 1
Best source on the physical layer — chips, fabs, datacenter power, real training costs. Compute commitments are the least deniable form of strategy disclosure, and his numbers are cited inside the labs. Unanimous Tier 1 across every surviving report.

Emits: semianalysis.com (paywalled) · @dylan522p · podcasts

Nathan Lambert
Ai2 · Interconnects
Tier 1
The most rigorous public analyst of open-weight models and post-training, usually publishing within hours of a release. Since the open-weight frontier is now largely Chinese, he is the translation layer for the half of the field that does not do press releases.

Emits: interconnects.ai (RSS) · @natolambert · Ai2 releases

Simon Willison
Independent · simonwillison.net
Tier 1
Fastest reliable hands-on verdict on any new model, usually within hours, always with reproducible examples. The practical antidote to benchmark theatre: if a release is less impressive than claimed, his post is where you find out first. Clean RSS, no paywall.

Emits: simonwillison.net (RSS, near-daily) · @simonw · llm CLI notes

Dwarkesh Patel
Dwarkesh Podcast
Tier 1
The venue where lab principals put timelines and FLOP math on the record. Low frequency, extremely high per-item value — a single episode routinely produces a week of secondary coverage. Publishes full transcripts, so automated extraction is trivial.

Emits: dwarkesh.com (RSS + transcripts) · YouTube · @dwarkesh_sp

Jordan Schneider
ChinaTalk
Tier 1
Covers the seam where Chinese AI capability meets export controls and industrial policy, and publishes translations of primary Chinese sources. Without him the DeepSeek and Z.ai monitoring in §2 is context-free.

Emits: chinatalk.media (RSS) · podcast · translated primary documents

Yann LeCun
AMI Labs (since Nov 2025) · NYU
Corrected
Two reports still place him at Meta. He left in November 2025 and raised roughly $1B for world-model research, which makes him more valuable, not less: he is now the most credible institutional bet against the LLM-scaling consensus, with capital behind the dissent rather than just a posting habit.

Emits: @ylecun (daily) · AMI Labs announcements · talks and papers

Ethan Mollick
Wharton · One Useful Thing
Tier 2
Best read on enterprise adoption reality — what organisations actually do with these systems versus what vendors claim. A hedge against a digest that tracks capability and ignores diffusion.

Emits: oneusefulthing.org (RSS) · papers · @emollick

Zvi Mowshowitz
Don't Worry About the Vase
Tier 2
Exhaustive weekly roundups that function as a recall safety net rather than a daily input. He is an instrument in this design, not a feed: §3's Monday audit diffs your week against his to measure what the pipeline dropped.

Emits: thezvi.substack.com (RSS, very long) · LessWrong

Deliberately excluded — and why
Gary Marcus (in three of four reports): the position is stable and known, so daily monitoring adds no information — sample quarterly instead. Andrew Ng, Fei-Fei Li, Geoffrey Hinton, Timnit Gebru: genuinely important, but on a weekly-to-quarterly cadence; putting them in a daily filter costs precision and buys nothing. ~100-handle X lists (Z.ai/Gemini): with list polling the API cost is no longer the constraint, but filter precision is — every added name dilutes it. Most VC commentators and LinkedIn AI influencers: zero lead time, downstream of names already here.

02
Monitoring sources
Reasoning — group by evidence class, and give China its own desk
Listing sources by platform produces a pipeline that breaks when a platform changes its API. Grouping by what kind of claim a source can support determines how much verification each item needs downstream. Five classes: primary (the subject's own words), structural (machine-readable traces they did not intend as communication — where real leaks live), journalistic, analytical, and community (a tip line that triggers verification, never a digest item on its own).

The China desk is promoted to a first-class layer on the Z.ai/Gemini argument, and the events of the last four months settle it: the Liang investor-briefing leak surfaced in Chinese outlets, and Ox Alpha ran anonymously on an English-language leaderboard for days before Z.ai claimed it. Monitoring these labs through Western sources alone costs 24–72 hours.

Tier 1 — Primary and first-party
Source	Covers	Feed	Why it earns a slot
Lab newsrooms	anthropic.com/news, openai.com/news, deepmind.google, x.ai/news, z.ai/blog, DeepSeek API docs	RSS / scrape	Canonical launch text and model cards. Zero ambiguity, zero lead time — the baseline everything else is measured against.
Personal sites	darioamodei.com, simonwillison.net, karpathy.ai, natolambert.com, transformer-circuits.pub	RSS	Where principals say what corporate comms will not. Cheap to poll, high hit rate.
X — one curated List	~35 Tier-1 handles in a single List	List timeline API	One call returns the whole List. This is the cost fix: it turns dozens of per-account polls into a single request and removes X pricing as the budget's dominant term.
Bluesky	Researcher starter packs, author filter	Jetstream (free)	Free streaming firehose hosting a real share of the research community. Partial substitute for paid X reads; costs nothing to run in parallel.
Podcasts w/ transcripts	Dwarkesh, Latent Space, ChinaTalk, a16z, Lex Fridman	RSS + Whisper	Long-form is where unguarded statements happen; transcripts make them machine-processable.
Substacks	Import AI, Interconnects, ChinaTalk, One Useful Thing, Don't Worry About the Vase	RSS	Structured free feeds from named experts. Highest value per euro in the entire stack.
Tier 2 — Structural traces (the leak layer)
Source	What it reveals	Feed	Why it earns a slot
Hugging Face orgs	deepseek-ai, zai-org/THUDM, Qwen, moonshotai, meta-llama, allenai	HF API / webhook	Chinese labs ship first and announce later, or never. A new repo or config bump can lead coverage by hours.
Benchmark boards	LMArena, Artificial Analysis, LiveBench, SWE-bench, ARC-AGI, OpenRouter rankings	Scrape / API	Anonymous stealth entries are a proven pre-release tell — the Ox Alpha model sat on the arena under a codename before Z.ai claimed it as GLM-5.3-Flash.
CAC 生成式AI备案	Chinese generative-model registration lists	Scrape + MT	Regulatory filing that pre-announces Chinese model launches. Free, official, and almost entirely absent from English coverage.
arXiv	cs.AI, cs.CL, cs.LG filtered by author	RSS + API	Author-triggered alerts on the §1B list turn a firehose into a precision instrument.
GitHub	Releases and PR titles on lab repos and inference frameworks (vLLM, llama.cpp, transformers)	Atom / webhook	Support for an unreleased architecture landing in vLLM is a hard, falsifiable pre-announcement.
Regulatory & financial filings	SEC EDGAR (Anthropic S-1 when public, SpaceXAI), HKEX 2513	EDGAR / HKEX API	Legally binding disclosure — the highest-confidence class that exists, and newly relevant with three of these firms public or filing.
Court dockets	CourtListener RECAP — copyright and lab-vs-lab litigation	RECAP API	Filings are authoritative, free, and routinely ignored by daily press. Discovery documents surface internal facts nothing else will.
API surface diffs	Model lists, pricing pages, docs changelogs, status pages	Diff-on-poll	Model IDs appear in API responses before launch posts. Cheap to run, disproportionate hit rate.
Job postings	Careers pages of all §1 orgs	Scrape	Headcount by team is a strategy disclosure; a robotics or biosecurity req cluster precedes the announcement by a quarter.
Tier 3 — Journalistic, China desk, community
Source	Role	Feed	Caveat
Techmeme	Human-edited ranking of the day's tech stories	RSS	Free importance prior — outsources ranking to editors. Use as a scoring input, not a content source.
The Information	Deepest lab-internal scoops — org charts, share structures, unreleased models	RSS (titles)	Hard paywall. Carry headline + link only unless licensed; never auto-scrape.
Bloomberg / Reuters / FT	Deals, filings, safety-test disclosures	RSS	Metered paywall; summarise from the free lede only.
TechCrunch, Axios, CNBC, The Decoder	Fast confirmation and pricing detail	RSS	Free and reliable for confirming a rumour; weak for originating one.
China desk	36氪/暗涌 Waves, 量子位 QbitAI, 机器之心 Synced, 财联社, Caixin, WeChat 公众号	RSSHub + MT	Frequently 24–72h ahead on Chinese lab news; the Liang briefing leak surfaced here. RSSHub mirrors are brittle — budget a 10-minute manual scan as fallback.
Hacker News, r/LocalLLaMA, LessWrong	Earliest surfacing of repo changes and model oddities	Algolia API / RSS	Tip line only. Never promoted to a digest item without Tier 1 or 2 confirmation.
Working set: ~35 RSS/Atom feeds, one X List of ~35 handles, a Bluesky filter, 8 Hugging Face orgs, 12 GitHub repos, 6 benchmark boards, 5 filing/docket endpoints, 6 careers pages, and a 6-source China desk. Roughly 110 sources — near the ceiling for a one-page daily output.

03
Automation approach
Reasoning — three constraints, one of which changed
X pricing is no longer the swing factor. v1 treated it as the budget's dominant term. With List-timeline polling, one request covers ~35 handles, and the free Bluesky firehose absorbs part of the rest. This is the review's single most useful contribution and it materially changes the recommended build.
Filtering must be cheap and summarisation rare. ~95–110 sources produce 800–1,500 items daily, most irrelevant. Rules and embeddings cost fractions of a cent; frontier synthesis does not. The ratio between them is the biggest remaining cost lever.
Recall failures are invisible; precision failures are not. A digest that misses the day's biggest story looks perfect. Four of five source reports had no mechanism for this at all.
Options assessed
Partial
Managed readers — Feedly AI, Inoreader, F5Bot

Fastest start: paste ~35 feeds and get topic filtering within an hour, for tens of euros a month; F5Bot is free for HN/Reddit keyword alerts. Limits: no X, no Hugging Face, no filings, no cross-source dedup, and no way to express "only if it involves someone on my watchlist." A fallback reader, not the system.

Core
Self-hosted n8n as ingestion and state layer

Handles scheduled polling, RSS/Atom parsing, HTTP calls to HF/GitHub/EDGAR/RECAP, HTML diffing, retries, and a persistent seen-items store. Use r.jina.ai as the fallback reader for pages without RSS. Limits: you own the maintenance and feeds break silently — which is why the fetch-failure footer in §4 is mandatory, not decorative.

Core
Two-stage model cascade, with multilingual dedup

Stage 0 (free): rules — watchlist match including Chinese-character aliases (梁文锋, 唐杰, 智谱 ↔ Zhipu ↔ Z.ai), source allowlist, keyword gate, near-duplicate hashing. Kills 60–75% at zero cost. Stage 1 (cheap): a small fast model scores survivors 0–10 and returns one line of JSON at temperature 0; dedup by MinHash plus multilingual embeddings (BGE-M3 handles Chinese, which English-only embedders do not). Stage 2 (once): top 15–25 items go to a frontier model in a single call so it can rank, merge and connect across sources. Limits: Stage 1 is where recall is lost; tune its threshold against a week of manual review before trusting it.

Core
Two lanes and two hard gates

Three verification mechanisms, adopted wholesale from the review because none of them is a hopeful prompt. Lane separation: facts and analysis are assembled by separate passes and never merged, so the model cannot promote a rumour into a reported event. Quote-existence check: every verbatim quote is string-matched against the fetched source; a miss blocks the item automatically. Human gate: anything tagged leak or regulation is proposed, not published — automation does not ship unreleased-model or national-security claims unreviewed. Extraction prompt is fixed: who, what, when, impact; do not add outside knowledge; mark anything unverified explicitly.

Core
A scheduled Claude task for synthesis and delivery

One recurring task reads the filtered pool, runs Stage 2 with web access to verify borderline claims, renders the digest, and delivers it — also publishing to a stable page that updates in place, so the archive is browsable rather than trapped in email. Run it at 06:40 CET, which is after the Chinese business day has closed, so the China desk is never a day behind. Limits: it should consume a prepared pool, not fetch 110 sources itself.

Avoid
A fully agentic "go read the internet each morning" agent

Non-deterministic coverage, no seen-state, no audit trail of what it skipped, high burn. Use browsing narrowly — to verify one claim during Stage 2 — never as the ingestion strategy.

Recommended build
Layer	Choice	Runs	Est. monthly
Ingestion	n8n self-hosted — RSS, HF, GitHub, EDGAR, RECAP, HTML diff, Jina fallback	every 30 min	€5–15 VPS
X leg	One List timeline, ~35 handles, hourly	hourly	€10–40*
Bluesky leg	Jetstream firehose, author/keyword filter	streaming	€0
Stage 0 filter	Rules + CN aliases + dedup hash	inline	€0
Stage 1 triage	Small fast model, JSON scoring, BGE-M3 dedup	inline	€3–8
Stage 2 synthesis	Frontier model, one call/day, two lanes	06:40 CET	€15–30
Human gate	Review queue for leak + regulation	~5 min/day	your time
Delivery	Email + hosted digest page updated in place	07:00 CET	€0
Weekly audit	Diff your week against Import AI + Don't Worry About the Vase	Mondays	€1
Monthly QA	Rumor-vs-outcome scorecard; decay source trust scores	monthly	€0
*Estimate assumes List polling at roughly 24 calls/day rather than per-handle polling. All X figures remain unverified — third-party pricing guides contradict each other and the free tier was eliminated in February 2026. Price against X's own rate card before committing. Total otherwise lands around €35–95/month, and a v1 running only on RSS, Hugging Face, GitHub and Bluesky costs under €30 and still catches most of what matters.

The failure mode to design against
Every digest of this kind degrades the same way: the filter is tuned toward precision, the output gets cleaner, and it silently stops catching anything you did not already expect. The Monday audit against two independent weekly roundups is the only instrument that measures recall, and the monthly rumor-vs-outcome scorecard is the only one that measures whether your confidence labels mean anything. Skip either for a month and you have a digest you trust and cannot evaluate — which is worse than no digest at all.

04
Daily digest format
Reasoning — design for the four-minute read
Hard caps that actually add up. Twelve items maximum. The Z.ai/Gemini spec's eleven sections at 3–6 items each cannot fit its own 600–900 word budget; caps that contradict the length target are decoration.
Multiplicative admission, not a weighted sum. An item must be non-trivial on all three axes. A purely additive score lets a high-reach, zero-novelty recap clear the bar on reach and impact alone — exactly what a digest exists to exclude.
Sections by evidence type, not by company. Grouping by company forces you to read everything; grouping by confirmed / unconfirmed / analysis lets you skip a block by intent.
Every item carries a confidence label and a link. No link, no item. Unverified claims ship labelled rather than suppressed, because suppressing them is how you learn things two days late.
A quiet day must look quiet. If nothing clears threshold, the digest says so in three lines. A system that manufactures twelve items daily trains you to stop reading it.
Scoring and admission
Score 0–10 on three axes; admit on the product, so a zero on any axis is fatal. Reach — Techmeme placement, HN points, X velocity — is a tiebreaker only, never an admission criterion.

Axis	Question	Scores high	Scores low
Novelty	New information, or a restatement?	First appearance; a number nobody had; a reversal of a stated position	Recap; opinion on a week-old event; listicle
Authority	How strong is the evidence class?	Filing, docket, first-party post, repo commit, named on-record source	Anonymous forum claim; screenshot; aggregator rewrite
Consequence	Does it change a decision, price, capability or rule?	Pricing, licence, availability, regulation, org control, compute	Personnel below VP; funding rumour without terms; benchmark noise
Confidence labels: Confirmed (primary source or filing) · Reported (named outlet, single source) · Unverified (structural trace, anonymous claim — always labelled, never stated flatly).

Section structure and rules
The Lede — exactly one item, or the explicit line "No single dominant story today." Three sentences: what happened, why it matters, what to watch next.
Critical events — cap 4. Confirmed, first-party or filing-grade. Releases, pricing, leadership, regulation, major deals.
Leaks & unconfirmed — cap 3. Everything Reported or Unverified. Each states explicitly what would confirm or kill it. Human-gated before send.
In their own words — cap 3. Interviews, essays, testimony. One-line summary plus the single most consequential quote, attributed, timestamped, and string-verified against the source.
Research & capability — cap 3. Papers from the §1B watchlist plus notable open-weight releases. State the result, not the abstract.
China desk — cap 2. Chinese-language items with the original retained for citation. Present even on quiet days, because absence here usually means a broken feed rather than a quiet day.
Trend line — cap 1, only when justified. Two to three sentences across the past 5–7 days. Analysis lane — assembled separately and visually marked, never mixed into factual sections.
Radar — up to 3 dated upcoming events: earnings, keynotes, hearings, filing deadlines.
Coverage note — machine footer: items scanned, admitted, merged, and every source that failed to fetch.
Standing rules
400–650 words. Above 700, the threshold is too low.
Maximum 3 items per person per day, regardless of score. Without this, Musk's volume dominates any engagement-weighted ranker.
Never two items on the same underlying event; merge and cite both sources.
No item without a named person, lab, or model — this is a people-monitoring system.
Anything from HN, Reddit or an anonymous account is corroborated and promoted, or carried as Unverified. Never stated flatly.
Paywalled scoops: headline, outlet, one-line gist from the free lede, link. Never fabricate the body.
05
Sample daily digest
Placeholder content, real structure. Every bracketed item is illustrative and describes no actual event — the failure mode found in Grok's report, where named individuals and specific claims were presented as reporting inside a "sample", is deliberately avoided here.

AI Rainmaker Watch — Daily

Thu 03 Sep 2026 · 07:00 CET · 1,140 scanned → 11 admitted · read time 3m50s

The Lede
1 of 1

[Key event: a frontier lab ships an agent tier priced per seat rather than per token]

[Two sentences: what shipped, the headline capability claim, and how the pricing model differs from the incumbent per-token standard.] [One sentence on why it matters — e.g. it resets like-for-like comparison across the three frontier providers.] Watch next: [whether competitors respond on price within the week].

Fact
score 9.4
confirmed · first-party
[lab newsroom + @handle 22:41 CET]

Critical events
3 of 4

[Chinese lab files an exchange disclosure covering next-gen training spend]

[The disclosed figure, what it implies about cost-per-capability versus US labs, and the filing date.]

Fact
score 8.7
confirmed · regulatory filing
[exchange ticker]

[EU AI Office opens a transparency proceeding against a frontier provider]

[What the proceeding covers, which obligations are cited, and the response deadline.]

Fact
score 8.2
confirmed · official gazette
[link]

[An open-weight lab publishes new weights with no accompanying announcement]

[Parameter count, licence, what changed per the model card, and elapsed time before any press coverage appeared.]

Fact
score 8.0
confirmed · structural trace
[HF org]

Leaks & unconfirmed
2 of 3 · human-reviewed

[Unreleased model ID appears in an API docs changelog diff]

[The exact string observed, when it appeared and disappeared, what it suggests about naming or tier.] Confirms if: [the ID returns non-404 on the models endpoint, or appears in a model card]. Dies if: [absent from tomorrow's diff and unreferenced by partners].

Fact
unverified
structural trace · single observation
[docs diff 04:12 CET]

[Paywalled outlet reports a senior departure from a frontier lab's safety org]

[Headline, outlet, one-line gist from the free lede only.] [Not independently corroborated; no first-party confirmation at time of writing.]

Fact
reported
single-source · paywalled
[outlet]

In their own words
2 of 3

[Lab principal on a long-form podcast — 2h14m, transcript published]

[Example speech summary: one sentence on the episode's substantive claim.] Key line: "[verbatim quote, string-verified against transcript]" — [timestamp].

Fact
score 7.9
confirmed · first-party transcript
quote check: pass

[Insider newsletter signals a policy position ahead of formal submission]

[One sentence on the position taken and how it differs from the lab's last formal filing.]

Fact
score 7.1
confirmed · first-party newsletter
[link]

Research & capability
1 of 3

[arXiv — watchlist author, long-horizon agent evaluation]

[The actual result in one sentence, with the number.] [One sentence on reproducibility and whether anyone has replicated it.]

Fact
score 6.8
confirmed · preprint, not peer reviewed
[arxiv link]

China desk
2 of 2

[Chinese-language outlet reports a lab roadmap detail absent from English coverage]

[Translated summary in one or two sentences.] [Original-language headline retained for citation; translation spot-checked.]

Fact
score 7.4
reported · CN source, MT + spot-check
[outlet, original + link]

[CAC generative-model registration list adds N entries]

[Which labs appear, and which registered models have not yet been publicly announced.]

Fact
score 6.1
confirmed · regulatory filing
[link]

Trend line — analysis lane
1 of 1

[Emerging trend: pricing converges while licensing diverges]

[Two to three sentences connecting the week's items — e.g. three frontier labs within 20% on per-token price while the open/closed split hardens along national lines.] Interpretation, not reporting. Assembled from the analysis lane; no factual claim in this section is load-bearing.

Analysis
7-day window
synthesis over [named analyst sources]

Radar
3 dated

[Date] — [earnings call or keynote] · [Date] — [regulatory deadline] · [Date] — [conference or expected filing]

COVERAGE — 1,140 scanned · 218 passed rules · 34 triaged ≥6.0 · 11 admitted · 3 merged as duplicates · 1 blocked by quote check
FETCH FAILURES — [x.ai/news 403, 2 days running — check selector] · [RSSHub CN mirror timeout — manual scan used] · [semianalysis paywall, titles only]
GATES — 2 items held for human review (leak) · 0 held (regulation) · both released 06:52 CET
NEXT AUDIT — Mon 07 Sep, against Import AI and Don't Worry About the Vase · rumor scorecard due 01 Oct
✳
Verification note
Verified this session, from the Grok report: Andrej Karpathy joined Anthropic's pre-training team (19 May 2026); Z.ai confirmed "Ox Alpha" as GLM-5.3-Flash running on Chinese GPUs (late Aug 2026); DeepSeek paused a multi-billion fundraise after Liang Wenfeng's investor remarks leaked, and has since resumed it at a reported ~$8B; Anthropic is reported to be preparing supervoting founder shares ahead of IPO. All four checked out — Grok was the most factually accurate of the four inputs.

Verified previously: the Google DeepMind leadership change and Jeff Dean's departure (Aug 2026); SpaceX–xAI merger and Grok 4.5 release and pricing; Anthropic Opus 4.7, restricted Mythos, $965B valuation, June IPO filing; DeepSeek V4-Pro/V4-Flash (Apr 2026); Z.ai HKEX listing and GLM cadence; OpenAI GPT-5.6 and Altman's July congressional briefing; EU AI Act enforcement from 2 August.

Still unverified: all X API pricing, including the revised €10–40 List-polling estimate — it rests on third-party guides that contradict each other, and the List-call arithmetic is my inference, not a quoted rate. Check X's own rate card first. Grok's specific named claims about individual executive appointments and departures were not verified and are excluded from this document entirely. SemiAnalysis revenue is a single secondary report.

Structurally uncertain: handles, feed URLs and affiliations drift, and three of four input reports demonstrate exactly how fast. Resolve and health-check every source in §2 at build time rather than trusting this document — the fetch-failure footer exists because they will break.

§
Sources
TechCrunch — Andrej Karpathy joins Anthropic's pre-training team
Wccftech — Z.ai unmasks "Ox Alpha" as GLM-5.3-Flash
Intelligent Living — Z.ai confirmed as the lab behind Ox Alpha
TNW — DeepSeek pauses fundraising after Liang Wenfeng's leaked comments
PYMNTS — DeepSeek resumes funding round to raise $8 billion
Yahoo Finance / The Information — Anthropic prepares supervoting power for founders
Axios — Google's AI leadership shuffle
9to5Google — Hassabis steps aside; Jeff Dean departs
TechCrunch — SpaceXAI releases Grok 4.5
CNBC — xAI/SpaceX merger valued at $1.25 trillion
Wikipedia — Anthropic (leadership, Mythos, valuation, IPO filing)
Axios — Claude Opus 4.7 and the unreleased Mythos
Dario Amodei — The Adolescence of Technology
CNBC — OpenAI publicly releases GPT-5.6
Bloomberg — Altman briefs US lawmakers
MIT Technology Review — OpenAI's automated-researcher push
Wikipedia — DeepSeek
Wikipedia — Z.ai (founders, GLM cadence, HKEX IPO)
CNBC — Yann LeCun leaves Meta
LeCun's AMI Labs and the world-models thesis
Tech Startups — Nvidia invests in Safe Superintelligence
Fortune — Departures from Thinking Machines Lab
BigGo Finance — SemiAnalysis passes $100M annual revenue
European Commission — AI Act enforcement from 2 August
Xpoz — X API pricing tiers, 2026 (unverified)
OpenTweet — X API pay-per-use rates (unverified)
n8n — RSS monitoring with AI filtering (reference template)