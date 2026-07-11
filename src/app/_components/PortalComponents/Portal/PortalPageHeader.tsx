"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "public/assets/logo-center-black.png";
import { useState } from "react";
import { portal } from "@/lib/portal-classes";
import Chevron from "@/app/_components/svgs/Chevron";
import useViewport from "@/app/_hooks/useViewport";
import { portalNavItems } from "@/app/_types";

interface PortalPageHeaderProps {
  isAdmin: boolean;
  username: string;
}

const PortalPageHeader = ({ isAdmin, username }: PortalPageHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { width } = useViewport();
  const isMobile = width !== undefined && width <= 640;

  const closeMenu = () => setIsMenuOpen(false);

  const navLinkClassName = (href: string) =>
    pathname === href ? portal.active : undefined;

  const renderNavLinks = () =>
    portalNavItems.map(({ href, label }) => (
      <Link
        className={navLinkClassName(href)}
        href={href}
        key={href}
        onClick={closeMenu}
      >
        {label}
      </Link>
    ));

  return (
    <>
      <header className={portal.pageHeaderLayout}>
        <div className={portal.pageHeader}>
          <Link href="/">
            <Image alt="navlogo" height={48} src={logo} width={48} />
          </Link>
          {isAdmin && (
            <>
              {!isMobile && (
                <nav className={portal.desktopNavLinks}>{renderNavLinks()}</nav>
              )}
              {isMobile && (
                <button
                  aria-expanded={isMenuOpen}
                  aria-label="Toggle navigation menu"
                  className={portal.hamburgerIcon}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  type="button"
                >
                  <Chevron className={portal.chevronIcon} />
                </button>
              )}
            </>
          )}
        </div>
        <div className={portal.profilePicture}>
          {username}
          <UserButton />
        </div>
      </header>
      {isMobile && isMenuOpen && isAdmin && (
        <nav className={portal.mobileMenuDropdown}>{renderNavLinks()}</nav>
      )}
    </>
  );
};

export default PortalPageHeader;
