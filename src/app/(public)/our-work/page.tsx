import { type Metadata } from "next";
import { memo } from "react";

import Timeline from "@/app/_components/OurWork/Timeline";
import Pagebullets from "@/app/_components/Pagebullets";
import { trpcStatic } from "@/trpc/server";

import styles from "./index.module.scss";

export const metadata: Metadata = {
  description:
    "Explore the University of Calgary Solar Car Team's journey through innovation and sustainable energy. See our timeline of achievements, projects, and milestones as we work towards a greener future.",
  title: "What We're Working On | University of Calgary Solar Car Team",
};

const OurWorkTimelinePage = async () => {
  const timelineData = await trpcStatic.fe.getOurWork();

  return (
    <div className={styles.main}>
      {timelineData && timelineData.length > 0 && (
        <Pagebullets
          defaultCurrentId={timelineData[0]?.year ?? "2025"}
          pageIds={timelineData.map((data) => data.year)}
        />
      )}
      <div className={styles.container}>
        <div>
          <h1 className={styles.timelineHeading}>
            What We&apos;re Working On...
          </h1>
          <Timeline data={timelineData ?? []} />
        </div>
      </div>
    </div>
  );
};

export default memo(OurWorkTimelinePage);
