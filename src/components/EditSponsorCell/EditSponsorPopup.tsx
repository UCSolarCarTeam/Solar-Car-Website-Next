import Image from "next/image";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo, useCallback, useMemo, useState } from "react";

import CloseButton from "@/components/Buttons/CloseButton";
import { type EditSponsorCellProps } from "@/components/EditSponsorCell";
import styles from "@/components/EditSponsorCell/index.module.scss";
import { api } from "@/utils/api";
import { SponsorLevel } from "@prisma/client";

import BasicButton from "../Buttons/BasicButton";

type EditSponsorPopupProps = {
  togglePopup: () => void;
} & EditSponsorCellProps;

const EditSponsorPopup = ({
  currentRow,
  newSponsor,
  togglePopup,
}: EditSponsorPopupProps) => {
  const utils = api.useUtils();
  const createSponsor = api.portal.createSponsor.useMutation({
    onSuccess: async () => {
      await utils.portal.getSponsorsList.invalidate();
      setSaving(false);
      togglePopup();
    },
  });
  const mutateSponsor = api.portal.updateSponsor.useMutation({
    onSuccess: async () => {
      await utils.portal.getSponsorsList.invalidate();
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
  const [newRowData, setNewRowData] = useState({
    ...currentRow,
    sponsorLevel: (newSponsor ? "" : currentRow.sponsorLevel) as SponsorLevel,
  });
  const [saving, setSaving] = useState(false);

  const rowDataToRender = useMemo(() => {
    return Object.entries(newRowData)
      .filter(([key]) => !["id"].includes(key))
      .reduce(
        (acc, [key, value]) => {
          acc[key] = {
            id: key,
            label:
              key === "logoUrl"
                ? "Logo"
                : key
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .replace(/^./, (match) => match.toUpperCase()),
            value: value,
          };
          return acc;
        },
        {} as Record<
          string,
          {
            id: string;
            label: string;
            value: string | number | null | undefined;
          }
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
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const fileContent = e.target?.result;
          try {
            const response = await fetch("/api/uploadSponsorPic", {
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
            if (newSponsor) {
              createSponsor.mutate({
                ...newRowData,
                logoUrl: publicUrl,
              });
            } else {
              mutateSponsor.mutate({
                ...newRowData,
                logoUrl: publicUrl,
              });
            }
          } catch (error) {
            togglePopup();
          }
        };

        reader.readAsDataURL(imageFile);
      } else {
        if (newSponsor) {
          createSponsor.mutate({
            ...newRowData,
          });
        } else {
          mutateSponsor.mutate({
            ...newRowData,
          });
        }
      }
    } else {
      togglePopup();
    }
  }, [
    createSponsor,
    imageFile,
    mutateSponsor,
    newRowData,
    newSponsor,
    togglePopup,
    touched,
  ]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setTouched(true);
      if (file) {
        setImageFile(file);
        setNewRowData((prev) => ({
          ...prev,
          logoUrl: URL.createObjectURL(file),
        }));
      }
    },
    [],
  );

  return (
    <div className={styles.popup} onClick={handleOverlayClick}>
      <div className={`${styles.popupContent} ${styles.popupEnter}`}>
        <CloseButton className={styles.closeButton} onClick={togglePopup} />
        <h2>{newSponsor ? "New Sponsor" : "Edit Sponsor"}</h2>
        <div className={styles.popupLayout}>
          {newRowData && (
            <div className={styles.popupForm}>
              {Object.values(rowDataToRender).map((row) => (
                <div key={row.id}>
                  <label htmlFor={row.id}>{row.label}</label>
                  {row.id === "logoUrl" ? (
                    <div className={styles.profileImageContainer}>
                      <div className={styles.popupProfileImage}>
                        <Image
                          alt="profile image"
                          fill
                          src={
                            row.value
                              ? (row.value as string)
                              : defaultProfilePicture
                          }
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <input
                        accept="image/*"
                        onChange={handleFileUpload}
                        type="file"
                      />
                    </div>
                  ) : row.id === "sponsorLevel" ? (
                    <select
                      className={styles.sponsorSelect}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                      required
                      value={row.value ?? ""}
                    >
                      <option value="">Please select</option>
                      {Object.entries(SponsorLevel).map(([key, label]) => (
                        <option key={key} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className={styles.textFieldInput}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                      type="string"
                      value={row.value ?? undefined}
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

export default memo(EditSponsorPopup);
