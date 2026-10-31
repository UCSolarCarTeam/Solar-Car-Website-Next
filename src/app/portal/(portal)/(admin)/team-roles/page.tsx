import { redirect } from "next/navigation";
import TeamRolesManager from "@/app/portal/_components/TeamRolesManager";
import { requireAdmin } from "@/app/portal/_lib/auth";
import { getTeamRoles } from "@/app/portal/actions";

export const metadata = { title: "Team Roles - Portal" };

export default async function TeamRolesPage() {
  const portalUser = await requireAdmin();
  if (portalUser.role !== "admin") redirect("/portal/profile");
  const roles = await getTeamRoles();
  return <TeamRolesManager roles={roles} />;
}
