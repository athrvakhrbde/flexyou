export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getProfile, getSavedItems, isFollowing } from "@/lib/actions/user";
import { getCurrentUser } from "@/lib/actions/auth";
import { ProfileClient } from "@/components/profile/ProfileClient";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await getProfile(params.username);
  if (!profile) notFound();

  const currentUser = await getCurrentUser();
  const isOwnProfile = currentUser?.id === profile.id;

  const [following, saved] = await Promise.all([
    currentUser && !isOwnProfile
      ? isFollowing(currentUser.id, profile.id)
      : Promise.resolve(false),
    isOwnProfile && currentUser
      ? getSavedItems(currentUser.id).then((items) => items.map((s) => s.flexItem))
      : Promise.resolve([]),
  ]);

  return (
    <ProfileClient
      profile={profile}
      isOwnProfile={isOwnProfile}
      isFollowing={following}
      currentUserId={currentUser?.id ?? null}
      savedItems={saved}
    />
  );
}
