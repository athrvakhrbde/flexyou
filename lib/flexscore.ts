import { Rarity } from "@prisma/client";
import { prisma } from "./prisma";

const RARITY_WEIGHTS: Record<Rarity, number> = {
  COMMON: 1,
  UNCOMMON: 5,
  RARE: 20,
  ULTRA_RARE: 50,
  GRAIL: 100,
};

const MAX_SCORE = 10000;

export interface FlexScoreBreakdown {
  itemsScore: number;
  valueScore: number;
  reactionsScore: number;
  followersScore: number;
  rarityScore: number;
  affiliateScore: number;
  total: number;
}

export async function calculateFlexScore(userId: string): Promise<FlexScoreBreakdown> {
  const [items, followersCount, affiliateClicksGenerated] = await Promise.all([
    prisma.flexItem.findMany({
      where: { userId },
      select: {
        estimatedValue: true,
        rarity: true,
        _count: { select: { reactions: true } },
      },
    }),
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.affiliateClick.count({
      where: { flexItem: { userId } },
    }),
  ]);

  const totalItemsCount = items.length;
  const totalEstimatedValue = items.reduce((sum, i) => sum + i.estimatedValue, 0);
  const totalReactionsReceived = items.reduce((sum, i) => sum + i._count.reactions, 0);
  const rarityWeightedScore = items.reduce(
    (sum, i) => sum + RARITY_WEIGHTS[i.rarity],
    0
  );

  const itemsScore = totalItemsCount * 10;
  const valueScore = Math.floor(totalEstimatedValue / 1000);
  const reactionsScore = totalReactionsReceived * 5;
  const followersScore = followersCount * 8;
  const affiliateScore = affiliateClicksGenerated * 3;

  const total = Math.min(
    MAX_SCORE,
    itemsScore + valueScore + reactionsScore + followersScore + rarityWeightedScore + affiliateScore
  );

  return {
    itemsScore,
    valueScore,
    reactionsScore,
    followersScore,
    rarityScore: rarityWeightedScore,
    affiliateScore,
    total,
  };
}

export async function recalculateAndCache(userId: string): Promise<number> {
  const breakdown = await calculateFlexScore(userId);
  await prisma.user.update({
    where: { id: userId },
    data: { flexScore: breakdown.total },
  });
  return breakdown.total;
}

export function formatFlexScore(score: number): string {
  return `${score.toLocaleString("en-IN")} / 10K`;
}

export function getScoreGradient(score: number): string {
  if (score >= 8000) return "from-amber-400 via-yellow-500 to-orange-500";
  if (score >= 5000) return "from-purple-500 via-violet-500 to-indigo-500";
  if (score >= 2500) return "from-blue-500 via-cyan-500 to-teal-500";
  if (score >= 1000) return "from-green-500 via-emerald-500 to-teal-500";
  return "from-zinc-400 via-zinc-500 to-zinc-600";
}
