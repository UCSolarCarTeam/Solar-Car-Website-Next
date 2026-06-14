import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import RecruitmentForms from "@/app/_components/Recruitment/RecruitmentForms";
import styles from "@/app/recruitment/index.module.scss";
import { recruitmentOpen } from "@/flags";

import { getRecruitmentForms } from "./actions";

const Recruitment = async () => {
  const isRecruitmentClosed = !(await recruitmentOpen());
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
