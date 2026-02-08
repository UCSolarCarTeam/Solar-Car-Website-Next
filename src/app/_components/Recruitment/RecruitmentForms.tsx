import Link from "next/link";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import { trpcStatic } from "@/trpc/server";

import styles from "./index.module.scss";

export default async function RecruitmentForms({
  isRecruitmentClosed,
}: {
  isRecruitmentClosed: boolean;
}) {
  const recruitmentForms = await trpcStatic.fe.getRecruitment();

  return (
    <div className={styles.applicationContainer}>
      {isRecruitmentClosed ? (
        <div className={styles.application}>
          <div className={styles.applicationDescription}>
            The current application period for the Calgary Solar Car Team is now
            closed. We’ll be accepting new applications in the next semester. If
            you’re excited about renewable energy, engineering innovation, and
            working with a passionate student team to build solar-powered
            vehicles, we encourage you to keep an eye on our{" "}
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
              rel="noopener noreferrer"
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
  );
}
