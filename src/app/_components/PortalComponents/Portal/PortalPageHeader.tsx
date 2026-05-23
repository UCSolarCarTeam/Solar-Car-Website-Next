"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "public/assets/logo-center-black.png";
import { memo, useState } from "react";

import styles from "@/app/_components/PortalComponents/Portal/index.module.scss";
import Chevron from "@/app/_components/svgs/Chevron";
import useViewport from "@/app/_hooks/useViewport";
import { PortalNavigationLinks, adminClerkRoles } from "@/app/_types";
import { type AdminRoles } from "@/server/api/routers/portal";
import { UserButton } from "@clerk/nextjs";
import { type UserResource } from "@clerk/nextjs/types";

interface PortalPageHeaderProps {
  currentUser: UserResource | undefined | null;
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<PortalNavigationLinks>>;
}

const PortalPageHeader = ({
  currentPage,
  currentUser,
  setCurrentPage,
}: PortalPageHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { width } = useViewport();
  const isMobile = width !== undefined && width <= 640;

  const handleMenuItemClick = (page: PortalNavigationLinks) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={styles.portalPageHeaderLayout}>
        <div className={styles.portalPageHeader}>
          <Link href="/">
            <Image alt="navlogo" height={48} src={logo} width={48} />
          </Link>
          {adminClerkRoles.includes(
            (currentUser?.publicMetadata.role as AdminRoles) ?? "",
          ) && (
            <>
              {!isMobile && (
                <div className={styles.desktopNavLinks}>
                  <div
                    className={`${currentPage === "team" ? styles.active : ""}`}
                    onClick={() =>
                      handleMenuItemClick(PortalNavigationLinks.Team)
                    }
                  >
                    Team
                  </div>
                  <div
                    className={`${currentPage === "users" ? styles.active : ""}`}
                    onClick={() =>
                      handleMenuItemClick(PortalNavigationLinks.Users)
                    }
                  >
                    Users
                  </div>
                  <div
                    className={`${currentPage === "sponsors" ? styles.active : ""}`}
                    onClick={() =>
                      handleMenuItemClick(PortalNavigationLinks.Sponsors)
                    }
                  >
                    Sponsors
                  </div>
                  <div
                    className={`${currentPage === "invitations" ? styles.active : ""}`}
                    onClick={() =>
                      handleMenuItemClick(PortalNavigationLinks.Invitations)
                    }
                  >
                    Invitations
                  </div>
                  <div
                    className={`${currentPage === "recruitment" ? styles.active : ""}`}
                    onClick={() =>
                      handleMenuItemClick(PortalNavigationLinks.Recruitment)
                    }
                  >
                    Recruitment
                  </div>
                  <div
                    className={`${currentPage === "our-work" ? styles.active : ""}`}
                    onClick={() =>
                      handleMenuItemClick(PortalNavigationLinks.OurWork)
                    }
                  >
                    Our Work
                  </div>
                  <div
                    className={`${currentPage === "alumni" ? styles.active : ""}`}
                    onClick={() =>
                      handleMenuItemClick(PortalNavigationLinks.Alumni)
                    }
                  >
                    Alumni
                  </div>
                </div>
              )}
              {isMobile && (
                <div
                  className={styles.hamburgerIcon}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Chevron className={styles.chevronIcon} />
                </div>
              )}
            </>
          )}
        </div>
        <div className={styles.profilePicture}>
          {currentUser?.username}
          <UserButton />
        </div>
      </header>
      {isMobile &&
        isMenuOpen &&
        adminClerkRoles.includes(
          (currentUser?.publicMetadata.role as AdminRoles) ?? "",
        ) && (
          <div className={styles.mobileMenuDropdown}>
            <div
              className={`${currentPage === "team" ? styles.active : ""}`}
              onClick={() => handleMenuItemClick(PortalNavigationLinks.Team)}
            >
              Team
            </div>
            <div
              className={`${currentPage === "users" ? styles.active : ""}`}
              onClick={() => handleMenuItemClick(PortalNavigationLinks.Users)}
            >
              Users
            </div>
            <div
              className={`${currentPage === "sponsors" ? styles.active : ""}`}
              onClick={() =>
                handleMenuItemClick(PortalNavigationLinks.Sponsors)
              }
            >
              Sponsors
            </div>
            <div
              className={`${currentPage === "invitations" ? styles.active : ""}`}
              onClick={() =>
                handleMenuItemClick(PortalNavigationLinks.Invitations)
              }
            >
              Invitations
            </div>
            <div
              className={`${currentPage === "recruitment" ? styles.active : ""}`}
              onClick={() =>
                handleMenuItemClick(PortalNavigationLinks.Recruitment)
              }
            >
              Recruitment
            </div>
            <div
              className={`${currentPage === "our-work" ? styles.active : ""}`}
              onClick={() => handleMenuItemClick(PortalNavigationLinks.OurWork)}
            >
              Our Work
            </div>
            <div
              className={`${currentPage === "alumni" ? styles.active : ""}`}
              onClick={() => handleMenuItemClick(PortalNavigationLinks.Alumni)}
            >
              Alumni
            </div>
          </div>
        )}
    </>
  );
};

export default memo(PortalPageHeader);
