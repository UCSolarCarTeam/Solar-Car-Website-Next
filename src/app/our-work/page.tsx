"use client";

import Image from "next/image";
import backsplash1 from "public/assets/cars/backsplash1.png";
import backsplash2 from "public/assets/cars/backsplash2.jpeg";
import backsplash3 from "public/assets/cars/backsplash3.jpeg";
import backsplash4 from "public/assets/cars/backsplash4.jpeg";
import backsplash5 from "public/assets/cars/backsplash5.jpeg";
import backsplash6 from "public/assets/cars/backsplash6.jpeg";
import { memo, useCallback, useEffect, useState } from "react";

import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import Pagebullets from "@/app/_components/Pagebullets";
import styles from "@/app/our-work/index.module.scss";

const timelineData = [
  {
    months: [
      {
        description:
          "Frame design finalized and initial chassis welding completed.",
        image: backsplash1,
        month: "January",
      },
      {
        description:
          "Electrical system prototyping and solar array layout planning.",
        image: backsplash2,
        month: "February",
      },
    ],
    year: "2025",
  },
  {
    months: [
      {
        description: "Aerodynamic testing and battery cooling system upgrades.",
        image: backsplash3,
        month: "March",
      },
      {
        description:
          "Final assembly and race preparation for Formula Sun Grand Prix.",
        image: backsplash4,
        month: "April",
      },
    ],
    year: "2024",
  },
  {
    months: [
      {
        description: "Cruiser-class bodywork completed and first test drive.",
        image: backsplash5,
        month: "May",
      },
      {
        description: "Educational outreach and solar car demonstrations.",
        image: backsplash6,
        month: "June",
      },
    ],
    year: "2023",
  },
];

const Timeline = () => (
  <div className={styles.timeline}>
    {timelineData.map((yearData) => (
      <YearSection key={yearData.year} yearData={yearData} />
    ))}
  </div>
);

const YearSection = ({ yearData }: { yearData: (typeof timelineData)[0] }) => {
  const [monthIdx, setMonthIdx] = useState<number>(0);
  const month = yearData.months[monthIdx];

  return (
    <section className={styles.yearSection} id={yearData.year}>
      <div className={styles.yearContainer}>
        <div className={styles.yearLabelContainer}>
          <span className={styles.yearLabel}>{yearData.year}</span>
        </div>

        <div className={styles.monthCard}>
          {month && (
            <>
              <Image
                alt={month.month}
                className={styles.monthImage}
                src={month.image}
              />
              <div className={styles.monthContent}>
                <h3 className={styles.monthTitle}>{month.month}</h3>
                <p className={styles.monthDescription}>{month.description}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.horizontalDots}>
        {yearData.months.map((_, index) => (
          <button
            aria-label={`View ${yearData.months[index]?.month}`}
            className={`${styles.horizontalDot} ${index === monthIdx ? styles.active : ""}`}
            key={index}
            onClick={() => setMonthIdx(index)}
          />
        ))}
      </div>
    </section>
  );
};

const OurWorkTimelinePage = () => {
  // State for tracking current year section (similar to cars page)
  const [currentElement, setCurrentElement] = useState("2025");

  // Handle dot click for scrolling to year sections (same as cars page)
  const handleDotClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Intersection observer for tracking visible sections (same logic as cars page)
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
            setCurrentElement("2025"); // Default to first year
          } else {
            setCurrentElement(entry.target.id);
          }
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Trigger when 50% of the element is visible
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const elements = document.querySelectorAll("[id]"); // Select all elements with an `id`
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  return (
    <>
      <main className={styles.main}>
        <Navbar />
        {/* Vertical Dot Navigation for year sections - same as cars page */}
        <Pagebullets
          currentId={currentElement}
          handleDotClick={handleDotClick}
          pageIds={timelineData.map((data) => data.year)}
        />
        <div className={styles.container}>
          <div>
            <h1 className={styles.timelineHeading}>
              What We&apos;re Working On...
            </h1>
            <Timeline />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default memo(OurWorkTimelinePage);
