/** Canonical app origin for auth redirects (must match Supabase allow-list). */
export function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  return "http://localhost:3001";
}

export function authCallbackUrl(nextPath = "/feed"): string {
  const next = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/feed";
  return `${getAppUrl()}/auth/callback?next=${encodeURIComponent(next)}`;
}
