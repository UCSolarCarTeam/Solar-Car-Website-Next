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

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/UofCSolarTeam",
    icon: Facebook,
    label: "Facebook",
  },
  {
    href: "https://x.com/uofcsolarcar",
    icon: Twitter,
    label: "Twitter",
  },
  {
    href: "https://www.instagram.com/uofc_solarcar",
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: "https://www.linkedin.com/company/university-of-calgary-solar-car-team",
    icon: Linkedin,
    label: "LinkedIn",
    props: { height: 26, width: 28 },
  },
  {
    href: "https://www.youtube.com/user/calgarysolarcar",
    icon: Youtube,
    label: "YouTube",
  },
] as const;

const CONTACT_INFO = [
  {
    href: "mailto:communications@calgarysolarcar.ca",
    label: "communications@calgarysolarcar.ca",
    type: "link" as const,
  },
  {
    href: "mailto:sponsorship@calgarysolarcar.ca",
    label: "sponsorship@calgarysolarcar.ca",
    type: "link" as const,
  },
  {
    label: "ENC 36, Schulich School of Engineering",
    type: "text" as const,
  },
  {
    label: "2500 University Dr NW",
    type: "text" as const,
  },
  {
    label: "Calgary, AB T2N 1N4",
    type: "text" as const,
  },
] as const;

const RESOURCE_LINKS = [
  { href: "/", label: "Homepage" },
  { href: "/cars", label: "Cars" },
  { href: "/team", label: "Team" },
  { href: "/support-us", label: "Support Us" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/portal/sign-in", label: "Team Portal" },
] as const;

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              const iconProps = "props" in social ? social.props : {};
              return (
                <Link href={social.href} key={social.label}>
                  <Icon {...iconProps} />
                </Link>
              );
            })}
          </div>
        </div>
        <div className={styles.gridContainer}>
          <div>Contact Information</div>
          {CONTACT_INFO.map((item, index) =>
            item.type === "link" ? (
              <Link href={item.href} key={item.label}>
                {item.label}
              </Link>
            ) : (
              <span key={index}>{item.label}</span>
            ),
          )}
        </div>
        <div className={styles.gridContainer}>
          <div>Resources</div>
          {RESOURCE_LINKS.map(({ href, label }) => (
            <Link href={href} key={label} target="_blank">
              {label}
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.seperator} style={{ width: "80%" }} />
      <div className={styles.copyright}>
        <span>© {currentYear} Calgary Solar Car</span>
      </div>
    </div>
  );
};

export default memo(Footer);
