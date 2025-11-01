import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import CloseButton from "@/app/_components/Buttons/CloseButton";
import { type EditUserCellProps } from "@/app/_components/PortalComponents/EditUserCell";
import styles from "@/app/_components/PortalComponents/EditUserCell/index.module.scss";
import { compress } from "@/app/_lib/compress";
import {
  type UserFormData,
  type UserFormErrors,
  validateUserForm,
} from "@/app/_lib/userValidation";
import {
  LeadRoles,
  ManagerRoles,
  teamRoleOptions,
  userRowMetadata,
} from "@/app/_types";
import { trpc } from "@/trpc/react";

import BasicButton from "../../Buttons/BasicButton";
import DropZone from "../DropZone";

type EditUserPopupAdminProps = {
  togglePopup: () => void;
} & EditUserCellProps;

const EditUserPopupAdmin = ({
  currentRow,
  currentUser,
  togglePopup,
}: EditUserPopupAdminProps) => {
  const utils = trpc.useUtils();
  const mutateUserContent = trpc.portal.updateDBUser.useMutation({
    onError: () => {
      setSaving(false);
      toast.error(
        "There was an error saving your changes. Please contact Telemetry Team.",
      );
    },
    onSuccess: async () => {
      await toast.promise(utils.portal.getDBUsers.invalidate(), {
        loading: "Saving...",
        success: "Profile updated successfully!",
      });
      setSaving(false);
      togglePopup();
    },
  });
  const [touched, setTouched] = useState(false);
  const [newRowData, setNewRowData] = useState(currentRow);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<UserFormErrors>({});
  const MAX_DESCRIPTION_LENGTH = 250;

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

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        togglePopup();
      }
    },
    [togglePopup],
  );

  const onInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setTouched(true);

    // clear the field's validation errors
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id as keyof UserFormData];
      return newErrors;
    });

    if (id === "ucid") {
      setNewRowData((prev) => ({
        ...prev,
        ucid: value ? Number(value) : null,
      }));
      return;
    }
    // set a max length on description field
    if (id === "description") {
      const truncated = value.slice(0, MAX_DESCRIPTION_LENGTH);
      setNewRowData((prev) => ({ ...prev, [id]: truncated }));
      return;
    }
    setNewRowData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = useCallback(async () => {
    if (touched) {
      // validate the form's fields
      const errors = validateUserForm(newRowData as Partial<UserFormData>);

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        toast.error(
          "There are errors in the form. Please fix them and try again.",
        );
        return;
      }

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
            toast.error(
              "There was an error saving your changes. Please contact Telemetry Team.",
            );
            global.console.log(error);
            togglePopup();
          }
        };

        const compressedFile = await compress(imageFile);
        reader.readAsDataURL(compressedFile);
      } else {
        mutateUserContent.mutate(newRowData);
      }
    } else {
      togglePopup();
    }
  }, [imageFile, newRowData, togglePopup, touched, mutateUserContent]);

  const handleFileUpload = useCallback((file: File) => {
    setTouched(true);
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
        <h2>Edit Team Member</h2>
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
          {newRowData && (
            <div className={styles.popupForm}>
              {Object.values(rowDataToRender).map((row) => (
                <div className={styles.textFieldContainer} key={row.id}>
                  <label className={styles.textFieldLabel} htmlFor={row.id}>
                    {row.label}
                  </label>
                  {row.id === "description" ? (
                    <>
                      <textarea
                        className={`${styles.textFieldInput} ${
                          validationErrors[row.id as keyof UserFormData]
                            ? styles.inputError
                            : ""
                        }`}
                        id={row.id}
                        maxLength={MAX_DESCRIPTION_LENGTH}
                        name={row.label}
                        onChange={onInputChange}
                        rows={5}
                        value={row.value ?? ""}
                      />
                      <div className={styles.charCounter}>
                        <span>{(row.value as string)?.length ?? 0}</span>
                        <span>/</span>
                        <span>{MAX_DESCRIPTION_LENGTH}</span>
                      </div>
                    </>
                  ) : row.id === "teamRole" ? (
                    <select
                      className={`${styles.teamRoleSelect} ${
                        validationErrors[row.id as keyof UserFormData]
                          ? styles.inputError
                          : ""
                      }`}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                      value={row.value ?? ""}
                    >
                      <option value="">Please select</option>
                      {currentUser?.publicMetadata?.role === "admin" && (
                        <optgroup key={"Manager Roles"} label="Manager Roles">
                          {Object.entries(ManagerRoles).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {currentUser?.publicMetadata?.role === "admin" && (
                        <optgroup key={"Lead Roles"} label="Lead Roles">
                          {Object.entries(LeadRoles).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
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
                      className={`${styles.textFieldInput} ${
                        validationErrors[row.id as keyof UserFormData]
                          ? styles.inputError
                          : ""
                      }`}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                      type={
                        userRowMetadata[row.id as keyof typeof userRowMetadata]
                      }
                      value={row.value ?? undefined}
                    />
                  )}
                  {validationErrors[row.id as keyof UserFormData] && (
                    <span className={styles.errorMessage}>
                      {validationErrors[row.id as keyof UserFormData]}
                    </span>
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

export default memo(EditUserPopupAdmin);
