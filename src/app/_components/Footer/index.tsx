import Image from "next/image";
import Link from "next/link";
import Logo from "public/assets/logo-nav.png";
import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import * as TEAM from "team.json";
import FooterCTA from "./FooterCTA";

type SocialData = {
  icon: IconType;
  label: string;
  href?: string;
};
const SOCIAL_DATA: SocialData[] = [
  {
    icon: FaFacebookF,
    label: "Facebook",
  },
  { icon: FaXTwitter, label: "Twitter" },
  {
    icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: "https://www.linkedin.com/company/university-ofcalgary-solar-car-team",
    icon: Linkedin,
    label: "LinkedIn",
  },
  {
    icon: FaYoutube,
    label: "YouTube",
  },
];

const SOCIAL_LINKS = SOCIAL_DATA.map((social) => {
  const socialJson = TEAM.socials.find((s) => s.label === social.label);
  return { ...social, ...socialJson };
});

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
    <footer className="relative border-t border-sc-border bg-sc-bg px-5 pt-12 pb-6">
      <div className="mx-auto mb-12 grid max-w-300 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-8">
        <div className="flex flex-col gap-6">
          <Image
            alt="Logo"
            className="h-auto w-auto brightness-90"
            height={48}
            src={Logo}
          />
          <div>
            <div className="sc-label mb-4 text-sc-amber">FOLLOW US</div>
            <div className="flex gap-6">
              {SOCIAL_LINKS.map((social) => {
                if (!social.href) return null;
                const Icon = social.icon;
                return (
                  <Link
                    aria-label={social.label}
                    className="inline-block opacity-70 transition-opacity hover:opacity-100"
                    href={social.href}
                    key={social.label}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Icon
                      aria-hidden="true"
                      color="var(--sc-white)"
                      size={24}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
          <FooterCTA />
        </div>

        <div>
          <div className="sc-label mb-6 text-sc-red">CONTACT</div>
          <div className="flex flex-col gap-3 text-[0.95rem] text-sc-grey-light">
            {CONTACT_INFO.map((item) =>
              item.type === "link" ? (
                <Link
                  className="text-sc-white no-underline transition-colors hover:text-sc-red"
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span key={item.label}>{item.label}</span>
              ),
            )}
          </div>
        </div>

        <div>
          <div className="sc-label mb-6 text-sc-red">RESOURCES</div>
          <div className="flex flex-col gap-3">
            {RESOURCE_LINKS.map(({ href, label }) => (
              <Link
                className="sc-mono text-sm text-sc-grey-light no-underline transition-colors hover:text-sc-white"
                href={href}
                key={label}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-300 flex-wrap items-center justify-between gap-4 border-t border-sc-border pt-8">
        <span className="sc-mono text-xs text-sc-grey-dim">
          © {currentYear} UNIVERSITY OF CALGARY SOLAR CAR TEAM
        </span>
        <span className="sc-mono text-xs text-sc-grey-dim">
          DESIGNED FOR PERFORMANCE
        </span>
      </div>
    </footer>
  );
};

export default Footer;
