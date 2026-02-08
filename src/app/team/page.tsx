import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import styles from "@/app/team/index.module.scss";

import ActiveTeam from "./components/ActiveTeam";
import AlumniTeam from "./components/AlumniTeam";

const Team = () => {
  const tempFlag = true;

  return (
    <main className={styles.maincontainer}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.title}>Our Team</div>
        <div className={styles.description}>
          The University of Calgary Solar Car Team was established in 2004 and
          has evolved to become an experienced solar racing team that also works
          to educate the community on renewable energy. The team is composed of
          students from various departments, working in collaboration with
          faculty to develop sustainable energy solutions. We are currently
          working on our sixth car and have completed 7 races with previous
          vehicles.
        </div>
        {tempFlag ? (
          <div className={styles.teamMembersContainer}>
            <ActiveTeam />
            <AlumniTeam />
          </div>
        ) : (
          <PageUnavailable />
        )}
      </div>
      <Footer />
    </main>
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
