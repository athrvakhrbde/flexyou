export const dynamic = "force-dynamic";

import { getFeedPage } from "@/lib/actions/feed";
import { getCurrentUser } from "@/lib/actions/auth";
import { FeedClient } from "@/components/feed/FeedClient";

export default async function FeedPage() {
  const [feed, user] = await Promise.all([
    getFeedPage({ filter: "new" }),
    getCurrentUser(),
  ]);

  return (
    <FeedClient
      initialItems={feed.items}
      initialCursor={feed.nextCursor}
      currentUserId={user?.id ?? null}
    />
  );
}
