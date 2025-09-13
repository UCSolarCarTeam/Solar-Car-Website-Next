"use client";

import Image from "next/image";
import backsplash1 from "public/assets/cars/backsplash1.png";
import backsplash2 from "public/assets/cars/backsplash2.jpeg";
import backsplash3 from "public/assets/cars/backsplash3.jpeg";
import backsplash4 from "public/assets/cars/backsplash4.jpeg";
import backsplash5 from "public/assets/cars/backsplash5.jpeg";
import backsplash6 from "public/assets/cars/backsplash6.jpeg";
import { memo, useState } from "react";

import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import Chevron from "@/app/_components/svgs/Chevron";
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
  <div style={{ margin: "0 auto", maxWidth: 900, width: "100%" }}>
    {timelineData.map((yearData) => (
      <YearSection key={yearData.year} yearData={yearData} />
    ))}
  </div>
);

const YearSection = ({ yearData }: { yearData: (typeof timelineData)[0] }) => {
  const [monthIdx, setMonthIdx] = useState<number>(0);
  const month = yearData.months[monthIdx];
  const handlePrev = () =>
    setMonthIdx((idx: number) =>
      idx > 0 ? idx - 1 : yearData.months.length - 1,
    );
  const handleNext = () =>
    setMonthIdx((idx: number) =>
      idx < yearData.months.length - 1 ? idx + 1 : 0,
    );
  return (
    <section style={{ position: "relative" }}>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            height: "400px",
            justifyContent: "center",
            minWidth: "60px",
          }}
        >
          <span
            style={{
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              color: "#fff",
              fontSize: "8rem",
              fontWeight: 700,
              letterSpacing: "2px",
              marginRight: "12rem",
              backgroundColor: "var(--primary-red)",
              padding: "1rem 0.5rem",
              textOrientation: "mixed",
              userSelect: "none",
              writingMode: "vertical-rl",
            }}
          >
            {yearData.year}
          </span>
        </div>
        <button
          aria-label="Previous month"
          className={styles.chevronBtn}
          onClick={handlePrev}
        >
          <span className={styles.chevronIconLeft}>
            <Chevron className={styles.chevronSvg} />
          </span>
        </button>
        <div
          style={{
            alignItems: "center",
            borderRadius: "16px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            color: "#fff",

            display: "flex",
            flex: 1,
            gap: "2rem",
            padding: "1rem",
          }}
        >
          {month && (
            <>
              <Image
                alt={month.month}
                src={month.image}
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  height: "400px",
                  objectFit: "cover",
                  width: "800px",
                }}
              />
              <div>
                <h3
                  style={{
                    backgroundColor: "var(--primary-red)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontWeight: 600,
                    margin: 0,
                    padding: "8px",
                  }}
                >
                  {month.month}
                </h3>
                <p style={{ color: "#fff", margin: "0.5rem 0 0 0.3rem" }}>
                  {month.description}
                </p>
              </div>
            </>
          )}
        </div>
        <button
          aria-label="Next month"
          className={styles.chevronBtn}
          onClick={handleNext}
        >
          <span className={styles.chevronIconRight}>
            <Chevron className={styles.chevronSvg} />
          </span>
        </button>
      </div>
    </section>
  );
};

const OurWorkTimelinePage = () => {
  return (
    <>
      <main
        style={{
          minHeight: "100vh",
          paddingBottom: "2rem",
        }}
      >
        <Navbar />
        <div style={{ padding: "2rem 0" }}>
          <h1
            style={{
              color: "white",
              fontSize: "3rem",
              fontWeight: 700,
              marginLeft: "10rem",
              textAlign: "left",
            }}
          >
            What We're Working On...
          </h1>
          <Timeline />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default memo(OurWorkTimelinePage);
