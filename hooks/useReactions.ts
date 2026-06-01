"use client";

import { useState, useTransition } from "react";
import { ReactionType } from "@prisma/client";
import { toggleReaction } from "@/lib/actions/reactions";
import { toast } from "sonner";

type ReactionCounts = Record<ReactionType, number>;

export function useReactions(
  flexItemId: string,
  initialCounts: ReactionCounts,
  initialUserReaction: ReactionType | null
) {
  const [counts, setCounts] = useState(initialCounts);
  const [userReaction, setUserReaction] = useState<ReactionType | null>(initialUserReaction);
  const [isPending, startTransition] = useTransition();

  const react = (type: ReactionType) => {
    const prevCounts = { ...counts };
    const prevReaction = userReaction;

    // Optimistic update
    if (userReaction === type) {
      setUserReaction(null);
      setCounts((c) => ({ ...c, [type]: Math.max(0, c[type] - 1) }));
    } else {
      if (userReaction) {
        setCounts((c) => ({ ...c, [userReaction]: Math.max(0, c[userReaction] - 1) }));
      }
      setUserReaction(type);
      setCounts((c) => ({ ...c, [type]: c[type] + 1 }));
    }

    startTransition(async () => {
      const result = await toggleReaction(flexItemId, type);
      if (result.error) {
        setCounts(prevCounts);
        setUserReaction(prevReaction);
        toast.error(result.error);
      } else if (result.counts) {
        setCounts(result.counts);
        setUserReaction(result.userReaction ?? null);
      }
    });
  };

  return { counts, userReaction, react, isPending };
}
