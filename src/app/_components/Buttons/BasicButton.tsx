"use client";

import { type PropsWithChildren, useState } from "react";

import ConfirmModal from "@/app/_components/Modals/ConfirmModal";
import { cn } from "@/lib/utils";

export enum ButtonVariant {
  Default = "default",
  Delete = "delete",
}

const BasicButton = (
  props: PropsWithChildren<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      variant?: ButtonVariant;
      onConfirmDelete?: () => void;
    }
  >,
) => {
  const {
    children,
    className,
    onClick,
    onConfirmDelete,
    variant = ButtonVariant.Default,
    ...rest
  } = props;

  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === ButtonVariant.Delete) {
      setShowConfirm(true);
    } else {
      onClick?.(e);
    }
  };

  return (
    <>
      <button
        className={cn(
          "box-border h-11 cursor-pointer rounded-md border-0 px-6 text-center leading-[1.15] text-white shadow-[rgba(50,50,93,0.1)_0_0_0_1px_inset,rgba(50,50,93,0.1)_0_2px_5px_0,rgba(0,0,0,0.07)_0_1px_1px_0] transition-all duration-200 [transition:box-shadow_0.08s_ease-in]",
          variant === ButtonVariant.Delete ? "bg-[#dc676c]" : "bg-[#474747]",
          className,
        )}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </button>

      {variant === ButtonVariant.Delete && (
        <ConfirmModal
          cancelText="Cancel"
          confirmText="Yes, delete"
          message="Are you sure you want to delete this item?"
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            onConfirmDelete?.();
            setShowConfirm(false);
          }}
          open={showConfirm}
          title="Delete Item"
        />
      )}
    </>
  );
};

export default BasicButton;
