"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { trpc } from "@/trpc/react";

import styles from "./index.module.scss";

type MoveToAlumniModalProps = {
  userId: number;
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
};

export const MoveToAlumniModal = ({
  onClose,
  onSuccess,
  userId,
  userName,
}: MoveToAlumniModalProps) => {
  const utils = trpc.useUtils();
  const today = new Date();
  const pad = (value: number) => value.toString().padStart(2, "0");
  const currentDateInputValue = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const [yearRetired, setYearRetired] = useState(currentDateInputValue);
  const [company, setCompany] = useState("");
  const [companyTitle, setCompanyTitle] = useState("");
  const moveToAlumniMutation = trpc.portal.moveUserToAlumni.useMutation();

  const handleMove = async () => {
    const retiredDate = new Date(`${yearRetired}T00:00:00`);
    if (Number.isNaN(retiredDate.getTime())) {
      toast.error("Please enter a valid date");
      return;
    }

    try {
      await moveToAlumniMutation.mutateAsync({
        company: company || null,
        companyTitle: companyTitle || null,
        id: userId,
        yearRetired,
      });

      await toast.promise(
        Promise.all([
          utils.portal.getDBUsers.invalidate(),
          utils.portal.getAlumniList.invalidate(),
        ]),
        {
          loading: "Refreshing tables...",
          success: `${userName} moved to alumni`,
        },
      );
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to move user to alumni");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Move {userName} to Alumni</h2>
        <p>Enter the date they left the solar car team:</p>
        <input
          className={styles.yearInput}
          max={currentDateInputValue}
          onChange={(e) => setYearRetired(e.target.value)}
          type="date"
          value={yearRetired}
        />
        <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "1rem" }}>
          Optional: Add their company and job title
        </p>
        <input
          className={styles.yearInput}
          maxLength={100}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company (optional)"
          type="text"
          value={company}
        />
        <input
          className={styles.yearInput}
          maxLength={100}
          onChange={(e) => setCompanyTitle(e.target.value)}
          placeholder="Job Title (optional)"
          type="text"
          value={companyTitle}
        />
        <div className={styles.modalActions}>
          <button
            className={styles.cancelButton}
            disabled={moveToAlumniMutation.isPending}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={styles.confirmButton}
            disabled={moveToAlumniMutation.isPending}
            onClick={handleMove}
          >
            {moveToAlumniMutation.isPending ? "Moving..." : "Move to Alumni"}
          </button>
        </div>
      </div>
    </div>
  );
};
