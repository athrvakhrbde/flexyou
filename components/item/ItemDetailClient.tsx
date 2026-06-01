"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RarityBadge } from "@/components/flex/RarityBadge";
import { ReactionBar } from "@/components/flex/ReactionBar";
import { AffiliateButton } from "@/components/flex/AffiliateButton";
import { FlexGridThumb } from "@/components/flex/FlexPost";
import { TaggedImage, type ImageProductTagDTO } from "@/components/flex/TaggedImage";
import { FollowButton } from "@/components/profile/FollowButton";
import { formatINR } from "@/lib/utils/format";
import { createComment } from "@/lib/actions/comments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReactionType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ItemDetailProps {
  item: {
    id: string;
    name: string;
    brand: string;
    model: string | null;
    description: string | null;
    images: string[];
    estimatedValue: number;
    purchaseYear: number | null;
    affiliateLink: string | null;
    rarity: import("@prisma/client").Rarity;
    user: {
      id: string;
      username: string;
      avatar: string | null;
      displayName: string | null;
      bio: string | null;
      flexScore: number;
      location: string | null;
    };
    collection: { name: string; slug: string; category: string };
    _count: { reactions: number; comments: number; savedBy: number };
    reactions: { type: ReactionType; userId: string }[];
    comments: {
      id: string;
      text: string;
      createdAt: Date;
      user: { id: string; username: string; avatar: string | null; displayName: string | null };
    }[];
    imageProductTags: ImageProductTagDTO[];
  };
  relatedItems: {
    id: string;
    name: string;
    brand: string;
    images: string[];
    estimatedValue: number;
    rarity: import("@prisma/client").Rarity;
    user: { id: string; username: string; avatar: string | null; displayName: string | null };
    reactions: { type: ReactionType; userId?: string }[];
  }[];
  currentUserId: string | null;
  isFollowing: boolean;
}

export function ItemDetailClient({
  item,
  relatedItems,
  currentUserId,
  isFollowing,
}: ItemDetailProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [tags, setTags] = useState(item.imageProductTags);
  const [tagMode, setTagMode] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isOwner = currentUserId === item.user.id;
  const imageTags = tags.filter((t) => t.imageIndex === imageIndex);

  const reactionCounts = (["FIRE", "WANT", "RESPECT", "RARE"] as ReactionType[]).reduce(
    (acc, type) => {
      acc[type] = item.reactions.filter((r) => r.type === type).length;
      return acc;
    },
    {} as Record<ReactionType, number>
  );

  const userReaction =
    currentUserId
      ? item.reactions.find((r) => r.userId === currentUserId)?.type ?? null
      : null;

  const handleComment = (formData: FormData) => {
    startTransition(async () => {
      const result = await createComment(formData);
      if (result.error) toast.error(result.error);
      else toast.success("Posted!");
    });
  };

  return (
    <div className="space-y-6">
      <Link href="/feed" className="neo-chip rounded-md inline-flex">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Feed
      </Link>

      <div className="neo-card rounded-md overflow-hidden">
        <div className="relative">
          <div className="absolute top-3 left-3 z-20 flex gap-2">
            <RarityBadge rarity={item.rarity} size="md" />
            {imageTags.length > 0 && (
              <span className="neo-sticker bg-card text-[10px]">{imageTags.length} products</span>
            )}
          </div>
          {isOwner && (
            <div className="absolute top-3 right-3 z-20">
              <button
                type="button"
                onClick={() => setTagMode((m) => !m)}
                className={cn(
                  "neo-chip rounded-md text-xs",
                  tagMode && "neo-chip-active"
                )}
              >
                {tagMode ? "Done tagging" : "Tag products"}
              </button>
            </div>
          )}
          <TaggedImage
            src={item.images[imageIndex] ?? item.images[0] ?? "/placeholder-item.svg"}
            alt={item.name}
            imageIndex={imageIndex}
            tags={tags}
            flexItemId={item.id}
            editable={isOwner && tagMode}
            onTagsChange={setTags}
            aspectClassName="aspect-square border-b-[3px] border-ink"
            showTagHint={!tagMode && imageTags.length > 0}
          />
          {item.images.length > 1 && (
            <div className="flex gap-2 p-3 border-b-[3px] border-ink bg-muted/50">
              {item.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageIndex(i)}
                  className={cn(
                    "relative h-14 w-14 shrink-0 overflow-hidden rounded-md neo-border shadow-neo-sm",
                    i === imageIndex && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 space-y-4 bg-card">
          <div>
            <h1 className="neo-heading text-2xl">{item.name}</h1>
            <p className="text-sm font-bold text-muted-foreground mt-1">
              {item.brand}{item.model ? ` · ${item.model}` : ""}
              {item.purchaseYear ? ` · ${item.purchaseYear}` : ""}
            </p>
          </div>

          <div className="neo-sticker bg-neo-yellow text-base px-3 py-1.5 inline-block">
            {formatINR(item.estimatedValue)}
          </div>

          {item.description && (
            <p className="text-sm font-medium">{item.description}</p>
          )}

          <Link
            href={`/u/${item.user.username}/${item.collection.slug}`}
            className="text-sm font-black text-foreground underline underline-offset-4"
          >
            {item.collection.name} →
          </Link>

          <ReactionBar
            flexItemId={item.id}
            initialCounts={reactionCounts}
            initialUserReaction={userReaction}
          />

          {item.affiliateLink && (
            <AffiliateButton affiliateLink={item.affiliateLink} flexItemId={item.id} className="w-full" variant="accent" />
          )}
        </div>
      </div>

      <div className="neo-card rounded-md p-4 flex items-center justify-between gap-3">
        <Link href={`/u/${item.user.username}`} className="flex items-center gap-3 min-w-0">
          <Avatar className="h-11 w-11">
            <AvatarImage src={item.user.avatar ?? undefined} />
            <AvatarFallback>{item.user.username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-bold truncate">{item.user.displayName ?? item.user.username}</p>
            <p className="text-xs font-medium text-muted-foreground">@{item.user.username}</p>
          </div>
        </Link>
        {currentUserId && currentUserId !== item.user.id && (
          <FollowButton followingId={item.user.id} initialFollowing={isFollowing} size="sm" />
        )}
      </div>

      <div className="neo-card rounded-md p-5">
        <p className="font-black text-sm uppercase tracking-wide mb-4">
          {item._count.comments} Comments
        </p>
        {currentUserId ? (
          <form action={handleComment} className="flex gap-2 mb-5">
            <input type="hidden" name="flexItemId" value={item.id} />
            <Input name="text" placeholder="Say something..." required maxLength={500} className="flex-1" />
            <Button type="submit" disabled={isPending} size="sm">
              Post
            </Button>
          </form>
        ) : (
          <p className="text-sm font-medium mb-5">
            <Link href="/login" className="font-black underline">Log in</Link> to comment
          </p>
        )}
        <div className="space-y-3">
          {item.comments.map((comment) => (
            <div key={comment.id} className="p-3 bg-muted/50 neo-border rounded-md shadow-neo-sm">
              <p className="text-sm font-medium">
                <span className="font-black">{comment.user.displayName ?? comment.user.username}</span>{" "}
                {comment.text}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </p>
            </div>
          ))}
          {item.comments.length === 0 && (
            <p className="text-sm font-bold text-muted-foreground">No comments yet</p>
          )}
        </div>
      </div>

      {relatedItems.length > 0 && (
        <div>
          <p className="neo-heading text-lg mb-3">More from @{item.user.username}</p>
          <div className="grid grid-cols-3 gap-2">
            {relatedItems.map((rel) => (
              <FlexGridThumb key={rel.id} item={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
