"use client";

import Link from "next/link";
import { memo, useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";

import InlineUserPopup from "@/app/_components/PortalComponents/EditUserCell/InlineUserPopup";
import PortalPageHeader from "@/app/_components/PortalComponents/Portal/PortalPageHeader";
import SponsorsTable from "@/app/_components/PortalComponents/Portal/SponsorsTable";
import TeamTable from "@/app/_components/PortalComponents/Portal/TeamTable";
import UsersTable from "@/app/_components/PortalComponents/Portal/UsersTable";
import styles from "@/app/portal/index.module.scss";
import { trpc } from "@/trpc/react";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { skipToken } from "@tanstack/react-query";

import Loader from "../_components/Loader";
import { adminClerkRoles } from "../_types";

const Portal = () => {
  const [currentPage, setCurrentPage] = useState("team");
  const { isLoaded, user } = useUser();
  const showAdminTables = useMemo(
    () => adminClerkRoles.includes(user?.publicMetadata?.role as string),
    [user?.publicMetadata?.role],
  );

  const clerkUsers = trpc.portal.getClerkUsers.useQuery(
    !showAdminTables || currentPage !== "users" ? skipToken : undefined,
  );
  const dbUsers = trpc.portal.getDBUsers.useQuery(
    !showAdminTables || currentPage !== "team" ? skipToken : undefined,
  );
  const sponsors = trpc.portal.getSponsorsList.useQuery(
    !showAdminTables || currentPage !== "sponsors" ? skipToken : undefined,
  );
  const currentDBUser = trpc.portal.getCurrentDBUser.useQuery(
    showAdminTables ? skipToken : undefined,
  );

  useEffect(() => {
    document.documentElement.style.backgroundColor = "white";
  }, []);

  if (
    !isLoaded ||
    clerkUsers.isFetching ||
    dbUsers.isFetching ||
    sponsors.isFetching ||
    currentDBUser.isFetching
  ) {
    return <Loader isLoading lightmode />;
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
      <main style={{ height: "auto" }}>
        <SignedIn>
          <PortalPageHeader
            currentPage={currentPage}
            currentUser={user}
            setCurrentPage={setCurrentPage}
          />
          <div className={styles.portalContent}>
            {adminClerkRoles.includes(user.publicMetadata?.role as string) ? (
              <>
                {currentPage === "team" ? (
                  <TeamTable currentUser={user} users={dbUsers.data ?? []} />
                ) : currentPage === "users" ? (
                  <UsersTable
                    currentUser={user}
                    users={clerkUsers.data ?? []}
                  />
                ) : (
                  <SponsorsTable
                    currentUser={user}
                    sponsors={sponsors.data ?? []}
                  />
                )}
              </>
            ) : (
              <>
                {currentDBUser.data ? (
                  <InlineUserPopup clerkUser={user} user={currentDBUser.data} />
                ) : (
                  <></>
                )}
              </>
            )}
          </div>
        </SignedIn>
        <SignedOut>
          <div className={styles.signInLayout}>
            <RedirectToSignIn />
          </div>
        </SignedOut>
        <Toaster />
      </main>
    </>
  );
};

export default memo(Portal);
