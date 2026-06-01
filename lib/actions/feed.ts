"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { CollectionCategory, Prisma } from "@prisma/client";

export type FeedFilter = "following" | "trending" | "new" | "category";

const PAGE_SIZE = 12;

const itemInclude = {
  user: { select: { id: true, username: true, avatar: true, displayName: true } },
  collection: { select: { category: true, name: true, slug: true } },
  _count: { select: { reactions: true, savedBy: true } },
  reactions: { select: { type: true, userId: true } },
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
} satisfies Prisma.FlexItemInclude;

export type FeedItem = Prisma.FlexItemGetPayload<{ include: typeof itemInclude }>;

export async function getFeedPage({
  cursor,
  filter = "new",
  category,
}: {
  cursor?: string;
  filter?: FeedFilter;
  category?: CollectionCategory;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const where: Prisma.FlexItemWhereInput = {
      collection: { isPublic: true },
    };

    if (filter === "following") {
      if (!user) {
        return { items: [], nextCursor: null, emptyReason: "login_required" as const };
      }
      const follows = await prisma.follow.findMany({
        where: { followerId: user.id },
        select: { followingId: true },
      });
      const followingIds = follows.map((f) => f.followingId);
      if (followingIds.length === 0) {
        return { items: [], nextCursor: null, emptyReason: "no_following" as const };
      }
      where.userId = { in: followingIds };
    }

    if (filter === "category" && category) {
      where.collection = { isPublic: true, category };
    }

    if (filter === "trending") {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      where.createdAt = { gte: sevenDaysAgo };
    }

    const orderBy: Prisma.FlexItemOrderByWithRelationInput[] = [{ createdAt: "desc" }];

    const items = await prisma.flexItem.findMany({
      where,
      include: itemInclude,
      orderBy,
      take: PAGE_SIZE + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    let sortedItems = items;

    if (filter === "trending") {
      sortedItems = [...items].sort((a, b) => {
        const ageA = Math.max(1, (Date.now() - a.createdAt.getTime()) / (1000 * 60 * 60));
        const ageB = Math.max(1, (Date.now() - b.createdAt.getTime()) / (1000 * 60 * 60));
        const scoreA = (a._count.reactions * 3 + a._count.savedBy * 2) / ageA;
        const scoreB = (b._count.reactions * 3 + b._count.savedBy * 2) / ageB;
        return scoreB - scoreA;
      });
    }

    const hasMore = sortedItems.length > PAGE_SIZE;
    const pageItems = hasMore ? sortedItems.slice(0, PAGE_SIZE) : sortedItems;
    const nextCursor = hasMore ? pageItems[pageItems.length - 1]?.id ?? null : null;

    return { items: pageItems, nextCursor, emptyReason: null };
  } catch (error) {
    console.error("[getFeedPage]", error);
    return { items: [], nextCursor: null, emptyReason: "error" as const };
  }
}

export async function getFlexOfTheDay() {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const items = await prisma.flexItem.findMany({
      where: { createdAt: { gte: oneDayAgo }, collection: { isPublic: true } },
      include: {
        ...itemInclude,
        _count: { select: { reactions: true } },
      },
      orderBy: { reactions: { _count: "desc" } },
      take: 1,
    });
    return items[0] ?? null;
  } catch {
    return null;
  }
}

export async function getLandingStats() {
  try {
    const [itemCount, brandCount] = await Promise.all([
      prisma.flexItem.count(),
      prisma.flexItem.findMany({ select: { brand: true }, distinct: ["brand"] }),
    ]);
    return { itemCount, brandCount: brandCount.length };
  } catch {
    return { itemCount: 0, brandCount: 0 };
  }
}

export async function getItem(itemId: string) {
  try {
    return await prisma.flexItem.findUnique({
      where: { id: itemId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            displayName: true,
            bio: true,
            flexScore: true,
            location: true,
          },
        },
        collection: { select: { name: true, slug: true, category: true } },
        _count: { select: { reactions: true, comments: true, savedBy: true } },
        reactions: { select: { type: true, userId: true } },
        comments: {
          include: {
            user: { select: { id: true, username: true, avatar: true, displayName: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        imageProductTags: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getRelatedItems(userId: string, excludeId: string) {
  try {
    return await prisma.flexItem.findMany({
      where: { userId, id: { not: excludeId }, collection: { isPublic: true } },
      include: itemInclude,
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}
