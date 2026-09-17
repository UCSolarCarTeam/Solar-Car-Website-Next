import Link from "next/link";
import { getRecruitment } from "@/app/recruitment/[recruitmentCode]/actions";
import MagneticButton from "@/components/ui/MagneticButton";
import ClosedRecruitment from "./ClosedRecruitment";

export default async function RecruitmentForms() {
  const recruitmentForms = await getRecruitment();

  if (!recruitmentForms.length) {
    return <ClosedRecruitment />;
  }

  return (
    <div className="flex flex-wrap justify-center gap-12">
      {recruitmentForms.map((form) => (
        <div
          className="flex min-w-[20%] max-w-[40%] flex-col items-center gap-4 text-center max-lg:min-w-full"
          key={form.header}
        >
          <div className="text-3xl font-semibold">{form.header}</div>
          <div className="py-4 pb-12 text-lg font-normal">
            {form.description}
          </div>
          <Link
            className="mt-auto"
            href={form.link}
            rel="noopener noreferrer"
            target="_blank"
          >
            <MagneticButton className="border-none bg-sc-amber px-12 py-4 font-sans text-lg font-semibold tracking-wide text-sc-bg uppercase">
              Apply now
            </MagneticButton>
          </Link>
        </div>
      ))}
    </div>
  );
}
