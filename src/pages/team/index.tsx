import Head from "next/head";
import { type GetServerSideProps } from "next/types";
import { memo } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TeamMember from "@/components/TeamMember";
import styles from "@/pages/team/index.module.scss";
import { type RouterOutputs, type SsrTrpcHelper } from "@/utils/api";
import { SsrHelpers } from "@/utils/api";

type TeamHierarchy = RouterOutputs["portal"]["getTeamMembers"];

export type TeamPageProps = {
  teamHierarchy: TeamHierarchy;
} & SsrTrpcHelper;

export const getServerSideProps: GetServerSideProps<
  TeamPageProps
> = async () => {
  const teamHierarchy = await SsrHelpers.portal.getTeamMembers.fetch();

  return {
    props: {
      teamHierarchy: teamHierarchy ?? {},
      trpcState: SsrHelpers.dehydrate(),
    },
  };
};

const Team = (props: TeamPageProps) => {
  return (
    <>
      <Head>
        <title>Calgary Solar Car - Cars</title>
      </Head>
      <main style={{ height: "auto" }}>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.title}>Our Team</div>
          <div className={styles.description}>
            {`The University of Calgary Solar Car Team was established in 2004 and
          has evolved to become an experienced solar racing team that also works
          to educate the community on renewable energy. The team is composed of
          students from various departments, working in collaboration with
          faculty to develop sustainable energy solutions. We are currently
          working on our sixth car and have completed 7 races with previous
          vehicles.`}
          </div>
          <div className={styles.teamMembersContainer}>
            <div className={styles.teamManagers}>
              <TeamMember user={props.teamHierarchy.engineeringTeamManager} />
              <TeamMember user={props.teamHierarchy.teamCaptain} />
              <TeamMember user={props.teamHierarchy.businessTeamManager} />
            </div>
            {props.teamHierarchy.leadRoles.length > 0 && (
              <div className={styles.teamRoleContainer}>
                <div className={styles.title}>Team Leads</div>
                <div className={styles.teamMembers}>
                  {props.teamHierarchy.leadRoles.map((teamMember) => (
                    <TeamMember
                      key={teamMember.clerkUserId}
                      user={teamMember}
                    />
                  ))}
                </div>
              </div>
            )}
            {props.teamHierarchy.accountingTeam.length > 0 && (
              <div className={styles.teamRoleContainer}>
                <div className={styles.title}>Accounting Team</div>
                <div className={styles.teamMembers}>
                  {props.teamHierarchy.accountingTeam.map((teamMember) => (
                    <TeamMember
                      key={teamMember.clerkUserId}
                      user={teamMember}
                    />
                  ))}
                </div>
              </div>
            )}
            {props.teamHierarchy.commmunicationsTeam.length > 0 && (
              <div className={styles.teamRoleContainer}>
                <div className={styles.title}>Communications Team</div>
                <div className={styles.teamMembers}>
                  {props.teamHierarchy.commmunicationsTeam.map((teamMember) => (
                    <TeamMember
                      key={teamMember.clerkUserId}
                      user={teamMember}
                    />
                  ))}
                </div>
              </div>
            )}
            {props.teamHierarchy.sponsorshipTeam.length > 0 && (
              <div className={styles.teamRoleContainer}>
                <div className={styles.title}>Sponsorship Team</div>
                <div className={styles.teamMembers}>
                  {props.teamHierarchy.sponsorshipTeam.map((teamMember) => (
                    <TeamMember
                      key={teamMember.clerkUserId}
                      user={teamMember}
                    />
                  ))}
                </div>
              </div>
            )}
            {props.teamHierarchy.softwareTeam.length > 0 && (
              <div className={styles.teamRoleContainer}>
                <div className={styles.title}>Software Team</div>
                <div className={styles.teamMembers}>
                  {props.teamHierarchy.softwareTeam.map((teamMember) => (
                    <TeamMember
                      key={teamMember.clerkUserId}
                      user={teamMember}
                    />
                  ))}
                </div>
              </div>
            )}
            {props.teamHierarchy.electricalTeam.length > 0 && (
              <div className={styles.teamRoleContainer}>
                <div className={styles.title}>Electrical Team</div>
                <div className={styles.teamMembers}>
                  {props.teamHierarchy.electricalTeam.map((teamMember) => (
                    <TeamMember
                      key={teamMember.clerkUserId}
                      user={teamMember}
                    />
                  ))}
                </div>
              </div>
            )}
            {props.teamHierarchy.mechanicalTeam.length > 0 && (
              <div className={styles.teamRoleContainer}>
                <div className={styles.title}>Mechanical Team</div>
                <div className={styles.teamMembers}>
                  {props.teamHierarchy.mechanicalTeam.map((teamMember) => (
                    <TeamMember
                      key={teamMember.clerkUserId}
                      user={teamMember}
                    />
                  ))}
                </div>
              </div>
            )}
            {props.teamHierarchy.multiTeam.length > 0 && (
              <div className={styles.teamRoleContainer}>
                <div className={styles.title}>Multi Team</div>
                <div className={styles.teamMembers}>
                  {props.teamHierarchy.multiTeam.map((teamMember) => (
                    <TeamMember
                      key={teamMember.clerkUserId}
                      user={teamMember}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default memo(Team);
