import { Rarity } from "@prisma/client";
import { cn } from "@/lib/utils";
import { RARITY_LABELS } from "@/lib/utils/format";

const RARITY_STYLES: Record<Rarity, string> = {
  COMMON: "bg-muted text-foreground",
  UNCOMMON: "bg-neo-lime/80 text-foreground",
  RARE: "bg-neo-sky text-foreground",
  ULTRA_RARE: "bg-secondary text-foreground",
  GRAIL: "bg-neo-yellow text-foreground",
};

interface RarityBadgeProps {
  rarity: Rarity;
  size?: "sm" | "md";
  className?: string;
}

export function RarityBadge({ rarity, size = "sm", className }: RarityBadgeProps) {
  return (
    <span
      className={cn(
        "neo-sticker rounded-sm",
        size === "sm" ? "text-[10px]" : "text-xs px-2.5 py-1",
        RARITY_STYLES[rarity],
        className
      )}
    >
      {RARITY_LABELS[rarity]}
    </span>
  );
}

export function getRarityBorderClass(rarity: Rarity): string {
  const borders: Record<Rarity, string> = {
    COMMON: "border-ink",
    UNCOMMON: "border-ink ring-2 ring-neo-lime",
    RARE: "border-ink ring-2 ring-neo-sky",
    ULTRA_RARE: "border-ink ring-2 ring-secondary",
    GRAIL: "border-ink ring-2 ring-neo-yellow shadow-neo-lg",
  };
  return borders[rarity];
}
