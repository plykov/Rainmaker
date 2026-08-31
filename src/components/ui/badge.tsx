import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em]",
  {
    variants: {
      tone: {
        confirmed: "bg-confirmed/15 text-confirmed",
        reported: "bg-reported/15 text-reported",
        unverified: "bg-unverified/15 text-unverified",
        analysis: "bg-analysis/15 text-analysis",
        mute: "bg-bg-subtle text-fg-muted",
        accent: "bg-accent/12 text-accent",
      },
    },
    defaultVariants: { tone: "mute" },
  },
);

function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };
