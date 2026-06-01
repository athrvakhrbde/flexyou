"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FlexGridThumb } from "@/components/flex/FlexPost";
import { FollowButton } from "./FollowButton";
import { formatINR } from "@/lib/utils/format";
import type { getProfile } from "@/lib/actions/user";

type ProfileData = NonNullable<Awaited<ReturnType<typeof getProfile>>>;

interface ProfileClientProps {
  profile: ProfileData;
  isOwnProfile: boolean;
  isFollowing: boolean;
  currentUserId: string | null;
  savedItems?: ProfileData["flexItems"];
}

export function ProfileClient({
  profile,
  isOwnProfile,
  isFollowing,
  currentUserId,
  savedItems = [],
}: ProfileClientProps) {
  return (
    <div className="space-y-6">
      <div className="neo-card rounded-md overflow-hidden">
        <div className="h-4 bg-accent border-b-[3px] border-ink" />
        <div className="p-5 flex gap-4 items-start">
          <Avatar className="h-20 w-20 -mt-10 neo-border shadow-neo">
            <AvatarImage src={profile.avatar ?? undefined} />
            <AvatarFallback className="text-2xl font-black">
              {profile.username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 pt-2 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="neo-heading text-2xl truncate">
                {profile.displayName ?? profile.username}
              </h1>
              {!isOwnProfile && currentUserId && (
                <FollowButton followingId={profile.id} initialFollowing={isFollowing} size="sm" />
              )}
              {isOwnProfile && (
                <Link href="/settings">
                  <span className="neo-chip text-xs rounded-md">Settings</span>
                </Link>
              )}
            </div>
            <p className="text-sm font-bold">@{profile.username}</p>
            {profile.bio && <p className="text-sm font-medium">{profile.bio}</p>}
          </div>
        </div>
        <div className="grid grid-cols-3 border-t-[3px] border-ink divide-x-[3px] divide-ink">
          {[
            { label: "Flexes", value: profile._count.flexItems },
            { label: "Followers", value: profile._count.followers },
            { label: "Value", value: formatINR(profile.totalValue) },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 text-center bg-secondary/30">
              <p className="font-black text-lg tabular-nums">{value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="flexes">
        <TabsList>
          <TabsTrigger value="flexes">Flexes</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          {isOwnProfile && <TabsTrigger value="saved">Saved</TabsTrigger>}
        </TabsList>

        <TabsContent value="flexes">
          {profile.flexItems.length === 0 ? (
            <p className="font-bold text-muted-foreground py-8">No flexes yet</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {profile.flexItems.map((item) => (
                <FlexGridThumb key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collections" className="space-y-2">
          {profile.collections.length === 0 ? (
            <p className="font-bold text-muted-foreground py-8">No collections</p>
          ) : (
            profile.collections.map((col) => (
              <Link
                key={col.id}
                href={`/u/${profile.username}/${col.slug}`}
                className="flex justify-between items-center p-4 neo-card neo-card-hover rounded-md"
              >
                <div>
                  <p className="font-bold">{col.name}</p>
                  <p className="text-xs font-medium text-muted-foreground">{col._count.items} items</p>
                </div>
                <span className="neo-sticker bg-neo-yellow">
                  {formatINR(col.items.reduce((s, i) => s + i.estimatedValue, 0))}
                </span>
              </Link>
            ))
          )}
        </TabsContent>

        {isOwnProfile && (
          <TabsContent value="saved">
            {savedItems.length === 0 ? (
              <p className="font-bold text-muted-foreground py-8">Nothing saved</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {savedItems.map((item) => (
                  <FlexGridThumb key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
