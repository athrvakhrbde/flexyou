"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, User, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/design/Logo";
import { cn } from "@/lib/utils";

interface NavUser {
  username: string;
  avatar: string | null;
  displayName: string | null;
}

const MAIN_LINKS = [
  { href: "/feed", label: "Discover", icon: Home },
  { href: "/feed?filter=trending", label: "Hot", icon: Sparkles },
];

export function Sidebar({ user }: { user?: NavUser | null }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/feed") return pathname === "/feed" || pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <aside className="hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-40 flex-col gap-1.5 glass-panel-strong rounded-2xl p-2">
      <Link href="/feed" className="flex items-center justify-center p-2.5 mb-1">
        <Logo size="sm" />
      </Link>

      {MAIN_LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          title={label}
          className={cn(
            "flex items-center justify-center rounded-xl p-3 transition-all duration-300",
            isActive(href)
              ? "bg-primary/15 text-primary shadow-[0_0_20px_hsl(var(--primary)/0.25)]"
              : "text-muted-foreground hover:text-foreground hover:bg-white/30 dark:hover:bg-white/8"
          )}
        >
          <Icon className={cn("h-5 w-5", isActive(href) && "stroke-[2.5]")} />
        </Link>
      ))}

      <Link
        href={user ? `/u/${user.username}` : "/login"}
        title="Profile"
        className={cn(
          "flex items-center justify-center rounded-xl p-3 transition-all duration-300",
          pathname.startsWith("/u/") && user && pathname.includes(user.username)
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-white/30 dark:hover:bg-white/8"
        )}
      >
        {user ? (
          <Avatar className="h-5 w-5 ring-2 ring-white/40">
            <AvatarImage src={user.avatar ?? undefined} />
            <AvatarFallback className="text-[9px] bg-primary text-primary-foreground">
              {user.username[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <User className="h-5 w-5" />
        )}
      </Link>

      <span
        title="Flex (soon)"
        className="flex items-center justify-center rounded-xl p-3 text-muted-foreground/35 cursor-not-allowed"
      >
        <PlusSquare className="h-5 w-5" />
      </span>

      {!user && (
        <Link
          href="/login"
          className="mt-1 text-center text-[11px] font-semibold bg-gradient-to-r from-primary to-accent text-white rounded-xl py-2 px-3 hover:opacity-90 transition-opacity"
        >
          Join
        </Link>
      )}
    </aside>
  );
}

export function BottomNav({ user }: { user?: NavUser | null }) {
  const pathname = usePathname();

  const links = [
    { href: "/feed", icon: Home, label: "Discover" },
    { href: "/feed?filter=trending", icon: Sparkles, label: "Hot" },
    { href: "#", icon: PlusSquare, label: "Flex", disabled: true },
    {
      href: user ? `/u/${user.username}` : "/login",
      icon: User,
      label: "Profile",
      isProfile: true,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-5 left-4 right-4 z-50 glass-panel-strong rounded-2xl safe-area-pb">
      <div className="flex items-center justify-around h-14 px-1">
        {links.map(({ href, icon: Icon, label, disabled, isProfile }) => {
          const active =
            href === "/feed"
              ? pathname === "/feed" || pathname === "/"
              : isProfile
                ? pathname.startsWith("/u/")
                : false;

          if (disabled) {
            return (
              <span key={label} className="flex flex-col items-center p-2.5 text-muted-foreground/30">
                <Icon className="h-5 w-5" />
              </span>
            );
          }

          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex flex-col items-center p-2.5 rounded-xl transition-all duration-300",
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              )}
            >
              {isProfile && user ? (
                <Avatar className={cn("h-5 w-5", active && "ring-2 ring-primary/50")}>
                  <AvatarImage src={user.avatar ?? undefined} />
                  <AvatarFallback className="text-[8px]">{user.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              ) : (
                <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-40 px-4 pt-4 pb-2">
      <div className="glass-panel-strong rounded-2xl flex h-12 items-center justify-center">
        <Link href="/feed">
          <Logo size="sm" />
        </Link>
      </div>
    </header>
  );
}
