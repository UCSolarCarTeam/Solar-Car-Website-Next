"use client";

import InlineUserPopup from "@/app/_components/PortalComponents/EditUserCell/InlineUserPopup";
import { useUser } from "@/app/_hooks/useUser";
import { type RouterOutputs } from "@/trpc/react";

type DBUser = RouterOutputs["portal"]["getCurrentDBUser"];

export default function ProfileContent({ dbUser }: { dbUser: DBUser }) {
  const { isLoaded, user } = useUser();

  if (!isLoaded || !user || !dbUser) {
    return null;
  }

  return <InlineUserPopup clerkUser={user} user={dbUser} />;
}
