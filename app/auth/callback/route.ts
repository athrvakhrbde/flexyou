import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/utils/app-url";

function sanitizeNext(path: string | null): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/feed";
  return path;
}

export async function GET(request: NextRequest) {
  const appUrl = getAppUrl();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNext(searchParams.get("next"));
  const oauthError = searchParams.get("error_description") ?? searchParams.get("error");

  if (oauthError) {
    console.error("[auth/callback] OAuth error:", oauthError);
    return NextResponse.redirect(`${appUrl}/login?error=auth`);
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=auth`);
  }

  let destination = next;
  const response = NextResponse.redirect(`${appUrl}${destination}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession:", error.message);
    return NextResponse.redirect(`${appUrl}/login?error=auth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) destination = "/onboarding";
  }

  if (destination !== next) {
    const finalResponse = NextResponse.redirect(`${appUrl}${destination}`);
    response.cookies.getAll().forEach((cookie) => {
      finalResponse.cookies.set(cookie.name, cookie.value);
    });
    return finalResponse;
  }

  return response;
}
