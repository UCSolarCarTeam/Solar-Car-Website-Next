import { type Metadata } from "next";
import { memo } from "react";

import RecruitmentForms from "@/app/_components/Recruitment/RecruitmentForms";
import { HydrateClient } from "@/trpc/server";

import styles from "./index.module.scss";

export const metadata: Metadata = {
  description:
    "Join the University of Calgary Solar Car Team! Apply now to be part of our innovative team working on sustainable energy solutions and solar racing technology.",
  title: "Recruitment | University of Calgary Solar Car Team",
};

const RELEASE_DATE = new Date("2025-08-23T00:00:00");
const isRecruitmentClosed = RELEASE_DATE < new Date();
const Recruitment = () => {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={styles.pageHeading}>Applications</div>
        {!isRecruitmentClosed && (
          <div className={styles.applicationDescription}>
            Applications close on September 13th.
          </div>
        )}
        <HydrateClient>
          <RecruitmentForms isRecruitmentClosed={isRecruitmentClosed} />
        </HydrateClient>
      </div>
    </div>
  );
};

export default memo(Recruitment);
