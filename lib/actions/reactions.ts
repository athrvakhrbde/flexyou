"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { ReactionType } from "@prisma/client";
import { recalculateAndCache } from "@/lib/flexscore";
import { revalidatePath } from "next/cache";

export async function toggleReaction(flexItemId: string, type: ReactionType) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const item = await prisma.flexItem.findUnique({
    where: { id: flexItemId },
    select: { userId: true },
  });
  if (!item) return { error: "Item not found" };

  const existing = await prisma.reaction.findUnique({
    where: { userId_flexItemId: { userId: user.id, flexItemId } },
  });

  if (existing) {
    if (existing.type === type) {
      await prisma.reaction.delete({ where: { id: existing.id } });
    } else {
      await prisma.reaction.update({
        where: { id: existing.id },
        data: { type },
      });
    }
  } else {
    await prisma.reaction.create({
      data: { userId: user.id, flexItemId, type },
    });
  }

  await recalculateAndCache(item.userId);

  const counts = await getReactionCounts(flexItemId);
  const userReaction = await prisma.reaction.findUnique({
    where: { userId_flexItemId: { userId: user.id, flexItemId } },
  });

  revalidatePath("/feed");
  revalidatePath(`/item/${flexItemId}`);
  return { counts, userReaction: userReaction?.type ?? null };
}

export async function getReactionCounts(flexItemId: string) {
  const reactions = await prisma.reaction.groupBy({
    by: ["type"],
    where: { flexItemId },
    _count: true,
  });

  const counts: Record<ReactionType, number> = {
    FIRE: 0,
    WANT: 0,
    RESPECT: 0,
    RARE: 0,
  };

  reactions.forEach((r) => {
    counts[r.type] = r._count;
  });

  return counts;
}

export async function toggleSave(flexItemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const existing = await prisma.savedItem.findUnique({
    where: { userId_flexItemId: { userId: user.id, flexItemId } },
  });

  if (existing) {
    await prisma.savedItem.delete({ where: { id: existing.id } });
  } else {
    await prisma.savedItem.create({
      data: { userId: user.id, flexItemId },
    });
  }

  revalidatePath("/feed");
  return { saved: !existing };
}

export async function isSaved(flexItemId: string, userId: string) {
  const saved = await prisma.savedItem.findUnique({
    where: { userId_flexItemId: { userId, flexItemId } },
  });
  return !!saved;
}
