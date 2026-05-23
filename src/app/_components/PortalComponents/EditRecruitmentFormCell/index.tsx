import { memo, useCallback, useEffect, useState } from "react";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import PlusIcon from "@/app/_components/svgs/PlusIcon";
import { type UserResource } from "@clerk/types";

import BasicButton from "../../Buttons/BasicButton";
import EditFormPopup from "./EditFormPopup";

export interface EditRecruitmentFormCellProps {
  currentUser: UserResource | undefined | null;
  currentRow: {
    id: number;
    header: string;
    description: string;
    link: string;
    expiresAt: string;
  };
  newForm: boolean;
}

const EditRecruitmentFormCell = ({
  currentRow,
  currentUser,
  newForm,
}: EditRecruitmentFormCellProps) => {
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

  if (newForm) {
    return (
      <>
        <PlusIcon fill="#000000" onClick={togglePopup} size="md" />
        {popupOpen && (
          <EditFormPopup
            currentRow={currentRow}
            currentUser={currentUser}
            newForm
            togglePopup={togglePopup}
          />
        )}
      </>
    );
  }

  return (
    <div className={styles.editSponsorCell}>
      <BasicButton onClick={() => setPopupOpen((prev) => !prev)}>
        Edit
      </BasicButton>
      {popupOpen && (
        <EditFormPopup
          currentRow={currentRow}
          currentUser={currentUser}
          newForm={false}
          togglePopup={togglePopup}
        />
      )}
    </div>
  );
};

export default memo(EditRecruitmentFormCell);
