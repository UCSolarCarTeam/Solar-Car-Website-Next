import InvitationsTable from "@/app/_components/PortalComponents/Portal/Invitations/InvitationsTable";
import { HydrateClient, trpc } from "@/trpc/server";

export const metadata = {
  title: "Invitations - Portal",
};

export default async function InvitationsPage() {
  const invitations = await trpc.portal.getInvitedUsers();

  return (
    <HydrateClient>
      <InvitationsTable invitations={invitations} />
    </HydrateClient>
  );
}
