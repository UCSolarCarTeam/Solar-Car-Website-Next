"use client";

import Image from "next/image";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo } from "react";

import styles from "@/app/_components/Alumni/index.module.scss";
import Linkedin from "@/app/_components/svgs/Linkedin";
import Quote from "@/app/_components/svgs/Quote";
import { type User } from "@prisma/client";

// type AlumniUserProps = {
//   alumni: User | null | undefined;
// };

const alumni = {
  company: "Google",
  featured: true,
  graduationYear: "2018",
  id: 1,
  //   image: "/professional-woman-software-engineer.png",
  linkedinUrl: "https://linkedin.com/in/sarahchen",
  name: "Sarah Chen",
  quote:
    "The foundation I built here opened doors I never imagined possible. The mentorship and community continue to inspire my journey.",
  title: "Senior Software Engineer",
};

const AlumniMember = () => {
  // const AlumniMember = ({ alumni }: AlumniUserProps) => {
  if (!alumni) return null;
  return (
    <div className={styles.alumniCard}>
      <div className={styles.alumniCardContent}>
        <div className={styles.alumniCardHeader}>
          <div className={styles.alumniCardAvatar}>
            <Image
              alt="Headshot"
              className={styles.alumniCardAvatarImage}
              fill
              loading="eager"
              src={alumni.image ?? defaultProfilePicture}
              //   src={alumni.profilePictureUrl ?? defaultProfilePicture}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className={styles.alumniCardInfo}>
            <h3 className={styles.alumniCardName}>
              {/* {[alumni.firstName, alumni.lastName].join(" ")} */}
              {alumni.name}
            </h3>
            <p className={styles.alumniCardTitle}>{alumni?.title}</p>
            <p className={styles.alumniCardCompany}>{alumni?.company}</p>
          </div>
        </div>

        {alumni.featured && alumni.quote && (
          <blockquote className={styles.alumniCardQuote}>
            <Quote className={styles.alumniCardQuoteIcon} />
            <span>&quot;{alumni.quote}&quot;</span>
          </blockquote>
        )}

        <div className={styles.alumniCardFooter}>
          <button
            className={styles.alumniCardLinkedinBtn}
            onClick={() => window.open(alumni.linkedinUrl, "_blank")}
          >
            <Linkedin className={styles.alumniCardLinkedinIcon} />
          </button>
          <span className={styles.alumniCardClassTag}>
            Class of {alumni.graduationYear}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(AlumniMember);
