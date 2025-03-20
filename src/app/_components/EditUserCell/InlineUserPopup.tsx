import defaultProfilePicture from "public/assets/DefaultProfilePicture.png";
import { memo, useCallback, useMemo, useState } from "react";

import styles from "@/app/_components/EditUserCell/index.module.scss";
import { compress } from "@/app/_lib/compress";
import { UpperTeamRoles, teamRoleOptions, userRowMetadata } from "@/app/_types";
import { type RouterOutputs, trpc } from "@/trpc/react";
import { type UserResource } from "@clerk/types";

import BasicButton from "../Buttons/BasicButton";
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
  const [error, setError] = useState(false);

  const mutateUserContent = trpc.portal.updateDBUser.useMutation({
    onError: () => {
      setSaving(false);
      setError(true);
    },
    onSuccess: async () => {
      await utils.portal.getDBUsers.invalidate();
      setSaving(false);
      // togglePopup();
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
    if (id === "ucid") {
      setNewRowData((prev) => ({ ...prev, ucid: Number(value) }));
      return;
    }
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
            global.console.log(error);
          }
        };

        const compressedFile = await compress(imageFile);
        reader.readAsDataURL(compressedFile);
      } else {
        mutateUserContent.mutate(newRowData);
      }
    }
  }, [imageFile, newRowData, touched]);

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
                    value={row.value ?? ""}
                  >
                    <option value="">Please select</option>
                    {clerkUser?.publicMetadata?.role === "admin" && (
                      <optgroup key={"Lead Roles"} label="Lead Roles">
                        {Object.entries(UpperTeamRoles).map(([key, label]) => (
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
                    className={styles.textFieldInput}
                    id={row.id}
                    name={row.label}
                    onChange={onInputChange}
                    type={
                      userRowMetadata[row.id as keyof typeof userRowMetadata]
                    }
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
        ) : error ? (
          <div>
            <div>
              There was an error saving your changes. Please contact Telemetry
              team for assistance.
            </div>
          </div>
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
