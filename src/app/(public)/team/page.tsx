import { type Metadata } from "next";

import ActiveTeam from "./components/ActiveTeam";
import AlumniTeam from "./components/AlumniTeam";
import styles from "./index.module.scss";

export const metadata: Metadata = {
  description:
    "Meet the passionate and dedicated members of the University of Calgary Solar Car Team. Our team is composed of students from various departments, working in collaboration with faculty to develop sustainable energy solutions. Learn more about our active team members and alumni who have contributed to our success in solar racing.",
  title: "Our Team | University of Calgary Solar Car Team",
};
const TEMP_FLAG = true;
const Team = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Our Team</div>
      <div className={styles.description}>
        The University of Calgary Solar Car Team was established in 2004 and has
        evolved to become an experienced solar racing team that also works to
        educate the community on renewable energy. The team is composed of
        students from various departments, working in collaboration with faculty
        to develop sustainable energy solutions. We are currently working on our
        sixth car and have completed 7 races with previous vehicles.
      </div>
      {TEMP_FLAG ? (
        <div className={styles.teamMembersContainer}>
          <ActiveTeam />
          <AlumniTeam />
        </div>
      ) : (
        <PageUnavailable />
      )}
    </div>
  );
};
function PageUnavailable() {
  return (
    <div className={styles.teamMembersContainer}>
      <div className={styles.description}>
        This page is currently being built. Please check back later for more
        information.
      </div>
    </div>
  );
}
export default Team;
