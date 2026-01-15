import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import CloseButton from "@/app/_components/Buttons/CloseButton";
import styles from "@/app/_components/PortalComponents/EditUserCell/index.module.scss";
import { compress } from "@/app/_lib/compress";
import { trpc } from "@/trpc/react";
import { type Alumni } from "@prisma/client";

import BasicButton from "../../Buttons/BasicButton";
import DropZone from "../DropZone";

type EditAlumniPopupAdminProps = {
  currentRow?: Alumni;
  togglePopup: () => void;
};

const EditAlumniPopupAdmin = ({
  currentRow,
  togglePopup,
}: EditAlumniPopupAdminProps) => {
  const utils = trpc.useUtils();
  const createAlumniMutation = trpc.portal.createAlumni.useMutation({
    onError: () => {
      setSaving(false);
      toast.error(
        "There was an error creating the alumni. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getAlumniList.invalidate(), {
        loading: "Creating...",
        success: "Alumni created successfully!",
      });
      setSaving(false);
      togglePopup();
    },
  });

  const updateAlumniMutation = trpc.portal.updateAlumni.useMutation({
    onError: () => {
      setSaving(false);
      toast.error(
        "There was an error saving your changes. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getAlumniList.invalidate(), {
        loading: "Saving...",
        success: "Alumni updated successfully!",
      });
      setSaving(false);
      togglePopup();
    },
  });

  const [newRowData, setNewRowData] = useState<Partial<Alumni>>(
    currentRow ?? {
      company: "",
      firstName: "",
      lastName: "",
      position: "",
      profilePictureUrl: null,
      teamRole: "",
      yearJoinedSolarCar: "",
      yearLeftSolarCar: "",
    },
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const rowDataToRender = useMemo(() => {
    // Fields to display in the form
    const fields = [
      { id: "firstName", label: "First Name", value: newRowData.firstName },
      { id: "lastName", label: "Last Name", value: newRowData.lastName },
      { id: "teamRole", label: "Team Role", value: newRowData.teamRole },
      { id: "company", label: "Company", value: newRowData.company },
      { id: "position", label: "Position", value: newRowData.position },
      {
        id: "yearJoinedSolarCar",
        label: "Year Joined",
        value: newRowData.yearJoinedSolarCar,
      },
      {
        id: "yearLeftSolarCar",
        label: "Year Left",
        value: newRowData.yearLeftSolarCar,
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

    // Prepare data directly
    const finalData = {
      ...newRowData,
      // Ensure required string fields are at least empty strings if undefined
      company: newRowData.company ?? null,
      firstName: newRowData.firstName ?? "",
      lastName: newRowData.lastName ?? "",
      position: newRowData.position ?? null,
      profilePictureUrl: newRowData.profilePictureUrl ?? null,
      teamRole: newRowData.teamRole ?? null,
      yearJoinedSolarCar: newRowData.yearJoinedSolarCar ?? null,
      yearLeftSolarCar: newRowData.yearLeftSolarCar ?? null,
    };

    const saveData = async (profileUrl?: string) => {
      const payload = {
        ...finalData,
        profilePictureUrl: profileUrl ?? finalData.profilePictureUrl,
      };

      if (currentRow) {
        // Update
        updateAlumniMutation.mutate({
          ...payload,
          id: currentRow.id,
        });
      } else {
        // Create
        createAlumniMutation.mutate(payload);
      }
    };

    if (imageFile) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileContent = e.target?.result;
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

      const compressedFile = await compress(imageFile);
      reader.readAsDataURL(compressedFile);
    } else {
      await saveData();
    }
  }, [
    currentRow,
    imageFile,
    newRowData,
    createAlumniMutation,
    updateAlumniMutation,
  ]);

  const handleFileUpload = useCallback((file: File) => {
    if (file) {
      setImageFile(file);
      setNewRowData((prev) => ({
        ...prev,
        profilePictureUrl: URL.createObjectURL(file),
      }));
    }
  }, []);

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
                currentImage={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : (newRowData.profilePictureUrl ?? defaultProfilePicture)
                }
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
                  type="text"
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
