import Link from "next/link";
import { memo } from "react";

import PortalPageHeader from "@/components/Portal/PortalPageHeader";
import TeamTable from "@/components/Portal/TeamTable";
import UsersTable from "@/components/Portal/UsersTable";
import styles from "@/pages/portal/index.module.scss";
import { api } from "@/utils/api";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";

const PortalPage = () => {
  const { isLoaded, user } = useUser();

  const clerkUsers = api.portal.getClerkUsers.useQuery();
  const dbUsers = api.portal.getDBUsers.useQuery();

  if (!isLoaded || clerkUsers.isFetching || dbUsers.isFetching) {
    return null;
  }

  if (
    !user?.publicMetadata?.role ||
    user.publicMetadata.role === "unverified"
  ) {
    return (
      <div className={styles.unverifiedPage}>
        <div>
          You are not verified. Please contact the Telemetry Team or your Team
          Lead.
        </div>
        <Link href="/">Go back home</Link>
      </div>
    );
  }

  return (
    <>
      <SignedIn>
        <PortalPageHeader />
        <div className={styles.portalContent}>
          <UsersTable users={clerkUsers.data ?? []} />
          <TeamTable users={dbUsers.data ?? []} />
        </div>
      </SignedIn>
      <SignedOut>
        <div className={styles.signInLayout}>
          <RedirectToSignIn />
        </div>
      </SignedOut>
    </>
  );
};

export default memo(PortalPage);
