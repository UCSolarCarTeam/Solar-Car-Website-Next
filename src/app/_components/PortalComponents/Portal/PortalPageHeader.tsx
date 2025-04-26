import Image from "next/image";
import Link from "next/link";
import logo from "public/assets/logo-center-black.png";
import { memo } from "react";

import styles from "@/app/_components/PortalComponents/Portal/index.module.scss";
import { PortalNavLinks, adminClerkRoles } from "@/app/_types";
import { UserButton } from "@clerk/nextjs";
import { type UserResource } from "@clerk/types";

interface PortalPageHeaderProps {
  currentUser: UserResource | undefined | null;
  currentPage: PortalNavLinks;
  setCurrentPage: React.Dispatch<React.SetStateAction<PortalNavLinks>>;
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
          (currentUser?.publicMetadata.role as string) ?? "",
        ) && (
          <div>
            <div
              className={`${currentPage === PortalNavLinks.TEAM ? styles.active : ""}`}
              onClick={() => setCurrentPage(PortalNavLinks.TEAM)}
            >
              Team
            </div>
            <div
              className={`${currentPage === PortalNavLinks.USERS ? styles.active : ""}`}
              onClick={() => setCurrentPage(PortalNavLinks.USERS)}
            >
              Users
            </div>
            <div
              className={`${currentPage === PortalNavLinks.SPONSORS ? styles.active : ""}`}
              onClick={() => setCurrentPage(PortalNavLinks.SPONSORS)}
            >
              Sponsors
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
