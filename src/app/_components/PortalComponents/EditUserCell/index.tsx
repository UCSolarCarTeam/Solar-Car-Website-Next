import React, { memo, useCallback, useEffect, useState } from "react";

import EditUserPopupAdmin from "@/app/_components/PortalComponents/EditUserCell/EditUserPopupAdmin";
import styles from "@/app/_components/PortalComponents/EditUserCell/index.module.scss";
import { type UserResource } from "@clerk/types";
import { type AllTeamRoles } from "@prisma/client";

import BasicButton from "../../Buttons/BasicButton";

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

  return (
    <div className={styles.editTeamCell}>
      <BasicButton onClick={() => setPopupOpen((prev) => !prev)}>
        Edit
      </BasicButton>
      {popupOpen && (
        <EditUserPopupAdmin
          currentRow={currentRow}
          currentUser={currentUser}
          togglePopup={togglePopup}
        />
      )}
    </div>
  );
};

export default memo(EditUserCell);
