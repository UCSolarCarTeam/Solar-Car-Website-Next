"use client";

import Link from "next/link";
import { memo } from "react";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import Footer from "@/app/_components/Footer";
import Loader from "@/app/_components/Loader";
import Navbar from "@/app/_components/Navbar";
import styles from "@/app/recruitment/index.module.scss";
import { trpc } from "@/trpc/react";

const Recruitment = () => {
  const { data: recruitmentForms, isFetching } =
    trpc.fe.getRecruitment.useQuery();

  const RELEASE_DATE = new Date("2025-08-23T00:00:00");
  const isRecruitmentClosed = RELEASE_DATE < new Date();
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
            <div className={styles.applicationContainer}>
              {isFetching ? (
                <Loader isLoading={isFetching} />
              ) : isRecruitmentClosed ? (
                <div className={styles.application}>
                  <div className={styles.applicationDescription}>
                    The current application period for the Calgary Solar Car
                    Team is now closed. We’ll be accepting new applications in
                    the next semester. If you’re excited about renewable energy,
                    engineering innovation, and working with a passionate
                    student team to build solar-powered vehicles, we encourage
                    you to keep an eye on our{" "}
                    <Link href="https://www.linkedin.com/company/university-of-calgary-solar-car-team">
                      LinkedIn!
                    </Link>
                  </div>
                </div>
              ) : (
                recruitmentForms?.map((form) => (
                  <div className={styles.application} key={form.header}>
                    <div className={styles.applicationTitle}>{form.header}</div>
                    <div className={styles.applicationDescription}>
                      {form.description}
                    </div>
                    <Link
                      href={form.link}
                      style={{ marginTop: "auto" }}
                      target="_blank"
                    >
                      <BasicButton
                        style={{
                          backgroundColor: "var(--primary-red)",
                          textTransform: "uppercase",
                        }}
                      >
                        Apply now
                      </BasicButton>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      </main>
      <Footer />
    </>
  );
};

export default memo(Recruitment);
