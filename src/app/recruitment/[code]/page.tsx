import { generatePermutations } from "flags/next";

import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import RecruitmentForms from "@/app/_components/Recruitment/RecruitmentForms";
import styles from "@/app/recruitment/[code]/index.module.scss";
import { recruitmentFlags, recruitmentOpen } from "@/flags";

import { getRecruitmentForms } from "./actions";

export async function generateStaticParams() {
  const codes = await generatePermutations(recruitmentFlags);
  return codes.map((code) => ({ code }));
}
const Recruitment = async (props: { params: Promise<{ code: string }> }) => {
  const { code } = await props.params;
  const isRecruitmentClosed = !(await recruitmentOpen(code, recruitmentFlags));
  const recruitmentForms = await getRecruitmentForms();

  return (
    <>
      <main className={styles.main}>
        <>
          <Navbar />
          <div className={styles.container}>
            <div className={styles.pageHeading}>Applications</div>
            {!isRecruitmentClosed && (
              <div className={styles.applicationDescription}>
                Applications close on September 13th.
              </div>
            )}
            <RecruitmentForms
              isRecruitmentClosed={isRecruitmentClosed}
              recruitmentForms={recruitmentForms}
            />
          </div>
        </>
      </main>
      <Footer />
    </>
  );
};

export default Recruitment;
