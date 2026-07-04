import RecruitmentTable from "@/app/_components/PortalComponents/Portal/recruitment/RecruitmentTable";
import { HydrateClient, trpc } from "@/trpc/server";

export const metadata = {
  title: "Recruitment - Portal",
};

export default async function RecruitmentPage() {
  const forms = await trpc.portal.getFormsList();

  return (
    <HydrateClient>
      <RecruitmentTable forms={forms} />
    </HydrateClient>
  );
}
