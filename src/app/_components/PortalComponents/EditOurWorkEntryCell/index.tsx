import { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";

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

  if (newEntry) {
    return (
      <>
        <FaCirclePlus
          aria-label="Add timeline entry"
          className="cursor-pointer"
          color="#000000"
          onClick={togglePopup}
          size={24}
        />
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
