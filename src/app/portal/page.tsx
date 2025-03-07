"use client";

import Head from "next/head";
import Link from "next/link";
import { memo, useEffect } from "react";

import PortalPageHeader from "@/app/_components/Portal/PortalPageHeader";
import SponsorsTable from "@/app/_components/Portal/SponsorsTable";
import TeamTable from "@/app/_components/Portal/TeamTable";
import UsersTable from "@/app/_components/Portal/UsersTable";
import styles from "@/app/portal/index.module.scss";
import { trpc } from "@/trpc/react";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";

const Portal = () => {
  const { isLoaded, user } = useUser();

  const clerkUsers = trpc.portal.getClerkUsers.useQuery();
  const dbUsers = trpc.portal.getDBUsers.useQuery();
  const sponsors = trpc.portal.getSponsorsList.useQuery();

  useEffect(() => {
    document.documentElement.style.backgroundColor = "white";
  }, []);

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
      <Head>
        <title>Calgary Solar Car - Portal</title>
      </Head>
      <main style={{ height: "auto" }}>
        <SignedIn>
          <div>
            <PortalPageHeader currentUser={user} />
            <div className={styles.portalContent}>
              <UsersTable currentUser={user} users={clerkUsers.data ?? []} />
              <TeamTable currentUser={user} users={dbUsers.data ?? []} />
              <SponsorsTable
                currentUser={user}
                sponsors={sponsors.data ?? []}
              />
            </div>
          </div>
        </SignedIn>
        <SignedOut>
          <div className={styles.signInLayout}>
            <RedirectToSignIn />
          </div>
        </SignedOut>
      </main>
    </>
  );
};

export default memo(Portal);
