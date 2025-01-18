import Link from "next/link";
import { memo } from "react";

import TeamTable from "@/components/portal/TeamTable";
import UsersTable from "@/components/portal/UsersTable";
import styles from "@/pages/portal/index.module.scss";
import { SignIn, SignedIn, useUser } from "@clerk/nextjs";

import PortalPageHeader from "../../components/portal/PortalPageHeader";

const Portal = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (
    !user?.publicMetadata?.role ||
    user.publicMetadata.role === "unverified"
  ) {
    return (
      <div className={styles.unverifiedPage}>
        <div>You are not verified</div>
        <Link href="/">Go back home</Link>
      </div>
    );
  }

  return (
    <>
      {!isSignedIn ? (
        <div className={styles.signInLayout}>
          <SignIn forceRedirectUrl="/portal" />
        </div>
      ) : (
        <SignedIn>
          <PortalPageHeader />
          <div className={styles.portalContent}>
            <UsersTable />
            <TeamTable />
          </div>
        </SignedIn>
      )}
    </>
  );
};

export default memo(Portal);
