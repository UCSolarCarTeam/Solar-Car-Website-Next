import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { useState } from "react";
import toast from "react-hot-toast";

import CloseButton from "@/app/_components/Buttons/CloseButton";
import type { EditUserCellProps } from "@/app/_components/PortalComponents/EditUserCell";
import { portal } from "@/lib/portal-classes";
import { useUploadProfilePic } from "@/app/_hooks/useUploadProfilePic";
import {
  type UserFormData,
  type UserFormErrors,
  validateUserForm,
} from "@/app/_lib/userValidation";
import { formatDateOnly, parseDateOnly } from "@/app/_lib/utils";
import {
  LeadRoles,
  ManagerRoles,
  teamRoleOptions,
  userRowMetadata,
} from "@/app/_types";
import { runPortalAction } from "@/app/portal/_lib/runAction";
import { updateDBUser } from "@/app/portal/actions";

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
  const uploadProfilePicMutation = useUploadProfilePic();
  const [touched, setTouched] = useState(false);
  const [newRowData, setNewRowData] = useState(currentRow);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<UserFormErrors>({});
  const [saving, setSaving] = useState(false);
  const MAX_DESCRIPTION_LENGTH = 250;

  const rowDataToRender = Object.entries(newRowData)
    .filter(
      ([key]) => !["id", "clerkUserId", "profilePictureUrl"].includes(key),
    )
    .reduce(
      (acc, [key, value]) => {
        let displayValue: string | number | null | undefined;
        if (userRowMetadata[key as keyof typeof userRowMetadata] === "date") {
          displayValue = formatDateOnly(
            value as Date | string | null | undefined,
          );
        } else {
          displayValue = value as string | number | null | undefined;
        }

        acc[key] = {
          id: key,
          label:
            key === "ucid"
              ? "UCID"
              : key === "linkedIn"
                ? "LinkedIn"
                : key === "description"
                  ? "About Me"
                  : key
                      .replace(/([a-z])([A-Z])/g, "$1 $2")
                      .replace(/^./, (match) => match.toUpperCase()),

          value: displayValue,
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

    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[id as keyof UserFormData];
      return newErrors;
    });

    if (id === "ucid") {
      setNewRowData((prev) => ({
        ...prev,
        ucid: value ? value.trim() : null,
      }));
      return;
    }
    if (id === "description") {
      const truncated = value.slice(0, MAX_DESCRIPTION_LENGTH);
      setNewRowData((prev) => ({ ...prev, [id]: truncated }));
      return;
    }
    setNewRowData((prev) => ({ ...prev, [id]: value }));
  };

  const saveUser = async (profilePictureUrl?: string) => {
    setSaving(true);
    const result = await runPortalAction(
      () =>
        updateDBUser({
          ...newRowData,
          profilePictureUrl: profilePictureUrl ?? newRowData.profilePictureUrl,
          yearJoined: parseDateOnly(newRowData.yearJoined),
          yearRetired: parseDateOnly(newRowData.yearRetired),
        }),
      {
        error:
          "There was an error saving your changes. Please contact Telemetry Team.",
        loading: "Saving...",
        success: "Profile updated successfully!",
      },
    );
    setSaving(false);
    if (result.success) {
      togglePopup();
    }
  };

  const handleSave = async () => {
    if (!touched) {
      togglePopup();
      return;
    }
    const sanitizedData = Object.fromEntries(
      Object.entries(newRowData).map(([key, value]) => [
        key,
        userRowMetadata[key as keyof typeof userRowMetadata] === "date"
          ? formatDateOnly(value as Date | string | null | undefined)
          : value == null
            ? ""
            : String(value),
      ]),
    ) as Partial<UserFormData>;
    const errors = validateUserForm(sanitizedData);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error(
        "There are errors in the form. Please fix them and try again.",
      );
      return;
    }

    if (imageFile) {
      uploadProfilePicMutation.mutate(
        { file: imageFile, fileName: imageFile.name },
        {
          onSuccess: (profilePictureUrl) => {
            void saveUser(profilePictureUrl);
          },
        },
      );
    } else {
      await saveUser();
    }
  };

  const handleFileUpload = (file: File) => {
    setTouched(true);
    if (file) {
      setImageFile(file);
      setNewRowData((prev) => ({
        ...prev,
        profilePictureUrl: URL.createObjectURL(file),
      }));
    }
  };

  const currentProfileImage = imageFile
    ? URL.createObjectURL(imageFile)
    : (newRowData.profilePictureUrl ?? defaultProfilePicture);

  const isPending = uploadProfilePicMutation.isPending || saving;

  return (
    <div className={portal.popup} onClick={handleOverlayClick}>
      <div className={`${portal.popupContentUser} ${portal.popupEnter}`}>
        <CloseButton className={portal.closeButton} onClick={togglePopup} />
        <h2>Edit Team Member</h2>
        <div className={portal.popupLayout}>
          <div className={portal.profileImageContainer}>
            <div>Profile Picture</div>
            <div className={portal.popupProfileImage}>
              <DropZone
                currentImage={currentProfileImage}
                handleFileUpload={handleFileUpload}
              />
            </div>
          </div>
          {newRowData && (
            <div className={portal.popupFormGrid2}>
              {Object.values(rowDataToRender).map((row) => (
                <div className={portal.textFieldContainer} key={row.id}>
                  <label className={portal.textFieldLabel} htmlFor={row.id}>
                    {row.label}
                  </label>
                  {row.id === "description" ? (
                    <>
                      <textarea
                        className={`${portal.textFieldInput} ${
                          validationErrors[row.id as keyof UserFormData]
                            ? portal.inputError
                            : ""
                        }`}
                        id={row.id}
                        maxLength={MAX_DESCRIPTION_LENGTH}
                        name={row.label}
                        onChange={onInputChange}
                        rows={5}
                        value={row.value ?? ""}
                      />
                      <div className={portal.charCounter}>
                        <span>{(row.value as string)?.length ?? 0}</span>
                        <span>/</span>
                        <span>{MAX_DESCRIPTION_LENGTH}</span>
                      </div>
                    </>
                  ) : row.id === "teamRole" ? (
                    <select
                      className={`${portal.teamRoleSelect} ${
                        validationErrors[row.id as keyof UserFormData]
                          ? portal.inputError
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
                      className={`${portal.textFieldInput} ${
                        validationErrors[row.id as keyof UserFormData]
                          ? portal.inputError
                          : ""
                      }`}
                      id={row.id}
                      name={row.label}
                      onChange={onInputChange}
                      type={
                        userRowMetadata[row.id as keyof typeof userRowMetadata]
                      }
                      value={row.value ?? ""}
                    />
                  )}
                  {validationErrors[row.id as keyof UserFormData] && (
                    <span className={portal.errorMessage}>
                      {validationErrors[row.id as keyof UserFormData]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={portal.buttonContainer}>
          {isPending ? (
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

export default EditUserPopupAdmin;
