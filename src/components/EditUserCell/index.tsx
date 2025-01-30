import React, { memo, useCallback, useEffect, useState } from "react";

import EditUserPopup from "@/components/EditUserCell/EditUserPopup";
import styles from "@/components/EditUserCell/index.module.scss";
import { useUser } from "@clerk/nextjs";
import { type AllTeamRoles } from "@prisma/client";

export interface EditUserCellProps {
  currentRow: {
    description: string | null;
    id: number;
    clerkUserId: string;
    firstName: string | null;
    lastName: string | null;
    fieldOfStudy: string | null;
    teamRole: AllTeamRoles | null;
    schoolYear: string | null;
    yearJoined: string | null;
    profilePictureUrl: string | null;
  };
}

const EditUserCell = ({ currentRow }: EditUserCellProps) => {
  const { user } = useUser();
  const [popupOpen, setPopupOpen] = useState(false);

  const togglePopup = useCallback(() => {
    setPopupOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const closePopup = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPopupOpen(false);
      }
    };

    window.addEventListener("keydown", closePopup);

    return () => {
      window.removeEventListener("keydown", closePopup);
    };
  }, []);

  if (
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.role === "business" ||
    currentRow.clerkUserId === user?.id
  ) {
    return (
      <div className={styles.editTeamCell}>
        <span onClick={() => setPopupOpen((prev) => !prev)}>Edit</span>
        {popupOpen && (
          <EditUserPopup currentRow={currentRow} togglePopup={togglePopup} />
        )}
      </div>
    );
  }

  return null;
};

export default memo(EditUserCell);
