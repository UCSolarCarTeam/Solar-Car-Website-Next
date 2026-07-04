import AlumniTable from "@/app/_components/PortalComponents/Portal/alumni/AlumniTable";
import { HydrateClient, trpc } from "@/trpc/server";

export const metadata = {
  title: "Alumni - Portal",
};

export default async function AlumniPage() {
  const alumni = await trpc.portal.getAlumniList();

  return (
    <HydrateClient>
      <AlumniTable alumni={alumni} />
    </HydrateClient>
  );
}
