import UsersTable from "@/app/_components/PortalComponents/Portal/users/UsersTable";
import { getClerkUsers } from "@/app/portal/_actions/queries";

export const metadata = {
  title: "Users - Portal",
};

export default async function UsersPage() {
  const users = await getClerkUsers();
  return <UsersTable data={users} />;
}
