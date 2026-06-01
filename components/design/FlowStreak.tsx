import { cn } from "@/lib/utils";

interface FlowStreakProps {
  variant?: "mint" | "dark";
  className?: string;
}

export function FlowStreak({ variant = "mint", className }: FlowStreakProps) {
  return (
    <div
      className={cn(
        "flow-streak",
        variant === "mint" ? "flow-streak-mint" : "flow-streak-dark",
        className
      )}
      aria-hidden
    />
  );
}
