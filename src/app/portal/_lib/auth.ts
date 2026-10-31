import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  isAdminRole,
  type PortalRole,
  type PortalUser,
} from "@/app/portal/_lib/user";

export {
  isAdminRole,
  type PortalRole,
  type PortalUser,
} from "@/app/portal/_lib/user";

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
