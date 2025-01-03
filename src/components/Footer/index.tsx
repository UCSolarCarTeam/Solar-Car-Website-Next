import classNames from "classnames";
import { DM_Sans } from "next/font/google";
import Image from "next/image";
import { memo } from "react";

import styles from "@/components/Footer/index.module.scss";

import Facebook from "../svgs/Facebook";
import Instagram from "../svgs/Instagram";
import Linkedin from "../svgs/Linkedin";
import Twitter from "../svgs/Twitter";
import Youtube from "../svgs/Youtube";

const dmSans = DM_Sans({
  display: "swap",
  subsets: ["latin"],
});

const cx = classNames.bind(styles);

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={cx(dmSans.className, styles.footer)}>
        <div className={cx(styles.logo, styles.gridContainer)}>
          <div>
            <Image
              alt="Logo"
              height={53}
              priority
              src="/assets/logo-nav.png"
              width={308}
            />
          </div>
          <span>Follow us on our Social Media</span>
          <div className={styles.iconGrid}>
            <Facebook />
            <Twitter />
            <Instagram />
            <Linkedin />
            <Youtube />
          </div>
        </div>
        <div className={styles.gridContainer}>
          <div>Contact Information</div>
          <span>communications@calgarysolarcar.ca</span>
          <span>sponsorship@calgarysolarcar.ca</span>
          <span>ENC 36, Schulich School of Engineering</span>
          <span>2500 University Dr NW</span>
          <span>Calgary, AB T2N 1N4</span>
        </div>
        <div className={styles.gridContainer}>
          <div>Resources</div>
          <div>Homepage</div>
          <div>Cars</div>
          <div>Team</div>
          <div>Support Us</div>
          <div>Sponsors</div>
          <div>Contact Us</div>
          <div>Team Portal</div>
        </div>
      </div>
      <div className={styles.seperator} style={{ width: "80%" }} />
      <div className={styles.copyright}>
        <span>© 2025 Calgary Solar Car</span>
      </div>
    </div>
  );
};

export default memo(Footer);
