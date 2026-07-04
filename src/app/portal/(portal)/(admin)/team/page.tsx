import TeamTable from "@/app/_components/PortalComponents/Portal/team/TeamTable";
import { getDBUsers } from "@/app/portal/_actions/queries";

export const metadata = {
  title: "Team - Portal",
};

export default async function TeamPage() {
  const users = await getDBUsers();
  return <TeamTable users={users} />;
}
