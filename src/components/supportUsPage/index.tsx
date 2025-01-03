import Image from "next/image";
import { memo } from "react";

import Navbar from "@/components/Navbar";
import styles from "@/components/supportUsPage/index.module.scss";

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
          fill
          priority
          src="/assets/support-us/backsplash.jpeg"
          style={{ objectFit: "cover" }}
        />
      </div>
    </>
  );
};

export default memo(SupportUsPage);
