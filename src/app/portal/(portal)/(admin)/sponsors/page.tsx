import SponsorsTable from "@/app/_components/PortalComponents/Portal/sponsors/SponsorsTable";
import { HydrateClient, trpc } from "@/trpc/server";

export const metadata = {
  title: "Sponsors - Portal",
};

export default async function SponsorsPage() {
  const sponsors = await trpc.portal.getSponsorsList();

  return (
    <HydrateClient>
      <SponsorsTable sponsors={sponsors} />
    </HydrateClient>
  );
}
