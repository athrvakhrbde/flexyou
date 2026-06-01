"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { recalculateAndCache } from "@/lib/flexscore";
import { calculateFlexScore } from "@/lib/flexscore";
import { revalidatePath } from "next/cache";

export async function getProfile(username: string) {
  try {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          flexItems: true,
          followers: true,
          following: true,
          collections: true,
        },
      },
      collections: {
        where: { isPublic: true },
        include: {
          _count: { select: { items: true } },
          items: { select: { estimatedValue: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      flexItems: {
        where: { collection: { isPublic: true } },
        include: {
          user: { select: { id: true, username: true, avatar: true, displayName: true } },
          collection: { select: { category: true } },
          _count: { select: { reactions: true, savedBy: true } },
          reactions: { select: { type: true } },
          imageProductTags: {
            select: {
              id: true,
              flexItemId: true,
              imageIndex: true,
              x: true,
              y: true,
              name: true,
              brand: true,
              estimatedValue: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return null;

  const totalValue = user.flexItems.reduce((sum, item) => sum + item.estimatedValue, 0);
  const scoreBreakdown = await calculateFlexScore(user.id);

  return { ...user, totalValue, scoreBreakdown };
  } catch (error) {
    console.error("[getProfile]", error);
    return null;
  }
}

export async function getSavedItems(userId: string) {
  return prisma.savedItem.findMany({
    where: { userId },
    include: {
      flexItem: {
        include: {
          user: { select: { id: true, username: true, avatar: true, displayName: true } },
          collection: { select: { category: true } },
          _count: { select: { reactions: true, savedBy: true } },
          reactions: { select: { type: true } },
          imageProductTags: {
            select: {
              id: true,
              flexItemId: true,
              imageIndex: true,
              x: true,
              y: true,
              name: true,
              brand: true,
              estimatedValue: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function toggleFollow(followingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };
  if (user.id === followingId) return { error: "Cannot follow yourself" };

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: user.id, followingId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({
      data: { followerId: user.id, followingId },
    });
  }

  await recalculateAndCache(followingId);
  revalidatePath(`/u/`);
  return { following: !existing };
}

export async function isFollowing(followerId: string, followingId: string) {
  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
  return !!follow;
}

export async function getCollection(username: string, slug: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return null;

  const collection = await prisma.collection.findUnique({
    where: { userId_slug: { userId: user.id, slug } },
    include: {
      user: { select: { id: true, username: true, avatar: true, displayName: true } },
      items: {
        include: {
          user: { select: { id: true, username: true, avatar: true, displayName: true } },
          collection: { select: { category: true } },
          _count: { select: { reactions: true, savedBy: true } },
          reactions: { select: { type: true } },
          imageProductTags: {
            select: {
              id: true,
              flexItemId: true,
              imageIndex: true,
              x: true,
              y: true,
              name: true,
              brand: true,
              estimatedValue: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!collection) return null;

  const totalValue = collection.items.reduce((sum, i) => sum + i.estimatedValue, 0);
  const mostReacted = collection.items.reduce(
    (best, item) => (item._count.reactions > (best?._count.reactions ?? 0) ? item : best),
    collection.items[0] ?? null
  );

  return { collection, totalValue, mostReacted };
}

export async function getSuggestedUsers(limit = 5) {
  return prisma.user.findMany({
    take: limit,
    orderBy: { flexScore: "desc" },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      flexScore: true,
      _count: { select: { flexItems: true, followers: true } },
    },
  });
}
