import Image from "next/image";
import backsplash from "public/assets/sponsors/backsplash.jpeg";
import { memo } from "react";

import Navbar from "@/components/Navbar";
import styles from "@/pages/sponsors/index.module.scss";

const SponsorsPage = () => {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.pageHeading}>Lead Sponsor</div>
        <div className={styles.descriptionTitle}>
          {`A special thank you to our kind donor, the faculty and everything
          they've done for us!`}
        </div>
        <div className={styles.leadSponsorLogo}>
          <Image
            alt="lead sponsor"
            height={180}
            loading="eager"
            priority
            src="/assets/sponsors/logo-schulich.svg"
            width={1000}
          />
        </div>
        <div className={styles.otherSponsors}>
          <div className={styles.pageHeading}>Gold Sponsor</div>
          <div className={styles.descriptionTitle}>
            {`Thank you for helping our team educate future generations on the
          necessity of renewable resources!`}
          </div>
          <div className={styles.pageHeading}>Silver Sponsor</div>
          <div className={styles.descriptionTitle}>
            {`Thank you for giving us the ability to demonstrate that sustainable
          energy can be practical!`}
          </div>
          <div className={styles.pageHeading}>Bronze Sponsor</div>
          <div className={styles.descriptionTitle}>
            {`Thank you for giving us the ability to demonstrate that sustainable
          energy can be practical!`}
          </div>
          <div className={styles.pageHeading}>Friends of Solar Car</div>
          <div className={styles.descriptionTitle}>
            {`Thank you for helping us continue to innovate!`}
          </div>
          <div className={styles.seperator} />
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

export default memo(SponsorsPage);
