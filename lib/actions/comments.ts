"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { commentSchema } from "@/lib/validations/auth";
import { revalidatePath } from "next/cache";

export async function createComment(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const parsed = commentSchema.safeParse({
    text: formData.get("text"),
    flexItemId: formData.get("flexItemId"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const comment = await prisma.comment.create({
    data: {
      userId: user.id,
      flexItemId: parsed.data.flexItemId,
      text: parsed.data.text,
    },
    include: {
      user: { select: { id: true, username: true, avatar: true, displayName: true } },
    },
  });

  revalidatePath(`/item/${parsed.data.flexItemId}`);
  return { comment };
}

export async function getComments(flexItemId: string) {
  return prisma.comment.findMany({
    where: { flexItemId },
    include: {
      user: { select: { id: true, username: true, avatar: true, displayName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
