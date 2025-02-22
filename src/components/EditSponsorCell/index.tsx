import { memo, useCallback, useEffect, useState } from "react";

import PlusIcon from "@/components/svgs/PlusIcon";

import EditSponsorPopup from "./EditSponsorPopup";

export interface EditSponsorCellProps {
  currentRow: {
    id: number;
    name: string;
    description: string | null;
    websiteUrl: string;
    logoUrl: string;
  };
  newSponsor: boolean;
}

const EditSponsorCell = ({ currentRow, newSponsor }: EditSponsorCellProps) => {
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

  if (popupOpen)
    return (
      <EditSponsorPopup
        currentRow={currentRow}
        newSponsor={false}
        togglePopup={togglePopup}
      />
    );

  return null;
};

export default memo(EditSponsorCell);
