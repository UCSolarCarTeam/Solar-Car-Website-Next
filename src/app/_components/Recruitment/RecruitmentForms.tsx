"use client";

import Link from "next/link";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import { trpc } from "@/trpc/server";

export default async function RecruitmentForms({
  isRecruitmentClosed,
}: {
  isRecruitmentClosed: boolean;
}) {
  const {
    data: recruitmentForms,
    isError,
    isPending,
    refetch,
  } = trpc.fe.getRecruitment.useQuery(undefined, {
    enabled: !isRecruitmentClosed,
    refetchOnMount: "always",
    staleTime: 0,
  });

  if (isRecruitmentClosed) {
    return <ClosedRecruitment />;
  }

  if (isPending) {
    return (
      <div
        aria-live="polite"
        className="sc-mono py-12 text-center text-sm text-sc-grey-light"
        role="status"
      >
        Loading recruitment opportunities...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <p className="text-sc-grey-light">
          We couldn't load the recruitment opportunities.
        </p>
        <BasicButton
          className="bg-primary-red uppercase"
          onClick={() => void refetch()}
        >
          Try again
        </BasicButton>
      </div>
    );
  }

  if (!recruitmentForms.length) {
    return <ClosedRecruitment />;
  }

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
