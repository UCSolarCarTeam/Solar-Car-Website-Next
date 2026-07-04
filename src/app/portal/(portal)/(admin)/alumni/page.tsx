import AlumniTable from "@/app/_components/PortalComponents/Portal/alumni/AlumniTable";
import { getAlumniList } from "@/app/portal/actions";

export const metadata = {
  title: "Alumni - Portal",
};

export default async function AlumniPage() {
  const alumni = await getAlumniList();
  return <AlumniTable alumni={alumni} />;
}
