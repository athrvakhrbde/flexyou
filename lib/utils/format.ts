export function formatINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getAffiliatePlatform(url: string): "amazon" | "flipkart" | "other" {
  if (url.includes("amazon")) return "amazon";
  if (url.includes("flipkart")) return "flipkart";
  return "other";
}

export const CATEGORY_LABELS: Record<string, string> = {
  WATCHES: "Watches",
  WALLETS: "Wallets",
  EDC: "EDC",
  DAILYWEAR: "Dailywear",
  CARS: "Cars",
  SNEAKERS: "Sneakers",
  TECH: "Tech",
  JEWELRY: "Jewelry",
  OTHER: "Other",
};

export const RARITY_LABELS: Record<string, string> = {
  COMMON: "Common",
  UNCOMMON: "Uncommon",
  RARE: "Rare",
  ULTRA_RARE: "Ultra Rare",
  GRAIL: "Grail",
};

export const REACTION_EMOJI: Record<string, string> = {
  FIRE: "🔥",
  WANT: "😍",
  RESPECT: "🫡",
  RARE: "💎",
};
