import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProbeRun } from "@/lib/data/probes";

type FontScale = "sm" | "md" | "lg";
export type QueueDecision = "released" | "held" | "killed";

export interface Edition {
  date: string;
  at: string;
  label: string;
  queueIds: string[];
  admitted: number;
}

export type SendVia = "mailto" | "copy" | "share";

export interface SendRecord {
  date: string;
  at: string;
  label: string;
  via: SendVia;
  subject: string;
}

interface ReaderState {
  readItems: string[];
  bookmarks: string[];
  readDigests: string[];
  fontScale: FontScale;
  helpOpen: boolean;
  queueDecisions: Record<string, QueueDecision>;
  editions: Record<string, Edition>;
  sends: SendRecord[];
  probe: ProbeRun | null;
  toggleRead: (id: string) => void;
  toggleBookmark: (id: string) => void;
  markDigestRead: (date: string) => void;
  setFontScale: (s: FontScale) => void;
  setHelpOpen: (open: boolean) => void;
  setQueueDecision: (id: string, decision: QueueDecision) => void;
  publishEdition: (edition: Edition) => void;
  recordSend: (row: SendRecord) => void;
  setProbe: (run: ProbeRun) => void;
  patchProbeResult: (row: ProbeRun["results"][number]) => void;
}

export const useReader = create<ReaderState>()(
  persist(
    (set) => ({
      readItems: [],
      bookmarks: [],
      readDigests: [],
      fontScale: "md",
      helpOpen: false,
      queueDecisions: {},
      editions: {},
      sends: [],
      probe: null,
      toggleRead: (id) =>
        set((s) => ({
          readItems: s.readItems.includes(id)
            ? s.readItems.filter((x) => x !== id)
            : [...s.readItems, id],
        })),
      toggleBookmark: (id) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(id)
            ? s.bookmarks.filter((x) => x !== id)
            : [...s.bookmarks, id],
        })),
      markDigestRead: (date) =>
        set((s) => ({
          readDigests: s.readDigests.includes(date)
            ? s.readDigests
            : [...s.readDigests, date],
        })),
      setFontScale: (fontScale) => set({ fontScale }),
      setHelpOpen: (helpOpen) => set({ helpOpen }),
      setQueueDecision: (id, decision) =>
        set((s) => ({
          queueDecisions: { ...s.queueDecisions, [id]: decision },
        })),
      publishEdition: (edition) =>
        set((s) => ({
          editions: { ...s.editions, [edition.date]: edition },
        })),
      recordSend: (row) =>
        set((s) => ({
          sends: [row, ...s.sends].slice(0, 24),
        })),
      setProbe: (probe) => set({ probe }),
      patchProbeResult: (row) =>
        set((s) => {
          if (!s.probe) return s;
          return {
            probe: {
              ...s.probe,
              results: s.probe.results.map((r) => (r.id === row.id ? row : r)),
            },
          };
        }),
    }),
    { name: "rainmaker-reader", skipHydration: true },
  ),
);
