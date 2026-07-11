import Link from "next/link";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import { trpc } from "@/trpc/server";

export default async function RecruitmentForms({
  isRecruitmentClosed,
}: {
  isRecruitmentClosed: boolean;
}) {
  const recruitmentForms = await trpc.fe.getRecruitment();

  return (
    <div className="flex flex-wrap justify-center gap-12">
      {isRecruitmentClosed ? (
        <div className="flex min-w-[20%] max-w-[40%] flex-col items-center gap-4 text-center max-lg:min-w-full">
          <div className="py-4 pb-12 text-xl font-normal">
            The current application period for the Calgary Solar Car Team is now
            closed. We’ll be accepting new applications in the next semester. If
            you’re excited about renewable energy, engineering innovation, and
            working with a passionate student team to build solar-powered
            vehicles, we encourage you to keep an eye on our{" "}
            <Link href="https://www.linkedin.com/company/university-of-calgary-solar-car-team">
              LinkedIn!
            </Link>
          </div>
        </div>
      ) : (
        recruitmentForms?.map((form) => (
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
        ))
      )}
    </div>
  );
}
