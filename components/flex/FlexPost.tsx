"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatINR } from "@/lib/utils/format";
import { RarityBadge } from "./RarityBadge";
import { TaggedImage, type ImageProductTagDTO } from "./TaggedImage";
import { ReactionType, Rarity } from "@prisma/client";
import { toggleReaction } from "@/lib/actions/reactions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface FlexPostData {
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
  imageProductTags?: ImageProductTagDTO[];
  _count?: { reactions: number; savedBy: number };
}

interface FlexPostProps {
  item: FlexPostData;
  currentUserId?: string | null;
}

export function FlexPost({ item, currentUserId }: FlexPostProps) {
  const [isPending, startTransition] = useTransition();
  const [reacted, setReacted] = useState(
    currentUserId ? item.reactions.some((r) => r.userId === currentUserId) : false
  );
  const image = item.images[0] ?? "/placeholder-item.svg";
  const tags = item.imageProductTags ?? [];

  const handleReact = () => {
    if (!currentUserId) {
      toast.error("Sign in to react");
      return;
    }
    startTransition(async () => {
      const result = await toggleReaction(item.id, "FIRE");
      if (result.error) toast.error(result.error);
      else setReacted((v) => !v);
    });
  };

  return (
    <article className="neo-card neo-card-hover rounded-md overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b-[3px] border-ink bg-secondary/40">
        <Link href={`/u/${item.user.username}`}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.user.avatar ?? undefined} />
            <AvatarFallback>{item.user.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <Link
          href={`/u/${item.user.username}`}
          className="min-w-0 flex-1 text-sm font-bold truncate hover:underline"
        >
          {item.user.displayName ?? item.user.username}
        </Link>
        <RarityBadge rarity={item.rarity} />
      </div>

      <TaggedImage
        src={image}
        alt={item.name}
        imageIndex={0}
        tags={tags}
        flexItemId={item.id}
        editable={false}
        aspectClassName="aspect-[4/3] border-b-0"
        showTagHint={tags.length > 0}
      />

      <div className="px-4 py-4 space-y-3 bg-card border-t-[3px] border-ink">
        <div>
          <Link href={`/item/${item.id}`} className="neo-heading text-lg hover:underline">
            {item.name}
          </Link>
          <p className="text-sm font-medium text-muted-foreground mt-0.5">
            {item.brand} · <span className="text-foreground font-bold">{formatINR(item.estimatedValue)}</span>
            {tags.length > 0 && (
              <span className="ml-2 neo-sticker bg-neo-sky text-[10px] py-0 px-1.5">
                {tags.length} tagged
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReact}
            disabled={isPending}
            className={cn(
              "neo-chip rounded-md flex-1 justify-center",
              reacted && "neo-chip-active"
            )}
          >
            {reacted ? "FLEXED ✓" : "FLEX IT"}
            {item.reactions.length > 0 && ` · ${item.reactions.length}`}
          </button>
          <Link
            href={`/item/${item.id}`}
            className="neo-btn bg-card text-foreground rounded-md h-10 px-4 text-sm"
          >
            OPEN
          </Link>
        </div>
      </div>
    </article>
  );
}

export function FlexPostSkeleton() {
  return (
    <article className="neo-card rounded-md overflow-hidden animate-pulse">
      <div className="flex gap-2.5 px-4 py-3 border-b-[3px] border-ink">
        <div className="h-9 w-9 rounded-md bg-muted neo-border" />
        <div className="h-4 w-28 bg-muted rounded-md flex-1" />
      </div>
      <div className="aspect-[4/3] bg-muted border-b-[3px] border-ink" />
      <div className="px-4 py-4 space-y-2">
        <div className="h-5 w-3/4 bg-muted rounded-md" />
        <div className="h-4 w-1/2 bg-muted rounded-md" />
      </div>
    </article>
  );
}

export function FlexGridThumb({ item, className }: { item: FlexPostData; className?: string }) {
  const tagCount = item.imageProductTags?.length ?? 0;
  return (
    <Link
      href={`/item/${item.id}`}
      className={cn(
        "group relative aspect-square overflow-hidden bg-muted neo-border shadow-neo-sm rounded-md neo-card-hover",
        className
      )}
    >
      <img
        src={item.images[0] ?? "/placeholder-item.svg"}
        alt={item.name}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {tagCount > 0 && (
        <span className="absolute top-1.5 right-1.5 neo-sticker bg-primary text-[9px] z-10">
          {tagCount} tags
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 border-t-[3px] border-ink bg-primary px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black truncate text-primary-foreground">{item.name}</p>
      </div>
    </Link>
  );
}
