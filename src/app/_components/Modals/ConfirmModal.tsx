"use client";

import BasicButton from "@/app/_components/Buttons/BasicButton";

import styles from "./index.module.scss";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
};

const ConfirmModal = ({
  cancelText = "Cancel",
  confirmText = "Yes",
  message = "Are you sure?",
  onClose,
  onConfirm,
  open,
  title = "Confirm",
}: ConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalMessage}>{message}</p>
        <div className={styles.modalActions}>
          <BasicButton
            onClick={onConfirm}
            style={{ backgroundColor: "#DC676C" }}
          >
            {confirmText}
          </BasicButton>
          <BasicButton onClick={onClose}>{cancelText}</BasicButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
