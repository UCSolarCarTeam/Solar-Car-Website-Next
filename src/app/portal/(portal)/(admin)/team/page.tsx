import TeamTable from "@/app/_components/PortalComponents/Portal/team/TeamTable";
import { HydrateClient, trpc } from "@/trpc/server";

export const metadata = {
  title: "Team - Portal",
};

export default async function TeamPage() {
  const users = await trpc.portal.getDBUsers();

  return (
    <HydrateClient>
      <TeamTable users={users} />
    </HydrateClient>
  );
}
