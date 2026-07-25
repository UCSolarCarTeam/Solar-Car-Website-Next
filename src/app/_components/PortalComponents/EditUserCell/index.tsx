import { useUser } from "@clerk/nextjs";
import type { UserResource } from "@clerk/nextjs/types";
import { useEffect, useState } from "react";
import EditUserPopupAdmin from "@/app/_components/PortalComponents/EditUserCell/EditUserPopupAdmin";
import styles from "@/app/_components/PortalComponents/EditUserCell/index.module.scss";
import type { User } from "@/generated/prisma/browser";

import BasicButton from "../../Buttons/BasicButton";

export interface EditUserCellProps {
  currentUser?: UserResource | undefined | null;
  currentRow: User;
}

const EditUserCell = ({ currentRow, currentUser }: EditUserCellProps) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const { user } = useUser();
  currentUser = currentUser ?? user;

  const togglePopup = () => {
    setPopupOpen((prev) => !prev);
  };

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

export default EditUserCell;
