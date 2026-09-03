import { createFileRoute } from "@tanstack/react-router";
import { DigestView } from "@/components/digest-view";
import { KeyboardNav } from "@/components/keyboard-nav";
import { ReadingProgress } from "@/components/reading-progress";
import { useHydratedDigest } from "@/lib/hydrate";
import { useLiveLatest } from "@/lib/use-live-digest";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { digest: raw, live } = useLiveLatest();
  const digest = useHydratedDigest(raw);
  return (
    <>
      <ReadingProgress />
      <KeyboardNav date={digest.date} itemIds={digest.items.map((i) => i.id)} />
      <DigestView digest={digest} isToday live={live} />
    </>
  );
}