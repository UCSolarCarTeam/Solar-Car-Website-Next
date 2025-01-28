import Image from "next/image";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

import styles from "@/components/EditTeamCell/index.module.scss";
import CloseButton from "@/components/svgs/CloseButton";
import {
  AccountingTeam,
  CommunicationsTeam,
  ElectricalTeam,
  MechanicalTeam,
  MultiTeam,
  SoftwareTeam,
  SponsorshipTeam,
  UpperTeamRoles,
} from "@/types";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { type AllTeamRoles } from "@prisma/client";

interface EditTeamCellProps {
  currentRow: {
    description: string | null;
    id: number;
    clerkUserId: string;
    firstName: string | null;
    lastName: string | null;
    fieldOfStudy: string | null;
    teamRole: AllTeamRoles | null;
    schoolYear: string | null;
    yearJoined: string | null;
    profilePictureUrl: string | null;
  };
}

type EditTeamPopupProps = {
  togglePopup: () => void;
} & EditTeamCellProps;

const EditTeamPopup = ({ currentRow, togglePopup }: EditTeamPopupProps) => {
  const { user } = useUser();
  const utils = api.useUtils();
  const mutateUserContent = api.portal.updateDBUser.useMutation({
    onSuccess: async () => {
      await utils.portal.getDBUsers.invalidate();
      setSaving(false);
      togglePopup();
    },
  });
  const [touched, setTouched] = useState(false);
  const [newRowData, setNewRowData] = useState(currentRow);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const rowDataType = useMemo(() => {
    return {
      description: "string",
      fieldOfStudy: "string",
      firstName: "string",
      lastName: "string",
      phoneNumber: "string",
      schoolEmail: "string",
      schoolYear: "string",
      ucid: "number",
      yearJoined: "string",
    };
  }, []);

  const teamRoleOptions = useMemo(
    () => [
      {
        label: "Lead Roles",
        options: UpperTeamRoles,
      },
      {
        label: "Accounting",
        options: AccountingTeam,
      },
      {
        label: "Communications",
        options: CommunicationsTeam,
      },
      {
        label: "Sponsorship",
        options: SponsorshipTeam,
      },
      {
        label: "Software",
        options: SoftwareTeam,
      },
      {
        label: "Electrical",
        options: ElectricalTeam,
      },
      {
        label: "Mechanical",
        options: MechanicalTeam,
      },
      {
        label: "Multi-Team",
        options: MultiTeam,
      },
    ],
    [],
  );

  const rowDataToRender = useMemo(() => {
    return Object.entries(newRowData)
      .filter(
        ([key]) => !["id", "clerkUserId", "profilePictureUrl"].includes(key),
      )
      .reduce(
        (acc, [key, value]) => {
          acc[key] = {
            id: key,
            label:
              key === "ucid"
                ? "UCID"
                : key === "description"
                  ? "About Me"
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

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      togglePopup();
    }
  };

  const onInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
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
          const fileContent = e.target?.result; // Binary string or base64
          try {
            const response = await fetch("/api/uploadProfilePic", {
              body: JSON.stringify({
                fileContent, // Base64 or binary
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
            mutateUserContent.mutate({
              ...newRowData,
              profilePictureUrl: publicUrl,
            });
          } catch (error) {
            togglePopup();
          }
        };

        reader.readAsDataURL(imageFile);
      } else {
        mutateUserContent.mutate(newRowData);
      }
    } else {
      togglePopup();
    }
  }, [imageFile, newRowData, togglePopup, touched]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setTouched(true);
      if (file) {
        setImageFile(file);
        setNewRowData((prev) => ({
          ...prev,
          profilePictureUrl: URL.createObjectURL(file),
        }));
      }
    },
    [],
  );

  return (
    <div className={styles.popup} onClick={handleOverlayClick}>
      <div className={`${styles.popupContent} ${styles.popupEnter}`}>
        <CloseButton className={styles.closeButton} onClick={togglePopup} />
        <h2>Edit Team Member</h2>
        <div className={styles.popupLayout}>
          <div>
            Profile Picture
            <div className={styles.popupProfileImage}>
              <Image
                alt="profile image"
                fill
                src={
                  newRowData.profilePictureUrl ?? "/DefaultProfilePicture.png"
                }
                style={{ objectFit: "cover" }}
              />
            </div>
            <input accept="image/*" onChange={handleFileUpload} type="file" />
          </div>
          {newRowData && (
            <div className={styles.popupForm}>
              {Object.values(rowDataToRender).map((row) => (
                <div className={styles.textFieldContainer} key={row.id}>
                  <label className={styles.textFieldLabel} htmlFor={row.id}>
                    {row.label}
                  </label>
                  {row.id === "description" ? (
                    <textarea
                      className={styles.textFieldInput}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                      rows={5}
                      value={row.value ?? ""}
                    ></textarea>
                  ) : row.id === "teamRole" ? (
                    <select
                      className={styles.teamRoleSelect}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                    >
                      <option value="">Please select</option>
                      {user?.publicMetadata?.role === "admin" && (
                        <optgroup label="Lead Roles">
                          {Object.entries(UpperTeamRoles).map(
                            ([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            ),
                          )}
                        </optgroup>
                      )}
                      {teamRoleOptions.map(({ label, options }) => (
                        <optgroup key={label} label={label}>
                          {Object.entries(options).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  ) : (
                    <input
                      className={styles.textFieldInput}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                      type={rowDataType[row.id as keyof typeof rowDataType]}
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
              <button className={styles.button} onClick={togglePopup}>
                Cancel
              </button>
              <button className={styles.button} onClick={handleSave}>
                Save
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const EditTeamCell = ({ currentRow }: EditTeamCellProps) => {
  const { user } = useUser();
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

  if (
    user?.publicMetadata?.role === "admin" ||
    user?.publicMetadata?.role === "business" ||
    currentRow.clerkUserId === user?.id
  ) {
    return (
      <div className={styles.editTeamCell}>
        <span onClick={() => setPopupOpen((prev) => !prev)}>Edit</span>
        {popupOpen && (
          <EditTeamPopup currentRow={currentRow} togglePopup={togglePopup} />
        )}
      </div>
    );
  }

  return null;
};

export default memo(EditTeamCell);
