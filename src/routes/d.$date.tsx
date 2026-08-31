import { createFileRoute, notFound } from "@tanstack/react-router";
import { DigestView } from "@/components/digest-view";
import { KeyboardNav } from "@/components/keyboard-nav";
import { ReadingProgress } from "@/components/reading-progress";
import { getDigest, getLatestDigest, LATEST_DATE } from "@/lib/data/digests";
import { useHydratedDigest } from "@/lib/hydrate";

export const Route = createFileRoute("/d/$date")({
  component: DigestPage,
});

function DigestPage() {
  const { date } = Route.useParams();
  const raw = getDigest(date);
  const digest = useHydratedDigest(raw ?? getLatestDigest());
  if (!raw) throw notFound();
  return (
    <>
      <ReadingProgress />
      <KeyboardNav date={digest.date} itemIds={digest.items.map((i) => i.id)} />
      <DigestView digest={digest} isToday={date === LATEST_DATE} />
    </>
  );
}
