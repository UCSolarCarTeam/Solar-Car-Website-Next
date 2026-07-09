"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "public/assets/logo-nav.png";
import MagneticButton from "@/components/ui/MagneticButton";
import Facebook from "../svgs/Facebook";
import Instagram from "../svgs/Instagram";
import Linkedin from "../svgs/Linkedin";
import Twitter from "../svgs/Twitter";
import Youtube from "../svgs/Youtube";

const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/UofCSolarTeam",
    icon: Facebook,
    label: "Facebook",
  },
  { href: "https://x.com/uofcsolarcar", icon: Twitter, label: "Twitter" },
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
  { label: "ENC 36, Schulich School of Engineering", type: "text" as const },
  { label: "2500 University Dr NW", type: "text" as const },
  { label: "Calgary, AB T2N 1N4", type: "text" as const },
] as const;

const RESOURCE_LINKS = [
  { href: "/", label: "Homepage" },
  { href: "/cars", label: "Cars" },
  { href: "/team", label: "Team" },
  { href: "/support-us", label: "Support Us" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/portal/sign-in", label: "Team Portal" },
] as const;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--sc-bg)",
        borderTop: "1px solid var(--sc-border)",
        padding: "3rem 20px 1.5rem",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "2rem",
          marginBottom: "3rem",
        }}
      >
        {/* Brand Column */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <Image
            alt="Logo"
            height={48}
            src={Logo}
            style={{ width: "auto", filter: "brightness(0.9)" }}
          />
          <div>
            <div
              className="sc-label"
              style={{ color: "var(--sc-amber)", marginBottom: "1rem" }}
            >
              FOLLOW US
            </div>
            <div style={{ display: "flex", gap: "1.5rem" }}>
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                const iconProps = "props" in social ? social.props : {};
                return (
                  <MagneticButton key={social.label} strength={0.2}>
                    <Link
                      href={social.href}
                      onMouseOut={(e) =>
                        (e.currentTarget.style.opacity = "0.7")
                      }
                      onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                      style={{ opacity: 0.7, transition: "opacity 0.2s" }}
                      target="_blank"
                    >
                      <Icon {...iconProps} fill="var(--sc-white)" />
                    </Link>
                  </MagneticButton>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact Column */}
        <div>
          <div
            className="sc-label"
            style={{ color: "var(--sc-red)", marginBottom: "1.5rem" }}
          >
            CONTACT
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.8rem",
              color: "var(--sc-grey-light)",
              fontSize: "0.95rem",
            }}
          >
            {CONTACT_INFO.map((item, index) =>
              item.type === "link" ? (
                <Link
                  href={item.href}
                  key={index}
                  onMouseOut={(e) =>
                    (e.currentTarget.style.color = "var(--sc-white)")
                  }
                  onMouseOver={(e) =>
                    (e.currentTarget.style.color = "var(--sc-red)")
                  }
                  style={{
                    color: "var(--sc-white)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <span key={index}>{item.label}</span>
              ),
            )}
          </div>
        </div>

        {/* Resources Column */}
        <div>
          <div
            className="sc-label"
            style={{ color: "var(--sc-red)", marginBottom: "1.5rem" }}
          >
            RESOURCES
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
          >
            {RESOURCE_LINKS.map(({ href, label }) => (
              <Link
                className="sc-mono"
                href={href}
                key={label}
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = "var(--sc-grey-light)")
                }
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = "var(--sc-white)")
                }
                style={{
                  color: "var(--sc-grey-light)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  transition: "color 0.2s",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          paddingTop: "2rem",
          borderTop: "1px solid var(--sc-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <span
          className="sc-mono"
          style={{ color: "var(--sc-grey-dim)", fontSize: "0.8rem" }}
        >
          © {currentYear} UNIVERSITY OF CALGARY SOLAR CAR TEAM
        </span>
        <span
          className="sc-mono"
          style={{ color: "var(--sc-grey-dim)", fontSize: "0.8rem" }}
        >
          DESIGNED FOR PERFORMANCE
        </span>
      </div>
    </footer>
  );
};

export default Footer;
