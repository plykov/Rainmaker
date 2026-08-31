export type Confidence = "confirmed" | "reported" | "unverified";
export type Lane = "fact" | "analysis";
export type SectionId =
  | "lede"
  | "critical"
  | "leaks"
  | "words"
  | "research"
  | "china"
  | "trend"
  | "radar";

export type PersonGroup = "executive" | "technical" | "analyst";
export type PersonTier = 1 | 2 | "watch";

export interface Person {
  id: string;
  name: string;
  nameNative?: string;
  role: string;
  org: string;
  group: PersonGroup;
  tier: PersonTier;
  added?: "v2";
  corrected?: boolean;
  bio: string;
  emits: string[];
  site?: string;
  x?: string;
  pairWith?: string[];
  chinaDesk?: boolean;
  aliases?: string[];
}

export type EvidenceClass =
  | "first-party"
  | "first-party transcript"
  | "first-party newsletter"
  | "regulatory filing"
  | "official gazette"
  | "structural trace"
  | "named outlet"
  | "preprint"
  | "cn source"
  | "analyst"
  | "synthesis";

export interface Quote {
  text: string;
  attribution: string;
  timestamp?: string;
  check: "pass" | "fail";
}

export interface Scores {
  novelty: number;
  authority: number;
  consequence: number;
}

export interface DigestItem {
  id: string;
  date: string;
  section: SectionId;
  title: string;
  body: string;
  watchNext?: string;
  quote?: Quote;
  originalHeadline?: string;
  confidence: Confidence;
  lane: Lane;
  scores?: Scores;
  evidenceClass: EvidenceClass;
  sourceLabel: string;
  sourceUrl: string;
  people: string[];
  lab?: string;
  model?: string;
  humanGated?: boolean;
  confirmsIf?: string;
  diesIf?: string;
  paywalled?: boolean;
  outlet?: string;
}

export interface RadarEvent {
  date: string;
  label: string;
  kind: string;
}

export interface FetchFailure {
  source: string;
  detail: string;
}

export interface Digest {
  date: string;
  weekdayNote?: string;
  scanned: number;
  passedRules: number;
  triaged: number;
  admitted: number;
  merged: number;
  quoteBlocked: number;
  ledeAbsent?: boolean;
  specimen?: boolean;
  humanHeld: { leak: number; regulation: number; releasedAt?: string };
  fetchFailures: FetchFailure[];
  nextAudit: string;
  rumorScorecardDue?: string;
  items: DigestItem[];
  radar: RadarEvent[];
}

export type SourceClass =
  | "primary"
  | "structural"
  | "journalistic"
  | "analytical"
  | "community"
  | "china";

export interface MonitorSource {
  id: string;
  name: string;
  covers: string;
  feed: string;
  why: string;
  klass: SourceClass;
  caveat?: string;
  health: "ok" | "degraded" | "down";
  healthNote?: string;
}

export interface RumorRow {
  id: string;
  flagged: string;
  claim: string;
  outcome: string;
  status: "confirmed" | "killed" | "open";
  lag: string;
  trust: "up" | "down" | "flat";
}

export interface AuditRow {
  id: string;
  item: string;
  inDigest: boolean;
  inImportAI: boolean;
  inZvi: boolean;
  note: string;
}

export interface Citation {
  outlet: string;
  title: string;
  url: string;
}