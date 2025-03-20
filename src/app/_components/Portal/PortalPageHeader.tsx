import Image from "next/image";
import Link from "next/link";
import logo from "public/assets/logo-center-black.png";
import { memo } from "react";

import styles from "@/app/_components/Portal/index.module.scss";
import useScrollToElement from "@/app/_hooks/useScrollToElement";
import { UserButton } from "@clerk/nextjs";
import { type UserResource } from "@clerk/types";

interface PortalPageHeaderProps {
  currentUser: UserResource | undefined | null;
}

const PortalPageHeader = ({ currentUser }: PortalPageHeaderProps) => {
  const scrollToElement = useScrollToElement();
  return (
    <header className={styles.portalPageHeaderLayout}>
      <div className={styles.portalPageHeader}>
        <Link href="/">
          <Image alt="navlogo" height={48} src={logo} width={48} />
        </Link>
        {currentUser?.publicMetadata.role === "admin" ||
          (currentUser?.publicMetadata.role === "business" && (
            <div>
              <div onClick={() => scrollToElement("team")}>Team</div>
              <div onClick={() => scrollToElement("users")}>Users</div>
              <div onClick={() => scrollToElement("sponsors")}>Sponsors</div>
            </div>
          ))}
      </div>
      <div className={styles.profilePicture}>
        {currentUser?.username}
        <UserButton />
      </div>
    </header>
  );
};

export default memo(PortalPageHeader);
