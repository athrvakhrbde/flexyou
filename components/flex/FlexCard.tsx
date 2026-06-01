"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/utils/format";
import { RarityBadge } from "./RarityBadge";
import { ReactionCountsRow } from "./ReactionBar";
import { ReactionType, Rarity } from "@prisma/client";
import { toggleReaction } from "@/lib/actions/reactions";
import { toast } from "sonner";
import { useTransition } from "react";

const PLACEHOLDER = "/placeholder-item.svg";

export interface FlexCardData {
  id: string;
  name: string;
  brand: string;
  images: string[];
  estimatedValue: number;
  rarity: Rarity;
  user: {
    id: string;
    username: string;
    avatar: string | null;
    displayName: string | null;
  };
  reactions: { type: ReactionType; userId?: string }[];
  _count?: { reactions: number; savedBy: number };
}

interface FlexCardProps {
  item: FlexCardData;
  index?: number;
  currentUserId?: string | null;
  className?: string;
}

function ItemImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      sizes="(max-width: 768px) 50vw, 25vw"
      onError={() => setImgSrc(PLACEHOLDER)}
    />
  );
}

export function FlexCard({ item, currentUserId, className }: FlexCardProps) {
  const [isPending, startTransition] = useTransition();
  const image = item.images[0] ?? PLACEHOLDER;

  const handleWantIt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUserId) {
      toast.error("Sign in to react");
      return;
    }
    startTransition(async () => {
      const result = await toggleReaction(item.id, "WANT");
      if (result.error) toast.error(result.error);
      else toast.success("Added to your wants!");
    });
  };

  return (
    <div className={className}>
      <Link href={`/item/${item.id}`}>
        <article className="feed-card group">
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            <ItemImage src={image} alt={item.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-2.5 left-2.5">
              <RarityBadge rarity={item.rarity} />
            </div>

            <div className="absolute top-2.5 right-2.5">
              <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm text-xs font-medium">
                {formatINR(item.estimatedValue)}
              </Badge>
            </div>
          </div>

          <div className="p-3.5 space-y-2">
            <div>
              <p className="type-caption text-primary font-medium uppercase tracking-wide text-[10px]">
                {item.brand}
              </p>
              <h3 className="type-h3 truncate mt-0.5">{item.name}</h3>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link
                href={`/u/${item.user.username}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={item.user.avatar ?? undefined} />
                  <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                    {item.user.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="type-caption truncate">@{item.user.username}</span>
              </Link>

              <button
                onClick={handleWantIt}
                disabled={isPending}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors shrink-0"
              >
                <Heart className="h-3.5 w-3.5" />
              </button>
            </div>

            <ReactionCountsRow reactions={item.reactions} />
          </div>
        </article>
      </Link>
    </div>
  );
}

export function FlexCardSkeleton() {
  return (
    <div className="feed-card overflow-hidden">
      <div className="aspect-[4/5] bg-muted animate-pulse" />
      <div className="p-3.5 space-y-2">
        <div className="h-3 w-16 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-6 w-24 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}
