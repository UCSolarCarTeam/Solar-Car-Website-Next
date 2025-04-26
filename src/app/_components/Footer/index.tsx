import classNames from "classnames";
import { DM_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Logo from "public/assets/logo-nav.png";
import { memo } from "react";

import styles from "@/app/_components/Footer/index.module.scss";

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
              loading="eager"
              placeholder="blur"
              priority
              src={Logo}
              width={308}
            />
          </div>
          <span>Follow us on our Social Media</span>
          <div className={styles.iconGrid}>
            <Link href="https://www.facebook.com/UofCSolarTeam">
              <Facebook />
            </Link>
            <Link href="https://x.com/uofcsolarcar">
              <Twitter />
            </Link>
            <Link href="https://www.instagram.com/uofc_solarcar">
              <Instagram />
            </Link>
            <Link href="https://www.linkedin.com/company/university-of-calgary-solar-car-team">
              <Linkedin />
            </Link>
            <Link href="https://www.youtube.com/user/calgarysolarcar">
              <Youtube />
            </Link>
          </div>
        </div>
        <div className={styles.gridContainer}>
          <div>Contact Information</div>
          <div className={styles.linkList}>
            <Link href="mailto:communications@calgarysolarcar.ca">
              communications@calgarysolarcar.ca
            </Link>
            <Link href="mailto:sponsorship@calgarysolarcar.ca">
              sponsorship@calgarysolarcar.ca
            </Link>
          </div>
          <div className={styles.line} />
          <span>ENC 36, Schulich School of Engineering</span>
          <span>2500 University Dr NW</span>
          <span>Calgary, AB T2N 1N4</span>
        </div>
        <div className={styles.gridContainer}>
          <div>Resources</div>
          <div className={styles.linkList}>
            <Link href="/">Homepage</Link>
            <Link href="/cars">Cars</Link>
            <Link href="/team">Team</Link>
            <Link href="/support-us">Support Us</Link>
            <Link href="/sponsors">Sponsors</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/portal/sign-in">Team Portal</Link>
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
