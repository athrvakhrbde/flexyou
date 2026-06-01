"use client";

import { ReactionType } from "@prisma/client";
import { cn } from "@/lib/utils";
import { REACTION_EMOJI } from "@/lib/utils/format";
import { useReactions } from "@/hooks/useReactions";

const REACTION_TYPES: ReactionType[] = ["FIRE", "WANT", "RESPECT", "RARE"];

interface ReactionBarProps {
  flexItemId: string;
  initialCounts: Record<ReactionType, number>;
  initialUserReaction: ReactionType | null;
  compact?: boolean;
}

export function ReactionBar({
  flexItemId,
  initialCounts,
  initialUserReaction,
  compact = false,
}: ReactionBarProps) {
  const { counts, userReaction, react, isPending } = useReactions(
    flexItemId,
    initialCounts,
    initialUserReaction
  );

  return (
    <div className={cn("flex flex-wrap gap-2", compact && "gap-1.5")}>
      {REACTION_TYPES.map((type) => {
        const isActive = userReaction === type;
        const count = counts[type];

        return (
          <button
            key={type}
            onClick={() => react(type)}
            disabled={isPending}
            className={cn(
              "neo-chip rounded-md font-bold",
              compact ? "text-xs px-2 py-1" : "text-sm",
              isActive && "neo-chip-active"
            )}
          >
            <span>{REACTION_EMOJI[type]}</span>
            {count > 0 && <span className="tabular-nums">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function ReactionCountsRow({
  reactions,
}: {
  reactions: { type: ReactionType }[];
}) {
  const counts = REACTION_TYPES.reduce(
    (acc, type) => {
      acc[type] = reactions.filter((r) => r.type === type).length;
      return acc;
    },
    {} as Record<ReactionType, number>
  );

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return null;

  return (
    <div className="flex items-center gap-2 text-xs font-bold">
      {REACTION_TYPES.filter((t) => counts[t] > 0).map((type) => (
        <span key={type} className="neo-sticker bg-card">
          {REACTION_EMOJI[type]} {counts[type]}
        </span>
      ))}
    </div>
  );
}
