import Image from "next/image";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo } from "react";

import styles from "@/app/_components/PortalComponents/TeamMember/index.module.scss";
import { type User } from "@prisma/client";

type TeamMemberProps = {
  user: User | null | undefined;
};

const TeamMember = ({ user }: TeamMemberProps) => {
  if (!user) return null;
  return (
    <div className={styles.teamMember} key={user.profilePictureUrl}>
      <div className={styles.teamMemberImage}>
        <Image
          alt="Headshot"
          fill
          loading="eager"
          src={user.profilePictureUrl ?? defaultProfilePicture}
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </div>
      <div>
        <div className={styles.name}>
          {[user.firstName, user.lastName].join(" ")}
        </div>
        <div className={styles.teamRole}>
          {(user.teamRole ?? "").replace(/([a-z])([A-Z])/g, "$1 $2")}
        </div>
        <div className={styles.fieldOfStudy}>{user.fieldOfStudy}</div>
        <div className={styles.description}>{user.description}</div>
      </div>
    </div>
  );
};

export default memo(TeamMember);
