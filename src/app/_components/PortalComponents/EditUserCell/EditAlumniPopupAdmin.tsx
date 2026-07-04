import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import CloseButton from "@/app/_components/Buttons/CloseButton";
import styles from "@/app/_components/PortalComponents/EditUserCell/index.module.scss";
import { compress } from "@/app/_lib/compress";
import { formatDateOnly, parseDateOnly } from "@/app/_lib/utils";
import { trpc } from "@/trpc/react";
import { type User } from "@prisma/client";

import BasicButton from "../../Buttons/BasicButton";
import DropZone from "../DropZone";

type EditAlumniPopupAdminProps = {
  currentRow?: User;
  togglePopup: () => void;
};

const EditAlumniPopupAdmin = ({
  currentRow,
  togglePopup,
}: EditAlumniPopupAdminProps) => {
  const utils = trpc.useUtils();
  const updateDBUserMutation = trpc.portal.updateDBUser.useMutation({
    onError: () => {
      setSaving(false);
      toast.error(
        "There was an error saving your changes. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getAlumniList.invalidate(), {
        error: () => {
          setSaving(false);
          return "Failed to refresh alumni list";
        },
        loading: "Saving...",
        success: () => {
          setSaving(false);
          togglePopup();
          return "Alumni updated successfully!";
        },
      });
    },
  });

  const createAlumniMutation = trpc.portal.createAlumni.useMutation({
    onError: () => {
      setSaving(false);
      toast.error(
        "There was an error creating the alumni. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getAlumniList.invalidate(), {
        error: () => {
          setSaving(false);
          return "Failed to refresh alumni list";
        },
        loading: "Saving...",
        success: () => {
          setSaving(false);
          togglePopup();
          return "Alumni created successfully!";
        },
      });
    },
  });

  const [newRowData, setNewRowData] = useState<Partial<User>>(
    currentRow ?? {
      company: "",
      companyTitle: "",
      firstName: "",
      lastName: "",
      linkedIn: "",
      profilePictureUrl: null,
      teamRole: null,
      yearJoined: null,
      yearRetired: null,
    },
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const rowDataToRender = useMemo(() => {
    // Helper to format date to YYYY for display
    // Fields to display in the form
    const fields = [
      { id: "firstName", label: "First Name", value: newRowData.firstName },
      { id: "lastName", label: "Last Name", value: newRowData.lastName },
      { id: "company", label: "Company", value: newRowData.company },
      { id: "companyTitle", label: "Position", value: newRowData.companyTitle },
      {
        id: "yearJoined",
        label: "Date Joined",
        value: formatDateOnly(newRowData.yearJoined),
      },
      {
        id: "yearRetired",
        label: "Date Left",
        value: formatDateOnly(newRowData.yearRetired),
      },
      {
        id: "linkedIn",
        label: "LinkedIn",
        value: newRowData.linkedIn,
      },
    ];
    return fields;
  }, [newRowData]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        togglePopup();
      }
    },
    [togglePopup],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    // clear the field's validation errors
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });

    setNewRowData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = useCallback(async () => {
    // Simple validation
    const errors: Record<string, string> = {};
    if (!newRowData.firstName) errors.firstName = "First Name is required";
    if (!newRowData.lastName) errors.lastName = "Last Name is required";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error("Please fill in required fields.");
      return;
    }

    setSaving(true);

    const saveData = async (profileUrl?: string) => {
      // Convert year strings to dates
      if (currentRow) {
        // Update
        updateDBUserMutation.mutate({
          company: newRowData.company ?? null,
          companyTitle: newRowData.companyTitle ?? null,
          description: currentRow.description ?? null,
          fieldOfStudy: currentRow.fieldOfStudy ?? null,
          firstName: newRowData.firstName ?? "",
          id: currentRow.id,
          lastName: newRowData.lastName ?? "",
          linkedIn: newRowData.linkedIn ?? null,
          phoneNumber: currentRow.phoneNumber ?? null,
          profilePictureUrl: profileUrl ?? newRowData.profilePictureUrl ?? null,
          schoolEmail: currentRow.schoolEmail ?? null,
          schoolYear: currentRow.schoolYear ?? null,
          teamRole: newRowData.teamRole ?? null,
          ucid: currentRow.ucid,
          yearJoined: parseDateOnly(newRowData.yearJoined),
          yearRetired: parseDateOnly(newRowData.yearRetired),
        });
      } else {
        // Create
        const yearJoinedFormatted = formatDateOnly(newRowData.yearJoined);
        const yearRetiredFormatted = formatDateOnly(newRowData.yearRetired);

        if (!yearJoinedFormatted || !yearRetiredFormatted) {
          toast.error("Year Joined and Year Left are required.");
          setSaving(false);
          return;
        }

        createAlumniMutation.mutate({
          company: newRowData.company ?? null,
          companyTitle: newRowData.companyTitle ?? null,
          firstName: newRowData.firstName ?? "",
          lastName: newRowData.lastName ?? "",
          linkedIn: newRowData.linkedIn ?? null,
          profilePictureUrl: profileUrl ?? newRowData.profilePictureUrl ?? null,
          teamRole: newRowData.teamRole ?? null,
          yearJoined: yearJoinedFormatted,
          yearRetired: yearRetiredFormatted,
        });
      }
    };

    if (imageFile) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileContent = e.target?.result;

        if (!fileContent) {
          toast.error("Failed to read image file. Please try again.");
          setSaving(false);
          return;
        }

        try {
          const response = await fetch("/api/uploadProfilePic", {
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

          if (!response.ok) {
            let errorMessage = "Failed to upload image";
            const textBody = await response.text();
            if (textBody) {
              try {
                const errorBody = JSON.parse(textBody) as {
                  error?: string;
                  message?: string;
                };
                errorMessage = errorBody.error ?? errorBody.message ?? textBody;
              } catch {
                // if JSON parsing fails, use raw text
                errorMessage = textBody;
              }
            }
            toast.error(errorMessage);
            setSaving(false);
            return;
          }

          const { publicUrl } = (await response.json()) as {
            publicUrl: string;
          };
          await saveData(publicUrl);
        } catch {
          toast.error(
            "There was an error saving the image. Please contact Telemetry Team.",
          );
          setSaving(false);
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read image file. Please try again.");
        setSaving(false);
      };

      try {
        const compressedFile = await compress(imageFile);
        reader.readAsDataURL(compressedFile);
      } catch {
        toast.error("Failed to compress image. Please try a different file.");
        setSaving(false);
      }
    } else {
      await saveData();
    }
  }, [
    currentRow,
    imageFile,
    newRowData,
    updateDBUserMutation,
    createAlumniMutation,
  ]);

  const handleFileUpload = useCallback((file: File) => {
    if (file) {
      // Revoke previous blob URL to prevent memory leak
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
      const newBlobUrl = URL.createObjectURL(file);
      blobUrlRef.current = newBlobUrl;
      setImageFile(file);
      setNewRowData((prev) => ({
        ...prev,
        profilePictureUrl: newBlobUrl,
      }));
    }
  }, []);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const currentProfileImage =
    newRowData.profilePictureUrl ?? defaultProfilePicture;

  return (
    <div className={styles.popup} onClick={handleOverlayClick}>
      <div className={`${styles.popupContent} ${styles.popupEnter}`}>
        <CloseButton className={styles.closeButton} onClick={togglePopup} />
        <h2>{currentRow ? "Edit Alumni" : "Create Alumni"}</h2>
        <div className={styles.popupLayout}>
          <div className={styles.profileImageContainer}>
            <div>Profile Picture</div>
            <div className={styles.popupProfileImage}>
              <DropZone
                currentImage={currentProfileImage}
                handleFileUpload={handleFileUpload}
              />
            </div>
          </div>
          <div className={styles.popupForm}>
            {rowDataToRender.map((row) => (
              <div className={styles.textFieldContainer} key={row.id}>
                <label className={styles.textFieldLabel} htmlFor={row.id}>
                  {row.label}
                </label>
                <input
                  className={`${styles.textFieldInput} ${
                    validationErrors[row.id] ? styles.inputError : ""
                  }`}
                  id={row.id}
                  name={row.label}
                  onChange={onInputChange}
                  placeholder={row.label}
                  type={
                    row.id === "yearJoined" || row.id === "yearRetired"
                      ? "date"
                      : "text"
                  }
                  value={row.value ?? ""}
                />
                {validationErrors[row.id] && (
                  <span className={styles.errorMessage}>
                    {validationErrors[row.id]}
                  </span>
                )}
              </div>
            ))}
          </div>
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

export default memo(EditAlumniPopupAdmin);
