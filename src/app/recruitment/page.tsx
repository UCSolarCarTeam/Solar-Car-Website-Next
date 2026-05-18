import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import RecruitmentForms from "@/app/_components/Recruitment/RecruitmentForms";
import styles from "@/app/recruitment/index.module.scss";
import { recruitmentOpen } from "@/flags";
import { HydrateClient } from "@/trpc/server";

const Recruitment = async () => {
  const isRecruitmentClosed = !(await recruitmentOpen());
  return (
    <HydrateClient>
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
            <RecruitmentForms isRecruitmentClosed={isRecruitmentClosed} />
          </div>
        </>
      </main>
      <Footer />
    </HydrateClient>
  );
};

export default Recruitment;
