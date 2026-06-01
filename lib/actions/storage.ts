"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { recalculateAndCache } from "@/lib/flexscore";

export async function trackAffiliateClick(flexItemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const item = await prisma.flexItem.findUnique({
    where: { id: flexItemId },
    select: { userId: true },
  });
  if (!item) return { error: "Item not found" };

  await prisma.affiliateClick.create({
    data: {
      flexItemId,
      userId: user?.id ?? null,
    },
  });

  await recalculateAndCache(item.userId);
  return { success: true };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  const ext = file.name.split(".").pop();
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("flex-items")
    .upload(path, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage
    .from("flex-items")
    .getPublicUrl(path);

  return { url: publicUrl };
}
