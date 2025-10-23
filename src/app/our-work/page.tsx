"use client";

import { memo, useCallback, useEffect, useState } from "react";

import Footer from "@/app/_components/Footer";
import Loader from "@/app/_components/Loader";
import Navbar from "@/app/_components/Navbar";
import Timeline from "@/app/_components/OurWork/Timeline";
import Pagebullets from "@/app/_components/Pagebullets";
import styles from "@/app/our-work/index.module.scss";
import { trpc } from "@/trpc/react";

import { useIntersectionObserver } from "../_hooks/useIntersectionObserver";

const OurWorkTimelinePage = () => {
  const { data: timelineData, isFetching } = trpc.fe.getOurWork.useQuery();
  const [currentElement, setCurrentElement] = useState<string>(
    timelineData?.[0]?.year ?? "2025",
  );

  useIntersectionObserver(timelineData, setCurrentElement, (item) => item.year);

  useEffect(() => {
    if (timelineData && timelineData.length > 0 && timelineData[0]) {
      setCurrentElement(timelineData[0].year);
    }
  }, [timelineData]);

  const handleDotClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <>
      {isFetching && <Loader isLoading={isFetching} />}
      <main className={styles.main}>
        <Navbar />
        {timelineData && (
          <Pagebullets
            currentId={currentElement}
            handleDotClick={handleDotClick}
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
