import TeamTable from "@/app/_components/PortalComponents/Portal/team/TeamTable";

import { getDBUsers } from "./actions";

export default async function page() {
  const dbUsers = await getDBUsers();

  return <TeamTable users={dbUsers ?? []} />;
}
