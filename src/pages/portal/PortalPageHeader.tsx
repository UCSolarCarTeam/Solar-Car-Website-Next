import { memo } from "react";

import styles from "@/pages/portal/index.module.scss";
import { UserButton, useUser } from "@clerk/nextjs";

const PortalPageHeader = () => {
  const { user } = useUser();
  return (
    <header className={styles.portalPageHeaderLayout}>
      <div>Solar Car Portal</div>
      <div className={styles.profilePicture}>
        {user?.username}
        <UserButton />
      </div>
    </header>
  );
};

export default memo(PortalPageHeader);
