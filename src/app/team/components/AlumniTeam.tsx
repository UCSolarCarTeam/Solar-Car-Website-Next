import TeamMember from "@/app/_components/TeamMember";
import styles from "@/app/team/index.module.scss";
import { trpcStatic } from "@/trpc/server";

export default async function AlumniTeam() {
  const alumniTeam = await trpcStatic.fe.getAlumni();
  if (!alumniTeam || alumniTeam.length === 0) {
    return null;
  }
  return (
    <div className={styles.teamRoleContainer}>
      <div className={styles.title}>Alumni</div>
      <div className={styles.teamMembers}>
        {alumniTeam.map((teamMember) => (
          <TeamMember key={teamMember.id} user={teamMember} />
        ))}
      </div>
    </div>
  );
}
