"use client";

import InlineUserPopup from "@/app/_components/PortalComponents/EditUserCell/InlineUserPopup";
import { useUser } from "@/app/_hooks/useUser";
import { type User } from "@prisma/client";

export default function ProfileContent({ dbUser }: { dbUser: User | null }) {
  const { isLoaded, user } = useUser();

  if (!isLoaded || !user || !dbUser) {
    return null;
  }

  return <InlineUserPopup clerkUser={user} user={dbUser} />;
}
