import Link from "next/link";
import { memo } from "react";

import styles from "@/components/Portal/index.module.scss";
import { UserButton, useUser } from "@clerk/nextjs";

const PortalPageHeader = () => {
  const { user } = useUser();
  return (
    <header className={styles.portalPageHeaderLayout}>
      <Link href="/">Solar Car Portal</Link>
      <div className={styles.profilePicture}>
        {user?.username}
        <UserButton />
      </div>
    </header>
  );
};

export default memo(PortalPageHeader);
