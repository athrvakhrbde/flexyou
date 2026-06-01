"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { CollectionCategory } from "@prisma/client";
import { FlexPost, FlexPostSkeleton } from "@/components/flex/FlexPost";
import { CategoryIcon, ALL_CATEGORIES } from "@/components/flex/CategoryIcon";
import { CATEGORY_LABELS } from "@/lib/utils/format";
import { getFeedPage, type FeedFilter } from "@/lib/actions/feed";
import { getSuggestedUsers } from "@/lib/actions/user";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface FeedClientProps {
  initialItems: Awaited<ReturnType<typeof getFeedPage>>["items"];
  initialCursor: string | null;
  currentUserId: string | null;
}

const FILTERS: { value: FeedFilter; label: string }[] = [
  { value: "new", label: "New" },
  { value: "following", label: "Following" },
  { value: "trending", label: "Hot" },
  { value: "category", label: "Category" },
];

export function FeedClient({ initialItems, initialCursor, currentUserId }: FeedClientProps) {
  const [filter, setFilter] = useState<FeedFilter>("new");
  const [category, setCategory] = useState<CollectionCategory | undefined>();
  const [suggested, setSuggested] = useState<Awaited<ReturnType<typeof getSuggestedUsers>>>([]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["feed", filter, category],
      queryFn: async ({ pageParam }) =>
        getFeedPage({ cursor: pageParam, filter, category }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      initialData: filter === "new" && !category ? {
        pages: [{ items: initialItems, nextCursor: initialCursor, emptyReason: null }],
        pageParams: [undefined],
      } : undefined,
    });

  const items = data?.pages.flatMap((p) => p.items) ?? [];
  const emptyReason = data?.pages[0]?.emptyReason;

  const sentinelRef = useInfiniteScroll(
    () => fetchNextPage(),
    !!hasNextPage,
    isFetchingNextPage
  );

  useEffect(() => {
    if (emptyReason === "no_following") {
      getSuggestedUsers().then(setSuggested);
    }
  }, [emptyReason]);

  return (
    <div className="space-y-6">
      <div className="neo-card rounded-md p-5 bg-primary/30">
        <h1 className="neo-heading text-3xl">FEED</h1>
        <p className="text-sm font-medium mt-1">Fresh flexes from the community</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => {
              setFilter(value);
              if (value !== "category") setCategory(undefined);
            }}
            className={cn("neo-chip rounded-md", filter === value && "neo-chip-active")}
          >
            {label}
          </button>
        ))}
      </div>

      {filter === "category" && (
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "neo-chip rounded-md text-xs",
                category === cat && "neo-chip-active"
              )}
            >
              <CategoryIcon category={cat} size={12} />
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <FlexPostSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="neo-card rounded-md py-16 px-6 text-center">
          {emptyReason === "login_required" ? (
            <>
              <p className="neo-heading text-xl mb-2">LOG IN</p>
              <p className="text-sm font-medium text-muted-foreground mb-6">See flexes from people you follow.</p>
              <Link href="/login?redirect=/feed">
                <Button>Log in</Button>
              </Link>
            </>
          ) : emptyReason === "no_following" ? (
            <>
              <p className="neo-heading text-xl mb-2">EMPTY FEED</p>
              <p className="text-sm font-medium text-muted-foreground mb-6">Follow someone first.</p>
              <div className="space-y-2 max-w-xs mx-auto text-left">
                {suggested.map((user) => (
                  <Link
                    key={user.id}
                    href={`/u/${user.username}`}
                    className="flex items-center gap-3 p-3 neo-card neo-card-hover rounded-md"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar ?? undefined} />
                      <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate">{user.displayName ?? user.username}</p>
                      <p className="text-xs font-medium text-muted-foreground">{user._count.flexItems} flexes</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <p className="font-bold">No flexes yet.</p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {items.map((item) => (
              <FlexPost key={item.id} item={item} currentUserId={currentUserId} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-4">
            {isFetchingNextPage && (
              <div className="mt-6">
                <FlexPostSkeleton />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
