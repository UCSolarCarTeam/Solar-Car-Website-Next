import { memo } from "react";

import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import styles from "@/app/recruitment/index.module.scss";

const Recruitment = () => {
  // const applications = useMemo(
  //   () => [
  //     {
  //       description:
  //         "We are designing a new car, Schulich Helios, and Sponsorship's role is to raise funding, procure parts, and to maintain our current sponsor relationships. We are looking for 4-5 Sponsorship Associates to help us reach our goal of racing in the 2025 Formula Sun Grand Prix this summer.",
  //       link: "https://forms.office.com/Pages/ResponsePage.aspx?id=7KAJxuOlMUaWhhkigL2RUfHgMcdYrQFJs3mnRL_BDrVUN0FDMExRSkFKRFY3VkkxQjhLTElDUDJSSS4u",
  //       title: "Sponsorship Team",
  //     },
  //     {
  //       description:
  //         "The Accounting sub-team oversees all financial reporting for the team to ensure transparency and accuracy. Tasks include: day-to-day tracking of expenditures, processing and issuing reimbursements, bank reconciliations for tracking checks coming in and out. Most recently, the accounting sub-team has focused on strengthening internal controls and processes as they re-designed the teams' reimbursement system.",
  //       link: "https://forms.office.com/Pages/ResponsePage.aspx?id=7KAJxuOlMUaWhhkigL2RUdMkK0iBkSdAvQ3FRCxoFuVUOUozTUJaODY5WjNJV1BLSlc0QlhKRUVHRC4u",
  //       title: "Accounting Team",
  //     },
  //     {
  //       description:
  //         "Have a passion for engineering cars? Our mechanical team are the driving force behind designing and building the car’s body, chassis, suspension system, roll cage, and integrating electrical components into the car",
  //       link: "https://forms.office.com/r/yv6P20EAe9",
  //       title: "Mechanical Team",
  //     },
  //   ],
  //   [],
  // );
  return (
    <>
      <main className={styles.main}>
        <>
          <Navbar />
          <div className={styles.container}>
            <div className={styles.pageHeading}>Applications</div>
            <div className={styles.applicationContainer}>
              {/* {applications.map((application) => (
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
              ))} */}
            </div>

            <div className={styles.application}>
              <div className={styles.applicationDescription}>
                The current application period for the Calgary Solar Car Team is
                now closed. We’ll be accepting new applications in September. If
                you’re excited about renewable energy, engineering innovation,
                and working with a passionate student team to build
                solar-powered vehicles, we encourage you to apply then!
              </div>
            </div>
          </div>
        </>
      </main>
      <Footer />
    </>
  );
};

export default memo(Recruitment);
