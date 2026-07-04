import { useEffect, useState } from "react";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import PlusIcon from "@/app/_components/svgs/PlusIcon";
import { type SponsorLevel } from "@prisma/client";

import BasicButton from "../../Buttons/BasicButton";
import EditSponsorPopup from "./EditSponsorPopup";

export interface EditSponsorCellProps {
  currentRow: {
    id: number;
    name: string;
    description: string | null;
    sponsorLevel: SponsorLevel;
    websiteUrl: string;
    logoUrl: string;
  };
  newSponsor: boolean;
}

const EditSponsorCell = ({ currentRow, newSponsor }: EditSponsorCellProps) => {
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

  if (newSponsor) {
    return (
      <>
        <PlusIcon fill="#000000" onClick={togglePopup} size="md" />
        {popupOpen && (
          <EditSponsorPopup
            currentRow={currentRow}
            newSponsor
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
        <EditSponsorPopup
          currentRow={currentRow}
          newSponsor={false}
          togglePopup={togglePopup}
        />
      )}
    </div>
  );
};

export default EditSponsorCell;
