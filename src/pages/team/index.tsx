import Head from "next/head";
import Image from "next/image";
import { type GetServerSideProps } from "next/types";
import { memo } from "react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { type RouterOutputs, type SsrTrpcHelper, api } from "@/utils/api";
import { SsrHelpers } from "@/utils/api";

import styles from "./index.module.scss";

type TeamMember = RouterOutputs["portal"]["getTeamMembers"][number];

export type TeamPageProps = {
  teamMembers: TeamMember[];
} & SsrTrpcHelper;

export const getServerSideProps: GetServerSideProps<
  TeamPageProps
> = async () => {
  const teamMembers = await SsrHelpers.portal.getTeamMembers.fetch();

  return {
    props: {
      teamMembers: teamMembers ?? [],
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
            {props.teamMembers.length > 0 &&
              props.teamMembers.map((teamMember) => {
                return (
                  <div
                    className={styles.teamMember}
                    key={teamMember.profilePictureUrl}
                  >
                    <div className={styles.teamMemberImage}>
                      <Image
                        alt="Headshot"
                        fill
                        loading="eager"
                        src={
                          teamMember.profilePictureUrl ??
                          "/DefaultProfilePicture.png"
                        }
                      />
                    </div>
                    <div>
                      <div>
                        {[teamMember.firstName, teamMember.lastName].join(" ")}
                      </div>
                      <div>
                        {(teamMember.teamRole ?? "").replace(
                          /([a-z])([A-Z])/g,
                          "$1 $2",
                        )}
                      </div>
                      <div>{teamMember.fieldOfStudy}</div>
                      <div>{teamMember.description}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default memo(Team);
