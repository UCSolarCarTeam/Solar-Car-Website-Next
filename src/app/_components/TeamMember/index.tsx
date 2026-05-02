import Image from "next/image";
import Link from "next/link";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo } from "react";

import styles from "@/app/_components/TeamMember/index.module.scss";
import { type Alumni, type User } from "@prisma/client";

import Linkedin from "../svgs/Linkedin";

type TeamMemberProps = {
  user: User | Alumni | null | undefined;
};

const TeamMember = ({ user }: TeamMemberProps) => {
  if (!user) return null;

  // team members use fieldOfStudy and description; alumni use company and position
  const isAlumni = !("fieldOfStudy" in user);
  const fieldOrCompany =
    "fieldOfStudy" in user ? user.fieldOfStudy : user.company;
  const description = "description" in user ? user.description : user.position;

  const hasOverlay = fieldOrCompany ?? description ?? user.linkedIn ?? false;

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
          {"yearJoinedSolarCar" in user &&
            user.yearJoinedSolarCar &&
            user.yearLeftSolarCar && (
              <>
                <br />
                {user.yearJoinedSolarCar} - {user.yearLeftSolarCar}
              </>
            )}
        </div>
      </div>
      {/* Hover overlay */}
      {hasOverlay && (
        <div className={styles.hoverOverlay}>
          <div className={styles.overlayContent}>
            {fieldOrCompany && (
              <div className={styles.fieldOfStudy}>
                {isAlumni ? `Works at ${fieldOrCompany}` : fieldOrCompany}
              </div>
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
