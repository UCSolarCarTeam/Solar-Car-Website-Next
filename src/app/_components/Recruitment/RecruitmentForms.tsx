import Link from "next/link";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import { getRecruitmentForms } from "./actions";

export default async function RecruitmentForms({
  isRecruitmentClosed,
}: {
  isRecruitmentClosed: boolean;
}) {
  // This query runs while Next.js prerenders each flag permutation. Changing
  // recruitment forms therefore requires a new deployment.
  const recruitmentForms = await getRecruitmentForms();
  isRecruitmentClosed ||= recruitmentForms.length === 0;
  if (isRecruitmentClosed) {
    return (
      <div className="flex flex-wrap justify-center gap-12">
        <div className="flex flex-col items-center gap-4 text-center max-w-3xl">
          <div className="py-4 pb-12 text-xl font-normal">
            The current application period for the Calgary Solar Car Team is now
            closed. We'll be accepting new applications in the next semester. If
            you're excited about renewable energy, engineering innovation, and
            working with a passionate student team to build solar-powered
            vehicles, we encourage you to keep an eye on our{" "}
            <Link
              className="text-sc-amber underline"
              href="https://www.linkedin.com/company/university-ofcalgary-solar-car-team"
              target="_blank"
            >
              LinkedIn!
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap justify-center gap-12">
      {recruitmentForms?.map((form) => (
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
            <BasicButton className="bg-primary-red uppercase">
              Apply now
            </BasicButton>
          </Link>
        </div>
      ))}
    </div>
  );
}
