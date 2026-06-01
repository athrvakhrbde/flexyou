export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCollection } from "@/lib/actions/user";
import { FlexGridThumb } from "@/components/flex/FlexPost";
import { CategoryIcon } from "@/components/flex/CategoryIcon";
import { formatINR, CATEGORY_LABELS } from "@/lib/utils/format";

interface CollectionPageProps {
  params: { username: string; collectionSlug: string };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const data = await getCollection(params.username, params.collectionSlug);
  if (!data) notFound();

  const { collection, totalValue } = data;

  return (
    <div className="space-y-6">
      <Link href={`/u/${collection.user.username}`} className="neo-chip rounded-md inline-flex">
        <ArrowLeft className="h-4 w-4 mr-1" />
        @{collection.user.username}
      </Link>

      <div className="neo-card rounded-md p-5 space-y-3 bg-secondary/40">
        <div className="flex items-center gap-2">
          <CategoryIcon category={collection.category} size={18} />
          <span className="neo-sticker bg-card text-[10px]">{CATEGORY_LABELS[collection.category]}</span>
        </div>
        <h1 className="neo-heading text-3xl">{collection.name}</h1>
        {collection.description && (
          <p className="text-sm font-medium">{collection.description}</p>
        )}
        <div className="flex gap-3 pt-1">
          <span className="neo-sticker bg-neo-yellow">{collection.items.length} items</span>
          <span className="neo-sticker bg-primary">{formatINR(totalValue)}</span>
        </div>
      </div>

      {collection.items.length === 0 ? (
        <p className="font-black text-muted-foreground">Empty collection</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {collection.items.map((item) => (
            <FlexGridThumb
              key={item.id}
              item={{ ...item, user: collection.user, reactions: item.reactions ?? [] }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
