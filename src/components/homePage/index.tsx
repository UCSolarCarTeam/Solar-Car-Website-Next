import Image from "next/image";
import { memo } from "react";

import Navbar from "@/components/Navbar";
import styles from "@/components/homePage/index.module.scss";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.pageHeading}>EDUCATE. INNOVATE. INSPIRE.</div>
        <div className={styles.descriptionContainer}>
          <div className={styles.descriptionTitle}>Schulich Elysia</div>
          <div>
            Schulich Elysia started it’s design phase in 2016 and this catamaran
            style cruise car was completed in 2019. This design was implemented
            to improve battery cooling as well as increase aerodynamics. The
            Elysia raced in the 2019 American Solar Challenge where it took
            first place in the Multi Occupant Vehicle Class.
          </div>
        </div>
        <Image
          alt="backsplash"
          fill
          priority
          src="/assets/home/backsplash.jpeg"
          style={{ objectFit: "cover" }}
        />
      </div>
    </>
  );
};

export default memo(HomePage);
