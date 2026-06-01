export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getItem, getRelatedItems } from "@/lib/actions/feed";
import { getCurrentUser } from "@/lib/actions/auth";
import { isFollowing } from "@/lib/actions/user";
import { ItemDetailClient } from "@/components/item/ItemDetailClient";

interface ItemPageProps {
  params: { itemId: string };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const item = await getItem(params.itemId);
  if (!item) notFound();

  const currentUser = await getCurrentUser();
  const [relatedItems, following] = await Promise.all([
    getRelatedItems(item.userId, item.id),
    currentUser && currentUser.id !== item.userId
      ? isFollowing(currentUser.id, item.userId)
      : Promise.resolve(false),
  ]);

  return (
    <ItemDetailClient
      item={item}
      relatedItems={relatedItems}
      currentUserId={currentUser?.id ?? null}
      isFollowing={following}
    />
  );
}
