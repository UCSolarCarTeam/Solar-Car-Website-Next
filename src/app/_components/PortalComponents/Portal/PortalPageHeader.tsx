import Image from "next/image";
import Link from "next/link";
import logo from "public/assets/logo-center-black.png";
import { memo } from "react";

import styles from "@/app/_components/PortalComponents/Portal/index.module.scss";
import { PortalNavigationLinks, adminClerkRoles } from "@/app/_types";
import { AdminRoles } from "@/server/api/routers/portal";
import { UserButton } from "@clerk/nextjs";
import { type UserResource } from "@clerk/types";

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
  return (
    <header className={styles.portalPageHeaderLayout}>
      <div className={styles.portalPageHeader}>
        <Link href="/">
          <Image alt="navlogo" height={48} src={logo} width={48} />
        </Link>
        {adminClerkRoles.includes(
          (currentUser?.publicMetadata.role as AdminRoles) ?? "",
        ) && (
          <div>
            <div
              className={`${currentPage === "team" ? styles.active : ""}`}
              onClick={() => setCurrentPage(PortalNavigationLinks.Team)}
            >
              Team
            </div>
            <div
              className={`${currentPage === "users" ? styles.active : ""}`}
              onClick={() => setCurrentPage(PortalNavigationLinks.Users)}
            >
              Users
            </div>
            <div
              className={`${currentPage === "sponsors" ? styles.active : ""}`}
              onClick={() => setCurrentPage(PortalNavigationLinks.Sponsors)}
            >
              Sponsors
            </div>
            <div
              className={`${currentPage === "invitations" ? styles.active : ""}`}
              onClick={() => setCurrentPage(PortalNavigationLinks.Invitations)}
            >
              Invitations
            </div>
            <div
              className={`${currentPage === "recruitment" ? styles.active : ""}`}
              onClick={() => setCurrentPage(PortalNavigationLinks.Recruitment)}
            >
              Recruitment
            </div>
          </div>
        )}
      </div>
      <div className={styles.profilePicture}>
        {currentUser?.username}
        <UserButton />
      </div>
    </header>
  );
};

export default memo(PortalPageHeader);
