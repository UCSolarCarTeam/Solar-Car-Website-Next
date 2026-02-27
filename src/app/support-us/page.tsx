import Link from "next/link";
import backsplash from "public/assets/support-us/backsplash.jpeg";
import { memo } from "react";

import Footer from "@/app/_components/Footer";
import ImageHero from "@/app/_components/ImageHero/ImageHero";
import Navbar from "@/app/_components/Navbar";
import styles from "@/app/support-us/index.module.scss";

const SupportUs = () => {
  return (
    <>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.pageHeading}>Support Our Team</div>
          <div className={styles.descriptionContainer}>
            <div>
              {`The University of Calgary Solar Car Team builds and operates our car
            and program through kind support from generous sponsors. You can
            support us through sponsoring, donating and helping us through in
            kind donations.`}
            </div>
          </div>
          <div className={styles.supportButton}>
            <Link href="mailto:sponsorship@calgarysolarcar.ca">
              Sponsor, Contribute and Donate
            </Link>
          </div>
          <ImageHero src={backsplash} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default memo(SupportUs);
