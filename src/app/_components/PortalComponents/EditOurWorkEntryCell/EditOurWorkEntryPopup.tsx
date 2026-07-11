import { useState } from "react";
import toast from "react-hot-toast";

import CloseButton from "@/app/_components/Buttons/CloseButton";
import type { EditOurWorkEntryCellProps } from "@/app/_components/PortalComponents/EditOurWorkEntryCell";
import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import { compress } from "@/app/_lib/compress";
import { runPortalAction } from "@/app/portal/_lib/runAction";
import { createOurWorkEntry, updateOurWorkEntry } from "@/app/portal/actions";

import BasicButton from "../../Buttons/BasicButton";
import DropZone from "../DropZone";

type EditOurWorkEntryPopupProps = {
  togglePopup: () => void;
} & EditOurWorkEntryCellProps;

const EditOurWorkEntryPopup = ({
  currentRow,
  newEntry,
  togglePopup,
}: EditOurWorkEntryPopupProps) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      togglePopup();
    }
  };

  const [touched, setTouched] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dateValue, setDateValue] = useState<string>(() => {
    if (newEntry || !currentRow.year || !currentRow.monthNum) {
      return "";
    }
    const year = currentRow.year;
    const month = String(currentRow.monthNum).padStart(2, "0");
    return `${year}-${month}-01T00:00`;
  });
  const [newRowData, setNewRowData] = useState({
    ...currentRow,
    description: currentRow.description ?? "",
    imageUrl: currentRow.imageUrl ?? "",
  });
  const [saving, setSaving] = useState(false);

  const rowDataToRender = {
    date: {
      id: "date",
      label: "Date (Month & Year)",
      value: dateValue,
    },
    description: {
      id: "description",
      label: "Description",
      value: newRowData.description,
    },
    imageUrl: {
      id: "imageUrl",
      label: "Image",
      value: newRowData.imageUrl,
    },
  };

  const onInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setTouched(true);

    if (id === "date") {
      setDateValue(value);
    } else {
      setNewRowData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const saveEntry = async (imageUrl?: string) => {
    const date = new Date(dateValue);
    const year = date.getFullYear();
    const monthNum = date.getMonth() + 1;
    const monthName = date.toLocaleString("en-US", { month: "long" });

    const payload = {
      ...newRowData,
      imageUrl: imageUrl ?? newRowData.imageUrl,
      monthName,
      monthNum,
      year,
    };

    const messages = {
      error:
        "There was an error saving your changes. Please contact Telemetry Team.",
      loading: "Saving...",
      success: newEntry
        ? "Timeline entry created successfully!"
        : "Timeline entry updated successfully!",
    };

    const result = newEntry
      ? await runPortalAction(() => createOurWorkEntry(payload), messages)
      : await runPortalAction(() => updateOurWorkEntry(payload), messages);
    setSaving(false);
    if (result.success) {
      togglePopup();
    } else if (
      result.error?.toLowerCase().includes("unique") ||
      result.error?.toLowerCase().includes("duplicate")
    ) {
      toast.error(
        newEntry
          ? "An entry for this month and year already exists. Please select a different date or edit the existing entry."
          : "An entry for this month and year already exists. Please select a different date.",
      );
    }
  };

  const handleSave = async () => {
    if (touched) {
      setSaving(true);

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const fileContent = e.target?.result;
          try {
            const response = await fetch("/api/uploadTimelinePic", {
              body: JSON.stringify({
                fileContent,
                fileName: imageFile.name,
                fileType: imageFile.type,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
            });
            const { publicUrl } = (await response.json()) as {
              publicUrl: string;
            };
            await saveEntry(publicUrl);
          } catch (error) {
            toast.error(
              "There was an error saving your changes. Please contact Telemetry Team.",
            );
            global.console.log(error);
            setSaving(false);
          }
        };

        const compressedFile = await compress(imageFile);
        reader.readAsDataURL(compressedFile);
      } else {
        await saveEntry();
      }
    } else {
      togglePopup();
    }
  };

  const handleFileUpload = (file: File) => {
    setTouched(true);
    if (file) {
      setImageFile(file);
      setNewRowData((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  };

  return (
    <div className={styles.popup} onClick={handleOverlayClick}>
      <div className={`${styles.popupContent} ${styles.popupEnter}`}>
        <CloseButton className={styles.closeButton} onClick={togglePopup} />
        <h2>{newEntry ? "New Timeline Entry" : "Edit Timeline Entry"}</h2>
        <div className={styles.popupLayout}>
          {newRowData && (
            <div className={styles.popupForm}>
              {Object.values(rowDataToRender).map((row) => (
                <div key={row.id}>
                  <label htmlFor={row.id}>{row.label}</label>
                  {row.id === "imageUrl" ? (
                    <div className={styles.profileImageContainer}>
                      <DropZone
                        currentImage={
                          imageFile
                            ? URL.createObjectURL(imageFile)
                            : row.value
                              ? String(row.value)
                              : ""
                        }
                        handleFileUpload={handleFileUpload}
                      />
                    </div>
                  ) : row.id === "description" ? (
                    <textarea
                      className={styles.textFieldInput}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                      rows={4}
                      style={{ resize: "vertical" }}
                      value={row.value ?? ""}
                    />
                  ) : row.id === "date" ? (
                    <input
                      className={styles.textFieldInput}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                      type="month"
                      value={dateValue.substring(0, 7)}
                    />
                  ) : (
                    <input
                      className={styles.textFieldInput}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                      type="text"
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

export default EditOurWorkEntryPopup;
