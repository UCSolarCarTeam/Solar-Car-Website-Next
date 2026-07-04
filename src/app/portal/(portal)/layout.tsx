import { redirect } from "next/navigation";

import PortalShell from "@/app/portal/_components/PortalShell";
import UnverifiedView from "@/app/portal/_components/UnverifiedView";
import { getPortalUser, isAdminRole } from "@/app/portal/_lib/auth";

export default async function PortalAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const portalUser = await getPortalUser();

  if (!portalUser) {
    redirect("/portal/sign-in");
  }

  if (portalUser.isUnverified) {
    return <UnverifiedView />;
  }

  return (
    <PortalShell
      isAdmin={isAdminRole(portalUser.role)}
      username={portalUser.username}
    >
      {children}
    </PortalShell>
  );
}
