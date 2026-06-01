import { CollectionCategory } from "@prisma/client";
import {
  Watch,
  Wallet,
  PocketKnife,
  Shirt,
  Car,
  Footprints,
  Laptop,
  Gem,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<CollectionCategory, React.ElementType> = {
  WATCHES: Watch,
  WALLETS: Wallet,
  EDC: PocketKnife,
  DAILYWEAR: Shirt,
  CARS: Car,
  SNEAKERS: Footprints,
  TECH: Laptop,
  JEWELRY: Gem,
  OTHER: Package,
};

interface CategoryIconProps {
  category: CollectionCategory;
  className?: string;
  size?: number;
}

export function CategoryIcon({ category, className, size = 20 }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[category] ?? Package;
  return <Icon className={cn("text-foreground", className)} size={size} />;
}

export const ALL_CATEGORIES = Object.keys(CATEGORY_ICONS) as CollectionCategory[];
