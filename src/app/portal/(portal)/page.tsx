import { redirect } from "next/navigation";

import { getPortalUser, isAdminRole } from "@/app/portal/_lib/auth";

export default async function PortalPage() {
  const portalUser = await getPortalUser();
  if (!portalUser || portalUser.isUnverified) {
    return null;
  }

  if (isAdminRole(portalUser.role)) {
    redirect("/portal/team");
  }

  redirect("/portal/profile");
}
