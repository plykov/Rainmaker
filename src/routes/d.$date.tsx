import { createFileRoute, notFound } from "@tanstack/react-router";
import { DigestView } from "@/components/digest-view";
import { KeyboardNav } from "@/components/keyboard-nav";
import { ReadingProgress } from "@/components/reading-progress";
import { todayCetDate } from "@/lib/cet";
import { getDigest, getLatestDigest } from "@/lib/data/digests";
import { useHydratedDigest } from "@/lib/hydrate";
import { useDatedDigest } from "@/lib/use-live-digest";

export const Route = createFileRoute("/d/$date")({
  component: DigestPage,
});

function DigestPage() {
  const { date } = Route.useParams();
  const { digest: raw, ready } = useDatedDigest(date);
  const digest = useHydratedDigest(raw ?? getLatestDigest());
  if (!ready) {
    return (
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-fg-subtle">Loading edition…</p>
    );
  }
  if (!raw) throw notFound();
  return (
    <>
      <ReadingProgress />
      <KeyboardNav date={digest.date} itemIds={digest.items.map((i) => i.id)} />
      <DigestView digest={digest} isToday={date === todayCetDate()} live={date === todayCetDate() && !getDigest(date)} />
    </>
  );
}