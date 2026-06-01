import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { authCallbackUrl, getAppUrl } from "@/lib/utils/app-url";

function sanitizeNext(path: string | null): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/feed";
  return path;
}

/** Starts Google OAuth (server redirect — works reliably from a link). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const next = sanitizeNext(searchParams.get("next"));

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Route handler cookie writes
          }
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: authCallbackUrl(next),
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error || !data.url) {
    console.error("[auth/oauth]", error?.message ?? "No OAuth URL returned");
    return NextResponse.redirect(`${getAppUrl()}/login?error=auth`);
  }

  return NextResponse.redirect(data.url);
}
