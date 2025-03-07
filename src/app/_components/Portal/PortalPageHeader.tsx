import Link from "next/link";
import { memo } from "react";

import styles from "@/app/_components/Portal/index.module.scss";
import { UserButton } from "@clerk/nextjs";
import { type UserResource } from "@clerk/types";

interface PortalPageHeaderProps {
  currentUser: UserResource | undefined | null;
}

const PortalPageHeader = ({ currentUser }: PortalPageHeaderProps) => {
  return (
    <header className={styles.portalPageHeaderLayout}>
      <Link href="/">Solar Car Portal</Link>
      <div className={styles.profilePicture}>
        {currentUser?.username}
        <UserButton />
      </div>
    </header>
  );
};

export default memo(PortalPageHeader);
