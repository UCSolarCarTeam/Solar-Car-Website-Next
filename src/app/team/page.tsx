"use server";

import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import TeamMember from "@/app/_components/TeamMember";
import styles from "@/app/team/index.module.scss";
import { HydrateClient, trpc } from "@/trpc/server";

const Team = async () => {
  const teamHierarchy = await trpc.fe.getTeamMembers();

  const tempFlag = false;

  const {
    accountingTeam,
    businessTeamManager,
    commmunicationsTeam,
    electricalTeam,
    engineeringTeamManager,
    leadRoles,
    managerRoles,
    mechanicalTeam,
    multiTeam,
    softwareTeam,
    sponsorshipTeam,
    teamCaptain,
  } = teamHierarchy ?? {};

  return (
    <HydrateClient>
      <main className={styles.maincontainer}>
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
          {tempFlag ? (
            <div className={styles.teamMembersContainer}>
              <div className={styles.teamManagers}>
                <TeamMember user={engineeringTeamManager} />
                <TeamMember user={teamCaptain} />
                <TeamMember user={businessTeamManager} />
              </div>
              {managerRoles && managerRoles.length > 0 && (
                <div className={styles.teamRoleContainer}>
                  <div className={styles.title}>Subteam Managers</div>
                  <div className={styles.teamMembers}>
                    {managerRoles.map((teamMember) => (
                      <TeamMember
                        key={teamMember.clerkUserId}
                        user={teamMember}
                      />
                    ))}
                  </div>
                </div>
              )}
              {leadRoles && leadRoles.length > 0 && (
                <div className={styles.teamRoleContainer}>
                  <div className={styles.title}>Team Leads</div>
                  <div className={styles.teamMembers}>
                    {leadRoles.map((teamMember) => (
                      <TeamMember
                        key={teamMember.clerkUserId}
                        user={teamMember}
                      />
                    ))}
                  </div>
                </div>
              )}
              {accountingTeam && accountingTeam.length > 0 && (
                <div className={styles.teamRoleContainer}>
                  <div className={styles.title}>Accounting Team</div>
                  <div className={styles.teamMembers}>
                    {accountingTeam.map((teamMember) => (
                      <TeamMember
                        key={teamMember.clerkUserId}
                        user={teamMember}
                      />
                    ))}
                  </div>
                </div>
              )}
              {commmunicationsTeam && commmunicationsTeam.length > 0 && (
                <div className={styles.teamRoleContainer}>
                  <div className={styles.title}>Communications Team</div>
                  <div className={styles.teamMembers}>
                    {commmunicationsTeam.map((teamMember) => (
                      <TeamMember
                        key={teamMember.clerkUserId}
                        user={teamMember}
                      />
                    ))}
                  </div>
                </div>
              )}
              {sponsorshipTeam && sponsorshipTeam.length > 0 && (
                <div className={styles.teamRoleContainer}>
                  <div className={styles.title}>Sponsorship Team</div>
                  <div className={styles.teamMembers}>
                    {sponsorshipTeam.map((teamMember) => (
                      <TeamMember
                        key={teamMember.clerkUserId}
                        user={teamMember}
                      />
                    ))}
                  </div>
                </div>
              )}
              {softwareTeam && softwareTeam.length > 0 && (
                <div className={styles.teamRoleContainer}>
                  <div className={styles.title}>Software Team</div>
                  <div className={styles.teamMembers}>
                    {softwareTeam.map((teamMember) => (
                      <TeamMember
                        key={teamMember.clerkUserId}
                        user={teamMember}
                      />
                    ))}
                  </div>
                </div>
              )}
              {electricalTeam && electricalTeam.length > 0 && (
                <div className={styles.teamRoleContainer}>
                  <div className={styles.title}>Electrical Team</div>
                  <div className={styles.teamMembers}>
                    {electricalTeam.map((teamMember) => (
                      <TeamMember
                        key={teamMember.clerkUserId}
                        user={teamMember}
                      />
                    ))}
                  </div>
                </div>
              )}
              {mechanicalTeam && mechanicalTeam.length > 0 && (
                <div className={styles.teamRoleContainer}>
                  <div className={styles.title}>Mechanical Team</div>
                  <div className={styles.teamMembers}>
                    {mechanicalTeam.map((teamMember) => (
                      <TeamMember
                        key={teamMember.clerkUserId}
                        user={teamMember}
                      />
                    ))}
                  </div>
                </div>
              )}
              {multiTeam && multiTeam.length > 0 && (
                <div className={styles.teamRoleContainer}>
                  <div className={styles.title}>Multi Team</div>
                  <div className={styles.teamMembers}>
                    {multiTeam.map((teamMember) => (
                      <TeamMember
                        key={teamMember.clerkUserId}
                        user={teamMember}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.teamMembersContainer}>
              <div className={styles.description}>
                {`This page is currently being built. Please check back later for
                more information.`}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </HydrateClient>
  );
};

export default Team;
