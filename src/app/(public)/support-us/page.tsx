import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import backsplash from "public/assets/support-us/backsplash.jpeg";
import { memo } from "react";

import styles from "./index.module.scss";

export const metadata: Metadata = {
  description:
    "Support the University of Calgary Solar Car Team through sponsorship, donations and in kind contributions.",
  title: "Support Us | University of Calgary Solar Car Team",
};

const SupportUs = () => {
  return (
    <div className={styles.main}>
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
        <Image
          alt="backsplash"
          fill
          id="backsplashImage"
          loading="eager"
          placeholder="blur"
          priority
          src={backsplash}
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default memo(SupportUs);
