import { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";

import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import PlusIcon from "@/app/_components/svgs/PlusIcon";

import BasicButton from "../../Buttons/BasicButton";
import EditFormPopup from "./EditFormPopup";

export interface EditRecruitmentFormCellProps {
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
  newForm,
}: EditRecruitmentFormCellProps) => {
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

  if (newForm) {
    return (
      <>
        <FaCirclePlus
          aria-label="Add recruitment form"
          className="cursor-pointer"
          color="#000000"
          onClick={togglePopup}
          size={24}
        />
        {popupOpen && (
          <EditFormPopup
            currentRow={currentRow}
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
          newForm={false}
          togglePopup={togglePopup}
        />
      )}
    </div>
  );
};

export default EditRecruitmentFormCell;
