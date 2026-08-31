import { createFileRoute } from "@tanstack/react-router";
import { DigestView } from "@/components/digest-view";
import { KeyboardNav } from "@/components/keyboard-nav";
import { ReadingProgress } from "@/components/reading-progress";
import { getLatestDigest } from "@/lib/data/digests";
import { useHydratedDigest } from "@/lib/hydrate";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const digest = useHydratedDigest(getLatestDigest());
  return (
    <>
      <ReadingProgress />
      <KeyboardNav date={digest.date} itemIds={digest.items.map((i) => i.id)} />
      <DigestView digest={digest} isToday />
    </>
  );
}
