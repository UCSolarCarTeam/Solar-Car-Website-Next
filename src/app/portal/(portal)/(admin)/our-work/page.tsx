import OurWorkEntriesTable from "@/app/_components/PortalComponents/Portal/our-work/OurWorkEntriesTable";
import { getOurWorkList } from "@/app/portal/actions";

export const metadata = {
  title: "Our Work - Portal",
};

export default async function OurWorkPage() {
  const entries = await getOurWorkList();
  return <OurWorkEntriesTable entries={entries} />;
}
