import { memo, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import CloseButton from "@/app/_components/Buttons/CloseButton";
import { type EditRecruitmentCellProps } from "@/app/_components/PortalComponents/EditRecruitmentFormCell";
import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import { trpc } from "@/trpc/react";

import BasicButton from "../../Buttons/BasicButton";

type EditRecruitmentFormPopupProps = {
  togglePopup: () => void;
} & EditRecruitmentCellProps;

const EditFormPopup = ({
  currentRow,
  newForm,
  togglePopup,
}: EditRecruitmentFormPopupProps) => {
  const utils = trpc.useUtils();
  const createRecruitmentForm = trpc.portal.createRecruitmentForm.useMutation({
    onError: () => {
      toast.error(
        "There was an error saving your changes. Please contact Telemetry Team.",
      );
      setSaving(false);
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getFormsList.invalidate(), {
        loading: "Saving...",
        success: "Recruitment form created successfully!",
      });
      setSaving(false);
      togglePopup();
    },
  });
  const mutateRecruitmentForm = trpc.portal.updateRecruitmentForm.useMutation({
    onError: () => {
      toast.error(
        "There was an error saving your changes. Please contact Telemetry Team.",
      );
      setSaving(false);
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getFormsList.invalidate(), {
        loading: "Saving...",
        success: "Recruitment form updated successfully!",
      });
      setSaving(false);
      togglePopup();
    },
  });

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        togglePopup();
      }
    },
    [togglePopup],
  );

  const [touched, setTouched] = useState(false);
  const [newRowData, setNewRowData] = useState({
    ...currentRow,
  });
  const [saving, setSaving] = useState(false);

  const rowDataToRender = useMemo(() => {
    const fields = [
      { id: "header", label: "Header" },
      { id: "description", label: "Description" },
      { id: "link", label: "Link" },
    ];
    return fields.reduce(
      (acc, { id, label }) => {
        acc[id] = {
          id,
          label,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value: newRowData[id] ?? "",
        };
        return acc;
      },
      {} as Record<
        string,
        { id: string; label: string; value: string | number }
      >,
    );
  }, [newRowData]);

  const onInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setTouched(true);
    setNewRowData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = useCallback(async () => {
    if (touched) {
      setSaving(true);
      if (newForm) {
        createRecruitmentForm.mutate({
          ...newRowData,
        });
      } else {
        mutateRecruitmentForm.mutate({
          ...newRowData,
        });
      }
    } else {
      togglePopup();
    }
  }, [
    touched,
    newForm,
    createRecruitmentForm,
    newRowData,
    mutateRecruitmentForm,
    togglePopup,
  ]);

  return (
    <div className={styles.popup} onClick={handleOverlayClick}>
      <div className={`${styles.popupContent} ${styles.popupEnter}`}>
        <CloseButton className={styles.closeButton} onClick={togglePopup} />
        <h2>{newForm ? "New Form" : "Edit Form"}</h2>
        <div className={styles.popupLayout}>
          {newRowData && (
            <div className={styles.popupForm}>
              {Object.values(rowDataToRender).map((row) => (
                <div key={row.id}>
                  <label htmlFor={row.id}>{row.label}</label>
                  <input
                    className={styles.textFieldInput}
                    id={row.id}
                    name={row.label}
                    onChange={onInputChange}
                    type={row.id === "link" ? "url" : "text"}
                    value={row.value ?? ""}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          {saving ? (
            <p>Saving...</p>
          ) : (
            <>
              <BasicButton onClick={togglePopup}>Cancel</BasicButton>
              <BasicButton
                onClick={handleSave}
                style={{ backgroundColor: "#53A551" }}
              >
                Save
              </BasicButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(EditFormPopup);
