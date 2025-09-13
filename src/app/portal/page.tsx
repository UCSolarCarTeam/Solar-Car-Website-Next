"use client";

import Link from "next/link";
import { memo, useEffect, useMemo } from "react";
import { Toaster } from "react-hot-toast";

import InlineUserPopup from "@/app/_components/PortalComponents/EditUserCell/InlineUserPopup";
import InvitationsTable from "@/app/_components/PortalComponents/Portal/Invitations/InvitationsTable";
import PortalPageHeader from "@/app/_components/PortalComponents/Portal/PortalPageHeader";
import RecruitmentTable from "@/app/_components/PortalComponents/Portal/RecruitmentTable";
import SponsorsTable from "@/app/_components/PortalComponents/Portal/SponsorsTable";
import TeamTable from "@/app/_components/PortalComponents/Portal/TeamTable";
import UsersTable from "@/app/_components/PortalComponents/Portal/UsersTable";
import { useSessionStorage } from "@/app/_hooks/useSessionStorage";
import styles from "@/app/portal/index.module.scss";
import { type AdminRoles } from "@/server/api/routers/portal";
import { trpc } from "@/trpc/react";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { skipToken } from "@tanstack/react-query";

import Loader from "../_components/Loader";
import { PortalNavigationLinks, adminClerkRoles } from "../_types";

const Portal = () => {
  const [currentPage, setCurrentPage] = useSessionStorage(
    PortalNavigationLinks.Team,
    PortalNavigationLinks.Team,
  );

  const { isLoaded, user } = useUser();
  const showAdminTables = useMemo(
    () => adminClerkRoles.includes(user?.publicMetadata?.role as AdminRoles),
    [user?.publicMetadata?.role],
  );

  const clerkUsers = trpc.portal.getClerkUsers.useQuery(
    !showAdminTables || currentPage !== PortalNavigationLinks.Users
      ? skipToken
      : undefined,
  );
  const invitedUsers = trpc.portal.getInvitedUsers.useQuery(
    !showAdminTables || currentPage !== PortalNavigationLinks.Invitations
      ? skipToken
      : undefined,
  );
  const dbUsers = trpc.portal.getDBUsers.useQuery(
    !showAdminTables || currentPage !== PortalNavigationLinks.Team
      ? skipToken
      : undefined,
  );
  const sponsors = trpc.portal.getSponsorsList.useQuery(
    !showAdminTables || currentPage !== PortalNavigationLinks.Sponsors
      ? skipToken
      : undefined,
  );
  const forms = trpc.portal.getFormsList.useQuery(
    !showAdminTables || currentPage !== PortalNavigationLinks.Recruitment
      ? skipToken
      : undefined,
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
    invitedUsers.isFetching ||
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
            {adminClerkRoles.includes(
              user.publicMetadata?.role as AdminRoles,
            ) ? (
              <>
                {currentPage === PortalNavigationLinks.Team ? (
                  <TeamTable currentUser={user} users={dbUsers.data ?? []} />
                ) : currentPage === PortalNavigationLinks.Users ? (
                  <UsersTable
                    currentUser={user}
                    users={clerkUsers.data ?? []}
                  />
                ) : currentPage === PortalNavigationLinks.Invitations ? (
                  <InvitationsTable
                    currentUser={user}
                    invitations={invitedUsers.data ?? []}
                  />
                ) : currentPage === PortalNavigationLinks.Sponsors ? (
                  <SponsorsTable
                    currentUser={user}
                    sponsors={sponsors.data ?? []}
                  />
                ) : currentPage === PortalNavigationLinks.Recruitment ? (
                  <RecruitmentTable
                    currentUser={user}
                    forms={forms.data ?? []}
                  />
                ) : null}
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
