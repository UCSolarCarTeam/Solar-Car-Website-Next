import UsersTable from "@/app/_components/PortalComponents/Portal/users/UsersTable";
import { HydrateClient, trpc } from "@/trpc/server";

export const metadata = {
  title: "Users - Portal",
};

export default async function UsersPage() {
  const users = await trpc.portal.getClerkUsers();

  return (
    <HydrateClient>
      <UsersTable data={users} />
    </HydrateClient>
  );
}
