"use client";

import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";

const AUTH_PATHS = ["/login", "/signup", "/onboarding"];

interface ClientAppShellProps {
  user?: {
    username: string;
    avatar: string | null;
    displayName: string | null;
  } | null;
  children: React.ReactNode;
}

export function ClientAppShell({ user, children }: ClientAppShellProps) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AppShell user={user}>{children}</AppShell>;
}
