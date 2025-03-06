import React, { memo, useCallback, useEffect, useState } from "react";

import EditUserPopup from "@/components/EditUserCell/EditUserPopup";
import styles from "@/components/EditUserCell/index.module.scss";
import { type UserResource } from "@clerk/types";
import { type AllTeamRoles } from "@prisma/client";

import BasicButton from "../Buttons/BasicButton";

export interface EditUserCellProps {
  currentUser: UserResource | undefined | null;
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
    phoneNumber: string | null;
    schoolEmail: string | null;
    ucid: number | null;
  };
}

const EditUserCell = ({ currentRow, currentUser }: EditUserCellProps) => {
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
    currentUser?.publicMetadata?.role === "admin" ||
    currentUser?.publicMetadata?.role === "business" ||
    currentRow.clerkUserId === currentUser?.id
  ) {
    return (
      <div className={styles.editTeamCell}>
        <BasicButton onClick={() => setPopupOpen((prev) => !prev)}>
          Edit
        </BasicButton>
        {popupOpen && (
          <EditUserPopup
            currentRow={currentRow}
            currentUser={currentUser}
            togglePopup={togglePopup}
          />
        )}
      </div>
    );
  }

  return null;
};

export default memo(EditUserCell);
