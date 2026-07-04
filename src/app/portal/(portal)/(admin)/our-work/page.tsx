import OurWorkEntriesTable from "@/app/_components/PortalComponents/Portal/our-work/OurWorkEntriesTable";
import { HydrateClient, trpc } from "@/trpc/server";

export const metadata = {
  title: "Our Work - Portal",
};

export default async function OurWorkPage() {
  const entries = await trpc.portal.getOurWorkList();

  return (
    <HydrateClient>
      <OurWorkEntriesTable entries={entries} />
    </HydrateClient>
  );
}
