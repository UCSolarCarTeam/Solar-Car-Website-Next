import { memo } from "react";

import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import Timeline from "@/app/_components/OurWork/Timeline";
import PageBulletsClient from "@/app/_components/Pagebullets/PageBulletsClientWrapper";
import styles from "@/app/our-work/index.module.scss";
import { trpc } from "@/trpc/server";

const OurWorkTimelinePage = async () => {
  const timelineData = await trpc.fe.getOurWork();

  return (
    <>
      <main className={styles.main}>
        <Navbar />
        {timelineData && timelineData.length > 0 && (
          <PageBulletsClient
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
      </main>
      <Footer />
    </>
  );
};

export default memo(OurWorkTimelinePage);
