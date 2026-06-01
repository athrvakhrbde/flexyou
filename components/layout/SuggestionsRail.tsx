import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/profile/FollowButton";

export interface SuggestedUser {
  id: string;
  username: string;
  displayName: string | null;
  avatar: string | null;
  flexScore: number;
  _count: { flexItems: number };
}

interface SuggestionsRailProps {
  suggested: SuggestedUser[];
  currentUserId?: string | null;
}

export function SuggestionsRail({ suggested, currentUserId }: SuggestionsRailProps) {
  const filtered = suggested.filter((u) => u.id !== currentUserId);

  if (filtered.length === 0 && currentUserId) return null;

  return (
    <aside className="hidden lg:block fixed right-5 top-8 z-30 w-72 space-y-4">
      {!currentUserId && (
        <div className="glass-panel-strong glass-shine rounded-3xl p-5 space-y-3">
          <p className="font-display font-semibold">Join FlexYou</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Flex your collection. Follow collectors. Build your circle.
          </p>
          <div className="flex gap-2 pt-1">
            <Link
              href="/signup"
              className="flex-1 text-center text-xs font-semibold bg-gradient-to-r from-primary to-accent text-white rounded-xl py-2.5 hover:opacity-90 transition-opacity"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="flex-1 text-center text-xs font-semibold glass-chip py-2.5 justify-center"
            >
              Log in
            </Link>
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="glass-panel-strong rounded-3xl p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Collectors
          </p>
          <ul className="space-y-3">
            {filtered.map((user) => (
              <li key={user.id} className="flex items-center gap-3">
                <Link href={`/u/${user.username}`}>
                  <Avatar className="h-9 w-9 ring-2 ring-white/40">
                    <AvatarImage src={user.avatar ?? undefined} />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-accent text-white">
                      {user.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/u/${user.username}`}
                    className="text-sm font-semibold truncate block hover:text-primary transition-colors"
                  >
                    {user.displayName ?? user.username}
                  </Link>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {user._count.flexItems} flexes · {user.flexScore} score
                  </p>
                </div>
                {currentUserId && currentUserId !== user.id && (
                  <FollowButton followingId={user.id} initialFollowing={false} size="sm" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[10px] text-muted-foreground/50 text-center">
          © {new Date().getFullYear()} FlexYou
      </p>
    </aside>
  );
}
