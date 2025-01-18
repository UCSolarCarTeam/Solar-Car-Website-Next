import Image from "next/image";
import { memo } from "react";

import Navbar from "@/components/Navbar";
import { type TeamPageProps } from "@/pages/team";
import { type RouterOutputs } from "@/utils/api";

import styles from "./index.module.scss";

export type TeamMember = RouterOutputs["portal"]["getTeamMembers"][number];

const TeamPage = (props: TeamPageProps) => {
  return (
    <>
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
          {props.teamMembers.map((teamMember) => {
            return (
              <div
                className={styles.teamMember}
                key={teamMember.profilePictureUrl}
              >
                <div className={styles.teamMemberImage}>
                  <Image
                    alt="Headshot"
                    fill
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
                  <div>{teamMember.teamRole}</div>
                  <div>{teamMember.fieldOfStudy}</div>
                  <div>{teamMember.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default memo(TeamPage);
