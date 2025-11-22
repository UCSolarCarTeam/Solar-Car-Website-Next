import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import styles from "@/app/_components/PortalComponents/EditUserCell/index.module.scss";
import { compress } from "@/app/_lib/compress";
import {
  type UserFormData,
  type UserFormErrors,
  validateUserForm,
} from "@/app/_lib/userValidation";
import { teamRoleOptions, userRowMetadata } from "@/app/_types";
import { type RouterOutputs, trpc } from "@/trpc/react";
import { type UserResource } from "@clerk/types";

import BasicButton from "../../Buttons/BasicButton";
import DropZone from "../DropZone";

type User = RouterOutputs["portal"]["getCurrentDBUser"];

interface InlineUserPopupProps {
  user: NonNullable<User>;
  clerkUser: UserResource;
}

const InlineUserPopup = ({ clerkUser, user }: InlineUserPopupProps) => {
  const utils = trpc.useUtils();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);
  const [newRowData, setNewRowData] = useState(user);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<UserFormErrors>({});
  const MAX_DESCRIPTION_LENGTH = 250;

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
    },
  });

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
        ucid: value ? value.trim() : null,
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
        toast.error("Please fix the validation errors before saving.");
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
          }
        };

        const compressedFile = await compress(imageFile);
        reader.readAsDataURL(compressedFile);
      } else {
        mutateUserContent.mutate(newRowData);
      }
    }
  }, [imageFile, newRowData, touched, mutateUserContent]);

  if (!user) return null;

  return (
    <>
      <h2 style={{ textAlign: "center" }}>
        Welcome back, {clerkUser.firstName}
      </h2>
      <div className={styles.popupLayout}>
        <div className={styles.profileImageContainer}>
          <div>Profile Picture</div>
          <div className={styles.popupProfileImage}>
            <DropZone
              currentImage={
                imageFile
                  ? URL.createObjectURL(imageFile)
                  : (user.profilePictureUrl ?? defaultProfilePicture)
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
                    value={row.value ?? ""}
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
          <BasicButton
            onClick={handleSave}
            style={{ backgroundColor: "#53A551" }}
          >
            Save
          </BasicButton>
        )}
      </div>
    </>
  );
};

export default memo(InlineUserPopup);
