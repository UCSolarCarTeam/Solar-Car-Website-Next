import { redirect } from "next/navigation";
import PortalShell from "@/app/portal/_components/PortalShell";
import { TeamRolesProvider } from "@/app/portal/_components/TeamRolesProvider";
import UnverifiedView from "@/app/portal/_components/UnverifiedView";
import { getPortalUser } from "@/app/portal/_lib/auth";
import { db } from "@/server/db";

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

  const roles = await db.teamRole.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <TeamRolesProvider roles={roles}>
      <PortalShell portalUser={portalUser}>{children}</PortalShell>
    </TeamRolesProvider>
  );
}
