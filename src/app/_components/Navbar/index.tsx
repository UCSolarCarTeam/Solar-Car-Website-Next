"use client";

import classNames from "classnames";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "public/assets/logo-nav.png";
import { useEffect, useState } from "react";

import styles from "@/app/_components/Navbar/index.module.scss";
import Chevron from "@/app/_components/svgs/Chevron";
import useViewport from "@/app/_hooks/useViewport";
import CloseButton from "../Buttons/CloseButton";

const links = [
  { href: "/", label: "Home" },
  { href: "/recruitment", label: "Recruitment" },
  { href: "/cars", label: "Cars" },
  { href: "/team", label: "Team" },
  { href: "/support-us", label: "Support Us" },
  { href: "/our-work", label: "Our Work" },
  { href: "/sponsors", label: "Sponsors" },
] as const;

const Navbar = () => {
  const { width } = useViewport();
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => pathname === href;

  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  // Glassmorphism effect when scrolled past 50px
  const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.72]);
  const blurAmount = useTransform(scrollY, [0, 50], [0, 20]);
  const borderColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(240, 239, 236, 0)", "rgba(240, 239, 236, 0.08)"],
  );

  const links = [
    { href: "/", label: "Home" },
    { href: "/recruitment", label: "Recruitment" },
    { href: "/cars", label: "Cars" },
    { href: "/team", label: "Team" },
    { href: "/support-us", label: "Support Us" },
    { href: "/our-work", label: "Our Work" },
    { href: "/sponsors", label: "Sponsors" },
  ];

  const toggleHambugerMenu = () => {
    setHamburgerMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    setHamburgerMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: width && width > 1024 ? "space-between" : "center",
          padding: width && width > 1024 ? "15px 40px" : "15px 20px",
          flexDirection: width && width > 1024 ? "row" : "column",
          gap: width && width > 1024 ? 0 : "10px",
          backgroundColor: useTransform(
            bgOpacity,
            (v) => `rgba(10, 10, 11, ${v})`,
          ),
          backdropFilter: useTransform(
            blurAmount,
            (v) => `blur(${v}px) saturate(120%)`,
          ),
          borderBottom: useTransform(borderColor, (v) => `1px solid ${v}`),
          transition: "padding 0.3s ease",
        }}
      >
        <div style={{ display: "flex" }}>
          <Image
            alt="Logo"
            height={50}
            loading="eager"
            onClick={() => {
              if (isDesktop) {
                void router.push("/");
              } else {
                toggleHambugerMenu();
              }
            }}
            priority
            src={Logo}
            style={{
              width: "auto",
              cursor: "pointer",
              filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))",
            }}
          />
        </div>

        {width && width > 1024 && (
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {links.map((link) => (
              <Link
                className="sc-mono"
                href={link.href}
                key={link.href}
                style={{
                  fontSize: "0.85rem",
                  color: isActive(link.href)
                    ? "var(--sc-red)"
                    : "var(--sc-white)",
                  textDecoration: "none",
                  fontWeight: isActive(link.href) ? 600 : 400,
                  transition: "color 0.2s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {width && width <= 1024 && (
          <div
            onClick={toggleHambugerMenu}
            style={{ position: "absolute", right: "20px", top: "25px" }}
          >
            <Chevron className={styles.chevron} />
          </div>
        )}
      </motion.nav>

      {/* Mobile Menu */}
      {width && width <= 1024 && (
        <div
          className={`${styles.hamburgerMenu} ${hamburgerMenuOpen ? styles.open : styles.closed}`}
          style={{ position: "fixed" }}
        >
          <button
            aria-label="Close menu"
            className="absolute top-5 right-5 cursor-pointer border-none bg-transparent p-0"
            onClick={toggleHambugerMenu}
            type="button"
          >
            <CloseButton fill="white" />
          </button>
          {links.map((link) => (
            <Link
              className="sc-heading"
              href={link.href}
              key={link.href}
              onClick={toggleHambugerMenu}
              style={{
                fontSize: "2rem",
                color: isActive(link.href) ? "var(--sc-red)" : "white",
                textDecoration: "none",
                margin: "1rem 0",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
