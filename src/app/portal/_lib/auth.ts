import { redirect } from "next/navigation";

import { adminClerkRoles } from "@/app/_types";
import { type AdminRoles } from "@/server/portal/types";
import { type User, currentUser } from "@clerk/nextjs/server";

export type PortalRole = AdminRoles | "member" | "unverified";

export type PortalUser = {
  isUnverified: boolean;
  role: PortalRole | undefined;
  user: User;
  username: string;
};

export function isAdminRole(role: PortalRole | undefined): role is AdminRoles {
  return !!role && adminClerkRoles.includes(role as AdminRoles);
}

export async function getPortalUser(): Promise<PortalUser | null> {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const role = user.publicMetadata?.role as PortalRole | undefined;
  const isUnverified = !role || role === "unverified";

  return {
    isUnverified,
    role,
    user,
    username: user.username ?? "",
  };
}

export async function requireAuthenticatedPortalUser(): Promise<PortalUser> {
  const portalUser = await getPortalUser();
  if (!portalUser) {
    redirect("/portal/sign-in");
  }
  if (portalUser.isUnverified) {
    redirect("/portal");
  }
  return portalUser;
}

export async function requireAdmin(): Promise<PortalUser> {
  const portalUser = await requireAuthenticatedPortalUser();
  if (!isAdminRole(portalUser.role)) {
    redirect("/portal/profile");
  }
  return portalUser;
}
