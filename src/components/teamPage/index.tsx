import { memo } from "react";

import Navbar from "@/components/Navbar";
import styles from "@/components/teamPage/index.module.scss";

const TeamPage = () => {
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
      </div>
    </>
  );
};

export default memo(TeamPage);
