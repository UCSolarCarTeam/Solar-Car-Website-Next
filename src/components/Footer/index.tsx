import classNames from "classnames";
import { DM_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
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
          <span className={cx(dmSans.className)}>
            Follow us on our Social Media
          </span>
          <div className={styles.iconGrid}>
            <a href="https://www.facebook.com/UofCSolarTeam/" target="_blank">
              <Facebook />
            </a>
            <a href="https://x.com/uofcsolarcar?lang=en" target="_blank">
              <Twitter />
            </a>
            <a href="https://www.instagram.com/uofc_solarcar/" target="_blank">
              <Instagram />
            </a>
            <a
              href="https://www.linkedin.com/company/university-of-calgary-solar-car-team/"
              target="_blank"
            >
              <Linkedin />
            </a>
            <a
              href="https://www.youtube.com/user/calgarysolarcar"
              target="_blank"
            >
              <Youtube />
            </a>
          </div>
        </div>
        <div className={styles.gridContainer}>
          <div>Contact Information</div>
          <span>
            <a href="mailto:communications@calgarysolarcar.ca">
              communications@calgarysolarcar.ca
            </a>
          </span>
          <span>
            <a href="mailto:sponsorship@calgarysolarcar.ca">
              sponsorship@calgarysolarcar.ca
            </a>
          </span>
          <span>
            <a href="https://maps.app.goo.gl/2B7nE2h3h8qwWxrk9">
              ENC 36, Schulich School of Engineering
            </a>
          </span>
          <span>
            <a href="https://maps.app.goo.gl/2B7nE2h3h8qwWxrk9">
              2500 University Dr NW
            </a>
          </span>
          <span>
            <a href="https://maps.app.goo.gl/2B7nE2h3h8qwWxrk9">
              Calgary, AB T2N 1N4
            </a>
          </span>
        </div>
        <div className={styles.gridContainer}>
          <div>Resources</div>
          <div>
            <a href="#top">Homepage</a>
          </div>
          <div>
            <Link href="/cars">Cars</Link>
          </div>
          <div>
            <Link href="/team">Team</Link>
          </div>
          <div>
            <Link href="/support-us">Support Us</Link>
          </div>
          <div>
            <Link href="/sponsors">Sponsors</Link>
          </div>
          <div>
            <Link href="/contact-us">Contact Us</Link>
          </div>
          <div>
            <Link href="">Team Portal</Link>
          </div>
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
