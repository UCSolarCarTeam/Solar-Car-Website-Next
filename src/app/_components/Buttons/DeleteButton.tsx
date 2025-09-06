"use client";

import { useState } from "react";

import BasicButton from "@/app/_components/Buttons/BasicButton";
import ConfirmModal from "@/app/_components/Modals/ConfirmModal";

type DeleteButtonProps = {
  id: number;
  onDelete: (id: number) => void;
  label?: string;
};

const DeleteButton = ({ id, label, onDelete }: DeleteButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <BasicButton
        onClick={() => setShowConfirm(true)}
        style={{ backgroundColor: "#DC676C" }}
      >
        {"Delete"}
      </BasicButton>

      <ConfirmModal
        cancelText="Cancel"
        confirmText="Yes, delete"
        message={`Are you sure you want to delete this ${label?.toLowerCase()}?`}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          onDelete(id);
          setShowConfirm(false);
        }}
        open={showConfirm}
        title={`Delete ${label}`}
      />
    </>
  );
};

export default DeleteButton;
