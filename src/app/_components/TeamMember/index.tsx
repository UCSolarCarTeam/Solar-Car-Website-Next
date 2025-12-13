import Image from "next/image";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo } from "react";

import styles from "@/app/_components/TeamMember/index.module.scss";
import { type User } from "@prisma/client";

type TeamMemberProps = {
  user: User | null | undefined;
};

const TeamMember = ({ user }: TeamMemberProps) => {
  if (!user) return null;
  return (
    <div
      className={`${styles.teamMember} ${
        user.fieldOfStudy || user.description ? styles.hasOverlay : ""
      }`}
      key={user.profilePictureUrl}
    >
      {" "}
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
      <div className={styles.nameRoleContainer}>
        <div className={styles.name}>
          {[user.firstName, user.lastName].join(" ")}
        </div>
        <div className={styles.teamRole}>
          {(user.teamRole ?? "").replace(/([a-z])([A-Z])/g, "$1 $2")}
        </div>
      </div>
      {/* Hover overlay */}
      {(user.fieldOfStudy ?? user.description) && (
        <div className={styles.hoverOverlay}>
          <div className={styles.overlayContent}>
            {user.fieldOfStudy && (
              <div className={styles.fieldOfStudy}>{user.fieldOfStudy}</div>
            )}
            {user.description && (
              <div className={styles.description}>{user.description}</div>
            )}
            <div className={styles.overlayDivider}></div>
            {user.linkedIn && (
              <div className={styles.linkedIn}><a href={user.linkedIn}><img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" alt="linkedin logo" /></a></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(TeamMember);
