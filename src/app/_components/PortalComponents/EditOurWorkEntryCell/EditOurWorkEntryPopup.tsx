import { memo, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import CloseButton from "@/app/_components/Buttons/CloseButton";
import { type EditOurWorkEntryCellProps } from "@/app/_components/PortalComponents/EditOurWorkEntryCell";
import styles from "@/app/_components/PortalComponents/EditSponsorCell/index.module.scss";
import { compress } from "@/app/_lib/compress";
import { trpc } from "@/trpc/react";

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
  const utils = trpc.useUtils();
  const createOurWorkEntry = trpc.portal.createOurWorkEntry.useMutation({
    onError: (error) => {
      const errorMessage = error.message.toLowerCase();
      if (
        errorMessage.includes("unique") ||
        errorMessage.includes("duplicate")
      ) {
        toast.error(
          "An entry for this month and year already exists. Please select a different date or edit the existing entry.",
        );
      } else {
        toast.error(
          "There was an error saving your changes. Please contact Telemetry Team.",
        );
      }
      setSaving(false);
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getOurWorkList.invalidate(), {
        loading: "Saving...",
        success: "Timeline entry created successfully!",
      });
      setSaving(false);
      togglePopup();
    },
  });
  const mutateOurWorkEntry = trpc.portal.updateOurWorkEntry.useMutation({
    onError: (error) => {
      const errorMessage = error.message.toLowerCase();
      if (
        errorMessage.includes("unique") ||
        errorMessage.includes("duplicate")
      ) {
        toast.error(
          "An entry for this month and year already exists. Please select a different date.",
        );
      } else {
        toast.error(
          "There was an error saving your changes. Please contact Telemetry Team.",
        );
      }
      setSaving(false);
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getOurWorkList.invalidate(), {
        loading: "Saving...",
        success: "Timeline entry updated successfully!",
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

  const rowDataToRender = useMemo(() => {
    return {
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
  }, [newRowData, dateValue]);

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

  const handleSave = useCallback(async () => {
    if (touched) {
      setSaving(true);

      // Extract year, monthNum, monthName from date input
      const date = new Date(dateValue);
      const year = date.getFullYear();
      const monthNum = date.getMonth() + 1;
      const monthName = date.toLocaleString("en-US", { month: "long" });

      const payload = {
        ...newRowData,
        monthName,
        monthNum,
        year,
      };

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
            if (newEntry) {
              createOurWorkEntry.mutate({
                ...payload,
                imageUrl: publicUrl,
              });
            } else {
              mutateOurWorkEntry.mutate({
                ...payload,
                imageUrl: publicUrl,
              });
            }
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
        if (newEntry) {
          createOurWorkEntry.mutate(payload);
        } else {
          mutateOurWorkEntry.mutate(payload);
        }
      }
    } else {
      togglePopup();
    }
  }, [
    createOurWorkEntry,
    imageFile,
    mutateOurWorkEntry,
    newRowData,
    newEntry,
    togglePopup,
    touched,
    dateValue,
  ]);

  const handleFileUpload = useCallback((file: File) => {
    setTouched(true);
    if (file) {
      setImageFile(file);
      setNewRowData((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file),
      }));
    }
  }, []);

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

export default memo(EditOurWorkEntryPopup);
