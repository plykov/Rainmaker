import { Badge } from "@/components/ui/badge";
import type { Confidence, Lane } from "@/lib/data/types";

export function ConfidenceBadge({
  confidence,
  lane,
}: {
  confidence: Confidence;
  lane?: Lane;
}) {
  if (lane === "analysis") {
    return <Badge tone="analysis">Analysis</Badge>;
  }
  return <Badge tone={confidence}>{confidence}</Badge>;
}
