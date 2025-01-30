import Head from "next/head";
import { type GetServerSideProps } from "next/types";
import { memo } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TeamMember from "@/components/teamMember";
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
          <div className={styles.teamMembers}>
            <TeamMember user={props.teamHierarchy.engineeringTeamManager} />
            <TeamMember user={props.teamHierarchy.teamCaptain} />
            <TeamMember user={props.teamHierarchy.businessTeamManager} />
            <div>
              Team Leads
              {props.teamHierarchy.leadRoles.map((teamMember) => (
                <TeamMember key={teamMember.clerkUserId} user={teamMember} />
              ))}
            </div>
            <div>
              Accounting Team
              {props.teamHierarchy.accountingTeam.map((teamMember) => (
                <TeamMember key={teamMember.clerkUserId} user={teamMember} />
              ))}
            </div>
            <div>
              Communications Team
              {props.teamHierarchy.commmunicationsTeam.map((teamMember) => (
                <TeamMember key={teamMember.clerkUserId} user={teamMember} />
              ))}
            </div>
            <div>
              Sponsorship Team
              {props.teamHierarchy.sponsorshipTeam.map((teamMember) => (
                <TeamMember key={teamMember.clerkUserId} user={teamMember} />
              ))}
            </div>
            <div>
              Software Team
              {props.teamHierarchy.softwareTeam.map((teamMember) => (
                <TeamMember key={teamMember.clerkUserId} user={teamMember} />
              ))}
            </div>
            <div>
              Electrical Team
              {props.teamHierarchy.electricalTeam.map((teamMember) => (
                <TeamMember key={teamMember.clerkUserId} user={teamMember} />
              ))}
            </div>
            <div>
              Mechanical Team
              {props.teamHierarchy.mechanicalTeam.map((teamMember) => (
                <TeamMember key={teamMember.clerkUserId} user={teamMember} />
              ))}
            </div>
            <div>
              Multi Team
              {props.teamHierarchy.multiTeam.map((teamMember) => (
                <TeamMember key={teamMember.clerkUserId} user={teamMember} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default memo(Team);
