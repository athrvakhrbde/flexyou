"use client";

import { cn } from "@/lib/utils";
import { formatFlexScore } from "@/lib/flexscore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { FlexScoreBreakdown } from "@/lib/flexscore";

interface FlexScoreBadgeProps {
  score: number;
  breakdown?: FlexScoreBreakdown;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: { outer: "h-16 w-16", text: "text-sm", sub: "text-[8px]" },
  md: { outer: "h-24 w-24", text: "text-xl", sub: "text-[10px]" },
  lg: { outer: "h-32 w-32", text: "text-2xl", sub: "text-xs" },
};

export function FlexScoreBadge({
  score,
  breakdown,
  size = "md",
  className,
}: FlexScoreBadgeProps) {
  const pct = Math.min(100, (score / 10000) * 100);
  const s = SIZES[size];
  const circumference = 264;
  const dashOffset = circumference - (pct / 100) * circumference;

  const badge = (
    <div
      className={cn("relative flex items-center justify-center", s.outer, className)}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-border"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          stroke="hsl(var(--primary))"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className={cn("font-display font-semibold text-foreground tracking-tight", s.text)}>
          {score.toLocaleString("en-IN")}
        </span>
        <span className={cn("text-muted-foreground type-label", s.sub)}>/ 10K</span>
      </div>
    </div>
  );

  if (!breakdown) return badge;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent side="bottom" className="w-48">
        <p className="font-semibold mb-2">Flex Score Breakdown</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between"><span>Items</span><span>{breakdown.itemsScore}</span></div>
          <div className="flex justify-between"><span>Value</span><span>{breakdown.valueScore}</span></div>
          <div className="flex justify-between"><span>Reactions</span><span>{breakdown.reactionsScore}</span></div>
          <div className="flex justify-between"><span>Followers</span><span>{breakdown.followersScore}</span></div>
          <div className="flex justify-between"><span>Rarity</span><span>{breakdown.rarityScore}</span></div>
          <div className="flex justify-between"><span>Affiliate</span><span>{breakdown.affiliateScore}</span></div>
          <div className="flex justify-between font-semibold border-t pt-1 mt-1">
            <span>Total</span><span>{formatFlexScore(breakdown.total)}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
