import type { UserResource } from "@clerk/nextjs/types";
import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "@/app/_components/PortalComponents/EditUserCell/index.module.scss";
import { compress } from "@/app/_lib/compress";
import {
  type UserFormData,
  type UserFormErrors,
  validateUserForm,
} from "@/app/_lib/userValidation";
import { formatDateOnly, parseDateOnly } from "@/app/_lib/utils";
import { teamRoleOptions, userRowMetadata } from "@/app/_types";
import { runPortalAction } from "@/app/portal/_lib/runAction";
import { updateDBUser } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/generated/prisma/browser";

import BasicButton from "../../Buttons/BasicButton";
import DropZone from "../DropZone";
import TeamRoleSelect from "./TeamRoleSelect";

interface InlineUserPopupProps {
  user: NonNullable<User>;
  clerkUser: UserResource;
}

const InlineUserPopup = ({ clerkUser, user }: InlineUserPopupProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);
  const [newRowData, setNewRowData] = useState(user);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<UserFormErrors>({});

  useEffect(() => {
    const previewUrl = newRowData.profilePictureUrl;
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [newRowData.profilePictureUrl]);

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

  const handleRemovePhoto = () => {
    setTouched(true);
    setImageFile(null);
    setNewRowData((prev) => ({ ...prev, profilePictureUrl: null }));
  };

  const onFieldChange = (id: string, value: string) => {
    setTouched(true);
    setValidationErrors((prev) => {
      const errors = { ...prev };
      delete errors[id as keyof UserFormData];
      return errors;
    });

    if (id === "ucid") {
      setNewRowData((prev) => ({
        ...prev,
        ucid: value ? value.trim() : null,
      }));
      return;
    }
    setNewRowData((prev) => ({ ...prev, [id]: value }));
  };

  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => onFieldChange(e.target.id, e.target.value);

  const saveUser = async (profilePictureUrl?: string) => {
    const result = await runPortalAction(
      () =>
        updateDBUser({
          ...newRowData,
          profilePictureUrl: profilePictureUrl ?? newRowData.profilePictureUrl,
          schoolEmail: newRowData.schoolEmail || null,
          teamRole: newRowData.teamRole || null,
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
    return result;
  };

  const handleSave = async () => {
    if (!touched) return;

    const errors = validateUserForm(newRowData);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the validation errors before saving.");
      return;
    }

    setSaving(true);

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
          await saveUser(publicUrl);
        } catch (error) {
          setSaving(false);
          toast.error(
            "There was an error saving your changes. Please contact Telemetry Team.",
          );
          global.console.log(error);
        }
      };

      const compressedFile = await compress(imageFile);
      reader.readAsDataURL(compressedFile);
    } else {
      await saveUser();
    }
  };

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
                newRowData.profilePictureUrl ?? defaultProfilePicture
              }
              handleFileUpload={handleFileUpload}
            />
          </div>
          {newRowData.profilePictureUrl && (
            <div className={styles.buttonContainer}>
              <Button
                disabled={saving}
                onClick={handleRemovePhoto}
                size="sm"
                type="button"
                variant="destructive"
              >
                Remove photo
              </Button>
            </div>
          )}
        </div>
        {newRowData && (
          <div className={styles.popupForm}>
            {Object.values(rowDataToRender).map((row) => (
              <div className={styles.textFieldContainer} key={row.id}>
                <label className={styles.textFieldLabel} htmlFor={row.id}>
                  {row.label}
                </label>
                {row.id === "description" ? (
                  <Textarea
                    aria-describedby={
                      validationErrors.description
                        ? `${row.id}-error`
                        : undefined
                    }
                    aria-invalid={!!validationErrors.description}
                    className={`${styles.textFieldInput} ${validationErrors.description ? styles.inputError : ""}`}
                    id={row.id}
                    name={row.label}
                    onChange={onInputChange}
                    rows={5}
                    value={row.value ?? ""}
                  />
                ) : row.id === "teamRole" ? (
                  <TeamRoleSelect
                    error={validationErrors.teamRole}
                    groups={teamRoleOptions}
                    id={row.id}
                    name={row.label}
                    onValueChange={(value) => onFieldChange(row.id, value)}
                    value={newRowData.teamRole}
                  />
                ) : (
                  <Input
                    aria-describedby={
                      validationErrors[row.id as keyof UserFormData]
                        ? `${row.id}-error`
                        : undefined
                    }
                    aria-invalid={
                      !!validationErrors[row.id as keyof UserFormData]
                    }
                    className={`${styles.textFieldInput} ${validationErrors[row.id as keyof UserFormData] ? styles.inputError : ""}`}
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
                  <span className={styles.errorMessage} id={`${row.id}-error`}>
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

export default InlineUserPopup;
