import Link from "next/link";
import { memo, useMemo } from "react";

import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import styles from "@/app/recruitment/index.module.scss";

import BasicButton from "../_components/Buttons/BasicButton";

const Recruitment = () => {
  const applications = useMemo(
    () => [
      {
        description:
          "The University of Calgary Solar Car Team is a student-run organization that designs, builds, and races a Solar Car in competitions throughout North America. After a 2-year hiatus from racing in competition, we are aiming to race at the 2025 Formula Sun Grand Prix this summer. We are designing a new car, Schulich Helios, and Sponsorship's role is to raise funding, procure parts, and to maintain our current sponsor relationships. We are looking for 4-5 Sponsorship Associates to help us reach our goal of racing in Summer 2025.",
        link: "https://forms.office.com/Pages/ResponsePage.aspx?id=7KAJxuOlMUaWhhkigL2RUfHgMcdYrQFJs3mnRL_BDrVUN0FDMExRSkFKRFY3VkkxQjhLTElDUDJSSS4u",
        title: "Sponsorship Team",
      },
      {
        description:
          "The Accounting sub-team oversees all financial reporting for the team to ensure transparency and accuracy. Tasks include: day-to-day tracking of expenditures, processing and issuing reimbursements, bank reconciliations for tracking checks coming in and out. Most recently, the accounting sub-team has focused on strengthening internal controls and processes as they re-designed the teams' reimbursement system.",
        link: "https://forms.office.com/Pages/ResponsePage.aspx?id=7KAJxuOlMUaWhhkigL2RUdMkK0iBkSdAvQ3FRCxoFuVUOUozTUJaODY5WjNJV1BLSlc0QlhKRUVHRC4u",
        title: "Accounting Team",
      },
      {
        description:
          "Have a passion for engineering cars? Our mechanical team are the driving force behind designing and building the car’s body, chassis, suspension system, roll cage, and integrating electrical components into the car",
        link: "https://forms.office.com/r/yv6P20EAe9",
        title: "Mechanical Team",
      },
    ],
    [],
  );
  return (
    <>
      <main className={styles.main}>
        <>
          <Navbar />
          <div className={styles.container}>
            <div className={styles.pageHeading}>Applications</div>
            <div className={styles.applicationContainer}>
              {applications.map((application) => (
                <div className={styles.application} key={application.title}>
                  <div className={styles.applicationTitle}>
                    {application.title}
                  </div>
                  <div className={styles.applicationDescription}>
                    {application.description}
                  </div>
                  <Link
                    href={application.link}
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
              ))}
            </div>
          </div>
        </>
      </main>
      <Footer />
    </>
  );
};

export default memo(Recruitment);
