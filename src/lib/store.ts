import { create } from "zustand";
import { persist } from "zustand/middleware";

type FontScale = "sm" | "md" | "lg";
export type QueueDecision = "released" | "held" | "killed";

interface ReaderState {
  readItems: string[];
  bookmarks: string[];
  readDigests: string[];
  fontScale: FontScale;
  helpOpen: boolean;
  queueDecisions: Record<string, QueueDecision>;
  toggleRead: (id: string) => void;
  toggleBookmark: (id: string) => void;
  markDigestRead: (date: string) => void;
  setFontScale: (s: FontScale) => void;
  setHelpOpen: (open: boolean) => void;
  setQueueDecision: (id: string, decision: QueueDecision) => void;
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
    }),
    { name: "rainmaker-reader", skipHydration: true },
  ),
);
