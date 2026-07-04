import { useCallback, useEffect, useState } from "react";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import PlusIcon from "@/app/_components/svgs/PlusIcon";

import BasicButton from "../../Buttons/BasicButton";
import EditOurWorkEntryPopup from "./EditOurWorkEntryPopup";

export interface EditOurWorkEntryCellProps {
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
          newEntry={false}
          togglePopup={togglePopup}
        />
      )}
    </div>
  );
};

export default EditOurWorkEntryCell;
