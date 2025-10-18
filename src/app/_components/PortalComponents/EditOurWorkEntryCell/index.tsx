import { memo, useCallback, useEffect, useState } from "react";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import PlusIcon from "@/app/_components/svgs/PlusIcon";
import { type UserResource } from "@clerk/types";

import BasicButton from "../../Buttons/BasicButton";
import EditOurWorkEntryPopup from "./EditOurWorkEntryPopup";

export interface EditOurWorkEntryCellProps {
  currentUser: UserResource | undefined | null;
  currentRow: {
    id: number;
    year: number;
    monthNum: number;
    monthName: string;
    description: string | null;
    imageUrl: string | null;
  };
  newEntry: boolean;
}

const EditOurWorkEntryCell = ({
  currentRow,
  currentUser,
  newEntry,
}: EditOurWorkEntryCellProps) => {
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

  if (newEntry) {
    return (
      <>
        <PlusIcon fill="#000000" onClick={togglePopup} size="md" />
        {popupOpen && (
          <EditOurWorkEntryPopup
            currentRow={currentRow}
            currentUser={currentUser}
            newEntry
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
        <EditOurWorkEntryPopup
          currentRow={currentRow}
          currentUser={currentUser}
          newEntry={false}
          togglePopup={togglePopup}
        />
      )}
    </div>
  );
};

export default memo(EditOurWorkEntryCell);
