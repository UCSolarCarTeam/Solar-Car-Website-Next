import { memo, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import CloseButton from "@/app/_components/Buttons/CloseButton";
import { type EditRecruitmentFormCellProps } from "@/app/_components/PortalComponents/EditRecruitmentFormCell";
import styles from "@/app/_components/PortalComponents/EditRecruitmentFormCell/index.module.scss";
import { trpc } from "@/trpc/react";

import BasicButton from "../../Buttons/BasicButton";

type EditRecruitmentFormPopupProps = {
  togglePopup: () => void;
} & EditRecruitmentFormCellProps;

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
      { id: "expiresAt", label: "Expires At" }, // Add expiresAt field
    ];
    return fields.reduce(
      (acc, { id, label }) => {
        let value = newRowData[id as keyof typeof newRowData] ?? "";
        if (id === "expiresAt" && value) {
          try {
            const date = new Date(value);
            value = toLocalDateTimeString(date);
          } catch {
            value = "";
          }
        }
        acc[id] = {
          id,
          label,
          value,
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
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setTouched(true);
    setNewRowData((prev) => {
      return { ...prev, [id]: value };
    });
  };

  const handleSave = useCallback(async () => {
    if (touched) {
      setSaving(true);
      const payload = {
        ...newRowData,
        expiresAt: new Date(newRowData.expiresAt).toISOString(),
      };
      if (newForm) {
        createRecruitmentForm.mutate(payload);
      } else {
        mutateRecruitmentForm.mutate(payload);
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
                  {row.id === "description" ? (
                    <textarea
                      className={styles.textFieldInput}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                      rows={4}
                      style={{ resize: "vertical" }}
                      value={row.value ?? ""}
                    />
                  ) : row.id === "expiresAt" ? (
                    <input
                      className={styles.textFieldInput}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                      type="datetime-local"
                      value={row.value ?? ""}
                    />
                  ) : (
                    <input
                      className={styles.textFieldInput}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                      type={row.id === "link" ? "url" : "text"}
                      value={row.value ?? ""}
                    />
                  )}
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

function toLocalDateTimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

export default memo(EditFormPopup);
