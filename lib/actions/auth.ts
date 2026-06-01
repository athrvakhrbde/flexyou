"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { loginSchema, signupSchema, onboardingSchema } from "@/lib/validations/auth";
import { recalculateAndCache } from "@/lib/flexscore";
import { authCallbackUrl } from "@/lib/utils/app-url";

function sanitizeRedirect(path: string | null | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/feed";
  return path;
}

export async function signInWithEmail(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const redirectTo = sanitizeRedirect(formData.get("redirect") as string | null);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message };

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) redirect("/onboarding");
  }
  redirect(redirectTo);
}

export async function signUpWithEmail(formData: FormData) {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: authCallbackUrl("/onboarding"),
    },
  });
  if (error) return { error: error.message };
  redirect("/onboarding");
}

/** Prefer linking to `/auth/oauth` from the client. Kept for programmatic use. */
export async function signInWithGoogle(redirectPath?: string) {
  const supabase = await createClient();
  const redirectTo = sanitizeRedirect(redirectPath);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: authCallbackUrl(redirectTo),
    },
  });
  if (error) return { error: error.message };
  if (data.url) return { url: data.url };
  return { error: "Could not start Google sign-in" };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const interests = formData.getAll("interests") as string[];
  const parsed = onboardingSchema.safeParse({
    username: formData.get("username"),
    displayName: formData.get("displayName"),
    bio: formData.get("bio") || undefined,
    location: formData.get("location") || undefined,
    interests,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const existing = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });
  if (existing && existing.id !== user.id) {
    return { error: "Username already taken" };
  }

  await prisma.user.upsert({
    where: { id: user.id },
    create: {
      id: user.id,
      email: user.email!,
      username: parsed.data.username,
      displayName: parsed.data.displayName,
      bio: parsed.data.bio,
      location: parsed.data.location,
      interests: parsed.data.interests,
      avatar: user.user_metadata?.avatar_url ?? null,
    },
    update: {
      username: parsed.data.username,
      displayName: parsed.data.displayName,
      bio: parsed.data.bio,
      location: parsed.data.location,
      interests: parsed.data.interests,
    },
  });

  await recalculateAndCache(user.id);
  redirect("/feed");
}

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
      flexScore: true,
      isPro: true,
      location: true,
    },
  });
  } catch {
    return null;
  }
}

export async function checkUsernameAvailable(username: string) {
  const user = await prisma.user.findUnique({ where: { username } });
  return { available: !user };
}
