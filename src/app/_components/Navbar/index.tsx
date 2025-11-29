"use client";

import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "public/assets/logo-nav.png";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

import styles from "@/app/_components/Navbar/index.module.scss";
import Chevron from "@/app/_components/svgs/Chevron";
import useViewport from "@/app/_hooks/useViewport";

import CloseButton from "../Buttons/CloseButton";

const cx = classNames.bind(styles);

const Navbar = () => {
  const { width } = useViewport();
  const pathname = usePathname();
  const router = useRouter();
  const isActive = useCallback((href: string) => pathname === href, [pathname]);

  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);

  const links = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/recruitment", label: "Recruitment" },
      { href: "/cars", label: "Cars" },
      { href: "/team", label: "Team" },
      { href: "/support-us", label: "Support Us" },
      { href: "/our-work", label: "Our Work" },
      { href: "/sponsors", label: "Sponsors" },
    ],
    [],
  );

  const toggleHambugerMenu = useCallback(() => {
    setHamburgerMenuOpen((prev) => !prev);
  }, []);

  const shouldShowBackground = useMemo(() => {
    if (["/team"].includes(pathname)) {
      return true;
    }
  }, [pathname]);

  useEffect(() => {
    setHamburgerMenuOpen(false);
  }, [width]);

  return (
    <>
      <nav
        className={styles.navbar}
        style={shouldShowBackground ? { backgroundColor: "#121212" } : {}}
      >
        <div>
          <Image
            alt="Logo"
            height={64}
            loading="eager"
            onClick={() => {
              if (width !== undefined && width > 1024) {
                void router.push("/");
              } else {
                toggleHambugerMenu();
              }
            }}
            placeholder="blur"
            priority
            src={Logo}
            width={350}
          />
        </div>
        {width && width > 1024 && (
          <>
            {links.map((link) => (
              <Link
                className={
                  isActive(link.href)
                    ? cx(styles.active, styles.link)
                    : styles.link
                }
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </>
        )}
        {width && width <= 1024 && (
          <div onClick={toggleHambugerMenu}>
            <Chevron className={styles.chevron} />
          </div>
        )}
      </nav>
      {width && width <= 1024 && (
        <div
          className={`${styles.hamburgerMenu} ${hamburgerMenuOpen ? styles.open : styles.closed}`}
        >
          <div className={styles.closeButton} onClick={toggleHambugerMenu}>
            <CloseButton fill="white" />
          </div>
          {links.map((link) => (
            <Link
              className={
                isActive(link.href)
                  ? cx(styles.active, styles.link)
                  : styles.link
              }
              href={link.href}
              key={link.href}
              onClick={toggleHambugerMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default memo(Navbar);
