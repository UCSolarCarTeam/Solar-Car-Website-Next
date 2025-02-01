import Image from "next/image";
import backsplash from "public/assets/support-us/backsplash.jpeg";
import { memo } from "react";

import Navbar from "@/components/Navbar";
import styles from "@/pages/support-us/index.module.scss";

const SupportUsPage = () => {
  return (
    <>
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
        <Image
          alt="backsplash"
          className={styles.backsplashImage}
          fill
          loading="eager"
          placeholder="blur"
          priority
          src={backsplash}
          style={{ objectFit: "cover" }}
        />
      </div>
    </>
  );
};

export default memo(SupportUsPage);
