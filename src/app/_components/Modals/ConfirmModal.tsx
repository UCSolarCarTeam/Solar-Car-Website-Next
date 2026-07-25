"use client";

import BasicButton from "@/app/_components/Buttons/BasicButton";

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
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/50 p-3 max-md:p-2 max-[320px]:p-1">
      <div className="max-h-[calc(100dvh-24px)] w-full max-w-100 overflow-y-auto rounded-xl bg-white p-8 text-center text-black max-md:max-h-[calc(100dvh-16px)] max-md:max-w-[calc(100dvw-16px)] max-md:p-5 max-[320px]:max-h-[calc(100dvh-8px)] max-[320px]:max-w-[calc(100dvw-8px)] max-[320px]:p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2">{message}</p>
        <div className="mt-4 flex flex-wrap justify-around gap-3">
          <BasicButton className="bg-[#DC676C]" onClick={onConfirm}>
            {confirmText}
          </BasicButton>
          <BasicButton onClick={onClose}>{cancelText}</BasicButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
