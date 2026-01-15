import Image from "next/image";
import Link from "next/link";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo } from "react";

import styles from "@/app/_components/TeamMember/index.module.scss";
import { type User } from "@prisma/client";

import Linkedin from "../svgs/Linkedin";

type TeamMemberProps = {
  user: User | null | undefined;
};

const TeamMember = ({ user }: TeamMemberProps) => {
  if (!user) return null;

  const hasOverlay =
    user.fieldOfStudy || user.description || user.linkedIn;

  return (
    <div
      className={`${styles.teamMember} ${hasOverlay ? styles.hasOverlay : ""}`}
    >
      <div className={styles.teamMemberImage}>
        <Image
          alt="Headshot"
          fill
          loading="eager"
          src={user.profilePictureUrl ?? defaultProfilePicture}
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className={styles.nameRoleContainer}>
        <div className={styles.name}>
          {[user.firstName, user.lastName].filter(Boolean).join(" ")}
        </div>
        <div className={styles.teamRole}>
          {(user.teamRole ?? "").replace(/([a-z])([A-Z])/g, "$1 $2")}
        </div>
      </div>

      {hasOverlay && (
        <div className={styles.hoverOverlay}>
          <div className={styles.overlayContent}>
            {user.fieldOfStudy && (
              <div className={styles.fieldOfStudy}>{user.fieldOfStudy}</div>
            )}

            {user.description && (
              <div className={styles.description}>{user.description}</div>
            )}

            {user.linkedIn && (
              <div className={styles.linkedIn}>
                <Link
                  href={user.linkedIn}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Linkedin height={20} width={20} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(TeamMember);
