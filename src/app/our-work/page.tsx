"use client";

import { memo } from "react";

import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import styles from "@/app/recruitment/index.module.scss";

const WhatWereWorkingOn = () => {
  return (
    <>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.pageHeading}>What We're Working On</div>

          <div className={styles.applicationContainer}>
            <div className={styles.application}>
              <div className={styles.applicationTitle}>
                Next-Generation Solar Car
              </div>
              <div className={styles.applicationDescription}>
                Our engineering team is currently designing and building our
                next solar-powered vehicle for international competition. The
                focus is on energy efficiency, lightweight materials, and
                cutting-edge aerodynamics.
              </div>
            </div>

            <div className={styles.application}>
              <div className={styles.applicationTitle}>
                Battery & Power Systems
              </div>
              <div className={styles.applicationDescription}>
                We are working on developing a safe and efficient battery
                management system that maximizes performance and ensures
                reliability on long-distance races.
              </div>
            </div>

            <div className={styles.application}>
              <div className={styles.applicationTitle}>Community Outreach</div>
              <div className={styles.applicationDescription}>
                Beyond engineering, we are engaging with schools and the local
                community to inspire the next generation of innovators and
                promote renewable energy awareness.
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default memo(WhatWereWorkingOn);
