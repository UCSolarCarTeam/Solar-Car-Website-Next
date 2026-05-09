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

  // Determine if this is an alumnus by checking if yearRetired exists
  const isAlumni = user.yearRetired !== null && user.yearRetired !== undefined;

  // Use companyTitle for alumni, description for active members
  const description = isAlumni
    ? (user.companyTitle ?? user.description ?? null)
    : (user.description ?? null);

  // Show company for alumni, otherwise show fieldOfStudy; include description and linkedIn
  const overlayLeft = isAlumni ? user.company : user.fieldOfStudy;
  const hasOverlay = overlayLeft ?? description ?? user.linkedIn ?? false;

  return (
    <div
      className={`${styles.teamMember} ${hasOverlay ? styles.hasOverlay : ""}`}
      key={user.profilePictureUrl}
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
          {user.yearJoined && user.yearRetired && (
            <>
              <br />
              {user.yearJoined} - {user.yearRetired}
            </>
          )}
        </div>
      </div>
      {/* Hover overlay */}
      {hasOverlay && (
        <div className={styles.hoverOverlay}>
          <div className={styles.overlayContent}>
            {overlayLeft && (
              <div className={styles.fieldOfStudy}>{overlayLeft}</div>
            )}
            {description && (
              <div className={styles.description}>{description}</div>
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
