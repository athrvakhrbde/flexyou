"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/design/Logo";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: {
    username: string;
    avatar: string | null;
    displayName: string | null;
  } | null;
}

const LINKS = [
  { href: "/feed", label: "Feed" },
  { href: "/feed?filter=trending", label: "Hot" },
];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/feed") return pathname === "/feed" || pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-card shadow-neo">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between gap-3 px-4">
        <Logo size="sm" />

        <nav className="flex items-center gap-2">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "neo-chip rounded-md text-xs sm:text-sm",
                isActive(href) && "neo-chip-active"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {user ? (
          <Link href={`/u/${user.username}`} className="neo-card-hover">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar ?? undefined} />
              <AvatarFallback className="text-xs">
                {user.username[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Link href="/login" className="neo-btn bg-accent text-accent-foreground rounded-md h-9 px-3 text-xs sm:text-sm">
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}
