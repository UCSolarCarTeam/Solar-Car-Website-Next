import InvitationsTable from "@/app/_components/PortalComponents/Portal/Invitations/InvitationsTable";
import { getInvitedUsers } from "@/app/portal/_actions/queries";

export const metadata = {
  title: "Invitations - Portal",
};

export default async function InvitationsPage() {
  const invitations = await getInvitedUsers();
  return <InvitationsTable invitations={invitations} />;
}
