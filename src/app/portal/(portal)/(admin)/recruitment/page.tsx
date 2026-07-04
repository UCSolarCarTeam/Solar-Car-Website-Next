import RecruitmentTable from "@/app/_components/PortalComponents/Portal/recruitment/RecruitmentTable";
import { getFormsList } from "@/app/portal/_actions/queries";

export const metadata = {
  title: "Recruitment - Portal",
};

export default async function RecruitmentPage() {
  const forms = await getFormsList();
  return <RecruitmentTable forms={forms} />;
}
