import InvitationsTable from "@/app/_components/PortalComponents/Portal/Invitations/InvitationsTable";
import { getInvitedUsers } from "@/app/portal/actions";

export const metadata = {
  title: "Invitations - Portal",
};

export default async function InvitationsPage() {
  const invitations = await getInvitedUsers();
  return <InvitationsTable invitations={invitations} />;
}
