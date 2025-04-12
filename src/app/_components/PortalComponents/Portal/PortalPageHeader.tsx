import Image from "next/image";
import Link from "next/link";
import logo from "public/assets/logo-center-black.png";
import { memo } from "react";

import styles from "@/app/_components/PortalComponents/Portal/index.module.scss";
import { adminClerkRoles } from "@/app/_types";
import { UserButton } from "@clerk/nextjs";
import { type UserResource } from "@clerk/types";

interface PortalPageHeaderProps {
  currentUser: UserResource | undefined | null;
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
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
              className={`${currentPage === "team" ? styles.active : ""}`}
              onClick={() => setCurrentPage("team")}
            >
              Team
            </div>
            <div
              className={`${currentPage === "users" ? styles.active : ""}`}
              onClick={() => setCurrentPage("users")}
            >
              Users
            </div>
            <div
              className={`${currentPage === "sponsors" ? styles.active : ""}`}
              onClick={() => setCurrentPage("sponsors")}
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
