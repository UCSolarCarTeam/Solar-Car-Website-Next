"use client";

import { memo, useCallback, useEffect, useState } from "react";

import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import Timeline from "@/app/_components/OurWork/Timeline";
import Pagebullets from "@/app/_components/Pagebullets";
import styles from "@/app/our-work/index.module.scss";
import { trpc } from "@/trpc/react";

const OurWorkTimelinePage = () => {
  const { data: timelineData } = trpc.fe.getOurWork.useQuery();
  const [currentElement, setCurrentElement] = useState<string>(
    timelineData?.[0]?.year ?? "2025",
  );

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

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (
            entry.target.id === "__next" ||
            entry.target.id === "__next-build-watcher" ||
            entry.target.id === "locatorjs-wrapper" ||
            entry.target.id === "clerk-components"
          ) {
            if (timelineData && timelineData.length > 0 && timelineData[0]) {
              setCurrentElement(timelineData[0].year);
            }
          } else {
            setCurrentElement(entry.target.id);
          }
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const elements = document.querySelectorAll("[id]");
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, [timelineData]);

  return (
    <>
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
            <Timeline data={timelineData} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default memo(OurWorkTimelinePage);
