import { generatePermutations } from "flags/next";
import { recruitmentFlags, recruitmentOpen } from "@/flags";
import RecruitmentContent from "../RecruitmentContent";

export const metadata = {
  title: "Recruitment | Calgary Solar Car",
  description:
    "Join the University of Calgary Solar Car Team and help build the future of sustainable transportation.",
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const codes = await generatePermutations(recruitmentFlags);

  return codes.map((recruitmentCode) => ({ recruitmentCode }));
}

export default async function Recruitment({
  params,
}: {
  params: Promise<{ recruitmentCode: string }>;
}) {
  const { recruitmentCode } = await params;
  const isRecruitmentClosed = !(await recruitmentOpen(
    recruitmentCode,
    recruitmentFlags,
  ));

  return <RecruitmentContent isRecruitmentClosed={isRecruitmentClosed} />;
}
