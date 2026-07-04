import SponsorsTable from "@/app/_components/PortalComponents/Portal/sponsors/SponsorsTable";
import { getSponsorsList } from "@/app/portal/actions";

export const metadata = {
  title: "Sponsors - Portal",
};

export default async function SponsorsPage() {
  const sponsors = await getSponsorsList();
  return <SponsorsTable sponsors={sponsors} />;
}
