"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { runPortalAction } from "@/app/portal/_lib/runAction";
import { moveUserToAlumni } from "@/app/portal/actions";

import { portal } from "@/lib/portal-classes";

type MoveToAlumniModalProps = {
  userId: number;
  userName: string;
  onClose: () => void;
};

const pad = (value: number) => value.toString().padStart(2, "0");

const getCurrentDateInputValue = () => {
  const today = new Date();
  return `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
};

export const MoveToAlumniModal = ({
  onClose,
  userId,
  userName,
}: MoveToAlumniModalProps) => {
  const currentDateInputValue = getCurrentDateInputValue();
  const [yearRetired, setYearRetired] = useState(currentDateInputValue);
  const [company, setCompany] = useState("");
  const [companyTitle, setCompanyTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleMove = () => {
    const retiredDate = new Date(`${yearRetired}T00:00:00`);
    if (Number.isNaN(retiredDate.getTime())) {
      toast.error("Please enter a valid date");
      return;
    }

    startTransition(() => {
      void runPortalAction(
        () =>
          moveUserToAlumni({
            company: company || null,
            companyTitle: companyTitle || null,
            id: userId,
            yearRetired: retiredDate,
          }),
        {
          error: "Failed to move user to alumni",
          loading: "Moving to alumni...",
          success: `${userName} moved to alumni`,
        },
      ).then((result) => {
        if (result.success) {
          onClose();
        }
      });
    });
  };

  return (
    <div className={portal.modalOverlay} onClick={onClose}>
      <div className={portal.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Move {userName} to Alumni</h2>
        <p>Enter the date they left the solar car team:</p>
        <input
          className={portal.yearInput}
          max={currentDateInputValue}
          onChange={(e) => setYearRetired(e.target.value)}
          type="date"
          value={yearRetired}
        />
        <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "1rem" }}>
          Optional: Add their company and job title
        </p>
        <input
          className={portal.yearInput}
          maxLength={100}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company (optional)"
          type="text"
          value={company}
        />
        <input
          className={portal.yearInput}
          maxLength={100}
          onChange={(e) => setCompanyTitle(e.target.value)}
          placeholder="Job Title (optional)"
          type="text"
          value={companyTitle}
        />
        <div className={portal.modalActions}>
          <button
            className={portal.cancelButton}
            disabled={isPending}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={portal.confirmButton}
            disabled={isPending}
            onClick={handleMove}
          >
            {isPending ? "Moving..." : "Move to Alumni"}
          </button>
        </div>
      </div>
    </div>
  );
};
