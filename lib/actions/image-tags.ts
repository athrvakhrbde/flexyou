"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const tagSchema = z.object({
  flexItemId: z.string().min(1),
  imageIndex: z.number().int().min(0).max(20),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  name: z.string().min(1).max(120),
  brand: z.string().max(80).optional(),
  estimatedValue: z.number().min(0).optional(),
});

export type ImageProductTagDTO = {
  id: string;
  flexItemId: string;
  imageIndex: number;
  x: number;
  y: number;
  name: string;
  brand: string | null;
  estimatedValue: number | null;
};

export async function getImageTags(flexItemId: string): Promise<ImageProductTagDTO[]> {
  try {
    return await prisma.imageProductTag.findMany({
      where: { flexItemId },
      orderBy: { createdAt: "asc" },
    });
  } catch {
    return [];
  }
}

async function assertItemOwner(flexItemId: string, userId: string) {
  const item = await prisma.flexItem.findUnique({
    where: { id: flexItemId },
    select: { userId: true, user: { select: { username: true } } },
  });
  if (!item || item.userId !== userId) {
    return { error: "Not allowed" as const, item: null };
  }
  return { error: null, item };
}

export async function addImageTag(input: z.infer<typeof tagSchema>) {
  const parsed = tagSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid tag" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to tag products" };

  const { error, item } = await assertItemOwner(parsed.data.flexItemId, user.id);
  if (error || !item) return { error: error ?? "Not found" };

  try {
    const tag = await prisma.imageProductTag.create({ data: parsed.data });
    revalidatePath(`/item/${parsed.data.flexItemId}`);
    revalidatePath(`/u/${item.user.username}`);
    revalidatePath("/feed");
    return { tag };
  } catch (e) {
    console.error("[addImageTag]", e);
    return { error: "Could not add tag" };
  }
}

export async function updateImageTag(
  tagId: string,
  data: { name?: string; brand?: string; estimatedValue?: number }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in required" };

  const existing = await prisma.imageProductTag.findUnique({
    where: { id: tagId },
    include: { flexItem: { select: { userId: true, user: { select: { username: true } } } } },
  });
  if (!existing || existing.flexItem.userId !== user.id) {
    return { error: "Not allowed" };
  }

  try {
    const tag = await prisma.imageProductTag.update({
      where: { id: tagId },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.brand !== undefined && { brand: data.brand || null }),
        ...(data.estimatedValue !== undefined && { estimatedValue: data.estimatedValue }),
      },
    });
    revalidatePath(`/item/${existing.flexItemId}`);
    revalidatePath(`/u/${existing.flexItem.user.username}`);
    revalidatePath("/feed");
    return { tag };
  } catch {
    return { error: "Could not update tag" };
  }
}

export async function deleteImageTag(tagId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in required" };

  const existing = await prisma.imageProductTag.findUnique({
    where: { id: tagId },
    include: { flexItem: { select: { userId: true, user: { select: { username: true } } } } },
  });
  if (!existing || existing.flexItem.userId !== user.id) {
    return { error: "Not allowed" };
  }

  try {
    await prisma.imageProductTag.delete({ where: { id: tagId } });
    revalidatePath(`/item/${existing.flexItemId}`);
    revalidatePath(`/u/${existing.flexItem.user.username}`);
    revalidatePath("/feed");
    return { success: true };
  } catch {
    return { error: "Could not delete tag" };
  }
}
