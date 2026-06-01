"use client";

import { useState, useTransition } from "react";
import { toggleFollow } from "@/lib/actions/user";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  followingId: string;
  initialFollowing: boolean;
  size?: "default" | "sm";
}

export function FollowButton({ followingId, initialFollowing, size = "default" }: FollowButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [following, setFollowing] = useState(initialFollowing);

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleFollow(followingId);
      if (result.error) toast.error(result.error);
      else {
        setFollowing(result.following ?? false);
        toast.success(result.following ? "Following" : "Unfollowed");
      }
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      variant={following ? "outline" : "default"}
      size={size === "sm" ? "sm" : "default"}
      className={cn(size === "sm" && "h-8")}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
